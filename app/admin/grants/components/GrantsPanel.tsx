"use client";

import { useState } from "react";
import Link from "next/link";
import { httpsCallable, FunctionsError } from "firebase/functions";
import { signOut } from "firebase/auth";
import { auth, functionsUS } from "@/lib/firebase";

type GrantStatus = "idle" | "submitting" | "ok" | "err";
type RevokeStatus = "idle" | "submitting" | "ok" | "err";

type PlanTier = "individual_monthly" | "individual_annual";

const PLAN_LABELS: Record<PlanTier, string> = {
  individual_monthly: "Individual Mensual",
  individual_annual:  "Individual Anual",
};

const errorMessages: Record<string, string> = {
  unauthenticated:    "No estás autenticado. Recarga e inicia sesión.",
  "permission-denied": "No tienes permisos para realizar esta acción.",
  "invalid-argument": "Datos inválidos. Revisa email, devices o note.",
  "not-found":        "No se encontró un usuario con ese email.",
  "failed-precondition": "Solo se puede revocar un free_grant activo. Este usuario tiene otro tipo de acceso.",
  "already-exists":   "Este usuario ya tiene un free_grant activo. Para extenderlo, primero revócalo.",
  internal:           "Error interno. Reintenta o consulta los logs de Cloud Functions.",
  unknown:            "Error inesperado. Reintenta.",
};

// ── Helper: formatear FunctionsError code ────────────────────
function getErrorKey(e: unknown): string {
  const code = e instanceof FunctionsError ? e.code : "unknown";
  return code.startsWith("functions/") ? code.slice("functions/".length) : code;
}

export function GrantsPanel() {
  // Grant
  const [grantEmail, setGrantEmail]       = useState("");
  const [grantPlan, setGrantPlan]         = useState<PlanTier>("individual_annual");
  const [grantDevices, setGrantDevices]   = useState<number>(1);
  const [grantNote, setGrantNote]         = useState("");
  const [grantStatus, setGrantStatus]     = useState<GrantStatus>("idle");
  const [grantMsg, setGrantMsg]           = useState<string | null>(null);

  // Revoke
  const [revokeEmail, setRevokeEmail]     = useState("");
  const [revokeReason, setRevokeReason]   = useState("");
  const [revokeStatus, setRevokeStatus]   = useState<RevokeStatus>("idle");
  const [revokeMsg, setRevokeMsg]         = useState<string | null>(null);

  // ── Handler grant ──────────────────────────────────────────
  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setGrantMsg(null);

    const email = grantEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setGrantStatus("err");
      setGrantMsg("Email no válido.");
      return;
    }
    if (!grantDevices || grantDevices < 1 || grantDevices > 5) {
      setGrantStatus("err");
      setGrantMsg("Devices fuera de rango (1-5).");
      return;
    }
    if (grantNote.length > 200) {
      setGrantStatus("err");
      setGrantMsg("Note demasiado larga (máx 200 caracteres).");
      return;
    }

    setGrantStatus("submitting");
    try {
      const fn = httpsCallable<
        { email: string; planTier: PlanTier; devices: number; note: string },
        { ok: boolean; skipped?: string }
      >(functionsUS, "grantFreeAccess");
      const result = await fn({
        email,
        planTier: grantPlan,
        devices: grantDevices,
        note:     grantNote.trim(),
      });
      if (result.data?.skipped === "already_granted") {
        setGrantStatus("ok");
        setGrantMsg(`${email} ya tenía un free_grant activo. Sin cambios (idempotente).`);
      } else {
        setGrantStatus("ok");
        setGrantMsg(`✓ Acceso concedido a ${email} (${PLAN_LABELS[grantPlan]}, ${grantDevices} device${grantDevices > 1 ? "s" : ""}). Email enviado.`);
        // Reset form
        setGrantEmail(""); setGrantNote(""); setGrantDevices(1);
      }
    } catch (e: unknown) {
      console.error("grantFreeAccess", e);
      const key = getErrorKey(e);
      setGrantStatus("err");
      setGrantMsg(errorMessages[key] || errorMessages.unknown);
    }
  };

  // ── Handler revoke ─────────────────────────────────────────
  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    setRevokeMsg(null);

    const email = revokeEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setRevokeStatus("err");
      setRevokeMsg("Email no válido.");
      return;
    }
    if (revokeReason.length > 200) {
      setRevokeStatus("err");
      setRevokeMsg("Reason demasiado larga (máx 200 caracteres).");
      return;
    }
    // Confirmación interactiva
    if (!window.confirm(`¿Revocar acceso free_grant de ${email}?\n\nMotivo: ${revokeReason || "(sin motivo)"}\n\nEsta acción se logea en license_audit_logs y se puede deshacer con grantFreeAccess.`)) {
      return;
    }

    setRevokeStatus("submitting");
    try {
      const fn = httpsCallable<
        { email: string; reason: string },
        { ok: boolean }
      >(functionsUS, "revokeFreeAccess");
      await fn({ email, reason: revokeReason.trim() });
      setRevokeStatus("ok");
      setRevokeMsg(`✓ Acceso revocado a ${email}.`);
      setRevokeEmail(""); setRevokeReason("");
    } catch (e: unknown) {
      console.error("revokeFreeAccess", e);
      const key = getErrorKey(e);
      setRevokeStatus("err");
      setRevokeMsg(errorMessages[key] || errorMessages.unknown);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", padding: "48px 32px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "#e8eaf0", fontSize: 24, fontWeight: 800, margin: 0 }}>
              GMSport<span style={{ color: "#ff6b1a" }}>Studio</span>
              <span style={{ color: "#555d6e", fontSize: 16, fontWeight: 400, marginLeft: 12 }}>
                / Admin / Concesiones (free_grant)
              </span>
            </h1>
            <p style={{ color: "#555d6e", fontSize: 13, margin: "6px 0 0" }}>
              Acceso gratuito indefinido para prensa, partners y coaches influyentes.
              {" "}
              <Link href="/admin/testers" style={{ color: "#ff6b1a" }}>→ Beta testers</Link>
              {" · "}
              <Link href="/admin/invitaciones" style={{ color: "#ff6b1a" }}>→ Invitaciones</Link>
            </p>
          </div>
          <button
            type="button"
            onClick={() => { void signOut(auth); }}
            style={{ background: "transparent", border: "1px solid #2a2f3a", borderRadius: 8, padding: "8px 16px", color: "#9095a0", fontSize: 13, cursor: "pointer" }}
          >
            Cerrar sesión
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* ── Conceder acceso ── */}
          <form
            onSubmit={handleGrant}
            style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}
          >
            <h2 style={{ color: "#e8eaf0", fontSize: 16, fontWeight: 700, margin: 0 }}>
              Conceder acceso
            </h2>
            <p style={{ color: "#555d6e", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
              Acceso indefinido (100 años). Email automático al destinatario.
              Idempotente: si ya tiene free_grant activo, no hace nada.
            </p>

            <label style={{ color: "#9095a0", fontSize: 12, fontWeight: 600 }}>
              Email <span style={{ color: "#f87171" }}>*</span>
            </label>
            <input
              type="email" value={grantEmail} onChange={e => setGrantEmail(e.target.value)}
              placeholder="usuario@ejemplo.com" required autoComplete="off"
              disabled={grantStatus === "submitting"}
              style={inputStyle}
            />

            <label style={{ color: "#9095a0", fontSize: 12, fontWeight: 600 }}>
              Plan
            </label>
            <select
              value={grantPlan} onChange={e => setGrantPlan(e.target.value as PlanTier)}
              disabled={grantStatus === "submitting"}
              style={inputStyle}
            >
              <option value="individual_annual">Individual Anual</option>
              <option value="individual_monthly">Individual Mensual</option>
            </select>

            <label style={{ color: "#9095a0", fontSize: 12, fontWeight: 600 }}>
              Devices (1-5)
            </label>
            <input
              type="number" value={grantDevices} onChange={e => setGrantDevices(parseInt(e.target.value, 10) || 1)}
              min={1} max={5} required
              disabled={grantStatus === "submitting"}
              style={inputStyle}
            />

            <label style={{ color: "#9095a0", fontSize: 12, fontWeight: 600 }}>
              Note <span style={{ color: "#555d6e", fontWeight: 400 }}>(≤200, audit log)</span>
            </label>
            <input
              type="text" value={grantNote} onChange={e => setGrantNote(e.target.value)}
              placeholder="Prensa Marca / Coach Pep / Lointek Gernika..."
              maxLength={200}
              disabled={grantStatus === "submitting"}
              style={inputStyle}
            />

            {grantMsg && (
              <div style={{
                background:  grantStatus === "ok" ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
                border:     `1px solid ${grantStatus === "ok" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
                borderRadius: 8, padding: "10px 14px",
              }}>
                <p style={{ color: grantStatus === "ok" ? "#86efac" : "#f87171", fontSize: 13, margin: 0, lineHeight: 1.4 }}>
                  {grantMsg}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={grantStatus === "submitting" || !grantEmail.trim()}
              style={{
                marginTop: 4, padding: "12px 0",
                background: (grantStatus === "submitting" || !grantEmail.trim()) ? "#3a3f50" : "#ff6b1a",
                color: "#fff", fontSize: 14, fontWeight: 700,
                border: "none", borderRadius: 8,
                cursor: (grantStatus === "submitting" || !grantEmail.trim()) ? "default" : "pointer",
              }}
            >
              {grantStatus === "submitting" ? "Concediendo…" : "Conceder free_grant"}
            </button>
          </form>

          {/* ── Revocar acceso ── */}
          <form
            onSubmit={handleRevoke}
            style={{ background: "#161920", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}
          >
            <h2 style={{ color: "#e8eaf0", fontSize: 16, fontWeight: 700, margin: 0 }}>
              Revocar acceso
            </h2>
            <p style={{ color: "#555d6e", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
              Solo opera sobre <code style={{ color: "#e8eaf0" }}>accessType=&quot;free_grant&quot;</code>.
              NO afecta a paid, trial ni pro_club.
            </p>

            <label style={{ color: "#9095a0", fontSize: 12, fontWeight: 600 }}>
              Email <span style={{ color: "#f87171" }}>*</span>
            </label>
            <input
              type="email" value={revokeEmail} onChange={e => setRevokeEmail(e.target.value)}
              placeholder="usuario@ejemplo.com" required autoComplete="off"
              disabled={revokeStatus === "submitting"}
              style={inputStyle}
            />

            <label style={{ color: "#9095a0", fontSize: 12, fontWeight: 600 }}>
              Motivo <span style={{ color: "#555d6e", fontWeight: 400 }}>(≤200, audit log)</span>
            </label>
            <input
              type="text" value={revokeReason} onChange={e => setRevokeReason(e.target.value)}
              placeholder="Acuerdo terminado / Uso indebido / Inactivo..."
              maxLength={200}
              disabled={revokeStatus === "submitting"}
              style={inputStyle}
            />

            {revokeMsg && (
              <div style={{
                background:  revokeStatus === "ok" ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
                border:     `1px solid ${revokeStatus === "ok" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
                borderRadius: 8, padding: "10px 14px",
              }}>
                <p style={{ color: revokeStatus === "ok" ? "#86efac" : "#f87171", fontSize: 13, margin: 0, lineHeight: 1.4 }}>
                  {revokeMsg}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={revokeStatus === "submitting" || !revokeEmail.trim()}
              style={{
                marginTop: 4, padding: "12px 0",
                background: (revokeStatus === "submitting" || !revokeEmail.trim()) ? "#3a3f50" : "#ef4444",
                color: "#fff", fontSize: 14, fontWeight: 700,
                border: "none", borderRadius: 8,
                cursor: (revokeStatus === "submitting" || !revokeEmail.trim()) ? "default" : "pointer",
              }}
            >
              {revokeStatus === "submitting" ? "Revocando…" : "Revocar free_grant"}
            </button>
          </form>

        </div>

        <p style={{ color: "#3a3f50", fontSize: 11, marginTop: 32, textAlign: "center", lineHeight: 1.6 }}>
          Las callables están en us-central1 (pendiente migración a europe-west1, backlog #40).
          <br />
          Audit log completo en Firestore: <code>license_audit_logs</code> con
          <code> action=free_grant_created</code> /<code> free_grant_revoked</code>.
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background:   "#1e2128",
  border:       "1px solid #2a2f3a",
  borderRadius: 8,
  padding:      "10px 14px",
  color:        "#e8eaf0",
  fontSize:     14,
  outline:      "none",
  width:        "100%",
  boxSizing:    "border-box",
};
