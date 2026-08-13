from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.meeting import Meeting
from app.models.action_item import ActionItem
from app import schemas


def list_action_items(db: Session, meeting_id: int) -> Optional[List[ActionItem]]:
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return None
    return (
        db.query(ActionItem)
        .filter(ActionItem.meeting_id == meeting_id)
        .order_by(ActionItem.created_at)
        .all()
    )


def create_action_item(
    db: Session, meeting_id: int, payload: schemas.ActionItemCreate
) -> Optional[ActionItem]:
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return None
    item = ActionItem(
        meeting_id=meeting_id,
        text=payload.text,
        assignee=payload.assignee,
        due_date=payload.due_date,
        completed=payload.completed,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_action_item(
    db: Session, item_id: int, payload: schemas.ActionItemUpdate
) -> Optional[ActionItem]:
    item = db.query(ActionItem).filter(ActionItem.id == item_id).first()
    if not item:
        return None
    if payload.text is not None:
        item.text = payload.text
    if payload.assignee is not None:
        item.assignee = payload.assignee
    if payload.due_date is not None:
        item.due_date = payload.due_date
    if payload.completed is not None:
        item.completed = payload.completed
    db.commit()
    db.refresh(item)
    return item


def delete_action_item(db: Session, item_id: int) -> bool:
    item = db.query(ActionItem).filter(ActionItem.id == item_id).first()
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True
