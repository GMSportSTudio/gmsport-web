"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Zap, MessageCircle, Award, Percent, Star, Users, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

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

  const FUTURE_PLANS = [
    { label: t("futurePlanMonthly"), price: t("futurePlanMonthlyPrice") },
    { label: t("futurePlanYearly"),  price: t("futurePlanYearlyPrice")  },
  ];

  return (
    <section
      id="precios"
      ref={ref}
      className="relative px-5 md:px-8 py-24 md:py-32 flex flex-col items-center"
    >
      {/* Glow ambiental */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[20%] top-[10%] bottom-[20%] -z-10"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,87,34,0.09) 0%, transparent 65%)", filter: "blur(40px)" }}
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
        <p className="max-w-sm text-[#cccccc]/45 text-base leading-relaxed">
          {t("subtitle")}
        </p>
      </motion.div>

      {/* Tarjeta principal */}
      <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.15)}
        className="w-full max-w-md relative glow-cta-guide"
      >
        {/* Glow detrás */}
        <div aria-hidden="true" className="absolute -inset-px pointer-events-none"
          style={{
            borderRadius: "9px",
            background: "linear-gradient(135deg, rgba(255,87,34,0.4) 0%, rgba(255,112,67,0.15) 50%, transparent 100%)",
            filter: "blur(1px)",
          }}
        />

        <div className="relative overflow-hidden"
          style={{
            borderRadius: "8px",
            background: "linear-gradient(160deg, #1c1208 0%, #141414 50%, #0f0f0f 100%)",
            border: "1px solid rgba(255,87,34,0.35)",
            boxShadow: "0 0 0 1px rgba(255,87,34,0.12), 0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,87,34,0.07)",
          }}
        >
          {/* Línea superior */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent 5%, rgba(255,87,34,0.75) 50%, transparent 95%)" }}
          />

          {/* Badge */}
          <div className="absolute top-5 right-5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold
                             bg-[#FF5722]/15 border border-[#FF5722]/30 text-[#FF8A65]"
              style={{ borderRadius: "4px" }}>
              <Star size={9} fill="currentColor" />
              {t("badgeLabel")}
            </span>
          </div>

          <div className="p-8 flex flex-col gap-7">

            {/* Nombre del plan */}
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF7043]">
                {t("planEyebrow")}
              </p>
              <h3 className="text-xl font-bold text-white leading-snug">
                {t("planTitle")}
              </h3>
              <p className="text-xs text-[#cccccc]/35 mt-0.5 leading-relaxed">
                {t("planSubtitle")}
              </p>
            </div>

            {/* Precio */}
            <div className="flex items-end gap-2 leading-none">
              <span className="text-[#cccccc]/50 text-xl font-medium mb-1">€</span>
              <span className="stat-num text-7xl font-black text-white">9</span>
              <span className="stat-num text-4xl font-black text-white/70 mb-1">,99</span>
              <div className="flex flex-col mb-2 ml-1">
                <span className="text-xs text-[#cccccc]/40 leading-tight">{t("priceUnitLine1")}</span>
                <span className="text-xs text-[#cccccc]/40 leading-tight">{t("priceUnitLine2")}</span>
              </div>
            </div>

            {/* Separador */}
            <div className="h-px bg-white/6" />

            {/* Beneficios */}
            <ul className="flex flex-col gap-3.5">
              {BENEFITS.map(({ icon, label }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0
                                   bg-[#FF5722]/12 text-[#FF7043] border border-[#FF5722]/20"
                    style={{ borderRadius: "4px" }}>
                    {icon}
                  </span>
                  <span className="text-sm text-[#cccccc]/70 leading-snug">{label}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <motion.a
              href="https://forms.gle/Kfj3TwAeuJe88Bc28"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="relative flex items-center justify-center gap-2 w-full py-3.5
                         text-white font-semibold text-base
                         bg-[#FF5722] hover:bg-[#E64A19]
                         border border-[rgba(255,87,34,0.5)]
                         shadow-[0_1px_4px_rgba(0,0,0,0.5)]
                         hover:shadow-[0_0_0_1px_rgba(255,87,34,0.4),0_4px_20px_rgba(255,87,34,0.35)]
                         transition-all duration-150"
              style={{ borderRadius: "6px" }}
            >
              <span aria-hidden="true"
                className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <Zap size={16} strokeWidth={2.2} />
              {t("cta")}
            </motion.a>

          </div>
        </div>
      </motion.div>

      {/* Plan Club */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp(0.28)}
        className="mt-10 w-full max-w-md"
      >
        <div
          className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f] p-6"
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}
        >
          {/* Accento naranja superior */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 15%, rgba(255,87,34,0.45) 50%, transparent 85%)",
            }}
          />

          <div className="flex items-start gap-3 mb-5">
            <span
              className="w-9 h-9 flex items-center justify-center shrink-0
                         bg-[#FF5722]/12 text-[#FF7043] border border-[#FF5722]/20"
              style={{ borderRadius: "6px" }}
            >
              <Users size={16} strokeWidth={2} />
            </span>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF7043] mb-1">
                {t("clubEyebrow")}
              </p>
              <h3 className="text-base font-bold text-white leading-snug">
                {t("clubTitle")}
              </h3>
            </div>
          </div>

          {/* Precio */}
          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1 mb-4">
            <span className="stat-num text-3xl font-black text-white leading-none">299€</span>
            <span className="text-xs text-[#cccccc]/50">{t("clubPriceYear")}</span>
            <span className="text-xs text-[#cccccc]/25 mx-1">·</span>
            <span className="text-sm text-[#cccccc]/55">{t("clubPriceMonth")}</span>
          </div>

          <p className="text-xs text-[#cccccc]/45 leading-relaxed mb-5">
            {t("clubBody")}
          </p>

          <a
            href="mailto:clubes@gmsportstudio.com?subject=Inter%C3%A9s%20en%20plan%20Club%20GMSportStudio"
            className="inline-flex items-center gap-1.5 text-xs font-semibold
                       text-[#FF7043] hover:text-[#FF8A65] transition-colors duration-150"
          >
            {t("clubCta")}
            <ArrowRight size={12} strokeWidth={2.2} />
          </a>
        </div>
      </motion.div>

      {/* Proximos planes individuales */}
      <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.4)}
        className="mt-10 flex flex-col items-center gap-3"
      >
        <p className="text-xs text-[#cccccc]/20 uppercase tracking-widest">
          {t("futurePlansLabel")}
        </p>
        <div className="flex gap-3">
          {FUTURE_PLANS.map(({ label, price }) => (
            <div key={label}
              className="flex items-center gap-2 px-4 py-2 border border-white/6 bg-white/3"
              style={{ borderRadius: "6px" }}
            >
              <span className="text-xs text-[#cccccc]/25 font-medium">{label}</span>
              <span className="text-xs text-[#cccccc]/20">{price}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#cccccc]/18">{t("futureFounderNote")}</p>
      </motion.div>

      {/* B2B lead capture */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp(0.52)}
        className="mt-8 flex items-start gap-3 max-w-md w-full px-4 py-3.5 rounded-lg border border-white/7 bg-white/3"
      >
        <span className="text-[#FF7043] mt-0.5 shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </span>
        <p className="text-xs text-[#cccccc]/40 leading-relaxed">
          {t("b2bText")}{" "}
          <a
            href="mailto:clubes@gmsportstudio.com?subject=Oferta%20personalizada%20%2B5%20cuentas"
            className="text-[#FF7043]/80 hover:text-[#FF7043] underline underline-offset-2 transition-colors duration-150"
          >
            {t("b2bCta")}
          </a>
        </p>
      </motion.div>
    </section>
  );
}
