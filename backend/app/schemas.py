from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, field_validator


# ─── Participant ───────────────────────────────────────────────────────────────

class ParticipantBase(BaseModel):
    name: str
    email: Optional[str] = None
    color: str = "#6C47FF"


class ParticipantCreate(ParticipantBase):
    pass


class ParticipantOut(ParticipantBase):
    id: int
    meeting_id: int

    model_config = {"from_attributes": True}


# ─── Transcript Segment ────────────────────────────────────────────────────────

class TranscriptSegmentBase(BaseModel):
    speaker_name: str
    speaker_color: str = "#6C47FF"
    start_time: float
    end_time: float
    text: str
    sequence: int = 0


class TranscriptSegmentCreate(TranscriptSegmentBase):
    pass


class TranscriptSegmentOut(TranscriptSegmentBase):
    id: int
    meeting_id: int

    model_config = {"from_attributes": True}


# ─── Meeting Summary ───────────────────────────────────────────────────────────

class ChapterSchema(BaseModel):
    title: str
    start_time: float
    summary: str


class MeetingSummaryBase(BaseModel):
    overview: str
    key_topics: List[str] = []
    chapters: List[ChapterSchema] = []


class MeetingSummaryCreate(MeetingSummaryBase):
    pass


class MeetingSummaryOut(MeetingSummaryBase):
    id: int
    meeting_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Action Item ───────────────────────────────────────────────────────────────

class ActionItemBase(BaseModel):
    text: str
    assignee: Optional[str] = None
    due_date: Optional[date] = None
    completed: bool = False


class ActionItemCreate(ActionItemBase):
    pass


class ActionItemUpdate(BaseModel):
    text: Optional[str] = None
    assignee: Optional[str] = None
    due_date: Optional[date] = None
    completed: Optional[bool] = None


class ActionItemOut(ActionItemBase):
    id: int
    meeting_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Meeting ───────────────────────────────────────────────────────────────────

class MeetingBase(BaseModel):
    title: str
    date: datetime
    duration_seconds: int = 0


class MeetingCreate(MeetingBase):
    participants: List[ParticipantCreate] = []


class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    participants: Optional[List[ParticipantCreate]] = None


class MeetingListItem(MeetingBase):
    id: int
    participants: List[ParticipantOut] = []
    action_items_count: int = 0
    completed_action_items_count: int = 0
    has_summary: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class MeetingDetail(MeetingBase):
    id: int
    participants: List[ParticipantOut] = []
    summary: Optional[MeetingSummaryOut] = None
    action_items: List[ActionItemOut] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── Upload / Search ───────────────────────────────────────────────────────────

class TranscriptSearchResult(BaseModel):
    segment_id: int
    speaker_name: str
    speaker_color: str
    start_time: float
    text: str
    sequence: int
    highlight: str  # text snippet with match highlighted


class PaginatedMeetings(BaseModel):
    items: List[MeetingListItem]
    total: int
    page: int
    page_size: int
    total_pages: int
