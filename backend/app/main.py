from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.engine import make_url
from sqlalchemy.exc import SQLAlchemyError

from .config import get_settings
from .database import engine
from .models import Base
from .routers import ai, auth, kb, metrics, tickets

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_incident_support.app")


def _safe_database_url(raw_url: str) -> str:
    try:
        return make_url(raw_url).render_as_string(hide_password=True)
    except SQLAlchemyError:
        return "<unparsable database url>"


settings = get_settings()

db_url_safe = _safe_database_url(settings.database_url)
logger.info("Preparing database engine for %s", db_url_safe)

try:
    Base.metadata.create_all(bind=engine)
except SQLAlchemyError:
    logger.exception("Database initialization failed for %s", db_url_safe)
    raise
else:
    logger.info("Database is ready: %s", db_url_safe)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(tickets.router, prefix="/api", tags=["tickets"])
app.include_router(kb.router, prefix="/api", tags=["kb"])
app.include_router(ai.router, prefix="/api", tags=["ai"])
app.include_router(metrics.router, prefix="/api", tags=["metrics"])


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
