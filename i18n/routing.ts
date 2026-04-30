import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // "fr" pendiente de traducción real (messages/fr.json hoy es copia de es.json).
  // Reactivar cuando esté traducido y verificado por nativo.
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
});
