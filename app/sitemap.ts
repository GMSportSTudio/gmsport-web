import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.gmsportstudio.com";
  const lastModified = new Date();
  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          es: `${base}/`,
          pt: `${base}/pt`,
          "x-default": `${base}/`,
        },
      },
    },
    {
      url: `${base}/pt`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          es: `${base}/`,
          pt: `${base}/pt`,
          "x-default": `${base}/`,
        },
      },
    },
    {
      url: `${base}/privacidad`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
