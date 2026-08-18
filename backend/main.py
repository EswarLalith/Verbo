from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import os

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