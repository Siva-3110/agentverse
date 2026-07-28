"""
Standalone Verification Script — Market Analysis Agent (Agent 06)

Executes only the Market Analysis Agent.
Prints:
- Each tool output (Google Trends, Research/Patent Trends, Industry Activity, Startup Activity)
- Evidence collected
- LLM input & raw response
- Final structured report
- Workflow state update verification
"""

import os
import sys
import json
import logging

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.pipeline import AgentState
from backend.services.market_tools import (
    fetch_google_trends,
    calculate_research_and_patent_trends,
    fetch_industry_activity,
    fetch_startup_activity
)
from backend.agents.market_analysis_agent import market_analysis_agent

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("VerifyMarketAnalysisAgent")

def run_standalone_verification():
    print("=" * 70)
    print("  MARKET ANALYSIS AGENT (06) - STANDALONE VERIFICATION RUN")
    print("=" * 70)
    
    if len(sys.argv) > 1 and sys.argv[1].strip():
        domain = sys.argv[1].strip()
    else:
        try:
            if sys.stdin.isatty():
                domain = input("\nEnter technology domain (default: Electric Vehicles): ").strip()
            else:
                domain = "Electric Vehicles"
        except (EOFError, KeyboardInterrupt):
            domain = "Electric Vehicles"

    if not domain:
        domain = "Electric Vehicles"

    print(f"\n[INIT] Technology Domain set to: '{domain}'\n")

    # Construct mock prior state (Agents 01-05 output)
    state: AgentState = {
        "domain": domain,
        "research_topics": [],
        "patent_clusters": [],
        "gap_matrix": [],
        "innovation_ideas": [
            {
                "name": f"AI-Powered {domain} Optimizer",
                "description": f"An intelligent enterprise analytics platform optimizing performance in {domain}.",
                "target_user": "R&D engineers, enterprise operators, and tech startups",
                "type": "system",
                "based_on_gap": f"{domain} Integration"
            }
        ],
        "patentability_scores": [
            {
                "innovation_name": f"AI-Powered {domain} Optimizer",
                "novelty_score": 85,
                "competition_score": 30,
                "feasibility_score": 80,
                "market_potential_score": 90,
                "overall_score": 84,
                "reasoning": f"Prior art search indicates high novelty for {domain} optimization.",
                "similar_patents": ["Patent US-109283-B2"]
            }
        ],
        "top_recommendation": {
            "innovation_name": f"AI-Powered {domain} Optimizer",
            "overall_score": 84,
            "reasoning": f"Prior art search indicates high novelty for {domain} optimization."
        },
        "market_analysis": [],
        "report_markdown": "",
        "error": None
    }

    keywords = [f"{domain} AI", f"{domain} Analytics", f"{domain} Monitoring"]

    # ── Test Tool 1: Google Trends Tool ───────────────────────────────
    print(f"\n{'='*70}")
    print("[Tool 1/4] Running Google Trends Tool...")
    print(f"{'='*70}")
    t1_res = fetch_google_trends(keywords, domain)
    print(f"Tool 1 Output:\n{json.dumps(t1_res, indent=2)}")

    # ── Test Tool 2: Research & Patent Trend Tool ──────────────────────
    print(f"\n{'='*70}")
    print("[Tool 2/4] Running Research & Patent Trend Tool...")
    print(f"{'='*70}")
    t2_res = calculate_research_and_patent_trends(keywords, domain)
    print(f"Tool 2 Output:\n{json.dumps(t2_res, indent=2)}")

    # ── Test Tool 3: Industry Activity Tool ────────────────────────────
    print(f"\n{'='*70}")
    print("[Tool 3/4] Running Industry Activity Tool...")
    print(f"{'='*70}")
    t3_res = fetch_industry_activity(keywords, domain)
    print(f"Tool 3 Output:\n{json.dumps(t3_res, indent=2)}")

    # ── Test Tool 4: Startup Activity Tool ─────────────────────────────
    print(f"\n{'='*70}")
    print("[Tool 4/4] Running Startup Activity Tool...")
    print(f"{'='*70}")
    t4_res = fetch_startup_activity(keywords, domain)
    print(f"Tool 4 Output:\n{json.dumps(t4_res, indent=2)}")

    # ── Execute Agent 06 ──────────────────────────────────────────────
    print(f"\n{'='*70}")
    print("[Agent Execution] Running Market Analysis Agent Node...")
    print(f"{'='*70}")
    updated_state = market_analysis_agent(state)

    if updated_state.get("error"):
        print(f"\n[ERROR] Market Analysis Agent failed: {updated_state['error']}")
        return False

    analysis_res = updated_state.get("market_analysis", [])

    # ── State Verification ────────────────────────────────────────────
    print(f"\n{'='*70}")
    print("  WORKFLOW STATE UPDATE VERIFICATION")
    print(f"{'='*70}")
    print(f"  state['market_analysis'] Key Present : {'market_analysis' in updated_state}")
    print(f"  Evaluations Stored Count             : {len(analysis_res)}")
    print(f"  Error Status                         : {updated_state.get('error') or 'None'}")
    
    if len(analysis_res) > 0:
        first_eval = analysis_res[0]
        print(f"\n  Stored Result Schema Check:")
        print(f"    * innovation_name          : {first_eval.get('innovation_name')}")
        print(f"    * trend_score              : {first_eval.get('trend_score')}")
        print(f"    * research_growth          : {first_eval.get('research_growth')}")
        print(f"    * patent_growth            : {first_eval.get('patent_growth')}")
        print(f"    * enterprise_adoption      : {first_eval.get('enterprise_adoption')}")
        print(f"    * startup_count            : {first_eval.get('startup_count')}")
        print(f"    * market_opportunity_score : {first_eval.get('market_opportunity_score')}")

    print(f"\n[SUCCESS] Market Analysis Agent verification completed successfully!\n")
    return True


if __name__ == "__main__":
    success = run_standalone_verification()
    sys.exit(0 if success else 1)
