import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=True)
    country = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    organization = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    role = Column(String(50), default="Researcher", nullable=False) # "Researcher" or "Admin"
    profile_image = Column(Text, nullable=True)
    password_hash = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    followed_topics = relationship("FollowTopic", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    jwt_token = Column(Text, nullable=False)
    login_time = Column(DateTime, default=datetime.utcnow)
    logout_time = Column(DateTime, nullable=True)
    ip_address = Column(String(50), nullable=True)
    device = Column(String(100), nullable=True)
    browser = Column(String(100), nullable=True)

    user = relationship("User", back_populates="sessions")

class FollowTopic(Base):
    __tablename__ = "follow_topics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    topic = Column(String(255), nullable=False)
    frequency = Column(String(50), default="Daily") # Daily, Weekly, Monthly
    status = Column(String(50), default="Active") # Active, Paused
    last_checked = Column(DateTime, default=datetime.utcnow)
    next_check = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="followed_topics")
    snapshots = relationship("TopicSnapshot", back_populates="topic_ref", cascade="all, delete-orphan")

class TopicSnapshot(Base):
    __tablename__ = "topic_snapshots"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    follow_topic_id = Column(String(36), ForeignKey("follow_topics.id"), nullable=False)
    paper_ids = Column(JSON, default=list)
    patent_ids = Column(JSON, default=list)
    news_ids = Column(JSON, default=list)
    grant_ids = Column(JSON, default=list)
    startup_ids = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    topic_ref = relationship("FollowTopic", back_populates="snapshots")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    topic = Column(String(255), nullable=True)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    type = Column(String(50), default="Paper") # Paper, Patent, Funding, Market
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class EmailLog(Base):
    __tablename__ = "email_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True)
    recipient = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    status = Column(String(50), default="Sent") # Sent, Pending, Failed
    sent_at = Column(DateTime, default=datetime.utcnow)
    retry_count = Column(Integer, default=0)
    failure_reason = Column(Text, nullable=True)

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    topic = Column(String(255), nullable=False)
    report_path = Column(String(512), nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reports")

class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category = Column(String(50), nullable=False) # Auth, API, Scheduler, LLM, Error
    level = Column(String(20), default="INFO") # INFO, WARN, ERROR
    message = Column(Text, nullable=False)
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AgentMetric(Base):
    __tablename__ = "agent_metrics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    agent_name = Column(String(100), unique=True, nullable=False)
    status = Column(String(50), default="Online") # Online, Monitoring, Offline
    avg_response_time = Column(String(20), default="2.1s")
    last_run = Column(String(50), default="Just now")
    success_rate = Column(String(20), default="99.4%")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
