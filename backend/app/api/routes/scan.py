from fastapi import APIRouter, HTTPException
from app.schemas.scan_schema import ScanRequest, ScanResponse
from app.services.analysis_service import AnalysisService

router = APIRouter()
analysis_service = AnalysisService()


@router.post("/scan", response_model=ScanResponse)
async def scan_product(payload: ScanRequest):
    try:
        result = await analysis_service.analyze(payload.url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))