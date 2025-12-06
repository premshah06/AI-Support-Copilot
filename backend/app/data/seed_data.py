from __future__ import annotations

import json
from pathlib import Path
from typing import Sequence

from sqlalchemy.orm import Session

from ..config import get_settings
from ..database import SessionLocal, engine
from ..models import Base, Customer, KBArticle, Ticket, User

BASE_DIR = Path(__file__).resolve().parents[3]
DATA_DIR = BASE_DIR / "data"
settings = get_settings()


def load_json(filename: str) -> list[dict]:
    path = DATA_DIR / filename
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def seed_users(db: Session) -> None:
    if db.query(User).count() > 0:
        return

    users = [
        User(name="Alex Agent", email="alex.agent@example.com", role="agent"),
        User(name="Riley Admin", email="riley.admin@example.com", role="admin"),
    ]
    db.add_all(users)
    db.commit()


def seed_customers(db: Session) -> None:
    if db.query(Customer).count() > 0:
        return

    customers = [Customer(**record) for record in load_json("customers.sample.json")]
    db.add_all(customers)
    db.commit()


def seed_kb_articles(db: Session) -> None:
    if db.query(KBArticle).count() > 0:
        return

    articles = [KBArticle(**record) for record in load_json("kb_articles.sample.json")]
    db.add_all(articles)
    db.commit()


def seed_tickets(db: Session) -> None:
    if db.query(Ticket).count() > 0:
        return

    tickets = [Ticket(**record) for record in load_json("tickets.sample.json")]
    db.add_all(tickets)
    db.commit()


def seed_all() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_users(db)
        seed_customers(db)
        seed_kb_articles(db)
        seed_tickets(db)

    print("Database seeded successfully at", settings.database_url)


if __name__ == "__main__":
    seed_all()
