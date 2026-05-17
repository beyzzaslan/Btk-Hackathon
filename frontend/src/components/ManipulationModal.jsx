function IconUrgency() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="8" y1="4.5" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="8" x2="10.5" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="8" cy="11.5" r="0.7" fill="currentColor"/>
    </svg>
  )
}

function IconLoss() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 2C4.7 2 2 4.7 2 8s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5.5 8.5l2 2 3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconTimer() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="8" y1="9" x2="8" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="8" y1="9" x2="10" y2="10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="6" y1="1.5" x2="10" y2="1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="8" y1="1.5" x2="8" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function IconSocial() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1.5 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="11.5" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M13.5 11.5c0-1.5-1-2.5-2-2.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function IconTrend() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <polyline points="2,12 6,7 9,10 14,3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="11,3 14,3 14,6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ManipulationModal({ pills, onClose }) {
  const teknikler = {
    "Son 2 ürün kaldı!": {
      SvgIcon: IconUrgency,
      baslik: "Yapay Aciliyet",
      aciklama: '"Son 2 ürün kaldı!" yazıyor ama sayfa yenilenince hâlâ 2 ürün görünüyor. Bu yapay kıtlık hissi yaratmak için kullanılan bir tekniktir.',
      color: "#f97316"
    },
    "Fırsatı kaçırma": {
      SvgIcon: IconLoss,
      baslik: "Kayıp Kaçınımı Dili",
      aciklama: '"Bu fırsatı kaçırma!" ifadesi, kayıp korkusu yaratarak aceleyle karar verdirmeye çalışan psikolojik bir baskı tekniğidir.',
      color: "#a855f7"
    },
    "Sahte sayaç": {
      SvgIcon: IconTimer,
      baslik: "Sahte Geri Sayım",
      aciklama: "Sayfa yenilenince sayaç sıfırlanıyor. Gerçek bir süre sınırı değil, yapay baskı oluşturmak için konulmuş.",
      color: "#ef4444"
    },
    "Şu an 38 kişi bakıyor": {
      SvgIcon: IconSocial,
      baslik: "Sosyal Kanıt Manipülasyonu",
      aciklama: "Kaç kişinin baktığı bilgisi çoğunlukla rastgele üretilir ve doğrulanamaz.",
      color: "#06b6d4"
    },
    "Fiyatlar artıyor": {
      SvgIcon: IconTrend,
      baslik: "Çerçeveleme Hilesi",
      aciklama: '"Fiyatlar artıyor" uyarısı kanıtlanmadan verilen bir iddia. Kullanıcıyı aceleyle satın almaya yönlendiriyor.',
      color: "#eab308"
    }
  }

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
          width: "100%", maxWidth: 520,
          maxHeight: "85vh", overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)"
        }}
      >
        {/* Başlık */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-secondary)"
            }}>
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                <line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="10.8" r="0.8" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <p style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
                Manipülasyon teknikleri
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>
                {pills.length} teknik tespit edildi
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 9,
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            color: "var(--text-muted)", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>×</button>
        </div>

        {/* Teknikler */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pills.map((pill) => {
            const teknik = teknikler[pill]
            if (!teknik) return (
              <div key={pill} style={{
                background: "var(--bg-secondary)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "14px 16px"
              }}>
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{pill}</span>
              </div>
            )
            const { SvgIcon } = teknik
            return (
              <div key={pill} style={{
                background: "var(--bg-secondary)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "14px 16px",
                position: "relative", overflow: "hidden"
              }}>
                {/* Sol accent çizgi */}
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                  background: `linear-gradient(to bottom, ${teknik.color}, ${teknik.color}55)`,
                  borderRadius: "12px 0 0 12px"
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `${teknik.color}12`,
                    border: `1px solid ${teknik.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: teknik.color, flexShrink: 0
                  }}>
                    <SvgIcon />
                  </div>
                  <span style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
                    {teknik.baslik}
                  </span>
                  <span style={{
                    marginLeft: "auto", fontSize: 10,
                    background: `${teknik.color}12`, color: teknik.color,
                    border: `1px solid ${teknik.color}25`,
                    padding: "2px 8px", borderRadius: 20, flexShrink: 0
                  }}>
                    {pill}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.65, margin: 0 }}>
                  {teknik.aciklama}
                </p>
              </div>
            )
          })}
        </div>

        {/* Buton */}
        <button
          onClick={onClose}
          style={{
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

export default ManipulationModal