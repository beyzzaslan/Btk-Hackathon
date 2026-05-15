from pydantic import BaseModel, field_validator
from typing import List, Optional, Dict, Any

class ScanRequest(BaseModel):
    url: str

    @field_validator("url")
    @classmethod
    def validate_url(cls, v):
        if not v.startswith(("http://", "https://")):
            raise ValueError("Geçerli bir URL giriniz")
        return v.strip()

class Module(BaseModel):
    icon: str
    title: str
    text: str
    badge: str
    badgeType: str
    pills: List[str]
    details: Optional[Any] = None

class Bar(BaseModel):
    label: str
    value: int
    color: str

class ScanResponse(BaseModel):
    url: str
    score: int
    label: str
    summary: str
    modules: List[Module]
    bars: List[Bar]
    error: Optional[str] = None