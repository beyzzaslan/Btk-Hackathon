function ManipulationModal({ pills, onClose }) {
  const teknikler = {
    "Son 2 ürün kaldı!": {
      icon: "🚨",
      baslik: "Yapay Aciliyet",
      aciklama: '"Son 2 ürün kaldı!" yazıyor ama sayfa yenilenince hâlâ 2 ürün görünüyor. Bu yapay kıtlık hissi yaratmak için kullanılan bir tekniktir.'
    },
    "Fırsatı kaçırma": {
      icon: "😰",
      baslik: "Kayıp Kaçınımı Dili",
      aciklama: '"Bu fırsatı kaçırma!" ifadesi, kayıp korkusu yaratarak aceleyle karar verdirmeye çalışan psikolojik bir baskı tekniğidir.'
    },
    "Sahte sayaç": {
      icon: "⏱️",
      baslik: "Sahte Geri Sayım",
      aciklama: "Sayfa yenilenince sayaç sıfırlanıyor. Gerçek bir süre sınırı değil, yapay baskı oluşturmak için konulmuş."
    },
    "Şu an 38 kişi bakıyor": {
      icon: "👁️",
      baslik: "Sosyal Kanıt Manipülasyonu",
      aciklama: "Kaç kişinin baktığı bilgisi çoğunlukla rastgele üretilir ve doğrulanamaz."
    },
    "Fiyatlar artıyor": {
      icon: "📈",
      baslik: "Çerçeveleme Hilesi",
      aciklama: '"Fiyatlar artıyor" uyarısı kanıtlanmadan verilen bir iddia. Kullanıcıyı aceleyle satın almaya yönlendiriyor.'
    }
  }

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
          maxHeight: "80vh",
          overflowY: "auto"
        }}
      >
        {/* Başlık */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 600 }}>
            🧠 Manipülasyon analizi
          </span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Teknikler */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pills.map((pill) => {
            const teknik = teknikler[pill]
            if (!teknik) return (
              <div key={pill} style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{pill}</span>
              </div>
            )
            return (
              <div key={pill} style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{teknik.icon}</span>
                  <span style={{ color: "var(--text-primary)", fontSize: 12, fontWeight: 500 }}>{teknik.baslik}</span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                  {teknik.aciklama}
                </p>
              </div>
            )
          })}
        </div>

        {/* Alt buton */}
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

export default ManipulationModal