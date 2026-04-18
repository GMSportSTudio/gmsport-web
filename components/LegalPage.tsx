import Link from "next/link";

interface Section {
  title: string;
  content: React.ReactNode;
}

export function LegalPage({
  title,
  subtitle,
  updated,
  sections,
}: {
  title: string;
  subtitle: string;
  updated: string;
  sections: Section[];
}) {
  return (
    <div className="min-h-screen px-5 md:px-8 py-24 max-w-3xl mx-auto">
      {/* Cabecera */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/60
                     transition-colors duration-200 mb-8 group"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver a inicio
        </Link>

        <p className="text-xs font-semibold uppercase tracking-widest text-[#FF7043] mb-3">
          {subtitle}
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-sm text-white/25">Última actualización: {updated}</p>

        <div className="mt-6 h-px bg-white/8" />
      </div>

      {/* Secciones */}
      <div className="flex flex-col gap-10">
        {sections.map(({ title: sTitle, content }) => (
          <section key={sTitle}>
            <h2 className="text-base font-bold text-white mb-3">{sTitle}</h2>
            <div className="text-sm text-white/50 leading-relaxed space-y-3">
              {content}
            </div>
          </section>
        ))}
      </div>

      {/* Footer de la página legal */}
      <div className="mt-16 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-white/20">
        <Link href="/aviso-legal"    className="hover:text-white/50 transition-colors">Aviso Legal</Link>
        <Link href="/privacidad"     className="hover:text-white/50 transition-colors">Privacidad</Link>
        <Link href="/terminos-beta"  className="hover:text-white/50 transition-colors">Términos Beta</Link>
        <Link href="/cookies"        className="hover:text-white/50 transition-colors">Cookies</Link>
      </div>
    </div>
  );
}
