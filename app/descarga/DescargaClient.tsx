"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

// Nota Mac (compartida por mac, mac-silicon, mac-intel). Histórico:
//   · Antes (≤ 2026-05-18): mencionaba "Control+clic → Abrir" como flujo
//     para saltarse Gatekeeper. Apple lo eliminó en macOS Sequoia (15) —
//     ahora la única ruta para apps "no verificadas online" es
//     Ajustes → Privacidad y Seguridad → "Abrir igualmente".
//   · Caso disparador (#71, 2026-05-19): Xavier Isern recibe diálogo
//     "no se ha podido verificar" en Sequoia y nuestra nota le decía un
//     atajo que ya no existe. Reescrito + añadido panel desplegable abajo.
const MAC_NOTE =
  "Si en la primera apertura macOS muestra un aviso de seguridad, " +
  "abre el panel \"¿Aparece un aviso de seguridad?\" al final de la página. " +
  "Para verificar integridad: shasum -a 256 ~/Downloads/InboundStudio*.zip " +
  "y comparar con el SHA256 publicado.";

const PLATFORM_LABELS: Record<string, { icon: string; name: string; note: string }> = {
  mac: {
    icon: "🍎",
    name: "macOS",
    note: MAC_NOTE,
  },
  "mac-silicon": {
    icon: "🍎",
    name: "macOS · Apple Silicon (M1/M2/M3/M4)",
    note: MAC_NOTE,
  },
  "mac-intel": {
    icon: "🍎",
    name: "macOS · Intel",
    note: MAC_NOTE,
  },
  windows: {
    icon: "🪟",
    name: "Windows (x64)",
    note:
      "Antes de ejecutar, verifica la integridad en PowerShell: " +
      "Get-FileHash -Algorithm SHA256 InboundStudio*.zip " +
      "y compara con el SHA256 publicado debajo. " +
      "Solo si el hash coincide, ejecuta la app.",
  },
};

/**
 * Panel desplegable con los pasos para autorizar la app en macOS Sequoia
 * (15) la primera vez que el usuario la abre. Apple eliminó el atajo
 * Control+clic → Abrir, y los testers Mac ven ahora diálogos como
 * "no se ha podido verificar" sin ruta obvia para autorizar.
 *
 * Histórico:
 *   · 2026-05-19, caso #71 (Xavier Isern): el cambio de Sequoia pilló
 *     sin documentar. Añadimos este panel para reducir reportes futuros.
 *
 * Se renderiza colapsado por defecto en ambas ramas (Beta token y Paid Auth)
 * cuando la lista de plataformas contiene cualquier variante Mac.
 */
function MacFirstOpenGuide() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: "20px 28px", marginBottom: 16 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%", background: "transparent", border: "none", padding: 0,
          color: "#e8eaf0", fontSize: 15, fontWeight: 700, textAlign: "left",
          cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <span>🛡️ ¿Aparece un aviso de seguridad al abrir en Mac?</span>
        <span style={{ color: "#9095a0", fontSize: 22, lineHeight: 1, marginLeft: 12 }}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div style={{ marginTop: 16, color: "#9095a0", fontSize: 14, lineHeight: 1.7 }}>
          <p style={{ margin: "0 0 14px" }}>
            macOS Sequoia muestra un aviso de seguridad en la primera apertura
            de cualquier app descargada de internet, aunque esté firmada y
            notarizada por Apple. Es normal — solo hay que autorizarla una vez.
            Después se abrirá con doble clic, sin avisos.
          </p>

          <ol style={{ margin: 0, paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}>
              Cierra el diálogo de aviso (<strong style={{ color: "#e8eaf0" }}>&ldquo;Aceptar&rdquo;</strong> o
              {" "}<strong style={{ color: "#e8eaf0" }}>&ldquo;Cancelar&rdquo;</strong>).
              <strong style={{ color: "#e8eaf0" }}> No</strong> mandes la app a la papelera.
            </li>
            <li style={{ marginBottom: 10 }}>
              Abre <strong style={{ color: "#e8eaf0" }}>Ajustes del Sistema</strong>
              {" "}(menú Apple → Ajustes del Sistema, o <code style={{ background: "#0f1117", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>⌘ + Espacio</code> y escribir &ldquo;Ajustes&rdquo;).
            </li>
            <li style={{ marginBottom: 10 }}>
              En la barra lateral, busca <strong style={{ color: "#e8eaf0" }}>Privacidad y Seguridad</strong>.
              Desplázate hasta la sección <strong style={{ color: "#e8eaf0" }}>&ldquo;Seguridad&rdquo;</strong>:
              verás un mensaje sobre Inbound Studio con el botón
              {" "}<strong style={{ color: "#22FFE0" }}>&ldquo;Abrir igualmente&rdquo;</strong>.
            </li>
            <li style={{ marginBottom: 10 }}>
              Pulsa <strong style={{ color: "#22FFE0" }}>&ldquo;Abrir igualmente&rdquo;</strong>.
              macOS te pedirá tu contraseña de Mac o Touch ID.
            </li>
            <li>
              En el diálogo final, pulsa <strong style={{ color: "#22FFE0" }}>&ldquo;Abrir&rdquo;</strong>.
              Inbound Studio arrancará. A partir de aquí podrás abrirla con doble clic normal.
            </li>
          </ol>

          <div style={{ marginTop: 18, padding: "12px 14px", background: "#0f1117", border: "1px solid #23272f", borderRadius: 8 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#9095a0", lineHeight: 1.6 }}>
              <strong style={{ color: "#e8eaf0" }}>¿El botón &ldquo;Abrir igualmente&rdquo; no aparece?</strong>{" "}
              Solo es visible durante unos minutos tras intentar abrir la app.
              Vuelve a hacer doble clic en Inbound Studio, dale a &ldquo;Aceptar&rdquo; en el aviso
              e inmediatamente abre Ajustes → Privacidad y Seguridad. El botón estará ahí.
            </p>
          </div>

          <p style={{ margin: "16px 0 0", fontSize: 13, color: "#555d6e", lineHeight: 1.6 }}>
            ¿Sigue sin funcionar? Escríbenos a{" "}
            <a href="mailto:ceo@inboundbasketballstudio.com" style={{ color: "#22FFE0" }}>ceo@inboundbasketballstudio.com</a>
            {" "}indicando tu versión exacta de macOS
            (menú Apple → Acerca de este Mac → te aparece, p.ej. &ldquo;15.3.1&rdquo;).
          </p>
        </div>
      )}
    </div>
  );
}

function WindowsFirstOpenGuide() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: "20px 28px", marginBottom: 16 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%", background: "transparent", border: "none", padding: 0,
          color: "#e8eaf0", fontSize: 15, fontWeight: 700, textAlign: "left",
          cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <span>💾 En Windows: descomprime el ZIP antes de abrir la app</span>
        <span style={{ color: "#9095a0", fontSize: 22, lineHeight: 1, marginLeft: 12 }}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div style={{ marginTop: 16, color: "#9095a0", fontSize: 14, lineHeight: 1.7 }}>
          <p style={{ margin: "0 0 14px" }}>
            La descarga es un archivo <strong style={{ color: "#e8eaf0" }}>.zip</strong>. Tienes que
            <strong style={{ color: "#e8eaf0" }}> extraerlo entero</strong> antes de abrir la app. Si
            ejecutas el <code style={{ background: "#0f1117", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>.exe</code>
            {" "}desde dentro del zip (sin extraer), Windows no encuentra los archivos que la app necesita
            y verás un error tipo
            {" "}<em style={{ color: "#e8eaf0" }}>&ldquo;Failed to load Python DLL / python312.dll&rdquo;</em>.
          </p>

          <ol style={{ margin: 0, paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}>
              Busca el <strong style={{ color: "#e8eaf0" }}>.zip</strong> descargado (normalmente en la carpeta
              {" "}<strong style={{ color: "#e8eaf0" }}>Descargas</strong>).
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong style={{ color: "#e8eaf0" }}>Clic derecho → &ldquo;Extraer todo…&rdquo;</strong> y pulsa
              {" "}<strong style={{ color: "#e8eaf0" }}>Extraer</strong>.
            </li>
            <li style={{ marginBottom: 10 }}>
              Abre la <strong style={{ color: "#e8eaf0" }}>carpeta que se ha creado</strong> al extraer.
            </li>
            <li>
              Ejecuta <strong style={{ color: "#e8eaf0" }}>InboundStudio.exe</strong> desde esa carpeta
              {" "}(<strong style={{ color: "#e8eaf0" }}>no</strong> desde dentro del zip).
            </li>
          </ol>

          <div style={{ marginTop: 18, padding: "12px 14px", background: "#0f1117", border: "1px solid #23272f", borderRadius: 8 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#9095a0", lineHeight: 1.6 }}>
              <strong style={{ color: "#e8eaf0" }}>¿Sale &ldquo;Windows protegió tu PC&rdquo; (SmartScreen)?</strong>{" "}
              Pulsa <strong style={{ color: "#22FFE0" }}>&ldquo;Más información&rdquo;</strong> y luego
              {" "}<strong style={{ color: "#22FFE0" }}>&ldquo;Ejecutar de todas formas&rdquo;</strong>.
              Es normal en apps nuevas; desaparece a medida que más gente la instala.
            </p>
          </div>

          <p style={{ margin: "16px 0 0", fontSize: 13, color: "#555d6e", lineHeight: 1.6 }}>
            ¿Sigue sin abrir? Escríbenos a{" "}
            <a href="mailto:ceo@inboundbasketballstudio.com" style={{ color: "#22FFE0" }}>ceo@inboundbasketballstudio.com</a>
            {" "}contándonos qué error te aparece.
          </p>
        </div>
      )}
    </div>
  );
}

function formatBytes(b: number) {
  return b > 1_000_000 ? `${(b / 1_000_000).toFixed(0)} MB` : `${(b / 1000).toFixed(0)} KB`;
}

const errorMessages: Record<string, string> = {
  // ── Errores rama Beta (token-based, POST a getDownloadUrl) ────────────────
  invalid_token:        "Este enlace no es válido.",
  expired:              "Este enlace ha expirado. Solicita uno nuevo a ceo@inboundbasketballstudio.com",
  revoked:              "Este enlace ha sido revocado. Contacta con ceo@inboundbasketballstudio.com",
  limit_reached:        "Límite de descargas alcanzado. Contacta con ceo@inboundbasketballstudio.com",
  platform_not_allowed: "Esta plataforma no está permitida para tu invitación.",
  missing_token:        "Falta el token de descarga.",
  missing_params:       "Faltan parámetros en la petición.",
  // ── Errores genéricos ─────────────────────────────────────────────────────
  internal:             "Error interno. Inténtalo de nuevo en unos segundos.",
  network_error:        "Error de red. Comprueba tu conexión e inténtalo de nuevo.",
  // ── Errores rama paid (callable getSignedDownloadUrl) ─────────────────────
  no_active_license:    "No tienes una licencia activa. Si has pagado en Gumroad con otro email, reclama tu pago en /cuenta/reclamar para vincularlo a tu cuenta.",
  email_not_verified:   "Tu email no está verificado todavía. Revisa tu bandeja de entrada para el enlace de verificación. Si no lo encuentras, escríbenos a ceo@inboundbasketballstudio.com.",
  no_session_expired:   "Tu sesión ha expirado. Vuelve a iniciar sesión con el enlace mágico.",
  invalid_platform:     "Plataforma no soportada en este momento.",
  no_release:           "Aún no hay build disponible para esta plataforma. Si crees que es un error, contacta con ceo@inboundbasketballstudio.com.",
  v2_not_invited:       "La preview de Inbound Studio 2.0 es por invitación. Si quieres participar, escríbenos a ceo@inboundbasketballstudio.com.",
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
          .then((result) => {
            localStorage.removeItem(EMAIL_STORAGE_KEY);
            // Limpiar el magic-link de la URL.
            window.history.replaceState(null, "", window.location.pathname);
            // Transición explícita: el listener general de Auth NO se
            // registra en esta rama (early return abajo), así que sin
            // estas dos líneas el authStatus se queda eternamente en
            // "signing_in" y el usuario ve "Completando inicio de sesión…"
            // para siempre. Bug reproducido 2026-05-19 con cuenta founder.
            setAuthUser(result.user);
            setAuthStatus("authenticated");
          })
          .catch((err: unknown) => {
            console.error("signInWithEmailLink", err);
            // Mensaje específico según código Firebase Auth — mucho más
            // accionable para soporte que el genérico "enlace inválido"
            // que devolvía antes (reporte 2026-05-27 Mauricio Faraday).
            const code = (err as { code?: string })?.code || "";
            let msg = "Este enlace no es válido o ha caducado. Solicita uno nuevo.";
            if (code === "auth/expired-action-code") {
              msg = "El enlace ha caducado (más de 1 hora desde que se envió). Solicita uno nuevo.";
            } else if (code === "auth/invalid-action-code") {
              msg = "El enlace ya se ha usado o está malformado. Solicita uno nuevo y úsalo solo una vez.";
            } else if (code === "auth/invalid-email") {
              msg = "El email guardado no coincide con el del enlace. Introduce el mismo email donde recibiste el correo.";
              // En este caso conviene limpiar el localStorage corrupto
              localStorage.removeItem(EMAIL_STORAGE_KEY);
            } else if (code === "auth/network-request-failed") {
              msg = "Sin conexión a internet. Comprueba la red y vuelve a intentarlo.";
            }
            setAuthError(msg);
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
      // Las HttpsError de Firebase Functions llegan al cliente con
      // `error.code` (string estructurado, con o sin prefijo "functions/")
      // y `error.message` (texto legible). Usamos el code para discriminar
      // y, dentro de permission-denied (que tiene 2 escenarios distintos),
      // el mensaje como tiebreaker.
      //
      // Antes del fix de 2026-05-18 esta función solo miraba e.message y
      // buscaba "licencia/license/denied" — los errores en español como
      // "Email no verificado" caían a "network_error" sin razón.
      const httpsErr = e as { code?: string; message?: string };
      const code = String(httpsErr.code || "").toLowerCase().replace(/^functions\//, "");
      const msg  = String(httpsErr.message || "").toLowerCase();

      let mapped: string;
      if (code === "unauthenticated") {
        mapped = "no_session_expired";
      } else if (code === "permission-denied") {
        // 2 escenarios:
        //   · "Email no verificado." → email_not_verified
        //   · "No tienes una licencia activa..." → no_active_license
        if (msg.includes("email") && msg.includes("verif")) {
          mapped = "email_not_verified";
        } else if (msg.includes("invitaci") || msg.includes("preview")) {
          // getSignedDownloadUrl rechaza plataformas v2-* sin v2PreviewAccess
          mapped = "v2_not_invited";
        } else {
          mapped = "no_active_license";
        }
      } else if (code === "not-found") {
        mapped = "no_release";
      } else if (code === "invalid-argument") {
        mapped = "invalid_platform";
      } else if (code === "internal" || code === "unavailable") {
        mapped = "internal";
      } else {
        // Sin código identificable → asumimos red.
        mapped = "network_error";
      }
      setDlError(mapped);
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
            Inbound <span style={{ color: "#22FFE0" }}>Studio</span>
          </h1>
          <p style={{ color: "#555d6e", fontSize: 14, margin: 0 }}>
            {token ? "Acceso Beta — Descarga privada" : "Descarga de tu suscripción"}
          </p>
        </div>

        {/* ─────────── Manual de uso (público, sin auth) ─────────── */}
        {/*
            Tarea #160 (2026-05-24): el manual PDF es contenido comercial /
            onboarding sin secrets. Cualquiera (founders, suscriptores,
            prospects, prensa) puede descargarlo sin login. Visible en TODOS
            los estados (con token, sin token, con auth, sin auth) para que
            no se esconda bajo el flujo de login.
            Rebrand 2026-07: el PDF ahora se sirve desde public/ del propio
            repo (se despliega con la web, sin paso manual de Storage).
            Para actualizarlo en cada release: regenerar con
            scripts/build_manual_pdf.py y sobrescribir
            public/Manual_InboundStudio_latest.pdf. El objeto antiguo de
            Storage (manuals/Manual_GMSportStudio_latest.pdf) se mantiene
            por los enlaces de emails viejos — su contenido ya es Inbound.
        */}
        <a
          href="/Manual_InboundStudio_latest.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            background: "rgba(34, 255, 224, 0.06)",
            border: "1px solid rgba(34, 255, 224, 0.22)",
            borderRadius: 16,
            padding: "18px 24px",
            marginBottom: 24,
            textDecoration: "none",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(34, 255, 224, 0.1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(34, 255, 224, 0.06)"; }}
        >
          <div>
            <p style={{ color: "#e8eaf0", fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>
              📘 Manual de uso (PDF)
            </p>
            <p style={{ color: "#9095a0", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
              Guía completa para coaches — atajos, mesa de montaje,
              pizarra, exports. Acceso libre, sin registro.
            </p>
          </div>
          <span
            style={{
              background: "#22FFE0",
              color: "#fff",
              borderRadius: 10,
              padding: "10px 18px",
              fontWeight: 700,
              fontSize: 13,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Descargar →
          </span>
        </a>

        {/* ─────────── RAMA A · Token Beta (legacy) ─────────── */}
        {token && betaLoading && (
          <p style={{ color: "#555d6e", textAlign: "center" }}>Verificando enlace…</p>
        )}

        {token && !betaLoading && meta?.error && (
          <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 16, padding: 32, textAlign: "center" }}>
            <p style={{ color: "#f87171", fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>
              {errorMessages[meta.error] ?? "Error desconocido."}
            </p>
            <a href="mailto:ceo@inboundbasketballstudio.com" style={{ color: "#22FFE0", fontSize: 14 }}>
              ceo@inboundbasketballstudio.com
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
                          {info.icon} Inbound Studio — {info.name}
                        </p>
                        {pmeta?.size && (
                          <p style={{ color: "#555d6e", fontSize: 12, margin: 0 }}>{formatBytes(pmeta.size)}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleBetaDownload(platform)}
                        disabled={downloading === platform}
                        style={{ background: "#22FFE0", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", opacity: downloading === platform ? 0.7 : 1 }}>
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
                <div style={{ background: "rgba(34,255,224,0.06)", border: "1px solid rgba(34,255,224,0.2)", borderRadius: 12, padding: "12px 18px", marginTop: 4, marginBottom: 16 }}>
                  <p style={{ color: "#9095a0", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                    Hemos detectado que tu Mac es <strong style={{ color: "#22FFE0" }}>{macArch === "silicon" ? "Apple Silicon (M1/M2/M3/M4)" : "Intel"}</strong>.
                    {" "}¿No es correcto?{" "}
                    <button
                      onClick={() => setArchChoiceShown(true)}
                      style={{ background: "transparent", color: "#22FFE0", border: "none", padding: 0, font: "inherit", cursor: "pointer", textDecoration: "underline" }}>
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

              {/* Panel ayuda Gatekeeper Sequoia (caso #71 Xavier Isern). */}
              {platformIds.some((p) => p.startsWith("mac")) && (
                <MacFirstOpenGuide />
              )}
              {platformIds.includes("windows") && (
                <WindowsFirstOpenGuide />
              )}

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <p style={{ color: "#3a3f50", fontSize: 12 }}>
                  Al descargar aceptas las{" "}
                  <Link href="/terminos-beta" style={{ color: "#555d6e" }}>condiciones Beta</Link>.
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
              Introduce tu email para acceder a las descargas. Te enviaremos
              un enlace de acceso único — válido para suscriptores,
              testers y founders.
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
                background: magicLinkSending ? "#3a3f50" : "#22FFE0",
                color: "#fff", fontSize: 15, fontWeight: 700,
                border: "none", borderRadius: 10,
                cursor: magicLinkSending ? "default" : "pointer",
              }}
            >
              {magicLinkSending ? "Enviando…" : "Enviarme enlace de acceso"}
            </button>
            <p style={{ color: "#555d6e", fontSize: 12, margin: "16px 0 0", textAlign: "center", lineHeight: 1.6 }}>
              ¿Aún no tienes cuenta?{" "}
              <Link href="/#precios" style={{ color: "#22FFE0" }}>Ver planes</Link>.
              <br />
              ¿Pagaste con otro email?{" "}
              <Link href="/cuenta/reclamar" style={{ color: "#22FFE0" }}>Reclamar pago</Link>.
              <br />
              ¿Eres tester y tienes problemas para entrar?{" "}
              <a href="mailto:ceo@inboundbasketballstudio.com" style={{ color: "#22FFE0" }}>ceo@inboundbasketballstudio.com</a>.
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
                          {info.icon} Inbound Studio — {info.name}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePaidDownload(platform)}
                        disabled={downloading === platform}
                        style={{ background: "#22FFE0", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", opacity: downloading === platform ? 0.7 : 1 }}>
                        {downloading === platform ? "Preparando…" : "Descargar →"}
                      </button>
                    </div>
                    <p style={{ color: "#555d6e", fontSize: 12, margin: 0, lineHeight: 1.6 }}>{info.note}</p>
                  </div>
                );
              })}

              {macArch !== null && !archChoiceShown && (
                <div style={{ background: "rgba(34,255,224,0.06)", border: "1px solid rgba(34,255,224,0.2)", borderRadius: 12, padding: "12px 18px", marginBottom: 16 }}>
                  <p style={{ color: "#9095a0", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                    Hemos detectado que tu Mac es <strong style={{ color: "#22FFE0" }}>{macArch === "silicon" ? "Apple Silicon (M1/M2/M3/M4)" : "Intel"}</strong>.
                    {" "}¿No es correcto?{" "}
                    <button
                      onClick={() => setArchChoiceShown(true)}
                      style={{ background: "transparent", color: "#22FFE0", border: "none", padding: 0, font: "inherit", cursor: "pointer", textDecoration: "underline" }}>
                      Mostrar las dos opciones
                    </button>
                  </p>
                </div>
              )}

              {/* ── Inbound Studio 2.0 — preview privada ─────────────────
                  Visible para cualquier sesión autenticada: el control de
                  acceso es server-side (getSignedDownloadUrl exige
                  v2PreviewAccess para plataformas v2-*). Sin invitación,
                  el click devuelve permission-denied → v2_not_invited. */}
              <div style={{ background: "rgba(34,255,224,0.04)", border: "1px dashed rgba(34,255,224,0.35)", borderRadius: 16, padding: "20px 24px", marginTop: 24, marginBottom: 16 }}>
                <p style={{ color: "#22FFE0", fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>
                  🧪 Inbound Studio 2.0 — Preview privada
                </p>
                <p style={{ color: "#9095a0", fontSize: 12, margin: "0 0 14px", lineHeight: 1.6 }}>
                  El nuevo motor, mucho más fluido. Solo por invitación: si la tienes,
                  descarga tu plataforma e inicia sesión en la app con esta misma cuenta.
                </p>
                {platformIds.map(platform => {
                  const info = PLATFORM_LABELS[platform];
                  if (!info) return null;
                  const v2Platform = `v2-${platform}`;
                  return (
                    <div key={v2Platform} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", gap: 12 }}>
                      <p style={{ color: "#e8eaf0", fontSize: 13, margin: 0 }}>
                        {info.icon} Inbound 2.0 — {info.name}
                      </p>
                      <button
                        onClick={() => handlePaidDownload(v2Platform)}
                        disabled={downloading === v2Platform}
                        style={{ background: "transparent", color: "#22FFE0", border: "1px solid rgba(34,255,224,0.5)", borderRadius: 8, padding: "8px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", opacity: downloading === v2Platform ? 0.7 : 1 }}>
                        {downloading === v2Platform ? "Preparando…" : "Descargar preview →"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {dlError && (
                <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 12, padding: "14px 18px", marginTop: 8, marginBottom: 8 }}>
                  <p style={{ color: "#f87171", fontSize: 14, margin: 0 }}>
                    {errorMessages[dlError] ?? "Error al iniciar la descarga."}
                  </p>
                </div>
              )}

              {/* Panel ayuda Gatekeeper Sequoia (caso #71 Xavier Isern). */}
              {platformIds.some((p) => p.startsWith("mac")) && (
                <MacFirstOpenGuide />
              )}
              {platformIds.includes("windows") && (
                <WindowsFirstOpenGuide />
              )}

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <p style={{ color: "#3a3f50", fontSize: 12 }}>
                  Soporte: <a href="mailto:ceo@inboundbasketballstudio.com" style={{ color: "#555d6e" }}>ceo@inboundbasketballstudio.com</a>
                </p>
              </div>
            </>
          );
        })()}

      </div>
    </div>
  );
}
