import re
from typing import Dict, Any
from langdetect import detect, DetectorFactory

# Fix seed for deterministic language detection
DetectorFactory.seed = 0

class LanguageDetector:
    """
    Detects whether input is:
    - 'hi' (Devanagari Hindi)
    - 'hinglish' (Code-mixed Hindi written in Roman/Latin script)
    - 'en' (English)
    """

    # Comprehensive set of common Romanized Hindi / Hinglish stopwords & keywords
    HINGLISH_KEYWORDS = {
        "mujhe", "tujhe", "hume", "hum", "main", "mera", "meri", "mere", "mera",
        "tera", "teri", "tere", "uska", "uski", "uske", "unka", "unki", "unke",
        "apna", "apni", "apne", "aap", "tum", "tu", "wo", "woh", "ye", "yeh",
        "kya", "kyun", "kyu", "kaise", "kaisa", "kaisi", "kaise", "kab", "kaha",
        "kahan", "kidhar", "idhar", "udhar", "kisko", "kisse", "kisne", "jisne",
        "hai", "hain", "ho", "hoon", "hun", "tha", "thi", "thhe", "hoga", "hogi", "hoge",
        "raha", "rahi", "rahe", "gaya", "gayi", "gaye", "diya", "diye", "liya", "liye",
        "karna", "karo", "karein", "karta", "karti", "karte", "kar", "kiye",
        "dena", "do", "dijiye", "de", "le", "lena", "liya", "dekho", "dekhne",
        "chalo", "chalte", "chal", "aao", "aaya", "aayi", "aaye", "aana",
        "jao", "jaana", "jata", "jati", "jate", "khaya", "khao", "peene", "piya",
        "peeyo", "peena", "bhi", "aur", "ya", "lekin", "magar", "par", "pe",
        "mein", "me", "se", "ko", "ke", "ki", "ka", "liye", "saath", "tak",
        "nahi", "nahin", "na", "mat", "bahut", "bohot", "zyada", "thoda", "kam",
        "achha", "achhi", "achhe", "theek", "thik", "kharab", "sahi", "galat",
        "yaar", "bhai", "dost", "kal", "aaj", "parso", "subah", "shaam", "raat",
        "baat", "samajh", "khana", "paani", "tabiyat", "chalein"
    }

    def contains_devanagari(self, text: str) -> bool:
        """Check if string contains any Devanagari characters (U+0900 to U+097F)."""
        return bool(re.search(r'[\u0900-\u097F]', text))

    def count_devanagari_chars(self, text: str) -> int:
        return len(re.findall(r'[\u0900-\u097F]', text))

    def detect(self, text: str) -> str:
        """
        Determines language: 'hi', 'hinglish', or 'en'.
        """
        clean_text = text.strip()
        if not clean_text:
            return "en"

        # Check for Devanagari script presence
        devanagari_count = self.count_devanagari_chars(clean_text)
        total_letters = len(re.findall(r'[a-zA-Z\u0900-\u097F]', clean_text))

        if total_letters > 0 and (devanagari_count / total_letters) > 0.3:
            return "hi"

        # Text is in Latin/Roman script. Check for Hinglish words.
        words = re.findall(r'\b[a-zA-Z]+\b', clean_text.lower())
        if not words:
            return "en"

        hinglish_match_count = sum(1 for w in words if w in self.HINGLISH_KEYWORDS)
        hinglish_ratio = hinglish_match_count / len(words)

        if hinglish_match_count >= 1 and (hinglish_ratio >= 0.15 or len(words) <= 3):
            return "hinglish"

        # Fallback to langdetect library
        try:
            detected_lang = detect(clean_text)
            if detected_lang == "en" and hinglish_match_count == 0:
                return "en"
            elif detected_lang == "hi":
                return "hinglish"
        except Exception:
            pass

        # Check typical phonetic Hindi suffixes/patterns (excluding ambiguous English words like 'the')
        hinglish_patterns = [
            r'\b(hai|hain|hoon|tha|thi)\b',
            r'\b(raha|rahi|rahe)\b',
            r'\b(chalte|karte|dekhne|peene)\b',
            r'\b(yaar|bhai|bhaiya)\b',
            r'\b(theek|achha|kharab)\b'
        ]
        for pat in hinglish_patterns:
            if re.search(pat, clean_text, re.IGNORECASE):
                return "hinglish"

        return "en"

    def get_details(self, text: str) -> Dict[str, Any]:
        detected = self.detect(text)
        has_devanagari = self.contains_devanagari(text)
        words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
        hinglish_matches = [w for w in words if w in self.HINGLISH_KEYWORDS]
        
        confidence = 0.95
        if detected == "hinglish" and not hinglish_matches:
            confidence = 0.75
        elif detected == "hi" and not has_devanagari:
            confidence = 0.60

        return {
            "language": detected,
            "has_devanagari": has_devanagari,
            "hinglish_tokens": hinglish_matches,
            "confidence": confidence
        }
