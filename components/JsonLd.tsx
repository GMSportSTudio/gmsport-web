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
        availability: "https://schema.org/InStock",
        // Cap del Pase Fundador. Mantener sincronizado con la fecha de fin
        // de la oferta Beta (ver TesterRow / CancelarClient).
        priceValidUntil: "2026-07-31",
        url: "https://www.gmsportstudio.com/",
        category: "Limited Edition",
        eligibleQuantity: { "@type": "QuantitativeValue", value: 1, unitText: "usuario" },
      },
      {
        "@type": "Offer",
        name: t("offers.monthly"),
        price: "15",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "15",
          priceCurrency: "EUR",
          billingDuration: "P1M",
          billingIncrement: 1,
        },
        eligibleQuantity: { "@type": "QuantitativeValue", value: 1, unitText: "usuario" },
      },
      {
        "@type": "Offer",
        name: t("offers.yearly"),
        price: "99",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "99",
          priceCurrency: "EUR",
          billingDuration: "P1Y",
          billingIncrement: 1,
        },
        eligibleQuantity: { "@type": "QuantitativeValue", value: 1, unitText: "usuario" },
      },
      {
        "@type": "Offer",
        name: t("offers.clubMonthly"),
        price: "40",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "40",
          priceCurrency: "EUR",
          billingDuration: "P1M",
          billingIncrement: 1,
        },
        eligibleQuantity: { "@type": "QuantitativeValue", value: 5, unitText: "usuarios" },
      },
      {
        "@type": "Offer",
        name: t("offers.club"),
        price: "299",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "299",
          priceCurrency: "EUR",
          billingDuration: "P1Y",
          billingIncrement: 1,
        },
        eligibleQuantity: { "@type": "QuantitativeValue", value: 5, unitText: "usuarios" },
      },
    ],
    creator: {
      "@type": "Organization",
      name: "GmSportStudio",
      url: BASE_URL,
    },
    keywords: t("keywords"),
    featureList: [
      t("features.buttonBoard"),
      t("features.multiMatch"),
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

  // Escapar `</` para que un valor con "</script>" no rompa el HTML.
  const safeStringify = (obj: unknown) =>
    JSON.stringify(obj).replace(/<\//g, "<\\/");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeStringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeStringify(videoSchema) }}
      />
    </>
  );
}
