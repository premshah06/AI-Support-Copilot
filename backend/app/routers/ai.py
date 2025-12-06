from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_active_user, require_agent_or_admin
from ..deps import get_db
from ..services.ai_agent import assist_ticket, generate_playbook

router = APIRouter()


@router.post("/tickets/{ticket_id}/ai-assist", response_model=schemas.AISuggestion)
def ai_assist(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
) -> schemas.AISuggestion:
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    suggestion = assist_ticket(ticket_id, db)
    return schemas.AISuggestion(**suggestion)


@router.post("/tickets/{ticket_id}/reply", response_model=schemas.TicketActionRead)
def send_reply(
    ticket_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_agent_or_admin)
) -> schemas.TicketActionRead:
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    reply_text = payload.get("reply_text")
    status_update = payload.get("status_update")
    if not reply_text:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="reply_text is required")

    action = models.TicketAction(
        ticket_id=ticket_id,
        actor_type="human",
        action_type="reply_sent",
        content=reply_text,
    )
    db.add(action)

    if status_update:
        ticket.status = status_update
        db.add(ticket)

    db.commit()
    db.refresh(action)
    return action



@router.post("/tickets/{ticket_id}/ai-playbook", response_model=schemas.AIPlaybook)
def get_ai_playbook(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
) -> schemas.AIPlaybook:
    """Generate an AI incident playbook for a ticket."""
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    
    playbook = generate_playbook(ticket_id, db)
    
    # Log action
    action = models.TicketAction(
        ticket_id=ticket_id,
        actor_type="ai",
        action_type="playbook_generated",
        content="AI playbook generated"
    )
    db.add(action)
    db.commit()
    
    return schemas.AIPlaybook(**playbook)


@router.post("/tickets/{ticket_id}/ai-feedback", response_model=schemas.AIFeedbackRead, status_code=status.HTTP_201_CREATED)
def submit_ai_feedback(
    ticket_id: int,
    feedback_in: schemas.AIFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
) -> schemas.AIFeedbackRead:
    """Submit feedback on AI suggestions."""
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    
    feedback = models.AIFeedback(
        ticket_id=ticket_id,
        suggestion_type=feedback_in.suggestion_type,
        rating=feedback_in.rating,
        comment=feedback_in.comment
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    
    return feedback
