from .google_trends import fetch_google_trends
from .research_trends import calculate_research_and_patent_trends
from .industry_activity import fetch_industry_activity
from .startup_activity import fetch_startup_activity

__all__ = [
    "fetch_google_trends",
    "calculate_research_and_patent_trends",
    "fetch_industry_activity",
    "fetch_startup_activity"
]
