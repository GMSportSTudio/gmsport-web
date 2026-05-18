// Canary archivado en 1.3.0 (2026-05-18). Componente vaciado — page.tsx
// hace redirect server-side a /descarga, así que este client component
// ya nunca se renderiza. Se conserva el archivo solo hasta el git rm
// del usuario para evitar imports rotos durante el commit.
//
// Histórico: este componente gestionaba el flujo de descarga canary con
// magic-link, detección de chip Mac (silicon/intel) y validación contra
// la callable getDownloadUrl con track="canary". Sustituido por
// DescargaClient.tsx (track único stable desde 1.3.0).

export function DescargaCanaryClient() {
  return null;
}
