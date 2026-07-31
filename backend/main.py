import os
import sys
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Ensure parent directory is in search path to locate the 'backend' module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.agents.workflow import run_patentscout_pipeline
from backend.config import settings

# Database & Scheduler Imports
from backend.database.database import engine, Base
from backend.database import db_models
from backend.services.scheduler_service import start_scheduler
from backend.routers import auth_router, topics_router, notifications_router, reports_router, admin_router

# ── Logging Setup (import-time) ──────────────────────────────────────────
# NOTE: uvicorn calls logging.config.dictConfig() AFTER importing this app,
# which would override any uvicorn.* logger settings made here.
# The definitive fix is applied inside startup_event() below.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    stream=sys.stdout
)
logger = logging.getLogger("FastAPIServer")


# Create database tables automatically if missing
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database ORM tables initialized successfully.")
except Exception as ex:
    logger.error(f"Error initializing DB tables: {ex}")

class MemoryLogHandler(logging.Handler):
    def __init__(self):
        super().__init__()
        self.logs = []

    def emit(self, record):
        try:
            msg = self.format(record)
            self.logs.append(msg)
            if len(self.logs) > 500:
                self.logs.pop(0)
        except Exception:
            self.handleError(record)

memory_log_handler = MemoryLogHandler()
memory_log_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s"))
logging.getLogger().addHandler(memory_log_handler)

app = FastAPI(
    title="PatentScout AI API",
    description="REST backend for PatentScout AI multi-agent discovery & user management pipeline",
    version="1.0.0"
)

# Enable CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Authentication, Topics, Notifications, Reports, & Admin Routers
app.include_router(auth_router.router)
app.include_router(topics_router.router)
app.include_router(notifications_router.router)
app.include_router(reports_router.router)
app.include_router(admin_router.router)

# Start Auto Patent Watch Background Scheduler Thread
@app.on_event("startup")
def startup_event():
    # ── Fix uvicorn access logging ────────────────────────────────────────
    # This runs AFTER uvicorn has applied its own dictConfig, so our
    # settings are final and won't be overridden.
    _fmt = logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s")
    _h = logging.StreamHandler(sys.stdout)
    _h.setFormatter(_fmt)

    for _name in ("uvicorn", "uvicorn.error", "uvicorn.access", "uvicorn.asgi"):
        _lg = logging.getLogger(_name)
        _lg.setLevel(logging.INFO)
        # Remove duplicate handlers, then add our single stdout handler
        _lg.handlers.clear()
        _lg.addHandler(_h)
        _lg.propagate = False   # stop double-printing via root

    # Root logger also gets a clean stdout handler
    _root = logging.getLogger()
    _root.setLevel(logging.INFO)
    _root.handlers.clear()
    _root.addHandler(_h)

    print("=" * 65, flush=True)
    print("  PatentScout AI Backend  |  HTTP access logging: ACTIVE", flush=True)
    print("  All requests will appear below as they arrive.", flush=True)
    print("=" * 65, flush=True)

    start_scheduler()

class AnalyzeRequest(BaseModel):
    domain: str

@app.get("/api/health")
async def health_check():
    """
    Health Check Endpoint.
    Verifies connection status of Gemini API, ChromaDB and agent imports.
    """
    logger.info("Executing System Health Check...")
    
    gemini_ready = bool(settings.GOOGLE_API_KEY)
    
    chromadb_ready = False
    try:
        import chromadb
        chromadb_ready = True
    except ImportError:
        pass
        
    agents_ready = False
    try:
        from backend.agents.research_agent import research_agent
        from backend.agents.patent_agent import patent_agent
        from backend.agents.gap_analysis_agent import gap_analysis_agent
        from backend.agents.innovation_agent import innovation_agent
        agents_ready = True
    except ImportError:
        pass
        
    return {
        "status": "healthy",
        "gemini": gemini_ready,
        "chromadb": chromadb_ready,
        "research_agent": agents_ready,
        "patent_agent": agents_ready,
        "gap_analysis_agent": agents_ready,
        "innovation_agent": agents_ready
    }

@app.get("/api/logs")
def get_logs():
    return {"logs": memory_log_handler.logs}

@app.post("/api/analyze")
def analyze_domain(request: AnalyzeRequest):
    memory_log_handler.logs.clear()
    logger.info(f"Received analysis request for domain: '{request.domain}'")
    
    if not request.domain or not request.domain.strip():
        raise HTTPException(status_code=400, detail="Domain query cannot be empty.")
        
    try:
        result = run_patentscout_pipeline(request.domain.strip())
        return result
    except Exception as e:
        logger.exception("Pipeline execution failed with exception.")
        return {
            "success": False,
            "error": f"Pipeline execution failed: {str(e)}"
        }
