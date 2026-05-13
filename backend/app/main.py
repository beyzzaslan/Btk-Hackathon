from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import scan, health

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="E-ticaret ürün sayfalarındaki manipülasyon taktiklerini tespit eden AI sistemi",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(scan.router, prefix="/api", tags=["scan"])


@app.get("/")
async def root():
    return {"message": f"{settings.APP_NAME} çalışıyor", "version": settings.APP_VERSION}