from .base_agent import BaseAgent
from typing import Dict, Any

class ProductAgent(BaseAgent):
    async def analyze(self, scraped_data: Dict[str, Any]) -> Dict[str, Any]:
        product_name = scraped_data.get("product_name", "Bilinmiyor")
        price = scraped_data.get("price", "Bilinmiyor")
        campaign_texts = "\n".join(scraped_data.get("campaign_texts", [])) or "Kampanya metni bulunamadı"
        raw_text = scraped_data.get("raw_text", "")[:2000]

        prompt = f"""Sen e-ticaret manipülasyonlarını (Dark Patterns) ve ürün güvenilirliğini bulan bir ajansın.
ÜRÜN ADI: {product_name}
FİYAT: {price}
KAMPANYALAR: {campaign_texts}
İÇERİK ÖZETİ: {raw_text}

SADECE aşağıdaki JSON formatında yanıt ver, markdown kullanma:
{{
  "trust_score": <0-100 arasi sayi, genel urun guvenilirligi>,
  "trust_label": "<Güvenilir | Dikkatli Ol | Tehlikeli | Şüpheli>",
  "score_discount_reality": <0-100 arasi sayi>,
  "score_manipulation": <0-100 arasi sayi, yuksek olmasi manipülasyon VAR demektir>,
  "score_domain": <0-100 arasi sayi>,
  
  "analysis_discount": {{
    "status": "<Yüksek risk | Düşük risk | Temiz>",
    "description": "<İndirim gercekligi analizi>",
    "badges": ["Sahte sayaç", "Referans fiyat yok", "vs."]
  }},
  
  "analysis_manipulation": {{
    "status": "<2 teknik | Temiz | Şüpheli>",
    "description": "<Dark pattern analizi>",
    "badges": ["Fırsatı kaçırma", "Yapay aciliyet"],
    "details": [
      {{"icon": "🚨", "title": "...", "description": "..."}}
    ]
  }},
  
  "analysis_domain": {{
    "status": "<Dikkat | Temiz | Şüpheli>",
    "description": "<Domain analizi>",
    "badges": ["SSL ✓", "vs."],
    "details": {{"domain_age": "Bilinmiyor", "ssl_ok": true, "blacklist_ok": true}}
  }},
  
  "analysis_content": {{
    "status": "<Normal | Tutarsız>",
    "description": "<İcerik tutarliligi>",
    "badges": [],
    "details": {{"price_consistency": true, "description_consistency": true, "shipping_consistency": true, "seller_consistency": true}}
  }}
}}
DİKKAT: JSON formatını kesinlikle bozma!
"""
        result = await self.call_llm(prompt)
        if not result:
            return {
                "trust_score": 50, "trust_label": "Hata", "score_discount_reality": 0, "score_manipulation": 0, "score_domain": 0,
                "analysis_discount": {"status": "Hata", "description": "Hata", "badges": []},
                "analysis_manipulation": {"status": "Hata", "description": "Hata", "badges": [], "details": []},
                "analysis_domain": {"status": "Hata", "description": "Hata", "badges": [], "details": {}},
                "analysis_content": {"status": "Hata", "description": "Hata", "badges": [], "details": {}}
            }
        return result
