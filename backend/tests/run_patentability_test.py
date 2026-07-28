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
print("  PatentScout AI - Patentability Agent Verification Run")
print(f"  Domain: {DOMAIN}")
print("=" * 70)

state: AgentState = {
    "domain": DOMAIN,
    "research_topics": [],
    "patent_clusters": [],
    "gap_matrix": [],
    "innovation_ideas": [],
    "patentability_scores": [],
    "report_markdown": "",
    "top_recommendation": {},
    "error": None
}

# ── Step 1: Research Agent ──────────────────────────────────────────────
print("\n[Step 1/5] Running Research Agent...")
state = research_agent(state)
topics = state.get("research_topics", [])
print(f"  -> Research Topics: {len(topics)} | Error: {state.get('error')}")

# ── Step 2: Patent Agent ────────────────────────────────────────────────
print("\n[Step 2/5] Running Patent Agent...")
state = patent_agent(state)
clusters = state.get("patent_clusters", [])
print(f"  -> Patent Clusters: {len(clusters)} | Error: {state.get('error')}")

# ── Step 3: Gap Analysis Agent ──────────────────────────────────────────
print("\n[Step 3/5] Running Gap Analysis Agent...")
state = gap_analysis_agent(state)
gaps = state.get("gap_matrix", [])
print(f"  -> Technology Gaps: {len(gaps)} | Error: {state.get('error')}")

# ── Step 4: Innovation Agent ───────────────────────────────────────────
print("\n[Step 4/5] Running Innovation Agent...")
state = innovation_agent(state)
ideas = state.get("innovation_ideas", [])
print(f"  -> Innovation Ideas: {len(ideas)} | Error: {state.get('error')}")

# ── Step 5: Patentability Agent ─────────────────────────────────────────
print("\n[Step 5/5] Running Patentability Assessment Agent...")
state = patentability_agent(state)
evaluations = state.get("patentability_scores", [])
print(f"  -> Patentability Evaluations: {len(evaluations)} | Error: {state.get('error')}")

# ── Accuracy Evaluation ─────────────────────────────────────────────────
print("\n" + "=" * 70)
print("  ACCURACY EVALUATION")
print("=" * 70)

total_checks = 0
passed_checks = 0

for i, score in enumerate(evaluations, 1):
    name = score.get("innovation_name", f"Evaluation #{i}")
    print(f"\n  Idea #{i}: {name}")
    
    # Check 1: Meaningful innovation name
    total_checks += 1
    if name and len(name) > 3:
        passed_checks += 1
        print("    [PASS] Has Innovation Name")
    else:
        print("    [FAIL] Missing Innovation Name")

    # Check 2: Valid Novelty Score
    total_checks += 1
    nov = score.get("novelty_score")
    if isinstance(nov, int) and 0 <= nov <= 100:
        passed_checks += 1
        print(f"    [PASS] Has Valid Novelty Score ({nov}/100)")
    else:
        print("    [FAIL] Invalid Novelty Score")

    # Check 3: Valid Competition Score
    total_checks += 1
    comp = score.get("competition_score")
    if isinstance(comp, int) and 0 <= comp <= 100:
        passed_checks += 1
        print(f"    [PASS] Has Valid Competition Score ({comp}/100)")
    else:
        print("    [FAIL] Invalid Competition Score")

    # Check 4: Valid Feasibility Score
    total_checks += 1
    feas = score.get("feasibility_score")
    if isinstance(feas, int) and 0 <= feas <= 100:
        passed_checks += 1
        print(f"    [PASS] Has Valid Feasibility Score ({feas}/100)")
    else:
        print("    [FAIL] Invalid Feasibility Score")

    # Check 5: Valid Market Potential Score
    total_checks += 1
    mkt = score.get("market_potential_score")
    if isinstance(mkt, int) and 0 <= mkt <= 100:
        passed_checks += 1
        print(f"    [PASS] Has Valid Market Potential Score ({mkt}/100)")
    else:
        print("    [FAIL] Invalid Market Potential Score")

    # Check 6: Overall Score Match
    total_checks += 1
    overall = score.get("overall_score")
    expected_overall = round(max(0, min(100, nov * 0.35 + (100 - comp) * 0.25 + feas * 0.20 + mkt * 0.20)))
    if isinstance(overall, int) and abs(overall - expected_overall) <= 1:
        passed_checks += 1
        print(f"    [PASS] Overall Weighted Score Match ({overall}/100)")
    else:
        print(f"    [FAIL] Score Mismatch (Got {overall}, Expected {expected_overall})")

    # Check 7: Detailed Reasoning
    total_checks += 1
    reasoning = score.get("reasoning", "")
    if reasoning and len(reasoning) > 30:
        passed_checks += 1
        print("    [PASS] Has Detailed Reasoning & Prior Art Analysis")
    else:
        print("    [FAIL] Missing or Brief Reasoning")

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
print(f"  Domain                : {DOMAIN}")
print(f"  Research Topics       : {len(topics)}")
print(f"  Patent Clusters       : {len(clusters)}")
print(f"  Technology Gaps       : {len(gaps)}")
print(f"  Innovation Ideas      : {len(ideas)}")
print(f"  Evaluations Scored    : {len(evaluations)}")
print(f"  Checks Passed         : {passed_checks}/{total_checks}")
print(f"\n  >>> PATENTABILITY AGENT ACCURACY: {accuracy_pct:.1f}% <<<")
print(f"\n  Quality Grade         : {grade}")
print("=" * 70)

print("\nPATENTABILITY EVALUATIONS (Full Detail):")
print(json.dumps(evaluations, indent=2))

if evaluations:
    top = evaluations[0]
    print("\n" + "=" * 70)
    print(f"  TOP RECOMMENDATION: {top.get('innovation_name')}")
    print(f"  Overall Patentability Score: {top.get('overall_score')}/100")
    print("=" * 70)
