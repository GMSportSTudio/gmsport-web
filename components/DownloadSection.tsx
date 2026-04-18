"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { Download, ChevronDown, MousePointer2, ShieldCheck, AlertTriangle, Apple, Monitor } from "lucide-react";

/* ─── URLs de descarga — actualiza cuando subas los DMGs ─────── */
const DOWNLOADS = {
  silicon:   "https://github.com/GMSportSTudio/gmsport-web/releases/latest/download/GMSportStudio-macos-applesilicon-1.1.2.zip",
  intel:     "https://github.com/GMSportSTudio/gmsport-web/releases/latest/download/GMSportStudio-macos-intel-1.1.2.zip",
  universal: "https://github.com/GMSportSTudio/gmsport-web/releases/latest/download/GMSportStudio-macos-universal-1.1.2.zip",
};

/* ─── Tipos ──────────────────────────────────────────────────── */
type ChipType = "silicon" | "intel" | "unknown";
type OsType   = "mac" | "windows" | "other";

/* ─── Detección de plataforma ────────────────────────────────── */
function detectPlatform(): { os: OsType; chip: ChipType } {
  if (typeof window === "undefined") return { os: "other", chip: "unknown" };

  const ua  = navigator.userAgent;
  const plt = navigator.platform ?? "";

  const isMac     = /Mac/.test(plt) || /Macintosh/.test(ua);
  const isWindows = /Win/.test(plt) || /Windows/.test(ua);

  if (!isMac) return { os: isWindows ? "windows" : "other", chip: "unknown" };

  /* Intento de detección de chip vía WebGL renderer */
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ??
                canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (gl) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string;
        if (/Apple M\d|Apple GPU/.test(renderer)) return { os: "mac", chip: "silicon" };
        if (/Intel/.test(renderer))               return { os: "mac", chip: "intel"   };
      }
    }
  } catch (_) { /* silencioso */ }

  return { os: "mac", chip: "unknown" };
}

/* ─── Animaciones ────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0): Variants => ({
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: EASE } },
});

/* ─── Pasos de instalación segura ────────────────────────────── */
const STEPS = [
  {
    icon: <Download size={16} />,
    title: "Descarga e instala",
    desc:  "Abre el archivo .dmg y arrastra GmSportStudio a tu carpeta Aplicaciones.",
  },
  {
    icon: <MousePointer2 size={16} />,
    desc: "En Aplicaciones, haz clic derecho sobre el icono de la app y elige Abrir (no doble clic).",
    title: "Clic derecho → Abrir",
  },
  {
    icon: <ShieldCheck size={16} />,
    title: "Confirma en el diálogo",
    desc:  "macOS mostrará un aviso de seguridad. Pulsa Abrir igualmente — solo ocurre la primera vez.",
  },
];

/* ─── Modal de instrucciones ─────────────────────────────────── */
function SecurityModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{   opacity: 0, scale: 0.95, y: 8   }}
          transition={{ duration: 0.3, ease: EASE }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #161616 0%, #111 100%)",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
          }}
        >
          {/* Cabecera */}
          <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-white/7">
            <span className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">Cómo abrir la app por primera vez</h3>
              <p className="text-xs text-white/35 mt-0.5">macOS bloquea apps de desarrolladores no verificados</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center
                         text-white/30 hover:text-white hover:bg-white/8 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Pasos */}
          <div className="flex flex-col gap-0 px-6 py-5">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-4">
                {/* Línea vertical */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-[#FF5722]/12 text-[#FF7043] flex items-center justify-center border border-[#FF5722]/20">
                    {step.icon}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-px flex-1 my-1 bg-white/8" />
                  )}
                </div>
                {/* Texto */}
                <div className="pb-5">
                  <p className="text-sm font-medium text-white leading-snug">{step.title}</p>
                  <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pie */}
          <div className="px-6 pb-6">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/8 border border-amber-500/15">
              <ShieldCheck size={14} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-200/60 leading-relaxed">
                GmSportStudio es una app segura. El aviso de macOS aparece porque aún no está firmada con certificado Apple Developer.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Botón de descarga ──────────────────────────────────────── */
function DownloadButton({
  href, label, sublabel, primary, icon,
}: {
  href: string; label: string; sublabel: string;
  primary?: boolean; icon: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className={[
        "relative flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer w-full sm:w-auto",
        "transition-shadow duration-300",
        primary
          ? "bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white shadow-[0_4px_24px_rgba(255,87,34,0.4)] hover:shadow-[0_6px_36px_rgba(255,87,34,0.55)]"
          : "bg-[#111] text-white border border-white/10 hover:border-white/20 hover:bg-[#161616] shadow-[0_4px_20px_rgba(0,0,0,0.4)]",
      ].join(" ")}
    >
      {primary && (
        <span aria-hidden="true"
          className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      )}
      <span className={[
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
        primary ? "bg-white/15" : "bg-white/6 border border-white/10",
      ].join(" ")}>
        {icon}
      </span>
      <div className="flex flex-col items-start">
        <span className="text-sm font-semibold leading-snug">{label}</span>
        <span className={["text-xs mt-0.5", primary ? "text-white/70" : "text-white/35"].join(" ")}>
          {sublabel}
        </span>
      </div>
      <Download size={16} className={["ml-auto shrink-0", primary ? "text-white/70" : "text-white/25"].join(" ")} />
    </motion.a>
  );
}

/* ─── Sección principal ──────────────────────────────────────── */
export default function DownloadSection() {
  const [platform, setPlatform] = useState<{ os: OsType; chip: ChipType } | null>(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [faqOpen,   setFaqOpen]     = useState(false);

  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const isMac     = platform?.os === "mac";
  const isSilicon = platform?.chip === "silicon";
  const isIntel   = platform?.chip === "intel";
  const detected  = isSilicon || isIntel;

  return (
    <>
      {/* Modal de seguridad */}
      {modalOpen && <SecurityModal onClose={() => setModalOpen(false)} />}

      <section
        id="descargas"
        ref={ref}
        className="relative px-5 md:px-8 py-24 md:py-32 flex flex-col items-center"
      >
        {/* Glow ambiental */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-[15%] top-[5%] bottom-[30%] -z-10"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, rgba(255,87,34,0.07) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />

        {/* Cabecera */}
        <motion.div
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0)}
          className="flex flex-col items-center text-center gap-4 mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10
                           bg-white/4 text-white/40 text-xs font-medium tracking-wide uppercase">
            Descarga
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(160deg, #ffffff 40%, #6b7280 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
            {isMac && detected
              ? `Hemos detectado tu Mac ${isSilicon ? "Apple Silicon" : "Intel"}`
              : "Descarga GmSportStudio"}
          </h2>
          <p className="max-w-sm text-[#EDEDED]/45 text-base leading-relaxed">
            {isMac && detected
              ? "Te mostramos la versión optimizada para tu equipo."
              : "Disponible para macOS. Selecciona tu procesador."}
          </p>
        </motion.div>

        {/* Botones */}
        <motion.div
          initial="hidden" animate={inView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-xl"
        >
          {/* Caso: detectado Apple Silicon → un solo botón primario */}
          {/* Apple Silicon detectado */}
          {isMac && isSilicon && (
            <>
              <motion.div variants={fadeUp(0.1)} className="flex-1">
                <DownloadButton
                  href={DOWNLOADS.silicon}
                  label="Descargar para Apple Silicon"
                  sublabel="M1 / M2 / M3 · ZIP · 88 MB"
                  primary icon={<Apple size={20} />}
                />
              </motion.div>
              <motion.div variants={fadeUp(0.2)} className="flex-1">
                <DownloadButton
                  href={DOWNLOADS.intel}
                  label="Mac Intel"
                  sublabel="x86_64 · ZIP · 80 MB"
                  icon={<Monitor size={20} />}
                />
              </motion.div>
            </>
          )}

          {/* Intel detectado */}
          {isMac && isIntel && (
            <>
              <motion.div variants={fadeUp(0.1)} className="flex-1">
                <DownloadButton
                  href={DOWNLOADS.intel}
                  label="Descargar para Mac Intel"
                  sublabel="x86_64 · ZIP · 80 MB"
                  primary icon={<Monitor size={20} />}
                />
              </motion.div>
              <motion.div variants={fadeUp(0.2)} className="flex-1">
                <DownloadButton
                  href={DOWNLOADS.silicon}
                  label="Apple Silicon"
                  sublabel="M1 / M2 / M3 · ZIP · 88 MB"
                  icon={<Apple size={20} />}
                />
              </motion.div>
            </>
          )}

          {/* No detectado → universal recomendado + opciones específicas */}
          {(!isMac || !detected) && (
            <>
              <motion.div variants={fadeUp(0.1)} className="flex-1">
                <DownloadButton
                  href={DOWNLOADS.silicon}
                  label="Apple Silicon"
                  sublabel="M1 / M2 / M3 · ZIP · 88 MB"
                  primary icon={<Apple size={20} />}
                />
              </motion.div>
              <motion.div variants={fadeUp(0.2)} className="flex-1">
                <DownloadButton
                  href={DOWNLOADS.intel}
                  label="Mac Intel"
                  sublabel="x86_64 · ZIP · 80 MB"
                  icon={<Monitor size={20} />}
                />
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Nota de versión + enlace instrucciones */}
        <motion.div
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp(0.3)}
          className="mt-6 flex flex-col items-center gap-3"
        >
          <p className="text-xs text-[#EDEDED]/25">
            Versión 1.1 Beta · Solo macOS por ahora · Windows próximamente
          </p>

          {/* Acordeón instrucciones seguridad */}
          <button
            onClick={() => setFaqOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-[#EDEDED]/40 hover:text-white/70
                       transition-colors duration-200 group"
          >
            <ShieldCheck size={13} className="text-amber-400/60 group-hover:text-amber-400 transition-colors" />
            ¿macOS bloquea la app al abrirla?
            <ChevronDown
              size={13}
              className={["transition-transform duration-200", faqOpen ? "rotate-180" : ""].join(" ")}
            />
          </button>

          <AnimatePresence>
            {faqOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{   opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="overflow-hidden w-full max-w-md"
              >
                <div className="mt-1 p-4 rounded-xl bg-[#111] border border-white/8 flex flex-col gap-3">
                  {STEPS.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#FF5722]/12 text-[#FF7043] flex items-center justify-center shrink-0 mt-0.5 border border-[#FF5722]/15">
                        {step.icon}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-white/80">{step.title}</p>
                        <p className="text-xs text-white/35 mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setModalOpen(true)}
                    className="self-end text-[11px] text-[#FF8A65]/60 hover:text-[#FF8A65] transition-colors"
                  >
                    Ver en detalle →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </>
  );
}
