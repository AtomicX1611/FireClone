from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas
from app.services import meeting_service

router = APIRouter(prefix="/api/meetings", tags=["meetings"])


@router.get("", response_model=schemas.PaginatedMeetings)
def list_meetings(
    q: Optional[str] = Query(None, description="Search by title"),
    participant: Optional[str] = Query(None, description="Filter by participant name"),
    sort_by: str = Query("date", description="Sort field: date | title | duration"),
    order: str = Query("desc", description="asc | desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List meetings with search, filter, sort, and pagination."""
    return meeting_service.list_meetings(
        db, q=q, participant=participant,
        sort_by=sort_by, order=order,
        page=page, page_size=page_size
    )


@router.post("", response_model=schemas.MeetingDetail, status_code=status.HTTP_201_CREATED)
def create_meeting(payload: schemas.MeetingCreate, db: Session = Depends(get_db)):
    """Create a new meeting with optional participants."""
    return meeting_service.create_meeting(db, payload)


@router.get("/{meeting_id}", response_model=schemas.MeetingDetail)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    """Get full meeting detail including summary and action items."""
    meeting = meeting_service.get_meeting_by_id(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.patch("/{meeting_id}", response_model=schemas.MeetingDetail)
def update_meeting(
    meeting_id: int,
    payload: schemas.MeetingUpdate,
    db: Session = Depends(get_db),
):
    """Update meeting title, date, duration, or participants."""
    meeting = meeting_service.update_meeting(db, meeting_id, payload)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.delete("/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    """Delete a meeting and all its associated data."""
    deleted = meeting_service.delete_meeting(db, meeting_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Meeting not found")
