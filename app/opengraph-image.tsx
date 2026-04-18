import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "GmSportStudio — Software de vídeo análisis deportivo para baloncesto y fútbol";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "flex-start", justifyContent: "center",
          background: "#050505",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Grid de puntos de fondo */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        {/* Glow naranja */}
        <div style={{
          position: "absolute", top: "-20%", right: "-10%",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,87,34,0.18) 0%, transparent 65%)",
          filter: "blur(40px)",
        }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "linear-gradient(135deg, #FF5722, #E64A19)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 900, color: "white",
          }}>G</div>
          <span style={{ fontSize: 28, fontWeight: 700, color: "white", letterSpacing: -0.5 }}>
            GmSport<span style={{ color: "#FF5722" }}>Studio</span>
          </span>
        </div>

        {/* Titular */}
        <div style={{
          fontSize: 64, fontWeight: 900, lineHeight: 1.05,
          letterSpacing: -2, maxWidth: 800,
        }}>
          <span style={{ color: "#FF5722" }}>Deja de perder horas</span>
          <br />
          <span style={{ color: "white" }}>editando. Empieza a</span>
          <br />
          <span style={{ color: "white" }}>ganar partidos.</span>
        </div>

        {/* Descripción */}
        <p style={{
          marginTop: 28, fontSize: 24, color: "rgba(237,237,237,0.5)",
          maxWidth: 680, lineHeight: 1.5,
        }}>
          Telestración · Scouting · YouTube · La alternativa a Hudl y Nacsport
        </p>

        {/* Badge */}
        <div style={{
          marginTop: 40, display: "flex", alignItems: "center", gap: 10,
          padding: "10px 20px", borderRadius: 999,
          border: "1px solid rgba(255,87,34,0.4)",
          background: "rgba(255,87,34,0.12)",
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: "#FF5722",
          }} />
          <span style={{ color: "#FF8A65", fontSize: 16, fontWeight: 600, letterSpacing: 1 }}>
            Beta Founder · Desde 99€ · gmsportstudio.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
