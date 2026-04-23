/**
 * Versión "plana" del logo GmSportStudio para usarse en contextos donde
 * Satori (ImageResponse de Next.js) renderiza el SVG: favicons, apple-icon,
 * opengraph-image.
 *
 * Satori no soporta <filter> ni <feGaussianBlur>, así que esta versión omite
 * los glows y deja sólo las formas sólidas. Para la UI del navegador seguimos
 * usando components/LogoIcon.tsx que sí tiene los glows activos.
 */

export function getLogoSvgString(size: number): string {
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

  const strokeOuter = Math.max(1, size * 0.014);
  const strokeCenter = Math.max(1, size * 0.011);
  const strokeSemi = Math.max(1, size * 0.012);
  const strokePlay = Math.max(1.2, size * 0.018);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${cx}" cy="${cy}" r="${size / 2}" fill="#080C10"/>
  <ellipse cx="${cx - r * 0.25}" cy="${cy}" rx="${r * 0.8}" ry="${r * 0.7}" fill="#FF6B1A" opacity="0.12"/>
  <ellipse cx="${cx + r * 0.25}" cy="${cy}" rx="${r * 0.8}" ry="${r * 0.7}" fill="#1A8FFF" opacity="0.12"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#FF6B1A" stroke-width="${strokeOuter}"/>
  <line x1="${lineX1}" y1="${cy}" x2="${lineX2}" y2="${cy}" stroke="#FF6B1A" stroke-width="${strokeCenter}"/>
  <path d="M${semiL} ${cy - semiOff} A${semiOff} ${semiOff} 0 0 0 ${semiL} ${cy + semiOff}" fill="none" stroke="#1A8FFF" stroke-width="${strokeSemi}"/>
  <path d="M${semiR} ${cy - semiOff} A${semiOff} ${semiOff} 0 0 1 ${semiR} ${cy + semiOff}" fill="none" stroke="#FF6B1A" stroke-width="${strokeSemi}"/>
  <circle cx="${cx}" cy="${cy}" r="${Math.max(1.5, size * 0.04)}" fill="#1A8FFF"/>
  <polygon points="${playL},${cy - playV} ${playR},${cy} ${playL},${cy + playV}" fill="none" stroke="#FFFFFF" stroke-width="${strokePlay}" stroke-linejoin="round"/>
</svg>`;
}

/**
 * Devuelve el SVG como data-URI listo para <img src={...}> (compatible con
 * Satori / ImageResponse).
 */
export function getLogoDataUri(size: number): string {
  const svg = getLogoSvgString(size);
  const bytes = new TextEncoder().encode(svg);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const base64 = btoa(binary);
  return `data:image/svg+xml;base64,${base64}`;
}
