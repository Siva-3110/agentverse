"""
Step 1: Data Collector module for Report Generation Agent.
Merges multi-agent pipeline state from Agents 01-07 into a unified, structured ReportContext object.
"""

import logging
from typing import Dict, Any, List

logger = logging.getLogger("ReportAgent.DataCollector")

class DataCollector:
    """
    Collects and validates telemetry outputs from:
    1. Research Agent
    2. Patent Agent
    3. Gap Analysis Agent
    4. Innovation Agent
    5. Patentability Assessment Agent
    6. Market Analysis Agent
    7. Funding Opportunity Agent
    """

    def collect(self, pipeline_state: Dict[str, Any]) -> Dict[str, Any]:
        logger.info("Step 1: Data Collector assembling multi-agent pipeline outputs...")

        domain = pipeline_state.get("domain", "Emerging Tech")
        research_topics = pipeline_state.get("research_topics", [])
        patent_clusters = pipeline_state.get("patent_clusters", [])
        gap_matrix = pipeline_state.get("gap_matrix", [])
        innovation_ideas = pipeline_state.get("innovation_ideas", [])
        patentability_scores = pipeline_state.get("patentability_scores", [])
        market_analysis = pipeline_state.get("market_analysis", [])
        funding_analysis = pipeline_state.get("funding_analysis", {})
        top_recommendation = pipeline_state.get("top_recommendation", {})

        # Calculate aggregated domain scores
        avg_patentability = 85.0
        if patentability_scores and isinstance(patentability_scores, list):
            valid_scores = [s.get("overall_score", 85.0) for s in patentability_scores if isinstance(s, dict)]
            if valid_scores:
                avg_patentability = sum(valid_scores) / len(valid_scores)

        report_context = {
            "domain": domain,
            "agent_outputs": {
                "research": research_topics,
                "patent": patent_clusters,
                "gap": gap_matrix,
                "innovation": innovation_ideas,
                "patentability": patentability_scores,
                "market": market_analysis,
                "funding": funding_analysis,
            },
            "top_recommendation": top_recommendation,
            "metrics": {
                "research_topics_count": len(research_topics),
                "patent_clusters_count": len(patent_clusters),
                "white_space_gaps_count": len(gap_matrix),
                "innovation_candidates_count": len(innovation_ideas),
                "avg_patentability_score": round(avg_patentability, 1),
                "has_funding_matches": bool(funding_analysis)
            }
        }

        logger.info(f"Step 1 Complete: Consolidated context for domain '{domain}' with {len(innovation_ideas)} innovation candidates.")
        return report_context

data_collector_instance = DataCollector()
