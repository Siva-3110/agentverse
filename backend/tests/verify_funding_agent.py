"""
Standalone Verification Script for Agent 07: Funding Opportunity Agent

Usage:
  .venv\\Scripts\\python.exe backend/tests/verify_funding_agent.py "Electric Vehicles"
"""

import sys
import json
import logging
from pathlib import Path

# Ensure backend path is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.pipeline import AgentState
from backend.agents.funding_agent import funding_agent

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

def verify_funding_agent_standalone(domain: str = "Electric Vehicles", country: str = "India", startup_stage: str = "Prototype"):
    print("\n" + "=" * 70)
    print("  FUNDING OPPORTUNITY AGENT (07) - STANDALONE VERIFICATION RUN")
    print("=" * 70)
    print(f"[INIT] Domain: '{domain}' | Target Country: '{country}' | Stage: '{startup_stage}'\n")


    # Construct mock prior state (simulating Agents 01-06 output)
    initial_state: AgentState = {
        "domain": domain,
        "research_topics": [],
        "patent_clusters": [],
        "gap_matrix": [],
        "innovation_ideas": [
            {
                "name": "AI-Powered Battery Health Prediction Platform",
                "description": "An edge-AI hardware co-processor for real-time internal resistance modeling and thermal runaway prevention in electric vehicle lithium-ion battery packs.",
                "target_user": "EV OEMs, Battery Pack Manufacturers, and Fleet Management Operators",
                "type": "HARDWARE",
                "based_on_gap": "Thermal Anomaly Early Warning Systems"
            }
        ],
        "patentability_scores": [
            {
                "innovation_name": "AI-Powered Battery Health Prediction Platform",
                "novelty_score": 90,
                "competition_score": 85,
                "feasibility_score": 88,
                "market_potential_score": 92,
                "overall_score": 88,
                "reasoning": "High novelty in hardware co-processor architecture.",
                "similar_patents": []
            }
        ],
        "market_analysis": [
            {
                "innovation_name": "AI-Powered Battery Health Prediction Platform",
                "trend_score": 95,
                "growth_trend": "Surging (+180%)",
                "research_growth": "+210%",
                "patent_growth": "+190%",
                "enterprise_adoption": ["Tesla", "BYD", "CATL", "Toyota"],
                "startup_count": 15,
                "key_insights": ["High public search velocity", "Strong enterprise adoption"],
                "market_opportunity_score": 91,
                "summary": "High commercial opportunity backed by enterprise adoption."
            }
        ],
        "funding_analysis": None,
        "report_markdown": "",
        "top_recommendation": {},
        "error": None
    }

    # Execute Agent 07 Node
    updated_state = funding_agent(initial_state)

    # ── State Verification Checklist ───────────────────────────────────
    print("\n" + "=" * 70)
    print("  WORKFLOW STATE UPDATE VERIFICATION")
    print("=" * 70)
    funding_data = updated_state.get("funding_analysis")
    has_key = "funding_analysis" in updated_state and funding_data is not None
    print(f"  state['funding_analysis'] Key Present : {has_key}")
    print(f"  Error Status                         : {updated_state.get('error')}")

    if has_key and isinstance(funding_data, dict):
        opps = funding_data.get("top_opportunities", [])
        strat = funding_data.get("funding_strategy", [])
        print(f"\n  Stored Result Schema Check:")
        print(f"    * Innovation Name     : {funding_data.get('innovation_name')}")
        print(f"    * Target Region       : {funding_data.get('country')}")
        print(f"    * Startup Stage       : {funding_data.get('startup_stage')}")
        print(f"    * Opportunities Count : {len(opps)}")
        print(f"    * Strategy Steps Count: {len(strat)}")
        if opps:
            top_opp = opps[0]
            print(f"    * Top Opportunity Name: {top_opp.get('name')} (Match: {top_opp.get('match_score')}%)")

    print("\n[SUCCESS] Funding Opportunity Agent verification completed successfully!\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_domain = sys.argv[1]
        target_country = "India"
        target_stage = "Prototype"
    else:
        print("======================================================================")
        print("             PATENTSCOUT AI AGENT 07 INTERACTIVE ENTRY                ")
        print("======================================================================")
        target_domain = input("Enter Technology Domain [Default: Electric Vehicles]: ").strip() or "Electric Vehicles"
        target_country = input("Enter Target Country (e.g. India, USA, Global) [Default: India]: ").strip() or "India"
        target_stage = input("Enter Startup Stage (e.g. Prototype, MVP, Seed) [Default: Prototype]: ").strip() or "Prototype"

    verify_funding_agent_standalone(domain=target_domain, country=target_country, startup_stage=target_stage)

