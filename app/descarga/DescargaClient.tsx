"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FUNCTIONS_BASE = "https://europe-west1-gmsportstudio-53bbf.cloudfunctions.net";

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
//   2. Heurística sobre navigator.userAgent (todos los navegadores la exponen):
//      Apple Silicon emite Mac OS X 10_15_7 fijo desde 2020; Intel reales
//      muestran versiones reales (11_x_x, 12_x_x…). No es 100% fiable
//      (Safari mintió en algunas builds) pero cubre la mayoría.
//   3. WebGL: el renderer de Apple Silicon empieza por "Apple M". Útil
//      como tiebreaker cuando UA es ambiguo.
// Si todo falla → null y el portal pide al usuario que elija manualmente.
async function detectMacArch(): Promise<"silicon" | "intel" | null> {
  if (typeof navigator === "undefined") return null;

  // 1. UA-CH (Chromium/Edge)
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

  // 2. WebGL renderer (más fiable que UA — Apple Silicon expone "Apple M*")
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

  // 3. UA fallback
  const ua = navigator.userAgent || "";
  if (/Mac OS X 10[._]15[._]7/.test(ua)) {
    // Apple Silicon emite ESTA versión fija. Pero también algunos Intel post-2020.
    // Sin más datos, asumimos silicon (mayoría del parque tras 2024).
    return "silicon";
  }
  if (/Mac OS X 1[12345678]/.test(ua)) {
    // Versiones >=11.x reales suelen ser Intel (porque Silicon emite 10_15_7).
    return "intel";
  }
  return null;
}

const PLATFORM_LABELS: Record<string, { icon: string; name: string; note: string }> = {
  mac: {
    icon: "🍎",
    name: "macOS",
    note:
      'Antes de abrir la app, verifica la integridad: ' +
      'shasum -a 256 ~/Downloads/GMSportStudio*.zip ' +
      'y compara con el SHA256 publicado debajo. ' +
      'Solo si el hash coincide, abre la app con Control+clic → Abrir.',
  },
  "mac-silicon": {
    icon: "🍎",
    name: "macOS · Apple Silicon (M1/M2/M3/M4)",
    note:
      'Antes de abrir la app, verifica la integridad: ' +
      'shasum -a 256 ~/Downloads/GMSportStudio*.zip ' +
      'y compara con el SHA256 publicado debajo. ' +
      'Solo si el hash coincide, abre la app con Control+clic → Abrir.',
  },
  "mac-intel": {
    icon: "🍎",
    name: "macOS · Intel",
    note:
      'Antes de abrir la app, verifica la integridad: ' +
      'shasum -a 256 ~/Downloads/GMSportStudio*.zip ' +
      'y compara con el SHA256 publicado debajo. ' +
      'Solo si el hash coincide, abre la app con Control+clic → Abrir.',
  },
  windows: {
    icon: "🪟",
    name: "Windows (x64)",
    note:
      'Antes de ejecutar, verifica la integridad en PowerShell: ' +
      'Get-FileHash -Algorithm SHA256 GMSportStudio*.zip ' +
      'y compara con el SHA256 publicado debajo. ' +
      'Solo si el hash coincide, ejecuta la app.',
  },
};

function formatBytes(b: number) {
  return b > 1_000_000 ? `${(b / 1_000_000).toFixed(0)} MB` : `${(b / 1000).toFixed(0)} KB`;
}

export function DescargaClient() {
  const params = useSearchParams();
  const token  = params.get("token") ?? "";

  const [meta, setMeta]         = useState<Meta | null>(null);
  // Si no hay token, no hay nada que cargar — partimos de loading=false
  // para evitar setState dentro del effect en ese caso (anti-pattern R19).
  const [loading, setLoading]   = useState<boolean>(!!token);
  const [downloading, setDl]    = useState<string | null>(null);
  const [dlError, setDlError]   = useState<string | null>(null);
  const [macArch, setMacArch]   = useState<"silicon" | "intel" | null>(null);
  const [archChoiceShown, setArchChoiceShown] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${FUNCTIONS_BASE}/getInvitationMeta?token=${encodeURIComponent(token)}`)
      .then(async r => {
        const data = await r.json();
        if (!r.ok) setMeta({ ...data, error: data.error } as Meta);
        else       setMeta(data as Meta);
      })
      .catch(() => setMeta({ error: "network_error" } as unknown as Meta))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    detectMacArch().then(setMacArch);
  }, []);

  const handleDownload = async (platform: string) => {
    setDl(platform);
    setDlError(null);
    // POST en lugar de GET con redirect: los email-previewers (Outlook Safe
    // Links, Gmail link scanning) solo siguen GETs, así que ya no pueden
    // consumir cupos al previsualizar el link del email.
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
      if (!signedUrl) {
        setDlError("network_error");
        setDl(null);
        return;
      }
      // <a>.click() funciona en WebViews donde window.location.href se bloquea.
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
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 16px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 600 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ color: "#e8eaf0", fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>
            GMSport<span style={{ color: "#ff6b1a" }}>Studio</span>
          </h1>
          <p style={{ color: "#555d6e", fontSize: 14, margin: 0 }}>Acceso Beta — Descarga privada</p>
        </div>

        {loading && (
          <p style={{ color: "#555d6e", textAlign: "center" }}>Verificando enlace…</p>
        )}

        {!loading && !token && (
          <div style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 16, padding: 32, textAlign: "center" }}>
            <p style={{ color: "#f87171", margin: 0 }}>Enlace inválido. ¿Tienes el email de invitación?</p>
          </div>
        )}

        {!loading && meta?.error && (
          <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 16, padding: 32, textAlign: "center" }}>
            <p style={{ color: "#f87171", fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>
              {errorMessages[meta.error] ?? "Error desconocido."}
            </p>
            <a href="mailto:ceo@gmsportstudio.com" style={{ color: "#ff6b1a", fontSize: 14 }}>
              ceo@gmsportstudio.com
            </a>
          </div>
        )}

        {!loading && meta && !meta.error && (() => {
          // Tolera ambos formatos del backend durante la ventana de despliegue:
          //   nuevo: platforms = ["mac","windows"], platforms_meta = { mac:{...}, windows:{...} }
          //   viejo: platforms = { mac:{...}, windows:{...} }   (bug: spread sobrescribía el array)
          const rawPlatforms = (meta as { platforms: unknown }).platforms;
          const rawMetaObj   = (meta as { platforms_meta?: Record<string, PlatformMeta> }).platforms_meta;
          const invPlatforms: string[] = Array.isArray(rawPlatforms)
            ? rawPlatforms as string[]
            : (rawPlatforms && typeof rawPlatforms === "object" ? Object.keys(rawPlatforms) : []);
          const metaByPlatform: Record<string, PlatformMeta> =
            rawMetaObj ?? (Array.isArray(rawPlatforms) ? {} : (rawPlatforms as Record<string, PlatformMeta>) ?? {});

          // Expandir "mac" → granular según detección. Si el usuario pulsó
          // "Mostrar las dos opciones", forzamos ambas variantes aunque la
          // detección sí hubiese acertado.
          const platformIds: string[] = invPlatforms.flatMap(p => {
            if (p !== "mac") return [p];
            if (archChoiceShown) return ["mac-silicon", "mac-intel"];
            if (macArch === "silicon") return ["mac-silicon"];
            if (macArch === "intel")   return ["mac-intel"];
            // Detección sin resultado: ambas opciones para que elija.
            return ["mac-silicon", "mac-intel"];
          });

          // Mostramos el hint solo cuando hay detección concluyente y el
          // usuario aún no se la ha saltado.
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
              // Para SHA/size usamos la entrada granular si existe, si no la del padre "mac".
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
                      onClick={() => handleDownload(platform)}
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
                <Link href="/terminos-beta" style={{ color: "#555d6e" }}>condiciones Beta</Link>.
                {" "}Licencia válida hasta el 30/05/2026.
              </p>
            </div>
          </>
          );
        })()}
      </div>
    </div>
  );
}
