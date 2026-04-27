"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const FUNCTIONS_BASE = "https://europe-west1-gmsportstudio-53bbf.cloudfunctions.net";

type VerifyResponse = {
  valid: boolean;
  plan: string | null;
  applies_to: string[];
  discount_pct: number;
  gumroad_url: string | null;
  exp: number | null;
  error?: string;
};

type Status = "loading" | "redirecting" | "missing_url" | "invalid" | "expired" | "network_error";

const PLAN_LABEL: Record<string, string> = {
  individual_monthly: "Individual mensual",
  individual_annual: "Individual anual",
};

export function ActivarClient() {
  const params = useSearchParams();
  const token = (params.get("token") ?? "").trim();
  const calledRef = useRef(false);

  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (!token) {
      setStatus("invalid");
      setErrorMsg("Falta el token de activación en el enlace.");
      return;
    }

    (async () => {
      try {
        const r = await fetch(
          `${FUNCTIONS_BASE}/verifyConversionToken?token=${encodeURIComponent(token)}`,
          { method: "GET" },
        );
        const json = (await r.json().catch(() => ({}))) as VerifyResponse;
        if (!r.ok || !json.valid) {
          const code = (json?.error || "").toLowerCase();
          if (code.includes("expired")) {
            setStatus("expired");
            setErrorMsg("Este enlace ha caducado. Solicita uno nuevo.");
          } else {
            setStatus("invalid");
            setErrorMsg(json?.error || "Enlace no válido.");
          }
          return;
        }
        setData(json);
        if (!json.gumroad_url) {
          setStatus("missing_url");
          return;
        }
        setStatus("redirecting");
        setTimeout(() => {
          window.location.href = json.gumroad_url as string;
        }, 1200);
      } catch (_e) {
        setStatus("network_error");
        setErrorMsg("Error de red. Comprueba la conexión y vuelve a intentarlo.");
      }
    })();
  }, [token]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1117",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        color: "#e8eaf0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#161920",
          border: "1px solid #23272f",
          borderRadius: 16,
          padding: 32,
        }}
      >
        <p
          style={{
            color: "#ff6b1a",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            margin: "0 0 12px",
          }}
        >
          Beta Founder · 50% de descuento
        </p>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            margin: "0 0 8px",
            letterSpacing: "-0.5px",
          }}
        >
          GMSport<span style={{ color: "#ff6b1a" }}>Studio</span>
        </h1>

        {status === "loading" && (
          <p style={{ color: "#9095a0", fontSize: 15, lineHeight: 1.7, margin: "16px 0 0" }}>
            Verificando tu enlace de activación…
          </p>
        )}

        {status === "redirecting" && data && (
          <>
            <p style={{ color: "#9095a0", fontSize: 15, lineHeight: 1.7, margin: "16px 0 8px" }}>
              Enlace verificado. Te estamos redirigiendo al checkout para activar tu suscripción{" "}
              <strong style={{ color: "#e8eaf0" }}>
                {PLAN_LABEL[data.plan ?? ""] || data.plan}
              </strong>{" "}
              con tu <strong style={{ color: "#ff6b1a" }}>{data.discount_pct}% Founder</strong>.
            </p>
            <div
              style={{
                background: "#1f2a3a",
                border: "1px solid #2f4a5c",
                color: "#8acaff",
                padding: "12px 14px",
                borderRadius: 8,
                fontSize: 13,
                marginTop: 14,
              }}
            >
              Si el navegador no redirige automáticamente,{" "}
              <a
                href={data.gumroad_url ?? "#"}
                style={{ color: "#ff6b1a", textDecoration: "underline" }}
              >
                pulsa aquí
              </a>
              .
            </div>
          </>
        )}

        {status === "missing_url" && (
          <>
            <div
              style={{
                background: "#3a2f1f",
                border: "1px solid #5c4a2f",
                color: "#ffcf8a",
                padding: "14px 16px",
                borderRadius: 10,
                fontSize: 14,
                lineHeight: 1.6,
                margin: "18px 0 12px",
              }}
            >
              <strong>Configuración pendiente.</strong> El enlace es válido, pero el checkout para
              tu plan aún no está disponible. Recibirás un correo en cuanto esté listo.
            </div>
            <p style={{ color: "#9095a0", fontSize: 13, lineHeight: 1.7, margin: "12px 0" }}>
              Si tienes dudas, escribe a{" "}
              <a
                href="mailto:info@gmsportstudio.com"
                style={{ color: "#ff6b1a", textDecoration: "none" }}
              >
                info@gmsportstudio.com
              </a>
              .
            </p>
          </>
        )}

        {(status === "invalid" || status === "expired" || status === "network_error") && (
          <>
            <div
              style={{
                background: "#3a1f25",
                border: "1px solid #5c2f37",
                color: "#ff8a95",
                padding: "14px 16px",
                borderRadius: 10,
                fontSize: 14,
                lineHeight: 1.6,
                margin: "18px 0 12px",
              }}
            >
              <strong>
                {status === "expired"
                  ? "Enlace caducado."
                  : status === "network_error"
                    ? "Error de red."
                    : "Enlace no válido."}
              </strong>
              {errorMsg ? <> {errorMsg}</> : null}
            </div>
            <p style={{ color: "#9095a0", fontSize: 13, lineHeight: 1.7, margin: "12px 0" }}>
              Solicita un nuevo enlace o escribe a{" "}
              <a
                href="mailto:info@gmsportstudio.com"
                style={{ color: "#ff6b1a", textDecoration: "none" }}
              >
                info@gmsportstudio.com
              </a>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
}
