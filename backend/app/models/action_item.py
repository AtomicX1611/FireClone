from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Text, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base


class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    text = Column(Text, nullable=False)
    assignee = Column(String, nullable=True)
    due_date = Column(Date, nullable=True)
    completed = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relationship
    meeting = relationship("Meeting", back_populates="action_items")
