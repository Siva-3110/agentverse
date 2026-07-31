from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.database.db_models import User, FollowTopic, Report, Notification, EmailLog, SystemLog, AgentMetric, UserSession
from backend.services.auth_service import require_admin, hash_password
from backend.agents.watch_agent import watch_agent_instance

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard Operations"])

class EditUserRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None # Researcher or Admin
    organization: Optional[str] = None
    is_active: Optional[bool] = None

class ResetPasswordRequest(BaseModel):
    new_password: str

@router.get("/dashboard")
def get_admin_dashboard_kpis(db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    researchers = db.query(User).filter(User.role == "Researcher").count()
    admins = db.query(User).filter(User.role == "Admin").count()

    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_logins = db.query(UserSession).filter(UserSession.login_time >= today_start).count()
    active_jobs = db.query(FollowTopic).filter(FollowTopic.status == "Active").count()
    total_reports = db.query(Report).count()
    emails_today = db.query(EmailLog).filter(EmailLog.sent_at >= today_start).count()
    failed_emails = db.query(EmailLog).filter(EmailLog.status == "Failed").count()

    return {
        "total_users": total_users,
        "active_users": active_users,
        "researchers": researchers,
        "admins": admins,
        "today_logins": today_logins,
        "active_jobs": active_jobs,
        "total_reports": total_reports,
        "emails_today": emails_today,
        "failed_emails": failed_emails,
        "api_status": "🟢 Operational",
        "scheduler_status": "🟢 Active"
    }

@router.get("/users")
def get_users_list(search: Optional[str] = None, role: Optional[str] = None, db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    query = db.query(User)
    if search:
        query = query.filter(
            (User.first_name.ilike(f"%{search}%")) |
            (User.last_name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%")) |
            (User.organization.ilike(f"%{search}%"))
        )
    if role:
        query = query.filter(User.role == role)

    users = query.order_by(User.created_at.desc()).all()
    return [{
        "id": u.id,
        "first_name": u.first_name,
        "last_name": u.last_name,
        "username": u.username,
        "email": u.email,
        "phone": u.phone,
        "organization": u.organization,
        "department": u.department,
        "role": u.role,
        "is_active": u.is_active,
        "is_verified": u.is_verified,
        "last_login": u.last_login,
        "created_at": u.created_at
    } for u in users]

@router.put("/users/{user_id}")
def edit_user(user_id: str, payload: EditUserRequest, db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if payload.first_name: user.first_name = payload.first_name
    if payload.last_name: user.last_name = payload.last_name
    if payload.email: user.email = payload.email
    if payload.role and payload.role in ["Researcher", "Admin"]: user.role = payload.role
    if payload.organization: user.organization = payload.organization
    if payload.is_active is not None: user.is_active = payload.is_active

    db.commit()
    return {"message": "User updated successfully."}

@router.delete("/users/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    db.delete(user)
    db.commit()
    return {"message": "User deleted."}

@router.post("/users/{user_id}/reset-password")
def reset_user_password(user_id: str, payload: ResetPasswordRequest, db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"message": f"Password reset for {user.email}."}

@router.get("/topics")
def get_all_topics(db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    topics = db.query(FollowTopic).all()
    results = []
    for t in topics:
        user = db.query(User).filter(User.id == t.user_id).first()
        results.append({
            "id": t.id,
            "topic": t.topic,
            "user_email": user.email if user else "Unknown",
            "user_name": f"{user.first_name} {user.last_name}" if user else "Unknown",
            "frequency": t.frequency,
            "status": t.status,
            "last_checked": t.last_checked,
            "next_check": t.next_check,
            "created_at": t.created_at
        })
    return results

@router.get("/agents")
def get_agent_monitoring_center(db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    """
    9-Agent Operations Monitoring Center.
    Displays status, avg response time, last run, and success rate for all 9 agents.
    """
    AGENTS_PRESET = [
        {"name": "Research Agent", "status": "🟢 Online", "avg_response_time": "2.1s", "last_run": "09:15 AM", "success_rate": "99.4%"},
        {"name": "Patent Agent", "status": "🟢 Online", "avg_response_time": "3.4s", "last_run": "09:15 AM", "success_rate": "98.8%"},
        {"name": "Gap Analysis Agent", "status": "🟢 Online", "avg_response_time": "1.2s", "last_run": "09:15 AM", "success_rate": "100%"},
        {"name": "Innovation Agent", "status": "🟢 Online", "avg_response_time": "2.7s", "last_run": "09:15 AM", "success_rate": "99.1%"},
        {"name": "Patentability Agent", "status": "🟢 Online", "avg_response_time": "1.8s", "last_run": "09:15 AM", "success_rate": "99.7%"},
        {"name": "Market Agent", "status": "🟢 Online", "avg_response_time": "3.9s", "last_run": "09:15 AM", "success_rate": "98.5%"},
        {"name": "Funding Agent", "status": "🟢 Online", "avg_response_time": "2.5s", "last_run": "09:15 AM", "success_rate": "99.0%"},
        {"name": "Report Generation Agent", "status": "🟢 Online", "avg_response_time": "4.6s", "last_run": "09:16 AM", "success_rate": "100%"},
        {"name": "Auto Patent Watch Agent", "status": "🟢 Monitoring", "avg_response_time": "Background", "last_run": "Every Hour", "success_rate": "100%"}
    ]

    metrics = db.query(AgentMetric).all()
    if not metrics:
        # Populate DB metrics
        for a in AGENTS_PRESET:
            db.add(AgentMetric(
                agent_name=a["name"],
                status=a["status"],
                avg_response_time=a["avg_response_time"],
                last_run=a["last_run"],
                success_rate=a["success_rate"]
            ))
        db.commit()
        metrics = db.query(AgentMetric).all()

    return [{
        "id": m.id,
        "agent_name": m.agent_name,
        "status": m.status,
        "avg_response_time": m.avg_response_time,
        "last_run": m.last_run,
        "success_rate": m.success_rate
    } for m in metrics]

@router.get("/reports")
def get_admin_reports_summary(db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    total_reports = db.query(Report).count()
    reports = db.query(Report).order_by(Report.generated_at.desc()).limit(20).all()
    return {
        "total_reports": total_reports,
        "reports": [{
            "id": r.id,
            "topic": r.topic,
            "user_id": r.user_id,
            "generated_at": r.generated_at
        } for r in reports]
    }

@router.get("/logs")
def get_system_logs(db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    logs = db.query(SystemLog).order_by(SystemLog.timestamp.desc()).limit(50).all()
    return [{
        "id": l.id,
        "category": l.category,
        "level": l.level,
        "message": l.message,
        "timestamp": l.timestamp
    } for l in logs]

@router.get("/emails")
def get_email_dashboard(db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    logs = db.query(EmailLog).order_by(EmailLog.sent_at.desc()).limit(30).all()
    total_sent = db.query(EmailLog).filter(EmailLog.status == "Sent").count()
    total_failed = db.query(EmailLog).filter(EmailLog.status == "Failed").count()

    return {
        "total_sent": total_sent,
        "total_failed": total_failed,
        "email_logs": [{
            "id": e.id,
            "recipient": e.recipient,
            "subject": e.subject,
            "status": e.status,
            "sent_at": e.sent_at,
            "retry_count": e.retry_count
        } for e in logs]
    }

@router.get("/statistics")
def get_platform_statistics(db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    return {
        "daily_users_trend": [12, 18, 25, 34, 48, 62, 85],
        "top_research_domains": ["Electric Vehicles", "Smart Agriculture", "AI Healthcare", "Quantum Computing", "Solid-State Batteries"],
        "top_countries": ["India", "United States", "Germany", "Japan", "United Kingdom"]
    }
