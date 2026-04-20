"use client";

import { Fragment, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/* ─── Target: 30 de abril 2026, 00:00 Europe/Madrid (CEST = UTC+2) ─── */
const TARGET_MS = new Date("2026-04-30T00:00:00+02:00").getTime();

const EASE = [0.22, 1, 0.36, 1] as const;

type TimeLeft = {
  diff: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function computeTimeLeft(): TimeLeft {
  const diff = Math.max(0, TARGET_MS - Date.now());
  return {
    diff,
    days:    Math.floor( diff /  86_400_000),
    hours:   Math.floor((diff %  86_400_000) / 3_600_000),
    minutes: Math.floor((diff %   3_600_000) /    60_000),
    seconds: Math.floor((diff %      60_000) /     1_000),
  };
}

/* ─── Componente ───────────────────────────────────────────────────── */
export default function CountdownHero() {
  const t = useTranslations("CountdownHero");

  // mounted evita hydration mismatch (el server renderiza distinto del client).
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<TimeLeft>(() => computeTimeLeft());

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(computeTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // Oculto hasta montar en cliente, y oculto cuando la fecha ya pasó.
  if (!mounted || time.diff <= 0) return null;

  const cells: { label: string; value: number }[] = [
    { label: t("labelDays"),  value: time.days    },
    { label: t("labelHours"), value: time.hours   },
    { label: t("labelMin"),   value: time.minutes },
    { label: t("labelSec"),   value: time.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.55, ease: EASE }}
      className="flex items-center gap-2 sm:gap-3"
      role="timer"
      aria-label={t("ariaLabel", { days: time.days, hours: time.hours, minutes: time.minutes, seconds: time.seconds })}
    >
      {cells.map((cell, i) => (
        <Fragment key={cell.label}>
          <div
            className="flex flex-col items-center justify-center gap-1 min-w-[54px] sm:min-w-[62px]
                       px-2 sm:px-2.5 py-2 rounded-lg border border-white/8 bg-white/3
                       backdrop-blur-sm"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 12px rgba(0,0,0,0.25)",
            }}
          >
            <span className="stat-num text-xl sm:text-2xl font-black text-white leading-none tabular-nums">
              {String(cell.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#cccccc]/40">
              {cell.label}
            </span>
          </div>
          {i < cells.length - 1 && (
            <span
              aria-hidden="true"
              className="text-[#FF5722]/60 text-lg sm:text-xl font-black leading-none select-none"
              style={{ marginBottom: "18px" }}
            >
              :
            </span>
          )}
        </Fragment>
      ))}
    </motion.div>
  );
}
