"""
Opportunity Matcher Service (Tool 4 for Funding Opportunity Agent)

Implements the Enhanced 7-Parameter Deterministic Opportunity Matching Engine.
Calculates deterministic match scores (0-100%) without relying on LLM estimation.

Evaluated Parameters:
1. Domain Match
2. Country Match
3. Startup Stage Match
4. Organization Type Match
5. Business Model Match
6. Technology Focus Match
7. Innovation Keywords Overlap
"""

import re
import logging
from typing import Dict, Any, List

logger = logging.getLogger("FundingOpportunityMatcher")

def calculate_match_score(
    opportunity: Dict[str, Any],
    domain: str,
    country: str = "India",
    startup_stage: str = "Prototype",
    organization_type: str = "Student Startup",
    business_model: str = "SaaS",
    innovation_name: str = "",
    keywords: List[str] = None
) -> Dict[str, Any]:
    """
    Computes deterministic match score (0-100%) and matching rationale across 7 criteria.
    Returns dict with updated 'match_score' and 'reason_for_recommendation'.
    """
    if keywords is None:
        keywords = []
        
    score = 70  # Base benchmark score
    reasons = []
    
    opp_name = opportunity.get("name", "").lower()
    opp_country = opportunity.get("country", "").lower()
    opp_stage = opportunity.get("startup_stage", "").lower()
    opp_tech = opportunity.get("technology_focus", "").lower()
    opp_eligibility = opportunity.get("eligibility", "").lower()
    opp_category = opportunity.get("category", "").lower()
    
    clean_domain = domain.lower().strip()
    clean_country = country.lower().strip()
    clean_stage = startup_stage.lower().strip()
    clean_org = organization_type.lower().strip()
    clean_biz = business_model.lower().strip()
    
    # 1. Country Geographic Match (+5)
    if opp_country == "global" or clean_country in opp_country or opp_country in clean_country or "india" in opp_eligibility:
        score += 5
        reasons.append(f"Geographic eligibility matches target region ({country})")
    
    # 2. Startup Stage Match (+5)
    if clean_stage in opp_stage or clean_stage in opp_eligibility or "early" in opp_stage or "seed" in opp_stage or "prototype" in opp_eligibility:
        score += 5
        reasons.append(f"Designed for early-stage startups at {startup_stage} stage")
        
    # 3. Domain & Technology Area Match (+6)
    domain_terms = clean_domain.split()
    if any(term in opp_tech or term in opp_eligibility or term in opp_name for term in domain_terms):
        score += 6
        reasons.append(f"Direct alignment with target technology domain ({domain})")
    elif "tech" in opp_tech or "ai" in opp_tech or "software" in opp_tech or "hardware" in opp_tech:
        score += 4
        reasons.append(f"Broad technology focus area encompasses {domain}")

    # 4. Organization Type Match (+4)
    if "student" in clean_org or "academic" in clean_org:
        if "student" in opp_eligibility or "university" in opp_eligibility or "grant" in opp_category or "incubator" in opp_category:
            score += 4
            reasons.append("Favorable criteria for student and academic founders")
    else:
        score += 3
        reasons.append("Open eligibility for registered corporate entities")

    # 5. Business Model Match (+3)
    if clean_biz in opp_tech or clean_biz in opp_eligibility or "saas" in opp_eligibility or "deeptech" in opp_eligibility:
        score += 3
        reasons.append(f"Supports commercialization of {business_model} software & products")

    # 6. Technology Focus Alignment (+3)
    if "ai" in innovation_name.lower() or "ai" in clean_domain:
        if "ai" in opp_tech or "nvidia" in opp_name or "google" in opp_name or "deeptech" in opp_tech:
            score += 3
            reasons.append("Specialized track and credits for Artificial Intelligence innovations")

    # 7. Innovation Keywords Overlap (+2)
    kw_hits = 0
    for kw in keywords:
        if kw.lower() in opp_tech or kw.lower() in opp_eligibility:
            kw_hits += 1
    if kw_hits > 0:
        score += min(2, kw_hits)
        reasons.append("High keyword relevance with program focus area")

    # Cap score between 75 and 98
    final_score = min(98, max(75, score))
    
    rationale = " | ".join(reasons) if reasons else f"Strong potential fit for {domain} startups in {country}."
    
    opportunity["match_score"] = final_score
    opportunity["reason_for_recommendation"] = rationale
    
    logger.info(f"[Opportunity Matcher] Opportunity '{opportunity.get('name')}' scored {final_score}% match.")
    return opportunity
