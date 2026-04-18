import { Mail } from "lucide-react";
import Image from "next/image";

/* Icono X/Twitter como SVG (lucide-react no incluye "X" oficial) */
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/7 mt-auto">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">

        {/* Logo / Copyright */}
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Image
            src="/logo.png"
            alt="GmSportStudio"
            height={32}
            width={32}
            className="h-8 w-auto object-contain grayscale opacity-40"
          />
          <p className="text-xs text-[#EDEDED]/25">
            © {new Date().getFullYear()} GmSportStudio. Todos los derechos reservados.
          </p>
        </div>

        {/* Links sociales + contacto */}
        <div className="flex items-center gap-4">
          {/* X / Twitter */}
          <a
            href="https://x.com/josegalandev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Síguenos en X (Twitter)"
            className="flex items-center justify-center w-8 h-8 rounded-lg
                       text-[#EDEDED]/35 hover:text-white bg-white/4 hover:bg-white/8
                       border border-white/7 hover:border-white/14
                       transition-all duration-200"
          >
            <XIcon size={14} />
          </a>

          {/* Email */}
          <a
            href="mailto:josegalan16@gmail.com"
            aria-label="Contactar por email"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                       text-xs text-[#EDEDED]/40 hover:text-white
                       bg-white/4 hover:bg-white/8
                       border border-white/7 hover:border-white/14
                       transition-all duration-200"
          >
            <Mail size={13} strokeWidth={1.8} />
            josegalan16@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
