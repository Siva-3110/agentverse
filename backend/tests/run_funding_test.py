"""
Full 7-Agent Pipeline End-to-End Test Script (Agents 01 -> 07)

Usage:
  .venv\\Scripts\\python.exe backend/tests/run_funding_test.py "Electric Vehicles"
"""

import sys
import json
import logging
from pathlib import Path

# Ensure backend path is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.agents.workflow import run_patentscout_pipeline

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

def main():
    if len(sys.argv) > 1:
        domain = sys.argv[1]
    else:
        print("======================================================================")
        print("                PATENTSCOUT AI INTERACTIVE ENTRY                      ")
        print("======================================================================")
        user_input = input("Enter Technology Domain (e.g. Electric Vehicles, Quantum Computing, Artificial Intelligence) [Default: Electric Vehicles]: ").strip()
        domain = user_input if user_input else "Electric Vehicles"

    print("\n" + "=" * 70)
    print("  PatentScout AI - 7-Agent End-to-End Pipeline Verification Run")
    print(f"  Domain: {domain}")
    print("=" * 70 + "\n")


    result = run_patentscout_pipeline(domain=domain)


    if not result.get("success"):
        print(f"\n[FAIL] Pipeline execution failed: {result.get('error')}")
        sys.exit(1)

    funding_res = result.get("funding_analysis", {})
    top_opps = funding_res.get("top_opportunities", []) if isinstance(funding_res, dict) else []

    # Accuracy checks
    checks = [
        ("Has Research Topics", len(result.get("research_topics", [])) > 0),
        ("Has Patent Clusters", len(result.get("patent_clusters", [])) > 0),
        ("Has Technology Gaps", len(result.get("gap_matrix", [])) > 0),
        ("Has Innovation Ideas", len(result.get("innovation_ideas", [])) > 0),
        ("Has Patentability Scores", len(result.get("patentability_scores", [])) > 0),
        ("Has Market Reports", len(result.get("market_analysis", [])) > 0),
        ("Has Funding Analysis Result", isinstance(funding_res, dict) and "innovation_name" in funding_res),
        ("Has Ranked Opportunities", len(top_opps) > 0),
        ("Has Valid Match Scores", all(o.get("match_score", 0) >= 70 for o in top_opps)),
        ("Has Funding Strategy Roadmap", len(funding_res.get("funding_strategy", [])) > 0)
    ]

    passed_count = sum(1 for _, p in checks if p)
    total_checks = len(checks)
    accuracy_pct = (passed_count / total_checks) * 100

    print("\n" + "=" * 70)
    print("  ACCURACY EVALUATION - AGENTS 01 TO 07")
    print("=" * 70)
    for title, status in checks:
        icon = "[PASS]" if status else "[FAIL]"
        print(f"  {icon:<7} {title}")

    print("\n" + "=" * 70)
    print("  FINAL RESULTS")
    print("=" * 70)
    print(f"  Domain                   : {domain}")
    print(f"  Research Topics          : {len(result.get('research_topics', []))}")
    print(f"  Patent Clusters          : {len(result.get('patent_clusters', []))}")
    print(f"  Technology Gaps          : {len(result.get('gap_matrix', []))}")
    print(f"  Innovation Ideas         : {len(result.get('innovation_ideas', []))}")
    print(f"  Patentability Evals      : {len(result.get('patentability_scores', []))}")
    print(f"  Market Reports Generated : {len(result.get('market_analysis', []))}")
    print(f"  Funding Pathways         : {len(top_opps)}")
    print(f"  Checks Passed            : {passed_count}/{total_checks}")
    print(f"\n  >>> FUNDING AGENT INTEGRATION ACCURACY: {accuracy_pct:.1f}% <<<")
    print("=" * 70 + "\n")

    if accuracy_pct == 100.0:
        print("[SUCCESS] All 7 agents executed with 100% accuracy!")

if __name__ == "__main__":
    main()
