import HeroSection     from "@/components/HeroSection";
import WhySection      from "@/components/WhySection";
import FeaturesSection from "@/components/FeaturesSection";
import PlaybookSection from "@/components/PlaybookSection";
import TrialRequestSection from "@/components/TrialRequestSection";
import PricingSection  from "@/components/PricingSection";
import FaqSection      from "@/components/FaqSection";
import Footer          from "@/components/Footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhySection />
      <FeaturesSection />
      {/* Segunda captura de la app: ya sabe que corta clips, aquí ve qué hace
          después con ellos. */}
      <PlaybookSection />
      {/* Justo ANTES de precios: ya ha visto lo que hace la herramienta y
          todavía no ha visto la cifra. Es donde una prueba gratis convierte
          mejor que un botón de compra. El formulario del hero es el primero;
          este es para quien ha bajado leyendo. */}
      <TrialRequestSection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </>
  );
}
