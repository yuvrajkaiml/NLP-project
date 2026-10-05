from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models.translation import TranslationHistory
from app.schemas.translation import HistoryResponse, HistoryItem, SimpleMessageResponse

router = APIRouter(prefix="/api/v1", tags=["history"])

@router.get("/history", response_model=HistoryResponse)
async def get_history(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * per_page
    total = db.query(TranslationHistory).count()
    records = (
        db.query(TranslationHistory)
        .order_by(desc(TranslationHistory.created_at))
        .offset(offset)
        .limit(per_page)
        .all()
    )

    items = [
        HistoryItem(
            id=r.id,
            original_text=r.original_text,
            transliterated_text=r.transliterated_text,
            translated_text=r.translated_text,
            source_lang=r.source_lang,
            target_lang=r.target_lang,
            detected_lang=r.detected_lang,
            confidence=r.confidence,
            processing_time_ms=r.processing_time_ms,
            timestamp=r.created_at
        )
        for r in records
    ]

    return HistoryResponse(
        success=True,
        data=items,
        total=total,
        page=page,
        per_page=per_page
    )

@router.delete("/history/{id}", response_model=SimpleMessageResponse)
async def delete_history_item(
    id: str,
    db: Session = Depends(get_db)
):
    record = db.query(TranslationHistory).filter(TranslationHistory.id == id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": f"Translation with id {id} not found", "code": "NOT_FOUND"}
        )
    db.delete(record)
    db.commit()
    return SimpleMessageResponse(success=True, message="Deleted")

@router.delete("/history", response_model=SimpleMessageResponse)
async def clear_all_history(
    db: Session = Depends(get_db)
):
    db.query(TranslationHistory).delete()
    db.commit()
    return SimpleMessageResponse(success=True, message="All history cleared")
