import type { Metadata } from "next";
import { Suspense } from "react";
import { ReclamarClient } from "./ReclamarClient";

export const metadata: Metadata = {
  title: "Reclamar pago — GMSportStudio",
  robots: { index: false, follow: false },
};

export default function ReclamarPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555d6e", fontFamily: "sans-serif" }}>Cargando…</p>
      </div>
    }>
      <ReclamarClient />
    </Suspense>
  );
}
