from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, JSON, func
from sqlalchemy.orm import relationship
from app.database import Base


class MeetingSummary(Base):
    __tablename__ = "meeting_summaries"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    overview = Column(Text, nullable=False)
    key_topics = Column(JSON, nullable=False, default=list)   # ["topic1", "topic2", ...]
    chapters = Column(JSON, nullable=False, default=list)     # [{"title": "", "start_time": 0, "summary": ""}]
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relationship
    meeting = relationship("Meeting", back_populates="summary")
