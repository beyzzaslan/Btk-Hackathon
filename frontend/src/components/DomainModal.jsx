function IconCalendarAge() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="5" y1="1.5" x2="5" y2="4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="11" y1="1.5" x2="11" y2="4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="1.5" y1="7" x2="14.5" y2="7" stroke="currentColor" strokeWidth="1.1"/>
      <rect x="4" y="9" width="2" height="2" rx="0.4" fill="currentColor" opacity="0.5"/>
      <rect x="7" y="9" width="2" height="2" rx="0.4" fill="currentColor" opacity="0.5"/>
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="8" cy="11" r="1.2" fill="currentColor" opacity="0.7"/>
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L2 4v4c0 3 2.5 5.5 6 6.5 3.5-1 6-3.5 6-6.5V4L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function DomainModal({ module, onClose }) {
  const pills = module.pills || []

  const domainAge = pills.find(p => p.includes("günlük domain") || p.includes("yıllık domain") || p.includes("aylık domain"))
  const hasSSL = pills.find(p => p.includes("SSL"))
  const blacklist = pills.find(p => p.includes("Blacklist"))

  const sslTemiz = hasSSL?.includes("✓")
  const blacklistTemiz = blacklist?.includes("temiz")

  const getDomainRisk = () => {
    if (!domainAge) return null
    const sayi = parseInt(domainAge)
    if (sayi <= 30) return { renk: "#f87171", mesaj: "Çok yeni — dolandırıcı siteler genelde kısa ömürlü domainler kullanır." }
    if (sayi <= 180) return { renk: "#fbbf24", mesaj: "Görece yeni — dikkatli olunması önerilir." }
    return { renk: "#4ade80", mesaj: "Yeterince eski, güvenilir bir sinyal." }
  }

  const domainRisk = getDomainRisk()

  const items = [
    domainAge && {
      SvgIcon: IconCalendarAge,
      baslik: "Domain Yaşı",
      aciklama: domainRisk?.mesaj,
      durum: parseInt(domainAge) > 180,
      statusText: domainAge,
      statusColor: domainRisk?.renk,
      color: domainRisk?.renk || "#60a5fa"
    },
    hasSSL && {
      SvgIcon: IconLock,
      baslik: "SSL Sertifikası",
      aciklama: sslTemiz ? "Bağlantı şifreli, verileriniz korunuyor." : "SSL yok — şifresiz bağlantı, kart bilgisi girmeyin.",
      durum: sslTemiz,
      statusText: sslTemiz ? "Mevcut" : "Yok",
      statusColor: sslTemiz ? "#4ade80" : "#f87171",
      color: sslTemiz ? "#4ade80" : "#f87171"
    },
    blacklist && {
      SvgIcon: IconShield,
      baslik: "Blacklist Kontrolü",
      aciklama: blacklistTemiz ? "Google Safe Browsing'de bu domain için uyarı yok." : "Bu domain daha önce dolandırıcılık için işaretlenmiş!",
      durum: blacklistTemiz,
      statusText: blacklistTemiz ? "Temiz" : "Listede var",
      statusColor: blacklistTemiz ? "#4ade80" : "#f87171",
      color: blacklistTemiz ? "#4ade80" : "#f87171"
    }
  ].filter(Boolean)

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)"
            }}>
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                <ellipse cx="8" cy="8" rx="2.5" ry="6.5" stroke="currentColor" strokeWidth="1.1"/>
                <line x1="1.5" y1="8" x2="14.5" y2="8" stroke="currentColor" strokeWidth="1.1"/>
              </svg>
            </div>
            <div>
              <p style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>Alan adı bilgisi</p>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>3 kontrol yapıldı</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 9,
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            color: "var(--text-muted)", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>×</button>
        </div>

        {/* Kontroller */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item) => {
            const { SvgIcon } = item
            return (
              <div key={item.baslik} style={{
                background: "var(--bg-secondary)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "14px 16px",
                position: "relative", overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                  background: `linear-gradient(to bottom, ${item.color}, ${item.color}55)`,
                  borderRadius: "12px 0 0 12px"
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `${item.color}12`, border: `1px solid ${item.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: item.color, flexShrink: 0
                  }}>
                    <SvgIcon />
                  </div>
                  <span style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500, flex: 1, fontFamily: "'DM Sans', sans-serif" }}>
                    {item.baslik}
                  </span>
                  <span style={{ fontSize: 11, color: item.statusColor, fontWeight: 500, flexShrink: 0 }}>
                    {item.durum ? "✓" : "✗"} {item.statusText}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.65, margin: 0 }}>
                  {item.aciklama}
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

export default DomainModal