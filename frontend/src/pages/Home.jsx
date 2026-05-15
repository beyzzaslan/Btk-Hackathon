import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

const features = [
  { icon: "💬", title: "Sahte yorum tespiti", desc: "Botik ve manipülatif yorumları işaretler, şüphe sebebini açıklar.", accent: "var(--accent)" },
  { icon: "🏷️", title: "Sahte indirim tespiti", desc: "Referans fiyat manipülasyonunu ve sahte geri sayım sayaçlarını yakalar.", accent: "#f59e0b" },
  { icon: "🧠", title: "Manipülasyon analizi", desc: "Dark pattern ve psikolojik baskı tekniklerini tespit eder.", accent: "#8b5cf6" },
  { icon: "🌐", title: "Alan adı kontrolü", desc: "Domain yaşı, SSL sertifikası ve kara liste kontrolü yapar.", accent: "#3b82f6" },
  { icon: "🛡️", title: "Güven skoru", desc: "Tüm analizleri birleştirerek 0–100 arası güven skoru üretir.", accent: "#10b981" },
]

const faqs = [
  { q: "TrustLens AI nasıl çalışır?", a: "Analiz etmek istediğin ürün sayfasının URL'ini yapıştırıyorsun. Sistemimiz sayfayı tarayarak 5 farklı modülde analiz ediyor ve 3 saniye içinde güven skoru + detaylı rapor üretiyor." },
  { q: "Hangi siteler destekleniyor?", a: "Trendyol, Hepsiburada, Amazon, n11 başta olmak üzere URL'i olan her ürün sayfasını analiz edebilirsin. Sosyal medya linkleri desteklenmiyor." },
  { q: "Verilerim güvende mi?", a: "Girdiğin URL'ler analiz sonrası sistemimizde saklanmıyor. Kişisel bilgi toplamıyoruz, kayıt gerektirmiyoruz." },
  { q: "Tamamen ücretsiz mi?", a: "Evet, temel analiz tamamen ücretsiz. İleride daha detaylı raporlar için opsiyonel premium özellikler eklenebilir." },
  { q: "Sonuç her zaman doğru mu?", a: "AI destekli sistemimiz yüksek doğrulukla çalışsa da %100 kesinlik garantisi veremeyiz. Sonuçları karar verirken bir referans olarak kullan." },
]

const steps = [
  { num: "01", icon: "🔗", title: "URL'i yapıştır", desc: "Satın almayı düşündüğün ürün sayfasının linkini kopyala ve kutuya yapıştır." },
  { num: "02", icon: "⚡", title: "AI analiz eder", desc: "5 modül aynı anda çalışır: yorumlar, fiyat, manipülasyon, domain ve içerik taranır." },
  { num: "03", icon: "✅", title: "Kararını ver", desc: "Güven skoru ve detaylı raporu incele. Aldatılmadan, güvenle alışveriş yap." },
]

function TrustLensLogo({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="hg2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx = 32 + Math.cos(rad) * 18
        const cy = 32 + Math.sin(rad) * 18
        return <circle key={i} cx={cx} cy={cy} r={10} stroke="url(#hg1)" strokeWidth="1.2" fill="none" opacity="0.7" />
      })}
      <circle cx="32" cy="32" r="8" stroke="url(#hg2)" strokeWidth="1.4" fill="none" opacity="0.9" />
      <circle cx="32" cy="32" r="4.5" stroke="url(#hg1)" strokeWidth="1.2" fill="none" opacity="0.8" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const x1 = 32 + Math.cos(rad) * 10
        const y1 = 32 + Math.sin(rad) * 10
        const x2 = 32 + Math.cos(rad) * 22
        const y2 = 32 + Math.sin(rad) * 22
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#hg1)" strokeWidth="1" opacity="0.5" />
      })}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx = 32 + Math.cos(rad) * 28
        const cy = 32 + Math.sin(rad) * 28
        return <circle key={i} cx={cx} cy={cy} r={1.8} fill="url(#hg1)" opacity="0.9" />
      })}
      {[30, 90, 150, 210, 270, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx = 32 + Math.cos(rad) * 20
        const cy = 32 + Math.sin(rad) * 20
        return <circle key={i} cx={cx} cy={cy} r={1.2} fill="#ec4899" opacity="0.7" />
      })}
      <circle cx="32" cy="32" r="2.5" fill="url(#hg2)" opacity="1" />
    </svg>
  )
}

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function FAQItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${open ? "var(--accent)44" : "var(--border)"}`,
        borderRadius: 16, padding: "20px 24px",
        cursor: "pointer",
        transition: "box-shadow 0.25s, border-color 0.25s, background 0.25s",
        boxShadow: open ? "0 8px 32px var(--accent-subtle)" : "none"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <span style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
          {item.q}
        </span>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: open ? "var(--accent)" : "var(--bg-secondary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          transition: "background 0.25s, transform 0.25s",
          transform: open ? "rotate(45deg)" : "rotate(0deg)"
        }}>
          <span style={{ color: open ? "#fff" : "var(--text-muted)", fontSize: 18, lineHeight: 1, marginTop: -1 }}>+</span>
        </div>
      </div>
      {open && (
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75, marginTop: 14, fontFamily: "'DM Sans', sans-serif" }}>
          {item.a}
        </p>
      )}
    </div>
  )
}

function Home() {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const [stepsRef, stepsVisible] = useInView()
  const [featuresRef, featuresVisible] = useInView()
  const [faqRef, faqVisible] = useInView()

  function handleAnalyze() {
    if (!url.trim()) { setError("Lütfen bir URL girin."); return }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL http:// veya https:// ile başlamalı."); return
    }
    setError("")
    navigate("/result", { state: { url } })
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleAnalyze()
  }

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .home-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .home-root { font-family: 'DM Sans', sans-serif; }

        .url-input {
          background: var(--input-bg);
          border: 1.5px solid var(--input-border);
          border-radius: 16px; padding: 16px 22px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: var(--text-primary); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .url-input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-subtle); }
        .url-input::placeholder { color: var(--text-muted); }

        .analyze-btn {
          background: var(--accent); color: #fff; border: none;
          border-radius: 16px; padding: 16px 32px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          cursor: pointer; transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          white-space: nowrap; letter-spacing: 0.01em;
        }
        .analyze-btn:hover {
          background: var(--accent-hover); transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--accent-glow);
        }
        .analyze-btn:active { transform: translateY(0); }

        .feature-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px; padding: 28px 24px;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px var(--accent-subtle);
          border-color: var(--accent)44;
        }

        .badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--accent-subtle); color: var(--accent);
          border: 1px solid var(--accent-border); border-radius: 999px;
          padding: 6px 16px; font-size: 12px; font-weight: 500;
          letter-spacing: 0.03em; font-family: 'DM Sans', sans-serif;
        }
        .pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent); display: inline-block; flex-shrink: 0;
          animation: pulse-pink 2s infinite;
        }
        @keyframes pulse-pink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.6); }
        }

        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 22px 20px;
          text-align: center; flex: 1; min-width: 120px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px var(--accent-subtle); }

        .footer-link {
          color: var(--text-secondary); font-size: 13px; text-decoration: none;
          transition: color 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .footer-link:hover { color: #f87171; }

        .section-tag {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 11px; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--accent);
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          margin-bottom: 14px;
        }
        .section-tag::before, .section-tag::after {
          content: ''; height: 1px; width: 32px;
          background: var(--accent-glow);
        }

        .fade-up {
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .fade-up.delay-1 { transition-delay: 0.1s; }
        .fade-up.delay-2 { transition-delay: 0.2s; }
        .fade-up.delay-3 { transition-delay: 0.3s; }

        .footer-col-title {
          color: var(--text-muted); font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          margin-bottom: 18px;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          animation: marquee 22s linear infinite;
          width: max-content;
        }
        .marquee-track:hover { animation-play-state: paused; }
        .marquee-item {
          display: flex; align-items: center; gap: 10px;
          padding: 0 28px; white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 400;
          color: var(--text-muted); letter-spacing: 0.02em;
        }
        .marquee-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--accent)66; flex-shrink: 0;
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .cta-shimmer {
          background: linear-gradient(90deg, var(--accent) 0%, #fb7185 40%, #fda4af 50%, #fb7185 60%, var(--accent) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="home-root">
        <Navbar />

        {/* ── HERO ── */}
        <section style={{
          background: "var(--bg-primary)",
          padding: "96px 24px 80px", textAlign: "center",
          position: "relative", overflow: "hidden"
        }}>
          {/* Gradient overlays */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent-subtle) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 40% at 85% 60%, rgba(168,85,247,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

          {/* Floating dots */}
          <div style={{ position: "absolute", top: 60, left: "8%", width: 12, height: 12, borderRadius: "50%", background: "var(--accent)33", animation: "float 4s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: 120, right: "12%", width: 8, height: 8, borderRadius: "50%", background: "#a855f733", animation: "float 5s ease-in-out infinite 1s" }} />
          <div style={{ position: "absolute", bottom: 80, left: "15%", width: 6, height: 6, borderRadius: "50%", background: "#06b6d433", animation: "float 6s ease-in-out infinite 2s" }} />

          <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <div style={{ animation: "float 6s ease-in-out infinite", filter: "drop-shadow(0 4px 24px rgba(168,85,247,0.3))" }}>
                <TrustLensLogo size={72} />
              </div>
            </div>

            <div className="badge" style={{ marginBottom: 36 }}>
              <span className="pulse" />
              AI destekli ürün güven analizi
            </div>

            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(44px, 6.5vw, 72px)",
              color: "var(--text-primary)", lineHeight: 1.08,
              marginBottom: 10, fontWeight: 400, letterSpacing: "-0.02em"
            }}>
              Onlar manipüle eder.
            </h1>
            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(44px, 6.5vw, 72px)",
              background: "linear-gradient(135deg, var(--accent), #fb7185)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              lineHeight: 1.08, fontStyle: "italic", fontWeight: 400,
              marginBottom: 32, letterSpacing: "-0.02em"
            }}>
              Sen analiz et.
            </h1>

            <p style={{ color: "var(--text-secondary)", fontSize: 17, maxWidth: 600, margin: "0 auto 48px", lineHeight: 1.6, fontWeight: 300, whiteSpace: "nowrap" }}>
              Sahte yorum, uydurma indirim, manipülasyon tuzağı — sepete atmadan önce 3 saniyede öğren.
            </p>

            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://trendyol.com/urun/..."
                  className="url-input"
                  style={{ flex: 1, minWidth: 220 }}
                />
                <button onClick={handleAnalyze} className="analyze-btn">
                  Analiz Et ↗
                </button>
              </div>
              {error && <p style={{ color: "var(--accent)", fontSize: 12, marginTop: 8 }}>{error}</p>}
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 12, textAlign: "left", paddingLeft: 4 }}>
                Kayıt gerekmez · Tamamen ücretsiz · Sonuç 3 saniyede
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 52 }}>
              {[
                { val: "5", label: "Analiz modülü" },
                { val: "3sn", label: "Ortalama süre" },
                { val: "%0", label: "Veri saklama" },
                { val: "∞", label: "Ücretsiz kullanım" },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, color: "var(--text-primary)", lineHeight: 1 }}>{s.val}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 5 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── KAYAN YAZI BANDI ── */}
        <div style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "14px 0", overflow: "hidden" }}>
          <div className="marquee-track">
            {[...Array(2)].map((_, gi) => (
              <div key={gi} style={{ display: "flex" }}>
                {["Sahte yorum tespiti", "Sahte indirim analizi", "Manipülasyon tespiti", "Alan adı kontrolü", "Güven skoru", "3 saniyede sonuç", "Kayıt gerekmez", "Tamamen ücretsiz", "AI destekli analiz"].map((text, i) => (
                  <div key={i} className="marquee-item">
                    <span className="marquee-dot" />
                    {text}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── NASIL ÇALIŞIR ── */}
        <section style={{ background: "var(--bg-secondary)", padding: "96px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }} ref={stepsRef}>
              <div className="section-tag">nasıl çalışır</div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 4.5vw, 48px)", color: "var(--text-primary)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                3 adımda güvenli alışveriş
              </h2>
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  className={`fade-up delay-${i + 1} ${stepsVisible ? "visible" : ""}`}
                  style={{
                    flex: 1, minWidth: 260, borderRadius: 22, padding: "36px 30px",
                    position: "relative", overflow: "hidden",
                    background: i === 1 ? "linear-gradient(145deg, var(--accent), var(--accent-hover))" : "var(--bg-card)",
                    border: `1px solid ${i === 1 ? "var(--accent-hover)33" : "var(--border)"}`,
                    boxShadow: i === 1 ? "0 20px 60px var(--accent-glow)" : "none"
                  }}
                >
                  {i === 1 && <div style={{ position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />}
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 52, lineHeight: 1, marginBottom: 20, color: i === 1 ? "rgba(255,255,255,0.3)" : "var(--border)" }}>
                    {step.num}
                  </div>
                  <div style={{ fontSize: 30, marginBottom: 14 }}>{step.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 500, marginBottom: 10, color: i === 1 ? "#fff" : "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: i === 1 ? "rgba(255,255,255,0.75)" : "var(--text-secondary)" }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MODÜLLER ── */}
        <section style={{ background: "var(--bg-primary)", padding: "96px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }} ref={featuresRef}>
              <div className="section-tag">özellikler</div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 4.5vw, 48px)", color: "var(--text-primary)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                5 modül, tam koruma
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 15, marginTop: 14, maxWidth: 380, margin: "14px auto 0", lineHeight: 1.7, fontWeight: 300 }}>
                Her modül paralel çalışır, birlikte kapsamlı bir güven skoru üretir.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16 }}>
              {features.map((f, i) => (
                <div key={f.title} className={`feature-card fade-up delay-${(i % 3) + 1} ${featuresVisible ? "visible" : ""}`}>
                  <div style={{
                    width: 46, height: 46, background: f.accent + "18",
                    border: `1.5px solid ${f.accent}30`, borderRadius: 13,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, marginBottom: 18
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 500, marginBottom: 8, letterSpacing: "-0.01em" }}>{f.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              ))}
              <div style={{
                background: "linear-gradient(140deg, var(--accent) 0%, #fb923c 100%)",
                borderRadius: 20, padding: "28px 26px",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                minHeight: 200, position: "relative", overflow: "hidden"
              }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                <div>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, marginBottom: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>hemen dene</p>
                  <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 400, lineHeight: 1.35, marginBottom: 24, fontFamily: "'Instrument Serif', serif" }}>
                    İlk analizini<br />şimdi yap →
                  </h3>
                </div>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  style={{ background: "#fff", color: "var(--accent)", border: "none", borderRadius: 12, padding: "11px 20px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", alignSelf: "flex-start", transition: "transform 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  Analiz Et ↗
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── SSS ── */}
        <section style={{ background: "var(--bg-secondary)", padding: "96px 24px" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }} ref={faqRef}>
              <div className="section-tag">sss</div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 4.5vw, 48px)", color: "var(--text-primary)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                Sık sorulan sorular
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }} className={`fade-up ${faqVisible ? "visible" : ""}`}>
              {faqs.map((item) => (
                <FAQItem key={item.q} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* ── BÜYÜK CTA ── */}
        <section style={{ background: "var(--bg-primary)", padding: "0 24px 96px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{
              background: "linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 50%, #0f1a1a 100%)",
              borderRadius: 28, padding: "72px 48px",
              textAlign: "center", position: "relative", overflow: "hidden",
              border: "1px solid var(--accent-border)"
            }}>
              <div style={{ position: "absolute", top: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)" }} />
              <div style={{ position: "absolute", bottom: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)" }} />

              <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                <div style={{ animation: "spin-slow 12s linear infinite", filter: "drop-shadow(0 0 20px rgba(168,85,247,0.4))" }}>
                  <TrustLensLogo size={56} />
                </div>
              </div>

              <p style={{ color: "#475569", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>
                hemen başla
              </p>

              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.02em" }}>
                <span style={{ color: "#fff" }}>Bir sonraki alışverişini</span>
                <br />
                <span className="cta-shimmer">güvenle yap.</span>
              </h2>

              <p style={{ color: "#64748b", fontSize: 15, maxWidth: 400, margin: "0 auto 40px", lineHeight: 1.7, fontWeight: 300 }}>
                URL yapıştır, 3 saniyede öğren. Kayıt yok, ücret yok.
              </p>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  style={{ background: "linear-gradient(135deg, var(--accent), #fb7185)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 36px", fontSize: 15, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", boxShadow: "0 8px 32px var(--accent-glow)", transition: "transform 0.2s, box-shadow 0.2s", letterSpacing: "0.01em" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px var(--accent-glow)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px var(--accent-glow)" }}
                >
                  Ücretsiz Analiz Et ↗
                </button>
                <button style={{ background: "transparent", color: "#64748b", border: "1px solid #2d2d4e", borderRadius: 14, padding: "15px 28px", fontSize: 15, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "color 0.2s, border-color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "#3d3d5e" }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#2d2d4e" }}
                >
                  Nasıl çalışır?
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 48, flexWrap: "wrap" }}>
                {[{ val: "5", label: "modül" }, { val: "3sn", label: "analiz süresi" }, { val: "%0", label: "veri saklama" }].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: "#fff", lineHeight: 1 }}>{s.val}</p>
                    <p style={{ color: "#475569", fontSize: 11, marginTop: 4, letterSpacing: "0.05em" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: "var(--bg-secondary)", padding: "64px 24px 36px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 56 }}>
              <div style={{ maxWidth: 300 }}>
                <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontWeight: 400, marginBottom: 14, color: "var(--text-primary)" }}>
                  TrustLens <span style={{ background: "linear-gradient(135deg, var(--accent), #fb7185)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>AI</span>
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.8, fontWeight: 300 }}>
                  Yapay zeka destekli ürün güven analizi. Sahte yorumları, uydurma indirimleri ve manipülasyon tekniklerini tespit et.
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  {["𝕏", "ig", "in"].map(s => (
                    <a key={s} href="#" style={{ width: 34, height: 34, borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 12, textDecoration: "none", transition: "color 0.2s, border-color 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "var(--accent)44" }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)" }}
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
                <div>
                  <p className="footer-col-title">Ürün</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {["Nasıl çalışır", "Özellikler", "SSS"].map(l => (
                      <a key={l} href="#" className="footer-link">{l}</a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="footer-col-title">İletişim</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <a href="mailto:hello@trustlens.ai" className="footer-link">hello@trustlens.ai</a>
                    <a href="#" className="footer-link">Instagram</a>
                    <a href="#" className="footer-link">Twitter / X</a>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ height: 1, background: "var(--border)", marginBottom: 28 }} />
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
                © 2025 TrustLens AI · Tüm hakları saklıdır.
              </p>
              <div style={{ display: "flex", gap: 24 }}>
                <a href="#" className="footer-link">Gizlilik Politikası</a>
                <a href="#" className="footer-link">Kullanım Koşulları</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home