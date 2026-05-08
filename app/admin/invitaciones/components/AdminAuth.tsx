"use client";

// Re-export — la implementación se movió a app/admin/_shared/AdminAuth.tsx
// para que /admin/testers la pueda importar sin "atravesar" el árbol de
// invitaciones. Mantenemos este shim para no romper imports existentes.

export { AdminGate, useAdminAuth } from "@/app/admin/_shared/AdminAuth";
