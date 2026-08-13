from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas
from app.services import summary_service

router = APIRouter(prefix="/api/meetings/{meeting_id}/summary", tags=["summaries"])


@router.get("", response_model=schemas.MeetingSummaryOut)
def get_summary(meeting_id: int, db: Session = Depends(get_db)):
    """Get the AI summary for a meeting."""
    summary = summary_service.get_summary(db, meeting_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")
    return summary


@router.post("", response_model=schemas.MeetingSummaryOut, status_code=201)
def create_summary(
    meeting_id: int,
    payload: schemas.MeetingSummaryCreate,
    db: Session = Depends(get_db),
):
    """Create or replace a meeting summary."""
    summary = summary_service.create_or_update_summary(db, meeting_id, payload)
    if not summary:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return summary


@router.post("/generate", response_model=schemas.MeetingSummaryOut)
def generate_summary(meeting_id: int, db: Session = Depends(get_db)):
    """
    Generate a summary from existing transcript segments.
    Uses OpenAI if OPENAI_API_KEY is set, otherwise returns a mock summary.
    """
    summary = summary_service.generate_summary(db, meeting_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Meeting not found or no transcript available")
    return summary
