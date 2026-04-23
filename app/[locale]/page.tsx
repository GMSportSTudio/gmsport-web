import HeroSection     from "@/components/HeroSection";
import WhySection      from "@/components/WhySection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection  from "@/components/PricingSection";
import FaqSection      from "@/components/FaqSection";
import Footer          from "@/components/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "GMSportStudio",
  applicationCategory: "SportsApplication",
  operatingSystem: "macOS, Windows",
  description:
    "Software profesional de análisis táctico de baloncesto para entrenadores y analistas.",
  url: "https://www.gmsportstudio.com/",
  image: "https://www.gmsportstudio.com/og-image.png",
  inLanguage: ["es", "pt"],
  offers: [
    {
      "@type": "Offer",
      name: "Licencia individual mensual",
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
      name: "Licencia individual anual",
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
      name: "Licencia club 5 usuarios mensual",
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
      name: "Licencia club 5 usuarios anual",
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
  publisher: {
    "@type": "Organization",
    name: "GMSportStudio",
    url: "https://www.gmsportstudio.com/",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <WhySection />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </>
  );
}
