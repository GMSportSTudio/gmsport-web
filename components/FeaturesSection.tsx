"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { FolderOpen, CirclePlay, Scissors, Database } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

/* ─── Tipos ─────────────────────────────────────────────────── */
interface Feature {
  id:          string;
  icon:        React.ReactNode;
  title:       string;
  description: string;
  /** Clase de grid para el layout asimétrico */
  grid:        string;
  /** Variante visual de la card */
  variant:     "default" | "accent" | "large";
  /** Contenido decorativo opcional dentro de la card */
  visual?:     React.ReactNode;
}

/* ─── Datos ─────────────────────────────────────────────────── */
const FEATURES: Feature[] = [
  {
    id:          "multipartido",
    icon:        <FolderOpen size={22} strokeWidth={1.8} />,
    title:       "Varios partidos, un proyecto",
    description: "Agrupa todos los partidos de una jornada, rival o temporada en un único proyecto. Cambia de partido sin perder el contexto del análisis.",
    grid:        "col-span-2 md:col-span-2 row-span-2",
    variant:     "large",
    visual:      <MultiMatchVisual />,
  },
  {
    id:          "youtube",
    icon:        <CirclePlay size={22} strokeWidth={1.8} />,
    title:       "YouTube Nativo",
    description: "Pega la URL de cualquier partido y empieza a analizar al instante.",
    grid:        "col-span-2 md:col-span-1",
    variant:     "accent",
    visual:      <YoutubeVisual />,
  },
  {
    id:          "clips",
    icon:        <Scissors size={22} strokeWidth={1.8} />,
    title:       "Corte de Clips Ultra-rápido",
    description: "Marca inicio y fin con una tecla. Exporta la jugada en segundos.",
    grid:        "col-span-2 md:col-span-1",
    variant:     "default",
    visual:      <ClipsVisual />,
  },
  {
    id:          "db",
    icon:        <Database size={22} strokeWidth={1.8} />,
    title:       "Base de Datos Local",
    description: "Tus informes, sesiones y jugadores guardados offline. Siempre contigo, sin depender de la nube.",
    grid:        "col-span-2 md:col-span-2",
    variant:     "default",
    visual:      undefined,
  },
];

/* ─── Variantes de animación ─────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 32, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1 },
};

/* ─── Visuales decorativos ───────────────────────────────────── */
function MultiMatchVisual() {
  const matches = [
    { label: "J12 · Real Madrid",   active: true  },
    { label: "J13 · FC Barcelona",  active: false },
    { label: "J14 · Unicaja",       active: false },
  ];
  return (
    <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-2 pointer-events-none opacity-30">
      {matches.map(({ label, active }) => (
        <div
          key={label}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg border"
          style={{
            background: active ? "rgba(255,87,34,0.12)" : "rgba(255,255,255,0.04)",
            borderColor: active ? "rgba(255,87,34,0.35)" : "rgba(255,255,255,0.08)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: active ? "#FF5722" : "rgba(255,255,255,0.2)" }}
          />
          <span className="text-[11px] font-medium" style={{ color: active ? "#FF8A65" : "rgba(255,255,255,0.4)" }}>
            {label}
          </span>
          {active && (
            <span className="ml-auto text-[9px] text-[#FF7043] font-semibold uppercase tracking-wider">
              Activo
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function YoutubeVisual() {
  return (
    <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none">
      <div className="w-14 h-10 rounded bg-red-600 flex items-center justify-center">
        <div className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-white ml-1" />
      </div>
    </div>
  );
}

function ClipsVisual() {
  return (
    <div className="absolute bottom-3 right-3 flex gap-1 opacity-25 pointer-events-none">
      {[40, 70, 30, 55, 85, 45, 65].map((h, i) => (
        <div
          key={i}
          className="w-2 rounded-sm"
          style={{
            height: `${h}%`,
            maxHeight: "40px",
            background: i === 3 ? "#FF5722" : "rgba(255,255,255,0.3)",
          }}
        />
      ))}
    </div>
  );
}

function DatabaseVisual({ inView }: { inView: boolean }) {
  const sesiones  = useCountUp(142, { inView, delay: 200 });
  const jugadores = useCountUp(38,  { inView, delay: 350 });
  const clips     = useCountUp(891, { inView, delay: 500 });

  const stats = [
    { label: "Sesiones",  value: sesiones  },
    { label: "Jugadores", value: jugadores },
    { label: "Clips",     value: clips     },
  ];

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-3 opacity-20 pointer-events-none">
      {stats.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <span className="stat-num text-2xl font-black text-white">{value}</span>
          <span className="text-[10px] text-white/50 uppercase tracking-wider">{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Card individual ────────────────────────────────────────── */
function FeatureCard({
  feature,
  index,
  inView,
}: {
  feature: Feature;
  index: number;
  inView: boolean;
}) {
  const isAccent = feature.variant === "accent";
  const isLarge  = feature.variant === "large";

  const hoverGlow = isAccent
    ? "0 0 0 1.5px rgba(255,87,34,0.65), 0 20px 56px rgba(0,0,0,0.65), 0 0 48px rgba(255,87,34,0.14)"
    : "0 0 0 1.5px rgba(255,87,34,0.4),  0 20px 56px rgba(0,0,0,0.65), 0 0 40px rgba(255,87,34,0.09)";

  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
      whileHover={{
        y: -6,
        boxShadow: hoverGlow,
        transition: { duration: 0.22, ease: "easeOut" },
      }}
      className={[
        "bento-card p-6 flex flex-col gap-4 group cursor-default card-top-shine",
        feature.grid,
        isAccent ? "bento-card-accent card-top-shine-accent" : "",
        isLarge ? "min-h-[280px] md:min-h-[320px]" : "min-h-[160px]",
      ].join(" ")}
    >
      {/* Contenido */}
      <div className="relative z-10 flex flex-col gap-3 flex-1">
        {/* Icono — sube con el card */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className={[
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            isAccent
              ? "bg-[#FF5722]/20 text-[#FF7043]"
              : "bg-white/6 text-white/60 group-hover:text-white/90 transition-colors duration-300",
          ].join(" ")}
        >
          {feature.icon}
        </motion.div>

        {/* Texto */}
        <div className="flex flex-col gap-1.5">
          <h3 className={[
            "font-semibold leading-snug",
            isLarge ? "text-xl" : "text-base",
            isAccent ? "text-white" : "text-[#EDEDED]",
          ].join(" ")}>
            {feature.title}
          </h3>
          <p className={[
            "text-sm leading-relaxed",
            isLarge ? "max-w-xs" : "",
            "text-[#EDEDED]/45 group-hover:text-[#EDEDED]/65 transition-colors duration-300",
          ].join(" ")}>
            {feature.description}
          </p>
        </div>

        {/* Badge en card accent */}
        {isAccent && (
          <span className="mt-auto self-start inline-flex items-center gap-1.5 px-2.5 py-1
                           rounded-full text-xs font-medium bg-[#FF5722]/15 text-[#FF8A65]
                           border border-[#FF5722]/25">
            <span className="w-1 h-1 rounded-full bg-[#FF5722]" />
            Integración directa
          </span>
        )}
      </div>

      {/* Visual decorativo — pasa inView al que lo necesite */}
      {feature.id === "db"
        ? <DatabaseVisual inView={inView} />
        : feature.visual}
    </motion.div>
  );
}

/* ─── Sección principal ──────────────────────────────────────── */
export default function FeaturesSection() {
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="caracteristicas"
      ref={ref}
      className="relative px-5 md:px-8 py-24 md:py-32 max-w-6xl mx-auto"
    >
      {/* Cabecera */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-col items-center text-center gap-4 mb-14"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10
                         bg-white/4 text-white/40 text-xs font-medium tracking-wide uppercase">
          Características
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
          style={{
            background: "linear-gradient(160deg, #ffffff 40%, #6b7280 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Todo lo que necesitas,
          <br />
          al precio que necesitas.
        </h2>
        <p className="max-w-md text-[#EDEDED]/45 text-base leading-relaxed">
          Herramientas de análisis profesionales diseñadas para entrenadores que valoran su tiempo.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
      >
        {FEATURES.map((feature, i) => (
          <FeatureCard key={feature.id} feature={feature} index={i} inView={inView} />
        ))}
      </motion.div>
    </section>
  );
}
