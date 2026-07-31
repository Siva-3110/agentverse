"""
Step 2: Evidence Validator module for Report Generation Agent.
Cleanses, deduplicates, and unifies overlapping concepts across multi-agent telemetry.
"""

import logging
from typing import Dict, Any, List

logger = logging.getLogger("ReportAgent.EvidenceValidator")

class EvidenceValidator:
    """
    Validates findings across Research, Patent, Gap, and Market telemetry.
    Merges duplicate or redundant sub-topic concepts into unified technology areas.
    """

    def validate_and_unify(self, report_context: Dict[str, Any]) -> Dict[str, Any]:
        logger.info("Step 2: Evidence Validator analyzing multi-agent findings for concept unification...")

        domain = report_context.get("domain", "")
        agent_outputs = report_context.get("agent_outputs", {})

        research = agent_outputs.get("research", [])
        patents = agent_outputs.get("patent", [])
        gaps = agent_outputs.get("gap", [])

        unified_areas: List[Dict[str, Any]] = []
        seen_concepts = set()

        # Extract topics from Research Agent
        for r in research:
            topic_name = r.get("topic", "") if isinstance(r, dict) else str(r)
            clean_name = self._normalize_concept(topic_name)
            if clean_name and clean_name not in seen_concepts:
                seen_concepts.add(clean_name)
                unified_areas.append({
                    "unified_area": topic_name,
                    "source_agents": ["Research Intelligence"],
                    "research_activity": r.get("research_activity", "High") if isinstance(r, dict) else "High",
                    "patent_saturation": "Medium",
                    "opportunity_score": r.get("opportunity_score", 85.0) if isinstance(r, dict) else 85.0
                })

        # Cross-reference with Patent Clusters
        for p in patents:
            cat_name = p.get("category", "") if isinstance(p, dict) else str(p)
            clean_name = self._normalize_concept(cat_name)

            matched = False
            for area in unified_areas:
                if self._are_similar(clean_name, self._normalize_concept(area["unified_area"])):
                    area["source_agents"].append("Patent Landscape")
                    area["patent_saturation"] = p.get("saturation", "High") if isinstance(p, dict) else "High"
                    matched = True
                    break

            if not matched and clean_name and clean_name not in seen_concepts:
                seen_concepts.add(clean_name)
                unified_areas.append({
                    "unified_area": cat_name,
                    "source_agents": ["Patent Landscape"],
                    "research_activity": "Medium",
                    "patent_saturation": p.get("saturation", "High") if isinstance(p, dict) else "High",
                    "opportunity_score": 80.0
                })

        # Cross-reference with Gap Matrix
        for g in gaps:
            gap_name = g.get("area", "") if isinstance(g, dict) else str(g)
            clean_name = self._normalize_concept(gap_name)

            matched = False
            for area in unified_areas:
                if self._are_similar(clean_name, self._normalize_concept(area["unified_area"])):
                    area["source_agents"].append("Gap Analysis")
                    area["opportunity_score"] = g.get("opportunity_score", area["opportunity_score"]) if isinstance(g, dict) else area["opportunity_score"]
                    matched = True
                    break

            if not matched and clean_name and clean_name not in seen_concepts:
                seen_concepts.add(clean_name)
                unified_areas.append({
                    "unified_area": gap_name,
                    "source_agents": ["Gap Analysis"],
                    "research_activity": "High",
                    "patent_saturation": "Low (White Space)",
                    "opportunity_score": g.get("opportunity_score", 90.0) if isinstance(g, dict) else 90.0
                })

        report_context["unified_technology_areas"] = unified_areas
        logger.info(f"Step 2 Complete: Unified into {len(unified_areas)} distinct technology focus areas without redundancy.")
        return report_context

    def _normalize_concept(self, text: str) -> str:
        if not text:
            return ""
        return "".join(c.lower() for c in text if c.isalnum() or c.isspace()).strip()

    def _are_similar(self, a: str, b: str) -> bool:
        if not a or not b:
            return False
        if a in b or b in a:
            return True
        words_a = set(a.split())
        words_b = set(b.split())
        overlap = words_a.intersection(words_b)
        return len(overlap) >= 1 and any(len(w) > 3 for w in overlap)

evidence_validator_instance = EvidenceValidator()
