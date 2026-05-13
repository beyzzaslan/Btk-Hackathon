import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

function Navbar() {
  const navigate = useNavigate()
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  )

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  function toggleTheme() {
    setTheme(prev => prev === "dark" ? "light" : "dark")
  }

  return (
    <nav
      style={{
        background: "var(--bg-primary)",
        borderBottom: "0.5px solid var(--border)"
      }}
      className="w-full flex justify-between items-center px-8 py-4"
    >
      <h1
        onClick={() => navigate("/")}
        style={{ color: "var(--text-primary)" }}
        className="text-xl font-semibold cursor-pointer"
      >
        TrustLens AI
      </h1>

      <div className="flex items-center gap-4">
        <span
          onClick={() => navigate("/history")}
          style={{ color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" }}
          className="hidden sm:block hover:opacity-70"
        >
          Geçmiş
        </span>
        <span style={{ color: "var(--text-muted)" }} className="text-xs hidden sm:block">
          {theme === "dark" ? "Koyu tema" : "Açık tema"}
        </span>
        <button
          onClick={toggleTheme}
          style={{
            background: "var(--bg-secondary)",
            border: "0.5px solid var(--border)",
            color: "var(--text-secondary)"
          }}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-base transition-opacity hover:opacity-70"
          aria-label="Tema değiştir"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  )
}

export default Navbar