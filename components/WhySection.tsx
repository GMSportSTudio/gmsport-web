"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { CirclePlay, LayoutDashboard, BadgeDollarSign, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0): Variants => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: EASE } },
});

/* ─── Componente principal ───────────────────────────────────── */
export default function WhySection() {
  const t = useTranslations("WhySection");
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const PILLARS = [
    {
      icon:    <CirclePlay size={24} strokeWidth={1.8} />,
      tag:     t("pillars.youtube.tag"),
      title:   t("pillars.youtube.title"),
      body:    t("pillars.youtube.body"),
      bullets: [
        t("pillars.youtube.bullet0"),
        t("pillars.youtube.bullet1"),
        t("pillars.youtube.bullet2"),
      ],
      color:  "#FF5722",
      border: "border-[#FF5722]/20",
    },
    {
      icon:    <LayoutDashboard size={24} strokeWidth={1.8} />,
      tag:     t("pillars.dashboard.tag"),
      title:   t("pillars.dashboard.title"),
      body:    t("pillars.dashboard.body"),
      bullets: [
        t("pillars.dashboard.bullet0"),
        t("pillars.dashboard.bullet1"),
        t("pillars.dashboard.bullet2"),
      ],
      color:  "#7C3AED",
      border: "border-[#7C3AED]/20",
    },
    {
      icon:    <BadgeDollarSign size={24} strokeWidth={1.8} />,
      tag:     t("pillars.price.tag"),
      title:   t("pillars.price.title"),
      body:    t("pillars.price.body"),
      bullets: [
        t("pillars.price.bullet0"),
        t("pillars.price.bullet1"),
        t("pillars.price.bullet2"),
      ],
      color:  "#16A34A",
      border: "border-[#16A34A]/20",
    },
  ];

  const FEATURES_TABLE = [
    { feature: t("features.videoAnalysis"), individual: true,  club: true  },
    { feature: t("features.telestration"),  individual: true,  club: true  },
    { feature: t("features.youtube"),       individual: true,  club: true  },
    { feature: t("features.clips"),         individual: true,  club: true  },
    { feature: t("features.platforms"),     individual: true,  club: true  },
    { feature: t("features.offlineDb"),     individual: true,  club: true  },
    { feature: t("features.adminPanel"),    individual: false, club: true  },
    { feature: t("features.multiDevice"),   individual: false, club: true  },
  ];

  return (
    <section
      id="por-que"
      ref={ref}
      aria-label={t("sectionLabel")}
      className="relative px-5 md:px-8 py-24 md:py-32 max-w-6xl mx-auto w-full"
    >
      {/* Cabecera */}
      <motion.div
        initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)}
        className="flex flex-col items-center text-center gap-4 mb-16"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10
                         bg-white/4 text-white/40 text-xs font-medium tracking-wide uppercase">
          {t("eyebrow")}
        </span>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl"
          style={{
            background: "linear-gradient(160deg, #ffffff 40%, #6b7280 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}
        >
          {t("title1")}
          <br />{t("title2")}
        </h2>
        <p className="max-w-lg text-[#cccccc]/45 text-base leading-relaxed">
          {t("subtitle")}
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
          <span className="text-xs text-white/30 uppercase tracking-wider">{t("tableColFeature")}</span>
          {[
            { label: t("tableColIndividual"), highlight: false },
            { label: t("tableColClub"),       highlight: true  },
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
