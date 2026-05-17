import httpx
import json
import re
from app.agents.base_agent import BaseAgent
from app.core.config import settings

class ReviewAgent(BaseAgent):
    def __init__(self):
        # Ezgi'nin beklediği spesifik config anahtarı
        super().__init__(api_key=settings.GEMINI_API_KEY_REVIEW)

    async def analyze(self, raw_reviews: list) -> dict:
        reviews_str = "\n".join(raw_reviews)
        
        # backend/app/agents/review_agent.py içindeki prompt ve return kısmını şu şekilde güncelleyin:

        prompt = (
            "Sen 'TrustLens AI' sisteminin 'Review Analysis Agent' (Yorum Uzmanı) modülüsün.\n"
            "Görevin, aşağıda verilen e-ticaret kullanıcı yorumlarını derinlemesine incelemektir.\n\n"
            "[ÜRÜN YORUMLARI]\n"
            f"{reviews_str}\n\n"
            "SADECE ve SADECE aşağıdaki JSON formatında yanıt ver. Markdown etiketleri kullanma!\n"
            "{\n"
            "  \"score\": 0-100 arası yorum kalitesi puanı (Sayı),\n"
            "  \"badge\": \"Şüpheli\" | \"Temiz\" | \"Riskli\",\n"
            "  \"badgeType\": \"warn\" | \"ok\" | \"danger\",\n"
            "  \"text\": \"Yorum kalitesi hakkında maksimum 2 cümlelik özet açıklama.\",\n"
            "  \"pills\": [\"En net 2 bulgu kelimesi\"],\n"
            "  \"anomalous_count_text\": \"31 / 48 yorum anormal örüntü gösteriyor gibi bir oran metni\",\n"
            "  \"suspicious_examples\": [\n"
            "    {\"stars\": 5, \"text\": \"Yapay veya aşırı jenerik yorum örneği 1\", \"tag\": \"Jenerik\"},\n"
            "    {\"stars\": 5, \"text\": \"Yapay veya aşırı jenerik yorum örneği 2\", \"tag\": \"Aşırı Pozitif\"}\n"
            "  ]\n"
            "}"
        )
        
        try:
            # BaseAgent'ın Google'a giden ana istek fonksiyonunu tetikliyoruz
            raw_response = await self.call_gemini(prompt)
            json_match = re.search(r"\{.*\}", raw_response, re.DOTALL)
            return json.loads(json_match.group()) if json_match else json.loads(raw_response)
        except Exception:
            return {
                "score": 50, "badge": "Beklemede", "badgeType": "warn",
                "text": "Yorum analiz motoru şu an meşgul.", "pills": []
            }