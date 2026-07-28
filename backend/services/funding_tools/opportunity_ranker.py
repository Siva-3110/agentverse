"""
Opportunity Ranker Service (Tool 5 for Funding Opportunity Agent)

Sorts opportunities by deterministic match score (descending), removes duplicate recommendations,
and selects the top funding pathways across categories.
"""

import logging
from typing import List, Dict, Any

logger = logging.getLogger("FundingOpportunityRanker")

def rank_funding_opportunities(opportunities: List[Dict[str, Any]], top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Ranks opportunities descending by match_score and deduplicates based on program name.
    """
    logger.info(f"[Opportunity Ranker] Ranking {len(opportunities)} funding opportunities...")
    
    seen_names = set()
    unique_opps = []
    
    for opp in opportunities:
        name = opp.get("name", "").strip()
        name_key = name.lower()
        if name and name_key not in seen_names:
            seen_names.add(name_key)
            unique_opps.append(opp)
            
    # Sort descending by match_score
    sorted_opps = sorted(unique_opps, key=lambda x: x.get("match_score", 0), reverse=True)
    top_results = sorted_opps[:top_k]
    
    logger.info(f"[Opportunity Ranker] Selected top {len(top_results)} ranked opportunities.")
    return top_results
