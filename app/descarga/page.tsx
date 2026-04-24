import type { Metadata } from "next";
import { Suspense } from "react";
import { DescargaClient } from "./DescargaClient";

export const metadata: Metadata = {
  title: "Descarga GMSportStudio Beta",
  robots: { index: false, follow: false },
};

export default function DescargaPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555d6e", fontFamily: "sans-serif" }}>Cargando…</p>
      </div>
    }>
      <DescargaClient />
    </Suspense>
  );
}
