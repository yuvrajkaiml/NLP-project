import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True

def test_languages_endpoint():
    response = client.get("/api/v1/languages")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) >= 4

# Test all 10 core Hinglish test cases required by the prompt
SAMPLE_TEST_CASES = [
    ("Mujhe kal college mein presentation dena hai", "I have to give a presentation at college tomorrow"),
    ("Yaar wo bahut smart hai", "Dude, he is very smart"),
    ("Mera phone kharab ho gaya", "My phone broke down"),
    ("Kya tumne khana khaya", "Did you eat food"),
    ("Bhai movie dekhne chalte hain", "Bro, let's go watch a movie"),
    ("Meri tabiyat theek nahi hai", "I'm not feeling well"),
    ("Wo kal party mein nahi aaya", "He didn't come to the party yesterday"),
    ("Tum bahut achhe ho", "You are very nice"),
    ("Mujhe samajh nahi aa raha", "I don't understand"),
    ("Chai peene chalein", "Shall we go have tea"),
]

@pytest.mark.parametrize("hinglish_input,expected_sub", SAMPLE_TEST_CASES)
def test_all_10_hinglish_test_cases(hinglish_input, expected_sub):
    response = client.post("/api/v1/translate", json={
        "text": hinglish_input,
        "source_lang": "auto",
        "target_lang": "en",
        "include_confidence": True
    })
    assert response.status_code == 200
    result = response.json()
    assert result["success"] is True
    data = result["data"]
    assert data["detected_language"] == "hinglish"
    assert data["transliterated_text"] is not None
    assert expected_sub.lower() in data["translated_text"].lower()
    assert data["confidence"] >= 0.90
    assert data["processing_time_ms"] >= 0

def test_complex_syntactic_sentences():
    # Test case: Emotion negation with named entities
    res = client.post("/api/v1/translate", json={
        "text": "ojas ko aakansha se pyarr nahi hai",
        "source_lang": "auto",
        "target_lang": "en",
        "include_confidence": True
    })
    assert res.status_code == 200
    d = res.json()["data"]
    assert "ojas does not love aakansha" in d["translated_text"].lower()
    assert d["confidence"] >= 0.90

    # Test case: Positive emotion
    res2 = client.post("/api/v1/translate", json={
        "text": "mujhe tumse pyar hai",
        "source_lang": "auto",
        "target_lang": "en",
        "include_confidence": True
    })
    assert res2.status_code == 200
    d2 = res2.json()["data"]
    assert "i love you" in d2["translated_text"].lower()
    assert d2["confidence"] >= 0.90

def test_reverse_translation_english_to_hinglish():
    response = client.post("/api/v1/translate", json={
        "text": "My phone broke down",
        "source_lang": "en",
        "target_lang": "hinglish",
        "include_confidence": True
    })
    assert response.status_code == 200
    data = response.json()["data"]
    assert "mera phone kharab ho gaya" in data["translated_text"].lower()

def test_devanagari_to_english_translation():
    response = client.post("/api/v1/translate", json={
        "text": "मुझे कल कॉलेज में प्रेजेंटेशन देना है",
        "source_lang": "auto",
        "target_lang": "en",
        "include_confidence": True
    })
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["detected_language"] == "hi"
    assert "presentation at college tomorrow" in data["translated_text"].lower()

def test_history_flow():
    # Submit translation
    client.post("/api/v1/translate", json={
        "text": "Meri tabiyat theek nahi hai",
        "source_lang": "hinglish",
        "target_lang": "en"
    })

    # Fetch history
    history_res = client.get("/api/v1/history?page=1&per_page=10")
    assert history_res.status_code == 200
    h_data = history_res.json()
    assert h_data["success"] is True
    assert len(h_data["data"]) > 0

    item_id = h_data["data"][0]["id"]

    # Delete history item
    del_res = client.delete(f"/api/v1/history/{item_id}")
    assert del_res.status_code == 200

def test_validation_empty_and_too_long():
    # Empty
    res_empty = client.post("/api/v1/translate", json={"text": "   "})
    assert res_empty.status_code == 400

    # Exceed limit
    long_text = "word " * 200
    res_long = client.post("/api/v1/translate", json={"text": long_text})
    assert res_long.status_code == 400
