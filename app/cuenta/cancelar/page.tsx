import type { Metadata } from "next";
import { Suspense } from "react";
import { CancelarClient } from "./CancelarClient";

export const metadata: Metadata = {
  title: "Cancelar suscripción — GMSportStudio",
  robots: { index: false, follow: false },
};

export default function CancelarPage() {
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
      <CancelarClient />
    </Suspense>
  );
}
