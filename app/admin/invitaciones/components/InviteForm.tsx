"use client";

import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

interface Props {
  onInvited: () => void;
}

export function InviteForm({ onInvited }: Props) {
  const [email, setEmail]         = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["mac", "windows"]);
  const [loading, setLoading]     = useState(false);
  const [message, setMessage]     = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const toggle = (p: string) =>
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || platforms.length === 0) return;
    setLoading(true);
    setMessage(null);
    try {
      const fn = httpsCallable(functions, "createInvitation");
      await fn({ email: email.trim().toLowerCase(), platforms });
      setMessage({ type: "ok", text: `✓ Invitación enviada a ${email}` });
      setEmail("");
      onInvited();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setMessage({ type: "err", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 12, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ color: "#e8eaf0", fontSize: 16, fontWeight: 700, margin: 0 }}>Nueva invitación</h2>
      <input
        type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="email@ejemplo.com" required
        style={{ background: "#1e2128", border: "1px solid #2a2f3a", borderRadius: 8, padding: "10px 14px", color: "#e8eaf0", fontSize: 14, outline: "none" }}
      />
      <div style={{ display: "flex", gap: 16 }}>
        {(["mac", "windows"] as const).map(p => (
          <label key={p} style={{ display: "flex", alignItems: "center", gap: 8, color: "#9095a0", fontSize: 14, cursor: "pointer" }}>
            <input type="checkbox" checked={platforms.includes(p)} onChange={() => toggle(p)}
              style={{ accentColor: "#ff6b1a", width: 16, height: 16 }} />
            {p === "mac" ? "🍎 Mac" : "🪟 Windows"}
          </label>
        ))}
      </div>
      {message && (
        <p style={{ fontSize: 13, margin: 0, color: message.type === "ok" ? "#4ade80" : "#f87171" }}>{message.text}</p>
      )}
      <button type="submit" disabled={loading || platforms.length === 0}
        style={{ background: "#ff6b1a", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Enviando…" : "Invitar →"}
      </button>
    </form>
  );
}
