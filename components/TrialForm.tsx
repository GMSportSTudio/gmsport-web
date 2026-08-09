"use client";

/**
 * TrialForm — el formulario de "pruébalo 14 días", reutilizable.
 *
 * Vive aparte porque aparece en dos sitios: en el hero (compacto, es lo
 * primero que ve quien entra) y en su propia sección más abajo (para quien
 * ha bajado leyendo). Duplicar la lógica de red y los estados en los dos
 * sería garantizarse que un día divergen.
 *
 * NO promete acceso inmediato, y es a propósito: la prueba nace pendiente y
 * arranca cuando la persona pulsa el botón del correo, así que lo honesto es
 * decir que el siguiente paso está en su bandeja de entrada.
 *
 * Los mensajes de error llegan redactados del backend (functions/index.js →
 * requestTrial). Aquí no se inventa copy.
 */

import { useState } from "react";

const ENDPOINT =
  "https://europe-west1-gmsportstudio-53bbf.cloudfunctions.net/requestTrial";
export const SOPORTE = "ceo@inboundbasketballstudio.com";

type Estado = "reposo" | "enviando" | "enviado" | "error";

export default function TrialForm({
  compacto = false,
}: {
  /** En el hero el espacio es oro: sin recuadro y con el aviso en una línea. */
  compacto?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("reposo");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [dias, setDias] = useState(14);

  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (estado === "enviando") return;

    const limpio = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(limpio)) {
      setEstado("error");
      setMensaje("Revisa el email, parece que falta algo.");
      return;
    }

    setEstado("enviando");
    setMensaje(null);
    try {
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: limpio }),
      });
      const json = await r.json().catch(() => ({}));
      if (r.ok && json.ok) {
        setDias(json.days || 14);
        setEstado("enviado");
        setEmail("");
        return;
      }
      setEstado("error");
      setMensaje(
        json.message ||
          `No he podido darte de alta. Escríbeme a ${SOPORTE} y lo resuelvo.`,
      );
    } catch {
      setEstado("error");
      setMensaje(
        `No he podido conectar. Prueba en un momento o escríbeme a ${SOPORTE}.`,
      );
    }
  };

  if (estado === "enviado") {
    return (
      <div
        role="status"
        className={
          compacto
            ? "rounded-xl border border-[rgba(34,255,224,0.35)] bg-[rgba(34,255,224,0.06)] px-5 py-4 text-left max-w-md"
            : "rounded-xl border border-[rgba(34,255,224,0.35)] bg-[rgba(34,255,224,0.06)] px-6 py-7 text-left"
        }
      >
        <p className="text-[#22FFE0] font-semibold text-lg">Mira tu correo</p>
        <p className="mt-2 text-[#c0c5ce] leading-relaxed text-sm sm:text-base">
          Te acabo de mandar el enlace para empezar. Los {dias} días empiezan
          cuando lo abras, no ahora — si hoy andas liado, ábrelo el día que
          vayas a usarlo de verdad y aprovechas la prueba entera.
        </p>
        <p className="mt-3 text-sm text-[#9095a0]">
          ¿No llega en unos minutos? Mira en spam, o escríbeme a{" "}
          <a href={`mailto:${SOPORTE}`} className="text-[#22FFE0]">
            {SOPORTE}
          </a>
          .
        </p>
      </div>
    );
  }

  const idCampo = compacto ? "prueba-email-hero" : "prueba-email";

  return (
    <div className={compacto ? "w-full max-w-md" : "w-full"}>
      <form
        onSubmit={enviar}
        className={
          compacto
            ? "flex flex-col sm:flex-row gap-2.5 w-full"
            : "flex flex-col sm:flex-row gap-3 justify-center"
        }
      >
        <label htmlFor={idCampo} className="sr-only">
          Tu correo electrónico
        </label>
        <input
          id={idCampo}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={estado === "enviando"}
          className={`flex-1 ${compacto ? "px-4 py-3" : "sm:max-w-sm px-5 py-3.5"}
                      rounded-lg bg-[#161920] border border-[#2a2f3a] text-white
                      placeholder:text-[#5a6070]
                      focus:outline-none focus:border-[#22FFE0]
                      disabled:opacity-60`}
        />
        <button
          type="submit"
          disabled={estado === "enviando"}
          className={`${compacto ? "px-6 py-3" : "px-8 py-3.5"}
                      rounded-lg font-semibold whitespace-nowrap
                      text-[#06231F] bg-[#22FFE0] hover:bg-[#5FFFE8]
                      transition-colors disabled:opacity-70 disabled:cursor-default`}
        >
          {estado === "enviando" ? "Un momento…" : "Probar 14 días gratis"}
        </button>
      </form>

      {estado === "error" && mensaje && (
        <p
          role="alert"
          className={`mt-3 text-[#ff8d7a] text-sm leading-relaxed ${
            compacto ? "text-left" : ""
          }`}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}
