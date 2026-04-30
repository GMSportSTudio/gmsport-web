"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ─── Tipos ──────────────────────────────────────────────────── */
interface Particle {
  id:     number;
  x:      number;   // % desde la izquierda
  y:      number;   // % desde arriba
  size:   number;   // px
  delay:  number;   // s
  dur:    number;   // s duración del float
  drift:  number;   // px desplazamiento horizontal
}

/* ─── Generador de partículas (determinista por seed) ─────────── */
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateParticles(count: number): Particle[] {
  const rand = seededRand(42);
  return Array.from({ length: count }, (_, i) => ({
    id:    i,
    x:     rand() * 100,
    y:     rand() * 100,
    size:  rand() * 2 + 1,          // 1–3 px
    delay: rand() * 6,              // 0–6 s
    dur:   rand() * 6 + 8,          // 8–14 s
    drift: (rand() - 0.5) * 40,    // ±20 px
  }));
}

const PARTICLES = generateParticles(28);

/* ─── Partícula individual ───────────────────────────────────── */
function FloatingDot({ p }: { p: Particle }) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute rounded-full pointer-events-none"
      style={{
        left:   `${p.x}%`,
        top:    `${p.y}%`,
        width:  p.size,
        height: p.size,
        background: p.id % 4 === 0
          ? "rgba(255,87,34,0.55)"   // 1 de cada 4: naranja
          : "rgba(255,255,255,0.18)", // el resto: blanco tenue
      }}
      animate={{
        y:       [0, -p.dur * 4, 0],
        x:       [0, p.drift,    0],
        opacity: [0, 0.7,        0],
        scale:   [0.6, 1,       0.6],
      }}
      transition={{
        duration: p.dur,
        delay:    p.delay,
        repeat:   Infinity,
        ease:     "easeInOut",
      }}
    />
  );
}

/* ─── Glow que sigue al cursor ────────────────────────────────── */
function CursorGlow() {
  const rawX = useMotionValue(-1000);
  const rawY = useMotionValue(-1000);

  /* Spring para que el glow "flote" con inercia suave */
  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.8 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.8 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [rawX, rawY]);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ x: 0, y: 0 }}
    >
      <motion.div
        className="absolute"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width:  600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(255,87,34,0.07) 0%, rgba(255,87,34,0.03) 35%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </motion.div>
  );
}

/* ─── Sync con prefers-reduced-motion ────────────────────────── */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(cb: () => void): () => void {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/* ─── Componente principal ───────────────────────────────────── */
export default function BackgroundEffects() {
  /* Evita hidratación incorrecta con framer-motion: solo renderiza en el cliente. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // useSyncExternalStore reacciona si el usuario cambia su preferencia
  // de reduce-motion en caliente. Antes se hacía con useRef, lo que rompía
  // la regla "no acceder a refs en render" y dejaba el primer paint con
  // efectos activos aunque el usuario tuviera reduce-motion activado.
  const prefersReduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  if (!mounted) return null;

  return (
    <>
      {/* Glow cursor */}
      {!prefersReduced && <CursorGlow />}

      {/* Partículas flotantes */}
      {!prefersReduced && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        >
          {PARTICLES.map((p) => (
            <FloatingDot key={p.id} p={p} />
          ))}
        </div>
      )}
    </>
  );
}
