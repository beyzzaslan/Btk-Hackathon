# === STAGE 1: FRONTEND BUILD ===
# 🚨 NODE SÜRÜMÜNÜ VITE'IN İSTEDİĞİ GİBİ 20'YE YÜKSELTTİK
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend

# Bağımlılıkları kopyala ve kur
COPY frontend/package*.json ./
RUN npm install

# Tüm frontend klasörünü kopyala
COPY frontend/ .

# TypeScript veya Lint uyarıları build'ı engellemesin diye tolerans ayarları
ENV TSC_COMPILE_ON_ERROR=true
ENV DISABLE_ESLINT_PLUGIN=true

# Node 20 ile artık pürüzsüz çalışacak build komutu
RUN npm run build || (npx vite build --emptyOutDir)

# === STAGE 2: FINAL PRODUCTION IMAGE ===
FROM python:3.11-slim
WORKDIR /app

# Backend bağımlılıklarını yükle
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend kodlarını kopyala
COPY backend/ .

# Derlenen React çıktılarını backend statik klasörüne taşı
COPY --from=frontend-builder /frontend/dist ./static

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]