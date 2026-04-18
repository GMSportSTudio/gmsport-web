"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { CirclePlay, LayoutDashboard, BadgeDollarSign, CheckCircle2 } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0): Variants => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: EASE } },
});

/* ─── Datos ──────────────────────────────────────────────────── */
const PILLARS = [
  {
    icon:     <CirclePlay size={24} strokeWidth={1.8} />,
    tag:      "YouTube Nativo",
    title:    "Analiza cualquier partido en segundos",
    body:     "Olvídate de descargar vídeos o pagar plataformas de streaming. Pega la URL de YouTube y empieza a telestrarar, marcar eventos y cortar clips directamente. Sin conversiones, sin esperas.",
    bullets:  ["Partidos en directo y grabados", "Playlists completas de temporada", "Sin límite de URLs analizadas"],
    color:    "#FF5722",
    gradient: "from-[#FF5722]/10 to-transparent",
    border:   "border-[#FF5722]/20",
  },
  {
    icon:     <LayoutDashboard size={24} strokeWidth={1.8} />,
    tag:      "Dashboard Interactivo",
    title:    "Toda la información de un vistazo",
    body:     "Un panel que centraliza jugadores, sesiones, clips y estadísticas. Filtra por partido, jugador o acción táctica. Presenta tus informes directamente desde la app sin exportar nada.",
    bullets:  ["Vista de campo con posicionamiento", "Timeline de eventos por partido", "Exportación a vídeo en un clic"],
    color:    "#7C3AED",
    gradient: "from-[#7C3AED]/10 to-transparent",
    border:   "border-[#7C3AED]/20",
  },
  {
    icon:     <BadgeDollarSign size={24} strokeWidth={1.8} />,
    tag:      "Precio accesible",
    title:    "Tecnología de élite para clubes modestos",
    body:     "Hudl cuesta más de 2.000€ al año. Nacsport supera los 1.500€. GmSportStudio es un pago único de 99€ con todas las actualizaciones incluidas. La misma potencia, sin el abono mensual que lastra el presupuesto del club.",
    bullets:  ["Pago único — sin suscripción", "Actualizaciones de por vida", "Licencia para 1 dispositivo"],
    color:    "#16A34A",
    gradient: "from-[#16A34A]/10 to-transparent",
    border:   "border-[#16A34A]/20",
  },
];

/* ─── Tabla comparativa ──────────────────────────────────────── */
const COMPARISON = [
  { feature: "Vídeo análisis avanzado",  gms: true,  hudl: true,  nacsport: true  },
  { feature: "Telestración en tiempo real", gms: true, hudl: true, nacsport: true },
  { feature: "Integración con YouTube",  gms: true,  hudl: false, nacsport: false },
  { feature: "Sin suscripción anual",    gms: true,  hudl: false, nacsport: false },
  { feature: "Mac + Windows",           gms: true,  hudl: true,  nacsport: true  },
  { feature: "Base de datos local",      gms: true,  hudl: false, nacsport: true  },
  { feature: "Precio de entrada",        gms: "99€", hudl: "2.000€+", nacsport: "1.500€+" },
];

/* ─── Componente principal ───────────────────────────────────── */
export default function WhySection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="por-que"
      ref={ref}
      aria-label="Por qué elegir GmSportStudio frente a Hudl y Nacsport"
      className="relative px-5 md:px-8 py-24 md:py-32 max-w-6xl mx-auto w-full"
    >
      {/* Cabecera */}
      <motion.div
        initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)}
        className="flex flex-col items-center text-center gap-4 mb-16"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10
                         bg-white/4 text-white/40 text-xs font-medium tracking-wide uppercase">
          Por qué GmSportStudio
        </span>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl"
          style={{
            background: "linear-gradient(160deg, #ffffff 40%, #6b7280 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}
        >
          La alternativa inteligente
          <br />a Hudl y Nacsport
        </h2>
        <p className="max-w-lg text-[#EDEDED]/45 text-base leading-relaxed">
          Mismo nivel de análisis profesional. Sin el precio que solo se pueden permitir
          los clubes de primera división.
        </p>
      </motion.div>

      {/* Tres pilares */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16"
      >
        {PILLARS.map((p, i) => (
          <motion.article
            key={p.tag}
            variants={fadeUp(i * 0.12)}
            className={[
              "relative flex flex-col gap-5 p-6 rounded-2xl border overflow-hidden",
              "bg-[#0f0f0f] group hover:border-opacity-40 transition-colors duration-300",
              p.border,
            ].join(" ")}
          >
            {/* Gradiente de fondo sutil */}
            <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-60 pointer-events-none`} />

            {/* Icono + tag */}
            <div className="relative flex items-center gap-3">
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}25` }}
              >
                {p.icon}
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: p.color }}>
                {p.tag}
              </span>
            </div>

            {/* Texto */}
            <div className="relative flex flex-col gap-3 flex-1">
              <h3 className="text-lg font-bold text-white leading-snug">{p.title}</h3>
              <p className="text-sm text-[#EDEDED]/45 leading-relaxed">{p.body}</p>
            </div>

            {/* Bullets */}
            <ul className="relative flex flex-col gap-2">
              {p.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-xs text-[#EDEDED]/55">
                  <CheckCircle2 size={13} style={{ color: p.color }} className="shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </motion.div>

      {/* Tabla comparativa */}
      <motion.div
        initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.4)}
        className="rounded-2xl overflow-hidden border border-white/8"
      >
        {/* Cabecera tabla */}
        <div className="grid grid-cols-4 bg-[#111] border-b border-white/8 px-4 py-3">
          <span className="text-xs text-white/30 uppercase tracking-wider col-span-1">Característica</span>
          {[
            { label: "GmSportStudio", highlight: true },
            { label: "Hudl",          highlight: false },
            { label: "Nacsport",      highlight: false },
          ].map(({ label, highlight }) => (
            <span key={label} className={[
              "text-xs font-semibold text-center uppercase tracking-wider",
              highlight ? "text-[#FF7043]" : "text-white/30",
            ].join(" ")}>
              {label}
            </span>
          ))}
        </div>

        {/* Filas */}
        {COMPARISON.map((row, i) => (
          <div
            key={row.feature}
            className={[
              "grid grid-cols-4 px-4 py-3.5 items-center",
              i % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#0d0d0d]",
              i < COMPARISON.length - 1 ? "border-b border-white/5" : "",
            ].join(" ")}
          >
            <span className="text-sm text-[#EDEDED]/60 col-span-1 pr-4">{row.feature}</span>
            {[row.gms, row.hudl, row.nacsport].map((val, j) => (
              <div key={j} className="flex justify-center">
                {typeof val === "string" ? (
                  <span className={[
                    "text-sm font-semibold",
                    j === 0 ? "text-[#FF7043]" : "text-white/30",
                  ].join(" ")}>
                    {val}
                  </span>
                ) : val ? (
                  <CheckCircle2 size={16} className={j === 0 ? "text-[#FF7043]" : "text-white/25"} />
                ) : (
                  <span className="text-white/15 text-lg leading-none">—</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
