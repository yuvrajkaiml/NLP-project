# HinglishFlow — Hindi ↔ English Code-Mixed Translation Platform

HinglishFlow is a modern, full-stack neural translation platform designed to translate Hindi-English code-mixed sentences (Hinglish) into proper English, and vice versa.

Built with an editorial **"Ink & Saffron"** design aesthetic, it incorporates real-time script detection, phonetic Devanagari transliteration, semantic translation with confidence scoring, Web Speech API synthesis, and translation history.

---

## 🌟 Key Features

- **Hinglish ↔ English Translation**: Accurately translates colloquial code-mixed sentences (e.g., *"Mujhe kal college mein presentation dena hai"* → *"I have to give a presentation at college tomorrow"*).
- **English → Hinglish Reverse Translation**: Natural translation of conversational English back into Hinglish.
- **Devanagari Hindi Support**: Bidirectional translation between formal Devanagari Hindi and English.
- **Live Transliteration Preview**: Collapsible Devanagari conversion preview for Romanized inputs.
- **Confidence Scoring & Performance Metrics**: Real-time confidence percentage and latency in milliseconds.
- **Audio Text-to-Speech (TTS)**: Native browser Web Speech API integration for Hindi and English voice playback.
- **Translation History**: Slide-in history sidebar with search, delete, clear, and click-to-load with persistent storage.
- **Editorial "Ink & Saffron" Theme**: Custom typography (Fraunces + Inter + Noto Sans Devanagari), warm saffron accents, deep indigo surfaces, and full Dark Mode support.
- **Interactive API Documentation**: Auto-generated interactive Swagger UI at `/docs`.

---

## 🏗️ Architecture & Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Input Panel │  │ Output Panel │  │  History Sidebar │  │
│  │  (Hinglish)  │→ │  (English)   │  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│         ↑ React 18 + Vite + Tailwind + Framer Motion       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/JSON (REST API)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      FASTAPI BACKEND                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  POST /api/v1/translate                                │ │
│  │  ┌──────────┐  ┌──────────────┐  ┌─────────────────┐  │ │
│  │  │ Language │→ │Transliteration│→ │  Transformer     │  │ │
│  │  │ Detection │  │ (if needed)   │  │  Translation     │  │ │
│  │  └──────────┘  └──────────────┘  └─────────────────┘  │ │
│  │       ↓              ↓                    ↓            │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Post-Processor (grammar fix, punctuation, casing)│  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  GET /history │  │ GET /health  │  │  GET /languages  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│         ↓                                               │
│  ┌──────────────────┐  ┌──────────────────────────────┐    │
│  │  SQLite/PostgreSQL│  │  LRU Cache (in-memory)      │    │
│  └──────────────────┘  └──────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

The 4-Stage Pipeline:
1. **Language Detection**: Distinguishes between Romanized Hinglish, Devanagari Hindi, and English.
2. **Phonetic Transliteration**: Transforms Romanized script into standard Devanagari with phonetic mapping.
3. **Neural & Semantic Translation**: Resolves conversational idioms, modal verbs, pronouns, and sentence syntax with confidence scoring.
4. **Post-Processor**: Cleans punctuation, capitalizes sentence boundaries, formats proper nouns, and strips artifacts.

---

## 🚀 Quickstart Guide

### Option 1: Running Locally

#### 1. Backend Setup
```bash
cd backend
# Create virtual environment (Python 3.11+)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend API will be running at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.

#### 2. Frontend Setup
```bash
cd frontend

# Install npm dependencies
npm install

# Start development server
npm run dev
```
Frontend will be available at `http://localhost:5173`.

---

### Option 2: Docker Compose
```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`

---

## 🧪 Running Tests

### Backend Unit & Integration Tests
```bash
cd backend
.\venv\Scripts\pytest tests
```
Runs 19 comprehensive tests covering:
- Auto-detection accuracy
- All 10 sample test cases (from prompt)
- Reverse English → Hinglish translation
- Devanagari → English translation
- History persistence and deletion
- Validation (character limits, empty strings)

### Frontend Production Build Test
```bash
cd frontend
npm run build
```

---

## 📋 Verified Test Cases

| Input (Hinglish) | Expected Output (English) |
|---|---|
| Mujhe kal college mein presentation dena hai | I have to give a presentation at college tomorrow. |
| Yaar wo bahut smart hai | Dude, he is very smart. |
| Mera phone kharab ho gaya | My phone broke down. |
| Kya tumne khana khaya | Did you eat food. |
| Bhai movie dekhne chalte hain | Bro, let's go watch a movie. |
| Meri tabiyat theek nahi hai | I'm not feeling well. |
| Wo kal party mein nahi aaya | He didn't come to the party yesterday. |
| Tum bahut achhe ho | You are very nice. |
| Mujhe samajh nahi aa raha | I don't understand. |
| Chai peene chalein | Shall we go have tea. |

---

## 📄 License
MIT License.
