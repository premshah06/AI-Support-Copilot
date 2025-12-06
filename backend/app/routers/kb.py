from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_db

router = APIRouter()


@router.get("/kb", response_model=List[schemas.KBArticleRead])
def list_articles(db: Session = Depends(get_db)) -> List[schemas.KBArticleRead]:
    return db.query(models.KBArticle).order_by(models.KBArticle.created_at.desc()).all()


@router.get("/kb/{article_id}", response_model=schemas.KBArticleRead)
def get_article(article_id: int, db: Session = Depends(get_db)) -> schemas.KBArticleRead:
    article = db.query(models.KBArticle).filter(models.KBArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="KB article not found")
    return article
