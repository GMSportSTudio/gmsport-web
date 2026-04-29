"use client";

import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export interface BetaTesterDoc {
  id: string;
  email?: string;
  planTier?: string;
  planStatus?: string;
  isBetaTester?: boolean;
  source?: string;
  invitedBy?: string;
  invitedAt?: { seconds: number; nanoseconds?: number };
  activeUntil?: { seconds: number; nanoseconds?: number };
  // _origin: "license" → registrado, hay licenses/{uid}.
  //          "invitation" → invitado pero aún sin licenses (pendiente de registro).
  _origin?: "license" | "invitation";
}

interface Props {
  tester: BetaTesterDoc;
  onChanged: () => void;
}

function _fmtDate(ts: { seconds: number } | undefined): string {
  if (!ts || typeof ts.seconds !== "number") return "—";
  const d = new Date(ts.seconds * 1000);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function _statusLabel(status: string | undefined): { label: string; color: string } {
  switch (status) {
    case "active":
      return { label: "✓ Activo",    color: "#4ade80" };
    case "pending_registration":
      return { label: "⏳ Sin registrar", color: "#ff6b1a" };
    case "expired":
      return { label: "✗ Caducado",  color: "#f87171" };
    case "paused":
      return { label: "⏸ Pausado",   color: "#facc15" };
    case "cancelled_active_until_period_end":
      return { label: "🟡 Cancelado", color: "#facc15" };
    default:
      return { label: status || "—", color: "#9095a0" };
  }
}

const DEFAULT_EDIT_DAYS = 30;

export function TesterRow({ tester, onChanged }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editDays, setEditDays] = useState<number>(DEFAULT_EDIT_DAYS);

  const status = _statusLabel(tester.planStatus);
  const email = tester.email || tester.id || "—";

  const onRevoke = async () => {
    if (!email) return;
    if (!confirm(`¿Revocar acceso a ${email}? Pierde el acceso inmediatamente.`)) return;
    setBusy(true);
    setError("");
    try {
      const fn = httpsCallable(functions, "revokeBetaTester");
      await fn({ email });
      onChanged();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setBusy(false);
    }
  };

  const onSaveEdit = async () => {
    if (!email) return;
    const days = Number.isFinite(editDays) ? Math.max(1, Math.min(365, editDays)) : DEFAULT_EDIT_DAYS;
    setBusy(true);
    setError("");
    try {
      const fn = httpsCallable(functions, "inviteBetaTester");
      await fn({
        email,
        durationDays: days,
        sendEmail: false,
      });
      setEditing(false);
      onChanged();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setBusy(false);
    }
  };

  const onStartEdit = () => {
    setEditDays(DEFAULT_EDIT_DAYS);
    setError("");
    setEditing(true);
  };

  return (
    <tr style={{ borderBottom: "1px solid #1e2128" }}>
      <td style={{ padding: "12px 16px", color: "#e8eaf0", fontSize: 13 }}>
        {email}
      </td>
      <td style={{ padding: "12px 16px", color: "#9095a0", fontSize: 12 }}>
        {_fmtDate(tester.invitedAt)}
      </td>
      <td style={{ padding: "12px 16px", color: "#9095a0", fontSize: 12 }}>
        {_fmtDate(tester.activeUntil)}
      </td>
      <td style={{ padding: "12px 16px", fontSize: 12, color: status.color }}>
        {status.label}
      </td>
      <td style={{ padding: "12px 16px", color: "#9095a0", fontSize: 12 }}>
        {tester.source || "—"}
      </td>
      <td style={{ padding: "12px 16px", textAlign: "right" }}>
        {editing ? (
          <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
            <input
              type="number"
              min={1}
              max={365}
              value={editDays}
              onChange={e => setEditDays(parseInt(e.target.value || "0", 10))}
              disabled={busy}
              autoFocus
              style={{
                background: "#1e2128",
                border: "1px solid #2a2f3a",
                borderRadius: 6,
                padding: "4px 8px",
                color: "#e8eaf0",
                fontSize: 12,
                width: 64,
                outline: "none",
              }}
            />
            <span style={{ color: "#555d6e", fontSize: 11 }}>días</span>
            <button
              onClick={onSaveEdit}
              disabled={busy}
              style={{
                background: "#ff6b1a",
                border: "none",
                borderRadius: 6,
                padding: "5px 10px",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: busy ? "wait" : "pointer",
                opacity: busy ? 0.6 : 1,
              }}
            >
              {busy ? "…" : "Guardar"}
            </button>
            <button
              onClick={() => { setEditing(false); setError(""); }}
              disabled={busy}
              style={{
                background: "transparent",
                border: "1px solid #2a2f3a",
                borderRadius: 6,
                padding: "5px 10px",
                color: "#9095a0",
                fontSize: 12,
                cursor: busy ? "wait" : "pointer",
              }}
            >
              Cancelar
            </button>
          </span>
        ) : (
          <span style={{ display: "inline-flex", gap: 6 }}>
            <button
              onClick={onStartEdit}
              disabled={busy}
              title="Cambiar la duración (no envía email)"
              style={{
                background: "transparent",
                border: "1px solid #2a4d6b",
                borderRadius: 6,
                padding: "5px 12px",
                color: "#3a8dde",
                fontSize: 12,
                cursor: busy ? "wait" : "pointer",
                opacity: busy ? 0.6 : 1,
              }}
            >
              Editar
            </button>
            {tester.planStatus === "active" && (
              <button
                onClick={onRevoke}
                disabled={busy}
                style={{
                  background: "transparent",
                  border: "1px solid #5c2f37",
                  borderRadius: 6,
                  padding: "5px 12px",
                  color: "#f87171",
                  fontSize: 12,
                  cursor: busy ? "wait" : "pointer",
                  opacity: busy ? 0.6 : 1,
                }}
              >
                {busy ? "…" : "Revocar"}
              </button>
            )}
          </span>
        )}
        {error && (
          <p style={{ color: "#f87171", fontSize: 11, margin: "4px 0 0" }}>{error}</p>
        )}
      </td>
    </tr>
  );
}
