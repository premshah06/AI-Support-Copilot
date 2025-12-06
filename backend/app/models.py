from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, CheckConstraint, Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="agent")  # admin, agent, viewer
    is_active = Column(Boolean, default=True, nullable=False)

    tickets = relationship("Ticket", foreign_keys="Ticket.created_by_user_id", back_populates="creator")
    assigned_tickets = relationship("Ticket", foreign_keys="Ticket.assigned_to", back_populates="assignee")
    notes = relationship("TicketNote", back_populates="user")


class Customer(Base, TimestampMixin):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    segment = Column(String(100), nullable=False)
    region = Column(String(100), nullable=False)
    risk_score = Column(Float, nullable=False, default=0)

    tickets = relationship("Ticket", back_populates="customer")


class Ticket(Base, TimestampMixin):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), nullable=False, default="open", index=True)
    priority = Column(String(10), nullable=False, default="P3", index=True)
    category = Column(String(50), nullable=False, default="general", index=True)
    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)

    creator = relationship("User", foreign_keys=[created_by_user_id], back_populates="tickets")
    assignee = relationship("User", foreign_keys=[assigned_to], back_populates="assigned_tickets")
    customer = relationship("Customer", back_populates="tickets")
    actions = relationship("TicketAction", back_populates="ticket", cascade="all, delete-orphan")
    notes = relationship("TicketNote", back_populates="ticket", cascade="all, delete-orphan")
    ai_feedback = relationship("AIFeedback", back_populates="ticket", cascade="all, delete-orphan")


class KBArticle(Base, TimestampMixin):
    __tablename__ = "kb_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    tags = Column(String(255), nullable=True)


class TicketAction(Base):
    __tablename__ = "ticket_actions"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False, index=True)
    actor_type = Column(String(50), nullable=False)
    action_type = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    ticket = relationship("Ticket", back_populates="actions")


class TicketNote(Base, TimestampMixin):
    __tablename__ = "ticket_notes"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    is_internal = Column(Boolean, default=True, nullable=False)

    ticket = relationship("Ticket", back_populates="notes")
    user = relationship("User", back_populates="notes")


class AIFeedback(Base):
    __tablename__ = "ai_feedback"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False, index=True)
    suggestion_type = Column(String(50), nullable=False)  # reply, summary, playbook
    rating = Column(String(20), nullable=False)  # helpful, not_helpful
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    ticket = relationship("Ticket", back_populates="ai_feedback")
