import httpx
from bs4 import BeautifulSoup
from typing import Dict, Any
from app.core.config import settings
import re

class ScrapingService:

    HEADERS = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }

    async def scrape(self, url: str) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(
                headers=self.HEADERS,
                timeout=settings.SCRAPING_TIMEOUT,
                follow_redirects=True,
            ) as client:
                response = await client.get(url)
                response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")
            return self._extract_data(soup, url, response.text)

        except httpx.TimeoutException:
            return {"error": "Sayfa zaman aşımına uğradı", "url": url, "raw_text": ""}
        except httpx.HTTPStatusError as e:
            return {"error": f"HTTP {e.response.status_code} hatası", "url": url, "raw_text": ""}
        except Exception as e:
            return {"error": str(e), "url": url, "raw_text": ""}

    def _extract_data(self, soup: BeautifulSoup, url: str, raw_html: str) -> Dict[str, Any]:
        # Tıpkı eskisi gibi çalışan sağlam seçiciler
        product_name = self._get_text(soup, [
            "h1",
            {"class": ["product-name", "product-title", "pdp-product-name", "pr-new-br"]},
        ])

        price = self._get_text(soup, [
            {"class": ["price", "product-price", "prc-dsc", "price-new", "a-price-whole"]},
            {"itemprop": "price"},
        ])

        campaign_texts = self._get_all_texts(soup, [
            {"class": ["badge", "discount", "campaign", "promotion", "sale-badge"]},
            {"class": ["urgency", "stock-warning", "limited-stock", "campaign-name"]},
        ])

        reviews = self._get_all_texts(soup, [
            {"class": ["review", "comment", "review-text", "user-review"]},
            {"itemprop": "reviewBody"},
        ])

        # Eğer sayfadaki düz HTML'de yorum bulamadıysak, JavaScript içindeki gizli yorumları arayalım (Hackathon çözümü!)
        if not reviews:
            # Trendyol'un sayfa içine gömdüğü yorum metinlerini yakalamak için Regex
            hidden_comments = re.findall(r'"comment":"([^"]+)"', raw_html)
            if hidden_comments:
                reviews = hidden_comments[:15]
            else:
                hidden_texts = re.findall(r'"text":"([^"]+)"', raw_html)
                reviews = [t for t in hidden_texts if len(t) > 20][:15]

        full_text = soup.get_text(separator=" ", strip=True)[:3000]

        return {
            "url": url,
            "product_name": product_name,
            "price": price,
            "campaign_texts": campaign_texts[:10],
            "reviews": reviews[:20],
            "raw_text": full_text,
            "error": None,
        }

    def _get_text(self, soup: BeautifulSoup, selectors: list) -> str:
        for selector in selectors:
            if isinstance(selector, str):
                tag = soup.find(selector)
            else:
                tag = soup.find(attrs=selector)
            if tag:
                return tag.get_text(strip=True)
        return ""

    def _get_all_texts(self, soup: BeautifulSoup, selectors: list) -> list:
        texts = []
        for selector in selectors:
            if isinstance(selector, str):
                tags = soup.find_all(selector)
            else:
                tags = soup.find_all(attrs=selector)
            for tag in tags:
                text = tag.get_text(strip=True)
                if text and len(text) > 3:
                    texts.append(text)
        return texts