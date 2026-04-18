import HeroSection     from "@/components/HeroSection";
import WhySection      from "@/components/WhySection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection  from "@/components/PricingSection";
import FaqSection      from "@/components/FaqSection";
import Footer          from "@/components/Footer";
import JsonLd          from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <JsonLd />
      <HeroSection />
      <WhySection />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </>
  );
}
