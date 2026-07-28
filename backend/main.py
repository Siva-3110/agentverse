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

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("FastAPIServer")

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
    description="REST backend for PatentScout AI multi-agent discovery pipeline",
    version="1.0.0"
)

# Enable CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    domain: str

@app.get("/api/health")
async def health_check():
    """
    Endpoint 1: Health Monitoring
    Verifies connection status of Gemini API, ChromaDB and agent imports.
    """
    logger.info("Executing System Health Check...")
    
    # Check if Google API Key is configured
    gemini_ready = bool(settings.GOOGLE_API_KEY)
    
    # Check if ChromaDB is installed and configuration dir is present
    chromadb_ready = False
    try:
        import chromadb
        chromadb_ready = True
    except ImportError:
        pass
        
    # Verify imports of all 4 agents
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
    """
    Endpoint 3: GET /api/logs
    Returns recent logs stored in the MemoryLogHandler.
    """
    return {"logs": memory_log_handler.logs}

@app.post("/api/analyze")
def analyze_domain(request: AnalyzeRequest):
    """
    Endpoint 2: POST /api/analyze
    Receives domain query, runs the discovery workflow, and returns the real outputs.
    """
    # Clear the log buffer for a fresh run
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
