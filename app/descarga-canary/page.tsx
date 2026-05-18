// Canary archivado en 1.3.0 (2026-05-18). El motor ffpyplayer validado
// en 28 iteraciones canary pasó a ser stable. Esta página queda como
// shim de redirect server-side; el redirect "real" está en next.config.ts
// (tiene prioridad sobre file-based routing en Next).
//
// Este archivo se elimina en el commit del usuario:
//   git rm -r gmsport-web/app/descarga-canary

import { redirect } from "next/navigation";

export const dynamic = "force-static";

export default function DescargaCanaryArchived() {
  redirect("/descarga");
}
