from __future__ import annotations

from typing import Optional

from sqlalchemy.orm import Session, joinedload

from .. import models


def get_ticket_with_relations(db: Session, ticket_id: int) -> Optional[models.Ticket]:
    return (
        db.query(models.Ticket)
        .options(
            joinedload(models.Ticket.customer),
            joinedload(models.Ticket.actions),
            joinedload(models.Ticket.creator),
        )
        .filter(models.Ticket.id == ticket_id)
        .first()
    )
