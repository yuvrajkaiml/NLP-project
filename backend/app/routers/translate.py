import time
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config import get_settings
from app.database import get_db
from app.schemas.translation import (
    TranslationRequest,
    TranslationResponse,
    TranslationData,
    WordCount,
    ErrorResponse
)
from app.models.translation import TranslationHistory
from app.services.detector import LanguageDetector
from app.services.translator import NeuralTranslator
from app.utils.cache import translation_cache

router = APIRouter(prefix="/api/v1", tags=["translation"])
settings = get_settings()

detector = LanguageDetector()
translator = NeuralTranslator(model_name=settings.model_name)

@router.post(
    "/translate",
    response_model=TranslationResponse,
    responses={400: {"model": ErrorResponse}}
)
async def translate_text(
    request: TranslationRequest,
    db: Session = Depends(get_db)
):
    clean_text = request.text.strip()
    if not clean_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Input text cannot be empty", "code": "TEXT_EMPTY"}
        )

    if len(clean_text) > settings.max_input_length:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": f"Input text exceeds {settings.max_input_length} character limit",
                "code": "TEXT_TOO_LONG"
            }
        )

    start_time = time.time()

    # Determine source language
    if request.source_lang == "auto" or not request.source_lang:
        detected_lang = detector.detect(clean_text)
        src_lang = detected_lang
    else:
        detected_lang = detector.detect(clean_text)
        src_lang = request.source_lang

    tgt_lang = request.target_lang or ("en" if src_lang != "en" else "hinglish")

    # If src and tgt are the same, adjust target
    if src_lang == tgt_lang:
        tgt_lang = "en" if src_lang != "en" else "hinglish"

    # Check cache
    cache_key = f"{src_lang}:{tgt_lang}:{clean_text}"
    cached_result = translation_cache.get(cache_key)

    if cached_result:
        cached_data = dict(cached_result)
        cached_data["processing_time_ms"] = int((time.time() - start_time) * 1000)
        return TranslationResponse(
            success=True,
            data=TranslationData(**cached_data)
        )

    # Perform translation
    translated_text, confidence, transliterated = translator.translate(
        text=clean_text,
        src_lang=src_lang,
        tgt_lang=tgt_lang
    )

    elapsed_ms = max(1, int((time.time() - start_time) * 1000))

    # Calculate word counts
    input_word_count = len(clean_text.split())
    output_word_count = len(translated_text.split())

    data_payload = {
        "original_text": clean_text,
        "detected_language": detected_lang,
        "transliterated_text": transliterated,
        "translated_text": translated_text,
        "confidence": confidence if request.include_confidence else None,
        "processing_time_ms": elapsed_ms,
        "word_count": {
            "input": input_word_count,
            "output": output_word_count
        }
    }

    # Save to cache
    translation_cache.set(cache_key, data_payload)

    # Save to history database
    try:
        history_record = TranslationHistory(
            id=str(uuid.uuid4()),
            original_text=clean_text,
            transliterated_text=transliterated,
            translated_text=translated_text,
            source_lang=src_lang,
            target_lang=tgt_lang,
            detected_lang=detected_lang,
            confidence=confidence,
            processing_time_ms=elapsed_ms
        )
        db.add(history_record)
        db.commit()
    except Exception as e:
        db.rollback()
        # Logging failure without blocking response
        pass

    return TranslationResponse(
        success=True,
        data=TranslationData(
            original_text=clean_text,
            detected_language=detected_lang,
            transliterated_text=transliterated,
            translated_text=translated_text,
            confidence=confidence if request.include_confidence else None,
            processing_time_ms=elapsed_ms,
            word_count=WordCount(input=input_word_count, output=output_word_count)
        )
    )

@router.get("/languages")
async def get_supported_languages():
    return {
        "success": True,
        "data": [
            {"code": "auto", "name": "Auto-Detect", "native_name": "पहचानें", "flag": "🌐"},
            {"code": "hinglish", "name": "Hinglish", "native_name": "Hinglish", "flag": "🇮🇳"},
            {"code": "en", "name": "English", "native_name": "English", "flag": "🇬🇧"},
            {"code": "hi", "name": "Hindi (Devanagari)", "native_name": "हिन्दी", "flag": "🇮🇳"}
        ]
    }
