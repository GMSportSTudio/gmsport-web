"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Características", href: "#caracteristicas" },
  { label: "Precios",         href: "#precios" },
  { label: "FAQ",             href: "#faq" },
];

export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  /* Detecta scroll para intensificar el blur al bajar */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Cierra el menú al redimensionar a desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "border-b border-transparent",
      ].join(" ")}
      style={{
        background: scrolled
          ? "rgba(5, 5, 5, 0.75)"
          : "rgba(5, 5, 5, 0.45)",
        backdropFilter:         "blur(18px) saturate(160%)",
        WebkitBackdropFilter:   "blur(18px) saturate(160%)",
      }}
    >
      <nav className="mx-auto max-w-6xl px-5 md:px-8 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <a
          href="/"
          className="flex items-center gap-2 select-none group"
          aria-label="GmSportStudio — inicio"
        >
          {/* Icono decorativo */}
          <span
            aria-hidden="true"
            className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-black
                       bg-gradient-to-br from-[#FF5722] to-[#E64A19]
                       group-hover:scale-110 transition-transform duration-200"
          >
            G
          </span>
          <span className="font-semibold text-base tracking-tight text-white">
            GmSport<span className="text-[#FF5722]">Studio</span>
          </span>
        </a>

        {/* ── Links desktop ── */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="relative text-sm text-[#EDEDED]/70 hover:text-white transition-colors duration-200
                           after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-[#FF5722]
                           after:transition-all after:duration-300 hover:after:w-full"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── CTA + Hamburguesa ── */}
        <div className="flex items-center gap-3">
          {/* Botón Acceso Beta */}
          <motion.a
            href="#beta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                       text-white cursor-pointer select-none
                       bg-gradient-to-r from-[#FF5722] to-[#FF7043]
                       hover:from-[#E64A19] hover:to-[#FF5722]
                       shadow-[0_2px_12px_rgba(255,87,34,0.35)]
                       hover:shadow-[0_4px_20px_rgba(255,87,34,0.5)]
                       transition-shadow duration-300"
          >
            Acceso Beta
          </motion.a>

          {/* Hamburguesa (solo móvil) */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-md
                       hover:bg-white/5 transition-colors duration-200"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-px bg-white rounded-full origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.15 }}
              className="block w-5 h-px bg-white rounded-full"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-px bg-white rounded-full origin-center"
            />
          </button>
        </div>
      </nav>

      {/* ── Menú móvil ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-white/8"
            style={{
              background:           "rgba(5, 5, 5, 0.92)",
              backdropFilter:       "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <ul className="flex flex-col px-5 py-4 gap-1" role="list">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.2 }}
                >
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center py-3 text-sm text-[#EDEDED]/75 hover:text-white
                               border-b border-white/5 transition-colors duration-150"
                  >
                    {label}
                  </a>
                </motion.li>
              ))}

              {/* CTA en móvil */}
              <motion.li
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.06, duration: 0.2 }}
                className="pt-3"
              >
                <a
                  href="#beta"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 rounded-lg text-sm font-medium
                             text-white bg-gradient-to-r from-[#FF5722] to-[#FF7043]
                             shadow-[0_2px_12px_rgba(255,87,34,0.35)]
                             active:scale-95 transition-transform duration-100"
                >
                  Acceso Beta
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
