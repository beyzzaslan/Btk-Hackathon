from pydantic import BaseModel, field_validator
from typing import List, Optional

class ScanRequest(BaseModel):
    url: str

    @field_validator("url")
    @classmethod
    def validate_url(cls, v):
        if not v.startswith(("http://", "https://")):
            raise ValueError("Geçerli bir URL giriniz")
        return v.strip()

class SubAnalysis(BaseModel):
    status: str
    description: str
    badges: List[str]

class ScanResponse(BaseModel):
    url: str
    product_name: Optional[str] = None
    product_price: Optional[str] = None
    trust_score: int
    trust_label: str
    
    score_review_quality: int
    score_discount_reality: int
    score_manipulation: int
    score_domain: int
    
    analysis_review: SubAnalysis
    analysis_discount: SubAnalysis
    analysis_manipulation: SubAnalysis
    analysis_domain: SubAnalysis
    analysis_content: SubAnalysis
    
    error: Optional[str] = None