import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gmsportstudio.com"),
  title: {
    default: "GMSportStudio — Análisis táctico de baloncesto",
    template: "%s | GMSportStudio",
  },
  description:
    "Software profesional de análisis táctico de baloncesto para entrenadores y analistas. Edita vídeos, crea clips, exporta informes. Mac y Windows.",
  applicationName: "GMSportStudio",
  authors: [{ name: "Jose Carlos Galán Moscoso" }],
  keywords: [
    "análisis táctico baloncesto",
    "software entrenadores baloncesto",
    "vídeo análisis deportivo",
    "análisis rival baloncesto",
    "clips baloncesto",
    "scouting baloncesto",
  ],
  alternates: {
    canonical: "/",
    languages: {
      es: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    siteName: "GMSportStudio",
    title: "GMSportStudio — Análisis táctico de baloncesto",
    description:
      "Software profesional de análisis táctico de baloncesto para entrenadores y analistas.",
    url: "https://www.gmsportstudio.com/",
    locale: "es_ES",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GMSportStudio — Análisis táctico de baloncesto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GMSportStudio — Análisis táctico de baloncesto",
    description:
      "Software profesional de análisis táctico de baloncesto para entrenadores y analistas.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Root layout — pass-through.
// <html> is handled by [locale]/layout.tsx and (legal)/layout.tsx
// to allow per-locale lang attribute without a double <html> warning.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
