"use client";

import { motion, type Variants } from "framer-motion";
import CountdownHero from "./CountdownHero";

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
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden px-5 md:px-8 py-20 md:py-0">

      {/* Fondo radial */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20"
        style={{ background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(255,87,34,0.08) 0%, transparent 65%)" }} />
      {/* Grid de puntos */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 opacity-25"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

      {/* ── Layout 2 columnas ── */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-center">

        {/* ── Columna izquierda — Texto ── */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-7">

          {/* Badge */}
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF5722]/30
                       bg-[#FF5722]/10 text-[#FF8A65] text-xs font-medium tracking-wide"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] animate-pulse" />
            Beta · Abre el 30 de abril · Plazas limitadas
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
                background: "linear-gradient(135deg, #FF5722 0%, #FF8A65 38%, #ffffff 72%, #e5e5e5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              El scouting de élite
              <br />ya no es un privilegio.
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            animate="visible"
            className="max-w-md text-base sm:text-lg text-[#EDEDED]/50 leading-relaxed"
          >
            GmSportStudio pone el análisis profesional en tu laptop.
            Telestración, scouting y corte de clips en segundos —
            a un precio que cualquier entrenador puede permitirse.
          </motion.p>

          {/* CTA con pulso magnético */}
          <motion.div
            variants={fadeUp(0.3)}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center lg:items-start gap-3 w-full sm:w-auto"
          >
            <div className="relative">
              {/* Anillo de pulso */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-[8px] bg-[#FF5722]/30"
                animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-[8px] bg-[#FF5722]/18"
                animate={{ scale: [1, 1.36, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />

              <motion.a
                href="https://forms.gle/Kfj3TwAeuJe88Bc28"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="relative inline-flex items-center justify-center gap-2.5
                           w-full sm:w-auto px-8 py-3.5
                           text-white font-semibold text-base cursor-pointer
                           bg-[#FF5722] hover:bg-[#E64A19]
                           border border-[rgba(255,87,34,0.55)]
                           shadow-[0_1px_4px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,87,34,0.2)]
                           hover:shadow-[0_0_0_1px_rgba(255,87,34,0.5),0_6px_24px_rgba(255,87,34,0.35)]
                           transition-all duration-150"
                style={{ borderRadius: "8px" }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 1.5L10.5 6.5H15L11 9.5L12.5 14.5L8 11.5L3.5 14.5L5 9.5L1 6.5H5.5L8 1.5Z"
                    fill="currentColor" fillOpacity="0.95" />
                </svg>
                Reservar mi plaza · 9,99€
              </motion.a>
            </div>
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
                  fill="#FF5722" fillOpacity="0.6" />
              </svg>
              Beta 9,99€
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span>Lanza 30 abril</span>
            <span className="w-px h-3 bg-white/10" />
            <span>Mac &amp; Windows</span>
          </motion.div>
        </div>

        {/* ── Columna derecha — Vídeo demo ── */}
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
                background: "radial-gradient(ellipse at 50% 50%, rgba(255,87,34,0.30) 0%, rgba(255,87,34,0.08) 45%, transparent 70%)",
                filter: "blur(36px)",
              }}
            />

            {/* Contenedor del vídeo — estética high-end */}
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

              {/* Vídeo */}
              <video
                src="/frontend-web.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto block"
              />

              {/* Máscara degradado inferior */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none z-10"
                style={{
                  background: "linear-gradient(to bottom, transparent 0%, rgba(17,17,17,0.65) 60%, rgba(17,17,17,0.97) 100%)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
