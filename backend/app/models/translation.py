import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, Integer, DateTime
from app.database import Base

class TranslationHistory(Base):
    __tablename__ = "translations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    original_text = Column(Text, nullable=False)
    transliterated_text = Column(Text, nullable=True)
    translated_text = Column(Text, nullable=False)
    source_lang = Column(String(20), nullable=False)
    target_lang = Column(String(20), nullable=False)
    detected_lang = Column(String(20), nullable=True)
    confidence = Column(Float, nullable=True)
    processing_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
