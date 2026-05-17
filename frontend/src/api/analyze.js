// src/api/analyze.js

// Canlı analize geçmek için MOCK_MODE'u false yapıyoruz Furkan!
const MOCK_MODE = false;

const mockResult = {
  score: 80,
  label: "Dikkatli Ol",
  summary: "Bu sitede dikkat edilmesi gereken noktalar tespit edildi.",
  modules: [
    {
      icon: "💬",
      title: "Yorum analizi",
      text: "48 yorumdan 31'i şüpheli bulundu.",
      badge: "Şüpheli",
      badgeType: "warn",
      pills: ["Aynı gün 15 yorum", "Aşırı jenerik dil", "%97 beş yıldız"]
    },
    {
      icon: "🏷️",
      title: "Sahte indirim",
      text: "4.999₺ → 299₺ iddiası doğrulanamadı.",
      badge: "Yüksek risk",
      badgeType: "danger",
      pills: ["Sayaç sıfırlanıyor", "Referans fiyat yok"]
    }
  ],
  bars: [
    { label: "Yorum kalitesi", value: 48 },
    { label: "İndirim gerçekliği", value: 60 },
    { label: "Manipülasyon", value: 55 },
    { label: "Alan adı", value: 30 }
  ]
};

export async function analyzeUrl(url) {
  try {
    new URL(url);
  } catch {
    throw new Error("Geçersiz URL formatı.");
  }

  const hostname = new URL(url).hostname;

  const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  if (!domainRegex.test(hostname)) {
    throw new Error("Geçersiz URL. Lütfen gerçek bir site adresi girin.");
  }

  const blocked = ["localhost", "127.0.0.1", "example.com", "orneksite.com"];
  if (blocked.some((b) => hostname.includes(b))) {
    throw new Error("Bu URL analiz edilemiyor.");
  }

  if (MOCK_MODE) {
    await new Promise((res) => setTimeout(res, 2000));
    return mockResult;
  }

  // Ezgi'nin paralel router mimarisi: http://localhost:8000/api/scan
  const response = await fetch("http://localhost:8000/api/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Hatalı olan 'inputUrl' kısmını parametreden gelen 'url' ile düzelttim:
    body: JSON.stringify({ url: url }) 
  });

  if (!response.ok) {
    throw new Error("Analiz sırasında bir hata oluştu.");
  }

  const data = await response.json();
  // Backend'den gelen gerçek zekayı React ekranına fırlatıyoruz:
  return data; 
}

export function saveToHistory(url, result) {
  const history = getHistory();
  const newItem = {
    id: Date.now(),
    url,
    score: result.score,
    label: result.label,
    summary: result.summary,
    date: new Date().toLocaleDateString("tr-TR")
  };
  const updated = [newItem, ...history].slice(0, 50);
  localStorage.setItem("trustlens_history", JSON.stringify(updated));
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("trustlens_history")) || [];
  } catch {
    return [];
  }
}