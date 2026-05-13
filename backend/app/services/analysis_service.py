from app.services.scraping_service import ScrapingService
from app.services.gemini_service import GeminiService
from app.schemas.scan_schema import ScanResponse, SubAnalysis


class AnalysisService:

    def __init__(self):
        self.scraper = ScrapingService()
        self.gemini = GeminiService()

    async def analyze(self, url: str) -> ScanResponse:
        scraped = await self.scraper.scrape(url)
        ai_result = await self.gemini.analyze(scraped)

        def create_sub(data_key: str, default_status: str) -> SubAnalysis:
            data = ai_result.get(data_key, {})
            return SubAnalysis(
                status=data.get("status", default_status),
                description=data.get("description", ""),
                badges=data.get("badges", [])
            )

        return ScanResponse(
            url=url,
            product_name=scraped.get("product_name") or None,
            product_price=scraped.get("price") or None,
            trust_score=ai_result.get("trust_score", 50),
            trust_label=ai_result.get("trust_label", "Şüpheli"),
            score_review_quality=ai_result.get("score_review_quality", 50),
            score_discount_reality=ai_result.get("score_discount_reality", 50),
            score_manipulation=ai_result.get("score_manipulation", 50),
            score_domain=ai_result.get("score_domain", 50),
            analysis_review=create_sub("analysis_review", "Şüpheli"),
            analysis_discount=create_sub("analysis_discount", "Yüksek risk"),
            analysis_manipulation=create_sub("analysis_manipulation", "Bulundu"),
            analysis_domain=create_sub("analysis_domain", "Dikkat"),
            analysis_content=create_sub("analysis_content", "Normal"),
            error=scraped.get("error"),
        )