"""
Report Generation Agent Package for PatentScout AI.
Provides modular enterprise consulting report orchestration:
Data Collection, Evidence Validation, Executive Summarization,
Visual Analytics (Matplotlib), Strategic Roadmap Generation,
McKinsey/Gartner-grade ReportLab PDF Export, and SMTP Email Dispatch.
"""

from .report_agent import ReportGenerationAgent, report_agent_instance

__all__ = ["ReportGenerationAgent", "report_agent_instance"]
