/**
 * gmsport-web/lib/plans.ts
 *
 * Fuente única de los planes comerciales. Si cambia el precio aquí,
 * PricingSection lo refleja sin tocar JSX. Los product_ids deben
 * coincidir con functions/.env (PASE_BETA_PRODUCT_IDS para los
 * Founder; el resto son público estándar).
 */

export const INDIVIDUAL_MONTHLY = {
  id: "individual_monthly",
  priceEur: 14.99,
  gumroadUrl: "https://inboundstudio.gumroad.com/l/inbound-mensual",
  productId: "jmygj",
} as const;

export const INDIVIDUAL_ANNUAL = {
  id: "individual_annual",
  priceEur: 99,
  pricePerMonthEur: 8.25,
  // (14.99 * 12) − 99 = 80.88 ahorrado vs mensual·12 → ~45 %
  savingsPct: 45,
  gumroadUrl: "https://inboundstudio.gumroad.com/l/Inbound-anual",
  productId: "ubygvp",
} as const;

export const PRO_CLUB = {
  id: "pro_club",
  priceEur: 299,
  devices: 5,
  contactEmail: "clubes@gmsportstudio.com",
} as const;

/** Formato precio en es-ES (coma decimal). Sin decimales si es entero. */
export function formatPriceEUR(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}
