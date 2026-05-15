from .base_agent import BaseAgent
from typing import Dict, Any

class ReviewAgent(BaseAgent):
    async def analyze(self, scraped_data: Dict[str, Any]) -> Dict[str, Any]:
        reviews = "\n".join(scraped_data.get("reviews", [])[:15]) or "Yorum bulunamadı"
        
        prompt = f"""Sen e-ticaret yorumlarını inceleyen bir yapay zeka ajanısın. Sadece yorumlara odaklan.
Şu yorumları analiz et: {reviews}

SADECE aşağıdaki JSON formatında yanıt ver, markdown kullanma:
{{
  "score_review_quality": <0-100 arasi sayi>,
  "analysis_review": {{
    "status": "<Şüpheli | İyi | Normal | Çok Kötü>",
    "description": "<Yorumlar hakkinda kisa metin, orn: 15 yorum incelendi, cogu jenerik.>",
    "badges": ["Aynı gün 15 yorum", "%97 beş yıldız", "Güvenilir profil"],
    "details": {{
      "total_reviews": <sayi>,
      "suspicious_reviews": <sayı>,
      "examples": [{{"stars": "⭐⭐⭐⭐⭐", "text": "...", "reason": "..."}}]
    }}
  }}
}}
DİKKAT: JSON formatını kesinlikle bozma!
"""
        result = await self.call_llm(prompt)
        if not result:
            return {
                "score_review_quality": 50, 
                "analysis_review": {"status": "Hata", "description": "Yorum analizi başarısız oldu.", "badges": [], "details": {}}
            }
        return result
