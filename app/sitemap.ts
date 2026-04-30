import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.gmsportstudio.com").replace(/\/$/, "");
  const lastModified = new Date();
  const languages = {
    es: `${base}/`,
    en: `${base}/en`,
    "x-default": `${base}/`,
  };
  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: { languages },
    },
    {
      url: `${base}/en`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages },
    },
    {
      url: `${base}/privacidad`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
