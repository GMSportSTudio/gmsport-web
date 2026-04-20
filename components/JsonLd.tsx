export default function JsonLd() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GmSportStudio",
    applicationCategory: "SportsApplication",
    operatingSystem: "macOS, Windows",
    url: "https://www.gmsportstudio.com",
    description:
      "Software de vídeo análisis deportivo con telestración, scouting y corte de clips. Planes mensuales, anuales y paquetes de licencias para clubes y academias deportivas.",
    offers: [
      {
        "@type": "Offer",
        name: "Pase Fundador Beta",
        price: "9.99",
        priceCurrency: "EUR",
        priceValidUntil: "2026-04-29",
        availability: "https://schema.org/PreOrder",
      },
      {
        "@type": "Offer",
        name: "Plan Mensual",
        price: "15.00",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
      },
      {
        "@type": "Offer",
        name: "Plan Anual",
        price: "99.00",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
      },
      {
        "@type": "Offer",
        name: "Plan Club (5 cuentas)",
        price: "299.00",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
      },
    ],
    creator: {
      "@type": "Organization",
      name: "GmSportStudio",
      url: "https://www.gmsportstudio.com",
    },
    keywords:
      "video análisis baloncesto, scouting basket, telestración baloncesto, software entrenadores deportivos, análisis táctico fútbol",
    featureList: [
      "Telestrador dinámico en tiempo real",
      "Integración nativa con YouTube",
      "Corte de clips ultrarrápido",
      "Base de datos local offline",
      "Compatible con macOS y Windows",
    ],
  };

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "GmSportStudio — Demo de telestración y análisis táctico",
    description:
      "Demostración del flujo de trabajo de videoanálisis en GmSportStudio: telestración en tiempo real, scouting y corte de clips.",
    thumbnailUrl: "https://www.gmsportstudio.com/opengraph-image",
    uploadDate: "2026-04-19",
    contentUrl: "https://www.gmsportstudio.com/frontend-web.mp4",
    duration: "PT24S",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
    </>
  );
}
