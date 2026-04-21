/**
 * LogoIcon — Isotipo GmSportStudio renderizado como SVG inline.
 *
 * Sustituye al PNG (/logo.png) en Navbar y Footer. Ventajas:
 * - Escala nítido en cualquier resolución (retina, 4K, print).
 * - 0 requests adicionales: se embebe en el HTML.
 * - Todos los tamaños recalculan glow, strokes y play-triangle
 *   en proporción al prop `size` (en px).
 *
 * Los IDs de los filtros incluyen el `size` para evitar colisiones
 * cuando se renderizan varias instancias en la misma página.
 *
 * Para Satori (ImageResponse server-side) usar una versión plana
 * sin <filter>: ver app/icon.tsx y app/apple-icon.tsx.
 */

type Props = {
  size?: number;
  className?: string;
};

export default function LogoIcon({ size = 48, className = "" }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.43;
  const lineX1 = cx - r;
  const lineX2 = cx + r;
  const semiL = cx - r * 0.42;
  const semiR = cx + r * 0.42;
  const semiOff = r * 0.43;
  const playL = cx - r * 0.14;
  const playR = cx + r * 0.2;
  const playV = r * 0.26;

  // IDs únicos por tamaño → evita colisiones si hay varias instancias.
  const uid = `gms-${Math.round(size)}`;
  const foId = `${uid}-fo`;
  const fbId = `${uid}-fb`;
  const fwId = `${uid}-fw`;
  const clipId = `${uid}-clip`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="GmSportStudio"
      role="img"
    >
      <defs>
        <filter id={foId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={size * 0.018} result="b1" />
          <feGaussianBlur stdDeviation={size * 0.05} result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={fbId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={size * 0.018} result="b1" />
          <feGaussianBlur stdDeviation={size * 0.05} result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={fwId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={size * 0.012} result="b1" />
          <feGaussianBlur stdDeviation={size * 0.035} result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* Fondo negro circular */}
      <circle cx={cx} cy={cy} r={size / 2} fill="#080C10" />

      {/* Resplandores ambientales */}
      <ellipse cx={cx - r * 0.25} cy={cy} rx={r * 0.8} ry={r * 0.7} fill="#FF6B1A" opacity="0.06" />
      <ellipse cx={cx + r * 0.25} cy={cy} rx={r * 0.8} ry={r * 0.7} fill="#1A8FFF" opacity="0.07" />

      {/* Círculo exterior naranja — glow + nítido */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FF6B1A" strokeWidth={size * 0.018} filter={`url(#${foId})`} opacity="0.9" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FF6B1A" strokeWidth={size * 0.009} />

      {/* Línea central — glow + nítido */}
      <line x1={lineX1} y1={cy} x2={lineX2} y2={cy} stroke="#FF6B1A" strokeWidth={size * 0.014} filter={`url(#${foId})`} opacity="0.85" clipPath={`url(#${clipId})`} />
      <line x1={lineX1} y1={cy} x2={lineX2} y2={cy} stroke="#FF6B1A" strokeWidth={size * 0.007} clipPath={`url(#${clipId})`} />

      {/* Semicírculo izquierda azul — glow + nítido */}
      <path d={`M${semiL} ${cy - semiOff} A${semiOff} ${semiOff} 0 0 0 ${semiL} ${cy + semiOff}`} fill="none" stroke="#1A8FFF" strokeWidth={size * 0.016} filter={`url(#${fbId})`} opacity="0.9" />
      <path d={`M${semiL} ${cy - semiOff} A${semiOff} ${semiOff} 0 0 0 ${semiL} ${cy + semiOff}`} fill="none" stroke="#1A8FFF" strokeWidth={size * 0.008} />

      {/* Semicírculo derecha naranja — glow + nítido */}
      <path d={`M${semiR} ${cy - semiOff} A${semiOff} ${semiOff} 0 0 1 ${semiR} ${cy + semiOff}`} fill="none" stroke="#FF6B1A" strokeWidth={size * 0.016} filter={`url(#${foId})`} opacity="0.85" />
      <path d={`M${semiR} ${cy - semiOff} A${semiOff} ${semiOff} 0 0 1 ${semiR} ${cy + semiOff}`} fill="none" stroke="#FF6B1A" strokeWidth={size * 0.008} />

      {/* Punto central azul */}
      <circle cx={cx} cy={cy} r={size * 0.04} fill="#1A8FFF" filter={`url(#${fbId})`} opacity="0.9" />
      <circle cx={cx} cy={cy} r={size * 0.022} fill="#1A8FFF" />

      {/* Triángulo play blanco — glow + nítido */}
      <polygon points={`${playL},${cy - playV} ${playR},${cy} ${playL},${cy + playV}`} fill="none" stroke="#FFFFFF" strokeWidth={size * 0.022} strokeLinejoin="round" filter={`url(#${fwId})`} opacity="0.9" />
      <polygon points={`${playL},${cy - playV} ${playR},${cy} ${playL},${cy + playV}`} fill="none" stroke="#FFFFFF" strokeWidth={size * 0.012} strokeLinejoin="round" />

      {/* Borde exterior muy fino */}
      <circle cx={cx} cy={cy} r={size / 2 - 1} fill="none" stroke="#FF6B1A" strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}
