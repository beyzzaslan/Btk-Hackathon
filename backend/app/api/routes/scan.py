from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.analysis_service import AnalysisService
from app.services.scraping_service import ScrapingService # Ezgi'nin yazdığı gerçek kazıcı sınıfı

router = APIRouter()

class ScanRequest(BaseModel):
    url: str

analysis_service = AnalysisService()
scraping_service = ScrapingService()

@router.post("/scan")
async def scan_url(request: ScanRequest):
    if not request.url:
        raise HTTPException(status_code=400, detail="URL bos olamaz.")
    
    try:
        # 1. Adım: Ezgi'nin kazıcısı gidip HTML'den verileri getiriyor
        scraped_data = await scraping_service.scrape(request.url)
        
        # 2. Adım: Senin yapay zeka ajanların veriyi paralel işleyip Zehra'ya uçuruyor
        analysis_result = await analysis_service.run_full_analysis(request.url, scraped_data)
        
        return analysis_result
        
    except Exception as e:
        # 2. Bölümün son maddesindeki profesyonel Fallback Hata Yakalama mekanizması
        raise HTTPException(
            status_code=500, 
            detail=f"Üzgünüz, bu siteyi şu an analiz edemedik. Teknik Sorun: {str(e)}"
        )