import httpx
import json
import re
from typing import Dict, Any

class BaseAgent:
    API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def call_llm(self, prompt: str) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    f"{self.API_URL}?key={self.api_key}",
                    json={"contents": [{"parts": [{"text": prompt}]}]}
                )
                response.raise_for_status()
                data = response.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return self._parse_response(text)
        except Exception as e:
            print(f"Agent Error: {str(e)}")
            return {}

    def _parse_response(self, response_text: str) -> Dict[str, Any]:
        text = response_text.strip()
        if text.startswith("```json"): text = text[7:]
        if text.endswith("```"): text = text[:-3]
        
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

        return {}
