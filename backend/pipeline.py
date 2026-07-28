from typing import TypedDict, List, Optional
from pydantic import BaseModel, Field

class ResearchTopic(BaseModel):
    topic: str = Field(..., description="Short descriptive name of the topic")
    description: str = Field(..., description="Explanation of the research focus")
    research_activity: str = Field(..., description="Activity level, e.g. High, Medium, Low")
    citation_strength: int = Field(..., description="Average citations or relative volume score")

class PatentCluster(BaseModel):
    category: str = Field(..., description="Name of the patent category")
    description: str = Field(..., description="Detailed explanation of the patent cluster focus")
    saturation: str = Field(..., description="Patent density/saturation level (High, Medium, Low)")
    major_assignees: List[str] = Field(default_factory=list, description="Top companies or institutions holding patents in this area")

class AgentState(TypedDict):
    domain: str
    research_topics: List[dict]
    patent_clusters: List[dict]
    gap_matrix: List[dict]
    innovation_ideas: List[dict]
    patentability_scores: List[dict]
    market_analysis: List[dict]
    report_markdown: str
    top_recommendation: dict
    error: Optional[str]


class InnovationIdea(BaseModel):
    name: str
    description: str
    target_user: str
    type: str
    based_on_gap: str

class PatentabilityScore(BaseModel):
    innovation_name: str = Field(..., description="Name of the innovation evaluated")
    novelty_score: int = Field(..., description="Novelty score (0-100)")
    competition_score: int = Field(..., description="Competition score (0-100)")
    feasibility_score: int = Field(..., description="Technical feasibility score (0-100)")
    market_potential_score: int = Field(..., description="Market potential score (0-100)")
    overall_score: int = Field(..., description="Overall calculated score (0-100)")
    reasoning: str = Field(..., description="Reasoning and prior art explanation")
    similar_patents: List[str] = Field(default_factory=list, description="List of similar patent citations")

class MarketAnalysisResult(BaseModel):
    innovation_name: str = Field(..., description="Name of the innovation evaluated")
    trend_score: int = Field(..., description="Google Trends score (0-100)")
    growth_trend: str = Field(..., description="Growth trend status (e.g., Increasing, Surging)")
    research_growth: str = Field(..., description="Research publication growth (e.g. +285%)")
    patent_growth: str = Field(..., description="Patent filing growth (e.g. +240%)")
    enterprise_adoption: List[str] = Field(default_factory=list, description="Top enterprises adopting or investing")
    startup_count: int = Field(..., description="Number of active startups in ecosystem")
    key_insights: List[str] = Field(default_factory=list, description="4 core market insights")
    market_opportunity_score: int = Field(..., description="Calculated overall market opportunity score (0-100)")
    summary: str = Field(..., description="Executive summary of market potential")
