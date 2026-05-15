function IconCalendar() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="5" y1="1.5" x2="5" y2="4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="11" y1="1.5" x2="11" y2="4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="1.5" y1="7" x2="14.5" y2="7" stroke="currentColor" strokeWidth="1.1"/>
    </svg>
  )
}

function IconBot() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="5" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="5.5" cy="9.5" r="1.2" fill="currentColor" opacity="0.8"/>
      <circle cx="10.5" cy="9.5" r="1.2" fill="currentColor" opacity="0.8"/>
      <line x1="8" y1="1.5" x2="8" y2="5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="8" cy="1.5" r="1" fill="currentColor"/>
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 2l1.8 3.6 4 .6-2.9 2.8.7 3.9-3.6-1.9-3.6 1.9.7-3.9-2.9-2.8 4-.6L8 2z"
        stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"/>
    </svg>
  )
}

function StarRow({ count = 5 }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1l1.3 2.7 3 .4-2.2 2.1.5 3L6 7.8 3.4 9.2l.5-3L1.7 4.1l3-.4L6 1z"
            fill={i < count ? "#fbbf24" : "var(--border)"}
            stroke={i < count ? "#f59e0b" : "transparent"}
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  )
}

function ReviewModal({ module, onClose }) {
  const suphelijorumlar = [
    { puan: 5, metin: "Harika ürün, kesinlikle alın!", sebep: "Jenerik" },
    { puan: 5, metin: "Çok memnun kaldım, herkese tavsiye ederim.", sebep: "Jenerik" },
    { puan: 5, metin: "İnanılmaz kalite, beklentilerimin üzerinde!", sebep: "Aşırı pozitif" },
    { puan: 5, metin: "Mükemmel, çok beğendim teşekkürler.", sebep: "Jenerik" },
  ]

  const pillAciklamalari = {
    "Aynı gün 15 yorum": {
      SvgIcon: IconCalendar,
      baslik: "Anormal yorum kümelenmesi",
      aciklama: "Tek bir günde 15 yorum gelmiş. Gerçek kullanıcılar bu hızda yorum bırakmaz — bot aktivitesi veya teşvikli yorum olabilir.",
    },
    "Aşırı jenerik dil": {
      SvgIcon: IconBot,
      baslik: "Botik dil örüntüsü",
      aciklama: '"Harika!", "Kesinlikle alın!" gibi kalıp ifadeler yoğun. Gerçek yorumlar genelde spesifik deneyim içerir.',
    },
    "%97 beş yıldız": {
      SvgIcon: IconStar,
      baslik: "Anormal yıldız dağılımı",
      aciklama: "Yorumların %97'si 5 yıldız. Gerçek ürünlerde bu oran genelde %60–80 arasındadır.",
    }
  }

  const pills = module.pills || []
  const toplam = 48
  const supheli = 31
  const oran = Math.round((supheli / toplam) * 100)

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 20
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 22, padding: "28px 28px 24px",
          width: "100%", maxWidth: 580,
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)"
        }}
      >
        {/* Başlık */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-secondary)"
            }}>
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H9l-3 2v-2H3a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.3"/>
                <line x1="4.5" y1="5.5" x2="11.5" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="4.5" y1="8" x2="8" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p style={{ color: "var(--text-primary)", fontSize: 16, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
                Yorum analizi
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>
                {toplam} yorum incelendi
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 9,
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            color: "var(--text-muted)", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s"
          }}>×</button>
        </div>

        {/* Özet */}
        <div style={{
          background: "var(--bg-secondary)", border: "1px solid var(--border)",
          borderRadius: 14, padding: "18px 20px", marginBottom: 24,
          display: "flex", alignItems: "center", gap: 20
        }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <p style={{
              color: "#60a5fa", fontSize: 38, fontWeight: 700, lineHeight: 1,
              fontFamily: "'Instrument Serif', serif", letterSpacing: "-0.02em"
            }}>
              {oran}%
            </p>
            <p style={{ color: "#60a5fa", fontSize: 10, marginTop: 4, opacity: 0.8, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              şüpheli
            </p>
          </div>
          <div style={{ width: 1, height: 48, background: "var(--border)" }} />
          <div style={{ flex: 1 }}>
            <p style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 500, marginBottom: 5, fontFamily: "'DM Sans', sans-serif" }}>
              {supheli} / {toplam} yorum anormal örüntü gösteriyor
            </p>
            {/* Progress bar */}
            <div style={{ height: 5, background: "var(--border)", borderRadius: 99, overflow: "hidden", marginBottom: 5 }}>
              <div style={{
                height: 5, width: `${oran}%`,
                background: "linear-gradient(to right, #60a5fa, #818cf8)",
                borderRadius: 99, transition: "width 1s ease"
              }} />
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 11 }}>
              Gerçek kullanıcı deneyimi yansıtmıyor olabilir.
            </p>
          </div>
        </div>

        {/* Tespit edilen örüntüler */}
        <p style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Tespit edilen örüntüler
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {pills.map((pill, idx) => {
            const bilgi = pillAciklamalari[pill]
            if (!bilgi) return null
            const { SvgIcon } = bilgi
            return (
              <div key={pill} style={{
                background: "var(--bg-secondary)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "14px 16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--text-secondary)", flexShrink: 0
                  }}>
                    <SvgIcon />
                  </div>
                  <span style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500, flex: 1, fontFamily: "'DM Sans', sans-serif" }}>
                    {bilgi.baslik}
                  </span>
                  <span style={{
                    fontSize: 10, background: "var(--bg-card)",
                    color: "var(--text-secondary)", border: "1px solid var(--border)",
                    padding: "3px 10px", borderRadius: 20, flexShrink: 0
                  }}>
                    {pill}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.65, margin: 0 }}>
                  {bilgi.aciklama}
                </p>
              </div>
            )
          })}
        </div>

        {/* Şüpheli yorumlar */}
        <p style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Şüpheli yorum örnekleri
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
          {suphelijorumlar.map((y, i) => (
            <div key={i} style={{
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "12px 16px",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <StarRow count={y.puan} />
                <p style={{
                  color: "var(--text-secondary)", fontSize: 12, marginTop: 6,
                  fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>
                  "{y.metin}"
                </p>
              </div>
              <span style={{
                fontSize: 10, background: "var(--bg-card)",
                color: "var(--text-muted)", border: "1px solid var(--border)",
                padding: "3px 10px", borderRadius: 20,
                whiteSpace: "nowrap", flexShrink: 0
              }}>
                {y.sebep}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%", background: "var(--bg-secondary)",
            border: "1px solid var(--border)", color: "var(--text-primary)",
            fontSize: 13, fontWeight: 500, padding: 13, borderRadius: 12,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.2s"
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

export default ReviewModal