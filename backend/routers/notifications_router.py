from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.database.db_models import User, Notification
from backend.services.auth_service import require_auth

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

class MarkReadRequest(BaseModel):
    notification_ids: Optional[List[str]] = None
    all: Optional[bool] = False

@router.get("")
def get_notifications(current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    notifs = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()
    unread_count = db.query(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False).count()

    return {
        "unread_count": unread_count,
        "notifications": [{
            "id": n.id,
            "topic": n.topic,
            "title": n.title,
            "summary": n.summary,
            "type": n.type,
            "is_read": n.is_read,
            "created_at": n.created_at
        } for n in notifs]
    }

@router.put("/read")
def mark_notifications_read(payload: MarkReadRequest, current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    if payload.all:
        db.query(Notification).filter(Notification.user_id == current_user.id).update({"is_read": True})
    elif payload.notification_ids:
        db.query(Notification).filter(Notification.user_id == current_user.id, Notification.id.in_(payload.notification_ids)).update({"is_read": True}, synchronize_session=False)
    
    db.commit()
    return {"message": "Notifications marked as read."}

@router.delete("")
def delete_notifications(current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Notifications cleared."}
