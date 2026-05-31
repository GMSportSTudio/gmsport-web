import { getTranslations } from "next-intl/server";

const BASE_URL = "https://www.inboundbasketballstudio.com";

/**
 * JSON-LD estructurado por locale. Server component: extrae las claves
 * del namespace "JsonLd" en messages/{locale}.json y genera los objetos
 * SoftwareApplication + VideoObject con el texto correcto.
 *
 * Modelo comercial post-Beta (a partir del 17/05/2026):
 *   - Individual Mensual 14,99 €/mes (InStock)
 *   - Individual Anual    99 €/año   (InStock)
 *   - Pro Club            299 €/año  (InStock, 5 cuentas)
 *
 * El Pase Fundador 9,99 € se retiró el 17/05/2026; los 64 founders ya
 * marcados conservan su derecho al 50 % lifetime mediante link firmado
 * (enviado por email el 25/05). Ese flujo NO se expone como Offer en
 * schema.org porque no es comprable públicamente.
 */
export default async function JsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "JsonLd" });

  const url = locale === "es" ? BASE_URL : `${BASE_URL}/${locale}`;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Inbound Studio",
    applicationCategory: "SportsApplication",
    operatingSystem: "macOS, Windows",
    url,
    inLanguage: locale,
    description: t("appDescription"),
    offers: [
      {
        "@type": "Offer",
        name: t("offers.monthly"),
        price: "14.99",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: "https://gmsportstudio.gumroad.com/l/gms-mensual",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "14.99",
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
        availability: "https://schema.org/InStock",
        url: "https://gmsportstudio.gumroad.com/l/gms-anual",
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
        name: t("offers.club"),
        price: "299",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: "mailto:clubes@gmsportstudio.com",
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
      name: "Inbound Studio",
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
