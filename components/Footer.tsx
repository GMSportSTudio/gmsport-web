"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

function XIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations("Footer");

  const LEGAL_LINKS = [
    { label: t("legal.avisoLegal"),   href: "/aviso-legal"   },
    { label: t("legal.privacidad"),   href: "/privacidad"    },
    { label: t("legal.terminosBeta"), href: "/terminos-beta" },
    { label: t("legal.cookies"),      href: "/cookies"       },
  ];

  const SOCIAL_LINKS = [
    {
      label: "X / Twitter",
      href:  "https://x.com/josegalandev",
      icon:  <XIcon />,
    },
    {
      label: "Instagram",
      href:  "https://instagram.com/gmsportstudio",
      icon:  <InstagramIcon />,
    },
  ];

  return (
    <footer
      style={{ background: "#111111" }}
      className="border-t border-white/10 mt-auto"
    >
      {/* Columnas principales */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-14 pb-10
                      grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8
                      text-center sm:text-left">

        {/* Col 1 — Marca */}
        <div className="flex flex-col items-center sm:items-start gap-4">
          <Link href="/" aria-label="Inicio">
            <Image
              src="/logo.png"
              alt="GmSportStudio"
              height={36}
              width={36}
              className="h-9 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity duration-300"
            />
          </Link>
          <p className="text-xs text-white/35 leading-relaxed max-w-[220px]">
            {t("tagline")}
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-2 mt-1">
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-8 h-8 rounded-lg
                           text-white/30 hover:text-white
                           bg-white/4 hover:bg-white/8
                           border border-white/8 hover:border-white/20
                           transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 — Legal */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20 mb-3">
            {t("legalTitle")}
          </p>
          {LEGAL_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-white/35 hover:text-white
                         transition-colors duration-200 py-0.5"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Col 3 — Contacto */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20 mb-3">
            {t("contactTitle")}
          </p>
          {[
            { label: t("contact.supportLabel"), href: "mailto:info@gmsportstudio.com",   text: "info@gmsportstudio.com"   },
            { label: t("contact.clubesLabel"),  href: "mailto:clubes@gmsportstudio.com", text: "clubes@gmsportstudio.com" },
            { label: t("contact.ceoLabel"),     href: "mailto:ceo@gmsportstudio.com",    text: "ceo@gmsportstudio.com"    },
          ].map(({ label, href, text }) => (
            <div key={href} className="flex items-baseline gap-2 py-0.5">
              <span className="text-[10px] uppercase tracking-widest text-white/15 w-12 shrink-0">
                {label}
              </span>
              <a
                href={href}
                className="text-sm text-white/35 hover:text-white
                           transition-colors duration-200"
              >
                {text}
              </a>
            </div>
          ))}
          <a
            href="https://forms.gle/Kfj3TwAeuJe88Bc28"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/35 hover:text-[#FF7043]
                       transition-colors duration-200 py-0.5 mt-3"
          >
            {t("betaAccess")}
          </a>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-8
                      flex flex-col sm:flex-row items-center justify-between gap-4
                      border-t border-white/6 pt-6">

        <p className="text-xs text-white/20 order-2 sm:order-1">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>

        {/* System status badge */}
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <span className="relative flex h-2 w-2">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] text-white/30 tracking-wide">
            {t("systemStatus")} <span className="text-emerald-500/70">{t("systemStatusOk")}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
