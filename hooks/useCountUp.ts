import { useState, useEffect } from "react";

/**
 * Anima un número desde 0 hasta `target` con easing cúbico.
 * Se activa cuando `inView` es true (y opcionalmente tras un `delay` en ms).
 */
export function useCountUp(
  target: number,
  { duration = 1400, inView = true, delay = 0, decimals = 0 } = {}
): string {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let raf: number;
    const timer = setTimeout(() => {
      let startTime: number | null = null;

      const animate = (ts: number) => {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        setValue(parseFloat((eased * target).toFixed(decimals)));
        if (progress < 1) raf = requestAnimationFrame(animate);
      };

      raf = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [inView, target, duration, delay, decimals]);

  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
}
