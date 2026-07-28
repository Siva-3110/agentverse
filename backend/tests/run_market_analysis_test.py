import sys
import json
import logging

sys.path.insert(0, '.')

# Suppress verbose logging during test run
logging.basicConfig(level=logging.WARNING)

from backend.pipeline import AgentState
from backend.agents.research_agent import research_agent
from backend.agents.patent_agent import patent_agent
from backend.agents.gap_analysis_agent import gap_analysis_agent
from backend.agents.innovation_agent import innovation_agent
from backend.agents.patentability_agent import patentability_agent
from backend.agents.market_analysis_agent import market_analysis_agent

if len(sys.argv) > 1 and sys.argv[1].strip():
    DOMAIN = sys.argv[1].strip()
else:
    print("Supported domains: Artificial Intelligence, Biotechnology, Renewable Energy, Cybersecurity, Smart Cities, Electric Vehicles")
    try:
        if sys.stdin.isatty():
            DOMAIN = input("Enter technology domain to analyze (default: Electric Vehicles): ").strip()
        else:
            DOMAIN = "Electric Vehicles"
    except (EOFError, KeyboardInterrupt):
        DOMAIN = "Electric Vehicles"

if not DOMAIN:
    DOMAIN = "Electric Vehicles"

print("=" * 70)
print("  PatentScout AI - Market Analysis Agent Verification Run")
print(f"  Domain: {DOMAIN}")
print("=" * 70)

state: AgentState = {
    "domain": DOMAIN,
    "research_topics": [],
    "patent_clusters": [],
    "gap_matrix": [],
    "innovation_ideas": [],
    "patentability_scores": [],
    "market_analysis": [],
    "report_markdown": "",
    "top_recommendation": {},
    "error": None
}

# ── Step 1: Research Agent ──────────────────────────────────────────────
print("\n[Step 1/6] Running Research Agent...")
state = research_agent(state)
topics = state.get("research_topics", [])
print(f"  -> Research Topics: {len(topics)} | Error: {state.get('error')}")

# ── Step 2: Patent Agent ────────────────────────────────────────────────
print("\n[Step 2/6] Running Patent Agent...")
state = patent_agent(state)
clusters = state.get("patent_clusters", [])
print(f"  -> Patent Clusters: {len(clusters)} | Error: {state.get('error')}")

# ── Step 3: Gap Analysis Agent ──────────────────────────────────────────
print("\n[Step 3/6] Running Gap Analysis Agent...")
state = gap_analysis_agent(state)
gaps = state.get("gap_matrix", [])
print(f"  -> Technology Gaps: {len(gaps)} | Error: {state.get('error')}")

# ── Step 4: Innovation Agent ───────────────────────────────────────────
print("\n[Step 4/6] Running Innovation Agent...")
state = innovation_agent(state)
ideas = state.get("innovation_ideas", [])
print(f"  -> Innovation Ideas: {len(ideas)} | Error: {state.get('error')}")

# ── Step 5: Patentability Agent ─────────────────────────────────────────
print("\n[Step 5/6] Running Patentability Assessment Agent...")
state = patentability_agent(state)
patentability_evals = state.get("patentability_scores", [])
print(f"  -> Patentability Evaluations: {len(patentability_evals)} | Error: {state.get('error')}")

# ── Step 6: Market Analysis Agent ───────────────────────────────────────
print("\n[Step 6/6] Running Market Analysis Agent...")
state = market_analysis_agent(state)
market_evals = state.get("market_analysis", [])
print(f"  -> Market Analysis Reports: {len(market_evals)} | Error: {state.get('error')}")

# ── Accuracy Evaluation ─────────────────────────────────────────────────
print("\n" + "=" * 70)
print("  ACCURACY EVALUATION")
print("=" * 70)

total_checks = 0
passed_checks = 0

for i, score in enumerate(market_evals, 1):
    name = score.get("innovation_name", f"Evaluation #{i}")
    print(f"\n  Idea #{i}: {name}")
    
    # Check 1: Innovation Name
    total_checks += 1
    if name and len(name) > 3:
        passed_checks += 1
        print("    [PASS] Has Innovation Name")
    else:
        print("    [FAIL] Missing Innovation Name")

    # Check 2: Valid Trend Score (0-100)
    total_checks += 1
    t_score = score.get("trend_score")
    if isinstance(t_score, int) and 0 <= t_score <= 100:
        passed_checks += 1
        print(f"    [PASS] Has Valid Google Trends Score ({t_score}/100)")
    else:
        print("    [FAIL] Invalid Google Trends Score")

    # Check 3: Valid Research Growth format
    total_checks += 1
    rg = score.get("research_growth", "")
    if rg and ("%" in rg or "+" in rg):
        passed_checks += 1
        print(f"    [PASS] Has Valid Research Growth Metric ({rg})")
    else:
        print("    [FAIL] Invalid Research Growth Metric")

    # Check 4: Valid Patent Growth format
    total_checks += 1
    pg = score.get("patent_growth", "")
    if pg and ("%" in pg or "+" in pg):
        passed_checks += 1
        print(f"    [PASS] Has Valid Patent Growth Metric ({pg})")
    else:
        print("    [FAIL] Invalid Patent Growth Metric")

    # Check 5: Enterprise Adoption List
    total_checks += 1
    ea = score.get("enterprise_adoption", [])
    if isinstance(ea, list) and len(ea) > 0:
        passed_checks += 1
        print(f"    [PASS] Has Enterprise Adoption List ({', '.join(ea[:3])})")
    else:
        print("    [FAIL] Missing Enterprise Adoption")

    # Check 6: Active Startup Count
    total_checks += 1
    sc = score.get("startup_count")
    if isinstance(sc, int) and sc > 0:
        passed_checks += 1
        print(f"    [PASS] Has Active Startup Ecosystem Count ({sc} Startups)")
    else:
        print("    [FAIL] Invalid Startup Count")

    # Check 7: Key Insights List
    total_checks += 1
    insights = score.get("key_insights", [])
    if isinstance(insights, list) and len(insights) >= 3:
        passed_checks += 1
        print(f"    [PASS] Has {len(insights)} Key Insights")
    else:
        print("    [FAIL] Missing Key Insights")

    # Check 8: Overall Market Opportunity Score (0-100)
    total_checks += 1
    mkt_score = score.get("market_opportunity_score")
    if isinstance(mkt_score, int) and 0 <= mkt_score <= 100:
        passed_checks += 1
        print(f"    [PASS] Has Valid Market Opportunity Score ({mkt_score}/100)")
    else:
        print("    [FAIL] Invalid Market Opportunity Score")

accuracy_pct = (passed_checks / total_checks * 100) if total_checks > 0 else 0.0

if accuracy_pct >= 90:
    grade = "EXCELLENT"
elif accuracy_pct >= 75:
    grade = "GOOD"
else:
    grade = "NEEDS IMPROVEMENT"

print("\n" + "=" * 70)
print("  FINAL RESULTS")
print("=" * 70)
print(f"  Domain                   : {DOMAIN}")
print(f"  Research Topics          : {len(topics)}")
print(f"  Patent Clusters          : {len(clusters)}")
print(f"  Technology Gaps          : {len(gaps)}")
print(f"  Innovation Ideas         : {len(ideas)}")
print(f"  Patentability Evals      : {len(patentability_evals)}")
print(f"  Market Reports Generated : {len(market_evals)}")
print(f"  Checks Passed            : {passed_checks}/{total_checks}")
print(f"\n  >>> MARKET ANALYSIS AGENT ACCURACY: {accuracy_pct:.1f}% <<<")
print(f"\n  Quality Grade            : {grade}")
print("=" * 70)

print("\nMARKET ANALYSIS REPORTS (Full Detail):")
print(json.dumps(market_evals, indent=2))
