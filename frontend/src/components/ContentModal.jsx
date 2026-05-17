function IconPrice() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 4v1.5M8 10.5V12M6 6.5h3a1.5 1.5 0 010 3H7a1.5 1.5 0 000 3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function IconBox() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 5l6-3 6 3v7l-6 3-6-3V5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M8 2v13M2 5l6 3 6-3" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
    </svg>
  )
}

function IconTruck() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M10 7h3l2 3v2h-5V7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <circle cx="4" cy="12.5" r="1.2" stroke="currentColor" strokeWidth="1.1"/>
      <circle cx="12" cy="12.5" r="1.2" stroke="currentColor" strokeWidth="1.1"/>
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function ContentModal({ module, onClose }) {
  const isOk = module.badgeType === "ok"

  const kontroller = [
    { SvgIcon: IconPrice, baslik: "Fiyat tutarlılığı", aciklama: isOk ? "Sayfada gösterilen fiyat ile sepet/ödeme adımındaki fiyat uyuşuyor." : "Sayfada gösterilen fiyat ile sepet fiyatı arasında tutarsızlık tespit edildi.", durum: isOk },
    { SvgIcon: IconBox, baslik: "Ürün açıklaması", aciklama: isOk ? "Ürün başlığı, görseli ve açıklaması birbiriyle örtüşüyor." : "Ürün başlığı veya görseli açıklamayla çelişiyor.", durum: isOk },
    { SvgIcon: IconTruck, baslik: "Kargo bilgisi", aciklama: isOk ? "Kargo süresi ve ücreti sayfanın farklı bölümlerinde tutarlı görünüyor." : "Kargo bilgisinde çelişkili ifadeler tespit edildi.", durum: isOk },
    { SvgIcon: IconUser, baslik: "Satıcı bilgisi", aciklama: isOk ? "İletişim adresi ve satıcı bilgileri tutarlı ve erişilebilir görünüyor." : "Satıcı konumu veya iletişim bilgilerinde tutarsızlık var.", durum: isOk },
  ]

  const statusColor = isOk ? "#4ade80" : "#f87171"
  const bannerBg = isOk ? "rgba(74,222,128,0.07)" : "rgba(248,113,113,0.07)"
  const bannerBorder = isOk ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 22, padding: "28px 28px 24px",
        width: "100%", maxWidth: 500,
        boxShadow: "0 32px 80px rgba(0,0,0,0.18)"
      }}>

        {/* Başlık */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)"
            }}>
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M3 7h7M3 10h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <circle cx="12.5" cy="11.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="14.3" y1="13.3" x2="15.5" y2="14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>İçerik tutarlılığı</p>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>4 alan kontrol edildi</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 9,
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            color: "var(--text-muted)", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>×</button>
        </div>

        {/* Genel durum banner */}
        <div style={{
          background: bannerBg, border: `1px solid ${bannerBorder}`,
          borderRadius: 12, padding: "12px 16px", marginBottom: 18,
          display: "flex", alignItems: "center", gap: 10
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: `${statusColor}15`, border: `1px solid ${statusColor}25`,
            display: "flex", alignItems: "center", justifyContent: "center", color: statusColor, flexShrink: 0
          }}>
            {isOk ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L13 12H1L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <line x1="7" y1="5.5" x2="7" y2="8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <circle cx="7" cy="10.2" r="0.7" fill="currentColor"/>
              </svg>
            )}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
            {isOk ? "Sayfadaki bilgiler birbiriyle tutarlı görünüyor." : "Sayfada çelişkili bilgiler tespit edildi. Dikkatli olun."}
          </p>
        </div>

        {/* Kontrol listesi */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {kontroller.map((k) => {
            const { SvgIcon } = k
            const itemColor = k.durum ? "#4ade80" : "#f87171"
            return (
              <div key={k.baslik} style={{
                background: "var(--bg-secondary)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "13px 16px",
                position: "relative", overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                  background: `linear-gradient(to bottom, ${itemColor}, ${itemColor}55)`,
                  borderRadius: "12px 0 0 12px"
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `${itemColor}12`, border: `1px solid ${itemColor}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: itemColor, flexShrink: 0
                  }}>
                    <SvgIcon />
                  </div>
                  <span style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500, flex: 1, fontFamily: "'DM Sans', sans-serif" }}>
                    {k.baslik}
                  </span>
                  <span style={{ fontSize: 11, color: itemColor, fontWeight: 500 }}>
                    {k.durum ? "✓ Tutarlı" : "✗ Çelişki"}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.65, margin: 0 }}>
                  {k.aciklama}
                </p>
              </div>
            )
          })}
        </div>

        <button onClick={onClose} style={{
          width: "100%", marginTop: 20,
          background: "var(--bg-secondary)", border: "1px solid var(--border)",
          color: "var(--text-primary)", fontSize: 13, fontWeight: 500,
          padding: 13, borderRadius: 12, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s"
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#60a5fa"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          Tamam
        </button>
      </div>
    </div>
  )
}

export default ContentModal