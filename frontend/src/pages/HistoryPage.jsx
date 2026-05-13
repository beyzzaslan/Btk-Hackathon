import { useState } from "react"
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

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            <Navbar />

            <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 16px" }}>

                <h1 style={{ color: "var(--text-primary)", fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
                    Geçmiş analizler
                </h1>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
                    {[
                        { label: "Toplam analiz", value: total },
                        { label: "Riskli bulunan", value: risky },
                        { label: "Dolandırıcılık şüpheli", value: scam }
                    ].map((stat) => (
                        <div key={stat.label} style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "14px 16px" }}>
                            <p style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 6 }}>{stat.label}</p>
                            <p style={{ color: "var(--text-primary)", fontSize: 22, fontWeight: 600 }}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Site adı veya URL ara..."
                    style={{ width: "100%", background: "var(--input-bg)", border: "0.5px solid var(--input-border)", color: "var(--text-primary)", padding: "10px 16px", borderRadius: 10, fontSize: 13, outline: "none", marginBottom: 12 }}
                />

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            style={{ fontSize: 12, padding: "6px 14px", borderRadius: 20, border: "0.5px solid var(--border)", cursor: "pointer", background: activeFilter === f ? "#2563eb" : "var(--bg-card)", color: activeFilter === f ? "#fff" : "var(--text-secondary)", transition: "all 0.15s" }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", gap: 12 }}>
                        <p style={{ fontSize: 36 }}>🔍</p>
                        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                            {history.length === 0 ? "Henüz analiz yapmadınız." : "Sonuç bulunamadı."}
                        </p>
                        {history.length === 0 && (
                            <button
                                onClick={() => navigate("/")}
                                style={{ background: "#2563eb", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 500 }}
                            >
                                İlk analizini yap →
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate("/result", { state: { url: item.url } })}
                                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                            >
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, overflow: "hidden" }}>
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=32`}
                                        alt=""
                                        width={20}
                                        height={20}
                                        onError={(e) => { e.target.style.display = "none" }}
                                    />
                                </div>
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <p style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {new URL(item.url).hostname}
                                    </p>
                                    <p style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}>{item.date}</p>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    <p style={{ color: scoreColor(item.score), fontSize: 18, fontWeight: 600 }}>{item.score}</p>
                                    <p style={{ color: "var(--text-muted)", fontSize: 10 }}>{scoreLabel(item.score)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {history.length > 0 && (
                    <button
                        onClick={() => { localStorage.removeItem("trustlens_history"); window.location.reload() }}
                        style={{ marginTop: 24, width: "100%", background: "none", border: "0.5px solid var(--border)", color: "var(--text-muted)", fontSize: 12, padding: "10px", borderRadius: 10, cursor: "pointer" }}
                    >
                        Geçmişi temizle
                    </button>
                )}

            </div>
        </div>
    )
}

export default HistoryPage