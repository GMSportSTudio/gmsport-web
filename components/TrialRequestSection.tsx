"use client";

/**
 * TrialRequestSection — la segunda oportunidad de pedir la prueba.
 *
 * El formulario ya está arriba del todo, en el hero. Esto es para quien ha
 * bajado leyendo: llega con el contexto puesto y no se le puede obligar a
 * volver al principio.
 *
 * La lógica vive en TrialForm, compartida con el hero.
 */

import TrialForm, { SOPORTE } from "./TrialForm";

export default function TrialRequestSection() {
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
          Pruébalo con tu próximo partido
        </h2>
        <p className="mt-4 text-[#9aa3b2] text-base sm:text-lg leading-relaxed">
          14 días completos. Sin tarjeta, sin permanencia y sin cargos
          automáticos. Deja tu correo y te mando el acceso.
        </p>

        <div className="mt-10">
          <TrialForm />
        </div>

        <p className="mt-6 text-sm text-[#5a6070]">
          ¿Dudas antes de empezar?{" "}
          <a href={`mailto:${SOPORTE}`} className="text-[#22FFE0]/70 hover:text-[#22FFE0]">
            Escríbeme
          </a>
          .
        </p>
      </div>
    </section>
  );
}
