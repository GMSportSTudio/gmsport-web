import type { MetadataRoute } from "next";

const BASE_URL = "https://www.gmsportstudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          es: `${BASE_URL}/`,
          en: `${BASE_URL}/en`,
          // pt, fr: se añaden en mayo cuando lancemos sus traducciones
        },
      },
    },
    {
      url: `${BASE_URL}/en`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          es: `${BASE_URL}/`,
          en: `${BASE_URL}/en`,
        },
      },
    },
    // Legales (solo ES, sin versión multilingüe):
    { url: `${BASE_URL}/aviso-legal`,   lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacidad`,    lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terminos-beta`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cookies`,       lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
