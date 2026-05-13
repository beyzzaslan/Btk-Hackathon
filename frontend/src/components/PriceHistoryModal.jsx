import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

function PriceHistoryModal({ data, onClose }) {
  if (!data) return null

  const { current_price, claimed_original, lowest_ever, highest_ever, is_fake_discount, fake_reason, price_history } = data

  const chartData = price_history.map((p) => ({
    tarih: p.date.slice(0, 7),
    "Gerçek Fiyat": p.price,
    "İddia Edilen": claimed_original
  }))

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 14px", borderBottom: "0.5px solid var(--border)" }}>
          <span style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 500 }}>🏷️ Sahte indirim analizi</span>
          <button onClick={onClose} style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", borderRadius: 8, width: 28, height: 28, cursor: "pointer", color: "var(--text-secondary)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Metrik kartlar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: "16px 20px 0" }}>
          <div style={{ background: "var(--bg-secondary)", borderRadius: 10, padding: "12px 14px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 4 }}>İddia edilen</p>
            <p style={{ fontSize: 17, fontWeight: 500, color: "var(--text-muted)", textDecoration: "line-through" }}>{claimed_original.toLocaleString("tr-TR")}₺</p>
          </div>
          <div style={{ background: "var(--bg-secondary)", borderRadius: 10, padding: "12px 14px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 4 }}>Şu anki fiyat</p>
            <p style={{ fontSize: 17, fontWeight: 500, color: "#ef4444" }}>{current_price.toLocaleString("tr-TR")}₺</p>
          </div>
          <div style={{ background: "var(--bg-secondary)", borderRadius: 10, padding: "12px 14px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 4 }}>Gerçek en düşük</p>
            <p style={{ fontSize: 17, fontWeight: 500, color: "#22c55e" }}>{lowest_ever.toLocaleString("tr-TR")}₺</p>
          </div>
        </div>

        {/* Uyarı */}
        {is_fake_discount && (
          <div style={{ margin: "12px 20px 0", background: "#431407", border: "0.5px solid #7c2d12", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8 }}>
            <span style={{ flexShrink: 0 }}>⚠️</span>
            <span style={{ fontSize: 12, color: "#fdba74", lineHeight: 1.6 }}>{fake_reason}</span>
          </div>
        )}

        {/* Çizgi grafik */}
        <div style={{ padding: "16px 20px 0" }}>
          <p style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 12 }}>Fiyat geçmişi</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="tarih" tick={{ fontSize: 11, fill: "#888" }} />
              <YAxis tick={{ fontSize: 11, fill: "#888" }} tickFormatter={(v) => `${v.toLocaleString("tr-TR")}₺`} width={75} />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(value) => `${Number(value).toLocaleString("tr-TR")}₺`}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Line type="monotone" dataKey="Gerçek Fiyat" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="İddia Edilen" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bilgi notu */}
        <div style={{ margin: "12px 20px 0", background: "var(--bg-secondary)", borderRadius: 10, padding: "10px 14px" }}>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Gerçek en yüksek fiyat: <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>{highest_ever.toLocaleString("tr-TR")}₺</strong> — iddia edilen referans fiyatla tutarsız.
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 8, padding: 20, borderTop: "0.5px solid var(--border)", marginTop: 16 }}>
          <button style={{ flex: 1, background: "none", border: "0.5px solid var(--border)", color: "var(--text-secondary)", fontSize: 12, padding: 10, borderRadius: 10, cursor: "pointer" }}>
            Yanlış mı? Bildir
          </button>
          <button onClick={onClose} style={{ flex: 1, background: "#2563eb", border: "none", color: "#fff", fontSize: 12, fontWeight: 500, padding: 10, borderRadius: 10, cursor: "pointer" }}>
            Tamam
          </button>
        </div>
      </div>
    </div>
  )
}

export default PriceHistoryModal