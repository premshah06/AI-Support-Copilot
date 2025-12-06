from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr


class TimestampedSchema(BaseModel):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserRead(UserBase, TimestampedSchema):
    is_active: bool


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserRead


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    segment: str
    region: str
    risk_score: float


class CustomerCreate(CustomerBase):
    pass


class CustomerRead(CustomerBase, TimestampedSchema):
    pass


class TicketBase(BaseModel):
    title: str
    description: str
    status: str
    priority: str
    category: str
    created_by_user_id: int
    customer_id: Optional[int] = None


class TicketCreate(TicketBase):
    pass


class TicketUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None


class KBArticleBase(BaseModel):
    title: str
    body: str
    tags: Optional[str] = None


class KBArticleCreate(KBArticleBase):
    pass


class KBArticleRead(KBArticleBase, TimestampedSchema):
    pass


class TicketActionBase(BaseModel):
    actor_type: str
    action_type: str
    content: str


class TicketActionCreate(TicketActionBase):
    ticket_id: int


class TicketActionRead(TicketActionBase):
    id: int
    ticket_id: int
    created_at: datetime

    class Config:
        orm_mode = True


class TicketRead(TicketBase, TimestampedSchema):
    actions: List[TicketActionRead] = []
    customer: Optional[CustomerRead] = None


class AISuggestion(BaseModel):
    summary: str
    category: str
    priority: str
    suggested_reply: str
    suggested_actions: List[str]


class AIPlaybookStep(BaseModel):
    title: str
    description: str
    order: int


class AIPlaybook(BaseModel):
    title: str
    steps: List[AIPlaybookStep]
    prerequisites: List[str]
    rollback_steps: List[str]


class TicketNoteBase(BaseModel):
    content: str
    is_internal: bool = True


class TicketNoteCreate(TicketNoteBase):
    pass


class TicketNoteRead(TicketNoteBase):
    id: int
    ticket_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class AIFeedbackBase(BaseModel):
    suggestion_type: str  # reply, summary, playbook
    rating: str  # helpful, not_helpful
    comment: Optional[str] = None


class AIFeedbackCreate(AIFeedbackBase):
    pass


class AIFeedbackRead(AIFeedbackBase):
    id: int
    ticket_id: int
    created_at: datetime

    class Config:
        orm_mode = True


class TicketAssignment(BaseModel):
    assigned_to: Optional[int] = None


class MetricsOverview(BaseModel):
    total_tickets: int
    open_tickets: int
    in_progress_tickets: int
    resolved_tickets: int
    closed_tickets: int
    avg_first_response_time: float
    avg_resolution_time: float
    ai_usage_count: int
    ai_feedback_helpful: int
    ai_feedback_not_helpful: int
    ticket_volume_by_date: List[dict]
    tickets_by_status: dict
    tickets_by_priority: dict
    tickets_by_category: dict
