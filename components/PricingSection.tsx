"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Zap, RefreshCw, MessageCircle, Award, ShieldCheck, Star } from "lucide-react";

/* ─── Tipos ──────────────────────────────────────────────────── */
interface Benefit {
  icon:  React.ReactNode;
  label: string;
  note?: string;
}

/* ─── Datos ──────────────────────────────────────────────────── */
const BENEFITS: Benefit[] = [
  {
    icon:  <Zap size={16} strokeWidth={2} />,
    label: "Acceso Beta inmediato",
    note:  "Descarga y usa hoy mismo",
  },
  {
    icon:  <RefreshCw size={16} strokeWidth={2} />,
    label: "Actualizaciones de por vida",
    note:  "Todas las versiones futuras incluidas",
  },
  {
    icon:  <MessageCircle size={16} strokeWidth={2} />,
    label: "Soporte directo",
    note:  "Acceso prioritario al equipo",
  },
  {
    icon:  <Award size={16} strokeWidth={2} />,
    label: "Insignia de Founder",
    note:  "Reconocimiento permanente en la app",
  },
];

/* ─── Animaciones ────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0): Variants => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: EASE } },
});

/* ─── Componente principal ───────────────────────────────────── */
export default function PricingSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="precios"
      ref={ref}
      className="relative px-5 md:px-8 py-24 md:py-32 flex flex-col items-center"
    >
      {/* Glow ambiental */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[20%] top-[10%] bottom-[20%] -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(255,87,34,0.09) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      {/* Cabecera */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp(0)}
        className="flex flex-col items-center text-center gap-4 mb-14"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10
                         bg-white/4 text-white/40 text-xs font-medium tracking-wide uppercase">
          Precios
        </span>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
          style={{
            background: "linear-gradient(160deg, #ffffff 40%, #6b7280 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Una sola compra.
          <br />
          Para siempre.
        </h2>
        <p className="max-w-sm text-[#EDEDED]/45 text-base leading-relaxed">
          Sin suscripciones, sin sorpresas. Paga una vez y llévate la herramienta y todas sus actualizaciones.
        </p>
      </motion.div>

      {/* Tarjeta */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp(0.15)}
        className="w-full max-w-md relative"
      >
        {/* Resplandor naranja detrás de la card */}
        <div
          aria-hidden="true"
          className="absolute -inset-px rounded-2xl pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,87,34,0.35) 0%, rgba(255,112,67,0.15) 50%, transparent 100%)",
            filter: "blur(1px)",
          }}
        />

        {/* Card */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #1a1008 0%, #111111 55%, #0f0f0f 100%)",
            border: "1px solid rgba(255,87,34,0.3)",
            boxShadow:
              "0 0 0 1px rgba(255,87,34,0.15), 0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,87,34,0.08)",
          }}
        >
          {/* Borde superior iluminado */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, rgba(255,87,34,0.7) 50%, transparent 95%)",
            }}
          />

          {/* Badge "Más popular" */}
          <div className="absolute top-5 right-5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                             bg-[#FF5722]/15 border border-[#FF5722]/30
                             text-[#FF8A65] text-[11px] font-semibold tracking-wide">
              <Star size={10} fill="currentColor" />
              Plazas limitadas
            </span>
          </div>

          <div className="p-8 flex flex-col gap-8">

            {/* Header de la card */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#FF7043]">
                Founder&apos;s Access
              </p>
              <h3 className="text-2xl font-bold text-white">
                Acceso Vitalicio
              </h3>
              <p className="text-sm text-[#EDEDED]/45 leading-relaxed">
                El precio que los primeros creyentes merecen. Solo disponible durante la Beta.
              </p>
            </div>

            {/* Precio */}
            <div className="flex items-end gap-2">
              <div className="flex items-start gap-1 leading-none">
                <span className="text-[#EDEDED]/60 text-xl font-medium mt-1">€</span>
                <span className="text-6xl font-black text-white tracking-tight">99</span>
              </div>
              <div className="flex flex-col mb-1.5 leading-tight">
                <span className="text-[#EDEDED]/50 text-sm">pago único</span>
                <span className="text-[#EDEDED]/30 text-xs line-through">€199</span>
              </div>
            </div>

            {/* Separador */}
            <div className="h-px bg-white/6" />

            {/* Lista de beneficios */}
            <ul className="flex flex-col gap-4">
              {BENEFITS.map(({ icon, label, note }) => (
                <li key={label} className="flex items-start gap-3">
                  {/* Icono */}
                  <span className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                                   bg-[#FF5722]/12 text-[#FF7043] border border-[#FF5722]/20">
                    {icon}
                  </span>
                  {/* Texto */}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-[#EDEDED]">{label}</span>
                    {note && (
                      <span className="text-xs text-[#EDEDED]/35">{note}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <motion.a
              href="https://josegalan.gumroad.com/l/zdrbln"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="relative flex items-center justify-center gap-2 w-full py-4 rounded-xl
                         text-white font-semibold text-base
                         bg-gradient-to-r from-[#FF5722] to-[#FF7043]
                         shadow-[0_2px_20px_rgba(255,87,34,0.4)]
                         hover:shadow-[0_4px_32px_rgba(255,87,34,0.6)]
                         transition-shadow duration-300"
            >
              {/* Brillo interno */}
              <span
                aria-hidden="true"
                className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />
              <Zap size={17} strokeWidth={2.2} />
              Consigue tu acceso Founder
            </motion.a>

            {/* Garantía */}
            <div className="flex items-center justify-center gap-2 text-[#EDEDED]/35">
              <ShieldCheck size={15} strokeWidth={1.8} className="shrink-0 text-[#EDEDED]/25" />
              <p className="text-xs text-center leading-relaxed">
                Garantía de satisfacción para entrenadores.
                <br />
                <span className="text-[#EDEDED]/22">Si no es lo que esperabas, te devolvemos el dinero.</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Nota inferior */}
      <motion.p
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp(0.3)}
        className="mt-8 text-xs text-[#EDEDED]/25 text-center max-w-xs leading-relaxed"
      >
        Pago procesado de forma segura por Gumroad.
        Sin suscripción. Cancela la compra en 30 días si no estás satisfecho.
      </motion.p>
    </section>
  );
}
