"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("FaqSection");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const FAQS = [
    { q: t("faqs.q0"), a: t("faqs.a0") },
    { q: t("faqs.q1"), a: t("faqs.a1") },
    { q: t("faqs.q2"), a: t("faqs.a2") },
    { q: t("faqs.q3"), a: t("faqs.a3") },
  ];

  // FAQPage schema — built from translated strings
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a.replace(/<[^>]+>/g, ""),
      },
    })),
  };

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      ref={ref}
      className="relative px-5 md:px-8 py-24 md:py-32 max-w-2xl mx-auto w-full"
    >
      {/* FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Cabecera */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp(0)}
        className="flex flex-col items-center text-center gap-4 mb-12"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10
                         bg-white/4 text-white/40 text-xs font-medium tracking-wide uppercase">
          {t("eyebrow")}
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
          {t("title")}
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
