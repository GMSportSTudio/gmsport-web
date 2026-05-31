"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Zap, MessageCircle, Award, Percent, Star, Users, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  INDIVIDUAL_MONTHLY,
  INDIVIDUAL_ANNUAL,
  formatPriceEUR,
} from "@/lib/plans";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0): Variants => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: EASE } },
});

export default function PricingSection() {
  const t      = useTranslations("PricingSection");
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const BENEFITS = [
    { icon: <Zap size={15} strokeWidth={2} />,           label: t("benefits.access")   },
    { icon: <MessageCircle size={15} strokeWidth={2} />, label: t("benefits.support")  },
    { icon: <Award size={15} strokeWidth={2} />,         label: t("benefits.badge")    },
    { icon: <Percent size={15} strokeWidth={2} />,       label: t("benefits.discount") },
  ];

  return (
    <section
      id="precios"
      ref={ref}
      className="relative px-5 md:px-8 py-24 md:py-32 flex flex-col items-center"
    >
      {/* Glow ambiental */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[20%] top-[10%] bottom-[20%] -z-10"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(34,255,224,0.09) 0%, transparent 65%)", filter: "blur(40px)" }}
      />

      {/* Cabecera */}
      <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)}
        className="flex flex-col items-center text-center gap-4 mb-14"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10
                         bg-white/4 text-white/40 text-xs font-medium tracking-wide uppercase">
          {t("eyebrow")}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
          style={{ background: "linear-gradient(160deg, #ffffff 40%, #6b7280 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          {t("title1")}
          <br />{t("title2")}
        </h2>
        <p className="max-w-md text-[#cccccc]/45 text-base leading-relaxed">
          {t("subtitle")}
        </p>

        {/* Aviso founders Beta — su 50 % lifetime se canjea por el link
            personal del email del 25/05/2026 (válido hasta el 30/06/2026),
            NO desde esta página pública. Si lo perdieron, deben escribir
            a ceo@gmsportstudio.com para reenvío del enlace JWT. */}
        <div
          className="mt-2 max-w-md text-xs text-[#22FFE0]/80 leading-relaxed border border-[#22FFE0]/20 rounded-md px-3 py-2 bg-[#22FFE0]/5"
          role="note"
        >
          <strong className="text-[#22FFE0]">¿Eres founder de la Beta?</strong>{" "}
          Tu 50 % lifetime se canjea desde el email personal que te llegó el 25/05.
          Si no lo encuentras, escríbenos a{" "}
          <a
            href="mailto:ceo@gmsportstudio.com?subject=Founder%20lifetime%20-%20reenv%C3%ADo%20enlace"
            className="underline hover:text-[#22FFE0]"
          >
            ceo@gmsportstudio.com
          </a>
          .
        </div>
      </motion.div>

      {/* Grid de planes individuales: 2 cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

        {/* ── Card MENSUAL ───────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp(0.15)}
          className="relative"
        >
          <div className="relative h-full overflow-hidden"
            style={{
              borderRadius: "8px",
              background: "linear-gradient(160deg, #141414 0%, #0f0f0f 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
            }}
          >
            <div className="p-7 md:p-8 flex flex-col gap-6 h-full">

              {/* Nombre del plan */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase tracking-widest text-[#cccccc]/45">
                  {t("monthlyEyebrow")}
                </p>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {t("monthlyTitle")}
                </h3>
              </div>

              {/* Precio */}
              <div className="flex items-end gap-2 leading-none">
                <span className="text-[#cccccc]/50 text-xl font-medium mb-1">€</span>
                <span className="stat-num text-6xl font-black text-white">
                  {formatPriceEUR(Math.floor(INDIVIDUAL_MONTHLY.priceEur))}
                </span>
                <span className="stat-num text-3xl font-black text-white/70 mb-1">
                  ,{String(INDIVIDUAL_MONTHLY.priceEur).split(".")[1] || "00"}
                </span>
                <div className="flex flex-col mb-2 ml-1">
                  <span className="text-xs text-[#cccccc]/40 leading-tight">{t("monthlyPriceUnit")}</span>
                </div>
              </div>

              {/* Aviso fiscal — IVA aplicado por el proveedor de pago según país */}
              <p className="text-[11px] text-[#cccccc]/55 leading-tight -mt-1">
                + IVA o impuesto equivalente
              </p>

              {/* Separador */}
              <div className="h-px bg-white/6" />

              {/* Beneficios */}
              <ul className="flex flex-col gap-3 flex-1">
                {BENEFITS.map(({ icon, label }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0
                                     bg-white/5 text-white/45 border border-white/10"
                      style={{ borderRadius: "4px" }}>
                      {icon}
                    </span>
                    <span className="text-sm text-[#cccccc]/65 leading-snug">{label}</span>
                  </li>
                ))}
              </ul>

              {/* CTA — Mensual (secundario, border naranja sin fondo) */}
              <motion.a
                href={INDIVIDUAL_MONTHLY.gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="relative flex items-center justify-center gap-2 w-full py-3
                           text-[#22FFE0] font-semibold text-sm
                           bg-transparent hover:bg-[#22FFE0]/8
                           border border-[rgba(34,255,224,0.4)]
                           hover:border-[rgba(34,255,224,0.7)]
                           transition-all duration-150"
                style={{ borderRadius: "6px" }}
              >
                {t("monthlyCta")}
                <ArrowRight size={14} strokeWidth={2.2} />
              </motion.a>

            </div>
          </div>
        </motion.div>

        {/* ── Card ANUAL (destacada) ─────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp(0.22)}
          className="relative glow-cta-guide"
        >
          {/* Glow detrás */}
          <div aria-hidden="true" className="absolute -inset-px pointer-events-none"
            style={{
              borderRadius: "9px",
              background: "linear-gradient(135deg, rgba(34,255,224,0.4) 0%, rgba(255,112,67,0.15) 50%, transparent 100%)",
              filter: "blur(1px)",
            }}
          />

          <div className="relative h-full overflow-hidden"
            style={{
              borderRadius: "8px",
              background: "linear-gradient(160deg, #1c1208 0%, #141414 50%, #0f0f0f 100%)",
              border: "1px solid rgba(34,255,224,0.35)",
              boxShadow: "0 0 0 1px rgba(34,255,224,0.12), 0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(34,255,224,0.07)",
            }}
          >
            {/* Línea superior */}
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent 5%, rgba(34,255,224,0.75) 50%, transparent 95%)" }}
            />

            {/* Badge "Mejor opción · Ahorra 45%" */}
            <div className="absolute top-5 right-5 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold
                               bg-[#22FFE0]/15 border border-[#22FFE0]/30 text-[#5FFFE8]"
                style={{ borderRadius: "4px" }}>
                <Star size={9} fill="currentColor" />
                {t("annualSavingsBadge")}
              </span>
            </div>

            <div className="p-7 md:p-8 flex flex-col gap-6 h-full">

              {/* Nombre del plan */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase tracking-widest text-[#22FFE0]">
                  {t("annualEyebrow")}
                </p>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {t("annualTitle")}
                </h3>
              </div>

              {/* Precio */}
              <div className="flex flex-col gap-1">
                <div className="flex items-end gap-2 leading-none">
                  <span className="text-[#cccccc]/50 text-xl font-medium mb-1">€</span>
                  <span className="stat-num text-6xl font-black text-white">
                    {formatPriceEUR(INDIVIDUAL_ANNUAL.priceEur)}
                  </span>
                  <div className="flex flex-col mb-2 ml-1">
                    <span className="text-xs text-[#cccccc]/40 leading-tight">{t("annualPriceUnit")}</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#cccccc]/35 mt-0.5">
                  {t("annualPricePerMonth")}
                </p>
                {/* Aviso fiscal — IVA aplicado por el proveedor de pago según país */}
                <p className="text-[11px] text-[#cccccc]/55 leading-tight">
                  + IVA o impuesto equivalente
                </p>
              </div>

              {/* Separador */}
              <div className="h-px bg-white/6" />

              {/* Beneficios */}
              <ul className="flex flex-col gap-3 flex-1">
                {BENEFITS.map(({ icon, label }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0
                                     bg-[#22FFE0]/12 text-[#22FFE0] border border-[#22FFE0]/20"
                      style={{ borderRadius: "4px" }}>
                      {icon}
                    </span>
                    <span className="text-sm text-[#cccccc]/70 leading-snug">{label}</span>
                  </li>
                ))}
              </ul>

              {/* CTA — Anual (primario, naranja sólido) */}
              <motion.a
                href={INDIVIDUAL_ANNUAL.gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="relative flex items-center justify-center gap-2 w-full py-3.5
                           text-[#06231F] font-semibold text-base
                           bg-[#22FFE0] hover:bg-[#5FFFE8]
                           border border-[rgba(34,255,224,0.5)]
                           shadow-[0_1px_4px_rgba(0,0,0,0.5)]
                           hover:shadow-[0_0_0_1px_rgba(34,255,224,0.4),0_4px_20px_rgba(34,255,224,0.35)]
                           transition-all duration-150"
                style={{ borderRadius: "6px" }}
              >
                <span aria-hidden="true"
                  className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <Zap size={16} strokeWidth={2.2} />
                {t("annualCta")}
              </motion.a>

            </div>
          </div>
        </motion.div>

      </div>

      {/* Plan Club (intacto, B2B mailto) */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp(0.32)}
        className="mt-10 w-full max-w-md"
      >
        <div
          className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f] p-6"
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 15%, rgba(34,255,224,0.45) 50%, transparent 85%)",
            }}
          />

          <div className="flex items-start gap-3 mb-5">
            <span
              className="w-9 h-9 flex items-center justify-center shrink-0
                         bg-[#22FFE0]/12 text-[#22FFE0] border border-[#22FFE0]/20"
              style={{ borderRadius: "6px" }}
            >
              <Users size={16} strokeWidth={2} />
            </span>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#22FFE0] mb-1">
                {t("clubEyebrow")}
              </p>
              <h3 className="text-base font-bold text-white leading-snug">
                {t("clubTitle")}
              </h3>
            </div>
          </div>

          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1 mb-1">
            <span className="stat-num text-3xl font-black text-white leading-none">299€</span>
            <span className="text-xs text-[#cccccc]/50">{t("clubPriceYear")}</span>
            <span className="text-xs text-[#cccccc]/25 mx-1">·</span>
            <span className="text-sm text-[#cccccc]/55">{t("clubPriceMonth")}</span>
          </div>
          {/* Aviso fiscal — IVA aplicado por el proveedor de pago según país */}
          <p className="text-[11px] text-[#cccccc]/55 leading-tight mb-4">
            + IVA o impuesto equivalente
          </p>

          <p className="text-xs text-[#cccccc]/45 leading-relaxed mb-5">
            {t("clubBody")}
          </p>

          <a
            href="mailto:clubes@gmsportstudio.com?subject=Inter%C3%A9s%20en%20plan%20Club%20GMSportStudio"
            className="inline-flex items-center gap-1.5 text-xs font-semibold
                       text-[#22FFE0] hover:text-[#5FFFE8] transition-colors duration-150"
          >
            {t("clubCta")}
            <ArrowRight size={12} strokeWidth={2.2} />
          </a>
        </div>
      </motion.div>

      {/* B2B lead capture (intacto, para >5 cuentas) */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp(0.44)}
        className="mt-8 flex items-start gap-3 max-w-md w-full px-4 py-3.5 rounded-lg border border-white/7 bg-white/3"
      >
        <span className="text-[#22FFE0] mt-0.5 shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </span>
        <p className="text-xs text-[#cccccc]/40 leading-relaxed">
          {t("b2bText")}{" "}
          <a
            href="mailto:clubes@gmsportstudio.com?subject=Oferta%20personalizada%20%2B5%20cuentas"
            className="text-[#22FFE0]/80 hover:text-[#22FFE0] underline underline-offset-2 transition-colors duration-150"
          >
            {t("b2bCta")}
          </a>
        </p>
      </motion.div>

      {/* Footnote Founders — programa cerrado */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp(0.6)}
        className="mt-10 max-w-md text-center"
      >
        <p className="text-[11px] text-[#cccccc]/30 leading-relaxed">
          {t("founderNote")}
        </p>
      </motion.div>
    </section>
  );
}
