from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import os
import tempfile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class TextRequest(BaseModel):
    text: str


@app.get("/")
def root():
    return {"message": "Verbo API is running"}


@app.post("/optimize")
async def optimize_text(request: TextRequest):
    prompt = (
        "You are a token optimizer. Take the following text and rewrite it to be "
        "concise, clear, and effective. Remove filler words, redundancy, and fluff "
        "while preserving the original meaning. Return ONLY the optimized text, "
        "nothing else.\n\n"
        f"Text: {request.text}"
    )
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
    )
    return {"optimized_text": response.text}


@app.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    audio_bytes = await audio.read()

    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        uploaded_file = client.files.upload(file=tmp_path)

        transcription_response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=[
                "Transcribe this audio exactly as spoken. Return ONLY the transcription, nothing else.",
                uploaded_file,
            ],
        )
        raw_text = transcription_response.text

        optimize_response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=(
                "You are a token optimizer. Take the following text and rewrite it to be "
                "concise, clear, and effective. Remove filler words like um, uh, like, "
                "basically, you know, and redundancy while preserving the original meaning. "
                "Return ONLY the optimized text, nothing else.\n\n"
                f"Text: {raw_text}"
            ),
        )

        return {
            "transcription": raw_text,
            "optimized_text": optimize_response.text,
        }
    finally:
        os.unlink(tmp_path)