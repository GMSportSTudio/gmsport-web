import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://www.gmsportstudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "GmSportStudio | Software de Vídeo Análisis para Baloncesto",
    template: "%s · GmSportStudio",
  },

  description:
    "Analiza partidos de baloncesto con telestración profesional, scouting avanzado y corte de clips ultrarrápido. Integración directa con YouTube. Planes mensuales, anuales y licencias para clubes. Tecnología de élite a precio asequible.",

  keywords: [
    "video análisis baloncesto",
    "scouting basket low cost",
    "software telestración baloncesto",
    "software análisis táctico deportivo",
    "licencias software deportivo clubes",
    "análisis táctico baloncesto",
    "software entrenadores baloncesto",
    "edición video deportivo",
    "dashboard análisis deportivo",
    "scouting fútbol bajo coste",
    "GmSportStudio",
  ],

  authors: [{ name: "GmSportStudio", url: BASE_URL }],
  creator: "GmSportStudio",
  publisher: "GmSportStudio",

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type:        "website",
    locale:      "es_ES",
    url:         BASE_URL,
    siteName:    "GmSportStudio",
    title:       "GmSportStudio | Vídeo Análisis Deportivo para Entrenadores",
    description:
      "Telestración, scouting y clips en segundos. Integración con YouTube. La herramienta de análisis profesional para entrenadores a precio asequible.",
    images: [
      {
        url:    `${BASE_URL}/opengraph-image`,
        width:  1200,
        height: 630,
        alt:    "GmSportStudio — Software de vídeo análisis deportivo para baloncesto y fútbol",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    site:        "@josegalandev",
    creator:     "@josegalandev",
    title:       "GmSportStudio | Vídeo Análisis Deportivo",
    description:
      "Telestración, scouting y corte de clips. La herramienta profesional para entrenadores a precio asequible.",
    images: [`${BASE_URL}/opengraph-image`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundEffects />
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
      </body>
    </html>
  );
}
