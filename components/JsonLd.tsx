export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GmSportStudio",
    applicationCategory: "SportsApplication",
    operatingSystem: "macOS, Windows",
    url: "https://www.gmsportstudio.com",
    description:
      "Software de vídeo análisis deportivo con telestración, scouting y corte de clips. Alternativa low cost a Hudl y Nacsport para entrenadores de baloncesto y fútbol.",
    offers: {
      "@type": "Offer",
      price: "99",
      priceCurrency: "EUR",
      availability: "https://schema.org/LimitedAvailability",
      description: "Acceso Founder vitalicio — Beta",
    },
    creator: {
      "@type": "Organization",
      name: "GmSportStudio",
      url: "https://www.gmsportstudio.com",
    },
    keywords:
      "video análisis baloncesto, scouting basket, telestración baloncesto, alternativa Hudl, alternativa Nacsport",
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
