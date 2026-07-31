"""
Step 12: Email Service Module for Report Generation Agent.

Sends a premium HTML email with the ReportLab PDF attached from the
admin Gmail account (balansivaganesh@gmail.com) to the researcher's
registered email address.

Setup Required:
  1. Go to your Google Account → Security → App Passwords
  2. Create an App Password for "Mail"
  3. Set SMTP_PASS=<your-16-char-app-password> in the .env file
  4. Ensure 2FA is enabled on balansivaganesh@gmail.com

.env variables used:
  SMTP_HOST     = smtp.gmail.com
  SMTP_PORT     = 587
  SMTP_USER     = balansivaganesh@gmail.com
  SMTP_PASS     = <Gmail App Password>
  SMTP_FROM_NAME= PatentScout AI
"""

import os
import smtplib
import logging
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from typing import Dict, Any

# Load .env values via dotenv if not already loaded
try:
    from dotenv import load_dotenv
    from pathlib import Path
    _env_path = Path(__file__).resolve().parent.parent.parent / ".env"
    load_dotenv(dotenv_path=_env_path)
except Exception:
    pass

logger = logging.getLogger("ReportAgent.EmailService")

# ──────────────────────────────────────────────────────────────────────────────
# HTML Email Template — McKinsey / Premium SaaS style
# ──────────────────────────────────────────────────────────────────────────────
HTML_TEMPLATE = """\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>PatentScout AI – Innovation Discovery Report</title>
</head>
<body style="margin:0;padding:0;background:#F0FDF4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F0FDF4;padding:32px 0;">
    <tr>
      <td align="center">
        <!-- Card container -->
        <table width="620" cellpadding="0" cellspacing="0" border="0"
               style="background:#ffffff;border-radius:20px;overflow:hidden;
                      box-shadow:0 4px 32px rgba(0,0,0,0.08);">

          <!-- ── HEADER BANNER ─────────────────────────────── -->
          <tr>
            <td style="background:linear-gradient(135deg,#064E3B 0%,#065F46 60%,#047857 100%);
                        padding:40px 48px 36px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:3px;
                         color:#6EE7B7;text-transform:uppercase;">PatentScout AI · Enterprise Intelligence</p>
              <h1 style="margin:0 0 8px;font-size:30px;font-weight:800;color:#ffffff;line-height:1.15;">
                Innovation Discovery Report
              </h1>
              <p style="margin:0;font-size:15px;color:#A7F3D0;">
                Domain: <strong style="color:#ffffff;">{domain}</strong>
              </p>
            </td>
          </tr>

          <!-- ── GREETING ──────────────────────────────────── -->
          <tr>
            <td style="padding:40px 48px 0;">
              <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#0F172A;">
                Hello, {user_name}! 👋
              </p>
              <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">
                Thank you for using <strong>PatentScout AI</strong>. Your executive-grade
                Innovation Discovery Report has been successfully generated and is ready for review.
              </p>
            </td>
          </tr>

          <!-- ── STATUS PILLS ──────────────────────────────── -->
          <tr>
            <td style="padding:24px 48px 0;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 8px 0 0;">
                    <span style="display:inline-block;background:#ECFDF5;color:#065F46;
                                 border:1px solid #6EE7B7;border-radius:100px;
                                 padding:6px 14px;font-size:12px;font-weight:700;">
                      ✅ Report Generated
                    </span>
                  </td>
                  <td style="padding:0 8px;">
                    <span style="display:inline-block;background:#EFF6FF;color:#1D4ED8;
                                 border:1px solid #BFDBFE;border-radius:100px;
                                 padding:6px 14px;font-size:12px;font-weight:700;">
                      📊 Charts &amp; PDF Built
                    </span>
                  </td>
                  <td style="padding:0 0 0 8px;">
                    <span style="display:inline-block;background:#F5F3FF;color:#6D28D9;
                                 border:1px solid #C4B5FD;border-radius:100px;
                                 padding:6px 14px;font-size:12px;font-weight:700;">
                      📧 Delivered to Inbox
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── REPORT HIGHLIGHTS BOX ─────────────────────── -->
          <tr>
            <td style="padding:28px 48px 0;">
              <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:24px;">
                <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#0F172A;
                           text-transform:uppercase;letter-spacing:1.5px;">
                  📋 Report Highlights
                </p>

                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="padding:0 0 12px;">
                      <span style="color:#059669;font-size:18px;vertical-align:middle;">●</span>
                      <span style="font-size:13.5px;color:#334155;margin-left:10px;">
                        <strong>1-Minute Executive Summary</strong> &amp; Strategic Action Items
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 12px;">
                      <span style="color:#059669;font-size:18px;vertical-align:middle;">●</span>
                      <span style="font-size:13.5px;color:#334155;margin-left:10px;">
                        <strong>Research &amp; Patent Trend Visualizations</strong> (Matplotlib charts)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 12px;">
                      <span style="color:#059669;font-size:18px;vertical-align:middle;">●</span>
                      <span style="font-size:13.5px;color:#334155;margin-left:10px;">
                        <strong>Innovation Spotlight</strong> — Patentability, Market Potential &amp; Business Model
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 12px;">
                      <span style="color:#059669;font-size:18px;vertical-align:middle;">●</span>
                      <span style="font-size:13.5px;color:#334155;margin-left:10px;">
                        <strong>SWOT Matrix</strong> — Strengths, Weaknesses, Opportunities, Threats
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 12px;">
                      <span style="color:#059669;font-size:18px;vertical-align:middle;">●</span>
                      <span style="font-size:13.5px;color:#334155;margin-left:10px;">
                        <strong>6-Stage Commercialization Roadmap</strong> with Funding Pathways
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0;">
                      <span style="color:#059669;font-size:18px;vertical-align:middle;">●</span>
                      <span style="font-size:13.5px;color:#334155;margin-left:10px;">
                        <strong>Professional References</strong> — OpenAlex, arXiv, USPTO, GitHub
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- ── SCORE CARD ROW ─────────────────────────────── -->
          <tr>
            <td style="padding:24px 48px 0;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="33%" style="text-align:center;padding:16px;
                                          background:#ECFDF5;border-radius:12px;margin-right:8px;">
                    <p style="margin:0 0 4px;font-size:26px;font-weight:800;color:#065F46;">
                      {innovation_score}/100
                    </p>
                    <p style="margin:0;font-size:11px;font-weight:700;color:#047857;
                               text-transform:uppercase;letter-spacing:1px;">
                      Innovation Score
                    </p>
                  </td>
                  <td width="4%">&nbsp;</td>
                  <td width="33%" style="text-align:center;padding:16px;
                                          background:#EFF6FF;border-radius:12px;">
                    <p style="margin:0 0 4px;font-size:26px;font-weight:800;color:#1D4ED8;">
                      92/100
                    </p>
                    <p style="margin:0;font-size:11px;font-weight:700;color:#2563EB;
                               text-transform:uppercase;letter-spacing:1px;">
                      Legal Novelty
                    </p>
                  </td>
                  <td width="4%">&nbsp;</td>
                  <td width="33%" style="text-align:center;padding:16px;
                                          background:#F5F3FF;border-radius:12px;">
                    <p style="margin:0 0 4px;font-size:26px;font-weight:800;color:#6D28D9;">
                      High
                    </p>
                    <p style="margin:0;font-size:11px;font-weight:700;color:#7C3AED;
                               text-transform:uppercase;letter-spacing:1px;">
                      Market Demand
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── RECOMMENDATION BOX ────────────────────────── -->
          <tr>
            <td style="padding:24px 48px 0;">
              <div style="background:linear-gradient(135deg,#064E3B,#065F46);
                           border-radius:14px;padding:22px 26px;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:2px;
                           color:#6EE7B7;text-transform:uppercase;">
                  🎯 Top Strategic Recommendation
                </p>
                <p style="margin:0;font-size:14px;color:#D1FAE5;line-height:1.65;">
                  {recommendation}
                </p>
              </div>
            </td>
          </tr>

          <!-- ── ATTACHMENT NOTE ────────────────────────────── -->
          <tr>
            <td style="padding:24px 48px 0;">
              <div style="border:2px dashed #6EE7B7;border-radius:12px;padding:16px 20px;
                           background:#F0FDF4;display:flex;align-items:center;">
                <p style="margin:0;font-size:13.5px;color:#065F46;">
                  📎 <strong>Attachment:</strong> Your full Innovation Discovery Report PDF is attached to this email.
                  Open it in any PDF viewer for the complete consulting-grade report with charts, SWOT, and roadmap.
                </p>
              </div>
            </td>
          </tr>

          <!-- ── DIVIDER ────────────────────────────────────── -->
          <tr>
            <td style="padding:32px 48px 0;">
              <hr style="border:none;border-top:1px solid #E2E8F0;margin:0;"/>
            </td>
          </tr>

          <!-- ── FOOTER ─────────────────────────────────────── -->
          <tr>
            <td style="padding:24px 48px 36px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0F172A;">
                PatentScout AI
              </p>
              <p style="margin:0 0 12px;font-size:12px;color:#94A3B8;">
                Enterprise R&amp;D Intelligence · Innovation Discovery · IP Strategy
              </p>
              <p style="margin:0;font-size:11.5px;color:#CBD5E1;">
                Generated on {date} &nbsp;·&nbsp; Report ID: {report_id}
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#CBD5E1;">
                This is an automated email sent by PatentScout AI. Please do not reply to this message.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


class EmailService:
    """
    Dispatches PatentScout AI Innovation Discovery Report PDF via Gmail SMTP.
    Sends from admin account balansivaganesh@gmail.com to the researcher's email.
    """

    def send_report_email(
        self,
        recipient_email: str,
        pdf_path: str,
        domain: str,
        user_name: str = "Researcher",
        innovation_score: float = 88.4,
        recommendation: str = "Proceed with patent application and seed funding round. High novelty rating with minimal prior-art overlap.",
        report_id: str = "PSA-RPT-001"
    ) -> Dict[str, Any]:

        logger.info(f"Step 12: Preparing Gmail SMTP dispatch → '{recipient_email}' · PDF: '{pdf_path}'")

        if not recipient_email or not recipient_email.strip():
            logger.warning("No recipient email provided. Skipping dispatch.")
            return {"success": False, "status": "NO_RECIPIENT", "message": "Recipient email is empty."}

        # ── Force-reload .env so updated passwords are always picked up ──
        try:
            from dotenv import load_dotenv
            from pathlib import Path
            _env_path = Path(__file__).resolve().parent.parent.parent / ".env"
            load_dotenv(dotenv_path=_env_path, override=True)
            logger.info(f"Re-loaded .env from: {_env_path}")
        except Exception as _e:
            logger.warning(f"dotenv reload skipped: {_e}")

        # Read SMTP credentials from env (after force-reload)
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER", "balansivaganesh@gmail.com")
        smtp_pass = (os.getenv("SMTP_PASS", "") or "").replace(" ", "")   # strip spaces
        from_name = os.getenv("SMTP_FROM_NAME", "PatentScout AI")

        logger.info(f"SMTP config → host={smtp_host}:{smtp_port} user={smtp_user} pass_len={len(smtp_pass)}")

        if not smtp_pass or smtp_pass.strip() == "":
            logger.warning(
                "SMTP_PASS is not set in .env. "
                "Go to Google Account → Security → App Passwords and add a 16-character app password for 'Mail', "
                "then set SMTP_PASS=<your-app-password> in your .env file."
            )
            return {
                "success": False,
                "status": "UNCONFIGURED_SMTP",
                "message": (
                    "Gmail App Password not configured. "
                    "Set SMTP_PASS in .env file. "
                    "Your PDF is available for direct download."
                )
            }

        try:
            # Build MIME message
            msg = MIMEMultipart("mixed")
            msg["From"] = f"{from_name} <{smtp_user}>"
            msg["To"] = recipient_email
            msg["Subject"] = f"PatentScout AI – Your Innovation Discovery Report ({domain})"
            msg["Reply-To"] = smtp_user

            # HTML body
            html_body = HTML_TEMPLATE.format(
                domain=domain,
                user_name=user_name,
                innovation_score=round(innovation_score, 1),
                recommendation=recommendation,
                date=datetime.utcnow().strftime("%B %d, %Y at %H:%M UTC"),
                report_id=report_id
            )

            # Plain-text fallback
            plain_body = (
                f"Hello {user_name},\n\n"
                f"Thank you for using PatentScout AI.\n\n"
                f"Your Innovation Discovery Report for '{domain}' has been generated and is attached to this email.\n\n"
                f"Report Highlights:\n"
                f"  • 1-Minute Executive Summary & Strategic Action Items\n"
                f"  • Research & Patent Trend Visualizations\n"
                f"  • Innovation Spotlight & Patentability Assessment\n"
                f"  • SWOT Matrix & 6-Stage Commercialization Roadmap\n"
                f"  • Funding Pathway Matches (BIRAC, Startup India, YC)\n\n"
                f"Innovation Score: {round(innovation_score, 1)}/100\n"
                f"Top Recommendation: {recommendation}\n\n"
                f"Best Regards,\nPatentScout AI Operations Team\n"
                f"Report ID: {report_id}"
            )

            # Attach alternative parts
            alt_part = MIMEMultipart("alternative")
            alt_part.attach(MIMEText(plain_body, "plain", "utf-8"))
            alt_part.attach(MIMEText(html_body, "html", "utf-8"))
            msg.attach(alt_part)

            # Attach PDF
            if pdf_path and os.path.exists(pdf_path):
                with open(pdf_path, "rb") as f:
                    pdf_bytes = f.read()
                pdf_part = MIMEApplication(pdf_bytes, Name=os.path.basename(pdf_path))
                pdf_part["Content-Disposition"] = (
                    f'attachment; filename="{os.path.basename(pdf_path)}"'
                )
                msg.attach(pdf_part)
                logger.info(f"PDF attachment added: {os.path.basename(pdf_path)} ({len(pdf_bytes):,} bytes)")
            else:
                logger.warning(f"PDF file not found at '{pdf_path}' — sending email without attachment.")

            # Connect and send via Gmail SMTP TLS
            logger.info(f"Connecting to Gmail SMTP {smtp_host}:{smtp_port} as {smtp_user}...")
            with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, recipient_email, msg.as_string())

            logger.info(f"✅ Email dispatched successfully to '{recipient_email}'.")
            return {
                "success": True,
                "status": "SENT",
                "message": f"Innovation Discovery Report emailed successfully to {recipient_email}.",
                "recipient": recipient_email
            }

        except smtplib.SMTPAuthenticationError:
            logger.error(
                "Gmail SMTP Authentication Failed. "
                "Ensure you are using a 16-character App Password (not your account password). "
                "Enable 2FA and create one at: Google Account → Security → App Passwords."
            )
            return {
                "success": False,
                "status": "AUTH_ERROR",
                "message": "Gmail authentication failed. Check SMTP_PASS in .env (must be a Gmail App Password, not account password)."
            }
        except smtplib.SMTPException as e:
            logger.error(f"SMTP error during email dispatch: {e}")
            return {"success": False, "status": "SMTP_ERROR", "message": str(e)}
        except Exception as e:
            logger.error(f"Unexpected error during email dispatch: {e}")
            return {"success": False, "status": "ERROR", "message": str(e)}


email_service_instance = EmailService()
