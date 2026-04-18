"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "gms_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl"
        >
          <div
            className="bento-card px-5 py-4 flex flex-col sm:flex-row items-center gap-4"
            role="dialog"
            aria-label="Aviso de cookies"
          >
            <p className="text-xs text-white/45 leading-relaxed text-center sm:text-left">
              Usamos almacenamiento técnico (Firebase) y analítica sin cookies (Vercel).{" "}
              <Link href="/cookies" className="text-white/60 underline underline-offset-2 hover:text-white transition-colors">
                Más info
              </Link>
            </p>
            <button
              onClick={accept}
              className="shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold
                         bg-[#FF5722] text-white hover:bg-[#FF7043]
                         transition-colors duration-200"
            >
              Entendido
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
