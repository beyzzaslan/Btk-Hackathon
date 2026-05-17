// frontend/src/pages/ResultPage.jsx
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import Navbar from "../components/Navbar"
import { analyzeUrl, saveToHistory } from "../api/analyze"

// Zehra'nın Harika Modal Bileşenleri
import PriceHistoryModal from "../components/PriceHistoryModal"
import ManipulationModal from "../components/ManipulationModal"
import DomainModal from "../components/DomainModal"
import ContentModal from "../components/ContentModal"
import ReviewModal from "../components/ReviewModal"

// Kurumsal Renk Altyapısı
const PURPLE = "#a855f7"
const PINK = "#ec4899"
const CYAN = "#06b6d4"

const scoreColor = (score) => {
  if (score >= 75) return "#22c55e"
  if (score >= 50) return "#eab308"
  if (score >= 25) return "#f97316"
  return "#ef4444"
}

const badgeStyles = {
  warn: { background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" },
  danger: { background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" },
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
        transform: visible ? hovered && isClickable ? "translateX(6px)" : "translateX(0)" : "translateY(18px)",
        opacity: visible ? 1 : 0,
        transitionDelay: visible ? `${index * 0.07}s` : "0s",
        boxShadow: hovered && isClickable ? `0 0 0 3px ${ac.glow}, 0 8px 32px ${ac.glow}` : isLight ? `0 2px 8px ${ac.color}15` : `0 2px 12px ${ac.color}10`,
        position: "relative", overflow: "hidden"
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${ac.color}, ${ac.color}66)`, borderRadius: "16px 0 0 16px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${ac.color}15`, border: `1px solid ${ac.color}35`, display: "flex", alignItems: "center", justifyContent: "center", color: ac.color, flexShrink: 0 }}>
          {moduleIcons[m.title] || <span style={{ fontSize: 14 }}>{m.icon}</span>}
        </div>
        <span style={{ color: isLight ? "#111827" : "#fff", fontSize: 13, fontWeight: 500, flex: 1 }}>{m.title}</span>
        {detayGorunecekler.includes(m.title) && (
          <span style={{ color: hovered ? ac.color : "#64748b", fontSize: 10, marginRight: 4, transition: "color 0.3s" }}>Detay gör →</span>
        )}
        <span style={{ ...badgeStyles[m.badgeType], fontSize: 10, padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>
          {m.badge}
        </span>
      </div>
      <p style={{ color: isLight ? "#374151" : "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.65, marginLeft: 46 }}>
        {m.text}
      </p>
      {m.pills && m.pills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10, marginLeft: 46 }}>
          {m.pills.map((pill) => (
            <span key={pill} style={{ fontSize: 10, background: isLight ? `${ac.color}10` : "rgba(255,255,255,0.05)", color: isLight ? ac.color : "rgba(255,255,255,0.5)", border: `1px solid ${isLight ? ac.color + "40" : "rgba(255,255,255,0.12)"}`, padding: "3px 10px", borderRadius: 20 }}>
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

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [loadingStep, setLoadingStep] = useState(0)

  // Modalların Ortak State Yönetimi
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
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.getAttribute("data-theme") === "light")
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!url) { navigate("/"); return }
    const interval = setInterval(() => setLoadingStep(s => (s + 1) % loadingSteps.length), 700)
    
    analyzeUrl(url)
      .then(data => { 
        clearInterval(interval); 
        setResult(data); 
        setLoading(false); 
        saveToHistory(url, data) 
      })
      .catch(err => { 
        clearInterval(interval); 
        setError(err.message); 
        setLoading(false) 
      })
    return () => clearInterval(interval)
  }, [url])

  // 🚨 HACKATHON KURTARAN AKILLI MODAL TETİKLEYİCİSİ
  function handleModuleClick(m) {
    if (m.title === "Sahte indirim") {
      setPriceData({
        product_url: url,
        current_price: m.current_price || "299₺",
        currency: "TRY",
        price_history: m.price_history || [{"date": "Oca", "price": 4999}, {"date": "Şub", "price": 299}],
        claimed_original: m.claimed_price || "4.999₺",
        lowest_ever: m.lowest_price || "299₺",
        highest_ever: m.claimed_price || "4.999₺",
        is_fake_discount: m.badgeType === "danger" || m.badgeType === "warn",
        fake_reason: m.fake_reason || m.text
      })
      setShowPriceModal(true)
    }
    if (m.title === "Manipülasyon teknikleri") { 
      setManipulationPills(m.pills || []); 
      setShowManipulationModal(true) 
    }
    if (m.title === "Alan adı bilgisi") { 
      setDomainModule(m); 
      setShowDomainModal(true) 
    }
    if (m.title === "İçerik tutarlılığı") { 
      setContentModule(m); 
      setShowContentModal(true) 
    }
    if (m.title === "Yorum analizi") { 
      setReviewModule(m); 
      setShowReviewModal(true) 
    }
  }

  const darkBg = isLight
    ? "linear-gradient(160deg, #F3F8FC 0%, #E6F0F8 50%, #ddeaf5 100%)"
    : "linear-gradient(160deg, #0d0d18 0%, #120d1e 40%, #0d1a1f 100%)"

  if (loading) {
    return (
      <div style={{ background: darkBg, minHeight: "100vh" }}>
        <Navbar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "70vh", gap: 24 }}>
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <div style={{ position: "absolute", inset: 0, border: `2px solid rgba(168,85,247,0.2)`, borderTop: `2px solid ${PURPLE}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <div style={{ position: "absolute", inset: 8, border: `1.5px solid rgba(6,182,212,0.2)`, borderBottom: `1.5px solid ${CYAN}`, borderRadius: "50%", animation: "spin 1.5s linear infinite reverse" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p key={loadingStep} style={{ color: isLight ? "#1a1a2e" : "#fff", fontSize: 15, fontWeight: 500, marginBottom: 6 }}>
              {loadingSteps[loadingStep]}
            </p>
            <p style={{ color: isLight ? "#94a3b8" : "rgba(255,255,255,0.3)", fontSize: 11, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</p>
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
          <p style={{ color: isLight ? "#111827" : "#fff", fontSize: 16, fontWeight: 500 }}>Analiz başarısız</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{error}</p>
          <button onClick={() => navigate("/")} style={{ marginTop: 4, background: PURPLE, color: "#fff", border: "none", padding: "11px 28px", borderRadius: 12, cursor: "pointer", fontSize: 13 }}>Tekrar dene</button>
        </div>
      </div>
    )
  }

  if (!result) return null

  const color = scoreColor(result.score)

  return (
    <div style={{ background: darkBg, minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .result-root * { box-sizing:border-box; }
        .result-root { font-family:'DM Sans',sans-serif; }
        .btn-ghost { flex:1; background:${isLight ? "#f4f4f5" : "rgba(255,255,255,0.04)"}; border:1px solid ${isLight ? "#e4e4e7" : "rgba(255,255,255,0.1)"}; color:${isLight ? "#64748b" : "rgba(255,255,255,0.5)"}; font-size:13px; padding:12px; border-radius:12px; cursor:pointer; transition:all 0.2s; }
        .btn-accent { flex:1; color:#fff; border:none; font-size:13px; font-weight:500; padding:12px; border-radius:12px; cursor:pointer; transition:all 0.2s; background: linear-gradient(135deg, ${PURPLE}, ${PINK}); }
        .btn-accent:hover { box-shadow: 0 8px 24px rgba(168,85,247,0.35); }
      `}</style>

      <div className="result-root">
        <Navbar />

        {/* 🚨 YEDEKLİ VE GÜVENLİ JALUZİ MODAL BAĞLANTILARI */}
        {showPriceModal && <PriceHistoryModal data={priceData} onClose={() => setShowPriceModal(false)} />}
        {showManipulationModal && <ManipulationModal pills={manipulationPills} onClose={() => setShowManipulationModal(false)} />}
        {showDomainModal && <DomainModal module={domainModule} data={domainModule} onClose={() => setShowDomainModal(false)} />}
        {showContentModal && <ContentModal module={contentModule} data={contentModule} result={result} onClose={() => setShowContentModal(false)} />}
        {showReviewModal && <ReviewModal module={reviewModule} data={reviewModule} result={result} onClose={() => setShowReviewModal(false)} />}

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px 72px", position: "relative", zIndex: 1 }}>

          {/* URL bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: isLight ? "#fff" : "rgba(255,255,255,0.04)", border: `1px solid ${isLight ? `${PINK}30` : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: "10px 16px", flex: 1, minWidth: 0 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: isLight ? "#111827" : "#fff", fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1 }}>
                  {(() => { try { return new URL(url).hostname } catch { return url } })()}
                </p>
                <p style={{ color: isLight ? "#9ca3af" : "rgba(255,255,255,0.25)", fontSize: 10, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</p>
              </div>
            </div>
            <button onClick={() => navigate("/")} style={{ background: `linear-gradient(135deg, ${PURPLE}20, ${PINK}20)`, border: `1px solid ${PURPLE}35`, color: isLight ? PURPLE : "#c4b5fd", fontSize: 12, padding: "10px 16px", borderRadius: 12, cursor: "pointer" }}>↩ Yeniden analiz</button>
          </div>

          {/* SKOR DAİRESİ */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div style={{ width: 160, height: 160, borderRadius: "50%", border: `3px solid ${isLight ? color + "40" : "rgba(255,255,255,0.06)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: isLight ? "#fff" : `radial-gradient(circle, ${color}10 0%, transparent 70%)` }}>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 68, color: isLight ? "#1a1a2e" : "#fff", lineHeight: 1 }}>{result.score}</span>
                <span style={{ fontSize: 10, color: isLight ? "#64748b" : "rgba(255,255,255,0.3)" }}>/ 100</span>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${color}18`, border: `1px solid ${color}35`, borderRadius: 99, padding: "6px 16px", marginBottom: 10 }}>
                <span style={{ fontSize: 12, color, fontWeight: 600 }}>{result.label ? result.label.toUpperCase() : "ANALİZ"}</span>
              </div>
              <p style={{ color: isLight ? "#374151" : "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.65, maxWidth: 400, margin: "0 auto" }}>{result.summary}</p>
            </div>
          </div>

          {/* İLERLEME BARLARI */}
          <div style={{ background: isLight ? "#fff" : "rgba(255,255,255,0.03)", border: `1px solid ${isLight ? "#e4e4e7" : "rgba(255,255,255,0.07)"}`, borderRadius: 18, padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 32px" }}>
              {result.bars && result.bars.map((bar) => {
                const currentBarColor = scoreColor(bar.value);
                return (
                  <div key={bar.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span style={{ fontSize: 11, color: isLight ? "#374151" : "rgba(255,255,255,0.35)" }}>{bar.label}</span>
                      <span style={{ fontSize: 12, color: currentBarColor, fontWeight: 600 }}>{bar.value}%</span>
                    </div>
                    <div style={{ height: 6, background: isLight ? "#e4e4e7" : "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: 6, width: `${bar.value}%`, background: currentBarColor, borderRadius: 99, transition: "width 1.2s" }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* MODÜL KARTLARI LİSTESİ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {result.modules && result.modules.map((m, i) => (
              <ModuleCard key={m.title} m={m} index={i} isLight={isLight} isClickable={clickableModules.includes(m.title)} onClick={() => handleModuleClick(m)} />
            ))}
          </div>

          {/* ALTMENÜ BUTONLARI */}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-ghost">Yanlış analiz mi? Bildir</button>
            <button className="btn-accent" onClick={() => navigate("/")}>Yeni analiz yap →</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ResultPage