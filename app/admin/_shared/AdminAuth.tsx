"use client";

// AdminAuth — Gate compartido entre /admin/invitaciones y /admin/testers.
//
// Antes vivía dentro de invitaciones/components/ y testers/ lo importaba
// "cruzado". Movido a _shared para que la dependencia sea explícita.
// El export antiguo de invitaciones/components/AdminAuth.tsx se mantiene
// como re-export para no romper imports externos si los hubiera.

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
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
        try {
          const token = await u.getIdTokenResult();
          setIsAdmin(!!token.claims.admin);
        } catch {
          // getIdTokenResult puede fallar si la red está caída justo
          // tras autenticar. Mantenemos el user pero negamos admin
          // para que el gate muestre "sin permisos" en lugar de
          // pantalla en blanco indefinida.
          setIsAdmin(false);
        }
        // Cookie de sesión para el middleware. SameSite=Strict porque
        // el panel admin no se incrusta nunca en cross-site.
        document.cookie = `gms_session=1; path=/; max-age=${60 * 60 * 8}; SameSite=Strict`;
      } else {
        setIsAdmin(false);
        document.cookie = "gms_session=; path=/; max-age=0";
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

  // useEffect en el top-level (no condicional) — antes el handler de
  // login se redefinía dentro de un branch; al pasar a useCallback ya
  // no haría falta, pero mantenemos lo más simple posible.

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1117" }}>
        <p style={{ color: "#555d6e" }}>Cargando…</p>
      </div>
    );
  }

  // Caso 1: usuario autenticado pero SIN claim admin.
  // Antes mostrábamos el form de login otra vez, lo cual era
  // confuso (el usuario reintroduce credenciales correctas y vuelve
  // al mismo sitio). Mostramos un mensaje claro + cerrar sesión.
  if (user && !isAdmin) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1117", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: "40px 48px", width: 360, display: "flex", flexDirection: "column", gap: 16, textAlign: "center" }}>
          <h1 style={{ color: "#e8eaf0", fontSize: 18, fontWeight: 700, margin: 0 }}>
            Acceso restringido
          </h1>
          <p style={{ color: "#9095a0", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
            La cuenta <code style={{ color: "#e8eaf0" }}>{user.email}</code> no
            tiene permisos de administrador.
          </p>
          <button
            type="button"
            onClick={() => { void signOut(auth); }}
            style={{ background: "#22FFE0", color: "#06231F", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  // Caso 2: sin usuario → form de login.
  if (!user) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (signingIn) return;
      setSigning(true);
      setError("");
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // No reseteamos signingIn aquí: onAuthStateChanged va a
        // disparar setLoading(false) y desmontar este nodo. Si lo
        // reseteamos antes, durante el frame intermedio el botón se
        // re-habilita y un usuario impaciente puede hacer doble click.
      } catch {
        setError("Credenciales incorrectas.");
        setSigning(false);
      }
    };

    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1117" }}>
        <form onSubmit={handleLogin} style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: "40px 48px", width: 360, display: "flex", flexDirection: "column", gap: 16 }}>
          <h1 style={{ color: "#e8eaf0", fontSize: 20, fontWeight: 700, margin: 0 }}>Admin — <span style={{ color: "#22FFE0" }}>Inbound Studio</span></h1>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="ceo@gmsportstudio.com" required
            autoComplete="username"
            aria-label="Email"
            style={{ background: "#1e2128", border: "1px solid #2a2f3a", borderRadius: 8, padding: "10px 14px", color: "#e8eaf0", fontSize: 14, outline: "none" }}
          />
          <input
            type="password" value={password} onChange={e => setPass(e.target.value)}
            placeholder="Contraseña" required
            autoComplete="current-password"
            aria-label="Contraseña"
            style={{ background: "#1e2128", border: "1px solid #2a2f3a", borderRadius: 8, padding: "10px 14px", color: "#e8eaf0", fontSize: 14, outline: "none" }}
          />
          {error && <p style={{ color: "#ff4444", fontSize: 13, margin: 0 }} role="alert">{error}</p>}
          <button type="submit" disabled={signingIn}
            style={{ background: "#22FFE0", color: "#06231F", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 15, cursor: signingIn ? "wait" : "pointer", opacity: signingIn ? 0.7 : 1 }}>
            {signingIn ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
