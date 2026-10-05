from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict
from datetime import datetime

class TranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000, description="Text to translate")
    source_lang: str = Field(default="auto", description="Source language: auto | en | hi | hinglish")
    target_lang: str = Field(default="en", description="Target language: en | hi | hinglish")
    include_confidence: bool = Field(default=True, description="Whether to compute and include confidence score")

class WordCount(BaseModel):
    input: int
    output: int

class TranslationData(BaseModel):
    original_text: str
    detected_language: str
    transliterated_text: Optional[str] = None
    translated_text: str
    confidence: Optional[float] = None
    processing_time_ms: int
    word_count: WordCount

class TranslationResponse(BaseModel):
    success: bool = True
    data: TranslationData

class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    code: str

class HistoryItem(BaseModel):
    id: str
    original_text: str
    transliterated_text: Optional[str] = None
    translated_text: str
    source_lang: str
    target_lang: str
    detected_lang: Optional[str] = None
    confidence: Optional[float] = None
    processing_time_ms: Optional[int] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

class HistoryResponse(BaseModel):
    success: bool = True
    data: List[HistoryItem]
    total: int
    page: int
    per_page: int

class SimpleMessageResponse(BaseModel):
    success: bool = True
    message: str
