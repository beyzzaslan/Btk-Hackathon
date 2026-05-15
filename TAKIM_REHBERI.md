# 🚀 TrustLens AI - Backend Takım Rehberi

Bu doküman, projede kimin hangi alandan sorumlu olduğunu, backend mimarisinin nasıl çalıştığını ve sistemi kendi bilgisayarınızda nasıl ayağa kaldıracağınızı açıklar.

## 🛠️ Nasıl Ayağa Kaldırılır?

Backend'i yerelde (localhost) çalıştırmak için şu adımları izleyin:

1. **Python Sanal Ortamını Aktifleştirin:**
   ```bash
   # Windows için:
   .\venv\Scripts\activate
   ```
2. **Gerekli Paketleri Yükleyin:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Çevre Değişkenlerini (.env) Ayarlayın:**
   Ana dizinde (backend klasörü içinde) bir `.env` dosyası oluşturun ve şu satırları ekleyin:
   ```env
   GEMINI_API_KEY_REVIEW=senin_api_keyin_buraya
   GEMINI_API_KEY_PRODUCT=senin_api_keyin_buraya
   ```
   *(Hız limitlerine takılmamak için iki farklı hesap/key kullanmanız tavsiye edilir. Tek key'iniz varsa ikisine de aynı key'i yapıştırabilirsiniz).*

4. **Sunucuyu Başlatın:**
   ```bash
   uvicorn app.main:app --reload
   ```
5. **Test Edin:** Tarayıcıdan `http://localhost:8000/docs` adresine giderek Swagger arayüzünden test yapabilirsiniz.

---

## 📂 Backend Sınıfları Ne İş Yapar?

Sistemimiz **"Parallel Agent"** (Paralel Ajan) mimarisiyle çalışır. Yani görevler tek bir yere yığılmaz, farklı ajanlara dağıtılır ve aynı anda çözülür.

* **`app/api/routes/scan.py`**: Gelen HTTP isteklerini karşılayan kapıcıdır. İsteği alır ve `AnalysisService`'e yönlendirir.
* **`app/schemas/scan_schema.py`**: Frontend'in beklediği veri modelinin (JSON şablonunun) tanımlandığı yerdir. Yapay zekanın döndüğü veriler bu şablona girmek zorundadır.
* **`app/services/scraping_service.py`**: Kullanıcının girdiği Trendyol/Hepsiburada linkine gidip HTML'i, fiyatı ve yorumları çeken (kazıyan) kısımdır.
* **`app/services/analysis_service.py`**: Sistemin **orkestra şefidir**. Scraping servisinden veriyi alır, yapay zeka ajanlarına (`ReviewAgent` ve `ProductAgent`) **aynı anda** gönderir. Ajanlardan gelen cevapları toplayıp Frontend'in beklediği formata sokar.
* **`app/agents/base_agent.py`**: Google Gemini'a HTTP isteği atan ortak sınıftır.
* **`app/agents/review_agent.py`**: SADECE yorumları okuyan ve analiz eden özel yapay zeka ajanıdır.
* **`app/agents/product_agent.py`**: Ürün fiyatını, manipülasyon (dark pattern) taktiklerini ve indirim gerçekliğini inceleyen ajan.

*(Not: Eski `gemini_service.py` dosyası mimari ajanlara bölündüğü için kalıcı olarak silinmiştir).*

---

## 🤖 Yapay Zeka (AI) Ekibinin Görevleri

Yapay zeka ekibinin oyun alanı **`app/agents/`** klasörüdür. Sistem altyapısı kurulmuştur, artık odaklanmanız gereken tek şey **"Prompt Engineering"** ve AI modellerini iyileştirmektir.

1. **Promptları Düzenleyin:** `review_agent.py` ve `product_agent.py` içerisindeki metinleri (promptları) düzenleyerek Gemini'nin daha zeki ve isabetli yorumlar yapmasını sağlayın.
2. **Kuralı Bozmayın:** JSON çıktı formatının şablonunu değiştirmeyin. Aksi takdirde Frontend çökebilir. Sadece "title", "description" gibi içeriklerin kalitesini artırın.
3. **Yeni Ajanlar Ekleyebilirsiniz:** İleride sistemi büyütmek isterseniz `SellerAgent` (Satıcı Puanı Ajanı) gibi yeni ajanlar yazabilirsiniz. Bunun için `BaseAgent`'ı miras almanız yeterlidir.

---

## 💻 Frontend Ekibinin Görevleri

Backend tamamen sizin beklediğiniz formata (`ScanResponse` nesnesi) göre ayarlanmıştır. Herhangi bir ekstra analiz, matematik veya JSON parse işlemi yapmanıza gerek yoktur.

1. **Sadece İstek Atın:** Kullanıcı bir URL girdiğinde `POST /scan` endpoint'ine `{ "url": "..." }` şeklinde istek atın.
2. **Arayüzü Çizin:** Dönen JSON verisi zaten sizin modallarınız (Yorum Kalitesi, İndirim Analizi vb.) için gerekli tüm `badges`, `icon`, `color`, `badgeType` verilerini hazır olarak gönderir. Tek yapmanız gereken React/Vue tarafında bu veriyi UI bileşenlerine bağlamak.
3. **Loading Deneyimi:** Paralel mimariye geçtiğimiz için analiz süresi kısaldı (ortalama 3-5 saniye). Kullanıcı butona bastığında "Yapay Zeka Analiz Ediyor..." tarzı şık bir loading animasyonu göstermeniz uygulamanın Premium hissiyatını artıracaktır.
