import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

const features = [
  { icon: "💬", title: "Sahte yorum tespiti", desc: "Botik ve manipülatif yorumları işaretler, şüphe sebebini açıklar." },
  { icon: "🏷️", title: "Sahte indirim tespiti", desc: "Referans fiyat manipülasyonunu ve sahte geri sayım sayaçlarını yakalar." },
  { icon: "🧠", title: "Manipülasyon analizi", desc: "Dark pattern ve psikolojik baskı tekniklerini tespit eder." },
  { icon: "🌐", title: "Alan adı kontrolü", desc: "Domain yaşı, SSL ve blacklist kontrolü yapar." },
  { icon: "🛡️", title: "Güven skoru", desc: "Tüm analizleri birleştirerek 0–100 güven skoru üretir." }
]

function Home() {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  function handleAnalyze() {
    if (!url.trim()) {
      setError("Lütfen bir URL girin.")
      return
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL http:// veya https:// ile başlamalı.")
      return
    }
    setError("")
    navigate("/result", { state: { url } })
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleAnalyze()
  }

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <div className="flex flex-col items-center text-center pt-20 pb-16 px-4">

        <div
          style={{ background: "#1e3a5f", color: "#60a5fa" }}
          className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
          AI destekli güven analizi
        </div>

        <h1
          style={{ color: "var(--text-primary)" }}
          className="text-4xl sm:text-5xl font-semibold leading-tight max-w-2xl mb-4"
        >
          Bir siteye girmeden önce güvenli mi öğren
        </h1>

        <p
          style={{ color: "var(--text-secondary)" }}
          className="text-base max-w-md mb-10 leading-relaxed"
        >
          URL yapıştır, 3 saniyede sahte yorum, sahte indirim ve manipülasyon tespiti al.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mb-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://orneksite.com/urun/..."
            style={{
              background: "var(--input-bg)",
              border: "0.5px solid var(--input-border)",
              color: "var(--text-primary)"
            }}
            className="flex-1 px-5 py-3.5 rounded-xl text-sm outline-none transition-colors"
          />
          <button
            onClick={handleAnalyze}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
          >
            Analiz Et →
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-xs mb-2">{error}</p>
        )}

        <p style={{ color: "var(--text-muted)" }} className="text-xs">
          Kayıt gerekmez · Ücretsiz · Sonuç 3 saniyede
        </p>
      </div>

      {/* Divider */}
      <div style={{ borderColor: "var(--border)" }} className="border-t mx-8" />

      {/* Feature Cards */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p style={{ color: "var(--text-muted)" }} className="text-xs text-center tracking-widest mb-6 uppercase">
          5 modül ile tam analiz
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f) => (
            <div
              key={f.title}
              style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              className="rounded-xl p-5"
            >
              <div className="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center text-base mb-3">
                {f.icon}
              </div>
              <h3 style={{ color: "var(--text-primary)" }} className="text-sm font-medium mb-1">{f.title}</h3>
              <p style={{ color: "var(--text-muted)" }} className="text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}

          <div
            style={{ background: "var(--bg-card)", border: "0.5px dashed var(--border)" }}
            className="rounded-xl p-5 flex items-center justify-center"
          >
            <p style={{ color: "var(--text-muted)" }} className="text-xs text-center leading-relaxed">
              Yakında daha<br />fazla modül
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div style={{ border: "0.5px solid var(--border)" }} className="rounded-xl overflow-hidden flex flex-col sm:flex-row">
          {[
            { num: "01", title: "URL gir", desc: "Analiz etmek istediğin sayfanın linkini yapıştır." },
            { num: "02", title: "Analiz başlar", desc: "AI 5 modülü paralel çalıştırır, 3 saniyede tamamlar." },
            { num: "03", title: "Sonucu gör", desc: "Güven skoru ve detaylı raporu incele, karar ver." }
          ].map((step, i) => (
            <div
              key={step.num}
              style={{ borderColor: "var(--border)" }}
              className={`flex-1 p-5 ${i < 2 ? "border-b sm:border-b-0 sm:border-r" : ""}`}
            >
              <p style={{ color: "var(--text-muted)" }} className="text-xs font-medium mb-2">{step.num}</p>
              <p style={{ color: "var(--text-primary)" }} className="text-sm font-medium mb-1">{step.title}</p>
              <p style={{ color: "var(--text-muted)" }} className="text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Home