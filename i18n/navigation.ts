import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Wrappers de next-intl sobre los helpers de Next.js que respetan el
 * localePrefix ("as-needed"). Úsalos en lugar de los de `next/link` y
 * `next/navigation` cuando quieras cambiar de locale o linkar rutas que
 * deben respetar el prefijo de idioma.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
