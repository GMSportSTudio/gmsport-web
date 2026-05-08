import type { Metadata } from "next";
import { Suspense } from "react";
import { DescargaCanaryClient } from "./DescargaCanaryClient";

export const metadata: Metadata = {
  title: "Descarga GMSportStudio Canary",
  robots: { index: false, follow: false },
};

export default function DescargaCanaryPage() {
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
      <DescargaCanaryClient />
    </Suspense>
  );
}
