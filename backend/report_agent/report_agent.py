"""
Report Generation Agent (Agent 08) Main Orchestrator for PatentScout AI.
Executes the complete 12-step enterprise consulting report workflow:
1. Data Collector
2. Evidence Validator
3. Executive Summary Generator
4. AI Insight Generator
5. Visualization Generator (Matplotlib)
6. Innovation Spotlight
7. Detailed Sections Assembly
8. SWOT Matrix Builder
9. Roadmap Generator
10. References & Bibliography
11. Premium ReportLab PDF Generator
12. Email Dispatch & Download Service
"""

import os
import logging
from typing import Dict, Any

from .data_collector import data_collector_instance
from .evidence_validator import evidence_validator_instance
from .executive_summary import executive_summary_instance
from .insight_generator import insight_generator_instance
from .visualization_generator import visualization_generator_instance
from .roadmap_generator import roadmap_generator_instance
from .report_builder import report_builder_instance
from .pdf_generator import pdf_generator_instance
from .email_service import email_service_instance

logger = logging.getLogger("ReportAgent.Orchestrator")

class ReportGenerationAgent:
    """
    Main Report Generation Agent Orchestrator.
    Collects outputs from Agents 01-07, synthesizes consulting insights,
    generates dynamic charts, compiles a ReportLab PDF, and dispatches via email.
    """

    def execute(
        self,
        pipeline_state: Dict[str, Any],
        recipient_email: str = None,
        user_name: str = "Researcher"
    ) -> Dict[str, Any]:
        logger.info("=" * 70)
        logger.info("  STARTING REPORT GENERATION AGENT (AGENT 08) 12-STEP PIPELINE")
        logger.info("=" * 70)

        domain = pipeline_state.get("domain", "Technology")

        try:
            # Step 1: Data Collector
            ctx = data_collector_instance.collect(pipeline_state)

            # Step 2: Evidence Validator
            ctx = evidence_validator_instance.validate_and_unify(ctx)

            # Step 3: Executive Summary Generator
            ctx = executive_summary_instance.generate(ctx)

            # Step 4: AI Insight Generator
            ctx = insight_generator_instance.generate_insights(ctx)

            # Step 5: Visualization Generator (Matplotlib Charts)
            ctx["chart_paths"] = visualization_generator_instance.generate_charts(ctx)

            # Step 9: Roadmap Generator
            ctx = roadmap_generator_instance.generate_roadmap(ctx)

            # Steps 6, 7, 8, 10: Report Builder
            ctx = report_builder_instance.build_report_object(ctx)

            # Step 11: Premium ReportLab PDF Generator
            pdf_path = pdf_generator_instance.generate_pdf(ctx)

            # Gather details for personalised email
            report_obj = ctx.get("report_object", {})
            cover   = report_obj.get("cover_data", {})
            exec_s  = report_obj.get("executive_summary", {})
            report_id = cover.get("report_id", "PSA-RPT-001")
            innovation_score = ctx.get("metrics", {}).get("avg_patentability_score", 88.4)
            recommendation = exec_s.get("overall_recommendation",
                "Proceed with patent application and seed funding round. High novelty rating.")

            # Step 12: Email Dispatch
            email_status = {"success": False, "message": "No email recipient specified."}
            if recipient_email:
                logger.info(f"Dispatching email to '{recipient_email}' ({user_name})...")
                email_status = email_service_instance.send_report_email(
                    recipient_email=recipient_email,
                    pdf_path=pdf_path,
                    domain=domain,
                    user_name=user_name,
                    innovation_score=innovation_score,
                    recommendation=recommendation,
                    report_id=report_id
                )
                if email_status.get("success"):
                    logger.info(f"✅ Email dispatched successfully to '{recipient_email}'.")
                else:
                    logger.warning(f"Email dispatch issue: {email_status.get('message')}")

            result = {
                "success": True,
                "domain": domain,
                "pdf_path": pdf_path,
                "report_id": report_id,
                "email_status": email_status,
                "executive_summary": exec_s,
                "key_insights": report_obj.get("key_insights", []),
                "spotlight": report_obj.get("spotlight", {}),
                "swot": report_obj.get("swot", {}),
                "commercialization_roadmap": report_obj.get("commercialization_roadmap", []),
                "references": report_obj.get("references", []),
                "report_object": report_obj
            }

            logger.info("=" * 70)
            logger.info(f"  REPORT AGENT COMPLETED SUCCESSFULLY. PDF: '{pdf_path}'")
            logger.info("=" * 70)

            return result

        except Exception as e:
            logger.exception(f"Report Generation Agent failed with exception: {e}")
            return {
                "success": False,
                "error": f"Report Agent failed: {str(e)}"
            }

def report_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """Function wrapper for pipeline execution in workflow.py."""
    agent = ReportGenerationAgent()
    res = agent.execute(state)
    state["report_result"] = res
    state["report_path"] = res.get("pdf_path", "")
    return state

report_agent_instance = ReportGenerationAgent()
