import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { getHistory } from "../api/analyze"

const filters = ["Hepsi", "Güvenli", "Dikkatli Ol", "Yüksek risk", "Dolandırıcılık"]

function scoreLabel(score) {
  if (score >= 75) return "Güvenli"
  if (score >= 50) return "Dikkatli Ol"
  if (score >= 25) return "Yüksek risk"
  return "Dolandırıcılık"
}

function scoreColor(score) {
  if (score >= 75) return "#22c55e"
  if (score >= 50) return "#eab308"
  if (score >= 25) return "#f97316"
  return "#ef4444"
}

function scoreBg(score) {
  if (score >= 75) return "rgba(34,197,94,0.1)"
  if (score >= 50) return "rgba(234,179,8,0.1)"
  if (score >= 25) return "rgba(249,115,22,0.1)"
  return "rgba(239,68,68,0.1)"
}

function useInView(threshold = 0.05) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

// SVG İkonlar
function IconChart() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="12" width="4" height="8" rx="1.5" fill="#60a5fa" opacity="0.9"/>
      <rect x="9" y="7" width="4" height="13" rx="1.5" fill="#60a5fa"/>
      <rect x="16" y="3" width="4" height="17" rx="1.5" fill="#60a5fa" opacity="0.7"/>
    </svg>
  )
}

function IconWarning() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 2L20.5 19H1.5L11 2Z" stroke="#f97316" strokeWidth="1.8" strokeLinejoin="round" fill="rgba(249,115,22,0.12)"/>
      <line x1="11" y1="9" x2="11" y2="13" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="11" cy="16" r="1" fill="#f97316"/>
    </svg>
  )
}

function IconScam() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke="#ef4444" strokeWidth="1.8" fill="rgba(239,68,68,0.08)"/>
      <path d="M7 7L15 15M15 7L7 15" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function StatCard({ stat, delay }) {
  const [ref, visible] = useInView()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, minWidth: 180,
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? stat.borderHover : "var(--border)"}`,
        borderRadius: 22, padding: "26px 24px",
        position: "relative", overflow: "hidden",
        transition: "all 0.3s",
        transform: visible ? `translateY(${hovered ? -6 : 0}px)` : "translateY(28px)",
        opacity: visible ? 1 : 0,
        transitionDelay: visible ? `${delay}s` : "0s",
        boxShadow: hovered ? `0 20px 48px ${stat.glow}` : "0 2px 8px rgba(0,0,0,0.06)",
        cursor: "default"
      }}
    >
      {/* Arka plan gradient daire */}
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 120, height: 120, borderRadius: "50%",
        background: `radial-gradient(circle, ${stat.glow} 0%, transparent 70%)`,
        transition: "opacity 0.3s",
        opacity: hovered ? 1 : 0.5,
        pointerEvents: "none"
      }} />

      {/* Üst çizgi */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: hovered ? stat.gradient : "transparent",
        borderRadius: "22px 22px 0 0",
        transition: "background 0.3s"
      }} />

      {/* İkon */}
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: stat.iconBg,
        border: `1.5px solid ${stat.iconBorder}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 18,
        transition: "transform 0.3s",
        transform: hovered ? "scale(1.08)" : "scale(1)"
      }}>
        {stat.svgIcon}
      </div>

      {/* Label */}
      <p style={{
        color: "var(--text-muted)", fontSize: 12,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500, letterSpacing: "0.03em",
        marginBottom: 8, textTransform: "uppercase"
      }}>
        {stat.label}
      </p>

      {/* Değer */}
      <p style={{
        color: stat.color, fontSize: 44,
        fontFamily: "'Instrument Serif', serif",
        fontWeight: 400, lineHeight: 1,
        letterSpacing: "-0.03em",
        transition: "transform 0.3s",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        transformOrigin: "left center"
      }}>
        {stat.value}
      </p>

      {/* Alt bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: hovered ? stat.gradient : "transparent",
        borderRadius: "0 0 22px 22px",
        transition: "background 0.3s"
      }} />
    </div>
  )
}

function HistoryItem({ item, index, navigate }) {
  const [ref, visible] = useInView()
  const [hovered, setHovered] = useState(false)
  let hostname = ""
  try { hostname = new URL(item.url).hostname } catch { hostname = item.url }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate("/result", { state: { url: item.url } })}
      style={{
        background: hovered ? "var(--bg-secondary)" : "var(--bg-card)",
        border: `1px solid ${hovered ? "var(--accent-border, rgba(96,165,250,0.25))" : "var(--border)"}`,
        borderRadius: 16, padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 16,
        cursor: "pointer", transition: "all 0.25s",
        transform: visible ? "translateY(0)" : "translateY(20px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 0.04}s`,
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.1)" : "none"
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: "var(--bg-secondary)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, overflow: "hidden"
      }}>
        <img
          src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
          alt="" width={20} height={20}
          onError={(e) => { e.target.style.display = "none" }}
        />
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        <p style={{
          color: "var(--text-primary)", fontSize: 14, fontWeight: 500,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3
        }}>
          {hostname}
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: 11 }}>{item.date}</p>
      </div>

      <div style={{
        background: scoreBg(item.score),
        border: `1px solid ${scoreColor(item.score)}33`,
        borderRadius: 10, padding: "8px 14px",
        textAlign: "center", flexShrink: 0
      }}>
        <p style={{ color: scoreColor(item.score), fontSize: 20, fontWeight: 700, lineHeight: 1 }}>
          {item.score}
        </p>
        <p style={{ color: scoreColor(item.score), fontSize: 10, marginTop: 3, opacity: 0.8 }}>
          {scoreLabel(item.score)}
        </p>
      </div>

      <div style={{
        color: "var(--text-muted)", fontSize: 16,
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateX(0)" : "translateX(-6px)",
        transition: "all 0.2s"
      }}>→</div>
    </div>
  )
}

function HistoryPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("Hepsi")
  const history = getHistory()

  const filtered = history.filter((item) => {
    const matchSearch = item.url.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === "Hepsi" || scoreLabel(item.score) === activeFilter
    return matchSearch && matchFilter
  })

  const total = history.length
  const risky = history.filter((i) => i.score < 50).length
  const scam = history.filter((i) => i.score < 25).length

  const stats = [
    {
      label: "Toplam analiz",
      value: total,
      svgIcon: <IconChart />,
      color: "var(--accent, #60a5fa)",
      iconBg: "rgba(96,165,250,0.1)",
      iconBorder: "rgba(96,165,250,0.25)",
      gradient: "linear-gradient(to right, #60a5fa, #818cf8)",
      glow: "rgba(96,165,250,0.2)",
      borderHover: "rgba(96,165,250,0.35)"
    },
    {
      label: "Riskli bulunan",
      value: risky,
      svgIcon: <IconWarning />,
      color: "#f97316",
      iconBg: "rgba(249,115,22,0.1)",
      iconBorder: "rgba(249,115,22,0.25)",
      gradient: "linear-gradient(to right, #f97316, #fbbf24)",
      glow: "rgba(249,115,22,0.2)",
      borderHover: "rgba(249,115,22,0.35)"
    },
    {
      label: "Dolandırıcılık şüpheli",
      value: scam,
      svgIcon: <IconScam />,
      color: "#ef4444",
      iconBg: "rgba(239,68,68,0.1)",
      iconBorder: "rgba(239,68,68,0.25)",
      gradient: "linear-gradient(to right, #ef4444, #f43f5e)",
      glow: "rgba(239,68,68,0.2)",
      borderHover: "rgba(239,68,68,0.35)"
    },
  ]

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", position: "relative", overflow: "hidden" }}>

      {/* Animasyonlu arka plan blob'ları */}
      <div style={{
        position: "fixed", top: -100, left: -100, width: 500, height: 500,
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 65%)",
        animation: "blob1 8s ease-in-out infinite"
      }} />
      <div style={{
        position: "fixed", top: "35%", right: -100, width: 450, height: 450,
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 65%)",
        animation: "blob2 10s ease-in-out infinite"
      }} />
      <div style={{
        position: "fixed", bottom: -80, left: "25%", width: 400, height: 400,
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle, rgba(244,63,94,0.1) 0%, transparent 65%)",
        animation: "blob3 12s ease-in-out infinite"
      }} />
      <div style={{
        position: "fixed", top: "60%", left: -60, width: 320, height: 320,
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 65%)",
        animation: "blob1 14s ease-in-out infinite 2s"
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .history-root * { box-sizing: border-box; }
        .history-root { font-family: 'DM Sans', sans-serif; }

        @keyframes blob1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-20px) scale(1.05); }
          66% { transform: translate(-20px,15px) scale(0.95); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(-25px,20px) scale(1.08); }
          66% { transform: translate(20px,-10px) scale(0.97); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(15px,25px) scale(1.06); }
        }

        .search-input {
          width: 100%; background: var(--input-bg);
          border: 1.5px solid var(--input-border);
          color: var(--text-primary);
          padding: 13px 18px 13px 46px;
          border-radius: 14px; font-size: 14px;
          outline: none; font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus {
          border-color: var(--accent, #60a5fa);
          box-shadow: 0 0 0 3px var(--accent-subtle, rgba(96,165,250,0.12));
        }
        .search-input::placeholder { color: var(--text-muted); }

        .filter-btn {
          font-size: 12px; padding: 7px 16px;
          border-radius: 999px; cursor: pointer;
          border: 1px solid var(--border);
          background: var(--bg-card); color: var(--text-secondary);
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
          white-space: nowrap;
        }
        .filter-btn:hover { border-color: var(--accent, #60a5fa); color: var(--accent, #60a5fa); }
        .filter-btn.active {
          background: var(--accent, #60a5fa);
          color: #fff; border-color: var(--accent, #60a5fa);
        }

        .clear-btn {
          width: 100%; background: none;
          border: 1px solid var(--border);
          color: var(--text-muted); font-size: 13px;
          padding: 12px; border-radius: 12px; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, color 0.2s;
        }
        .clear-btn:hover { border-color: #ef4444; color: #ef4444; }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }

        .header-anim { animation: slideDown 0.5s ease both; }
        .search-anim { animation: slideDown 0.5s ease 0.2s both; }
        .filter-anim { animation: slideDown 0.5s ease 0.28s both; }
        .empty-state { animation: fadeIn 0.4s ease; }
      `}</style>

      <div className="history-root">
        <Navbar />

        <div style={{ maxWidth: 780, margin: "0 auto", padding: "44px 20px 72px", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <div className="header-anim" style={{ marginBottom: 40 }}>
            <p style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 400, marginBottom: 8, letterSpacing: "0.01em" }}>
              Bugüne kadar yaptığın tüm analizler
            </p>
            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              color: "var(--text-primary)",
              fontSize: "clamp(38px, 5vw, 58px)",
              fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1
            }}>
              Analizlerim
              <span style={{
                fontStyle: "italic",
                background: "linear-gradient(135deg, var(--accent, #60a5fa), #a78bfa)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                marginLeft: 12
              }}>geçmişi.</span>
            </h1>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} delay={i * 0.1} />
            ))}
          </div>

          {/* Search */}
          <div className="search-anim" style={{ position: "relative", marginBottom: 14 }}>
            <svg style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", opacity: 0.4, pointerEvents: "none" }}
              width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="var(--text-secondary)" strokeWidth="1.5" />
              <line x1="11" y1="11" x2="14" y2="14" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Site adı veya URL ara..."
              className="search-input"
            />
          </div>

          {/* Filters */}
          <div className="filter-anim" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`filter-btn ${activeFilter === f ? "active" : ""}`}>
                {f}
              </button>
            ))}
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="empty-state" style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "72px 0", gap: 14,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 20, textAlign: "center"
            }}>
              <div style={{ fontSize: 48 }}>{history.length === 0 ? "🔍" : "😶"}</div>
              <p style={{ color: "var(--text-primary)", fontSize: 16, fontWeight: 500 }}>
                {history.length === 0 ? "Henüz analiz yapmadınız" : "Sonuç bulunamadı"}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: 13, maxWidth: 280, lineHeight: 1.6 }}>
                {history.length === 0
                  ? "Bir ürün sayfasının URL'ini yapıştırarak ilk analizini yap."
                  : "Farklı bir arama terimi veya filtre deneyin."}
              </p>
              {history.length === 0 && (
                <button onClick={() => navigate("/")} style={{
                  background: "var(--accent, #60a5fa)", color: "#fff",
                  border: "none", padding: "11px 24px", borderRadius: 12,
                  fontSize: 13, cursor: "pointer", fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif", marginTop: 4
                }}>
                  İlk analizini yap →
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 4 }}>{filtered.length} sonuç</p>
              {filtered.map((item, i) => (
                <HistoryItem key={item.id} item={item} index={i} navigate={navigate} />
              ))}
            </div>
          )}

          {history.length > 0 && (
            <button className="clear-btn" style={{ marginTop: 24 }}
              onClick={() => { localStorage.removeItem("trustlens_history"); window.location.reload() }}>
              🗑️ Geçmişi temizle
            </button>
          )}

        </div>
      </div>
    </div>
  )
}

export default HistoryPage