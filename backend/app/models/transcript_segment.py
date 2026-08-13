from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    speaker_name = Column(String, nullable=False)
    speaker_color = Column(String, nullable=False, default="#6C47FF")
    start_time = Column(Float, nullable=False)   # seconds from start
    end_time = Column(Float, nullable=False)
    text = Column(Text, nullable=False)
    sequence = Column(Integer, nullable=False, default=0)  # ordering index

    # Relationship
    meeting = relationship("Meeting", back_populates="transcript_segments")
