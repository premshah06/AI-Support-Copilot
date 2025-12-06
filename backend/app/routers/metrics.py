"""
Metrics and analytics endpoints.
"""
from datetime import datetime, timedelta
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_active_user
from ..deps import get_db

router = APIRouter()


@router.get("/metrics/overview", response_model=schemas.MetricsOverview)
def get_metrics_overview(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Get comprehensive metrics overview.
    """
    # Total tickets
    total_tickets = db.query(func.count(models.Ticket.id)).scalar()
    
    # Tickets by status
    open_tickets = db.query(func.count(models.Ticket.id)).filter(models.Ticket.status == "open").scalar()
    in_progress_tickets = db.query(func.count(models.Ticket.id)).filter(models.Ticket.status == "in_progress").scalar()
    resolved_tickets = db.query(func.count(models.Ticket.id)).filter(models.Ticket.status == "resolved").scalar()
    closed_tickets = db.query(func.count(models.Ticket.id)).filter(models.Ticket.status == "closed").scalar()
    
    # AI usage stats
    ai_usage_count = db.query(func.count(models.TicketAction.id)).filter(
        models.TicketAction.action_type.in_(["reply_suggested", "ai_assist"])
    ).scalar()
    
    # AI feedback stats
    ai_feedback_helpful = db.query(func.count(models.AIFeedback.id)).filter(
        models.AIFeedback.rating == "helpful"
    ).scalar()
    ai_feedback_not_helpful = db.query(func.count(models.AIFeedback.id)).filter(
        models.AIFeedback.rating == "not_helpful"
    ).scalar()
    
    # Calculate average response and resolution times (simplified)
    # In production, you'd track these with specific timestamps
    avg_first_response_time = 2.5  # hours (placeholder)
    avg_resolution_time = 24.0  # hours (placeholder)
    
    # Ticket volume by date (last N days)
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    ticket_volume_query = db.query(
        func.date(models.Ticket.created_at).label('date'),
        func.count(models.Ticket.id).label('count')
    ).filter(
        models.Ticket.created_at >= cutoff_date
    ).group_by(
        func.date(models.Ticket.created_at)
    ).order_by('date').all()
    
    ticket_volume_by_date = [
        {"date": str(row.date), "count": row.count}
        for row in ticket_volume_query
    ]
    
    # Tickets by status (for charts)
    tickets_by_status = {
        "open": open_tickets or 0,
        "in_progress": in_progress_tickets or 0,
        "resolved": resolved_tickets or 0,
        "closed": closed_tickets or 0
    }
    
    # Tickets by priority
    priority_query = db.query(
        models.Ticket.priority,
        func.count(models.Ticket.id).label('count')
    ).group_by(models.Ticket.priority).all()
    
    tickets_by_priority = {row.priority: row.count for row in priority_query}
    
    # Tickets by category
    category_query = db.query(
        models.Ticket.category,
        func.count(models.Ticket.id).label('count')
    ).group_by(models.Ticket.category).all()
    
    tickets_by_category = {row.category: row.count for row in category_query}
    
    return schemas.MetricsOverview(
        total_tickets=total_tickets or 0,
        open_tickets=open_tickets or 0,
        in_progress_tickets=in_progress_tickets or 0,
        resolved_tickets=resolved_tickets or 0,
        closed_tickets=closed_tickets or 0,
        avg_first_response_time=avg_first_response_time,
        avg_resolution_time=avg_resolution_time,
        ai_usage_count=ai_usage_count or 0,
        ai_feedback_helpful=ai_feedback_helpful or 0,
        ai_feedback_not_helpful=ai_feedback_not_helpful or 0,
        ticket_volume_by_date=ticket_volume_by_date,
        tickets_by_status=tickets_by_status,
        tickets_by_priority=tickets_by_priority,
        tickets_by_category=tickets_by_category
    )
