from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from .. import models, schemas
from ..auth import get_current_active_user, require_agent_or_admin
from ..deps import get_db

router = APIRouter()


@router.get("/tickets", response_model=List[schemas.TicketRead])
def list_tickets(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    assigned_to: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
) -> List[schemas.TicketRead]:
    query = db.query(models.Ticket).options(
        joinedload(models.Ticket.customer),
        joinedload(models.Ticket.actions),
    )

    if status_filter:
        query = query.filter(models.Ticket.status == status_filter)
    if priority:
        query = query.filter(models.Ticket.priority == priority)
    if category:
        query = query.filter(models.Ticket.category == category)
    if assigned_to:
        query = query.filter(models.Ticket.assigned_to == assigned_to)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (models.Ticket.title.ilike(search_term)) |
            (models.Ticket.description.ilike(search_term))
        )

    return query.order_by(models.Ticket.created_at.desc()).all()


@router.get("/tickets/{ticket_id}", response_model=schemas.TicketRead)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
) -> schemas.TicketRead:
    ticket = (
        db.query(models.Ticket)
        .options(
            joinedload(models.Ticket.customer),
            joinedload(models.Ticket.actions),
        )
        .filter(models.Ticket.id == ticket_id)
        .first()
    )
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    return ticket


@router.post("/tickets", response_model=schemas.TicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket_in: schemas.TicketCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_agent_or_admin)
) -> schemas.TicketRead:
    ticket = models.Ticket(**ticket_in.dict())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.patch("/tickets/{ticket_id}", response_model=schemas.TicketRead)
def update_ticket(
    ticket_id: int,
    ticket_update: schemas.TicketUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_agent_or_admin)
) -> schemas.TicketRead:
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    for field, value in ticket_update.dict(exclude_unset=True).items():
        setattr(ticket, field, value)

    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket



@router.put("/tickets/{ticket_id}/assign", response_model=schemas.TicketRead)
def assign_ticket(
    ticket_id: int,
    assignment: schemas.TicketAssignment,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_agent_or_admin)
) -> schemas.TicketRead:
    """Assign a ticket to a user."""
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    
    # Verify assignee exists if provided
    if assignment.assigned_to:
        assignee = db.query(models.User).filter(models.User.id == assignment.assigned_to).first()
        if not assignee:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignee not found")
    
    ticket.assigned_to = assignment.assigned_to
    
    # Create action for assignment
    action = models.TicketAction(
        ticket_id=ticket_id,
        actor_type="user",
        action_type="assigned",
        content=f"Ticket assigned to user {assignment.assigned_to}" if assignment.assigned_to else "Ticket unassigned"
    )
    db.add(action)
    
    db.commit()
    db.refresh(ticket)
    return ticket


@router.get("/tickets/{ticket_id}/notes", response_model=List[schemas.TicketNoteRead])
def get_ticket_notes(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
) -> List[schemas.TicketNoteRead]:
    """Get all notes for a ticket."""
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    
    notes = db.query(models.TicketNote).filter(models.TicketNote.ticket_id == ticket_id).order_by(models.TicketNote.created_at.desc()).all()
    return notes


@router.post("/tickets/{ticket_id}/notes", response_model=schemas.TicketNoteRead, status_code=status.HTTP_201_CREATED)
def create_ticket_note(
    ticket_id: int,
    note_in: schemas.TicketNoteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_agent_or_admin)
) -> schemas.TicketNoteRead:
    """Create a new note for a ticket."""
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    
    note = models.TicketNote(
        ticket_id=ticket_id,
        user_id=current_user.id,
        content=note_in.content,
        is_internal=note_in.is_internal
    )
    db.add(note)
    
    # Create action for note
    action = models.TicketAction(
        ticket_id=ticket_id,
        actor_type="user",
        action_type="note_added",
        content=f"Internal note added" if note_in.is_internal else "Note added"
    )
    db.add(action)
    
    db.commit()
    db.refresh(note)
    return note


@router.get("/tickets/{ticket_id}/actions", response_model=List[schemas.TicketActionRead])
def get_ticket_actions(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
) -> List[schemas.TicketActionRead]:
    """Get action history for a ticket."""
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    
    actions = db.query(models.TicketAction).filter(models.TicketAction.ticket_id == ticket_id).order_by(models.TicketAction.created_at.desc()).all()
    return actions
