from __future__ import annotations

import json
from typing import Any

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from sqlalchemy.orm import Session

from .. import models
from ..config import get_settings
from .rag import search_kb
from .ticket_service import get_ticket_with_relations

settings = get_settings()


def _build_prompt(ticket: models.Ticket, kb_articles: list[models.KBArticle]) -> str:
    kb_snippets = "\n\n".join(
        [
            f"Title: {article.title}\nTags: {article.tags}\nBody: {article.body}"
            for article in kb_articles
        ]
    )
    customer_section = "No customer data"
    if ticket.customer:
        customer = ticket.customer
        customer_section = (
            f"Customer Name: {customer.name}\n"
            f"Segment: {customer.segment}\n"
            f"Region: {customer.region}\n"
            f"Risk Score: {customer.risk_score}"
        )

    return (
        "You are an AI support copilot helping classify and draft replies for support tickets. "
        "Carefully review the ticket details, related customer context, and the most relevant knowledge base articles. "
        "Respond ONLY with valid JSON matching this schema: {\"summary\": str, \"category\": str, \"priority\": str, \"suggested_reply\": str, \"suggested_actions\": [str]}. "
        "If you are unsure, make the best reasonable guess."
        f"\n\nTicket Title: {ticket.title}\nTicket Description: {ticket.description}\n"
        f"Current Status: {ticket.status}\nPriority: {ticket.priority}\nCategory: {ticket.category}\n"
        f"\nCustomer Info:\n{customer_section}\n"
        f"\nRelevant Knowledge Articles:\n{kb_snippets if kb_snippets else 'None'}"
    )


def _call_llm(prompt: str) -> dict[str, Any] | None:
    """Call the configured LLM provider (OpenAI or Gemini)"""
    
    # Check if AI is disabled
    if settings.ai_provider == "none" or not settings.ai_provider:
        return None
    
    # Initialize LLM based on provider
    if settings.ai_provider == "gemini":
        if not settings.gemini_api_key:
            return None
        llm = ChatGoogleGenerativeAI(
            model=settings.gemini_model,
            google_api_key=settings.gemini_api_key,
            temperature=0.1,
        )
    elif settings.ai_provider == "openai":
        if not settings.openai_api_key:
            return None
        llm = ChatOpenAI(
            model=settings.llm_model,
            openai_api_key=settings.openai_api_key,
            temperature=0.1,
        )
    else:
        # Unsupported provider
        return None

    # Invoke the LLM
    response = llm.invoke([
        SystemMessage(content="You are a helpful AI copilot for support and incident response."),
        HumanMessage(content=prompt),
    ])
    
    try:
        return json.loads(response.content)
    except (json.JSONDecodeError, TypeError):
        return None


def _fallback_response(ticket: models.Ticket, kb_articles: list[models.KBArticle]) -> dict[str, Any]:
    suggested_reply = (
        f"Hi there, thanks for reporting '{ticket.title}'. We are reviewing the issue and will "
        "follow up with next steps shortly."
    )
    actions = ["review_ticket_details", "follow_up_with_customer"]
    if kb_articles:
        actions.insert(0, "consult_kb_article")
    return {
        "summary": ticket.description[:200],
        "category": ticket.category,
        "priority": ticket.priority,
        "suggested_reply": suggested_reply,
        "suggested_actions": actions,
    }


def assist_ticket(ticket_id: int, db: Session) -> dict[str, Any]:
    ticket = get_ticket_with_relations(db, ticket_id)
    if not ticket:
        raise ValueError("Ticket not found")

    # Check if there's already a recent AI suggestion (within last 5 minutes)
    from datetime import datetime, timedelta
    five_minutes_ago = datetime.utcnow() - timedelta(minutes=5)
    
    existing_suggestion = db.query(models.TicketAction).filter(
        models.TicketAction.ticket_id == ticket.id,
        models.TicketAction.actor_type == "AI",
        models.TicketAction.action_type == "reply_suggested",
        models.TicketAction.created_at >= five_minutes_ago
    ).order_by(models.TicketAction.created_at.desc()).first()
    
    # If there's a recent suggestion, return it instead of creating a new one
    if existing_suggestion:
        try:
            return json.loads(existing_suggestion.content)
        except (json.JSONDecodeError, TypeError):
            pass  # If parsing fails, generate a new one

    kb_articles = search_kb(db, f"{ticket.title}\n{ticket.description}")
    prompt = _build_prompt(ticket, kb_articles)
    result = _call_llm(prompt)
    if not result:
        result = _fallback_response(ticket, kb_articles)

    action = models.TicketAction(
        ticket_id=ticket.id,
        actor_type="AI",
        action_type="reply_suggested",
        content=json.dumps(result),
    )
    db.add(action)
    db.commit()
    db.refresh(action)
    return result



def generate_playbook(ticket_id: int, db: Session) -> dict[str, Any]:
    """Generate an AI incident playbook for a ticket."""
    ticket = get_ticket_with_relations(db, ticket_id)
    if not ticket:
        raise ValueError("Ticket not found")
    
    # Get relevant KB articles if RAG is enabled
    kb_articles = []
    if settings.rag_enabled:
        kb_articles = search_kb(db, f"{ticket.title}\n{ticket.description}")
    
    # Build playbook prompt
    kb_context = ""
    if kb_articles:
        kb_context = "\n\nRelevant Knowledge Base Articles:\n" + "\n".join([
            f"- {article.title}: {article.body[:200]}..."
            for article in kb_articles[:3]
        ])
    
    prompt = (
        "You are an AI incident response expert. Generate a structured incident playbook for this ticket. "
        "Respond ONLY with valid JSON matching this schema: "
        "{\"title\": str, \"steps\": [{\"title\": str, \"description\": str, \"order\": int}], "
        "\"prerequisites\": [str], \"rollback_steps\": [str]}. "
        f"\n\nTicket: {ticket.title}\nDescription: {ticket.description}\n"
        f"Priority: {ticket.priority}\nCategory: {ticket.category}"
        f"{kb_context}"
    )
    
    result = _call_llm(prompt)
    
    if not result:
        # Fallback playbook
        result = {
            "title": f"Incident Response: {ticket.title}",
            "steps": [
                {"title": "Assess Impact", "description": "Evaluate the scope and severity of the incident", "order": 1},
                {"title": "Contain Issue", "description": "Implement immediate containment measures", "order": 2},
                {"title": "Investigate Root Cause", "description": "Identify the underlying cause of the incident", "order": 3},
                {"title": "Implement Fix", "description": "Apply the permanent solution", "order": 4},
                {"title": "Verify Resolution", "description": "Confirm the issue is fully resolved", "order": 5},
                {"title": "Document Findings", "description": "Record all actions and learnings", "order": 6}
            ],
            "prerequisites": [
                "Access to relevant systems",
                "Backup of current state",
                "Stakeholder notification"
            ],
            "rollback_steps": [
                "Revert to previous configuration",
                "Restore from backup if needed",
                "Notify affected parties"
            ]
        }
    
    return result
