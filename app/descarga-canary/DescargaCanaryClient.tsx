"use client";

import { useEffect, useState } from "react";
import { auth, functions } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";

// Versión canary que servimos a los testers en este lanzamiento.
// Si en el futuro queremos servir la última automáticamente, podemos
// pasarla como '' al callable y que use canary/latest.json. Por ahora
// preferimos pinearlo para que el SHA256 mostrado coincida 1:1 con el
// build esperado.
const CANARY_VERSION = "1.3.0-exp15";

// SHA256 de los 3 builds para que el tester pueda verificar antes de abrir.
// Mantener en sync con dist/canary/ tras cada build canary.
const CANARY_SHA256: Record<string, string> = {
  "mac-silicon":
    "29c1f92be282f8fcd5a437914ab41bb44027e95f9f9e4b879a3ebb11a0d1e601",
  "mac-intel":
    "4471c26b4187ebc23d2397d6572aa2f330de30eaa5bd3f134d777092edfd675d",
  windows:
    "8845147ac390647a9513dfe0c4738fa719dc9c89c06a1a953982cdcf1b8d99be",
};

type MacArch = "silicon" | "intel" | null;

// Detección de chip Mac (mismo algoritmo que /descarga clásica).
async function detectMacArch(): Promise<MacArch> {
  if (typeof navigator === "undefined") return null;

  const uaData = (navigator as unknown as {
    userAgentData?: {
      getHighEntropyValues: (h: string[]) => Promise<{
        architecture?: string;
        bitness?: string;
        platform?: string;
      }>;
    };
  }).userAgentData;
  if (uaData?.getHighEntropyValues) {
    try {
      const v = await uaData.getHighEntropyValues(["architecture", "bitness"]);
      if (v.architecture === "arm") return "silicon";
      if (v.architecture === "x86") return "intel";
    } catch {
      /* noop */
    }
  }

  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (gl) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        const renderer = String(
          gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || ""
        );
        if (/Apple\s*M\d/i.test(renderer)) return "silicon";
        if (/Intel|AMD|Radeon|NVIDIA/i.test(renderer)) return "intel";
      }
    }
  } catch {
    /* noop */
  }

  const ua = navigator.userAgent || "";
  if (/Mac OS X 10[._]15[._]7/.test(ua)) return "silicon";
  if (/Mac OS X 1[12345678]/.test(ua)) return "intel";
  return null;
}

// Detección OS básica para presentar Mac vs Windows.
function detectOS(): "mac" | "windows" | "unknown" {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent || "";
  if (/Macintosh|Mac OS/i.test(ua)) return "mac";
  if (/Windows/i.test(ua)) return "windows";
  return "unknown";
}

const PLATFORM_LABELS: Record<
  string,
  { icon: string; name: string; note: string }
> = {
  "mac-silicon": {
    icon: "🍎",
    name: "macOS · Apple Silicon (M1/M2/M3/M4)",
    note:
      "Antes de abrir la app, verifica la integridad: " +
      "shasum -a 256 ~/Downloads/GMSportStudio*.zip " +
      "y compara con el SHA256 de aquí abajo.",
  },
  "mac-intel": {
    icon: "🍎",
    name: "macOS · Intel",
    note:
      "Antes de abrir la app, verifica la integridad: " +
      "shasum -a 256 ~/Downloads/GMSportStudio*.zip " +
      "y compara con el SHA256 de aquí abajo.",
  },
  windows: {
    icon: "🪟",
    name: "Windows (x64)",
    note:
      "Antes de ejecutar, verifica la integridad en PowerShell: " +
      "Get-FileHash -Algorithm SHA256 GMSportStudio*.zip " +
      "y compara con el SHA256 de aquí abajo.",
  },
};

const errorMessages: Record<string, string> = {
  unauthenticated: "Inicia sesión con tu cuenta de tester.",
  "permission-denied":
    "Tu email no está en la lista de testers autorizados. Escribe a ceo@gmsportstudio.com.",
  "invalid-argument": "Plataforma o versión no válida.",
  "not-found": "Aún no hay build disponible para tu plataforma.",
  internal: "Error interno. Inténtalo de nuevo en unos segundos.",
  network_error: "Error de red. Comprueba tu conexión.",
  "auth/invalid-credential": "Email o contraseña incorrectos.",
  "auth/user-not-found": "No hay cuenta con ese email.",
  "auth/wrong-password": "Contraseña incorrecta.",
  "auth/too-many-requests":
    "Demasiados intentos. Espera unos minutos o restablece la contraseña.",
};

export function DescargaCanaryClient() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const [macArch, setMacArch] = useState<MacArch>(null);
  const [archChoiceShown, setArchChoiceShown] = useState(false);
  const [osDetected, setOsDetected] = useState<"mac" | "windows" | "unknown">(
    "unknown"
  );

  const [downloading, setDownloading] = useState<string | null>(null);
  const [dlError, setDlError] = useState<string | null>(null);

  // Auth state
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  // Detección plataforma (independiente del auth)
  useEffect(() => {
    setOsDetected(detectOS());
    detectMacArch().then(setMacArch);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: string }).code)
          : "";
      setAuthError(errorMessages[code] ?? "No se pudo iniciar sesión.");
    } finally {
      setSigningIn(false);
    }
  };

  const handleReset = async () => {
    if (!email.trim()) {
      setAuthError("Escribe tu email arriba para restablecer la contraseña.");
      return;
    }
    setAuthError("");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: string }).code)
          : "";
      setAuthError(errorMessages[code] ?? "No se pudo enviar el email.");
    }
  };

  const handleDownload = async (platform: string) => {
    setDownloading(platform);
    setDlError(null);
    try {
      const callable = httpsCallable<
        { platform: string; track: string; version: string },
        { url: string; filename: string; version: string }
      >(functions, "getSignedDownloadUrl");
      const res = await callable({
        platform,
        track: "canary",
        version: CANARY_VERSION,
      });
      const url = res.data?.url;
      if (!url) {
        setDlError("internal");
        setDownloading(null);
        return;
      }
      const a = document.createElement("a");
      a.href = url;
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => setDownloading(null), 4000);
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: string }).code)
          : "internal";
      setDlError(code.replace(/^functions\//, ""));
      setDownloading(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#555d6e", fontFamily: "sans-serif" }}>
          Cargando…
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 16px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            background: "#161920",
            border: "1px solid #23272f",
            borderRadius: 16,
            padding: "40px 48px",
            width: "100%",
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <h1
              style={{
                color: "#e8eaf0",
                fontSize: 22,
                fontWeight: 800,
                margin: "0 0 6px",
              }}
            >
              GMSport<span style={{ color: "#ff6b1a" }}>Studio</span>
            </h1>
            <p style={{ color: "#555d6e", fontSize: 13, margin: 0 }}>
              Acceso Beta — Versión canary
            </p>
          </div>
          <p
            style={{
              color: "#9095a0",
              fontSize: 13,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Inicia sesión con la misma cuenta que usas en la app.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            autoComplete="email"
            aria-label="Email"
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            autoComplete="current-password"
            aria-label="Contraseña"
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
          {authError && (
            <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>
              {authError}
            </p>
          )}
          {resetSent && (
            <p style={{ color: "#86efac", fontSize: 13, margin: 0 }}>
              Email de restablecimiento enviado. Revisa tu bandeja.
            </p>
          )}
          <button
            type="submit"
            disabled={signingIn}
            style={{
              background: "#ff6b1a",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              fontWeight: 700,
              fontSize: 15,
              cursor: signingIn ? "wait" : "pointer",
              opacity: signingIn ? 0.7 : 1,
            }}
          >
            {signingIn ? "Entrando…" : "Entrar"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              background: "transparent",
              color: "#555d6e",
              border: "none",
              padding: 0,
              fontSize: 12,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            ¿Has olvidado la contraseña?
          </button>
        </form>
      </div>
    );
  }

  // ── Logged in: panel de descarga ─────────────────────────────────────────

  // Mostramos plataformas según OS detectado y elección de chip Mac.
  const platformIds: string[] = (() => {
    if (osDetected === "windows") return ["windows"];
    if (osDetected === "mac") {
      if (archChoiceShown) return ["mac-silicon", "mac-intel"];
      if (macArch === "silicon") return ["mac-silicon"];
      if (macArch === "intel") return ["mac-intel"];
      return ["mac-silicon", "mac-intel"];
    }
    // OS no detectado: mostrar las 3 opciones para que elija.
    return ["mac-silicon", "mac-intel", "windows"];
  })();

  const showArchHint =
    osDetected === "mac" && macArch !== null && !archChoiceShown;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 16px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 600 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              color: "#e8eaf0",
              fontSize: 28,
              fontWeight: 800,
              margin: "0 0 8px",
            }}
          >
            GMSport<span style={{ color: "#ff6b1a" }}>Studio</span>
          </h1>
          <p style={{ color: "#555d6e", fontSize: 14, margin: 0 }}>
            Versión canary {CANARY_VERSION} — experimental
          </p>
        </div>

        <div
          style={{
            background: "#161920",
            border: "1px solid #23272f",
            borderRadius: 16,
            padding: "16px 24px",
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              color: "#9095a0",
              fontSize: 13,
              margin: 0,
              wordBreak: "break-all",
            }}
          >
            Sesión: <strong style={{ color: "#e8eaf0" }}>{user.email}</strong>
          </p>
          <button
            onClick={() => signOut(auth)}
            style={{
              background: "transparent",
              color: "#555d6e",
              border: "1px solid #2a2f3a",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>

        <div
          style={{
            background: "rgba(255,107,26,0.06)",
            border: "1px solid rgba(255,107,26,0.2)",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 16,
          }}
        >
          <p
            style={{
              color: "#9095a0",
              fontSize: 13,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Esta es una versión <strong style={{ color: "#ff6b1a" }}>experimental</strong>.
            La versión estable sigue donde está; la canary se instala
            aparte y no la sobrescribe. Si algo no te encaja, abre la
            estable de siempre y listo.
          </p>
        </div>

        {platformIds.map((platform) => {
          const info = PLATFORM_LABELS[platform];
          const sha256 = CANARY_SHA256[platform];
          if (!info) return null;
          return (
            <div
              key={platform}
              style={{
                background: "#161920",
                border: "1px solid #23272f",
                borderRadius: 16,
                padding: "24px 28px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <p
                  style={{
                    color: "#e8eaf0",
                    fontSize: 15,
                    fontWeight: 700,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {info.icon} GMSportStudio Canary — {info.name}
                </p>
                <button
                  onClick={() => handleDownload(platform)}
                  disabled={downloading === platform}
                  style={{
                    background: "#ff6b1a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 24px",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor:
                      downloading === platform ? "wait" : "pointer",
                    whiteSpace: "nowrap",
                    opacity: downloading === platform ? 0.7 : 1,
                  }}
                >
                  {downloading === platform ? "Preparando…" : "Descargar →"}
                </button>
              </div>
              {sha256 && (
                <div
                  style={{
                    background: "#0f1117",
                    borderRadius: 8,
                    padding: "10px 14px",
                  }}
                >
                  <p
                    style={{
                      color: "#3a3f50",
                      fontSize: 10,
                      margin: "0 0 4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    SHA-256
                  </p>
                  <p
                    style={{
                      color: "#555d6e",
                      fontSize: 11,
                      fontFamily: "monospace",
                      margin: 0,
                      wordBreak: "break-all",
                    }}
                  >
                    {sha256}
                  </p>
                </div>
              )}
              <p
                style={{
                  color: "#555d6e",
                  fontSize: 12,
                  margin: "12px 0 0",
                  lineHeight: 1.6,
                }}
              >
                {info.note}
              </p>
            </div>
          );
        })}

        {showArchHint && (
          <div
            style={{
              background: "rgba(255,107,26,0.06)",
              border: "1px solid rgba(255,107,26,0.2)",
              borderRadius: 12,
              padding: "12px 18px",
              marginTop: 4,
              marginBottom: 16,
            }}
          >
            <p
              style={{
                color: "#9095a0",
                fontSize: 12,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Hemos detectado que tu Mac es{" "}
              <strong style={{ color: "#ff6b1a" }}>
                {macArch === "silicon"
                  ? "Apple Silicon (M1/M2/M3/M4)"
                  : "Intel"}
              </strong>
              . ¿No es correcto?{" "}
              <button
                onClick={() => setArchChoiceShown(true)}
                style={{
                  background: "transparent",
                  color: "#ff6b1a",
                  border: "none",
                  padding: 0,
                  font: "inherit",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Mostrar las dos opciones
              </button>
            </p>
          </div>
        )}

        {dlError && (
          <div
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: 12,
              padding: "14px 18px",
              marginTop: 8,
            }}
          >
            <p style={{ color: "#f87171", fontSize: 14, margin: 0 }}>
              {errorMessages[dlError] ?? "Error al iniciar la descarga."}
            </p>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <p style={{ color: "#3a3f50", fontSize: 12, lineHeight: 1.6 }}>
            ¿Algún detalle raro? Escríbeme a{" "}
            <a
              href="mailto:ceo@gmsportstudio.com"
              style={{ color: "#555d6e" }}
            >
              ceo@gmsportstudio.com
            </a>{" "}
            con el asunto &quot;Canary feedback&quot;.
          </p>
        </div>
      </div>
    </div>
  );
}
