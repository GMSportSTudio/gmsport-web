"use client";

import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export interface Invitation {
  id: string;
  email: string;
  platforms: string[];
  created_at: { seconds: number };
  expires_at: { seconds: number };
  downloads: { ip: string; platform: string; timestamp: { seconds: number } }[];
  max_downloads: number;
  revoked: boolean;
  last_sent_at?: { seconds: number };
}

function statusBadge(inv: Invitation) {
  const now = Date.now() / 1000;
  if (inv.revoked) return { label: "Revocada", color: "#f87171", bg: "rgba(248,113,113,0.1)" };
  if (inv.expires_at.seconds < now) return { label: "Expirada", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" };
  if (inv.downloads.length > 0) return { label: "Usada", color: "#818cf8", bg: "rgba(129,140,248,0.1)" };
  return { label: "Activa", color: "#4ade80", bg: "rgba(74,222,128,0.1)" };
}

interface Props {
  inv: Invitation;
  onChanged: () => void;
}

export function InvitationRow({ inv, onChanged }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading]   = useState<"resend" | "revoke" | null>(null);

  const badge  = statusBadge(inv);
  const lastIp = inv.downloads.at(-1)?.ip ?? "—";

  const handleResend = async () => {
    if (!confirm(`¿Reenviar invitación a ${inv.email}?`)) return;
    setLoading("resend");
    try {
      await httpsCallable(functions, "resendInvitation")({ invitationId: inv.id });
      onChanged();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error");
    } finally { setLoading(null); }
  };

  const handleRevoke = async () => {
    if (!confirm(`¿Revocar acceso de ${inv.email}? Esta acción es inmediata.`)) return;
    setLoading("revoke");
    try {
      await httpsCallable(functions, "revokeInvitation")({ invitationId: inv.id });
      onChanged();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error");
    } finally { setLoading(null); }
  };

  const fmt = (s: number) => new Date(s * 1000).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <tr style={{ borderBottom: "1px solid #1e2128" }}>
        <td style={{ padding: "12px 16px", color: "#e8eaf0", fontSize: 13 }}>{inv.email}</td>
        <td style={{ padding: "12px 16px", color: "#555d6e", fontSize: 12 }}>{fmt(inv.created_at.seconds)}</td>
        <td style={{ padding: "12px 16px", color: "#555d6e", fontSize: 12 }}>{fmt(inv.expires_at.seconds)}</td>
        <td style={{ padding: "12px 16px", fontSize: 12 }}>
          <span style={{ color: inv.downloads.length > 0 ? "#818cf8" : "#555d6e" }}>
            {inv.downloads.length}/{inv.max_downloads}
          </span>
        </td>
        <td style={{ padding: "12px 16px", color: "#555d6e", fontSize: 11, fontFamily: "monospace" }}>{lastIp}</td>
        <td style={{ padding: "12px 16px", fontSize: 12 }}>
          {inv.platforms.map(p => (
            <span key={p} style={{ marginRight: 4 }}>{p === "mac" ? "🍎" : "🪟"}</span>
          ))}
        </td>
        <td style={{ padding: "12px 16px" }}>
          <span style={{ background: badge.bg, color: badge.color, padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
            {badge.label}
          </span>
        </td>
        <td style={{ padding: "12px 16px" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleResend} disabled={!!loading}
              style={{ background: "rgba(255,107,26,0.15)", color: "#ff6b1a", border: "1px solid rgba(255,107,26,0.3)", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>
              {loading === "resend" ? "…" : "Reenviar"}
            </button>
            {!inv.revoked && (
              <button onClick={handleRevoke} disabled={!!loading}
                style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>
                {loading === "revoke" ? "…" : "Revocar"}
              </button>
            )}
            {inv.downloads.length > 0 && (
              <button onClick={() => setExpanded(e => !e)}
                style={{ background: "transparent", color: "#555d6e", border: "none", fontSize: 12, cursor: "pointer" }}>
                {expanded ? "▲" : "▼"}
              </button>
            )}
          </div>
        </td>
      </tr>
      {expanded && inv.downloads.map((d, i) => (
        <tr key={i} style={{ background: "#0f1117", borderBottom: "1px solid #1e2128" }}>
          <td colSpan={8} style={{ padding: "8px 32px", fontSize: 11, color: "#555d6e", fontFamily: "monospace" }}>
            {fmt(d.timestamp.seconds)} · {d.platform === "mac" ? "🍎" : "🪟"} {d.platform} · IP: {d.ip}
          </td>
        </tr>
      ))}
    </>
  );
}
