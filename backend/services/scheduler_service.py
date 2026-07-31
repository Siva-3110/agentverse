import time
import threading
import logging
from datetime import datetime

from backend.database.database import SessionLocal
from backend.database.db_models import FollowTopic, AgentMetric, SystemLog
from backend.agents.watch_agent import watch_agent_instance

logger = logging.getLogger("backend.scheduler")

_scheduler_running = False
_scheduler_thread = None

def run_scheduler_loop():
    global _scheduler_running
    logger.info("Auto Patent Watch Background Scheduler initialized.")
    
    while _scheduler_running:
        try:
            db = SessionLocal()
            try:
                now = datetime.utcnow()
                active_topics = db.query(FollowTopic).filter(
                    FollowTopic.status == "Active",
                    FollowTopic.next_check <= now
                ).all()

                for topic in active_topics:
                    try:
                        watch_agent_instance.scan_topic(db, topic)
                    except Exception as ex:
                        logger.error(f"Error scanning topic {topic.topic}: {ex}")

            finally:
                db.close()
        except Exception as e:
            logger.error(f"Scheduler loop exception: {e}")
        
        # Sleep for 60 seconds between checks
        time.sleep(60)

def start_scheduler():
    global _scheduler_running, _scheduler_thread
    if not _scheduler_running:
        _scheduler_running = True
        _scheduler_thread = threading.Thread(target=run_scheduler_loop, daemon=True)
        _scheduler_thread.start()
        logger.info("Auto Patent Watch Scheduler started in background thread.")

def stop_scheduler():
    global _scheduler_running
    _scheduler_running = False
