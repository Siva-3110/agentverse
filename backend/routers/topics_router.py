from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.database.db_models import User, FollowTopic
from backend.services.auth_service import require_auth
from backend.agents.watch_agent import watch_agent_instance

router = APIRouter(prefix="/api/topics", tags=["Auto Patent Watch Topics"])

class FollowTopicRequest(BaseModel):
    topic: str
    frequency: Optional[str] = "Daily" # Daily, Weekly, Monthly

class UpdateTopicRequest(BaseModel):
    frequency: Optional[str] = None
    status: Optional[str] = None

@router.post("/follow", status_code=status.HTTP_201_CREATED)
def follow_topic(payload: FollowTopicRequest, current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    existing = db.query(FollowTopic).filter(
        FollowTopic.user_id == current_user.id,
        FollowTopic.topic == payload.topic
    ).first()

    if existing:
        existing.status = "Active"
        existing.frequency = payload.frequency or "Daily"
        db.commit()
        return {"message": "Topic monitoring reactivated.", "topic": existing.topic}

    new_topic = FollowTopic(
        user_id=current_user.id,
        topic=payload.topic,
        frequency=payload.frequency or "Daily",
        status="Active",
        last_checked=datetime.utcnow(),
        next_check=datetime.utcnow() + timedelta(days=1)
    )
    db.add(new_topic)
    db.commit()
    db.refresh(new_topic)

    # Trigger immediate baseline scan
    watch_agent_instance.scan_topic(db, new_topic)

    return {"message": "Topic added to Auto Patent Watch.", "id": new_topic.id, "topic": new_topic.topic}

@router.get("")
def get_followed_topics(current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    topics = db.query(FollowTopic).filter(FollowTopic.user_id == current_user.id).all()
    return [{
        "id": t.id,
        "topic": t.topic,
        "frequency": t.frequency,
        "status": t.status,
        "last_checked": t.last_checked,
        "next_check": t.next_check,
        "created_at": t.created_at
    } for t in topics]

@router.put("/{topic_id}")
def update_topic(topic_id: str, payload: UpdateTopicRequest, current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    topic = db.query(FollowTopic).filter(FollowTopic.id == topic_id, FollowTopic.user_id == current_user.id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found.")

    if payload.frequency: topic.frequency = payload.frequency
    if payload.status: topic.status = payload.status
    db.commit()
    return {"message": "Topic updated.", "topic": topic.topic}

@router.delete("/{topic_id}")
def delete_topic(topic_id: str, current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    topic = db.query(FollowTopic).filter(FollowTopic.id == topic_id, FollowTopic.user_id == current_user.id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found.")

    db.delete(topic)
    db.commit()
    return {"message": "Topic removed from Auto Patent Watch."}

@router.post("/{topic_id}/pause")
def pause_topic(topic_id: str, current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    topic = db.query(FollowTopic).filter(FollowTopic.id == topic_id, FollowTopic.user_id == current_user.id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found.")

    topic.status = "Paused"
    db.commit()
    return {"message": f"Monitoring paused for '{topic.topic}'."}

@router.post("/{topic_id}/resume")
def resume_topic(topic_id: str, current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    topic = db.query(FollowTopic).filter(FollowTopic.id == topic_id, FollowTopic.user_id == current_user.id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found.")

    topic.status = "Active"
    db.commit()
    return {"message": f"Monitoring resumed for '{topic.topic}'."}

@router.post("/{topic_id}/scan")
def force_scan_topic(topic_id: str, current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    topic = db.query(FollowTopic).filter(FollowTopic.id == topic_id, FollowTopic.user_id == current_user.id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found.")

    res = watch_agent_instance.scan_topic(db, topic)
    return {"message": f"Force scan completed for '{topic.topic}'.", "results": res}
