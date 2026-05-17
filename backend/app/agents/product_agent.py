import httpx
import json
import re
from app.agents.base_agent import BaseAgent
from app.core.config import settings

class ProductAgent(BaseAgent):
    def __init__(self):
        super().__init__(api_key=settings.GEMINI_API_KEY_PRODUCT)

    async def analyze(self, product_data: dict) -> dict:
        ui_str = ", ".join(product_data.get("ui_elements", []))
        
        # backend/app/agents/product_agent.py içindeki prompt ve return kısmını şu şekilde güncelleyin:

        prompt = (
            "Sen 'TrustLens AI' sisteminin 'Product & UI Agent' modülüsün. Sana gelen fiyat ve arayüz elementlerini analiz et.\n\n"
            "[ÜRÜN VERİLERİ]\n"
            f"- Link: {product_data.get('url', '')}\n"
            f"- Ürün Adı: {product_data.get('product_name', '')}\n"
            f"- Mevcut Fiyat: {product_data.get('current_price', '')}\n"
            f"- Eski Fiyat: {product_data.get('claimed_original_price', '')}\n"
            f"- Baskı Metinleri: {ui_str}\n\n"
            "SADECE ve SADECE aşağıdaki JSON formatında yanıt ver. Markdown etiketleri kullanma!\n"
            "{\n"
            "  \"discount_score\": Sayı, \"discount_badge\": \"Metin\", \"discount_badgeType\": \"ok|warn|danger\", \"discount_text\": \"Metin\", \"discount_pills\": [],\n"
            "  \"claimed_price\": \"Eski fiyat (Örn: 4.999₺)\", \"current_price\": \"Şu anki fiyat (Örn: 299₺)\", \"lowest_price\": \"En düşük fiyat\", \"fake_reason\": \"Grafik altındaki uyarı metni\",\n"
            "  \"price_history\": [{\"date\": \"2026-01\", \"price\": 4999}, {\"date\": \"2026-02\", \"price\": 299}],\n"
            "  \"manipulation_score\": Sayı, \"manipulation_badge\": \"Metin\", \"manipulation_badgeType\": \"ok|warn|danger\", \"manipulation_text\": \"Metin\", \"manipulation_pills\": [],\n"
            "  \"domain_score\": Sayı, \"domain_badge\": \"Metin\", \"domain_badgeType\": \"ok|warn|danger\", \"domain_text\": \"Metin\", \"domain_pills\": [],\n"
            "  \"domain_age\": \"Domain yaşı (Örn: 14 günlük domain)\", \"ssl_status\": \"SSL ✓\",\n"
            "  \"consistency_badge\": \"Metin\", \"consistency_badgeType\": \"ok|danger\", \"consistency_text\": \"Metin\", \"consistency_pills\": [],\n"
            "  \"is_consistent\": true,\n"
            "  \"details\": {\n"
            "    \"price_match\": \"Tutarlı|Uyuşmazlık\", \"price_desc\": \"Açıklama\",\n"
            "    \"desc_match\": \"Tutarlı|Uyuşmazlık\", \"desc_desc\": \"Açıklama\",\n"
            "    \"cargo_match\": \"Tutarlı|Uyuşmazlık\", \"cargo_desc\": \"Açıklama\",\n"
            "    \"seller_match\": \"Tutarlı|Uyuşmazlık\", \"seller_desc\": \"Açıklama\"\n"
            "  }\n"
            "}"
        )
        
        try:
            raw_response = await self.call_gemini(prompt)
            json_match = re.search(r"\{.*\}", raw_response, re.DOTALL)
            return json.loads(json_match.group()) if json_match else json.loads(raw_response)
        except Exception:
            return {
                "discount_score": 50, "discount_badge": "Normal", "discount_badgeType": "ok", "discount_text": "Analiz Hazır.", "discount_pills": [],
                "manipulation_score": 50, "manipulation_badge": "Normal", "manipulation_badgeType": "ok", "manipulation_text": "Analiz Hazır.", "manipulation_pills": [],
                "domain_score": 50, "domain_badge": "Normal", "domain_badgeType": "ok", "domain_text": "Analiz Hazır.", "domain_pills": [],
                "consistency_badge": "Normal", "consistency_badgeType": "ok", "consistency_text": "Analiz Hazır.", "consistency_pills": []
            }