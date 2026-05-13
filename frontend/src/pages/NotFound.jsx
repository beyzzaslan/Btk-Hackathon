import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "70vh", gap: 12, textAlign: "center", padding: "0 16px" }}>
        <p style={{ fontSize: 64, lineHeight: 1 }}>🔍</p>
        <h1 style={{ color: "var(--text-primary)", fontSize: 24, fontWeight: 600, marginTop: 8 }}>Sayfa bulunamadı</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 320, lineHeight: 1.6 }}>Aradığın sayfa mevcut değil ya da taşınmış olabilir.</p>
        <button onClick={() => navigate("/")} style={{ marginTop: 8, background: "#2563eb", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          Ana sayfaya dön →
        </button>
      </div>
    </div>
  )
}

export default NotFound