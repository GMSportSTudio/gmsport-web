"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import CountdownHero from "./CountdownHero";
import TrialForm from "./TrialForm";
import { useTranslations } from "next-intl";

/* ─── Animaciones ─────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0): Variants => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: EASE } },
});

const floatAnim = {
  y: [0, -14, 0],
  transition: {
    duration: 5.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

/* ─── Hero Section ────────────────────────────────────────────── */
export default function HeroSection() {
  const t = useTranslations("HeroSection");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden px-5 md:px-8 py-20 md:py-0">

      {/* Fondo radial */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20"
        style={{ background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(34,255,224,0.08) 0%, transparent 65%)" }} />
      {/* Grid de puntos */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 opacity-25"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

      {/* Layout 2 columnas */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-center">

        {/* Columna izquierda — Texto */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-7">

          {/* Badge */}
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#22FFE0]/30
                       bg-[#22FFE0]/10 text-[#5FFFE8] text-xs font-medium tracking-wide"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22FFE0] animate-pulse" />
            {t("badge")}
          </motion.div>

          {/* Countdown hasta el lanzamiento */}
          <CountdownHero />

          {/* Titular con degradado naranja → blanco */}
          <motion.h1
            variants={fadeUp(0.1)}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.06] tracking-tight"
          >
            <span
              style={{
                background: "linear-gradient(135deg, #22FFE0 0%, #5FFFE8 38%, #ffffff 72%, #e5e5e5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("titleLine1")}
              <br />{t("titleLine2")}
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            animate="visible"
            className="max-w-md text-base sm:text-lg text-[#EDEDED]/50 leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTA principal — el formulario de prueba, aquí mismo.
              Antes esto era un botón a "#precios": mandaba a la cifra a
              alguien que todavía no ha probado nada. Ahora la primera acción
              posible es empezar los 14 días, sin scroll y sin un clic
              intermedio. El enlace a precios queda debajo para quien ya viene
              decidido. */}
          <motion.div
            variants={fadeUp(0.3)}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center lg:items-start gap-3 w-full"
          >
            <div className="relative w-full max-w-md">
              {/* Halo de atención detrás del formulario */}
              <motion.span
                aria-hidden="true"
                className="absolute -inset-2 rounded-2xl bg-[#22FFE0]/12 blur-xl pointer-events-none"
                animate={{ opacity: [0.45, 0.2, 0.45] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative">
                <TrialForm compacto />
              </div>
            </div>

            <p className="text-xs text-[#EDEDED]/35">
              Sin tarjeta · Sin permanencia ·{" "}
              <a href="#precios" className="underline underline-offset-2 hover:text-[#22FFE0]/80">
                ver precios
              </a>
            </p>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={fadeUp(0.4)}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4 text-xs text-[#EDEDED]/25"
          >
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1L7.5 4.5H11L8.5 6.5L9.5 10L6 8L2.5 10L3.5 6.5L1 4.5H4.5L6 1Z"
                  fill="#22FFE0" fillOpacity="0.6" />
              </svg>
              {t("socialProofPrice")}
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span>{t("socialProofLaunch")}</span>
            <span className="w-px h-3 bg-white/10" />
            <span>{t("socialProofPlatform")}</span>
          </motion.div>
        </div>

        {/* Columna derecha — la app de verdad.
            Hasta 2026-08-09 aquí había un vídeo de la 1.3.x. Se quitó al
            pasar la 2.0 a ser el único producto: enseñar la versión que ya
            no vendemos confunde y envejece la página. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 30 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          className="w-full flex justify-center"
        >
          <motion.div
            animate={floatAnim}
            className="relative w-full max-w-2xl"
          >
            {/* Glow naranja ambiental detrás */}
            <div
              aria-hidden="true"
              className="absolute inset-x-[8%] top-[10%] bottom-[-8%] -z-10 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(34,255,224,0.30) 0%, rgba(34,255,224,0.08) 45%, transparent 70%)",
                filter: "blur(36px)",
              }}
            />

            {/* Contenedor de la captura — estética high-end */}
            <div
              className="relative w-full overflow-hidden rounded-2xl border border-white/10"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.06) inset, " +
                  "0 32px 80px rgba(0,0,0,0.75), " +
                  "0 8px 24px rgba(0,0,0,0.5)",
              }}
            >
              {/* Línea reflejo superior */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px z-10 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.14) 50%, transparent 90%)",
                }}
              />

              {/* La app etiquetando un partido real.
                  `priority` porque es la imagen principal del hero: sin esto
                  Next la carga en diferido y el primer vistazo es un hueco. */}
              <Image
                src="/capturas/app-etiquetando.webp"
                alt="Inbound Studio analizando un partido: botonera de categorías,
                     descriptores, mini-cancha y línea de tiempo con los clips marcados"
                width={1800}
                height={1171}
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="w-full h-auto block"
              />

              {/* Antes había aquí una máscara que oscurecía el tercio inferior.
                  Con un vídeo daba empaque; con esta captura tapaba justo la
                  línea de tiempo con los clips marcados, que es lo que hay que
                  enseñar. Queda un velo mínimo para fundir con el fondo. */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-16 pointer-events-none z-10"
                style={{
                  background: "linear-gradient(to bottom, transparent 0%, rgba(17,17,17,0.45) 100%)",
                }}
              />
            </div>

            {/* Pie que traduce la captura a lo que le importa al entrenador */}
            <p className="mt-4 text-center text-xs text-[#EDEDED]/35">
              21 clips marcados en un partido · botonera propia · atajos de teclado
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
