from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas
from app.services import transcript_service

router = APIRouter(prefix="/api/meetings/{meeting_id}/transcript", tags=["transcripts"])


@router.get("", response_model=List[schemas.TranscriptSegmentOut])
def get_transcript(meeting_id: int, db: Session = Depends(get_db)):
    """Get all transcript segments for a meeting, ordered by sequence."""
    segments = transcript_service.get_transcript(db, meeting_id)
    if segments is None:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return segments


@router.post("/upload", response_model=List[schemas.TranscriptSegmentOut], status_code=201)
async def upload_transcript(
    meeting_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload a transcript file (.txt, .vtt, .json).
    Existing transcript for this meeting will be replaced.
    """
    segments = await transcript_service.upload_transcript(db, meeting_id, file)
    if segments is None:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return segments


@router.get("/search", response_model=List[schemas.TranscriptSearchResult])
def search_transcript(
    meeting_id: int,
    q: str = Query(..., min_length=1, description="Search query"),
    db: Session = Depends(get_db),
):
    """Search within the transcript text of a specific meeting."""
    results = transcript_service.search_transcript(db, meeting_id, q)
    if results is None:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return results
