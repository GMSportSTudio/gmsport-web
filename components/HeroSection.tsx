"use client";

import { motion, type Variants } from "framer-motion";

/* ─── Animaciones ─────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0): Variants => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: EASE } },
});

const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.94, y: 20 },
  visible: { opacity: 1, scale: 1,    y: 0,
    transition: { duration: 0.85, delay: 0.3, ease: EASE } },
};

/* ─── App Mockup (dashboard interior) ────────────────────────── */
function AppMockup() {
  return (
    <div className="w-full h-full bg-[#0d0d0d] flex flex-col overflow-hidden">

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#141414] border-b border-white/8 shrink-0">
        <span className="w-2 h-2 rounded-full bg-[#FF5722]" />
        <span className="text-[9px] text-white/40 font-medium tracking-widest uppercase">GmSportStudio</span>
        <div className="ml-auto flex gap-1.5">
          {["Análisis", "Telestración", "Export"].map((t) => (
            <span key={t} className="px-2 py-0.5 rounded text-[8px] text-white/40 bg-white/5 border border-white/8">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 relative bg-[#0a1a0f] overflow-hidden">
          <svg viewBox="0 0 480 300" className="absolute inset-0 w-full h-full opacity-70"
            preserveAspectRatio="xMidYMid meet">
            <rect width="480" height="300" fill="#0a1a0f" />
            {[0,1,2,3,4,5].map((i) => (
              <rect key={i} x={i * 80} y="0" width="40" height="300" fill="#0c1f11" />
            ))}
            <g stroke="#2a5c3a" strokeWidth="1.2" fill="none">
              <rect x="20" y="20" width="440" height="260" />
              <line x1="240" y1="20" x2="240" y2="280" />
              <circle cx="240" cy="150" r="45" />
              <circle cx="240" cy="150" r="2.5" fill="#2a5c3a" />
              <rect x="20" y="85" width="80" height="130" />
              <rect x="380" y="85" width="80" height="130" />
              <rect x="20" y="115" width="35" height="70" />
              <rect x="425" y="115" width="35" height="70" />
            </g>
            {[
              [240,150],[160,100],[160,200],[100,150],[320,80],
              [300,150],[300,220],[380,120],[380,180],[200,60],[200,240],
            ].map(([cx, cy], i) => (
              <g key={`a${i}`}>
                <circle cx={cx} cy={cy} r="9" fill="#FF5722" fillOpacity="0.9" />
                <circle cx={cx} cy={cy} r="9" stroke="#FF8A65" strokeWidth="1.5" fill="none" />
                <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">{i+1}</text>
              </g>
            ))}
            {[
              [380,150],[340,90],[340,210],[420,150],[160,80],
              [180,150],[160,220],[100,100],[100,200],[200,130],[200,170],
            ].map(([cx, cy], i) => (
              <g key={`b${i}`}>
                <circle cx={cx} cy={cy} r="9" fill="#1565C0" fillOpacity="0.9" />
                <circle cx={cx} cy={cy} r="9" stroke="#42A5F5" strokeWidth="1.5" fill="none" />
                <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">{i+1}</text>
              </g>
            ))}
            <g stroke="#FF5722" strokeWidth="2" strokeDasharray="5 3" fill="none" opacity="0.85">
              <path d="M 240 150 Q 320 100 380 120" />
              <path d="M 160 100 L 240 150" />
            </g>
            <polygon points="376,112 385,118 374,125" fill="#FF5722" opacity="0.85" />
            <circle cx="240" cy="150" r="5" fill="white" />
          </svg>

          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 border border-white/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[8px] text-white/70 font-medium">LIVE  34:12</span>
          </div>
        </div>

        {/* Panel lateral */}
        <div className="w-[90px] shrink-0 bg-[#111] border-l border-white/8 flex flex-col gap-2 p-2 overflow-hidden">
          <p className="text-[7px] text-white/30 uppercase tracking-widest mb-1">Eventos</p>
          {[
            { t: "22'", e: "Pase filtrado", c: "#FF5722" },
            { t: "28'", e: "Presión alta",  c: "#42A5F5" },
            { t: "31'", e: "Transición",    c: "#66BB6A" },
            { t: "34'", e: "Disparo",       c: "#FF5722" },
          ].map(({ t, e, c }) => (
            <div key={t} className="flex flex-col gap-0.5 p-1 rounded bg-white/5 border border-white/8">
              <span className="text-[7px] font-bold" style={{ color: c }}>{t}</span>
              <span className="text-[7px] text-white/50 leading-tight">{e}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="h-6 shrink-0 bg-[#141414] border-t border-white/8 flex items-center px-3 gap-2">
        <div className="flex-1 h-1 rounded-full bg-white/10 relative">
          <div className="absolute left-0 top-0 h-full w-[35%] rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF7043]" />
          <div className="absolute top-1/2 -translate-y-1/2 left-[35%] w-2 h-2 rounded-full bg-white border border-[#FF5722] -translate-x-1/2" />
        </div>
        <span className="text-[7px] text-white/30 shrink-0">90:00</span>
      </div>
    </div>
  );
}

/* ─── MacBook Frame ───────────────────────────────────────────── */
function MacBookFrame() {
  return (
    <div className="relative w-full select-none">
      {/* Glow naranja */}
      <div
        aria-hidden="true"
        className="absolute inset-x-[5%] top-[20%] bottom-[-8%] -z-10"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(255,87,34,0.32) 0%, rgba(255,87,34,0.1) 45%, transparent 70%)",
          filter: "blur(36px)",
        }}
      />

      {/* Cuerpo */}
      <div
        className="relative rounded-t-xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #2e2e2e 0%, #1a1a1a 100%)",
          padding: "10px 10px 0",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.09), 0 40px 100px rgba(0,0,0,0.75)",
        }}
      >
        <div className="flex items-center justify-center h-5 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#333] border border-[#444]" />
        </div>
        <div className="rounded-t-sm overflow-hidden aspect-[16/10]">
          <AppMockup />
        </div>
      </div>

      {/* Base */}
      <div className="h-[14px] rounded-b-sm mx-[2px]"
        style={{ background: "linear-gradient(to bottom, #1a1a1a, #252525)", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }} />
      <div className="flex justify-center">
        <div className="h-[6px] w-[52%] rounded-b-xl"
          style={{ background: "linear-gradient(to bottom, #252525, #1c1c1c)", boxShadow: "0 6px 20px rgba(0,0,0,0.4)" }} />
      </div>
    </div>
  );
}

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
            Beta Founder — plazas limitadas
          </motion.div>

          {/* Titular — dos líneas con intención */}
          <motion.h1
            variants={fadeUp(0.1)}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.06] tracking-tight"
          >
            <span
              style={{
                background: "linear-gradient(135deg, #FF5722 0%, #FF8A65 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Deja de perder horas
              <br />editando.
            </span>
            <br />
            <span
              style={{
                background: "linear-gradient(160deg, #ffffff 40%, #9ca3af 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Empieza a ganar
              <br />partidos analizando.
            </span>
          </motion.h1>

          {/* Subtítulo orientado al dolor */}
          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            animate="visible"
            className="max-w-md text-base sm:text-lg text-[#EDEDED]/50 leading-relaxed"
          >
            GmSportStudio pone el análisis de élite en tu laptop.
            Telestración, scouting y corte de clips en segundos —
            sin suscripciones de miles de euros.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp(0.3)}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center lg:items-start gap-3 w-full sm:w-auto"
          >
            {/* Botón principal */}
            <motion.a
              href="https://forms.gle/3KAVe45PeSpJMy8g6"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="relative inline-flex items-center justify-center gap-2.5
                         w-full sm:w-auto px-8 py-4 rounded-xl
                         text-white font-bold text-base cursor-pointer
                         bg-gradient-to-r from-[#FF5722] to-[#FF7043]
                         shadow-[0_0_0_1px_rgba(255,87,34,0.4),0_6px_28px_rgba(255,87,34,0.45)]
                         hover:shadow-[0_0_0_1px_rgba(255,87,34,0.6),0_8px_40px_rgba(255,87,34,0.6)]
                         transition-shadow duration-300"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1.5L10.5 6.5H15L11 9.5L12.5 14.5L8 11.5L3.5 14.5L5 9.5L1 6.5H5.5L8 1.5Z"
                  fill="currentColor" fillOpacity="0.95" />
              </svg>
              Únete a la Beta
            </motion.a>
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
              Sin suscripción
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span>Mac &amp; Windows</span>
            <span className="w-px h-3 bg-white/10" />
            <span>Garantía 30 días</span>
          </motion.div>
        </div>

        {/* ── Columna derecha — Dashboard protagonista ── */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="w-full lg:translate-y-4"
        >
          <MacBookFrame />
        </motion.div>
      </div>
    </section>
  );
}
