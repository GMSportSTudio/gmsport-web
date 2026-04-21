import { ImageResponse } from "next/og";
import { getLogoDataUri } from "@/lib/logo-svg";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple Touch Icon (180x180). Se genera desde el SVG plano; Safari/iOS lo
 * usan al añadir la web a la pantalla de inicio.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080C10",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getLogoDataUri(180)} width={180} height={180} alt="" />
      </div>
    ),
    { ...size }
  );
}
