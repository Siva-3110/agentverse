import os
import sys
import time
import logging
from typing import Dict, Any



# Ensure parent directory is in search path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.pipeline import AgentState
from backend.agents.research_agent import research_agent
from backend.agents.patent_agent import patent_agent
from backend.agents.gap_analysis_agent import gap_analysis_agent
from backend.agents.innovation_agent import innovation_agent
from backend.agents.patentability_agent import patentability_agent
from backend.agents.market_analysis_agent import market_analysis_agent
from backend.agents.funding_agent import funding_agent

# Configure structured logging

# Logging is configured centrally in backend/main.py
logger = logging.getLogger("WorkflowOrchestrator")

def _log_print(text: str = ""):
    """Prints directly to sys.stdout with flush=True to ensure real-time terminal output during server execution."""
    print(text, flush=True)
    logger.info(text)

def run_patentscout_pipeline(domain: str) -> Dict[str, Any]:
    """
    Unified entry point for the entire PatentScout pipeline.
    Executes agents sequentially and prints/logs formatted execution progress.
    """
    _log_print("=" * 70)
    _log_print(f"  PATENTSCOUT AI PIPELINE EXECUTION FOR: '{domain.upper()}'")
    _log_print("=" * 70)
    
    # Initialize empty AgentState matching baseline schema
    state: AgentState = {
        "domain": domain,
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
    
    # ── Step 1: Research Agent ──────────────────────────────────────────
    _log_print(f"\n[Step 1/6] Executing Agent 01: Research Agent...")
    state = research_agent(state)
    if state.get("error"):
        _log_print(f"[FAIL] Research Agent failed: {state['error']}")
        return {"success": False, "error": f"Research Agent failed: {state['error']}"}
    
    topics = state.get("research_topics", [])
    _log_print(f"[PASS] Research Agent completed: {len(topics)} topics discovered.")
    for t in topics[:5]:
        _log_print(f"   * {t.get('topic')} [Activity: {t.get('research_activity')}, Citation Strength: {t.get('citation_strength')}]")
    time.sleep(1.5)

    # ── Step 2: Patent Agent ────────────────────────────────────────────
    _log_print(f"\n[Step 2/6] Executing Agent 02: Patent Agent...")
    state = patent_agent(state)
    if state.get("error"):
        _log_print(f"[FAIL] Patent Agent failed: {state['error']}")
        return {"success": False, "error": f"Patent Agent failed: {state['error']}"}

    clusters = state.get("patent_clusters", [])
    _log_print(f"[PASS] Patent Agent completed: {len(clusters)} patent clusters mapped.")
    for c in clusters[:5]:
        _log_print(f"   * Category: {c.get('category')} [Saturation: {c.get('saturation')}]")
    time.sleep(1.5)

    # ── Step 3: Gap Analysis Agent ──────────────────────────────────────
    _log_print(f"\n[Step 3/6] Executing Agent 03: Gap Analysis Agent...")
    state = gap_analysis_agent(state)
    if state.get("error"):
        _log_print(f"[FAIL] Gap Analysis Agent failed: {state['error']}")
        return {"success": False, "error": f"Gap Analysis Agent failed: {state['error']}"}

    gaps = state.get("gap_matrix", [])
    _log_print(f"[PASS] Gap Analysis Agent completed: {len(gaps)} technology gaps identified.")
    for g in gaps[:5]:
        _log_print(f"   * [{g.get('opportunity_score')}/100] Area: {g.get('area')} (Research: {g.get('research_activity')} | Patents: {g.get('patent_activity')})")
    time.sleep(1.5)

    # ── Step 4: Innovation Agent ────────────────────────────────────────
    _log_print(f"\n[Step 4/6] Executing Agent 04: Innovation Agent...")
    state = innovation_agent(state)
    if state.get("error"):
        _log_print(f"[FAIL] Innovation Agent failed: {state['error']}")
        return {"success": False, "error": f"Innovation Agent failed: {state['error']}"}

    ideas = state.get("innovation_ideas", [])
    _log_print(f"[PASS] Innovation Agent completed: {len(ideas)} innovation candidates generated.")
    for idea in ideas:
        _log_print(f"   * [{idea.get('type', 'PRODUCT').upper()}] {idea.get('name')}")
        _log_print(f"     Based on Gap: {idea.get('based_on_gap')}")
    time.sleep(1.5)

    # ── Step 5: Patentability Agent ─────────────────────────────────────
    _log_print(f"\n[Step 5/6] Executing Agent 05: Patentability Agent...")
    state = patentability_agent(state)
    if state.get("error"):
        _log_print(f"[FAIL] Patentability Agent failed: {state['error']}")
        return {"success": False, "error": f"Patentability Agent failed: {state['error']}"}

    scores = state.get("patentability_scores", [])
    _log_print(f"[PASS] Patentability Agent completed: {len(scores)} ideas evaluated and ranked.")
    for rank, score in enumerate(scores, 1):
        _log_print(f"   Rank #{rank}: {score.get('innovation_name')} - Overall Score: {score.get('overall_score')}/100 (Novelty: {score.get('novelty_score')}, Competition: {score.get('competition_score')})")
    time.sleep(1.5)

    # ── Step 6: Market Analysis Agent ───────────────────────────────────
    _log_print(f"\n[Step 6/7] Executing Agent 06: Market Analysis Agent...")
    state = market_analysis_agent(state)
    if state.get("error"):
        _log_print(f"[FAIL] Market Analysis Agent failed: {state['error']}")
        return {"success": False, "error": f"Market Analysis Agent failed: {state['error']}"}

    market_reports = state.get("market_analysis", [])
    _log_print(f"[PASS] Market Analysis Agent completed: {len(market_reports)} market reports generated.")
    for r in market_reports:
        _log_print(f"   * {r.get('innovation_name')} - Market Opportunity Score: {r.get('market_opportunity_score')}/100 (Trends: {r.get('trend_score')}, Enterprise Adopters: {', '.join(r.get('enterprise_adoption', [])[:3])})")
    time.sleep(1.5)

    # ── Step 7: Funding Opportunity Agent ───────────────────────────────
    _log_print(f"\n[Step 7/7] Executing Agent 07: Funding Opportunity Agent...")
    state = funding_agent(state)
    if state.get("error"):
        _log_print(f"[FAIL] Funding Opportunity Agent failed: {state['error']}")
        return {"success": False, "error": f"Funding Opportunity Agent failed: {state['error']}"}

    funding_res = state.get("funding_analysis", {})
    top_opps = funding_res.get("top_opportunities", []) if isinstance(funding_res, dict) else []
    _log_print(f"[PASS] Funding Opportunity Agent completed: {len(top_opps)} top funding pathways identified.")
    for o in top_opps:
        safe_amount = str(o.get('funding_amount', '')).replace('₹', 'INR ')
        _log_print(f"   * [{o.get('match_score')}% Match] {o.get('name')} ({o.get('category')}) - Funding: {safe_amount}")


    # ── Step 8: Report Generation Agent ─────────────────────────────────
    _log_print(f"\n[Step 8/8] Executing Agent 08: Report Generation Agent...")
    from backend.report_agent.report_agent import report_agent
    state = report_agent(state)
    report_res = state.get("report_result", {})
    if report_res and report_res.get("pdf_path"):
        _log_print(f"[PASS] Report Generation Agent completed: PDF compiled at '{report_res['pdf_path']}'.")
    else:
        _log_print(f"[WARN] Report Generation Agent completed with warning: {report_res.get('error', 'PDF path unassigned.')}")
    time.sleep(1.0)

    top_rec = state.get("top_recommendation") or (scores[0] if scores else {})
    if top_rec:
        _log_print("\n" + "=" * 70)
        _log_print(f"  TOP RECOMMENDATION: {top_rec.get('innovation_name')}")
        _log_print(f"  Patentability Score: {top_rec.get('overall_score')}/100")
        if market_reports:
            _log_print(f"  Market Opportunity Score: {market_reports[0].get('market_opportunity_score')}/100")
        if top_opps:
            _log_print(f"  Top Recommended Funding: {top_opps[0].get('name')} ({top_opps[0].get('match_score')}% Match)")
        _log_print("=" * 70)

    _log_print(f"\n[PASS] Pipeline executed successfully for domain '{domain}'. Returning results.\n")

    return {
        "success": True,
        "domain": domain,
        "research_topics": state.get("research_topics", []),
        "patent_clusters": state.get("patent_clusters", []),
        "gap_matrix": state.get("gap_matrix", []),
        "innovation_ideas": state.get("innovation_ideas", []),
        "patentability_scores": state.get("patentability_scores", []),
        "market_analysis": state.get("market_analysis", []),
        "funding_analysis": state.get("funding_analysis"),
        "top_recommendation": top_rec,
        "report": report_res
    }




