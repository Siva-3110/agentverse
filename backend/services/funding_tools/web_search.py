"""
Web Search Service (Tool 2 for Funding Opportunity Agent)

Searches official funding portals and web pages using:
1. Tavily Search API (if TAVILY_API_KEY present)
2. SerpAPI (if SERPAPI_API_KEY present)
3. Direct Search Fallback targeting official funding portals.

Collects and returns clean official website URLs, titles, and snippets.
Does NOT infer funding details at this stage.
"""

import os
import urllib.parse
import logging
import requests
import xml.etree.ElementTree as ET
from typing import List, Dict, Any
from backend.config import settings

logger = logging.getLogger("FundingWebSearch")

OFFICIAL_PORTAL_REGISTRY = [
    {
        "name": "Startup India Seed Fund Scheme",
        "organization": "Government of India",
        "category": "Government Grant",
        "url": "https://seedfund.startupindia.gov.in",
        "domain": "all",
        "country": "India",
        "snippet": "Startup India Seed Fund Scheme provides financial assistance to startups for proof of concept, prototype development, product trials, and market entry."
    },
    {
        "name": "BIRAC Biotechnology Ignition Grant (BIG)",
        "organization": "Biotechnology Industry Research Assistance Council",
        "category": "Government Grant",
        "url": "https://birac.nic.in/big.php",
        "domain": "Biotechnology",
        "country": "India",
        "snippet": "BIRAC BIG scheme offers grants up to INR 50 Lakhs for early-stage biotech and hardware-tech innovations."
    },
    {
        "name": "MeitY SAMRIDH Scheme",
        "organization": "Ministry of Electronics and IT",
        "category": "Government Grant",
        "url": "https://meitystartups.in",
        "domain": "all",
        "country": "India",
        "snippet": "MeitY SAMRIDH provides matching grant support and acceleration to tech startups."
    },
    {
        "name": "NVIDIA Inception Program",
        "organization": "NVIDIA",
        "category": "Accelerator",
        "url": "https://www.nvidia.com/en-us/startups/",
        "domain": "all",
        "country": "Global",
        "snippet": "NVIDIA Inception provides AI and deep-tech startups with free GPU cloud credits, technical support, and venture capital exposure."
    },
    {
        "name": "Google for Startups Accelerator",
        "organization": "Google",
        "category": "Accelerator",
        "url": "https://startup.google.com/accelerator/",
        "domain": "all",
        "country": "Global",
        "snippet": "Google for Startups Accelerator brings Google's AI mentorship, Cloud credits, and product expertise to high-potential startups."
    },
    {
        "name": "AWS Activate Program",
        "organization": "Amazon Web Services",
        "category": "Startup Program",
        "url": "https://aws.amazon.com/activate/",
        "domain": "all",
        "country": "Global",
        "snippet": "AWS Activate offers up to $100,000 in AWS Cloud promotional credits, technical support, and training for startups."
    },
    {
        "name": "Forge Forward Innovation Accelerator",
        "organization": "Forge Innovation & Ventures",
        "category": "Incubator",
        "url": "https://www.forgeforward.in",
        "domain": "all",
        "country": "India",
        "snippet": "Forge incubates and accelerates hardware, deep-tech, and AI innovations with seed grants and prototyping infrastructure."
    },
    {
        "name": "T-Hub Hyderabad",
        "organization": "T-Hub Foundation",
        "category": "Incubator",
        "url": "https://t-hub.co",
        "domain": "all",
        "country": "India",
        "snippet": "T-Hub leads innovation acceleration, corporate partnerships, and investor connect programs for technology startups."
    },
    {
        "name": "IIT Madras Incubation Cell (IITMIC)",
        "organization": "IIT Madras",
        "category": "Incubator",
        "url": "https://www.incubation.iitm.ac.in",
        "domain": "all",
        "country": "India",
        "snippet": "IIT Madras Incubation Cell provides deep-tech hardware incubation, R&D labs, seed capital, and mentorship."
    },
    {
        "name": "Techstars Mobility & AI Accelerator",
        "organization": "Techstars",
        "category": "Accelerator",
        "url": "https://www.techstars.com/accelerators",
        "domain": "all",
        "country": "Global",
        "snippet": "Techstars accelerator invests up to $120,000 in early-stage tech startups with worldwide investor mentorship."
    },
    {
        "name": "Y Combinator Startup Accelerator",
        "organization": "Y Combinator",
        "category": "Accelerator",
        "url": "https://www.ycombinator.com",
        "domain": "all",
        "country": "Global",
        "snippet": "Y Combinator invests $500,000 in early-stage technology startups across bi-annual batch programs."
    }
]

def search_funding_web(query_item: Dict[str, str], domain: str, country: str = "India") -> List[Dict[str, str]]:
    """
    Searches for official funding website URLs based on query item.
    Returns list of dicts with 'title', 'url', 'snippet', 'category'.
    """
    query = query_item.get("query", "")
    category = query_item.get("category", "Government Grant")
    logger.info(f"[Web Search] Searching web for query: '{query}'...")
    
    tavily_key = settings.TAVILY_API_KEY
    serp_key = settings.SERPAPI_API_KEY
    results = []

    # 1. Tavily Search API
    if tavily_key:
        try:
            resp = requests.post(
                "https://api.tavily.com/search",
                json={"api_key": tavily_key, "query": query, "search_depth": "basic", "max_results": 5},
                timeout=10
            )
            if resp.status_code == 200:
                data = resp.json()
                for item in data.get("results", []):
                    results.append({
                        "title": item.get("title", ""),
                        "url": item.get("url", ""),
                        "snippet": item.get("content", ""),
                        "category": category
                    })
                if results:
                    logger.info(f"[Web Search] Tavily returned {len(results)} search results.")
                    return results
        except Exception as e:
            logger.warning(f"[Web Search] Tavily Search warning: {e}")

    # 2. SerpAPI Search
    if serp_key:
        try:
            resp = requests.get(
                "https://serpapi.com/search",
                params={"q": query, "api_key": serp_key, "num": 5},
                timeout=10
            )
            if resp.status_code == 200:
                data = resp.json()
                for item in data.get("organic_results", []):
                    results.append({
                        "title": item.get("title", ""),
                        "url": item.get("link", ""),
                        "snippet": item.get("snippet", ""),
                        "category": category
                    })
                if results:
                    logger.info(f"[Web Search] SerpAPI returned {len(results)} search results.")
                    return results
        except Exception as e:
            logger.warning(f"[Web Search] SerpAPI warning: {e}")

    # 3. Direct Search Fallback / Registry Matcher
    logger.info(f"[Web Search] Using direct official portal search fallback for '{query}'...")
    for portal in OFFICIAL_PORTAL_REGISTRY:
        p_country = portal["country"].lower()
        p_domain = portal["domain"].lower()
        
        country_match = (p_country == "global" or p_country in country.lower())
        domain_match = (p_domain == "all" or p_domain in domain.lower() or domain.lower() in p_domain)
        
        if country_match and domain_match:
            results.append({
                "title": f"{portal['name']} ({portal['organization']})",
                "url": portal["url"],
                "snippet": portal["snippet"],
                "category": portal["category"]
            })

    logger.info(f"[Web Search] Extracted {len(results)} official funding portal links.")
    return results[:5]
