"use client";

/**
 * PlaybookSection — la pizarra táctica.
 *
 * Segunda captura de la aplicación en la home. Va después de las
 * funcionalidades y antes del formulario de prueba: el entrenador ya sabe que
 * la herramienta corta clips, y aquí se le enseña lo que hace DESPUÉS con
 * ellos — dibujar la jugada y llevarla al vestuario.
 *
 * La imagen manda, el texto solo la traduce a trabajo real. Nada de listas de
 * características: la captura ya enseña las herramientas.
 */

import Image from "next/image";

export default function PlaybookSection() {
  return (
    <section
      id="pizarra"
      className="relative px-6 py-20 sm:py-24"
      aria-labelledby="pizarra-titulo"
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-12 lg:gap-16 items-center">
        <div className="text-center lg:text-left">
          <h2
            id="pizarra-titulo"
            className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-tight"
          >
            Del clip a la pizarra,
            <br className="hidden sm:block" /> sin cambiar de programa
          </h2>
          <p className="mt-5 text-[#9aa3b2] text-base sm:text-lg leading-relaxed">
            Dibuja el sistema encima de la cancha, encadena los pasos como una
            secuencia y vincula la jugada al clip donde ocurrió. Cuando llegue
            el día de vídeo, lo tienes todo junto.
          </p>
          <ul className="mt-7 space-y-3 text-[#c0c5ce] text-[15px] text-left inline-block">
            {[
              "Cortes, pases, botes, bloqueos y zonas",
              "Secuencia paso a paso, con nota en cada uno",
              "Biblioteca de jugadas que viaja entre partidos",
              "Exporta a PDF o PNG para repartir al staff",
            ].map((linea) => (
              <li key={linea} className="flex gap-3 items-start">
                <span
                  aria-hidden="true"
                  className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#22FFE0] shrink-0"
                />
                {linea}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-x-[10%] top-[12%] bottom-[-6%] -z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(34,255,224,0.22) 0%, rgba(34,255,224,0.06) 45%, transparent 70%)",
              filter: "blur(36px)",
            }}
          />
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-white/10"
            style={{
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.06) inset, " +
                "0 24px 60px rgba(0,0,0,0.6)",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.14) 50%, transparent 90%)",
              }}
            />
            {/* Sin `priority`: está por debajo del pliegue y competiría con
                la imagen del hero por el ancho de banda inicial. */}
            <Image
              src="/capturas/app-pizarra.webp"
              alt="Pizarra táctica de Inbound Studio con cinco jugadores
                   posicionados, el balón y varios bloqueos dibujados"
              width={1800}
              height={1194}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
