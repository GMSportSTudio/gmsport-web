"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
  signOut,
  type User,
} from "firebase/auth";
import { httpsCallable, FunctionsError } from "firebase/functions";
import { auth, functions } from "@/lib/firebase";

const EMAIL_STORAGE_KEY = "gms_reclamar_email";

type AuthStatus = "loading" | "no_session" | "link_sent" | "signing_in" | "authenticated";
type ClaimStatus = "idle" | "submitting" | "success" | "error";

const claimErrorMessages: Record<string, string> = {
  unauthenticated:    "Inicia sesión con tu email antes de reclamar.",
  "invalid-argument": "Faltan datos. Asegúrate de pegar la licenseKey completa.",
  "not-found":        "No encontramos ningún pago con esa licenseKey. Comprueba el email que recibiste de Gumroad.",
  "permission-denied": "Esa licenseKey no coincide con ningún pago activo. Revisa el código exacto.",
  "already-exists":   "Este pago ya está vinculado a otra cuenta. Escribe a ceo@gmsportstudio.com.",
  "resource-exhausted": "Demasiados intentos. Espera una hora antes de probar de nuevo.",
  "failed-precondition": "Este pago no está activo (reembolsado o revocado). Contacta con ceo@gmsportstudio.com.",
  internal:           "Error interno. Inténtalo en unos minutos.",
  unknown:            "Error inesperado. Inténtalo de nuevo.",
};

export function ReclamarClient() {
  // Auth
  const [authUser, setAuthUser]   = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [authEmail, setAuthEmail] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [linkSending, setLinkSending] = useState(false);

  // Claim form
  const [licenseKey, setLicenseKey] = useState("");
  const [saleId, setSaleId]         = useState("");
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>("idle");
  const [claimError, setClaimError]   = useState<string | null>(null);
  const [claimResult, setClaimResult] = useState<{ planTier?: string; activeUntil?: number } | null>(null);

  // ── Effect Auth ─────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && isSignInWithEmailLink(auth, window.location.href)) {
      setAuthStatus("signing_in");
      const stored = localStorage.getItem(EMAIL_STORAGE_KEY);
      if (stored) {
        signInWithEmailLink(auth, stored, window.location.href)
          .then(() => {
            localStorage.removeItem(EMAIL_STORAGE_KEY);
            window.history.replaceState(null, "", window.location.pathname);
          })
          .catch(() => {
            setAuthError("El enlace no es válido o ha caducado.");
            setAuthStatus("no_session");
          });
      } else {
        setAuthError("Introduce el email con el que solicitaste el enlace para completar el acceso.");
        setAuthStatus("no_session");
      }
      return;
    }

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        setAuthStatus("authenticated");
      } else {
        setAuthUser(null);
        setAuthStatus("no_session");
      }
    });
    return () => unsub();
  }, []);

  // ── Handler: enviar magic-link ──────────────────────────────
  const handleSendMagicLink = async () => {
    setAuthError(null);
    const cleanEmail = authEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setAuthError("Introduce un email válido.");
      return;
    }
    setLinkSending(true);
    try {
      await sendSignInLinkToEmail(auth, cleanEmail, {
        url: `${window.location.origin}/cuenta/reclamar`,
        handleCodeInApp: true,
      });
      localStorage.setItem(EMAIL_STORAGE_KEY, cleanEmail);
      setAuthStatus("link_sent");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error de red. Inténtalo de nuevo.";
      setAuthError(msg);
    } finally {
      setLinkSending(false);
    }
  };

  // ── Handler: reclamar pago ──────────────────────────────────
  const handleClaim = async () => {
    setClaimError(null);
    const cleanKey = licenseKey.trim().toUpperCase();
    const cleanSaleId = saleId.trim();
    if (!cleanKey || cleanKey.length < 6) {
      setClaimError("Introduce la licenseKey completa (la que recibiste de Gumroad).");
      return;
    }
    setClaimStatus("submitting");
    try {
      const fn = httpsCallable<
        { licenseKey: string; saleId?: string },
        { ok: boolean; planTier?: string; activeUntil?: number }
      >(functions, "claimGumroadPurchase");
      const args: { licenseKey: string; saleId?: string } = { licenseKey: cleanKey };
      if (cleanSaleId) args.saleId = cleanSaleId;
      const result = await fn(args);
      setClaimResult({
        planTier: result.data?.planTier,
        activeUntil: result.data?.activeUntil,
      });
      setClaimStatus("success");
    } catch (e: unknown) {
      console.error("claimGumroadPurchase", e);
      const code = e instanceof FunctionsError ? e.code : "unknown";
      const cleanCode = code.startsWith("functions/") ? code.slice("functions/".length) : code;
      setClaimError(claimErrorMessages[cleanCode] || claimErrorMessages.unknown);
      setClaimStatus("error");
    }
  };

  const formatDate = (epochSec?: number): string => {
    if (!epochSec) return "—";
    return new Date(epochSec * 1000).toLocaleDateString("es-ES", {
      day: "2-digit", month: "long", year: "numeric",
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif", color: "#e8eaf0" }}>
      <div style={{ width: "100%", maxWidth: 560, background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: 32 }}>
        <p style={{ color: "#22FFE0", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>
          Reclamar pago
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
          Inbound <span style={{ color: "#22FFE0" }}>Studio</span>
        </h1>

        {/* ── Sub-pantalla: cargando auth ── */}
        {authStatus === "loading" && (
          <p style={{ color: "#9095a0", fontSize: 14, marginTop: 18 }}>Cargando…</p>
        )}

        {authStatus === "signing_in" && (
          <p style={{ color: "#9095a0", fontSize: 14, marginTop: 18 }}>Completando inicio de sesión…</p>
        )}

        {/* ── Sub-pantalla: sin sesión, pedir magic-link ── */}
        {authStatus === "no_session" && (
          <>
            <p style={{ color: "#9095a0", fontSize: 15, lineHeight: 1.7, margin: "16px 0 18px" }}>
              Si pagaste en Gumroad con un email distinto al que usaste para registrarte en
              Inbound Studio, aquí puedes vincular tu pago a tu cuenta.
              <br /><br />
              Primero inicia sesión con el email <strong style={{ color: "#e8eaf0" }}>de tu cuenta
              Inbound Studio</strong> (no el de Gumroad).
            </p>
            <input
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSendMagicLink(); }}
              placeholder="tu@email.com"
              autoComplete="email"
              disabled={linkSending}
              style={{ width: "100%", padding: "12px 14px", background: "#0f1117", border: "1px solid #2a2f3a", borderRadius: 8, color: "#e8eaf0", fontSize: 14, marginBottom: 14, boxSizing: "border-box" }}
            />
            {authError && (
              <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>{authError}</p>
              </div>
            )}
            <button
              onClick={handleSendMagicLink}
              disabled={linkSending}
              style={{ width: "100%", padding: "13px 20px", background: linkSending ? "#3a3f50" : "#22FFE0", color: "#fff", fontSize: 15, fontWeight: 700, border: "none", borderRadius: 10, cursor: linkSending ? "default" : "pointer" }}
            >
              {linkSending ? "Enviando…" : "Enviarme enlace de acceso"}
            </button>
            <p style={{ color: "#555d6e", fontSize: 12, margin: "16px 0 0", textAlign: "center" }}>
              ¿Tienes dudas? Escribe a{" "}
              <a href="mailto:ceo@gmsportstudio.com" style={{ color: "#22FFE0", textDecoration: "none" }}>
                ceo@gmsportstudio.com
              </a>
            </p>
          </>
        )}

        {/* ── Sub-pantalla: enlace enviado ── */}
        {authStatus === "link_sent" && (
          <div style={{ textAlign: "center", marginTop: 18 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>✉️</div>
            <h2 style={{ color: "#e8eaf0", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>
              Revisa tu correo
            </h2>
            <p style={{ color: "#9095a0", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Te hemos enviado un enlace a <strong style={{ color: "#e8eaf0" }}>{authEmail}</strong>.
              <br />Caduca en <strong>1 hora</strong>.
            </p>
            <button
              onClick={() => { setAuthStatus("no_session"); setAuthError(null); }}
              style={{ marginTop: 20, padding: "8px 16px", background: "transparent", color: "#9095a0", border: "1px solid #2a2f3a", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
            >
              ← Cambiar email
            </button>
          </div>
        )}

        {/* ── Sub-pantalla: autenticado, formulario reclamar ── */}
        {authStatus === "authenticated" && authUser && claimStatus !== "success" && (
          <>
            <div style={{ background: "#0f1117", border: "1px solid #2a2f3a", borderRadius: 8, padding: "10px 14px", marginTop: 18, marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <p style={{ color: "#9095a0", fontSize: 13, margin: 0 }}>
                Sesión: <strong style={{ color: "#e8eaf0" }}>{authUser.email}</strong>
              </p>
              <button
                onClick={() => signOut(auth)}
                style={{ background: "transparent", color: "#555d6e", border: "1px solid #2a2f3a", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}
              >
                Salir
              </button>
            </div>

            <p style={{ color: "#9095a0", fontSize: 15, lineHeight: 1.7, margin: "0 0 18px" }}>
              Introduce la <strong style={{ color: "#e8eaf0" }}>licenseKey</strong> de Gumroad para
              vincular el pago a esta cuenta. La recibiste en el email de Gumroad tras pagar.
            </p>

            <label style={{ display: "block", color: "#9095a0", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              licenseKey de Gumroad <span style={{ color: "#f87171" }}>*</span>
            </label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              autoComplete="off"
              autoCapitalize="characters"
              disabled={claimStatus === "submitting"}
              style={{ width: "100%", padding: "12px 14px", background: "#0f1117", border: "1px solid #2a2f3a", borderRadius: 8, color: "#e8eaf0", fontSize: 14, marginBottom: 14, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", letterSpacing: "0.5px", boxSizing: "border-box" }}
            />

            <label style={{ display: "block", color: "#9095a0", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              saleId (opcional, acelera la búsqueda)
            </label>
            <input
              type="text"
              value={saleId}
              onChange={(e) => setSaleId(e.target.value)}
              placeholder="abc123def456"
              autoComplete="off"
              disabled={claimStatus === "submitting"}
              style={{ width: "100%", padding: "12px 14px", background: "#0f1117", border: "1px solid #2a2f3a", borderRadius: 8, color: "#e8eaf0", fontSize: 13, marginBottom: 18, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", boxSizing: "border-box" }}
            />

            {claimError && (
              <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                <p style={{ color: "#f87171", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{claimError}</p>
              </div>
            )}

            <button
              onClick={handleClaim}
              disabled={claimStatus === "submitting" || !licenseKey.trim()}
              style={{ width: "100%", padding: "14px 20px", background: (claimStatus === "submitting" || !licenseKey.trim()) ? "#3a3f50" : "#22FFE0", color: "#fff", fontSize: 15, fontWeight: 700, border: "none", borderRadius: 10, cursor: (claimStatus === "submitting" || !licenseKey.trim()) ? "default" : "pointer", letterSpacing: "-0.2px" }}
            >
              {claimStatus === "submitting" ? "Verificando…" : "Reclamar pago"}
            </button>

            <p style={{ color: "#555d6e", fontSize: 12, marginTop: 18, textAlign: "center", lineHeight: 1.6 }}>
              Rate limit: 5 intentos por hora.
              <br />
              ¿No encuentras tu licenseKey? Busca el email de Gumroad o escribe a{" "}
              <a href="mailto:ceo@gmsportstudio.com" style={{ color: "#22FFE0", textDecoration: "none" }}>
                ceo@gmsportstudio.com
              </a>
              .
            </p>
          </>
        )}

        {/* ── Sub-pantalla: éxito ── */}
        {authStatus === "authenticated" && claimStatus === "success" && (
          <>
            <div style={{ background: "#1f3a25", border: "1px solid #2f5c37", color: "#8aff95", padding: "16px 18px", borderRadius: 10, fontSize: 14, lineHeight: 1.6, margin: "20px 0 16px" }}>
              <strong>Pago vinculado correctamente.</strong>
              <br />
              Tu plan <strong>{claimResult?.planTier || "individual"}</strong> ya está activo.
              {claimResult?.activeUntil && (
                <>
                  <br />Acceso hasta el <strong>{formatDate(claimResult.activeUntil)}</strong>.
                </>
              )}
            </div>
            <p style={{ color: "#9095a0", fontSize: 14, lineHeight: 1.7, margin: "12px 0 18px" }}>
              Ya puedes descargar la app desde tu cuenta:
            </p>
            <Link
              href="/descarga"
              style={{ display: "block", width: "100%", padding: "13px 20px", background: "#22FFE0", color: "#fff", fontSize: 15, fontWeight: 700, textAlign: "center", textDecoration: "none", borderRadius: 10, boxSizing: "border-box" }}
            >
              Ir a la descarga →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
