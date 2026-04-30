"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";

export function useAdminAuth() {
  const [user, setUser]       = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdTokenResult();
        setIsAdmin(!!token.claims.admin);
        // Set session cookie for middleware
        document.cookie = `gms_session=1; path=/; max-age=${60 * 60 * 8}; SameSite=Strict; Secure`;
      } else {
        setIsAdmin(false);
        document.cookie = "gms_session=; path=/; max-age=0; SameSite=Strict; Secure";
      }
      setLoading(false);
    });
  }, []);

  return { user, isAdmin, loading };
}

interface Props {
  children: React.ReactNode;
}

export function AdminGate({ children }: Props) {
  const { user, isAdmin, loading } = useAdminAuth();
  const [email, setEmail]    = useState("");
  const [password, setPass]  = useState("");
  const [error, setError]    = useState("");
  const [signingIn, setSigning] = useState(false);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1117" }}>
        <p style={{ color: "#555d6e" }}>Cargando…</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setSigning(true);
      setError("");
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch {
        setError("Credenciales incorrectas.");
        setSigning(false);
      }
    };

    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1117" }}>
        <form onSubmit={handleLogin} style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: "40px 48px", width: 360, display: "flex", flexDirection: "column", gap: 16 }}>
          <h1 style={{ color: "#e8eaf0", fontSize: 20, fontWeight: 700, margin: 0 }}>Admin — <span style={{ color: "#ff6b1a" }}>GMSportStudio</span></h1>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="ceo@gmsportstudio.com" required
            style={{ background: "#1e2128", border: "1px solid #2a2f3a", borderRadius: 8, padding: "10px 14px", color: "#e8eaf0", fontSize: 14, outline: "none" }}
          />
          <input
            type="password" value={password} onChange={e => setPass(e.target.value)}
            placeholder="Contraseña" required
            style={{ background: "#1e2128", border: "1px solid #2a2f3a", borderRadius: 8, padding: "10px 14px", color: "#e8eaf0", fontSize: 14, outline: "none" }}
          />
          {error && <p style={{ color: "#ff4444", fontSize: 13, margin: 0 }}>{error}</p>}
          <button type="submit" disabled={signingIn}
            style={{ background: "#ff6b1a", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
            {signingIn ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
