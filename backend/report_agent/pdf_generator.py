"""
Step 11: Premium PDF Generator for Report Generation Agent.
Uses ReportLab to generate an investor-grade, multi-page consulting report PDF
complete with cover page, headers, footers, dynamic page numbers, TOC, score cards,
SWOT grid, commercialization roadmap, and embedded Matplotlib charts.
"""

import os
import tempfile
import logging
from typing import Dict, Any, List

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

logger = logging.getLogger("ReportAgent.PDFGenerator")

class NumberedCanvas(canvas.Canvas):
    """
    Custom canvas that performs two passes to render 'Page X of Y' dynamic page numbering
    and professional running headers and footers.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Skip header/footer on cover page
            return

        self.saveState()

        # Running Header
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#064E3B"))
        self.drawString(54, 750, "PATENTSCOUT AI")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(140, 750, "·   Executive Innovation Discovery Report")

        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 742, 558, 742)

        # Running Footer
        self.line(54, 48, 558, 48)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 34, "CONFIDENTIAL  ·  Prepared for Investment & Enterprise R&D Review")

        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 34, page_str)

        self.restoreState()


class PDFGenerator:
    """
    Renders investor-grade, multi-page ReportLab PDF consulting report.
    """

    def generate_pdf(self, report_context: Dict[str, Any], output_pdf_path: str = None) -> str:
        logger.info("Step 11: PDF Generator compiling ReportLab document...")

        if not output_pdf_path:
            filename = f"PatentScout_Report_{report_context.get('domain', 'Tech').replace(' ', '_')}.pdf"
            output_pdf_path = os.path.join(tempfile.gettempdir(), filename)

        doc = SimpleDocTemplate(
            output_pdf_path,
            pagesize=letter,
            leftMargin=54,
            rightMargin=54,
            topMargin=54,
            bottomMargin=54
        )

        styles = getSampleStyleSheet()

        # Custom McKinsey/Gartner Styles
        c_emerald = colors.HexColor("#064E3B")
        c_slate = colors.HexColor("#0F172A")
        c_sub = colors.HexColor("#475569")

        title_style = ParagraphStyle(
            "CoverTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=28,
            leading=34,
            textColor=c_slate,
            spaceAfter=10
        )

        subtitle_style = ParagraphStyle(
            "CoverSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=14,
            leading=18,
            textColor=c_emerald,
            spaceAfter=25
        )

        h1_style = ParagraphStyle(
            "SectionH1",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            textColor=c_emerald,
            spaceBefore=15,
            spaceAfter=10
        )

        h2_style = ParagraphStyle(
            "SectionH2",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=17,
            textColor=c_slate,
            spaceBefore=10,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            "ReportBody",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=14,
            textColor=c_sub,
            spaceAfter=8
        )

        bullet_style = ParagraphStyle(
            "ReportBullet",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=c_sub,
            leftIndent=12,
            spaceAfter=4
        )

        card_title = ParagraphStyle(
            "CardTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=colors.HexColor("#064E3B")
        )

        report_obj = report_context.get("report_object", {})
        cover = report_obj.get("cover_data", {})
        exec_sum = report_obj.get("executive_summary", {})
        insights = report_obj.get("key_insights", [])
        spotlight = report_obj.get("spotlight", {})
        sections = report_obj.get("detailed_sections", [])
        swot = report_obj.get("swot", {})
        roadmap = report_obj.get("commercialization_roadmap", [])
        refs = report_obj.get("references", [])
        charts = report_context.get("chart_paths", {})

        elements = []

        # ── 1. COVER PAGE ───────────────────────────────────────────────────
        elements.append(Spacer(1, 40))
        elements.append(Paragraph("PATENTSCOUT AI ENTERPRISE SWARM", ParagraphStyle("CoverPill", fontName="Helvetica-Bold", fontSize=10, textColor=c_emerald, leading=12)))
        elements.append(Spacer(1, 15))
        elements.append(Paragraph(cover.get("title", "Innovation Discovery Report"), title_style))
        elements.append(Paragraph(cover.get("subtitle", f"Strategic IP & R&D Intelligence"), subtitle_style))
        elements.append(HRFlowable(width="100%", thickness=3, color=c_emerald, spaceBefore=5, spaceAfter=20))

        # Cover Score Card Table
        score_data = [
            [
                Paragraph("<b>TARGET DOMAIN</b>", ParagraphStyle("CH", fontName="Helvetica-Bold", fontSize=8, textColor=colors.HexColor("#64748B"))),
                Paragraph("<b>INNOVATION SCORE</b>", ParagraphStyle("CH", fontName="Helvetica-Bold", fontSize=8, textColor=colors.HexColor("#64748B"))),
                Paragraph("<b>REPORT ID</b>", ParagraphStyle("CH", fontName="Helvetica-Bold", fontSize=8, textColor=colors.HexColor("#64748B")))
            ],
            [
                Paragraph(f"<b>{cover.get('domain', 'Emerging Tech')}</b>", ParagraphStyle("CD", fontName="Helvetica-Bold", fontSize=12, textColor=c_slate)),
                Paragraph(f"<b>{cover.get('innovation_score', 88.4)} / 100</b>", ParagraphStyle("CD", fontName="Helvetica-Bold", fontSize=14, textColor=c_emerald)),
                Paragraph(f"<b>{cover.get('report_id', 'PSA-RPT-001')}</b>", ParagraphStyle("CD", fontName="Helvetica-Bold", fontSize=10, textColor=c_slate))
            ]
        ]
        score_table = Table(score_data, colWidths=[2.2*inch, 2.2*inch, 2.2*inch])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('PADDING', (0,0), (-1,-1), 12),
        ]))
        elements.append(score_table)

        elements.append(Spacer(1, 140))

        meta_data = [
            [Paragraph("<b>Prepared By:</b>", body_style), Paragraph(cover.get("prepared_by", "PatentScout AI"), body_style)],
            [Paragraph("<b>Generation Date:</b>", body_style), Paragraph(cover.get("date", "Today"), body_style)],
            [Paragraph("<b>Target Audience:</b>", body_style), Paragraph("Investors, Incubators, C-Suite & Patent Attorneys", body_style)]
        ]
        meta_table = Table(meta_data, colWidths=[1.8*inch, 4.8*inch])
        meta_table.setStyle(TableStyle([('PADDING', (0,0), (-1,-1), 4)]))
        elements.append(meta_table)

        elements.append(PageBreak())

        # ── 2. EXECUTIVE SUMMARY & TABLE OF CONTENTS ────────────────────────
        elements.append(Paragraph("Executive Summary & Briefing", h1_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=15))

        elements.append(Paragraph(f"<b>Domain Focus:</b> {exec_sum.get('domain', '')}", body_style))
        elements.append(Paragraph(f"<b>Overall Recommendation:</b> {exec_sum.get('overall_recommendation', '')}", body_style))
        elements.append(Spacer(1, 10))

        # Executive Metrics Box
        exec_table_data = [
            [Paragraph("<b>Metric Dimension</b>", card_title), Paragraph("<b>Strategic Telemetry Summary</b>", card_title)],
            [Paragraph("Research Velocity", body_style), Paragraph(exec_sum.get("research_trend", ""), body_style)],
            [Paragraph("Patent Competition", body_style), Paragraph(exec_sum.get("patent_competition", ""), body_style)],
            [Paragraph("Market Demand", body_style), Paragraph(exec_sum.get("market_potential", ""), body_style)],
            [Paragraph("Funding Availability", body_style), Paragraph(exec_sum.get("funding_availability", ""), body_style)],
            [Paragraph("High-Priority Action Item", ParagraphStyle("B", fontName="Helvetica-Bold", fontSize=9, textColor=c_emerald)), Paragraph(f"<b>{exec_sum.get('executive_action_item', '')}</b>", body_style)]
        ]
        exec_table = Table(exec_table_data, colWidths=[2.0*inch, 4.6*inch])
        exec_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#ECFDF5")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#A7F3D0")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('PADDING', (0,0), (-1,-1), 8),
        ]))
        elements.append(exec_table)

        elements.append(Spacer(1, 15))

        # Embedded Charts 1 & 2
        if "research_trend" in charts and os.path.exists(charts["research_trend"]):
            img1 = Image(charts["research_trend"], width=3.2*inch, height=1.7*inch)
            img2 = Image(charts["patent_trend"], width=3.2*inch, height=1.7*inch) if "patent_trend" in charts and os.path.exists(charts["patent_trend"]) else None

            if img2:
                chart_table = Table([[img1, img2]], colWidths=[3.3*inch, 3.3*inch])
                chart_table.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER'), ('PADDING', (0,0), (-1,-1), 0)]))
                elements.append(chart_table)
            else:
                elements.append(img1)

        elements.append(PageBreak())

        # ── 3. AI STRATEGIC INSIGHTS & INNOVATION SPOTLIGHT ────────────────
        elements.append(Paragraph("Strategic AI Insights", h1_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=15))

        for ins in insights:
            ins_data = [
                [Paragraph(f"<b>[{ins.get('badge')}] {ins.get('title')}</b>", ParagraphStyle("IT", fontName="Helvetica-Bold", fontSize=10, textColor=colors.HexColor(ins.get("color", "#064E3B"))))],
                [Paragraph(ins.get("description", ""), body_style)]
            ]
            ins_table = Table(ins_data, colWidths=[6.6*inch])
            ins_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
                ('PADDING', (0,0), (-1,-1), 8),
            ]))
            elements.append(ins_table)
            elements.append(Spacer(1, 8))

        elements.append(Spacer(1, 15))
        elements.append(Paragraph("Innovation Spotlight Feature", h2_style))

        spot_data = [
            [Paragraph("<b>RECOMMENDED INNOVATION</b>", card_title), Paragraph(f"<b>{spotlight.get('name')}</b>", ParagraphStyle("SP", fontName="Helvetica-Bold", fontSize=11, textColor=c_emerald))],
            [Paragraph("Innovation Score", body_style), Paragraph(f"{spotlight.get('innovation_score')} / 100", body_style)],
            [Paragraph("Legal Novelty Score", body_style), Paragraph(f"{spotlight.get('novelty_score')} / 100", body_style)],
            [Paragraph("Target Business Model", body_style), Paragraph(f"{spotlight.get('recommended_business_model')}", body_style)],
            [Paragraph("Target Customers", body_style), Paragraph(f"{', '.join(spotlight.get('target_customers', []))}", body_style)],
            [Paragraph("Selection Rationale", body_style), Paragraph(f"{spotlight.get('selection_rationale')}", body_style)]
        ]
        spot_table = Table(spot_data, colWidths=[2.2*inch, 4.4*inch])
        spot_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#FEF3C7")),
            ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor("#F59E0B")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#FDE68A")),
            ('PADDING', (0,0), (-1,-1), 8),
        ]))
        elements.append(spot_table)

        elements.append(PageBreak())

        # ── 4. DETAILED SECTIONS & SWOT MATRIX ───────────────────────────────
        elements.append(Paragraph("Multi-Agent Analysis Sections", h1_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=15))

        for sec in sections:
            elements.append(Paragraph(sec.get("title", ""), h2_style))
            elements.append(Paragraph(sec.get("summary", ""), body_style))
            for kf in sec.get("key_findings", []):
                elements.append(Paragraph(f"• {kf}", bullet_style))
            elements.append(Paragraph(f"<b>Strategic Recommendation:</b> {sec.get('recommendation', '')}", body_style))
            elements.append(Spacer(1, 10))

        elements.append(Spacer(1, 10))
        elements.append(Paragraph("Strategic SWOT Matrix", h2_style))

        swot_data = [
            [Paragraph("<b>STRENGTHS</b>", ParagraphStyle("S", fontName="Helvetica-Bold", fontSize=9, textColor=colors.HexColor("#059669"))), Paragraph("<b>WEAKNESSES</b>", ParagraphStyle("W", fontName="Helvetica-Bold", fontSize=9, textColor=colors.HexColor("#DC2626")))],
            [
                Paragraph("<br/>".join([f"• {s}" for s in swot.get("strengths", [])]), body_style),
                Paragraph("<br/>".join([f"• {w}" for w in swot.get("weaknesses", [])]), body_style)
            ],
            [Paragraph("<b>OPPORTUNITIES</b>", ParagraphStyle("O", fontName="Helvetica-Bold", fontSize=9, textColor=colors.HexColor("#0284C7"))), Paragraph("<b>THREATS</b>", ParagraphStyle("T", fontName="Helvetica-Bold", fontSize=9, textColor=colors.HexColor("#EA580C")))],
            [
                Paragraph("<br/>".join([f"• {o}" for o in swot.get("opportunities", [])]), body_style),
                Paragraph("<br/>".join([f"• {t}" for t in swot.get("threats", [])]), body_style)
            ]
        ]
        swot_table = Table(swot_data, colWidths=[3.3*inch, 3.3*inch])
        swot_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,0), colors.HexColor("#ECFDF5")),
            ('BACKGROUND', (1,0), (1,0), colors.HexColor("#FEF2F2")),
            ('BACKGROUND', (0,2), (0,2), colors.HexColor("#F0F9FF")),
            ('BACKGROUND', (1,2), (1,2), colors.HexColor("#FFF7ED")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('PADDING', (0,0), (-1,-1), 8),
        ]))
        elements.append(swot_table)

        elements.append(PageBreak())

        # ── 5. ROADMAP & BIBLIOGRAPHY REFERENCES ────────────────────────────
        elements.append(Paragraph("Commercialization Roadmap & Execution", h1_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=15))

        for rm in roadmap:
            elements.append(Paragraph(f"<b>{rm.get('stage')}</b> ({rm.get('timeline')})", h2_style))
            elements.append(Paragraph(f"<b>Milestone:</b> {rm.get('milestone')}", body_style))
            for act in rm.get("recommended_actions", []):
                elements.append(Paragraph(f"• {act}", bullet_style))
            elements.append(Spacer(1, 6))

        elements.append(Spacer(1, 15))
        elements.append(Paragraph("References & Data Source Citations", h2_style))

        ref_data = [
            [Paragraph("<b>Data Source</b>", card_title), Paragraph("<b>Category</b>", card_title), Paragraph("<b>Endpoint / URL</b>", card_title)]
        ]
        for ref in refs:
            ref_data.append([
                Paragraph(ref.get("source", ""), body_style),
                Paragraph(ref.get("type", ""), body_style),
                Paragraph(f"<font color='#0284C7'><u>{ref.get('url', '')}</u></font>", body_style)
            ])
        ref_table = Table(ref_data, colWidths=[2.2*inch, 1.8*inch, 2.6*inch])
        ref_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F8FAFC")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(ref_table)

        # Build document with NumberedCanvas
        doc.build(elements, canvasmaker=NumberedCanvas)
        logger.info(f"Step 11 Complete: PDF report saved successfully to '{output_pdf_path}'.")
        return output_pdf_path

pdf_generator_instance = PDFGenerator()
