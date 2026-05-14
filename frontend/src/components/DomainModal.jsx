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
    if (sayi <= 30) return { renk: "#ef4444", mesaj: "Çok yeni — dolandırıcı siteler genelde kısa ömürlü domainler kullanır." }
    if (sayi <= 180) return { renk: "#eab308", mesaj: "Görece yeni — dikkatli olunması önerilir." }
    return { renk: "#22c55e", mesaj: "Yeterince eski, güvenilir bir sinyal." }
  }

  const domainRisk = getDomainRisk()

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
            🌐 Alan adı bilgisi
          </span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Domain yaşı */}
          {domainAge && (
            <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 15 }}>📅</span>
                <span style={{ color: "var(--text-primary)", fontSize: 12, fontWeight: 500 }}>Domain Yaşı</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: domainRisk?.renk, fontWeight: 500 }}>
                  {domainAge}
                </span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                {domainRisk?.mesaj}
              </p>
            </div>
          )}

          {/* SSL */}
          {hasSSL && (
            <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 15 }}>🔒</span>
                <span style={{ color: "var(--text-primary)", fontSize: 12, fontWeight: 500 }}>SSL Sertifikası</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: sslTemiz ? "#22c55e" : "#ef4444", fontWeight: 500 }}>
                  {sslTemiz ? "✓ Mevcut" : "✗ Yok"}
                </span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                {sslTemiz
                  ? "Bağlantı şifreli, verileriniz korunuyor."
                  : "SSL yok — şifresiz bağlantı, kart bilgisi girmeyin."}
              </p>
            </div>
          )}

          {/* Blacklist */}
          {blacklist && (
            <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 15 }}>🚫</span>
                <span style={{ color: "var(--text-primary)", fontSize: 12, fontWeight: 500 }}>Blacklist Kontrolü</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: blacklistTemiz ? "#22c55e" : "#ef4444", fontWeight: 500 }}>
                  {blacklistTemiz ? "✓ Temiz" : "✗ Listede var"}
                </span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                {blacklistTemiz
                  ? "Google Safe Browsing'de bu domain için uyarı yok."
                  : "Bu domain daha önce dolandırıcılık için işaretlenmiş!"}
              </p>
            </div>
          )}

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

export default DomainModal