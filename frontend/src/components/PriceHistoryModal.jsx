import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

function IconTag() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 2h6l6 6-6 6-6-6V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <circle cx="5.5" cy="5.5" r="1" fill="currentColor"/>
    </svg>
  )
}

function IconWarning() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L14.5 13H1.5L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1"/>
      <line x1="8" y1="6" x2="8" y2="9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="8" cy="11.2" r="0.7" fill="currentColor"/>
    </svg>
  )
}

function PriceHistoryModal({ data, onClose }) {
  if (!data) return null

  const { current_price, claimed_original, lowest_ever, highest_ever, is_fake_discount, fake_reason, price_history } = data

  const chartData = price_history.map((p) => ({
    tarih: p.date.slice(0, 7),
    "Gerçek Fiyat": p.price,
    "İddia Edilen": claimed_original
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 10, padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
      }}>
        <p style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 6 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: 12, fontWeight: 500 }}>
            {p.name}: {Number(p.value).toLocaleString("tr-TR")}₺
          </p>
        ))}
      </div>
    )
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 22, width: "100%", maxWidth: 580,
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 24px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-secondary)"
            }}>
              <IconTag />
            </div>
            <div>
              <p style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
                Sahte indirim analizi
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>Fiyat geçmişi karşılaştırması</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 9,
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            color: "var(--text-muted)", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>×</button>
        </div>

        <div style={{ padding: "20px 24px" }}>

          {/* Metrik kartlar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "İddia edilen", value: `${claimed_original.toLocaleString("tr-TR")}₺`, color: "var(--text-muted)", extra: { textDecoration: "line-through" } },
              { label: "Şu anki fiyat", value: `${current_price.toLocaleString("tr-TR")}₺`, color: "#f7382b" },
              { label: "Gerçek en düşük", value: `${lowest_ever.toLocaleString("tr-TR")}₺`, color: "#4ade80" },
            ].map((m) => (
              <div key={m.label} style={{
                background: "var(--bg-secondary)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "14px 16px"
              }}>
                <p style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>{m.label}</p>
                <p style={{ fontSize: 20, fontWeight: 600, color: m.color, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.01em", ...m.extra }}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          {/* Uyarı */}
          {is_fake_discount && (
            <div style={{
              background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 12, padding: "12px 16px", marginBottom: 20,
              display: "flex", alignItems: "flex-start", gap: 10
            }}>
              <div style={{ color: "#ef4444", flexShrink: 0, marginTop: 1 }}>
                <IconWarning />
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {fake_reason}
              </p>
            </div>
          )}

          {/* Grafik */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>
              Fiyat geçmişi
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="tarih" tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "DM Sans" }} tickFormatter={v => `${v.toLocaleString("tr-TR")}₺`} width={72} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Gerçek Fiyat" stroke="#60a5fa" strokeWidth={2.5} dot={{ r: 4, fill: "#60a5fa", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="İddia Edilen" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="6 4" dot={false} opacity={0.6} />
              </LineChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
              {[
                { color: "#60a5fa", label: "Gerçek Fiyat" },
                { color: "#ef4444", label: "İddia Edilen", dashed: true },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: l.dashed ? 18 : 10, height: l.dashed ? 2 : 10,
                    borderRadius: l.dashed ? 0 : "50%",
                    background: l.color,
                    opacity: l.dashed ? 0.6 : 1,
                    borderTop: l.dashed ? `2px dashed ${l.color}` : "none"
                  }} />
                  <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bilgi notu */}
          <div style={{
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "12px 16px", marginBottom: 20
          }}>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.65 }}>
              Gerçek en yüksek fiyat:{" "}
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                {highest_ever.toLocaleString("tr-TR")}₺
              </span>
              {" "}— iddia edilen referans fiyatla tutarsız.
            </p>
          </div>

          {/* Butonlar */}
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{
              flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)",
              color: "var(--text-secondary)", fontSize: 13, padding: "11px", borderRadius: 12,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#60a5fa"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              Yanlış mı? Bildir
            </button>
            <button onClick={onClose} style={{
              flex: 1, background: "linear-gradient(135deg, #60a5fa, #818cf8)",
              border: "none", color: "#fff", fontSize: 13, fontWeight: 500,
              padding: "11px", borderRadius: 12, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", transition: "opacity 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Tamam
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PriceHistoryModal