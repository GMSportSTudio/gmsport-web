"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { Plus } from "lucide-react";

/* ─── Datos ──────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "¿Cuándo puedo acceder a la Beta?",
    a: "La Beta se abre el 30 de abril de 2026. Si completas el formulario de inscripción ahora, aseguras tu plaza (son limitadas) y recibirás el enlace de descarga por email ese mismo día.",
  },
  {
    q: "¿Necesito una suscripción de video externa?",
    a: "No. GmSportStudio se integra directamente con YouTube, por lo que puedes analizar cualquier partido público sin necesidad de ninguna suscripción adicional. Para videos propios puedes importar archivos locales.",
  },
  {
    q: "¿Funciona en Mac y PC?",
    a: "Sí. La aplicación es compatible con macOS (Apple Silicon y Intel) y Windows 10/11. El instalador se adapta automáticamente a tu plataforma.",
  },
  {
    q: "¿Qué planes de precio hay?",
    a: "Ofrecemos una suscripción mensual y otra anual para entrenadores individuales, con un ahorro del 35% en el plan anual. Para clubes y academias con varios entrenadores disponemos de paquetes de licencias con precio especial. Contacta con nosotros para un presupuesto personalizado.",
  },
  {
    q: "¿Puedo pedir reembolso si no me convence?",
    a: "Sí. Ofrecemos una garantía de satisfacción. Si en los primeros 30 días consideras que la herramienta no cumple tus expectativas, te devolvemos el importe íntegro sin preguntas.",
  },
];

/* ─── Animaciones ────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0): Variants => ({
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: EASE } },
});

/* ─── Item del acordeón ──────────────────────────────────────── */
function AccordionItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq:      { q: string; a: string };
  index:    number;
  isOpen:   boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      variants={fadeUp(index * 0.07)}
      className={[
        "rounded-xl border transition-colors duration-300 overflow-hidden",
        isOpen
          ? "border-[#FF5722]/30 bg-[#FF5722]/5"
          : "border-white/7 bg-[#111111] hover:border-white/12",
      ].join(" ")}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left
                   group focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-[#FF5722]/50 focus-visible:ring-offset-2
                   focus-visible:ring-offset-[#050505]"
      >
        <span className={[
          "text-sm sm:text-base font-medium leading-snug transition-colors duration-200",
          isOpen ? "text-white" : "text-[#EDEDED]/75 group-hover:text-white",
        ].join(" ")}>
          {faq.q}
        </span>

        {/* Icono + */}
        <span
          className={[
            "shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300",
            isOpen
              ? "bg-[#FF5722]/20 text-[#FF7043] rotate-45"
              : "bg-white/6 text-white/40 group-hover:text-white/70 group-hover:bg-white/10",
          ].join(" ")}
          aria-hidden="true"
        >
          <Plus size={14} strokeWidth={2.5} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{   height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-[#EDEDED]/50 leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Sección FAQ ────────────────────────────────────────────── */
export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      ref={ref}
      className="relative px-5 md:px-8 py-24 md:py-32 max-w-2xl mx-auto w-full"
    >
      {/* Cabecera */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp(0)}
        className="flex flex-col items-center text-center gap-4 mb-12"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10
                         bg-white/4 text-white/40 text-xs font-medium tracking-wide uppercase">
          FAQ
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
          Preguntas frecuentes
        </h2>
      </motion.div>

      {/* Acordeón */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        className="flex flex-col gap-2"
      >
        {FAQS.map((faq, i) => (
          <AccordionItem
            key={i}
            faq={faq}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </motion.div>
    </section>
  );
}
