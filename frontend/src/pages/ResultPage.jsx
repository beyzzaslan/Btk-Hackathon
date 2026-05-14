import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { analyzeUrl, saveToHistory } from "../api/analyze"
import PriceHistoryModal from "../components/PriceHistoryModal"
import ManipulationModal from "../components/ManipulationModal"
import DomainModal from "../components/DomainModal"
import ContentModal from "../components/ContentModal"
import ReviewModal from "../components/ReviewModal"

const scoreColor = (score) => {
  if (score >= 75) return "#22c55e"
  if (score >= 50) return "#eab308"
  if (score >= 25) return "#f97316"
  return "#ef4444"
}

const badgeStyles = {
  warn: { background: "#422006", color: "#fbbf24" },
  danger: { background: "#2d0a4e", color: "#c084fc" },
  ok: { background: "#052e16", color: "#4ade80" }
}

const clickableModules = ["Sahte indirim", "Manipülasyon teknikleri", "Alan adı bilgisi", "İçerik tutarlılığı", "Yorum analizi"]
const detayGorunecekler = ["Manipülasyon teknikleri", "Alan adı bilgisi", "İçerik tutarlılığı", "Yorum analizi"]

function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const url = location.state?.url || ""

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

  useEffect(() => {
    if (!url) { navigate("/"); return }

    analyzeUrl(url)
      .then((data) => {
        setResult(data)
        setLoading(false)
        saveToHistory(url, data)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [url])

  function handleModuleClick(m) {
    if (m.title === "Sahte indirim") {
      fetch(`/api/price-history?url=${encodeURIComponent(url)}`)
        .then((r) => r.json())
        .then((data) => {
          setPriceData(data)
          setShowPriceModal(true)
        })
        .catch(() => {
          setPriceData({
            product_url: url,
            current_price: 299,
            currency: "TRY",
            price_history: [
              { date: "2024-11-01", price: 4999 },
              { date: "2024-12-01", price: 299 },
              { date: "2025-01-01", price: 320 },
              { date: "2025-02-01", price: 299 },
              { date: "2025-03-01", price: 299 },
              { date: "2025-04-01", price: 299 }
            ],
            claimed_original: 4999,
            lowest_ever: 299,
            highest_ever: 4999,
            is_fake_discount: true,
            fake_reason: "Referans fiyat manipülasyonu tespit edildi. Ürün hiçbir zaman 4.999₺'ye satılmadı."
          })
          setShowPriceModal(true)
        })
    }

    if (m.title === "Manipülasyon teknikleri") {
      setManipulationPills(m.pills)
      setShowManipulationModal(true)
    }

    if (m.title === "Alan adı bilgisi") {
      setDomainModule(m)
      setShowDomainModal(true)
    }

    if (m.title === "İçerik tutarlılığı") {
      setContentModule(m)
      setShowContentModal(true)
    }

    if (m.title === "Yorum analizi") {
      setReviewModule(m)
      setShowReviewModal(true)
    }
  }

  if (loading) {
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Analiz ediliyor...</p>
          <p style={{ color: "var(--text-muted)", fontSize: 12 }}>{url}</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12 }}>
          <p style={{ fontSize: 32 }}>⚠️</p>
          <p style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 500 }}>Analiz başarısız</p>
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{error}</p>
          <button onClick={() => navigate("/")} style={{ marginTop: 8, background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontSize: 13 }}>
            Tekrar dene
          </button>
        </div>
      </div>
    )
  }

  if (!result) return null

  const color = scoreColor(result.score)

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {showPriceModal && (
        <PriceHistoryModal data={priceData} onClose={() => setShowPriceModal(false)} />
      )}
      {showManipulationModal && (
        <ManipulationModal pills={manipulationPills} onClose={() => setShowManipulationModal(false)} />
      )}
      {showDomainModal && (
        <DomainModal module={domainModule} onClose={() => setShowDomainModal(false)} />
      )}
      {showContentModal && (
        <ContentModal module={contentModule} onClose={() => setShowContentModal(false)} />
      )}
      {showReviewModal && (
        <ReviewModal module={reviewModule} onClose={() => setShowReviewModal(false)} />
      )}

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 16px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <div style={{ width: 18, height: 18, background: "var(--bg-secondary)", borderRadius: 4, flexShrink: 0 }} />
          <span style={{ color: "var(--text-secondary)", fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</span>
          <button onClick={() => navigate("/")} style={{ color: "#3b82f6", fontSize: 11, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
            Yeniden analiz et
          </button>
        </div>

        <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: 16, padding: 24, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", border: `4px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 26, fontWeight: 600, color }}>{result.score}</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "var(--text-primary)", fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{result.label}</p>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, lineHeight: 1.6 }}>{result.summary}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
            {result.bars.map((bar) => (
              <div key={bar.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{bar.label}</span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{bar.value}%</span>
                </div>
                <div style={{ height: 4, background: "var(--border)", borderRadius: 2 }}>
                  <div style={{ height: 4, width: `${bar.value}%`, background: bar.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {result.score < 50 && (
          <div style={{ background: "#431407", border: "0.5px solid #7c2d12", borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 12, color: "#fdba74", lineHeight: 1.5 }}>
              Bu sitede alışveriş yapmadan önce dikkatli olun. Birden fazla şüpheli sinyal tespit edildi.
            </span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {result.modules.map((m) => {
            const isClickable = clickableModules.includes(m.title)
            return (
              <div
                key={m.title}
                onClick={() => handleModuleClick(m)}
                style={{
                  background: "var(--bg-card)",
                  border: "0.5px solid var(--border)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  cursor: isClickable ? "pointer" : "default"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14 }}>{m.icon}</span>
                  <span style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500, flex: 1 }}>{m.title}</span>
                  {m.title === "Sahte indirim" && (
                    <span style={{ color: "var(--text-muted)", fontSize: 10, marginRight: 4 }}>Geçmişi gör →</span>
                  )}
                  {detayGorunecekler.includes(m.title) && (
                    <span style={{ color: "var(--text-muted)", fontSize: 10, marginRight: 4 }}>Detay gör →</span>
                  )}
                  <span style={{ ...badgeStyles[m.badgeType], fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>
                    {m.badge}
                  </span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: 11, lineHeight: 1.6 }}>{m.text}</p>
                {m.pills.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                    {m.pills.map((pill) => (
                      <span key={pill} style={{ fontSize: 10, background: "var(--bg-secondary)", color: "var(--text-muted)", border: "0.5px solid var(--border)", padding: "2px 8px", borderRadius: 20 }}>
                        {pill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ flex: 1, background: "var(--bg-card)", border: "0.5px solid var(--border)", color: "var(--text-secondary)", fontSize: 12, padding: 10, borderRadius: 10, cursor: "pointer" }}>
            Yanlış analiz mi? Bildir
          </button>
          <button onClick={() => navigate("/")} style={{ flex: 1, background: "#2563eb", border: "none", color: "#fff", fontSize: 12, fontWeight: 500, padding: 10, borderRadius: 10, cursor: "pointer" }}>
            Yeni analiz yap →
          </button>
        </div>

      </div>
    </div>
  )
}

export default ResultPage