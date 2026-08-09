"use client";

/**
 * TrialRequestSection — el botón de "pruébalo 14 días" de la home.
 *
 * Hasta 2026-08-09 las pruebas las concedía José a mano desde /admin/grants,
 * uno a uno. Esto las abre: el entrenador deja su correo y se la da él solo.
 *
 * NO se promete acceso inmediato, y es a propósito. La prueba nace pendiente
 * y arranca cuando pulsa el botón del correo, así que lo honesto es decir que
 * el siguiente paso está en su bandeja de entrada. De paso, ese correo es la
 * verificación de que el buzón es suyo: pedir una prueba para el email de
 * otro no le sirve a nadie.
 *
 * Los errores del backend llegan con `message` ya redactado para el usuario
 * (functions/index.js → requestTrial). Aquí no se inventa copy: si el
 * servidor no manda mensaje, se usa uno genérico con el correo de contacto.
 */

import { useState } from "react";

const ENDPOINT =
  "https://europe-west1-gmsportstudio-53bbf.cloudfunctions.net/requestTrial";
const SOPORTE = "ceo@inboundbasketballstudio.com";

type Estado = "reposo" | "enviando" | "enviado" | "error";

export default function TrialRequestSection() {
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

  return (
    <section
      id="prueba"
      className="relative px-6 py-20 sm:py-24"
      aria-labelledby="prueba-titulo"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          id="prueba-titulo"
          className="text-3xl sm:text-4xl font-semibold text-white tracking-tight"
        >
          Pruébalo 14 días
        </h2>
        <p className="mt-4 text-[#9aa3b2] text-base sm:text-lg leading-relaxed">
          Sin tarjeta, sin permanencia y sin cargos automáticos. Deja tu correo
          y te mando el acceso.
        </p>

        {estado === "enviado" ? (
          <div
            role="status"
            className="mt-10 rounded-xl border border-[rgba(34,255,224,0.35)]
                       bg-[rgba(34,255,224,0.06)] px-6 py-7 text-left"
          >
            <p className="text-[#22FFE0] font-semibold text-lg">
              Mira tu correo
            </p>
            <p className="mt-2 text-[#c0c5ce] leading-relaxed">
              Te acabo de mandar el enlace para empezar. Los {dias} días
              empiezan cuando lo abras, no ahora — así que si hoy andas
              liado, ábrelo el día que vayas a usarlo de verdad y aprovechas
              la prueba entera.
            </p>
            <p className="mt-3 text-sm text-[#9095a0]">
              ¿No te llega en unos minutos? Mira en spam, o escríbeme a{" "}
              <a href={`mailto:${SOPORTE}`} className="text-[#22FFE0]">
                {SOPORTE}
              </a>
              .
            </p>
          </div>
        ) : (
          <form
            onSubmit={enviar}
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <label htmlFor="prueba-email" className="sr-only">
              Tu correo electrónico
            </label>
            <input
              id="prueba-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={estado === "enviando"}
              className="flex-1 sm:max-w-sm px-5 py-3.5 rounded-lg
                         bg-[#161920] border border-[#2a2f3a] text-white
                         placeholder:text-[#5a6070]
                         focus:outline-none focus:border-[#22FFE0]
                         disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={estado === "enviando"}
              className="px-8 py-3.5 rounded-lg font-semibold
                         text-[#06231F] bg-[#22FFE0] hover:bg-[#5FFFE8]
                         transition-colors disabled:opacity-70
                         disabled:cursor-default"
            >
              {estado === "enviando" ? "Un momento…" : "Empezar mi prueba"}
            </button>
          </form>
        )}

        {estado === "error" && mensaje && (
          <p role="alert" className="mt-4 text-[#ff8d7a] text-sm leading-relaxed">
            {mensaje}
          </p>
        )}
      </div>
    </section>
  );
}
