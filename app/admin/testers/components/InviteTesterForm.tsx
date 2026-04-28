"use client";

import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

interface Props {
  onInvited: () => void;
}

const DEFAULT_DAYS = 95;

export function InviteTesterForm({ onInvited }: Props) {
  const [email, setEmail]       = useState("");
  const [nombre, setNombre]     = useState("");
  const [days, setDays]         = useState<number>(DEFAULT_DAYS);
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const e2 = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e2)) {
      setMessage({ type: "err", text: "Email no válido." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const fn = httpsCallable(functions, "inviteBetaTester");
      const res = await fn({ email: e2, durationDays: days });
      const data = res.data as {
        ok?: boolean;
        mode?: string;
        uid?: string;
        emailHash?: string;
      };
      if (data.mode === "license_created_or_updated") {
        setMessage({ type: "ok", text: `✓ Invitado: ${e2}${nombre ? " (" + nombre + ")" : ""}` });
      } else if (data.mode === "pending_invite") {
        setMessage({
          type: "ok",
          text: `⧗ Pendiente: ${e2}. Se activa cuando se registre con ese email.`,
        });
      } else {
        setMessage({ type: "ok", text: `OK: ${data.mode || "sin mensaje"}` });
      }
      setEmail("");
      setNombre("");
      setDays(DEFAULT_DAYS);
      onInvited();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setMessage({ type: "err", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#161920",
        border: "1px solid #23272f",
        borderRadius: 12,
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <h2 style={{ color: "#e8eaf0", fontSize: 16, fontWeight: 700, margin: 0 }}>
        Invitar Beta Tester
      </h2>
      <p style={{ color: "#555d6e", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
        Tester gratuito durante la Beta. NO se cobra ni se envía a Gumroad.
        Tras invitar, copia el email de{" "}
        <code style={{ background: "#0f1117", padding: "1px 5px", borderRadius: 4, fontSize: 11 }}>
          docs/templates/email_beta_tester.md
        </code>{" "}
        y envíaselo.
      </p>

      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="email@ejemplo.com"
        required
        autoComplete="off"
        style={{
          background: "#1e2128",
          border: "1px solid #2a2f3a",
          borderRadius: 8,
          padding: "10px 14px",
          color: "#e8eaf0",
          fontSize: 14,
          outline: "none",
        }}
      />

      <input
        type="text"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        placeholder="Nombre (opcional, solo para tu referencia)"
        autoComplete="off"
        style={{
          background: "#1e2128",
          border: "1px solid #2a2f3a",
          borderRadius: 8,
          padding: "10px 14px",
          color: "#e8eaf0",
          fontSize: 14,
          outline: "none",
        }}
      />

      <label style={{ color: "#9095a0", fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ minWidth: 110 }}>Días de acceso</span>
        <input
          type="number"
          min={1}
          max={365}
          value={days}
          onChange={e => setDays(parseInt(e.target.value || "95", 10))}
          style={{
            background: "#1e2128",
            border: "1px solid #2a2f3a",
            borderRadius: 8,
            padding: "8px 12px",
            color: "#e8eaf0",
            fontSize: 14,
            outline: "none",
            width: 80,
          }}
        />
        <span style={{ color: "#555d6e", fontSize: 11 }}>
          (cap a 31/07/2026)
        </span>
      </label>

      {message && (
        <p
          style={{
            fontSize: 13,
            margin: 0,
            color: message.type === "ok" ? "#4ade80" : "#f87171",
            lineHeight: 1.5,
          }}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          background: "#ff6b1a",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "11px 0",
          fontWeight: 700,
          fontSize: 14,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Invitando…" : "Invitar →"}
      </button>
    </form>
  );
}
