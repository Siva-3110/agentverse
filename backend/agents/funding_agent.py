"""
Funding Opportunity Agent (Agent 07 for PatentScout AI)

Position: Step 7 in the PatentScout AI Agent Workflow (runs after Market Analysis Agent).

Objective:
Behaves like an AI Funding Advisor that dynamically discovers, extracts, evaluates,
ranks, and recommends funding opportunities that best match the generated innovation concept.

Outputs:
Stores complete structured result using FundingAnalysisResult model in state["funding_analysis"].
"""

import os
import json
import logging
from typing import Dict, Any, List

from backend.pipeline import AgentState, FundingOpportunity, FundingAnalysisResult
from backend.services.llm_client import generate_response
from backend.services.funding_tools.query_generator import generate_funding_queries
from backend.services.funding_tools.web_search import search_funding_web
from backend.services.funding_tools.web_extractor import extract_webpage_content
from backend.services.funding_tools.opportunity_matcher import calculate_match_score
from backend.services.funding_tools.opportunity_ranker import rank_funding_opportunities

logger = logging.getLogger("FundingOpportunityAgent")

# Pre-defined official opportunity fallbacks if web scraping yields insufficient items
OFFICIAL_FUNDING_CATALOG = [
    {
        "name": "Startup India Seed Fund Scheme (SISFS)",
        "organization": "Government of India",
        "category": "Government Grant",
        "funding_amount": "Up to ₹20 Lakhs (Grant) + ₹50 Lakhs (Debt/Convertible)",
        "country": "India",
        "eligibility": "Early-stage registered startups at Prototype / Proof of Concept stage",
        "technology_focus": "Hardware, AI, Mobility, CleanTech, SaaS, Healthcare",
        "startup_stage": "Prototype",
        "benefits": ["Grant Capital", "Incubation Support", "Market Entry Mentorship"],
        "deadline": "Rolling / Open Application",
        "official_website": "https://seedfund.startupindia.gov.in"
    },
    {
        "name": "NVIDIA Inception Accelerator Program",
        "organization": "NVIDIA",
        "category": "Accelerator",
        "funding_amount": "$100,000 in GPU Cloud Credits & Technical Mentorship",
        "country": "Global",
        "eligibility": "AI, Deep-Tech, and Autonomous Systems startups at any stage",
        "technology_focus": "Artificial Intelligence, Computer Vision, Robotics, Autonomous Vehicles",
        "startup_stage": "Prototype",
        "benefits": ["Free GPU Cloud Credits", "Technical Deep Dives", "VC Connect Days"],
        "deadline": "Rolling / Open Application",
        "official_website": "https://www.nvidia.com/en-us/startups/"
    },
    {
        "name": "Forge Forward Deep-Tech Innovation Accelerator",
        "organization": "Forge Innovation & Ventures",
        "category": "Incubator",
        "funding_amount": "Up to ₹50 Lakhs Prototype Grant & Seed Capital",
        "country": "India",
        "eligibility": "Hardware, Deep-Tech, and AI startups developing novel physical/digital products",
        "technology_focus": "Electric Vehicles, Clean Energy, Robotics, AI Sensors",
        "startup_stage": "Prototype",
        "benefits": ["Hardware Lab Access", "Prototyping Grants", "Corporate Pilot Connects"],
        "deadline": "Rolling / Open Application",
        "official_website": "https://www.forgeforward.in"
    },
    {
        "name": "Google for Startups Accelerator",
        "organization": "Google",
        "category": "Accelerator",
        "funding_amount": "Equity-Free Support + $100,000 Google Cloud Credits",
        "country": "Global",
        "eligibility": "High-potential technology startups using Machine Learning / Cloud",
        "technology_focus": "AI/ML, SaaS, CleanTech, Smart Mobility",
        "startup_stage": "Prototype",
        "benefits": ["Dedicated Google AI Mentors", "Cloud Credits", "Leadership Training"],
        "deadline": "Bi-Annual Batches",
        "official_website": "https://startup.google.com/accelerator/"
    },
    {
        "name": "IIT Madras Incubation Cell (IITMIC)",
        "organization": "IIT Madras",
        "category": "Incubator",
        "funding_amount": "Up to ₹25 Lakhs Seed Loan & Incubation Support",
        "country": "India",
        "eligibility": "Deep-tech, engineering, and student/faculty-led innovation startups",
        "technology_focus": "Electric Mobility, Battery Tech, Artificial Intelligence, Energy",
        "startup_stage": "Prototype",
        "benefits": ["Advanced R&D Labs", "IIT Faculty Advisory", "Office Space & Patent Support"],
        "deadline": "Rolling / Open Application",
        "official_website": "https://www.incubation.iitm.ac.in"
    }
]

def load_prompt_template(filepath: str) -> str:
    """Loads prompt text from specified filepath."""
    if not os.path.exists(filepath):
        logger.error(f"Prompt file missing: {filepath}")
        return ""
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read().strip()

def funding_agent(state: AgentState) -> AgentState:
    """
    Executes Agent 07: Funding Opportunity Agent.
    """
    logger.info("Executing Agent 07: Funding Opportunity Agent...")
    
    domain = state.get("domain", "Electric Vehicles")
    ideas = state.get("innovation_ideas", [])
    scores = state.get("patentability_scores", [])
    market_reports = state.get("market_analysis", [])
    
    if not ideas:
        state["error"] = "No innovation ideas found in state to evaluate funding for."
        logger.error(state["error"])
        return state

    top_idea = ideas[0]
    idea_name = top_idea.get("name", "AI-Powered Innovation")
    idea_desc = top_idea.get("description", "")
    country = "India"
    startup_stage = "Prototype"
    organization_type = "Student Startup"
    business_model = "SaaS"

    patentability_score = scores[0].get("overall_score", 88) if scores else 88
    market_score = market_reports[0].get("market_opportunity_score", 90) if market_reports else 90

    print("\n" + "=" * 70)
    print(f"  FUNDING OPPORTUNITY AGENT (07) - EVALUATION RUN")
    print(f"  Evaluating Concept: '{idea_name}'")
    print(f"  Domain: {domain} | Country: {country} | Stage: {startup_stage}")
    print("=" * 70 + "\n")

    # ── Step 1: Generate Search Queries ────────────────────────────────
    logger.info("[Step 1/8] Generating intelligent search queries...")
    queries = generate_funding_queries(idea_name, domain, country, startup_stage)
    print(f"Generated {len(queries)} Targeted Search Queries:")
    for q in queries[:4]:
        print(f"  * [{q['category']}] {q['query']}")

    # ── Step 2: Search Web & Retrieve Official URLs ────────────────────
    logger.info("[Step 2/8] Executing web search for official portal URLs...")
    discovered_urls = []
    for q_item in queries[:3]:
        search_results = search_funding_web(q_item, domain, country)
        for r in search_results:
            discovered_urls.append(r)

    print(f"\nDiscovered {len(discovered_urls)} Official Funding Portal URLs.")

    # ── Step 3 & 4: Web Extraction & LLM Structured JSON Parsing ───────
    logger.info("[Step 3/8] Extracting webpage content & parsing structured JSON...")
    extraction_prompt_template = load_prompt_template(os.path.join("backend", "prompts", "funding_extraction.txt"))
    extracted_opportunities = []

    for item in discovered_urls[:3]:
        url = item.get("url", "")
        cat = item.get("category", "Government Grant")
        snippet = item.get("snippet", "")

        print(f"\n  [Web Extractor Chain] Fetching webpage: {url[:60]}...")
        web_text = extract_webpage_content(url, snippet)

        if extraction_prompt_template and len(web_text) > 80:
            prompt = extraction_prompt_template.format(
                url=url,
                category=cat,
                webpage_text=web_text[:2500]
            )
            raw_json = generate_response(prompt)
            try:
                clean_str = raw_json.strip()
                if clean_str.startswith("```json"): clean_str = clean_str[7:]
                if clean_str.endswith("```"): clean_str = clean_str[:-3]
                clean_str = clean_str.strip()

                s_idx = clean_str.find("{")
                e_idx = clean_str.rfind("}")
                if s_idx != -1 and e_idx != -1:
                    clean_str = clean_str[s_idx:e_idx+1]
                
                parsed_opp = json.loads(clean_str)
                if isinstance(parsed_opp, dict) and parsed_opp.get("name"):
                    extracted_opportunities.append(parsed_opp)
            except Exception as j_err:
                logger.warning(f"Structured extraction JSON parse warning for {url}: {j_err}")

    # Fallback to catalog items if fewer than 3 extracted
    if len(extracted_opportunities) < 3:
        for cat_item in OFFICIAL_FUNDING_CATALOG:
            if len(extracted_opportunities) >= 5:
                break
            extracted_opportunities.append(cat_item.copy())

    print(f"\nCollected {len(extracted_opportunities)} Structured Opportunity Candidates.")

    # ── Step 6: Deterministic 7-Parameter Opportunity Matching ─────────
    logger.info("[Step 6/8] Computing deterministic match scores (7 Parameters)...")
    matched_opportunities = []
    for opp in extracted_opportunities:
        scored_opp = calculate_match_score(
            opportunity=opp,
            domain=domain,
            country=country,
            startup_stage=startup_stage,
            organization_type=organization_type,
            business_model=business_model,
            innovation_name=idea_name,
            keywords=[domain, idea_name, "AI", "Software"]
        )
        matched_opportunities.append(scored_opp)

    # ── Step 7: Ranking Engine ─────────────────────────────────────────
    logger.info("[Step 7/8] Ranking opportunities descending by Match Score...")
    ranked_opportunities = rank_funding_opportunities(matched_opportunities, top_k=4)

    # ── Step 8: LLM Funding Strategy Synthesis ─────────────────────────
    logger.info("[Step 8/8] Synthesizing Funding Strategy & Roadmap via LLM...")
    strategy_prompt_template = load_prompt_template(os.path.join("backend", "prompts", "funding_strategy.txt"))
    funding_strategy_list = []
    summary_text = "Phased funding pathway leveraging early non-dilutive grants followed by tech acceleration and seed venture investment."

    if strategy_prompt_template:
        strategy_prompt = strategy_prompt_template.format(
            innovation_name=idea_name,
            domain=domain,
            country=country,
            startup_stage=startup_stage,
            business_model=business_model,
            patentability_score=patentability_score,
            market_opportunity_score=market_score,
            ranked_opportunities_json=json.dumps(ranked_opportunities, indent=2)
        )
        raw_strat = generate_response(strategy_prompt)
        try:
            clean_strat = raw_strat.strip()
            if clean_strat.startswith("```json"): clean_strat = clean_strat[7:]
            if clean_strat.endswith("```"): clean_strat = clean_strat[:-3]
            clean_strat = clean_strat.strip()

            s_idx = clean_strat.find("{")
            e_idx = clean_strat.rfind("}")
            if s_idx != -1 and e_idx != -1:
                clean_strat = clean_strat[s_idx:e_idx+1]

            parsed_strat = json.loads(clean_strat)
            if isinstance(parsed_strat, dict):
                funding_strategy_list = parsed_strat.get("funding_strategy", [])
                summary_text = parsed_strat.get("summary", summary_text)
        except Exception as s_err:
            logger.warning(f"Funding strategy parse warning: {s_err}")

    # Fallback funding strategy if LLM parse empty
    if not funding_strategy_list and ranked_opportunities:
        funding_strategy_list = [
            {
                "phase": "Phase 1: Early Non-Dilutive Grant",
                "program_name": ranked_opportunities[0].get("name", "Government Seed Fund"),
                "action": "Submit proposal for prototype development & initial validation."
            },
            {
                "phase": "Phase 2: Deep-Tech Acceleration",
                "program_name": ranked_opportunities[1].get("name", "NVIDIA Inception") if len(ranked_opportunities) > 1 else "Tech Accelerator",
                "action": "Apply to accelerator for GPU cloud credits, technical advisory & mentor connect."
            },
            {
                "phase": "Phase 3: Hardware / Tech Incubation",
                "program_name": ranked_opportunities[2].get("name", "Forge Incubator") if len(ranked_opportunities) > 2 else "Regional Incubator",
                "action": "Join incubator cell for lab space, prototyping equipment & legal advisory."
            },
            {
                "phase": "Phase 4: Seed Venture Capital",
                "program_name": "Seed Venture Capital / Angel Network",
                "action": "Pitch to venture partners to scale commercial market entry."
            }
        ]

    # Convert opportunities to FundingOpportunity Pydantic objects
    validated_opps = []
    for item in ranked_opportunities:
        val_item = FundingOpportunity(
            name=item.get("name", "Official Grant"),
            organization=item.get("organization", "Host Provider"),
            category=item.get("category", "Government Grant"),
            funding_amount=item.get("funding_amount", "Grant Support"),
            country=item.get("country", country),
            eligibility=item.get("eligibility", "Early-stage startups"),
            technology_focus=item.get("technology_focus", domain),
            startup_stage=item.get("startup_stage", startup_stage),
            benefits=item.get("benefits", ["Mentorship", "Funding", "Networking"]),
            deadline=item.get("deadline", "Rolling / Open Application"),
            official_website=item.get("official_website", "https://startupindia.gov.in"),
            match_score=item.get("match_score", 90),
            reason_for_recommendation=item.get("reason_for_recommendation", "Direct domain and stage match.")
        )
        validated_opps.append(val_item)

    # Validate full FundingAnalysisResult model
    final_result = FundingAnalysisResult(
        innovation_name=idea_name,
        domain=domain,
        country=country,
        startup_stage=startup_stage,
        top_opportunities=validated_opps,
        funding_strategy=funding_strategy_list,
        summary=summary_text
    )

    # Print Formatted ASCII Terminal Box Output
    print("\n" + "=" * 65)
    print("        RECOMMENDED FUNDING & ACCELERATION PATHWAYS")
    print("=" * 65)
    print(f"Innovation Name : {final_result.innovation_name}")
    print(f"Domain / Stage  : {final_result.domain} | {final_result.startup_stage} Stage ({final_result.country})")
    print("-" * 65)
    
    for idx, opp in enumerate(final_result.top_opportunities, 1):
        safe_amount = opp.funding_amount.replace('₹', 'INR ')
        safe_reason = opp.reason_for_recommendation.replace('₹', 'INR ')
        print(f"\n{idx}. {opp.name}")
        print(f"   Category        : {opp.category}")
        print(f"   Provider        : {opp.organization}")
        print(f"   Funding Support : {safe_amount}")
        print(f"   Match Score     : {opp.match_score}%")
        print(f"   Why Recommended : {safe_reason}")
        print(f"   Official Website: {opp.official_website}")


    print("\n" + "-" * 65)
    print("COMMERCIALIZATION FUNDING STRATEGY:")
    for step in final_result.funding_strategy:
        print(f"  * [{step.get('phase')}] {step.get('program_name')}")
        print(f"    Action: {step.get('action')}")
    print("=" * 65 + "\n")

    # Store in shared state using FundingAnalysisResult dict
    state["funding_analysis"] = final_result.model_dump()
    state["error"] = None
    logger.info("Funding Opportunity Agent completed successfully.")
    return state
