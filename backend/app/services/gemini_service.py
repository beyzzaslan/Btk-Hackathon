import httpx
import json
import re
from typing import Dict, Any
from app.core.config import settings


class GeminiService:
    API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"

    async def analyze(self, scraped_data: Dict[str, Any]) -> Dict[str, Any]:
        if scraped_data.get("error") and not scraped_data.get("raw_text"):
            return self._fallback_response(scraped_data["error"])

        prompt = self._build_prompt(scraped_data)

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    f"{self.API_URL}?key={settings.GEMINI_API_KEY}",
                    json={
                        "contents": [
                            {"parts": [{"text": prompt}]}
                        ]
                    }
                )
                response.raise_for_status()
                data = response.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return self._parse_response(text)

        except Exception as e:
            return self._fallback_response(f"AI analizi başarısız: {str(e)}")

    def _build_prompt(self, data: Dict[str, Any]) -> str:
        product_name = data.get("product_name", "Bilinmiyor")
        price = data.get("price", "Bilinmiyor")
        campaign_texts = "\n".join(data.get("campaign_texts", [])) or "Kampanya metni bulunamadı"
        reviews = "\n".join(data.get("reviews", [])[:15]) or "Yorum bulunamadı"
        raw_text = data.get("raw_text", "")[:2000]

        return f"""Sen bir e-ticaret analiz yapay zekasısın. Verilen ürün verilerini analiz et.

ÜRÜN ADI: {product_name}
FİYAT: {price}
KAMPANYALAR: {campaign_texts}
YORUMLAR: {reviews}
İÇERİK ÖZETİ: {raw_text}

SADECE VE SADECE aşağıdaki JSON formatında yanıt ver, markdown kullanma, sadece saf JSON dondür:
{{
  "trust_score": <0-100 arasi sayi, orn: 72>,
  "trust_label": "<Güvenilir | Dikkatli Ol | Tehlikeli | Şüpheli>",
  "score_review_quality": <0-100 arasi sayi>,
  "score_discount_reality": <0-100 arasi sayi>,
  "score_manipulation": <0-100 arasi sayi, yüksek skor manipülasyon VAR demek>,
  "score_domain": <0-100 arasi sayi, orn: 30>,
  
  "analysis_review": {{
    "status": "<Şüpheli | İyi | Normal | Çok Kötü>",
    "description": "<Yorumlar hakkinda detayli kisa metin, orn: 48 yorumdan 31'i şüpheli bulundu.>",
    "badges": ["Aynı gün 15 yorum", "Aşırı jenerik dil", "%97 beş yıldız"],
    "details": {{
      "total_reviews": <İncelediğin toplam yorum sayısı>,
      "suspicious_reviews": <Şüpheli bulduğun yorum sayısı>,
      "examples": [
        {{"stars": "⭐⭐⭐⭐⭐", "text": "<Örnek şüpheli yorum>", "reason": "<Neden şüpheli? Örn: Jenerik ifade>"}}
      ]
    }}
  }},
  
  "analysis_discount": {{
    "status": "<Yüksek risk | Düşük risk | Temiz>",
    "description": "<İndirim gercekligi analizi>",
    "badges": ["Sayaç sıfırlanıyor", "Referans fiyat yok", "vs."]
  }},
  
  "analysis_manipulation": {{
    "status": "<2 teknik | Temiz | Şüpheli>",
    "description": "<Dark pattern analizi>",
    "badges": ["Son 2 ürün kaldı!", "Fırsatı kaçırma", "Sahte sayaç", "Şu an 38 kişi bakıyor", "Fiyatlar artıyor"],
    "details": [
      {{"icon": "🚨", "title": "Yapay Aciliyet", "description": "<Bulduğun manipülasyonun tam açıklaması>"}}
    ]
  }},
  
  "analysis_domain": {{
    "status": "<Dikkat | Temiz | Şüpheli>",
    "description": "<Domain ve url bazli hizli analiz, SSL var vs>",
    "badges": ["14 günlük domain", "SSL ✓", "Blacklist temiz"],
    "details": {{
      "domain_age": "<X günlük domain>",
      "ssl_ok": <true veya false>,
      "blacklist_ok": <true veya false>
    }}
  }},
  
  "analysis_content": {{
    "status": "<Normal | Tutarsız>",
    "description": "<Fiyat ve icerik tutarliligi>",
    "badges": [],
    "details": {{
      "price_consistency": <true/false>,
      "description_consistency": <true/false>,
      "shipping_consistency": <true/false>,
      "seller_consistency": <true/false>
    }}
  }}
}}
DİKKAT: JSON formatını ve 'details' objelerinin içindeki yapıları KESİNLİKLE bozma, eksiksiz doldur!
"""

    def _parse_response(self, response_text: str) -> Dict[str, Any]:
        # JSON markdown bloğunu temizle (eğer Gemini koyarsa)
        text = response_text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        try:
            return json.loads(text.strip())
        except json.JSONDecodeError:
            pass

        json_match = re.search(r"\{.*\}", response_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group())
            except json.JSONDecodeError:
                pass

        return self._fallback_response("AI yanıtı işlenemedi")

    def _fallback_response(self, error_msg: str) -> Dict[str, Any]:
        return {
            "trust_score": 50,
            "trust_label": "Hata",
            "score_review_quality": 0,
            "score_discount_reality": 0,
            "score_manipulation": 0,
            "score_domain": 0,
            "analysis_review": {"status": "Hata", "description": error_msg, "badges": []},
            "analysis_discount": {"status": "Hata", "description": error_msg, "badges": []},
            "analysis_manipulation": {"status": "Hata", "description": error_msg, "badges": []},
            "analysis_domain": {"status": "Hata", "description": error_msg, "badges": []},
            "analysis_content": {"status": "Hata", "description": error_msg, "badges": []},
        }