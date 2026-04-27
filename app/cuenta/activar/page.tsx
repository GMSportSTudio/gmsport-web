import type { Metadata } from "next";
import { Suspense } from "react";
import { ActivarClient } from "./ActivarClient";

export const metadata: Metadata = {
  title: "Activar suscripción Fundador — GMSportStudio",
  robots: { index: false, follow: false },
};

export default function ActivarPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#0f1117",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "#555d6e", fontFamily: "sans-serif" }}>Cargando…</p>
        </div>
      }
    >
      <ActivarClient />
    </Suspense>
  );
}
