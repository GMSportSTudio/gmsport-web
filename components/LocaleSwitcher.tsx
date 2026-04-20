"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

/**
 * Selector de idioma. En Fase 3 mostramos ES y EN.
 * PT y FR se añadirán en mayo (Fase 5) cuando tengamos revisión nativa.
 *
 * Al hacer click reemplazamos la ruta preservando el pathname actual,
 * así el usuario se queda en la misma sección (#precios, #faq, etc.).
 */
const VISIBLE_LOCALES = ["es", "en"] as const;

export default function LocaleSwitcher() {
  const current = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("LocaleSwitcher");

  const onSelect = (next: (typeof VISIBLE_LOCALES)[number]) => {
    if (next === current) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex items-center gap-0.5 rounded-md border border-white/10 bg-white/5 p-0.5"
    >
      {VISIBLE_LOCALES.map((loc) => {
        const active = loc === current;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => onSelect(loc)}
            disabled={active || isPending}
            aria-current={active ? "true" : undefined}
            aria-label={t(loc === "es" ? "switchToEs" : "switchToEn")}
            className={[
              "px-2 py-1 text-[11px] font-semibold tracking-wide uppercase rounded transition-colors duration-150",
              active
                ? "bg-white/15 text-white cursor-default"
                : "text-[#EDEDED]/60 hover:text-white hover:bg-white/5 cursor-pointer",
            ].join(" ")}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
