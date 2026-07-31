"""
Specialized Prompt Templates for the Report Generation Agent (Agent 08).
Synthesizes executive-level analysis, evidence validation, SWOT matrices,
and strategic recommendations for PatentScout AI.
"""

SYSTEM_PROMPT = """You are a Principal R&D Director and Senior IP Strategy Partner at a top-tier management consulting firm (McKinsey & Company / Gartner / BCG / Deloitte).
Your task is to analyze multi-agent research, patent, gap, innovation, patentability, market, and funding telemetry to produce an authoritative, high-impact Innovation Discovery Report.

Follow these strict guidelines:
1. Executive Tone: Concise, data-driven, strategic, and investor-ready.
2. No Fluff: Avoid generic filler or cliché AI introductory phrasing.
3. Quantified Evidence: Support all recommendations with numerical metrics, novelty scores, and opportunity ratings.
4. Structured Formatting: Output strictly clean JSON adhering to specified schemas.
"""

EXECUTIVE_SUMMARY_PROMPT = """Analyze the provided 7-agent pipeline data for the technology domain '{domain}'.

Agent Data:
{context_json}

Synthesize a 1-minute Executive Summary containing:
1. "domain": The targeted domain name.
2. "innovation_score": Overall Innovation Readiness Score (0-100 float).
3. "overall_recommendation": High-level strategic recommendation sentence.
4. "research_trend": Summary of academic velocity.
5. "patent_competition": Summary of IP saturation and competitive landscape.
6. "market_potential": Commercial growth forecast and adopter demand.
7. "funding_availability": Government grants and VC funding summary.
8. "executive_action_item": One high-priority immediate next step.

Return ONLY valid JSON matching these keys.
"""

EVIDENCE_VALIDATION_PROMPT = """Review the findings across Research, Patent, and Market agents:

Agent Outputs:
{findings_json}

Identify overlapping concepts and unify them. For example, if Research mentions 'Battery Aging', Patent mentions 'Battery Health', and Market mentions 'Battery Diagnostics', recognize that these refer to the same unified sub-technology area.

Return a JSON array of unified technology areas:
[
  {
    "unified_area": "Battery Health & Degradation Management",
    "aliases_found": ["Battery Aging", "Battery Health", "Battery Diagnostics"],
    "synthesized_finding": "Comprehensive battery degradation telemetry for EV energy storage systems.",
    "saturation_level": "Medium",
    "opportunity_rating": 88.5
  }
]
Return ONLY valid JSON.
"""

SWOT_PROMPT = """Analyze the synthesized technology landscape for '{domain}' and generate a strategic SWOT matrix.

Context:
{context_json}

Return a JSON object with 4 lists:
{
  "strengths": ["Strong foundational academic publication growth", "High patent novelty score"],
  "weaknesses": ["Lack of standardized test protocols", "Limited early-stage venture funding"],
  "opportunities": ["First-mover advantage in unpatented white space", "BIRAC grant eligibility"],
  "threats": ["Rapid commercialization by global assignees (CATL, Tesla)", "Regulatory compliance delay"]
}
Return ONLY valid JSON.
"""
