"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

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

/* ─── Mini contador para el Dashboard ────────────────────────── */
function AnimatedStat({ target, decimals = 0, delay = 0 }: { target: number; decimals?: number; delay?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const duration = 1200;
      let start: number | null = null;
      const tick = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(parseFloat((eased * target).toFixed(decimals)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 900 + delay); // espera que el MacBook aparezca
    return () => clearTimeout(t);
  }, [target, delay, decimals]);
  return <>{decimals > 0 ? val.toFixed(decimals) : Math.round(val)}</>;
}

/* ─── App Dashboard Mockup ────────────────────────────────────── */
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

          {/* Stats overlay con contadores animados */}
          <div className="absolute bottom-2 left-2 flex gap-2">
            <div className="px-2 py-1 rounded bg-black/70 border border-white/10 backdrop-blur-sm">
              <span className="block text-[10px] font-black text-white stat-num">
                <AnimatedStat target={142} delay={0} />
              </span>
              <span className="block text-[7px] text-white/40 uppercase tracking-wider">Pases</span>
            </div>
            <div className="px-2 py-1 rounded bg-black/70 border border-white/10 backdrop-blur-sm">
              <span className="block text-[10px] font-black text-white stat-num">
                <AnimatedStat target={2.4} decimals={1} delay={200} />
              </span>
              <span className="block text-[7px] text-white/40 uppercase tracking-wider">xG</span>
            </div>
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

/* ─── MacBook Frame realista y flotante ───────────────────────── */
function MacBookFrame() {
  return (
    <div className="relative w-full select-none">

      {/* Sombra proyectada — realista */}
      <div
        aria-hidden="true"
        className="absolute left-[10%] right-[10%] bottom-[-6%] h-[60px] -z-10"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.75) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Glow naranja ambiental detrás */}
      <div
        aria-hidden="true"
        className="absolute inset-x-[8%] top-[15%] bottom-[-5%] -z-10"
        style={{
          background: "radial-gradient(ellipse at 50% 45%, rgba(255,87,34,0.28) 0%, rgba(255,87,34,0.08) 45%, transparent 70%)",
          filter: "blur(32px)",
        }}
      />

      {/* Cuerpo del MacBook */}
      <div
        className="relative rounded-t-[14px] overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #3a3a3a 0%, #1e1e1e 40%, #141414 100%)",
          padding: "12px 12px 0",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), " +
            "0 2px 0 0 rgba(255,255,255,0.04) inset, " +
            "0 -2px 0 0 rgba(0,0,0,0.6) inset, " +
            "0 50px 120px rgba(0,0,0,0.8)",
        }}
      >
        {/* Notch / cámara */}
        <div className="flex items-center justify-center h-5 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#333]" />
            <div
              className="w-2 h-2 rounded-full border border-[#3a3a3a]"
              style={{ background: "radial-gradient(circle at 35% 35%, #555, #222)" }}
            />
            <div className="w-1 h-1 rounded-full bg-[#333]" />
          </div>
        </div>

        {/* Pantalla — bisel oscuro + contenido */}
        <div
          className="rounded-t-sm overflow-hidden aspect-[16/10]"
          style={{
            boxShadow: "0 0 0 1.5px rgba(0,0,0,0.8) inset, 0 0 20px rgba(0,0,0,0.5) inset",
          }}
        >
          <AppMockup />
        </div>
      </div>

      {/* Base */}
      <div
        className="h-[16px] mx-[1px]"
        style={{
          background: "linear-gradient(to bottom, #252525, #1e1e1e)",
          borderBottomLeftRadius: "2px",
          borderBottomRightRadius: "2px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      />
      {/* Bisagra central */}
      <div
        className="mx-auto"
        style={{
          width: "18%",
          height: "3px",
          background: "linear-gradient(to bottom, #1a1a1a, #2a2a2a)",
          borderRadius: "0 0 4px 4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}
      />
      {/* Base inferior / trackpad area */}
      <div className="flex justify-center">
        <div
          className="h-[5px]"
          style={{
            width: "55%",
            background: "linear-gradient(to bottom, #2a2a2a, #1c1c1c)",
            borderRadius: "0 0 10px 10px",
            boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
          }}
        />
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
            Beta abierta — plazas limitadas
          </motion.div>

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
                9,99€ · Acceso Beta
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
            <span>Mac &amp; Windows</span>
            <span className="w-px h-3 bg-white/10" />
            <span>Garantía 30 días</span>
          </motion.div>
        </div>

        {/* ── Columna derecha — MacBook flotante ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          className="w-full"
        >
          <motion.div animate={floatAnim}>
            <MacBookFrame />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
