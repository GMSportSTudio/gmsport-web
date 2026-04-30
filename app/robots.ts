import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.gmsportstudio.com").replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        // Bloquear /admin (panel privado) y /descarga (zona con token).
        // Aunque hoy no haya enlaces externos, evita que crawlers indexen
        // o consuman cupos de invitaciones por preview.
        allow: "/",
        disallow: ["/_next/", "/api/", "/admin", "/descarga", "/cuenta"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
