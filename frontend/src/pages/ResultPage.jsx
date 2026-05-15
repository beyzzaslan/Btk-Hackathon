import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import Navbar from "../components/Navbar"
import { analyzeUrl, saveToHistory } from "../api/analyze"
import PriceHistoryModal from "../components/PriceHistoryModal"
import ManipulationModal from "../components/ManipulationModal"
import DomainModal from "../components/DomainModal"
import ContentModal from "../components/ContentModal"
import ReviewModal from "../components/ReviewModal"

// Logo renkleri
const PURPLE = "#a855f7"
const PINK = "#ec4899"
const CYAN = "#06b6d4"

const scoreColor = (score) => {
  if (score >= 75) return "#22c55e"
  if (score >= 50) return "#eab308"
  if (score >= 25) return "#f97316"
  return "#ef4444"
}

const scoreLabel = (score) => {
  if (score >= 75) return "Güvenilir"
  if (score >= 50) return "Dikkatli Ol"
  if (score >= 25) return "Yüksek Risk"
  return "Dolandırıcılık"
}

const badgeStyles = {
  warn: { background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" },
  danger: { background: "rgba(192,132,252,0.12)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.25)" },
  ok: { background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }
}

const clickableModules = ["Sahte indirim", "Manipülasyon teknikleri", "Alan adı bilgisi", "İçerik tutarlılığı", "Yorum analizi"]
const detayGorunecekler = ["Manipülasyon teknikleri", "Alan adı bilgisi", "İçerik tutarlılığı", "Yorum analizi"]

const moduleIcons = {
  "Yorum analizi": <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H9l-3 2v-2H3a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.3"/><line x1="4.5" y1="5.5" x2="11.5" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="4.5" y1="8" x2="8.5" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  "Sahte indirim": <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 11l3-5 2 3 2-2 3 4H2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><line x1="11" y1="3" x2="11" y2="7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><line x1="9" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  "Manipülasyon teknikleri": <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="10.5" r="0.8" fill="currentColor"/></svg>,
  "Alan adı bilgisi": <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><ellipse cx="8" cy="8" rx="2.5" ry="6" stroke="currentColor" strokeWidth="1.1"/><line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.1"/></svg>,
  "İçerik tutarlılığı": <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 7h7M3 10h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="12.5" cy="11.5" r="2" stroke="currentColor" strokeWidth="1.2"/></svg>,
}

function useInView() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.05 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function ModuleCard({ m, index, onClick, isClickable, isLight }) {
  const [ref, visible] = useInView()
  const [hovered, setHovered] = useState(false)

  const accentColors = {
    "Yorum analizi": { color: PURPLE, glow: "rgba(168,85,247,0.2)", border: "rgba(168,85,247,0.35)" },
    "Sahte indirim": { color: PINK, glow: "rgba(236,72,153,0.2)", border: "rgba(236,72,153,0.35)" },
    "Manipülasyon teknikleri": { color: "#f97316", glow: "rgba(249,115,22,0.2)", border: "rgba(249,115,22,0.35)" },
    "Alan adı bilgisi": { color: CYAN, glow: "rgba(6,182,212,0.2)", border: "rgba(6,182,212,0.35)" },
    "İçerik tutarlılığı": { color: "#22c55e", glow: "rgba(34,197,94,0.2)", border: "rgba(34,197,94,0.35)" },
  }
  const ac = accentColors[m.title] || { color: PURPLE, glow: "rgba(168,85,247,0.2)", border: "rgba(168,85,247,0.35)" }

  const titleColor = isLight ? "#111827" : "#fff"
  const textColor = isLight ? "#374151" : "rgba(255,255,255,0.5)"
  const pillColor = isLight ? ac.color : "rgba(255,255,255,0.5)"
  const pillBorder = isLight ? `${ac.color}40` : "rgba(255,255,255,0.12)"
  const pillBg = isLight ? `${ac.color}10` : "rgba(255,255,255,0.05)"
  const hintColor = isLight ? "#9ca3af" : "rgba(255,255,255,0.35)"

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isLight ? "#fff" : "rgba(255,255,255,0.03)",
        border: `1px solid ${ac.border}`,
        borderRadius: 16, padding: "18px 20px",
        cursor: isClickable ? "pointer" : "default",
        transition: "all 0.3s cubic-bezier(0.34,1.2,0.64,1)",
        transform: visible
          ? hovered && isClickable ? "translateX(6px)" : "translateX(0)"
          : "translateY(18px)",
        opacity: visible ? 1 : 0,
        transitionDelay: visible ? `${index * 0.07}s` : "0s",
        boxShadow: hovered && isClickable
          ? `0 0 0 3px ${ac.glow}, 0 8px 32px ${ac.glow}, 0 2px 8px rgba(0,0,0,0.06)`
          : isLight
            ? `0 2px 8px ${ac.color}15, inset 0 0 0 0 transparent`
            : `0 2px 12px ${ac.color}10`,
        position: "relative", overflow: "hidden"
      }}
    >
      {/* Sol renkli çizgi — her zaman görünür */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: `linear-gradient(to bottom, ${ac.color}, ${ac.color}66)`,
        borderRadius: "16px 0 0 16px"
      }} />

      {/* Sağ üst dekor daire — her zaman */}
      <div style={{
        position: "absolute", top: -24, right: -24, width: 80, height: 80,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${ac.color}18 0%, transparent 70%)`,
        transition: "opacity 0.3s",
        opacity: hovered ? 1 : 0.5,
        pointerEvents: "none"
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        {/* İkon */}
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: `${ac.color}15`,
          border: `1px solid ${ac.color}35`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: ac.color, flexShrink: 0,
          transition: "transform 0.3s",
          transform: hovered ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)"
        }}>
          {moduleIcons[m.title] || <span style={{ fontSize: 14 }}>{m.icon}</span>}
        </div>

        <span style={{ color: titleColor, fontSize: 13, fontWeight: 500, flex: 1 }}>{m.title}</span>

        {m.title === "Sahte indirim" && (
          <span style={{ color: hovered ? ac.color : hintColor, fontSize: 10, marginRight: 4, transition: "color 0.3s" }}>Geçmişi gör →</span>
        )}
        {detayGorunecekler.includes(m.title) && (
          <span style={{ color: hovered ? ac.color : hintColor, fontSize: 10, marginRight: 4, transition: "color 0.3s" }}>Detay gör →</span>
        )}

        <span style={{ ...badgeStyles[m.badgeType], fontSize: 10, padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>
          {m.badge}
        </span>
      </div>

      <p style={{ color: textColor, fontSize: 12, lineHeight: 1.65, marginLeft: 46 }}>
        {m.text}
      </p>

      {m.pills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10, marginLeft: 46 }}>
          {m.pills.map((pill) => (
            <span key={pill} style={{
              fontSize: 10,
              background: pillBg,
              color: pillColor,
              border: `1px solid ${pillBorder}`,
              padding: "3px 10px", borderRadius: 20,
              transition: "all 0.2s"
            }}>
              {pill}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const url = location.state?.url || ""
  const [isLight, setIsLight] = useState(localStorage.getItem("theme") === "light")

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.getAttribute("data-theme") === "light")
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
    return () => observer.disconnect()
  }, [])

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [loadingStep, setLoadingStep] = useState(0)

  const [priceData, setPriceData] = useState(null)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [showManipulationModal, setShowManipulationModal] = useState(false)
  const [manipulationPills, setManipulationPills] = useState([])
  const [showDomainModal, setShowDomainModal] = useState(false)
  const [domainModule, setDomainModule] = useState(null)
  const [showContentModal, setShowContentModal] = useState(false)
  const [contentModule, setContentModule] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewModule, setReviewModule] = useState(null)

  const loadingSteps = ["Sayfa taranıyor...", "Yorumlar analiz ediliyor...", "Fiyat geçmişi kontrol ediliyor...", "Güven skoru hesaplanıyor..."]

  useEffect(() => {
    if (!url) { navigate("/"); return }
    const interval = setInterval(() => setLoadingStep(s => (s + 1) % loadingSteps.length), 700)
    analyzeUrl(url)
      .then(data => { clearInterval(interval); setResult(data); setLoading(false); saveToHistory(url, data) })
      .catch(err => { clearInterval(interval); setError(err.message); setLoading(false) })
    return () => clearInterval(interval)
  }, [url])

  function handleModuleClick(m) {
    if (m.title === "Sahte indirim") {
      fetch(`/api/price-history?url=${encodeURIComponent(url)}`)
        .then(r => r.json()).then(data => { setPriceData(data); setShowPriceModal(true) })
        .catch(() => {
          setPriceData({
            product_url: url, current_price: 299, currency: "TRY",
            price_history: [
              { date: "2024-11-01", price: 4999 }, { date: "2024-12-01", price: 299 },
              { date: "2025-01-01", price: 320 }, { date: "2025-02-01", price: 299 },
              { date: "2025-03-01", price: 299 }, { date: "2025-04-01", price: 299 }
            ],
            claimed_original: 4999, lowest_ever: 299, highest_ever: 4999,
            is_fake_discount: true,
            fake_reason: "Referans fiyat manipülasyonu tespit edildi. Ürün hiçbir zaman 4.999₺'ye satılmadı."
          })
          setShowPriceModal(true)
        })
    }
    if (m.title === "Manipülasyon teknikleri") { setManipulationPills(m.pills); setShowManipulationModal(true) }
    if (m.title === "Alan adı bilgisi") { setDomainModule(m); setShowDomainModal(true) }
    if (m.title === "İçerik tutarlılığı") { setContentModule(m); setShowContentModal(true) }
    if (m.title === "Yorum analizi") { setReviewModule(m); setShowReviewModal(true) }
  }

  const darkBg = isLight
    ? "linear-gradient(160deg, #F3F8FC 0%, #E6F0F8 50%, #ddeaf5 100%)"
    : "linear-gradient(160deg, #0d0d18 0%, #120d1e 40%, #0d1a1f 100%)"

  if (loading) {
    return (
      <div style={{ background: darkBg, minHeight: "100vh" }}>
        <Navbar />
        <style>{`
          @keyframes spin { to { transform: rotate(360deg) } }
          @keyframes stepFade { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
          @keyframes logoPulse { 0%,100%{opacity:0.6}50%{opacity:1} }
        `}</style>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "70vh", gap: 24 }}>
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <div style={{ position: "absolute", inset: 0, border: `2px solid rgba(168,85,247,0.2)`, borderTop: `2px solid ${PURPLE}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <div style={{ position: "absolute", inset: 8, border: `1.5px solid rgba(6,182,212,0.2)`, borderBottom: `1.5px solid ${CYAN}`, borderRadius: "50%", animation: "spin 1.5s linear infinite reverse" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="32" height="32" viewBox="0 0 64 64" fill="none" style={{ animation: "logoPulse 2s ease-in-out infinite" }}>
                <defs>
                  <linearGradient id="loadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={PURPLE}/>
                    <stop offset="50%" stopColor={PINK}/>
                    <stop offset="100%" stopColor={CYAN}/>
                  </linearGradient>
                </defs>
                {[0,60,120,180,240,300].map((a, i) => {
                  const r = a * Math.PI / 180
                  return <circle key={i} cx={32 + Math.cos(r)*18} cy={32 + Math.sin(r)*18} r={9} stroke="url(#loadGrad)" strokeWidth="1.2" fill="none" opacity="0.7"/>
                })}
                <circle cx="32" cy="32" r="7" stroke="url(#loadGrad)" strokeWidth="1.4" fill="none"/>
                <circle cx="32" cy="32" r="2.5" fill="url(#loadGrad)"/>
              </svg>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <p key={loadingStep} style={{ color: isLight ? "#1a1a2e" : "#fff", fontSize: 15, fontWeight: 500, animation: "stepFade 0.4s ease", marginBottom: 6 }}>
              {loadingSteps[loadingStep]}
            </p>
            <p style={{ color: isLight ? "#94a3b8" : "rgba(255,255,255,0.3)", fontSize: 11, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</p>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {loadingSteps.map((_, i) => (
              <div key={i} style={{
                width: i === loadingStep ? 20 : 6, height: 6, borderRadius: 3,
                background: i === loadingStep ? PURPLE : "rgba(255,255,255,0.15)",
                transition: "all 0.3s"
              }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ background: darkBg, minHeight: "100vh" }}>
        <Navbar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>⚠️</div>
          <p style={{ color: "#fff", fontSize: 16, fontWeight: 500 }}>Analiz başarısız</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{error}</p>
          <button onClick={() => navigate("/")} style={{ marginTop: 4, background: PURPLE, color: "#fff", border: "none", padding: "11px 28px", borderRadius: 12, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            Tekrar dene
          </button>
        </div>
      </div>
    )
  }

  if (!result) return null

  const color = scoreColor(result.score)
  const label = scoreLabel(result.score)

  return (
    <div style={{ background: darkBg, minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
        @keyframes scoreIn { from{opacity:0;transform:scale(0.6)}to{opacity:1;transform:scale(1)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes glow { 0%,100%{opacity:0.4}50%{opacity:0.8} }
        .result-root * { box-sizing:border-box; }
        .result-root { font-family:'DM Sans',sans-serif; }
        .btn-ghost {
          flex:1; background:${isLight ? "#f4f4f5" : "rgba(255,255,255,0.04)"};
          border:1px solid ${isLight ? "#e4e4e7" : "rgba(255,255,255,0.1)"};
          color:${isLight ? "#64748b" : "rgba(255,255,255,0.5)"}; font-size:13px; padding:12px;
          border-radius:12px; cursor:pointer; font-family:'DM Sans',sans-serif;
          transition:all 0.2s;
        }
        .btn-ghost:hover { border-color:${isLight ? "#a855f7" : "rgba(255,255,255,0.2)"}; color:${isLight ? "#a855f7" : "rgba(255,255,255,0.8)"}; }
        .btn-accent {
          flex:1; color:#fff; border:none; font-size:13px; font-weight:500;
          padding:12px; border-radius:12px; cursor:pointer;
          font-family:'DM Sans',sans-serif; transition:all 0.2s;
          background: linear-gradient(135deg, ${PURPLE}, ${PINK});
        }
        .btn-accent:hover { opacity:0.88; transform:translateY(-1px); box-shadow: 0 8px 24px rgba(168,85,247,0.35); }
      `}</style>

      {/* Arka plan glow'ları */}
      <div style={{ position: "fixed", top: -100, left: -100, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${PURPLE}18 0%, transparent 65%)`, pointerEvents: "none", animation: "glow 6s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}12 0%, transparent 65%)`, pointerEvents: "none", animation: "glow 8s ease-in-out infinite 2s" }} />
      <div style={{ position: "fixed", top: "50%", left: "60%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${PINK}0a 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div className="result-root">
        <Navbar />

        {showPriceModal && <PriceHistoryModal data={priceData} onClose={() => setShowPriceModal(false)} />}
        {showManipulationModal && <ManipulationModal pills={manipulationPills} onClose={() => setShowManipulationModal(false)} />}
        {showDomainModal && <DomainModal module={domainModule} onClose={() => setShowDomainModal(false)} />}
        {showContentModal && <ContentModal module={contentModule} onClose={() => setShowContentModal(false)} />}
        {showReviewModal && <ReviewModal module={reviewModule} onClose={() => setShowReviewModal(false)} />}

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px 72px", position: "relative", zIndex: 1 }}>

          {/* URL bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 32, animation: "fadeUp 0.4s ease" }}>
            {/* Domain kutusu */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: isLight ? "#fff" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isLight ? `${PINK}30` : "rgba(255,255,255,0.1)"}`,
              borderRadius: 12, padding: "10px 16px",
              boxShadow: isLight ? `0 2px 12px ${PURPLE}10` : "none",
              flex: 1, minWidth: 0
            }}>
              {/* Favicon */}
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0, overflow: "hidden",
                background: isLight ? "#f3f4f6" : "rgba(255,255,255,0.08)",
                border: `1px solid ${isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <img
                  src={`https://www.google.com/s2/favicons?domain=${(() => { try { return new URL(url).hostname } catch { return "" } })()}&sz=32`}
                  alt="" width={18} height={18}
                  onError={e => {
                    e.target.style.display = "none"
                    e.target.parentElement.innerHTML = `<svg width="14" height="14" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="${isLight ? '#94a3b8' : 'rgba(255,255,255,0.3)'}" stroke-width="1.2"/><ellipse cx="6" cy="6" rx="1.8" ry="4.5" stroke="${isLight ? '#94a3b8' : 'rgba(255,255,255,0.3)'}" stroke-width="1"/><line x1="1.5" y1="6" x2="10.5" y2="6" stroke="${isLight ? '#94a3b8' : 'rgba(255,255,255,0.3)'}" stroke-width="1"/></svg>`
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Domain adı */}
                <p style={{
                  color: isLight ? "#111827" : "#fff",
                  fontSize: 13, fontWeight: 500,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  lineHeight: 1
                }}>
                  {(() => { try { return new URL(url).hostname } catch { return url } })()}
                </p>
                {/* Tam URL küçük */}
                <p style={{
                  color: isLight ? "#9ca3af" : "rgba(255,255,255,0.25)",
                  fontSize: 10, marginTop: 3,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>
                  {url}
                </p>
              </div>

            
            </div>

            {/* Yeniden analiz butonu */}
            <button
              onClick={() => navigate("/")}
              style={{
                background: `linear-gradient(135deg, ${PURPLE}20, ${PINK}20)`,
                border: `1px solid ${PURPLE}35`,
                color: isLight ? PURPLE : "#c4b5fd",
                fontSize: 12, fontWeight: 500,
                padding: "10px 16px", borderRadius: 12,
                cursor: "pointer", whiteSpace: "nowrap",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s", flexShrink: 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${PURPLE}35, ${PINK}35)`
                e.currentTarget.style.transform = "translateY(-1px)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${PURPLE}20, ${PINK}20)`
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              ↩ Yeniden analiz
            </button>
          </div>

          {/* BÜYÜK SKOR ALANI */}
          <div style={{ textAlign: "center", marginBottom: 40, animation: "scoreIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div style={{
                position: "absolute", inset: -20, borderRadius: "50%",
                background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                animation: "glow 3s ease-in-out infinite"
              }} />
              <div style={{
                width: 160, height: 160, borderRadius: "50%",
                border: `3px solid ${isLight ? color + "40" : "rgba(255,255,255,0.06)"}`,
                boxShadow: isLight
                  ? `0 0 0 6px ${color}12, 0 8px 40px ${color}30`
                  : `0 0 0 1px ${color}30, 0 0 60px ${color}20`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: isLight ? "#fff" : `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
                position: "relative"
              }}>
                <span style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 68, fontWeight: 400,
                  color: isLight ? "#1a1a2e" : "#fff",
                  lineHeight: 1, letterSpacing: "-0.04em"
                }}>
                  {result.score}
                </span>
                <span style={{ fontSize: 10, color: isLight ? "#64748b" : "rgba(255,255,255,0.3)", marginTop: 2, letterSpacing: "0.1em" }}>/ 100</span>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: `${color}18`, border: `1px solid ${color}35`,
                borderRadius: 99, padding: "6px 16px", marginBottom: 10
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
                <span style={{ fontSize: 12, color, fontWeight: 600, letterSpacing: "0.06em" }}>
                  {label.toUpperCase()}
                </span>
              </div>
              <p style={{ color: isLight ? "#374151" : "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.65, maxWidth: 400, margin: "0 auto" }}>
                {result.summary}
              </p>
            </div>
          </div>

          {/* Progress barlar */}
          <div style={{
            background: isLight ? "#fff" : "rgba(255,255,255,0.03)",
            border: `1px solid ${isLight ? "#e4e4e7" : "rgba(255,255,255,0.07)"}`,
            borderRadius: 18, padding: "20px 24px", marginBottom: 16,
            animation: "fadeUp 0.4s ease 0.2s both",
            boxShadow: isLight ? "0 2px 8px rgba(0,0,0,0.04)" : "none"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 32px" }}>
              {result.bars.map((bar, i) => {
                const barColors = [
                  { color: PURPLE, glow: "rgba(168,85,247,0.4)" },
                  { color: PINK,   glow: "rgba(236,72,153,0.4)" },
                  { color: CYAN,   glow: "rgba(6,182,212,0.4)"  },
                  { color: "#818cf8", glow: "rgba(129,140,248,0.4)" },
                ]
                const bc = barColors[i % barColors.length]
                return (
                  <div key={bar.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span style={{ fontSize: 11, color: isLight ? "#374151" : "rgba(255,255,255,0.35)" }}>{bar.label}</span>
                      <span style={{ fontSize: 12, color: bc.color, fontWeight: 600 }}>{bar.value}%</span>
                    </div>
                    <div style={{ height: 6, background: isLight ? "#e4e4e7" : "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{
                        height: 6, width: `${bar.value}%`,
                        background: `linear-gradient(to right, ${bc.color}77, ${bc.color})`,
                        borderRadius: 99, boxShadow: `0 0 8px ${bc.glow}`,
                        transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)"
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Warning */}
          {result.score < 50 && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 12, padding: "12px 16px", marginBottom: 16,
              display: "flex", alignItems: "center", gap: 10,
              animation: "fadeUp 0.4s ease 0.25s both"
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M8 1.5L14.5 13H1.5L8 1.5z" stroke="#ef4444" strokeWidth="1.3" strokeLinejoin="round" fill="rgba(239,68,68,0.1)"/>
                <line x1="8" y1="6" x2="8" y2="9.5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="8" cy="11.2" r="0.7" fill="#ef4444"/>
              </svg>
              <span style={{ fontSize: 12, color: "#fca5a5", lineHeight: 1.55 }}>
                Bu sitede alışveriş yapmadan önce dikkatli olun. Birden fazla şüpheli sinyal tespit edildi.
              </span>
            </div>
          )}

          {/* Modüller */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {result.modules.map((m, i) => (
              <ModuleCard
                key={m.title} m={m} index={i}
                isLight={isLight}
                isClickable={clickableModules.includes(m.title)}
                onClick={() => handleModuleClick(m)}
              />
            ))}
          </div>

          {/* Butonlar */}
          <div style={{ display: "flex", gap: 10, animation: "fadeUp 0.4s ease 0.5s both" }}>
            <button className="btn-ghost">Yanlış analiz mi? Bildir</button>
            <button className="btn-accent" onClick={() => navigate("/")}>Yeni analiz yap →</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ResultPage