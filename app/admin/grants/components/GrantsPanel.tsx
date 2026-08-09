"use client";

import { useState } from "react";
import Link from "next/link";
import { httpsCallable, FunctionsError } from "firebase/functions";
import { signOut } from "firebase/auth";
import { auth, functions } from "@/lib/firebase";

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
      >(functions, "grantFreeAccess");
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
      >(functions, "revokeFreeAccess");
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
              Inbound <span style={{ color: "#22FFE0" }}>Studio</span>
              <span style={{ color: "#555d6e", fontSize: 16, fontWeight: 400, marginLeft: 12 }}>
                / Admin / Concesiones (free_grant)
              </span>
            </h1>
            <p style={{ color: "#555d6e", fontSize: 13, margin: "6px 0 0" }}>
              Acceso gratuito indefinido para prensa, partners y coaches influyentes.
              {" "}
              <Link href="/admin/testers" style={{ color: "#22FFE0" }}>→ Beta testers</Link>
              {" · "}
              <Link href="/admin/invitaciones" style={{ color: "#22FFE0" }}>→ Invitaciones</Link>
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
                background: (grantStatus === "submitting" || !grantEmail.trim()) ? "#3a3f50" : "#22FFE0",
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

        {/* El panel "Preview Inbound Studio 2.0" vivió aquí hasta el
            2026-08-06. Lo retiro porque la 2.0 dejó de ser preview privada:
            `getSignedDownloadUrl` ya no exige `v2PreviewAccess` y cualquiera
            con licencia activa se la descarga. Las callables que lo
            respaldaban (grantV2Preview / revokeV2Preview) están fuera del
            código desde el commit de beta abierta y se borraron de producción
            en el deploy del 2026-08-06, así que el botón solo podía devolver
            `functions/not-found`.

            Para volver a cerrar el carril hay que restaurar las tres piezas a
            la vez: el gate en distribution.js, las callables en
            admin_grants.js/index.js, y este formulario. */}

        {/* ── Demo de 14 días ────────────────────────────────────────────
            grantTrial deja la licencia PENDIENTE (source=manual_trial, sin
            activeUntil). El reloj arranca cuando la persona pulsa el botón
            de /prueba — ver functions/trials.js. Después caduca sola
            (evaluateAccess mira activeUntil) y el cron scheduledTrialLifecycle
            avisa a falta de 3 días y el día que termina. */}
        <div style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: "28px 32px", marginTop: 24 }}>
          <h2 style={{ color: "#e8eaf0", fontSize: 18, margin: "0 0 4px" }}>🎁 Demo de 14 días</h2>
          <p style={{ color: "#9095a0", fontSize: 13, margin: "0 0 18px", lineHeight: 1.6 }}>
            Da acceso completo durante 14 días — descarga la 1.3 y la 2.0, igual que
            un cliente de pago. Se apaga sola al terminar: no hay que revocar nada ni
            hay cargos automáticos.
            <br />
            <strong style={{ color: "#c0c5ce" }}>Los 14 días no empiezan hoy</strong>: empiezan
            cuando la persona pulse el botón del correo. Tiene 30 días para hacerlo.
            Así, si tarda una semana en verlo, no llega a una prueba de siete días.
            <br />
            Si no tiene cuenta, <strong style={{ color: "#c0c5ce" }}>se la creo yo</strong> y
            el correo le lleva un enlace para poner su contraseña. Solo se permite una
            prueba por email.
          </p>
          <TrialForm />
        </div>

        <p style={{ color: "#3a3f50", fontSize: 11, marginTop: 32, textAlign: "center", lineHeight: 1.6 }}>
          Callables en <code>europe-west1</code>.
          <br />
          Audit log completo en Firestore: <code>license_audit_logs</code> con
          <code> action=free_grant_created</code> /<code> free_grant_revoked</code>.
        </p>
      </div>
    </div>
  );
}

function TrialForm() {
  const [email, setEmail] = useState("");
  const [days, setDays]   = useState(14);
  const [busy, setBusy]   = useState(false);
  const [msg, setMsg]     = useState<string | null>(null);
  const [isErr, setIsErr] = useState(false);
  const [force, setForce] = useState(false);
  // El enlace de activación, para poder reenviárselo a mano. Sin esto, cuando
  // el correo no sale —o cuando alguien deja caducar el suyo y escribe— no
  // había forma de dárselo desde aquí: solo por la consola de Firebase.
  const [enlace, setEnlace] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  // Mensajes de los errores que devuelve grantTrial, para no enseñar el
  // código crudo de la callable.
  const errorText: Record<string, string> = {
    already_granted:    "Este email ya tuvo una prueba. Marca «forzar» si quieres darle otra o reenviarle el enlace.",
    user_not_registered:"No se pudo resolver la cuenta. Reintenta en unos segundos.",
    already_has_access: "Esa cuenta ya tiene acceso activo (suscripción, beta tester o concesión). Darle una prueba se lo quitaría.",
    invalid_email:      "Email no válido.",
    invalid_days:       "Número de días no válido (entre 1 y 90).",
    auth_create_failed: "No se pudo crear la cuenta. Mira los logs de la función y reintenta.",
    activation_link_failed: "No se pudo firmar el enlace de activación (revisa BETA_CONVERSION_JWT_SECRET). No se ha concedido nada.",
  };

  const submit = async () => {
    setMsg(null);
    setEnlace(null);
    setCopiado(false);
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      setIsErr(true); setMsg("Email no válido."); return;
    }
    if (!Number.isFinite(days) || days < 1 || days > 90) {
      setIsErr(true); setMsg("Los días deben estar entre 1 y 90."); return;
    }
    const aviso = force
      ? `¿Dar ${days} días a ${e} FORZANDO? Si ya tenía una prueba, se reemplaza.`
      : `¿Dar ${days} días de prueba a ${e}?`;
    if (!window.confirm(aviso)) return;

    setBusy(true);
    try {
      // Forma real del return de grantTrial (functions/admin_grants.js).
      // Desde 2026-08-09 `activeUntil` llega SIEMPRE null: la prueba nace
      // pendiente y el reloj arranca cuando la persona pulsa el botón del
      // correo. Lo que hay que enseñar aquí es hasta cuándo puede hacerlo.
      const fn = httpsCallable<
        { email: string; days: number; force?: boolean },
        {
          ok?: boolean; days?: number; activeUntil?: number | null;
          pendingUntil?: number; activationUrl?: string; emailSent?: boolean;
          authUserCreated?: boolean; forced?: boolean;
        }
      >(functions, "grantTrial");
      const r = await fn({ email: e, days, force });
      setIsErr(false);
      setEnlace(r.data?.activationUrl ?? null);
      const limite = r.data?.pendingUntil
        ? new Date(r.data.pendingUntil).toLocaleDateString("es-ES",
            { day: "numeric", month: "long", year: "numeric" })
        : null;

      const partes = [
        `✓ Prueba de ${days} días reservada para ${e}. Los ${days} días empiezan ` +
          `cuando abra el enlace, no ahora` +
          (limite ? ` — tiene hasta el ${limite} para hacerlo.` : "."),
      ];
      if (r.data?.authUserCreated) {
        partes.push("Le he creado la cuenta; el enlace para poner su contraseña le llegará cuando active la prueba.");
      }
      if (r.data?.emailSent === false) {
        partes.push("⚠ Pero el correo NO salió: mándale tú el enlace de abajo.");
      } else {
        partes.push("Le ha llegado un correo con las instrucciones.");
      }
      setMsg(partes.join(" "));
      setEmail("");
      setForce(false);
    } catch (err: unknown) {
      console.error("grantTrial", err);
      const fe = err as FunctionsError;
      const key = getErrorKey(err);
      setIsErr(true);
      setMsg(errorText[key] || fe?.message || "Error inesperado. Mira la consola.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          type="email" placeholder="email@delentrenador.com" value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          onKeyDown={(ev) => { if (ev.key === "Enter") submit(); }}
          style={{ ...inputStyle, flex: "3 1 260px" }}
        />
        <input
          type="number" min={1} max={90} value={days}
          onChange={(ev) => setDays(parseInt(ev.target.value, 10))}
          title="Días de prueba"
          style={{ ...inputStyle, flex: "0 0 90px" }}
        />
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={submit} disabled={busy}
          style={{ background: "#22FFE0", color: "#06231F", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}>
          {busy ? "Reservando…" : "Dar prueba"}
        </button>
        <label style={{ color: "#9095a0", fontSize: 13, display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
          <input type="checkbox" checked={force}
            onChange={(ev) => setForce(ev.target.checked)} />
          Forzar (repetir prueba o reenviar enlace caducado)
        </label>
      </div>
      {msg && (
        <p style={{ color: isErr ? "#f87171" : "#22FFE0", fontSize: 13, marginTop: 14, marginBottom: 0, lineHeight: 1.6 }}>
          {msg}
        </p>
      )}
      {enlace && (
        <div style={{ marginTop: 12, background: "#11141a", border: "1px solid #23272f", borderRadius: 8, padding: "10px 12px" }}>
          <p style={{ color: "#9095a0", fontSize: 11, margin: "0 0 6px" }}>
            Enlace de activación (por si tienes que mandárselo tú):
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <code style={{ color: "#c0c5ce", fontSize: 11, wordBreak: "break-all", flex: 1 }}>
              {enlace}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(enlace);
                setCopiado(true);
              }}
              style={{ background: "#23272f", color: "#c0c5ce", border: "1px solid #2a2f3a", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
              {copiado ? "✓ Copiado" : "Copiar"}
            </button>
          </div>
        </div>
      )}
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
