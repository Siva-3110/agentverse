import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from backend.database.database import get_db
from backend.database.db_models import User, Report
from backend.services.auth_service import require_auth
from backend.report_agent import ReportGenerationAgent

router = APIRouter(prefix="/api/reports", tags=["Reports"])

class GenerateReportRequest(BaseModel):
    domain: str
    recipient_email: Optional[str] = None
    pipeline_state: Optional[dict] = None

@router.get("")
def get_reports(current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    reports = db.query(Report).filter(Report.user_id == current_user.id).order_by(Report.generated_at.desc()).all()
    return [{
        "id": r.id,
        "topic": r.topic,
        "report_path": r.report_path,
        "generated_at": r.generated_at
    } for r in reports]

@router.post("/generate")
def generate_report(payload: GenerateReportRequest, current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    import logging
    logger = logging.getLogger("reports_router")

    domain = payload.domain or "Emerging Technology"
    email = payload.recipient_email or (current_user.email if current_user else None)
    state = payload.pipeline_state or {"domain": domain}

    # Build a friendly greeting name from DB
    user_name = "Researcher"
    if current_user:
        parts = []
        if current_user.first_name:
            parts.append(current_user.first_name)
        if current_user.last_name:
            parts.append(current_user.last_name)
        if parts:
            user_name = " ".join(parts)

    logger.info(f"Report email → recipient: {email}  user: {getattr(current_user,'username','?')}  name: {user_name}")

    agent = ReportGenerationAgent()
    res = agent.execute(state, recipient_email=email, user_name=user_name)

    if not res.get("success"):
        raise HTTPException(status_code=500, detail=res.get("error", "Report generation failed."))

    # Save to database
    report_record = Report(
        user_id=current_user.id if current_user else "usr-1",
        topic=domain,
        report_path=res.get("pdf_path", "")
    )
    db.add(report_record)
    db.commit()
    db.refresh(report_record)

    res["id"] = report_record.id
    # Expose the actual recipient in the response so the frontend toast shows it
    if isinstance(res.get("email_status"), dict):
        res["email_status"]["recipient"] = email
    return res

@router.get("/download/{report_id}")
def download_report(report_id: str, current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report or not report.report_path or not os.path.exists(report.report_path):
        # Fallback to latest generated file in temp directory if exact ID record missing
        temp_dir = os.path.join(os.path.expanduser("~"), "AppData", "Local", "Temp")
        matching = [os.path.join(temp_dir, f) for f in os.listdir(temp_dir) if f.startswith("PatentScout_Report") and f.endswith(".pdf")]
        if matching:
            latest_pdf = max(matching, key=os.path.getmtime)
            return FileResponse(latest_pdf, filename=os.path.basename(latest_pdf), media_type="application/pdf")
        raise HTTPException(status_code=404, detail="PDF report file not found on server.")

    return FileResponse(
        report.report_path,
        filename=os.path.basename(report.report_path),
        media_type="application/pdf"
    )

@router.get("/{report_id}")
def get_report_detail(report_id: str, current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == current_user.id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    return {
        "id": report.id,
        "topic": report.topic,
        "report_path": report.report_path,
        "generated_at": report.generated_at
    }

@router.delete("/{report_id}")
def delete_report(report_id: str, current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == current_user.id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")

    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully."}
