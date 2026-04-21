import { ImageResponse } from "next/og";
import { getLogoDataUri } from "@/lib/logo-svg";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Favicon generado desde el SVG inline del LogoIcon. A 64x64 el glow se
 * pierde igualmente, así que Satori sirve la versión plana y queda nítida
 * en la pestaña del navegador.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getLogoDataUri(64)} width={64} height={64} alt="" />
      </div>
    ),
    { ...size }
  );
}
