"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const EASE = [0.22, 1, 0.36, 1] as const;

/* La Beta se lanzó el 28 de abril de 2026. Este componente sigue
 * llamándose CountdownHero por compatibilidad con el resto del HeroSection
 * pero ahora pinta un badge estático "Beta lanzada · Plazas aún disponibles"
 * en lugar de la cuenta atrás. Cuando la Beta cierre, basta con cambiar el
 * copy en messages/{locale}.json y/o esconder el componente desde el padre. */
export default function CountdownHero() {
  const t = useTranslations("CountdownHero");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.55, ease: EASE }}
      className="flex flex-col gap-1.5"
      role="status"
      aria-label={t("ariaLabel")}
    >
      <div
        className="flex flex-wrap items-center gap-2 sm:gap-3 px-3 py-2.5
                   rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/8
                   backdrop-blur-sm w-fit"
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 12px rgba(0,0,0,0.25)",
        }}
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]" />
          </span>
          <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            {t("labelLaunched")}
          </span>
        </span>
        <span className="text-[#FF5722]/70 select-none" aria-hidden="true">·</span>
        <span className="text-xs sm:text-sm font-medium text-[#EDEDED]/85">
          {t("labelAvailable")}
        </span>
        <span className="text-[#FF5722]/70 select-none" aria-hidden="true">·</span>
        <span className="text-xs sm:text-sm font-medium text-[#FF8A65]">
          {t("labelSamePrice")}
        </span>
      </div>
    </motion.div>
  );
}
