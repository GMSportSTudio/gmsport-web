"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
  signOut,
  type User,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "@/lib/firebase";

const FUNCTIONS_BASE = "https://europe-west1-gmsportstudio-53bbf.cloudfunctions.net";
const EMAIL_STORAGE_KEY = "gms_descarga_email";

interface PlatformMeta {
  sha256: string | null;
  size: number | null;
}

interface Meta {
  email: string;
  platforms: string[];
  expiresAt: number;
  downloads: number;
  maxDownloads: number;
  platforms_meta: Record<string, PlatformMeta>;
  error?: string;
}

// Detecta el chip Mac del usuario. Priorización:
//   1. navigator.userAgentData.getHighEntropyValues({ architecture, bitness })
//      — solo Chromium/Edge en Mac y devuelve "arm" o "x86".
//   2. WebGL: el renderer de Apple Silicon empieza por "Apple M". Útil
//      como tiebreaker cuando UA es ambiguo.
//   3. UA fallback: Apple Silicon emite Mac OS X 10_15_7 fijo desde 2020.
async function detectMacArch(): Promise<"silicon" | "intel" | null> {
  if (typeof navigator === "undefined") return null;

  const uaData = (navigator as unknown as {
    userAgentData?: {
      getHighEntropyValues: (h: string[]) => Promise<{ architecture?: string; bitness?: string }>;
    };
  }).userAgentData;
  if (uaData?.getHighEntropyValues) {
    try {
      const v = await uaData.getHighEntropyValues(["architecture", "bitness"]);
      if (v.architecture === "arm") return "silicon";
      if (v.architecture === "x86") return "intel";
    } catch { /* noop */ }
  }

  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (gl) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "");
        if (/Apple\s*M\d/i.test(renderer)) return "silicon";
        if (/Intel|AMD|Radeon|NVIDIA/i.test(renderer)) return "intel";
      }
    }
  } catch { /* noop */ }

  const ua = navigator.userAgent || "";
  if (/Mac OS X 10[._]15[._]7/.test(ua)) return "silicon";
  if (/Mac OS X 1[12345678]/.test(ua))   return "intel";
  return null;
}

const PLATFORM_LABELS: Record<string, { icon: string; name: string; note: string }> = {
  mac: {
    icon: "🍎",
    name: "macOS",
    note:
      "Antes de abrir la app, verifica la integridad: " +
      "shasum -a 256 ~/Downloads/GMSportStudio*.zip " +
      "y compara con el SHA256 publicado debajo. " +
      "Solo si el hash coincide, abre la app con Control+clic → Abrir.",
  },
  "mac-silicon": {
    icon: "🍎",
    name: "macOS · Apple Silicon (M1/M2/M3/M4)",
    note:
      "Antes de abrir la app, verifica la integridad: " +
      "shasum -a 256 ~/Downloads/GMSportStudio*.zip " +
      "y compara con el SHA256 publicado debajo. " +
      "Solo si el hash coincide, abre la app con Control+clic → Abrir.",
  },
  "mac-intel": {
    icon: "🍎",
    name: "macOS · Intel",
    note:
      "Antes de abrir la app, verifica la integridad: " +
      "shasum -a 256 ~/Downloads/GMSportStudio*.zip " +
      "y compara con el SHA256 publicado debajo. " +
      "Solo si el hash coincide, abre la app con Control+clic → Abrir.",
  },
  windows: {
    icon: "🪟",
    name: "Windows (x64)",
    note:
      "Antes de ejecutar, verifica la integridad en PowerShell: " +
      "Get-FileHash -Algorithm SHA256 GMSportStudio*.zip " +
      "y compara con el SHA256 publicado debajo. " +
      "Solo si el hash coincide, ejecuta la app.",
  },
};

function formatBytes(b: number) {
  return b > 1_000_000 ? `${(b / 1_000_000).toFixed(0)} MB` : `${(b / 1000).toFixed(0)} KB`;
}

const errorMessages: Record<string, string> = {
  invalid_token:        "Este enlace no es válido.",
  expired:              "Este enlace ha expirado. Solicita uno nuevo a ceo@gmsportstudio.com",
  revoked:              "Este enlace ha sido revocado. Contacta con ceo@gmsportstudio.com",
  limit_reached:        "Límite de descargas alcanzado. Contacta con ceo@gmsportstudio.com",
  platform_not_allowed: "Esta plataforma no está permitida para tu invitación.",
  missing_token:        "Falta el token de descarga.",
  missing_params:       "Faltan parámetros en la petición.",
  no_release:           "No hay build disponible para esta plataforma. Contacta con ceo@gmsportstudio.com",
  internal:             "Error interno. Inténtalo de nuevo en unos segundos.",
  network_error:        "Error de red. Comprueba tu conexión e inténtalo de nuevo.",
  no_active_license:    "No tienes una licencia activa. Si has pagado en Gumroad, asegúrate de usar el mismo email al iniciar sesión.",
};

type AuthStatus = "loading_auth" | "no_session" | "link_sent" | "signing_in" | "authenticated";

export function DescargaClient() {
  const params = useSearchParams();
  const token  = params.get("token") ?? "";

  // ── Rama Beta token (legacy, intacta) ───────────────────────
  const [meta, setMeta]                 = useState<Meta | null>(null);
  const [betaLoading, setBetaLoading]   = useState(true);
  const [downloading, setDl]            = useState<string | null>(null);
  const [dlError, setDlError]           = useState<string | null>(null);
  const [macArch, setMacArch]           = useState<"silicon" | "intel" | null>(null);
  const [archChoiceShown, setArchChoiceShown] = useState(false);

  // ── Rama Auth paid (nueva) ──────────────────────────────────
  const [authUser, setAuthUser]         = useState<User | null>(null);
  const [authStatus, setAuthStatus]     = useState<AuthStatus>("loading_auth");
  const [authEmail, setAuthEmail]       = useState("");
  const [authError, setAuthError]       = useState<string | null>(null);
  const [magicLinkSending, setMagicLinkSending] = useState(false);

  // ── Effect 1: token Beta flow ───────────────────────────────
  useEffect(() => {
    if (!token) { setBetaLoading(false); return; }
    fetch(`${FUNCTIONS_BASE}/getInvitationMeta?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async r => {
        const data = await r.json();
        if (!r.ok) setMeta({ ...data, error: data.error } as Meta);
        else       setMeta(data as Meta);
      })
      .catch(() => setMeta({ error: "network_error" } as unknown as Meta))
      .finally(() => setBetaLoading(false));
  }, [token]);

  // ── Effect 2: detectar chip Mac (independiente de rama) ─────
  useEffect(() => {
    detectMacArch().then(setMacArch);
  }, []);

  // ── Effect 3: Auth flow (solo si no hay token Beta) ─────────
  useEffect(() => {
    if (token) {
      // Beta tokens no usan Auth — el effect Auth no aplica.
      setAuthStatus("loading_auth"); // valor neutro
      return;
    }

    // Si llegamos con un magic-link en la URL, completar sign-in.
    if (typeof window !== "undefined" && isSignInWithEmailLink(auth, window.location.href)) {
      setAuthStatus("signing_in");
      const storedEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
      if (storedEmail) {
        signInWithEmailLink(auth, storedEmail, window.location.href)
          .then(() => {
            localStorage.removeItem(EMAIL_STORAGE_KEY);
            // Limpiar el magic-link de la URL.
            window.history.replaceState(null, "", window.location.pathname);
          })
          .catch((err: unknown) => {
            console.error("signInWithEmailLink", err);
            setAuthError("Este enlace no es válido o ha caducado. Solicita uno nuevo.");
            setAuthStatus("no_session");
          });
      } else {
        // Magic-link abierto en otro dispositivo (no hay email en localStorage).
        setAuthError("Introduce el email con el que solicitaste el enlace para completar el acceso.");
        setAuthStatus("no_session");
      }
      return;
    }

    // Listener general de Auth.
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
  }, [token]);

  // ── Handler: enviar magic-link ──────────────────────────────
  const handleSendMagicLink = async () => {
    setAuthError(null);
    const cleanEmail = authEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setAuthError("Introduce un email válido.");
      return;
    }
    setMagicLinkSending(true);
    try {
      await sendSignInLinkToEmail(auth, cleanEmail, {
        url: `${window.location.origin}/descarga`,
        handleCodeInApp: true,
      });
      localStorage.setItem(EMAIL_STORAGE_KEY, cleanEmail);
      setAuthStatus("link_sent");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error de red. Inténtalo de nuevo.";
      setAuthError(msg);
    } finally {
      setMagicLinkSending(false);
    }
  };

  // ── Handler: descarga vía token Beta (legacy, POST) ─────────
  const handleBetaDownload = async (platform: string) => {
    setDl(platform);
    setDlError(null);
    try {
      const res = await fetch(`${FUNCTIONS_BASE}/getDownloadUrl`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token, platform }),
      });
      const data = await res.json().catch(() => ({} as Record<string, unknown>));
      if (!res.ok) {
        const code = (data && (data as { error?: string }).error) || "network_error";
        setDlError(code);
        setDl(null);
        return;
      }
      const signedUrl = (data as { url?: string }).url;
      if (!signedUrl) { setDlError("network_error"); setDl(null); return; }
      const a = document.createElement("a");
      a.href = signedUrl;
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => setDl(null), 4000);
    } catch {
      setDlError("network_error");
      setDl(null);
    }
  };

  // ── Handler: descarga vía callable paid (Firebase Auth) ─────
  const handlePaidDownload = async (platform: string) => {
    setDl(platform);
    setDlError(null);
    try {
      const fn = httpsCallable<
        { platform: string; track?: string },
        { url?: string; filename?: string; version?: string }
      >(functions, "getSignedDownloadUrl");
      const result = await fn({ platform, track: "stable" });
      const signedUrl = result.data?.url;
      if (!signedUrl) { setDlError("network_error"); setDl(null); return; }
      const a = document.createElement("a");
      a.href = signedUrl;
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => setDl(null), 4000);
    } catch (e: unknown) {
      console.error("getSignedDownloadUrl callable", e);
      // Distinguir error de licencia inactiva por el mensaje (la callable
      // devuelve permission-denied con texto explicativo).
      const msg = e instanceof Error ? e.message.toLowerCase() : "";
      if (msg.includes("licencia") || msg.includes("license") || msg.includes("denied")) {
        setDlError("no_active_license");
      } else {
        setDlError("network_error");
      }
      setDl(null);
    }
  };

  // ── Lista de plataformas a renderizar (compartida entre ramas) ──
  const buildPlatformList = (rawPlatforms: unknown): string[] => {
    const invPlatforms: string[] = Array.isArray(rawPlatforms)
      ? rawPlatforms as string[]
      : (rawPlatforms && typeof rawPlatforms === "object" ? Object.keys(rawPlatforms) : []);

    return invPlatforms.flatMap(p => {
      if (p !== "mac") return [p];
      if (archChoiceShown) return ["mac-silicon", "mac-intel"];
      if (macArch === "silicon") return ["mac-silicon"];
      if (macArch === "intel")   return ["mac-intel"];
      return ["mac-silicon", "mac-intel"];
    });
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 16px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 600 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ color: "#e8eaf0", fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>
            GMSport<span style={{ color: "#ff6b1a" }}>Studio</span>
          </h1>
          <p style={{ color: "#555d6e", fontSize: 14, margin: 0 }}>
            {token ? "Acceso Beta — Descarga privada" : "Descarga de tu suscripción"}
          </p>
        </div>

        {/* ─────────── RAMA A · Token Beta (legacy) ─────────── */}
        {token && betaLoading && (
          <p style={{ color: "#555d6e", textAlign: "center" }}>Verificando enlace…</p>
        )}

        {token && !betaLoading && meta?.error && (
          <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 16, padding: 32, textAlign: "center" }}>
            <p style={{ color: "#f87171", fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>
              {errorMessages[meta.error] ?? "Error desconocido."}
            </p>
            <a href="mailto:ceo@gmsportstudio.com" style={{ color: "#ff6b1a", fontSize: 14 }}>
              ceo@gmsportstudio.com
            </a>
          </div>
        )}

        {token && !betaLoading && meta && !meta.error && (() => {
          const rawPlatforms = (meta as { platforms: unknown }).platforms;
          const rawMetaObj   = (meta as { platforms_meta?: Record<string, PlatformMeta> }).platforms_meta;
          const metaByPlatform: Record<string, PlatformMeta> =
            rawMetaObj ?? (Array.isArray(rawPlatforms) ? {} : (rawPlatforms as Record<string, PlatformMeta>) ?? {});

          const platformIds = buildPlatformList(rawPlatforms);
          const invPlatforms: string[] = Array.isArray(rawPlatforms)
            ? rawPlatforms as string[]
            : (rawPlatforms && typeof rawPlatforms === "object" ? Object.keys(rawPlatforms) : []);
          const showArchHint = invPlatforms.includes("mac") && macArch !== null && !archChoiceShown;

          return (
            <>
              <div style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: "20px 28px", marginBottom: 16 }}>
                <p style={{ color: "#9095a0", fontSize: 13, margin: 0 }}>
                  ⚠️ Este enlace es <strong style={{ color: "#e8eaf0" }}>privado e intransferible</strong>. No lo compartas.
                </p>
              </div>

              {platformIds.map(platform => {
                const info = PLATFORM_LABELS[platform];
                const pmeta = metaByPlatform[platform] || metaByPlatform[platform.startsWith("mac") ? "mac" : platform];
                if (!info) return null;
                return (
                  <div key={platform} style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: "24px 28px", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div>
                        <p style={{ color: "#e8eaf0", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>
                          {info.icon} GMSportStudio — {info.name}
                        </p>
                        {pmeta?.size && (
                          <p style={{ color: "#555d6e", fontSize: 12, margin: 0 }}>{formatBytes(pmeta.size)}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleBetaDownload(platform)}
                        disabled={downloading === platform}
                        style={{ background: "#ff6b1a", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", opacity: downloading === platform ? 0.7 : 1 }}>
                        {downloading === platform ? "Preparando…" : "Descargar →"}
                      </button>
                    </div>
                    {pmeta?.sha256 && (
                      <div style={{ background: "#0f1117", borderRadius: 8, padding: "10px 14px" }}>
                        <p style={{ color: "#3a3f50", fontSize: 10, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>SHA-256</p>
                        <p style={{ color: "#555d6e", fontSize: 11, fontFamily: "monospace", margin: 0, wordBreak: "break-all" }}>{pmeta.sha256}</p>
                      </div>
                    )}
                    <p style={{ color: "#555d6e", fontSize: 12, margin: "12px 0 0", lineHeight: 1.6 }}>{info.note}</p>
                  </div>
                );
              })}

              {showArchHint && (
                <div style={{ background: "rgba(255,107,26,0.06)", border: "1px solid rgba(255,107,26,0.2)", borderRadius: 12, padding: "12px 18px", marginTop: 4, marginBottom: 16 }}>
                  <p style={{ color: "#9095a0", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                    Hemos detectado que tu Mac es <strong style={{ color: "#ff6b1a" }}>{macArch === "silicon" ? "Apple Silicon (M1/M2/M3/M4)" : "Intel"}</strong>.
                    {" "}¿No es correcto?{" "}
                    <button
                      onClick={() => setArchChoiceShown(true)}
                      style={{ background: "transparent", color: "#ff6b1a", border: "none", padding: 0, font: "inherit", cursor: "pointer", textDecoration: "underline" }}>
                      Mostrar las dos opciones
                    </button>
                  </p>
                </div>
              )}

              {dlError && (
                <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 12, padding: "14px 18px", marginTop: 8, marginBottom: 8 }}>
                  <p style={{ color: "#f87171", fontSize: 14, margin: 0 }}>
                    {errorMessages[dlError] ?? "Error al iniciar la descarga."}
                  </p>
                </div>
              )}

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <p style={{ color: "#3a3f50", fontSize: 12 }}>
                  Al descargar aceptas las{" "}
                  <a href="/terminos-beta" style={{ color: "#555d6e" }}>condiciones Beta</a>.
                </p>
              </div>
            </>
          );
        })()}

        {/* ─────────── RAMA B · Sin token: flujo paid Auth ─────────── */}
        {!token && authStatus === "loading_auth" && (
          <p style={{ color: "#555d6e", textAlign: "center" }}>Cargando…</p>
        )}

        {!token && authStatus === "signing_in" && (
          <p style={{ color: "#555d6e", textAlign: "center" }}>Completando inicio de sesión…</p>
        )}

        {!token && authStatus === "no_session" && (
          <div style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: 32 }}>
            <p style={{ color: "#9095a0", fontSize: 15, lineHeight: 1.7, margin: "0 0 18px" }}>
              Introduce el email con el que pagaste tu suscripción. Te enviaremos
              un enlace de acceso único para descargar la app.
            </p>
            <input
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSendMagicLink(); }}
              placeholder="tu@email.com"
              autoComplete="email"
              disabled={magicLinkSending}
              style={{
                width: "100%", padding: "12px 14px",
                background: "#0f1117", border: "1px solid #2a2f3a",
                borderRadius: 8, color: "#e8eaf0", fontSize: 14,
                marginBottom: 14, boxSizing: "border-box",
              }}
            />
            {authError && (
              <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>{authError}</p>
              </div>
            )}
            <button
              onClick={handleSendMagicLink}
              disabled={magicLinkSending}
              style={{
                width: "100%", padding: "13px 20px",
                background: magicLinkSending ? "#3a3f50" : "#ff6b1a",
                color: "#fff", fontSize: 15, fontWeight: 700,
                border: "none", borderRadius: 10,
                cursor: magicLinkSending ? "default" : "pointer",
              }}
            >
              {magicLinkSending ? "Enviando…" : "Enviarme enlace de acceso"}
            </button>
            <p style={{ color: "#555d6e", fontSize: 12, margin: "16px 0 0", textAlign: "center", lineHeight: 1.6 }}>
              ¿Aún no tienes suscripción?{" "}
              <a href="/#precios" style={{ color: "#ff6b1a" }}>Ver planes</a>.
              <br />
              ¿Pagaste con otro email?{" "}
              <a href="/cuenta/reclamar" style={{ color: "#ff6b1a" }}>Reclamar pago</a>.
            </p>
          </div>
        )}

        {!token && authStatus === "link_sent" && (
          <div style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>✉️</div>
            <h2 style={{ color: "#e8eaf0", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>
              Revisa tu correo
            </h2>
            <p style={{ color: "#9095a0", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Te hemos enviado un enlace a{" "}
              <strong style={{ color: "#e8eaf0" }}>{authEmail}</strong>.
              <br />
              Caduca en <strong>1 hora</strong>. Vuelve aquí desde el enlace.
            </p>
            <button
              onClick={() => { setAuthStatus("no_session"); setAuthError(null); }}
              style={{
                marginTop: 20, padding: "8px 16px",
                background: "transparent", color: "#9095a0",
                border: "1px solid #2a2f3a", borderRadius: 8,
                fontSize: 13, cursor: "pointer",
              }}
            >
              ← Cambiar email
            </button>
          </div>
        )}

        {!token && authStatus === "authenticated" && authUser && (() => {
          // Mostramos las 4 plataformas disponibles. La callable
          // getSignedDownloadUrl ya valida licencia activa: si no la
          // tiene, devuelve permission-denied y mostramos el error.
          // Reusamos el filtro de chip Mac para evitar mostrar ambas
          // cards macOS si tenemos detección concluyente.
          const platformIds = buildPlatformList(["mac", "windows"]);

          return (
            <>
              <div style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: "16px 22px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <p style={{ color: "#9095a0", fontSize: 13, margin: 0 }}>
                  Sesión: <strong style={{ color: "#e8eaf0" }}>{authUser.email}</strong>
                </p>
                <button
                  onClick={() => signOut(auth)}
                  style={{ background: "transparent", color: "#555d6e", border: "1px solid #2a2f3a", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}
                >
                  Cerrar sesión
                </button>
              </div>

              {platformIds.map(platform => {
                const info = PLATFORM_LABELS[platform];
                if (!info) return null;
                return (
                  <div key={platform} style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: "24px 28px", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div>
                        <p style={{ color: "#e8eaf0", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>
                          {info.icon} GMSportStudio — {info.name}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePaidDownload(platform)}
                        disabled={downloading === platform}
                        style={{ background: "#ff6b1a", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", opacity: downloading === platform ? 0.7 : 1 }}>
                        {downloading === platform ? "Preparando…" : "Descargar →"}
                      </button>
                    </div>
                    <p style={{ color: "#555d6e", fontSize: 12, margin: 0, lineHeight: 1.6 }}>{info.note}</p>
                  </div>
                );
              })}

              {macArch !== null && !archChoiceShown && (
                <div style={{ background: "rgba(255,107,26,0.06)", border: "1px solid rgba(255,107,26,0.2)", borderRadius: 12, padding: "12px 18px", marginBottom: 16 }}>
                  <p style={{ color: "#9095a0", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                    Hemos detectado que tu Mac es <strong style={{ color: "#ff6b1a" }}>{macArch === "silicon" ? "Apple Silicon (M1/M2/M3/M4)" : "Intel"}</strong>.
                    {" "}¿No es correcto?{" "}
                    <button
                      onClick={() => setArchChoiceShown(true)}
                      style={{ background: "transparent", color: "#ff6b1a", border: "none", padding: 0, font: "inherit", cursor: "pointer", textDecoration: "underline" }}>
                      Mostrar las dos opciones
                    </button>
                  </p>
                </div>
              )}

              {dlError && (
                <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 12, padding: "14px 18px", marginTop: 8, marginBottom: 8 }}>
                  <p style={{ color: "#f87171", fontSize: 14, margin: 0 }}>
                    {errorMessages[dlError] ?? "Error al iniciar la descarga."}
                  </p>
                </div>
              )}

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <p style={{ color: "#3a3f50", fontSize: 12 }}>
                  Soporte: <a href="mailto:ceo@gmsportstudio.com" style={{ color: "#555d6e" }}>ceo@gmsportstudio.com</a>
                </p>
              </div>
            </>
          );
        })()}

      </div>
    </div>
  );
}
