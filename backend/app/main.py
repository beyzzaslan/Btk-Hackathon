from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import scan, health
from fastapi.staticfiles import StaticFiles
import os

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

# API Yönlendirmeleri (Her zaman en üstte olmalı)
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(scan.router, prefix="/api", tags=["scan"])


if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")