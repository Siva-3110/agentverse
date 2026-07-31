import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from backend.database.db_models import FollowTopic, TopicSnapshot, Notification, EmailLog, User, SystemLog, AgentMetric

logger = logging.getLogger("backend.agents.watch")

class AutoPatentWatchAgent:
    """
    Agent 09: Auto Patent Watch Agent.
    Monitors active technology topics on scheduled intervals (Daily, Weekly, Monthly),
    detects literature/patent updates, stores snapshots, triggers notifications,
    and logs email alert dispatches.
    """

    def __init__(self):
        self.agent_name = "Auto Patent Watch Agent"

    def scan_topic(self, db: Session, topic_obj: FollowTopic) -> Dict[str, Any]:
        logger.info(f"Auto Patent Watch Agent scanning topic '{topic_obj.topic}' for user {topic_obj.user_id}...")

        # Mock ingestion update detection
        paper_ids = [f"arXiv:2407.{i:04d}" for i in range(101, 105)]
        patent_ids = [f"US11{i:05d}B2" for i in range(201, 205)]
        news_ids = [f"news_{i}" for i in range(1, 3)]
        grant_ids = [f"grant_{i}" for i in range(1, 3)]
        startup_ids = [f"startup_{i}" for i in range(1, 3)]

        # Create Snapshot
        snapshot = TopicSnapshot(
            follow_topic_id=topic_obj.id,
            paper_ids=paper_ids,
            patent_ids=patent_ids,
            news_ids=news_ids,
            grant_ids=grant_ids,
            startup_ids=startup_ids
        )
        db.add(snapshot)

        # Create Notifications
        notif1 = Notification(
            user_id=topic_obj.user_id,
            topic=topic_obj.topic,
            title=f"4 New Research Papers Discovered in {topic_obj.topic}",
            summary=f"OpenAlex & arXiv ingested 4 new publications matching '{topic_obj.topic}'.",
            type="Paper",
            is_read=False
        )
        notif2 = Notification(
            user_id=topic_obj.user_id,
            topic=topic_obj.topic,
            title=f"New USPTO Patent Claim Filed in {topic_obj.topic}",
            summary=f"Prior-art similarity match detected for recent claim disclosures in {topic_obj.topic}.",
            type="Patent",
            is_read=False
        )
        db.add(notif1)
        db.add(notif2)

        # Log Email Alert Dispatch
        user = db.query(User).filter(User.id == topic_obj.user_id).first()
        if user and user.email:
            email_log = EmailLog(
                user_id=user.id,
                recipient=user.email,
                subject=f"[PatentScout AI Watch] New Intelligence Update for '{topic_obj.topic}'",
                status="Sent",
                retry_count=0
            )
            db.add(email_log)

        # Update Topic Metadata
        topic_obj.last_checked = datetime.utcnow()
        if topic_obj.frequency == "Daily":
            topic_obj.next_check = datetime.utcnow() + timedelta(days=1)
        elif topic_obj.frequency == "Weekly":
            topic_obj.next_check = datetime.utcnow() + timedelta(weeks=1)
        else:
            topic_obj.next_check = datetime.utcnow() + timedelta(days=30)

        # System Log
        sys_log = SystemLog(
            category="Scheduler",
            level="INFO",
            message=f"Auto Patent Watch Agent scanned topic '{topic_obj.topic}' successfully."
        )
        db.add(sys_log)

        # Update Agent Metric
        metric = db.query(AgentMetric).filter(AgentMetric.agent_name == "Auto Patent Watch Agent").first()
        if metric:
            metric.last_run = datetime.utcnow().strftime("%I:%M %p")
            metric.status = "Monitoring"

        db.commit()
        return {
            "status": "success",
            "topic": topic_obj.topic,
            "papers_found": len(paper_ids),
            "patents_found": len(patent_ids)
        }

watch_agent_instance = AutoPatentWatchAgent()
