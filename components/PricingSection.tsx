"use client";

import { useState, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Zap, Users, ShieldCheck, Check, Star } from "lucide-react";

/* ─── Precios — edita aquí cuando los confirmes ──────────────── */
const PLANS = [
  {
    id:       "mensual",
    label:    "Individual",
    period:   "Mensual",
    price:    9,
    unit:     "mes",
    badge:    null,
    cta:      "Empezar ahora",
    href:     "https://forms.gle/3KAVe45PeSpJMy8g6",
    features: [
      "1 dispositivo",
      "Todas las funciones incluidas",
      "Actualizaciones automáticas",
      "Soporte por email",
    ],
    primary:  false,
  },
  {
    id:       "anual",
    label:    "Individual",
    period:   "Anual",
    price:    69,
    unit:     "año",
    badge:    "Más popular",
    cta:      "Empezar ahora",
    href:     "https://forms.gle/3KAVe45PeSpJMy8g6",
    features: [
      "1 dispositivo",
      "Todas las funciones incluidas",
      "Actualizaciones automáticas",
      "Soporte prioritario",
      "2 meses gratis vs mensual",
    ],
    primary:  true,
  },
  {
    id:       "club",
    label:    "Club",
    period:   "Licencias",
    price:    null,
    unit:     null,
    badge:    null,
    cta:      "Solicitar presupuesto",
    href:     "mailto:josegalan16@gmail.com?subject=Presupuesto%20Club%20GmSportStudio",
    features: [
      "Múltiples dispositivos",
      "Panel de administración",
      "Todas las funciones incluidas",
      "Soporte dedicado",
      "Precio por volumen",
    ],
    primary:  false,
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0): Variants => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: EASE } },
});

/* ─── Sección principal ──────────────────────────────────────── */
export default function PricingSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [billing, setBilling] = useState<"mensual" | "anual">("anual");

  return (
    <section
      id="precios"
      ref={ref}
      className="relative px-5 md:px-8 py-24 md:py-32 flex flex-col items-center"
    >
      {/* Glow ambiental */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[20%] top-[10%] bottom-[20%] -z-10"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,87,34,0.07) 0%, transparent 65%)", filter: "blur(40px)" }} />

      {/* Cabecera */}
      <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)}
        className="flex flex-col items-center text-center gap-4 mb-10"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10
                         bg-white/4 text-white/40 text-xs font-medium tracking-wide uppercase">
          Precios
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
          style={{ background: "linear-gradient(160deg, #ffffff 40%, #6b7280 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Tecnología profesional,
          <br />precio asequible.
        </h2>
        <p className="max-w-sm text-[#cccccc]/45 text-base leading-relaxed">
          Sin permanencias. Cancela cuando quieras. Planes para entrenadores individuales y clubes.
        </p>
      </motion.div>

      {/* Toggle mensual/anual */}
      <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.1)}
        className="flex items-center gap-3 mb-12 p-1 rounded-lg bg-[#1e1e1e] border border-white/8"
        style={{ borderRadius: "8px" }}
      >
        {(["mensual", "anual"] as const).map((b) => (
          <button key={b} onClick={() => setBilling(b)}
            className={[
              "px-5 py-2 text-sm font-medium transition-all duration-200 capitalize",
              billing === b
                ? "bg-[#FF5722] text-white shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
                : "text-[#cccccc]/50 hover:text-white",
            ].join(" ")}
            style={{ borderRadius: "6px" }}
          >
            {b}
            {b === "anual" && (
              <span className="ml-1.5 text-[10px] font-semibold text-[#4ec9b0]">−35%</span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Cards de planes */}
      <motion.div
        initial="hidden" animate={inView ? "visible" : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl"
      >
        {PLANS.filter(p => p.id === billing || p.id === "club").map((plan, i) => {
          return (
            <motion.div key={plan.id} variants={fadeUp(i * 0.1)}
              className={[
                "relative flex flex-col overflow-hidden",
                plan.primary
                  ? "border border-[#FF5722]/40 bg-[#1a1008]"
                  : "border border-white/8 bg-[#1e1e1e]",
              ].join(" ")}
              style={{ borderRadius: "8px",
                boxShadow: plan.primary ? "0 0 0 1px rgba(255,87,34,0.15), 0 20px 60px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.3)" }}
            >
              {/* Línea superior iluminada en plan primario */}
              {plan.primary && (
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent 10%, rgba(255,87,34,0.7) 50%, transparent 90%)" }} />
              )}

              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold
                                   bg-[#FF5722]/15 border border-[#FF5722]/30 text-[#FF8A65]"
                    style={{ borderRadius: "4px" }}>
                    <Star size={9} fill="currentColor" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6 flex flex-col gap-5 flex-1">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {plan.id === "club"
                      ? <Users size={15} className="text-[#4ec9b0]" />
                      : <Zap size={15} className="text-[#FF7043]" />}
                    <span className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: plan.id === "club" ? "#4ec9b0" : "#FF7043" }}>
                      {plan.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#cccccc]/35 mt-0.5">{plan.period}</p>
                </div>

                {/* Precio */}
                <div className="flex items-end gap-1.5 leading-none">
                  {plan.price !== null ? (
                    <>
                      <span className="text-[#cccccc]/50 text-lg font-medium mb-0.5">€</span>
                      <span className="text-5xl font-black text-white tracking-tight">{plan.price}</span>
                      <span className="text-[#cccccc]/40 text-sm mb-1">/{plan.unit}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-white">A medida</span>
                  )}
                </div>

                {/* Separador */}
                <div className="h-px bg-white/6" />

                {/* Features */}
                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[#cccccc]/60">
                      <Check size={13} className={plan.primary ? "text-[#FF7043] shrink-0" : "text-[#4ec9b0] shrink-0"} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.a
                  href={plan.href}
                  target={plan.href.startsWith("http") ? "_blank" : undefined}
                  rel={plan.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className={[
                    "flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold",
                    "border transition-all duration-150",
                    plan.primary
                      ? "bg-[#FF5722] hover:bg-[#E64A19] text-white border-[rgba(255,87,34,0.5)] shadow-[0_1px_4px_rgba(0,0,0,0.4)] hover:shadow-[0_0_0_1px_rgba(255,87,34,0.4),0_4px_16px_rgba(255,87,34,0.3)]"
                      : "bg-[#2d2d30] hover:bg-[#3c3c3c] text-[#cccccc] hover:text-white border-white/10 hover:border-white/20",
                  ].join(" ")}
                  style={{ borderRadius: "6px" }}
                >
                  {plan.cta}
                </motion.a>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Nota inferior */}
      <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.4)}
        className="mt-8 flex flex-col items-center gap-2"
      >
        <div className="flex items-center gap-2 text-[#cccccc]/30 text-xs">
          <ShieldCheck size={13} className="text-[#4ec9b0]/50" />
          <span>Garantía de satisfacción · Sin permanencia · Cancela cuando quieras</span>
        </div>
      </motion.div>
    </section>
  );
}
