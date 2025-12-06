from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional

from langchain.docstore.document import Document
from langchain_core.embeddings import Embeddings
from langchain_openai import OpenAIEmbeddings
from langchain_community.embeddings.fake import FakeEmbeddings
from langchain_community.vectorstores import FAISS
from sqlalchemy.orm import Session

from .. import models
from ..config import get_settings

settings = get_settings()


@dataclass
class RAGState:
    vector_store: Optional[FAISS] = None
    embeddings: Optional[Embeddings] = None


_state = RAGState()


def _get_embeddings() -> Embeddings:
    """Get embeddings model based on configuration.
    
    Note: When using Gemini as AI provider, we use FakeEmbeddings for the vector store
    since Gemini doesn't have a direct embeddings API in LangChain yet.
    For production with Gemini, you can either:
    1. Use a separate OpenAI API key just for embeddings
    2. Use Google's text-embedding models (requires additional setup)
    3. Use FakeEmbeddings (suitable for development/testing)
    """
    if _state.embeddings:
        return _state.embeddings

    # If using OpenAI provider or have OpenAI key, use OpenAI embeddings
    if settings.ai_provider == "openai" and settings.openai_api_key:
        _state.embeddings = OpenAIEmbeddings(
            model=settings.embeddings_model,
            openai_api_key=settings.openai_api_key,
        )
    else:
        # Fallback to FakeEmbeddings for Gemini or when no API key is available
        # This is suitable for development/testing
        _state.embeddings = FakeEmbeddings(size=1536)
    
    return _state.embeddings


def _build_documents(db: Session) -> List[Document]:
    articles = db.query(models.KBArticle).order_by(models.KBArticle.id).all()
    documents: List[Document] = []
    for article in articles:
        metadata = {
            "article_id": article.id,
            "title": article.title,
            "tags": article.tags,
        }
        documents.append(Document(page_content=article.body, metadata=metadata))
    return documents


def refresh_vector_store(db: Session) -> None:
    docs = _build_documents(db)
    if not docs:
        _state.vector_store = None
        return

    embeddings = _get_embeddings()
    _state.vector_store = FAISS.from_documents(docs, embeddings)


def _ensure_vector_store(db: Session) -> None:
    if _state.vector_store is None:
        refresh_vector_store(db)


def search_kb(db: Session, query: str, k: int = 3) -> List[models.KBArticle]:
    _ensure_vector_store(db)
    if _state.vector_store is None:
        # No KB articles available; return empty list
        return []

    docs = _state.vector_store.similarity_search(query, k=k)
    article_ids = [doc.metadata.get("article_id") for doc in docs if doc.metadata.get("article_id")]
    if not article_ids:
        return []

    return (
        db.query(models.KBArticle)
        .filter(models.KBArticle.id.in_(article_ids))
        .all()
    )
