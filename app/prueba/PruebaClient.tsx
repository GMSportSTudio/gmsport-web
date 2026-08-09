"use client";

/**
 * /prueba — donde arranca el reloj de la prueba de 14 días.
 *
 * Hasta 2026-08-09 la prueba empezaba a contar en el momento en que José la
 * concedía desde /admin/grants. Quien tardaba cuatro días en abrir el correo
 * llegaba a una prueba de diez. Ahora la licencia nace pendiente y los días
 * empiezan aquí.
 *
 * POR QUÉ HAY UN BOTÓN Y NO SE ACTIVA AL CARGAR
 * ---------------------------------------------
 * Los antivirus de correo corporativo (Microsoft Defender Safe Links,
 * Proofpoint URL Defense) abren los enlaces por su cuenta para escanearlos,
 * antes de que el destinatario llegue a ver el mensaje. Si activásemos al
 * cargar la página, esos escáneres arrancarían la prueba solos: el usuario
 * abriría el correo al día siguiente y le quedarían 13 días de 14, sin haber
 * tocado nada.
 *
 * Por eso esta página al cargar solo LEE (GET verifyTrialToken) y la
 * activación es un POST que únicamente dispara un clic humano.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FUNCTIONS_BASE = "https://europe-west1-gmsportstudio-53bbf.cloudfunctions.net";
const DOWNLOAD_URL = "/descarga";
const SOPORTE = "ceo@inboundbasketballstudio.com";

type Estado = "pendiente" | "activa" | "terminada" | "caducada" | "sin_prueba";

type RespuestaEstado = {
  ok: boolean;
  estado?: Estado;
  days?: number | null;
  diasRestantes?: number;
  activeUntilMs?: number;
  pendingMs?: number;
  error?: string;
  // Solo al activar: el correo de bienvenida lleva el enlace de contraseña
  // para las cuentas que hemos creado nosotros.
  emailSent?: boolean;
  necesitaPassword?: boolean;
  passwordLinkMissing?: boolean;
};

type Vista =
  | "cargando"
  | "pendiente"
  | "activando"
  | "activada"
  | "ya_activa"
  | "terminada"
  | "caducada"
  | "invalida"
  | "error_red";

function fecha(ms?: number | null): string {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export function PruebaClient() {
  const params = useSearchParams();
  const token = (params.get("token") ?? "").trim();
  const yaConsultado = useRef(false);

  const [vista, setVista] = useState<Vista>("cargando");
  const [datos, setDatos] = useState<RespuestaEstado | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (yaConsultado.current) return;
    yaConsultado.current = true;

    if (!token) {
      // Estado terminal: solo se puede detectar tras montar, de ahí el
      // disable (mismo patrón que en /cuenta/activar).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVista("invalida");
      setError("Al enlace le falta el código. Copia la dirección entera del correo.");
      return;
    }

    (async () => {
      try {
        const r = await fetch(
          `${FUNCTIONS_BASE}/verifyTrialToken?token=${encodeURIComponent(token)}`,
          { method: "GET" },
        );
        const json = (await r.json().catch(() => ({}))) as RespuestaEstado;
        if (!r.ok || !json.ok) {
          setVista("invalida");
          setError(
            json?.error === "license_not_found"
              ? "No encuentro esta prueba. Escríbeme y lo miro."
              : "Este enlace no es válido o ha caducado.",
          );
          return;
        }
        setDatos(json);
        if (json.estado === "activa") setVista("ya_activa");
        else if (json.estado === "terminada") setVista("terminada");
        else if (json.estado === "caducada") setVista("caducada");
        else if (json.estado === "pendiente") setVista("pendiente");
        else {
          setVista("invalida");
          setError("Esta cuenta no tiene ninguna prueba pendiente.");
        }
      } catch {
        setVista("error_red");
        setError("No he podido conectar. Comprueba la conexión y recarga.");
      }
    })();
  }, [token]);

  const activar = async () => {
    setVista("activando");
    try {
      const r = await fetch(`${FUNCTIONS_BASE}/activateTrial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = (await r.json().catch(() => ({}))) as RespuestaEstado & {
        yaEstaba?: boolean;
      };
      if (!r.ok || !json.ok) {
        if (json?.error === "activation_expired") {
          setVista("caducada");
          return;
        }
        setVista("invalida");
        setError(
          json?.error === "license_revoked"
            ? "Esta cuenta tiene el acceso revocado. Escríbeme y lo miramos."
            : "No he podido arrancar la prueba. Escríbeme y lo resuelvo.",
        );
        return;
      }
      setDatos({ ...json, ok: true });
      setVista(json.yaEstaba ? "ya_activa" : "activada");
    } catch {
      setVista("error_red");
      setError("No he podido conectar. Vuelve a intentarlo en un momento.");
    }
  };

  const dias = datos?.days ?? 14;

  return (
    <div style={S.pagina}>
      <div style={S.tarjeta}>
        <h1 style={S.marca}>Inbound Studio</h1>

        {vista === "cargando" && (
          <p style={S.suave}>Un momento…</p>
        )}

        {vista === "pendiente" && (
          <>
            <h2 style={S.titulo}>Tus {dias} días te esperan</h2>
            <p style={S.texto}>
              El reloj empieza cuando pulses el botón, no antes. Si hoy no vas a
              poder ponerte con ella, cierra esta página sin miedo y vuelve
              cuando tengas un rato — el enlace sigue valiendo
              {datos?.pendingMs ? ` hasta el ${fecha(datos.pendingMs)}` : ""}.
            </p>
            <button style={S.boton} onClick={activar}>
              Empezar mis {dias} días
            </button>
            <p style={S.pie}>
              Sin tarjeta, sin permanencia y sin cargos automáticos.
            </p>
          </>
        )}

        {vista === "activando" && (
          <>
            <h2 style={S.titulo}>Arrancando…</h2>
            <p style={S.suave}>Un segundo.</p>
          </>
        )}

        {vista === "activada" && (
          <>
            <h2 style={S.titulo}>Listo — ya corren tus {dias} días</h2>
            <p style={S.texto}>
              Tienes acceso completo hasta el{" "}
              <strong style={S.dato}>{fecha(datos?.activeUntilMs)}</strong>.
            </p>

            {/* Cuenta creada por nosotros: sin contraseña no puede entrar en
                la app, así que ese paso va ANTES que la descarga. */}
            {datos?.necesitaPassword && !datos?.passwordLinkMissing && (
              <p style={S.aviso}>
                Te acabo de mandar un correo para que pongas tu contraseña —
                es el primer paso. <strong style={S.dato}>Caduca en una
                hora</strong>, así que ábrelo ahora; si se te pasa, usa
                «¿Has olvidado la contraseña?» en la app y te llega otro.
              </p>
            )}
            {datos?.passwordLinkMissing && (
              <p style={S.aviso}>
                No he podido generarte el enlace de contraseña. Abre la app,
                pulsa «¿Has olvidado la contraseña?» y te llegará uno. Si
                tampoco funciona, escríbeme.
              </p>
            )}
            {datos?.emailSent === false && !datos?.necesitaPassword && (
              <p style={S.aviso}>
                El correo de confirmación no ha salido, pero tu prueba está
                activa igualmente. Puedes seguir.
              </p>
            )}

            <a href={DOWNLOAD_URL} style={S.boton}>Descargar Inbound Studio</a>
            <p style={S.pie}>
              ¿Algún problema para entrar? Escríbeme a{" "}
              <a href={`mailto:${SOPORTE}`} style={S.enlace}>{SOPORTE}</a>.
            </p>
          </>
        )}

        {vista === "ya_activa" && (
          <>
            <h2 style={S.titulo}>Tu prueba ya está en marcha</h2>
            <p style={S.texto}>
              La arrancaste antes, así que esto no reinicia nada. Tienes acceso
              hasta el <strong style={S.dato}>{fecha(datos?.activeUntilMs)}</strong>
              {datos?.diasRestantes
                ? ` — te quedan ${datos.diasRestantes} ${datos.diasRestantes === 1 ? "día" : "días"}.`
                : "."}
            </p>
            <a href={DOWNLOAD_URL} style={S.boton}>Ir a la descarga</a>
          </>
        )}

        {vista === "terminada" && (
          <>
            <h2 style={S.titulo}>Tu prueba ha terminado</h2>
            <p style={S.texto}>
              Terminó el <strong style={S.dato}>{fecha(datos?.activeUntilMs)}</strong>.
              Si quieres seguir, puedes suscribirte desde la web. Y si te faltó
              tiempo para probarla en condiciones, escríbeme y lo hablamos.
            </p>
            <Link href="/#precios" style={S.boton}>Ver precios</Link>
            <p style={S.pie}>
              <a href={`mailto:${SOPORTE}`} style={S.enlace}>{SOPORTE}</a>
            </p>
          </>
        )}

        {vista === "caducada" && (
          <>
            <h2 style={S.titulo}>Este enlace ya no vale</h2>
            <p style={S.texto}>
              Los enlaces de prueba caducan a los 30 días y este se ha pasado
              de fecha. No es ningún problema: escríbeme y te mando uno nuevo.
            </p>
            <a href={`mailto:${SOPORTE}`} style={S.boton}>Escribir a José</a>
          </>
        )}

        {(vista === "invalida" || vista === "error_red") && (
          <>
            <h2 style={S.titulo}>
              {vista === "error_red" ? "No he podido conectar" : "Algo no cuadra"}
            </h2>
            <p style={S.texto}>{error}</p>
            <a href={`mailto:${SOPORTE}`} style={S.enlace}>{SOPORTE}</a>
          </>
        )}
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  pagina: {
    minHeight: "100vh",
    background: "#0f1117",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    color: "#e8eaf0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  tarjeta: {
    background: "#161920",
    border: "1px solid #23272f",
    borderRadius: 16,
    padding: "40px 36px",
    maxWidth: 520,
    width: "100%",
    textAlign: "center",
  },
  marca: { color: "#22FFE0", fontSize: 15, letterSpacing: 1, margin: "0 0 28px", fontWeight: 600 },
  titulo: { fontSize: 26, margin: "0 0 14px", lineHeight: 1.3 },
  texto: { color: "#c0c5ce", fontSize: 15, lineHeight: 1.7, margin: "0 0 26px" },
  suave: { color: "#9095a0", fontSize: 15 },
  dato: { color: "#e8eaf0" },
  boton: {
    display: "inline-block",
    background: "#22FFE0",
    color: "#0f1117",
    fontWeight: 700,
    fontSize: 16,
    textDecoration: "none",
    padding: "14px 30px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  aviso: {
    background: "#11141a",
    border: "1px solid #23272f",
    borderLeft: "3px solid #22FFE0",
    borderRadius: 8,
    padding: "12px 16px",
    color: "#c0c5ce",
    fontSize: 14,
    lineHeight: 1.6,
    textAlign: "left",
    margin: "0 0 22px",
  },
  pie: { color: "#9095a0", fontSize: 13, margin: "22px 0 0", lineHeight: 1.6 },
  enlace: { color: "#22FFE0" },
};
