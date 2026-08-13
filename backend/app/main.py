from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import meetings, transcripts, summaries, action_items

# Create all tables
import app.models  # noqa: F401 — ensures models are registered with Base
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fireflies Clone API",
    description="Meeting Notes & Transcription Platform — FastAPI Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ───────────────────────────────────────────────────────────────────
app.include_router(meetings.router)
app.include_router(transcripts.router)
app.include_router(summaries.router)
app.include_router(action_items.meeting_router)
app.include_router(action_items.item_router)


@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok", "service": "Fireflies Clone API", "version": "1.0.0"}


@app.get("/api/health", tags=["health"])
def api_health():
    return {"status": "ok"}
