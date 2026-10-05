import pytest
from app.services.detector import LanguageDetector

@pytest.fixture
def detector():
    return LanguageDetector()

def test_detect_devanagari_hindi(detector):
    assert detector.detect("मुझे कल कॉलेज में प्रेजेंटेशन देना है") == "hi"
    assert detector.detect("नमस्ते, आप कैसे हैं?") == "hi"
    assert detector.detect("भारत एक महान देश है") == "hi"

def test_detect_hinglish(detector):
    assert detector.detect("Mujhe kal college mein presentation dena hai") == "hinglish"
    assert detector.detect("Yaar wo bahut smart hai") == "hinglish"
    assert detector.detect("Mera phone kharab ho gaya") == "hinglish"
    assert detector.detect("Kya tumne khana khaya") == "hinglish"
    assert detector.detect("Bhai movie dekhne chalte hain") == "hinglish"
    assert detector.detect("Meri tabiyat theek nahi hai") == "hinglish"
    assert detector.detect("Chai peene chalein") == "hinglish"

def test_detect_english(detector):
    assert detector.detect("I have to submit my quarterly report by tomorrow morning.") == "en"
    assert detector.detect("The quick brown fox jumps over the lazy dog.") == "en"
    assert detector.detect("Could you please review the attached document?") == "en"
