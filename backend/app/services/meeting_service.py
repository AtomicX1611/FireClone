from typing import Optional, List
from math import ceil
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.models.meeting import Meeting
from app.models.participant import Participant
from app.models.action_item import ActionItem
from app import schemas


def list_meetings(
    db: Session,
    q: Optional[str],
    participant: Optional[str],
    sort_by: str,
    order: str,
    page: int,
    page_size: int,
) -> schemas.PaginatedMeetings:
    query = db.query(Meeting)

    # Full-text search on title
    if q:
        query = query.filter(Meeting.title.ilike(f"%{q}%"))

    # Filter by participant name
    if participant:
        query = query.join(Meeting.participants).filter(
            Participant.name.ilike(f"%{participant}%")
        )

    # Sorting
    sort_field = {
        "date": Meeting.date,
        "title": Meeting.title,
        "duration": Meeting.duration_seconds,
    }.get(sort_by, Meeting.date)

    if order == "asc":
        query = query.order_by(sort_field.asc())
    else:
        query = query.order_by(sort_field.desc())

    total = query.count()
    meetings = query.offset((page - 1) * page_size).limit(page_size).all()

    items = []
    for m in meetings:
        total_items = len(m.action_items)
        completed = sum(1 for ai in m.action_items if ai.completed)
        items.append(
            schemas.MeetingListItem(
                id=m.id,
                title=m.title,
                date=m.date,
                duration_seconds=m.duration_seconds,
                participants=[schemas.ParticipantOut.model_validate(p) for p in m.participants],
                action_items_count=total_items,
                completed_action_items_count=completed,
                has_summary=m.summary is not None,
                created_at=m.created_at,
                updated_at=m.updated_at,
            )
        )

    return schemas.PaginatedMeetings(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=ceil(total / page_size) if total else 0,
    )


def get_meeting_by_id(db: Session, meeting_id: int) -> Optional[Meeting]:
    return db.query(Meeting).filter(Meeting.id == meeting_id).first()


def create_meeting(db: Session, payload: schemas.MeetingCreate) -> Meeting:
    meeting = Meeting(
        title=payload.title,
        date=payload.date,
        duration_seconds=payload.duration_seconds,
    )
    db.add(meeting)
    db.flush()  # get meeting.id

    for p in payload.participants:
        participant = Participant(
            meeting_id=meeting.id,
            name=p.name,
            email=p.email,
            color=p.color,
        )
        db.add(participant)

    db.commit()
    db.refresh(meeting)
    return meeting


def update_meeting(db: Session, meeting_id: int, payload: schemas.MeetingUpdate) -> Optional[Meeting]:
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return None

    if payload.title is not None:
        meeting.title = payload.title
    if payload.date is not None:
        meeting.date = payload.date
    if payload.duration_seconds is not None:
        meeting.duration_seconds = payload.duration_seconds

    # Replace participants if provided
    if payload.participants is not None:
        # Delete old participants
        db.query(Participant).filter(Participant.meeting_id == meeting_id).delete()
        for p in payload.participants:
            participant = Participant(
                meeting_id=meeting.id,
                name=p.name,
                email=p.email,
                color=p.color,
            )
            db.add(participant)

    meeting.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(meeting)
    return meeting


def delete_meeting(db: Session, meeting_id: int) -> bool:
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return False
    db.delete(meeting)
    db.commit()
    return True
