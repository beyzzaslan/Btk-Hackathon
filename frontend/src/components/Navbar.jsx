import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

function TrustLensLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* Dış petal çerçevesi — 6 petal */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx = 32 + Math.cos(rad) * 18
        const cy = 32 + Math.sin(rad) * 18
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={10}
            stroke="url(#g1)" strokeWidth="1.2"
            fill="none" opacity="0.7"
          />
        )
      })}

      {/* Orta sarmal çizgiler */}
      <circle cx="32" cy="32" r="8" stroke="url(#g2)" strokeWidth="1.4" fill="none" opacity="0.9" />
      <circle cx="32" cy="32" r="4.5" stroke="url(#g1)" strokeWidth="1.2" fill="none" opacity="0.8" />

      {/* Bağlantı çizgileri — merkeze */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const x1 = 32 + Math.cos(rad) * 10
        const y1 = 32 + Math.sin(rad) * 10
        const x2 = 32 + Math.cos(rad) * 22
        const y2 = 32 + Math.sin(rad) * 22
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="url(#g1)" strokeWidth="1" opacity="0.5" />
        )
      })}

      {/* Dış nokta dekorasyonlar */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx = 32 + Math.cos(rad) * 28
        const cy = 32 + Math.sin(rad) * 28
        return <circle key={i} cx={cx} cy={cy} r={1.8} fill="url(#g1)" opacity="0.9" />
      })}

      {/* Ara nokta dekorasyonlar */}
      {[30, 90, 150, 210, 270, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx = 32 + Math.cos(rad) * 20
        const cy = 32 + Math.sin(rad) * 20
        return <circle key={i} cx={cx} cy={cy} r={1.2} fill="#ec4899" opacity="0.7" />
      })}

      {/* Merkez nokta */}
      <circle cx="32" cy="32" r="2.5" fill="url(#g2)" opacity="1" />
    </svg>
  )
}

function Navbar() {
  const navigate = useNavigate()
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  )
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function toggleTheme() {
    setTheme(prev => prev === "dark" ? "light" : "dark")
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');

        .nav-link {
          color: var(--text-secondary); font-size: 14px;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-weight: 400; transition: color 0.2s;
          text-decoration: none; letter-spacing: 0.01em;
          display: flex; align-items: center; gap: 5px;
        }
        .nav-link:hover { color: var(--text-primary); }

        .theme-btn {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; cursor: pointer;
          border: 1px solid var(--border); background: transparent;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .theme-btn:hover { background: var(--accent-subtle); border-color: var(--accent-glow); transform: scale(1.08); }

        .nav-cta {
          background: var(--accent); color: #fff; border: none;
          border-radius: 11px; padding: 10px 22px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          font-weight: 500; cursor: pointer; letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .nav-cta:hover {
          background: var(--accent-hover); transform: translateY(-1px);
          box-shadow: 0 4px 16px var(--accent-glow);
        }

        .logo-wrap {
          display: flex; align-items: center; gap: 10px;
          cursor: pointer; text-decoration: none;
        }
        .logo-wrap:hover .logo-svg { transform: rotate(30deg); }
        .logo-svg { transition: transform 0.4s ease; }

        .logo-text-main {
          font-family: 'Instrument Serif', serif;
          font-size: 22px; font-weight: 400;
          color: var(--text-primary); letter-spacing: -0.03em; line-height: 1;
        }
        .logo-text-lens {
          font-style: italic;
          background: linear-gradient(135deg, #a855f7, #ec4899, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .logo-text-ai {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.04em; margin-left: 4px;
          vertical-align: middle; position: relative; top: -1px;
          font-style: normal; color: var(--text-muted);
          -webkit-text-fill-color: var(--text-muted);
        }
        .nav-divider { width: 1px; height: 18px; background: var(--border); }

        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-animate {
          animation: navSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .logo-wrap-inner {
          display: flex; align-items: center; gap: 10px;
          animation: navSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
        }
        .nav-right {
          display: flex; align-items: center; gap: 22px;
          animation: navSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }
      `}</style>

      <nav className="nav-animate" style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "var(--bg-primary)" : "var(--bg-primary)",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
        boxShadow: scrolled ? "0 1px 20px var(--accent-subtle)" : "none",
        padding: "0 36px", height: 66,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>

        {/* Logo */}
        <div className="logo-wrap logo-wrap-inner" onClick={() => navigate("/")}>
          <div className="logo-svg">
            <TrustLensLogo size={34} />
          </div>
          <span className="logo-text-main">
            Trust<span className="logo-text-lens">Lens</span>
            <span className="logo-text-ai">AI</span>
          </span>
        </div>

        {/* Sağ */}
        <div className="nav-right">
          <span
            onClick={() => navigate("/history")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 10, padding: "7px 14px",
              cursor: "pointer", fontSize: 13,
              color: "var(--text-secondary)",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--accent, #60a5fa)"
              e.currentTarget.style.color = "var(--accent, #60a5fa)"
              e.currentTarget.style.background = "var(--accent-subtle, rgba(96,165,250,0.08))"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border)"
              e.currentTarget.style.color = "var(--text-secondary)"
              e.currentTarget.style.background = "var(--bg-secondary)"
            }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.6 }}>
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
              <polyline points="7,4 7,7 9,9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Geçmiş
          </span>

          <div className="nav-divider" />

          <button className="theme-btn" onClick={toggleTheme} aria-label="Tema değiştir">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <button className="nav-cta" onClick={() => navigate("/")}>
            Analiz Et ↗
          </button>
        </div>
      </nav>
    </>
  )
}

export default Navbar