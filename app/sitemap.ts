import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.gmsportstudio.com";
  const lastModified = new Date();
  const languages = {
    es: `${base}/`,
    en: `${base}/en`,
    fr: `${base}/fr`,
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
      url: `${base}/fr`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
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
