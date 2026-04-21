import { getTranslations } from "next-intl/server";

const BASE_URL = "https://www.gmsportstudio.com";

/**
 * JSON-LD estructurado por locale. Server component: extrae las claves
 * del namespace "JsonLd" en messages/{locale}.json y genera los objetos
 * SoftwareApplication + VideoObject con el texto correcto.
 *
 * priceValidUntil del Pase Fundador = fecha de lanzamiento de la Beta,
 * tras la cual el plan deja de estar disponible como PreOrder.
 */
export default async function JsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "JsonLd" });

  const url = locale === "es" ? BASE_URL : `${BASE_URL}/${locale}`;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GmSportStudio",
    applicationCategory: "SportsApplication",
    operatingSystem: "macOS, Windows",
    url,
    inLanguage: locale,
    description: t("appDescription"),
    offers: [
      {
        "@type": "Offer",
        name: t("offers.founder"),
        price: "9.99",
        priceCurrency: "EUR",
        priceValidUntil: "2026-04-29",
        availability: "https://schema.org/PreOrder",
      },
      {
        "@type": "Offer",
        name: t("offers.monthly"),
        price: "15.00",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
      },
      {
        "@type": "Offer",
        name: t("offers.yearly"),
        price: "99.00",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
      },
      {
        "@type": "Offer",
        name: t("offers.club"),
        price: "299.00",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
      },
    ],
    creator: {
      "@type": "Organization",
      name: "GmSportStudio",
      url: BASE_URL,
    },
    keywords: t("keywords"),
    featureList: [
      t("features.telestrator"),
      t("features.youtube"),
      t("features.clips"),
      t("features.offlineDb"),
      t("features.platforms"),
    ],
  };

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: t("video.name"),
    description: t("video.description"),
    thumbnailUrl: `${BASE_URL}/opengraph-image`,
    uploadDate: "2026-04-19T12:00:00+02:00",
    contentUrl: `${BASE_URL}/frontend-web.mp4`,
    duration: "PT24S",
    inLanguage: locale,
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
