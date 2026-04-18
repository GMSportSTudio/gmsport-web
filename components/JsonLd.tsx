export default function JsonLd() {
  const schema = {
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
        name: "Plan Individual Mensual",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Plan Individual Anual",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Licencias para Clubes",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
