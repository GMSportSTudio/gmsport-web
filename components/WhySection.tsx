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
    border:   "border-[#FF5722]/20",
  },
  {
    icon:     <LayoutDashboard size={24} strokeWidth={1.8} />,
    tag:      "Dashboard Interactivo",
    title:    "Toda la información de un vistazo",
    body:     "Un panel que centraliza jugadores, sesiones, clips y estadísticas. Filtra por partido, jugador o acción táctica. Presenta tus informes directamente desde la app sin exportar nada.",
    bullets:  ["Vista de campo con posicionamiento", "Timeline de eventos por partido", "Exportación a vídeo en un clic"],
    color:    "#7C3AED",
    border:   "border-[#7C3AED]/20",
  },
  {
    icon:     <BadgeDollarSign size={24} strokeWidth={1.8} />,
    tag:      "Precio accesible",
    title:    "Tecnología de élite para clubes modestos",
    body:     "El software de análisis profesional ha sido históricamente inaccesible para la mayoría de clubes. GmSportStudio rompe esa barrera con planes mensuales, anuales y paquetes de licencias para equipos, sin renunciar a ninguna función.",
    bullets:  ["Planes mensuales y anuales", "Licencias para clubes y academias", "Sin costes ocultos"],
    color:    "#16A34A",
    border:   "border-[#16A34A]/20",
  },
];

/* ─── Tabla de funciones ─────────────────────────────────────── */
const FEATURES_TABLE = [
  { feature: "Vídeo análisis avanzado",        individual: true,  club: true  },
  { feature: "Telestración en tiempo real",    individual: true,  club: true  },
  { feature: "Integración con YouTube",        individual: true,  club: true  },
  { feature: "Corte de clips ultrarrápido",    individual: true,  club: true  },
  { feature: "Mac + Windows",                  individual: true,  club: true  },
  { feature: "Base de datos local offline",    individual: true,  club: true  },
  { feature: "Panel de administración",        individual: false, club: true  },
  { feature: "Múltiples dispositivos",         individual: false, club: true  },
];

/* ─── Componente principal ───────────────────────────────────── */
export default function WhySection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="por-que"
      ref={ref}
      aria-label="Por qué elegir GmSportStudio"
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
          Herramientas de élite
          <br />al alcance de todos
        </h2>
        <p className="max-w-lg text-[#cccccc]/45 text-base leading-relaxed">
          El mismo nivel de análisis que usan los equipos profesionales,
          con planes diseñados para entrenadores individuales y clubes de cualquier categoría.
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
            <div
              className="absolute inset-0 opacity-60 pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${p.color}18 0%, transparent 60%)` }}
            />

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

      {/* Tabla de funciones */}
      <motion.div
        initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.4)}
        className="overflow-hidden border border-white/8"
        style={{ borderRadius: "8px" }}
      >
        {/* Cabecera tabla */}
        <div className="grid grid-cols-3 bg-[#2d2d30] border-b border-white/8 px-4 py-3">
          <span className="text-xs text-white/30 uppercase tracking-wider">Función</span>
          {[
            { label: "Individual", highlight: false },
            { label: "Club",       highlight: true  },
          ].map(({ label, highlight }) => (
            <span key={label} className={[
              "text-xs font-semibold text-center uppercase tracking-wider",
              highlight ? "text-[#4ec9b0]" : "text-[#FF7043]",
            ].join(" ")}>
              {label}
            </span>
          ))}
        </div>

        {/* Filas */}
        {FEATURES_TABLE.map((row, i) => (
          <div
            key={row.feature}
            className={[
              "grid grid-cols-3 px-4 py-3.5 items-center",
              i % 2 === 0 ? "bg-[#1e1e1e]" : "bg-[#252526]",
              i < FEATURES_TABLE.length - 1 ? "border-b border-white/5" : "",
            ].join(" ")}
          >
            <span className="text-sm text-[#cccccc]/60 pr-4">{row.feature}</span>
            {[row.individual, row.club].map((val, j) => (
              <div key={j} className="flex justify-center">
                {val ? (
                  <CheckCircle2 size={16} className={j === 1 ? "text-[#4ec9b0]" : "text-[#FF7043]"} />
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
