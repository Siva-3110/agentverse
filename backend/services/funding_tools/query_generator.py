"""
Query Generator Service (Tool 1 for Funding Opportunity Agent)

Generates dynamic, targeted search queries combining innovation name, domain, country, 
and startup stage across government grants, research grants, incubators, accelerators,
VC firms, angel networks, and innovation competitions.
"""

import logging
from typing import List, Dict, Any

logger = logging.getLogger("FundingQueryGenerator")

def generate_funding_queries(
    innovation_name: str,
    domain: str,
    country: str = "India",
    startup_stage: str = "Prototype"
) -> List[Dict[str, str]]:
    """
    Generates multi-angle search query variations tailored to the target innovation, country, and stage.
    Returns a list of dicts with 'query' and 'category'.
    """
    logger.info(f"[Query Generator] Generating funding search queries for '{innovation_name}' ({domain}, {country}, {startup_stage})...")
    
    clean_domain = domain.strip()
    clean_country = country.strip()
    clean_stage = startup_stage.strip()
    
    # Core search variations across categories
    query_templates = [
        {"category": "Government Grant", "query": f"{clean_domain} {clean_stage} startup grants {clean_country}"},
        {"category": "Government Grant", "query": f"{clean_domain} government innovation grant {clean_country}"},
        {"category": "Incubator", "query": f"{clean_domain} startup incubator {clean_country}"},
        {"category": "Accelerator", "query": f"{clean_domain} AI accelerator program {clean_country}"},
        {"category": "Venture Capital", "query": f"{clean_domain} seed venture capital {clean_country}"},
        {"category": "Competition", "query": f"{clean_domain} tech startup competition {clean_country}"},
        {"category": "Research Grant", "query": f"{clean_domain} commercialization research grant"}
    ]
    
    # Specific high-value query targets for India or Global
    if "india" in clean_country.lower():
        query_templates.extend([
            {"category": "Government Grant", "query": f"Startup India Seed Fund Scheme {clean_domain}"},
            {"category": "Government Grant", "query": f"BIRAC BIG grant {clean_domain}"},
            {"category": "Incubator", "query": f"IIT Madras T-Hub Forge incubator {clean_domain}"}
        ])
    else:
        query_templates.extend([
            {"category": "Accelerator", "query": f"NVIDIA Inception AWS Activate Techstars {clean_domain}"},
            {"category": "Venture Capital", "query": f"Y Combinator seed fund {clean_domain}"}
        ])
        
    logger.info(f"[Query Generator] Generated {len(query_templates)} search queries.")
    return query_templates
