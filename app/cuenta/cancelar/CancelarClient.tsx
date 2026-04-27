"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const FUNCTIONS_BASE = "https://europe-west1-gmsportstudio-53bbf.cloudfunctions.net";

export function CancelarClient() {
  const params = useSearchParams();
  const initialEmail = (params.get("email") ?? "").trim();

  const [email, setEmail]       = useState(initialEmail);
  const [motivo, setMotivo]     = useState("");
  const [acepta, setAcepta]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = async () => {
    setError(null);
    if (!validEmail) {
      setError("Introduce un email válido.");
      return;
    }
    if (!acepta) {
      setError("Debes confirmar que quieres cancelar la suscripción.");
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch(`${FUNCTIONS_BASE}/requestSubscriptionCancellation`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), motivo: motivo.trim() }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        setError(data?.error || `Error ${r.status}. Inténtalo más tarde.`);
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch (e) {
      setError("Error de red. Comprueba la conexión y vuelve a intentarlo.");
    } finally {
      setSubmitting(false);
    }
  };

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
          Cancelar suscripción
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

        {!done ? (
          <>
            <p style={{ color: "#9095a0", fontSize: 15, lineHeight: 1.7, margin: "16px 0 24px" }}>
              Vamos a procesar la cancelación de tu suscripción. La cancelación se hace efectiva al
              recibir tu solicitud — recibirás un email de confirmación. Si tienes una versión Beta
              activa, mantendrás el acceso hasta el {" "}
              <strong style={{ color: "#ff6b1a" }}>30 de mayo de 2026</strong>.
            </p>

            <label
              style={{
                display: "block",
                color: "#9095a0",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Email de la cuenta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "#0f1117",
                border: "1px solid #2a2f3a",
                borderRadius: 8,
                color: "#e8eaf0",
                fontSize: 14,
                marginBottom: 18,
                boxSizing: "border-box",
              }}
            />

            <label
              style={{
                display: "block",
                color: "#9095a0",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Motivo (opcional)
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Nos ayuda a mejorar saber por qué cancelas."
              disabled={submitting}
              rows={4}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "#0f1117",
                border: "1px solid #2a2f3a",
                borderRadius: 8,
                color: "#e8eaf0",
                fontSize: 14,
                marginBottom: 18,
                resize: "vertical",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                color: "#9095a0",
                fontSize: 13,
                lineHeight: 1.5,
                marginBottom: 22,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={acepta}
                onChange={(e) => setAcepta(e.target.checked)}
                disabled={submitting}
                style={{ marginTop: 3, accentColor: "#ff6b1a" }}
              />
              <span>
                Confirmo que quiero cancelar mi suscripción a GMSportStudio y entiendo que
                perderé el acceso al finalizar el periodo Beta actual.
              </span>
            </label>

            {error && (
              <div
                style={{
                  background: "#3a1f25",
                  border: "1px solid #5c2f37",
                  color: "#ff8a95",
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={submit}
              disabled={submitting || !validEmail || !acepta}
              style={{
                width: "100%",
                padding: "14px 20px",
                background: submitting || !validEmail || !acepta ? "#3a3f50" : "#ff6b1a",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                border: "none",
                borderRadius: 10,
                cursor: submitting || !validEmail || !acepta ? "default" : "pointer",
                letterSpacing: "-0.2px",
              }}
            >
              {submitting ? "Enviando…" : "Confirmar cancelación"}
            </button>

            <p
              style={{
                color: "#555d6e",
                fontSize: 12,
                lineHeight: 1.6,
                marginTop: 18,
                textAlign: "center",
              }}
            >
              ¿Tienes dudas? Escribe a{" "}
              <a
                href="mailto:ceo@gmsportstudio.com"
                style={{ color: "#ff6b1a", textDecoration: "none" }}
              >
                ceo@gmsportstudio.com
              </a>
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                background: "#1f3a25",
                border: "1px solid #2f5c37",
                color: "#8aff95",
                padding: "16px 18px",
                borderRadius: 10,
                fontSize: 14,
                lineHeight: 1.6,
                margin: "20px 0 8px",
              }}
            >
              <strong>Solicitud recibida.</strong> Recibirás un email de confirmación en breve. La
              cancelación se procesará en las próximas 24 h. Mientras tanto sigues teniendo acceso
              normal a la app.
            </div>
            <p style={{ color: "#9095a0", fontSize: 13, lineHeight: 1.7, margin: "16px 0" }}>
              Si necesitas revertir la cancelación o tienes preguntas, escribe a{" "}
              <a
                href="mailto:ceo@gmsportstudio.com"
                style={{ color: "#ff6b1a", textDecoration: "none" }}
              >
                ceo@gmsportstudio.com
              </a>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
}
