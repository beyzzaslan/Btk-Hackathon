function ReviewModal({ module, onClose }) {
  const suphelijorumlar = [
    { yildiz: "⭐⭐⭐⭐⭐", metin: "Harika ürün, kesinlikle alın!", sebep: "Jenerik ifade" },
    { yildiz: "⭐⭐⭐⭐⭐", metin: "Çok memnun kaldım, herkese tavsiye ederim.", sebep: "Jenerik ifade" },
    { yildiz: "⭐⭐⭐⭐⭐", metin: "İnanılmaz kalite, beklentilerimin üzerinde!", sebep: "Aşırı pozitif" },
    { yildiz: "⭐⭐⭐⭐⭐", metin: "Mükemmel, çok beğendim teşekkürler.", sebep: "Jenerik ifade" },
    { yildiz: "⭐⭐⭐⭐⭐", metin: "Süper ürün tavsiye ederim 👍", sebep: "Jenerik ifade" },
  ]

  const pillAciklamalari = {
    "Aynı gün 15 yorum": {
      icon: "📅",
      baslik: "Anormal yorum kümelenmesi",
      aciklama: "Tek bir günde 15 yorum gelmiş. Gerçek kullanıcılar bu hızda yorum bırakmaz — bot aktivitesi veya teşvikli yorum olabilir."
    },
    "Aşırı jenerik dil": {
      icon: "🤖",
      baslik: "Botik dil örüntüsü",
      aciklama: '"Harika!", "Kesinlikle alın!", "Çok memnun kaldım" gibi kalıp ifadeler yoğun. Gerçek yorumlar genelde spesifik deneyim içerir.'
    },
    "%97 beş yıldız": {
      icon: "⭐",
      baslik: "Anormal yıldız dağılımı",
      aciklama: "Yorumların %97si 5 yıldız. Gerçek ürünlerde bu oran genelde %60-80 arasındadır. Bu kadar yüksek oran manipülasyon belirtisi."
    }
  }

  const pills = module.pills || []
  const toplam = 48
  const supheli = 31

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
          maxWidth: 480,
          maxHeight: "85vh",
          overflowY: "auto"
        }}
      >
        {/* Başlık */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 600 }}>
            💬 Yorum analizi
          </span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Özet banner */}
        <div style={{
          background: "#422006",
          border: "0.5px solid #92400e",
          borderRadius: 10,
          padding: "10px 14px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <p style={{ color: "#fbbf24", fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1 }}>
              {Math.round((supheli / toplam) * 100)}%
            </p>
            <p style={{ color: "#d97706", fontSize: 10, margin: 0, marginTop: 2 }}>şüpheli</p>
          </div>
          <div style={{ width: "0.5px", height: 36, background: "#92400e" }} />
          <p style={{ color: "#fbbf24", fontSize: 12, lineHeight: 1.5, margin: 0 }}>
            {toplam} yorumun {supheli} tanesi anormal örüntü gösteriyor. Gerçek kullanıcı deneyimi yansıtmıyor olabilir.
          </p>
        </div>

        {/* Tespit edilen örüntüler */}
        <p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Tespit edilen örüntüler
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {pills.map((pill) => {
            const bilgi = pillAciklamalari[pill]
            if (!bilgi) return null
            return (
              <div key={pill} style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 15 }}>{bilgi.icon}</span>
                  <span style={{ color: "var(--text-primary)", fontSize: 12, fontWeight: 500 }}>{bilgi.baslik}</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, background: "#422006", color: "#fbbf24", padding: "2px 8px", borderRadius: 20 }}>
                    {pill}
                  </span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                  {bilgi.aciklama}
                </p>
              </div>
            )
          })}
        </div>

        {/* Şüpheli yorum örnekleri */}
        <p style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Şüpheli yorum örnekleri
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
          {suphelijorumlar.map((y, i) => (
            <div key={i} style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <div>
                <p style={{ color: "var(--text-muted)", fontSize: 10, margin: 0, marginBottom: 3 }}>{y.yildiz}</p>
                <p style={{ color: "var(--text-secondary)", fontSize: 11, margin: 0, fontStyle: "italic" }}>"{y.metin}"</p>
              </div>
              <span style={{ fontSize: 10, background: "#2d0a4e", color: "#c084fc", padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0 }}>
                {y.sebep}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{ width: "100%", background: "#2563eb", border: "none", color: "#fff", fontSize: 13, fontWeight: 500, padding: 12, borderRadius: 10, cursor: "pointer" }}
        >
          Tamam
        </button>
      </div>
    </div>
  )
}

export default ReviewModal