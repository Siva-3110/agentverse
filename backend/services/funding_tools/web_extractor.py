"""
Web Extractor Service (Tool 3 for Funding Opportunity Agent)

Extracts clean readable text/markdown from official funding webpages.
Implements a 4-Tier Fallback Chain:
1. Firecrawl API
2. Jina Reader API (https://r.jina.ai/{url})
3. BeautifulSoup + Requests HTML Content Cleaner
4. Playwright Headless Browser (JS Rendering)

Guarantees robust error handling so single webpage failures never terminate agent execution.
"""

import re
import logging
import requests
from typing import Dict, Any, Optional

from backend.config import settings

logger = logging.getLogger("FundingWebExtractor")

def extract_webpage_content(url: str, snippet_fallback: str = "") -> str:
    """
    Executes 4-tier extraction chain on target URL to produce clean text/markdown.
    """
    logger.info(f"[Web Extractor] Extracting webpage content from URL: '{url}'...")
    
    # ── Tier 1: Firecrawl API ──────────────────────────────────────────
    firecrawl_key = settings.FIRECRAWL_API_KEY
    if firecrawl_key:
        try:
            logger.info(f"[Web Extractor] Attempting Tier 1 (Firecrawl API) for '{url}'...")
            resp = requests.post(
                "https://api.firecrawl.dev/v1/scrape",
                headers={"Authorization": f"Bearer {firecrawl_key}", "Content-Type": "application/json"},
                json={"url": url, "formats": ["markdown"]},
                timeout=12
            )
            if resp.status_code == 200:
                content = resp.json().get("data", {}).get("markdown", "").strip()
                if content and len(content) > 100:
                    logger.info(f"[Web Extractor] Tier 1 (Firecrawl) succeeded: {len(content)} chars.")
                    return content[:4000]
        except Exception as e:
            logger.warning(f"[Web Extractor] Tier 1 (Firecrawl) failed: {e}")

    # ── Tier 2: Jina Reader API ─────────────────────────────────────────
    try:
        logger.info(f"[Web Extractor] Attempting Tier 2 (Jina Reader API) for '{url}'...")
        jina_url = f"https://r.jina.ai/{url}"
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        resp = requests.get(jina_url, headers=headers, timeout=10)
        if resp.status_code == 200 and resp.text:
            cleaned = resp.text.strip()
            if cleaned and len(cleaned) > 100 and "Just a moment" not in cleaned:
                logger.info(f"[Web Extractor] Tier 2 (Jina Reader) succeeded: {len(cleaned)} chars.")
                return cleaned[:4000]
    except Exception as e:
        logger.warning(f"[Web Extractor] Tier 2 (Jina Reader) failed: {e}")

    # ── Tier 3: BeautifulSoup / Regex HTML Cleaner ──────────────────────
    try:
        logger.info(f"[Web Extractor] Attempting Tier 3 (HTML Content Cleaner) for '{url}'...")
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0"}
        resp = requests.get(url, headers=headers, timeout=8)
        if resp.status_code == 200 and resp.content:
            try:
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(resp.content, "html.parser")
                for element in soup(["script", "style", "nav", "header", "footer", "form"]):
                    element.decompose()
                text = soup.get_text(separator=" ")
            except Exception:
                raw_html = resp.text
                text = re.sub(r'<[^>]+>', ' ', raw_html)
                
            clean_text = re.sub(r'\s+', ' ', text).strip()
            if clean_text and len(clean_text) > 100:
                logger.info(f"[Web Extractor] Tier 3 (HTML Cleaner) succeeded: {len(clean_text)} chars.")
                return clean_text[:4000]
    except Exception as e:
        logger.warning(f"[Web Extractor] Tier 3 (HTML Cleaner) failed: {e}")


    # ── Tier 4: Playwright Headless Browser (JS Rendering) ──────────────
    try:
        logger.info(f"[Web Extractor] Attempting Tier 4 (Playwright) for '{url}'...")
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto(url, timeout=15000)
            text = page.inner_text("body")
            browser.close()
            clean_text = re.sub(r'\s+', ' ', text).strip()
            if clean_text and len(clean_text) > 100:
                logger.info(f"[Web Extractor] Tier 4 (Playwright) succeeded: {len(clean_text)} chars.")
                return clean_text[:4000]
    except Exception as e:
        logger.warning(f"[Web Extractor] Tier 4 (Playwright) unavailable/failed: {e}")

    # Fallback to provided snippet if all 4 tiers fail
    logger.info(f"[Web Extractor] Extraction fallback: Using search snippet context.")
    return snippet_fallback or f"Official Funding Opportunity page for {url}"
