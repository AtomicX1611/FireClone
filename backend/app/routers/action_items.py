from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas
from app.services import action_item_service

# Action items nested under meetings
meeting_router = APIRouter(prefix="/api/meetings/{meeting_id}/action-items", tags=["action-items"])
# Standalone router for updates/deletes by ID
item_router = APIRouter(prefix="/api/action-items", tags=["action-items"])


@meeting_router.get("", response_model=List[schemas.ActionItemOut])
def list_action_items(meeting_id: int, db: Session = Depends(get_db)):
    """List all action items for a meeting."""
    items = action_item_service.list_action_items(db, meeting_id)
    if items is None:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return items


@meeting_router.post("", response_model=schemas.ActionItemOut, status_code=status.HTTP_201_CREATED)
def create_action_item(
    meeting_id: int,
    payload: schemas.ActionItemCreate,
    db: Session = Depends(get_db),
):
    """Create a new action item for a meeting."""
    item = action_item_service.create_action_item(db, meeting_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return item


@item_router.patch("/{item_id}", response_model=schemas.ActionItemOut)
def update_action_item(
    item_id: int,
    payload: schemas.ActionItemUpdate,
    db: Session = Depends(get_db),
):
    """Update an action item (text, assignee, due_date, completed)."""
    item = action_item_service.update_action_item(db, item_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
    return item


@item_router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_action_item(item_id: int, db: Session = Depends(get_db)):
    """Delete an action item."""
    deleted = action_item_service.delete_action_item(db, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Action item not found")
