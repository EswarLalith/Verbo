# Verbo

**Stop rambling. Start saying what you mean.**

Verbo is a token optimization tool that takes your messy, filler-heavy text and distills it into something sharp and effective. Speak it or type it — Verbo strips the fluff and gives you back clean, concise text powered by Google's Gemini AI.

---

## What It Does

| Input | Output |
|-------|--------|
| "I was just basically trying to like figure out how to um make my code better" | "I'm trying to improve my code" |

Verbo works in two modes:

- **Voice** — Hit the mic, talk naturally, stop. Verbo transcribes your speech and optimizes it in one shot.
- **Text** — Paste or type your rough draft, hit Optimize, get polished output.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Angular 22, TypeScript, RxJS |
| Backend | Python 3.14, FastAPI, Uvicorn |
| AI | Google Gemini 3.5 Flash |
| Audio | Browser MediaRecorder API (WebM) |

---

## Project Structure

```
Verbo/
├── verbo/                          # Angular frontend
│   └── src/app/
│       ├── project/                # Main UI — mic, textareas, optimize buttons
│       ├── bottomnav/              # "How this works" step cards
│       └── core/services/          # OptimizeService (HTTP calls to backend)
│
└── backend/                        # Python FastAPI backend
    ├── main.py                     # API endpoints (/optimize, /transcribe)
    └── venv/                       # Python virtual environment (not committed)
```

---

## Getting Started

### Prerequisites

- NVS
- Python 3.10+
- A [Gemini API key](https://aistudio.google.com/apikey) (free tier works)

### Frontend

```bash
cd Verbo/verbo
npm install
ng serve
```

Runs on `http://localhost:4200`

### Backend

```bash
cd Verbo/backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install fastapi uvicorn google-generativeai python-multipart
set GEMINI_API_KEY=your-key    # Windows
# export GEMINI_API_KEY=your-key  # macOS/Linux
uvicorn main:app --reload
```

Runs on `http://localhost:8000`

---

## API Endpoints

### `GET /`
Health check. Returns `{"message": "Verbo API is running"}`

### `POST /optimize`
Optimizes text by removing filler words and redundancy.

**Request:**
```json
{ "text": "I was just basically trying to like figure out how to um make my code better" }
```

**Response:**
```json
{ "optimized_text": "I'm trying to improve my code" }
```

### `POST /transcribe`
Accepts an audio file, transcribes it, and returns both raw and optimized text.

**Request:** `multipart/form-data` with an `audio` file field (WebM)

**Response:**
```json
{
  "transcription": "I was just basically trying to...",
  "optimized_text": "I'm trying to improve my code"
}
```

---

## How It Works

1. **Audio Transcription** — Click the mic, speak, click stop. The browser records audio via `MediaRecorder`, sends the WebM blob to `/transcribe`, Gemini transcribes it, and the result fills the Audio textarea.

2. **Text Transcription** — Type or paste text directly. Hit Optimize to send it to `/optimize`.

3. **Token Optimization** — Gemini receives the raw text with a prompt to strip filler words (um, uh, like, basically, you know), cut redundancy, and return clean output. The result appears in the Token Optimized Text box.

---

## License

MIT
