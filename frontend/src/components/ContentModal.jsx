function ContentModal({ module, onClose }) {
  const isOk = module.badgeType === "ok"

  const kontroller = [
    {
      icon: "💰",
      baslik: "Fiyat tutarlılığı",
      aciklama: isOk
        ? "Sayfada gösterilen fiyat ile sepet/ödeme adımındaki fiyat uyuşuyor."
        : "Sayfada gösterilen fiyat ile sepet fiyatı arasında tutarsızlık tespit edildi.",
      durum: isOk
    },
    {
      icon: "📦",
      baslik: "Ürün açıklaması",
      aciklama: isOk
        ? "Ürün başlığı, görseli ve açıklaması birbiriyle örtüşüyor."
        : "Ürün başlığı veya görseli açıklamayla çelişiyor.",
      durum: isOk
    },
    {
      icon: "🚚",
      baslik: "Kargo bilgisi",
      aciklama: isOk
        ? "Kargo süresi ve ücreti sayfanın farklı bölümlerinde tutarlı görünüyor."
        : "Kargo bilgisinde çelişkili ifadeler tespit edildi.",
      durum: isOk
    },
    {
      icon: "📍",
      baslik: "Satıcı bilgisi",
      aciklama: isOk
        ? "İletişim adresi ve satıcı bilgileri tutarlı ve erişilebilir görünüyor."
        : "Satıcı konumu veya iletişim bilgilerinde tutarsızlık var.",
      durum: isOk
    }
  ]

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 16
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "0.5px solid var(--border)",
          borderRadius: 16,
          padding: 24,
          width: "100%",
          maxWidth: 440,
        }}
      >
        {/* Başlık */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 600 }}>
            🛡️ İçerik tutarlılığı
          </span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Genel durum banner */}
        <div style={{
          background: isOk ? "#052e16" : "#431407",
          border: `0.5px solid ${isOk ? "#166534" : "#7c2d12"}`,
          borderRadius: 10,
          padding: "10px 14px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <span style={{ fontSize: 14 }}>{isOk ? "✅" : "⚠️"}</span>
          <span style={{ fontSize: 12, color: isOk ? "#4ade80" : "#fdba74", lineHeight: 1.5 }}>
            {isOk
              ? "Sayfadaki bilgiler birbiriyle tutarlı görünüyor."
              : "Sayfada çelişkili bilgiler tespit edildi. Dikkatli olun."}
          </span>
        </div>

        {/* Kontrol listesi */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {kontroller.map((k) => (
            <div key={k.baslik} style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 15 }}>{k.icon}</span>
                <span style={{ color: "var(--text-primary)", fontSize: 12, fontWeight: 500 }}>{k.baslik}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: k.durum ? "#22c55e" : "#ef4444", fontWeight: 500 }}>
                  {k.durum ? "✓ Tutarlı" : "✗ Çelişki"}
                </span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                {k.aciklama}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{ width: "100%", marginTop: 20, background: "#2563eb", border: "none", color: "#fff", fontSize: 13, fontWeight: 500, padding: 12, borderRadius: 10, cursor: "pointer" }}
        >
          Tamam
        </button>
      </div>
    </div>
  )
}

export default ContentModal