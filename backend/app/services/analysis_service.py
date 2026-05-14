from app.services.scraping_service import ScrapingService
from app.services.gemini_service import GeminiService
from app.schemas.scan_schema import ScanResponse, Module, Bar


class AnalysisService:

    def __init__(self):
        self.scraper = ScrapingService()
        self.gemini = GeminiService()

    async def analyze(self, url: str) -> ScanResponse:
        scraped = await self.scraper.scrape(url)
        ai_result = await self.gemini.analyze(scraped)

        if scraped.get("error") and not scraped.get("raw_text"):
            return ScanResponse(
                url=url, score=50, label="Hata", summary=scraped.get("error"),
                modules=[], bars=[], error=scraped.get("error")
            )

        def get_badge_type(status: str) -> str:
            status_lower = status.lower()
            if "risk" in status_lower and "yüksek" in status_lower: return "danger"
            if "şüpheli" in status_lower or "dikkat" in status_lower: return "warn"
            if "temiz" in status_lower or "normal" in status_lower or "iyi" in status_lower: return "ok"
            if "hata" in status_lower: return "danger"
            return "warn"

        def create_module(icon: str, title: str, data_key: str, default_status: str) -> Module:
            data = ai_result.get(data_key, {})
            status = data.get("status", default_status)
            return Module(
                icon=icon,
                title=title,
                text=data.get("description", ""),
                badge=status,
                badgeType=get_badge_type(status),
                pills=data.get("badges", []),
                details=data.get("details", {})
            )

        def get_color(val: int) -> str:
            if val >= 75: return "#22c55e"
            if val >= 50: return "#eab308"
            if val >= 25: return "#f97316"
            return "#ef4444"

        trust_score = ai_result.get("trust_score", 50)
        trust_label = ai_result.get("trust_label", "Şüpheli")
        summary = "Bu siteye dikkat etmenizi öneririz." if trust_score < 50 else "Bu site genel olarak güvenli görünüyor."

        return ScanResponse(
            url=url,
            score=trust_score,
            label=trust_label,
            summary=summary,
            modules=[
                create_module("💬", "Yorum analizi", "analysis_review", "Şüpheli"),
                create_module("🏷️", "Sahte indirim", "analysis_discount", "Yüksek risk"),
                create_module("🧠", "Manipülasyon teknikleri", "analysis_manipulation", "Şüpheli"),
                create_module("🌐", "Alan adı bilgisi", "analysis_domain", "Dikkat"),
                create_module("🛡️", "İçerik tutarlılığı", "analysis_content", "Normal")
            ],
            bars=[
                Bar(label="Yorum kalitesi", value=ai_result.get("score_review_quality", 50), color=get_color(ai_result.get("score_review_quality", 50))),
                Bar(label="İndirim gerçekliği", value=ai_result.get("score_discount_reality", 50), color=get_color(ai_result.get("score_discount_reality", 50))),
                Bar(label="Manipülasyon", value=max(0, 100 - ai_result.get("score_manipulation", 50)), color=get_color(max(0, 100 - ai_result.get("score_manipulation", 50)))),
                Bar(label="Alan adı", value=ai_result.get("score_domain", 50), color=get_color(ai_result.get("score_domain", 50))),
            ],
            error=scraped.get("error"),
        )