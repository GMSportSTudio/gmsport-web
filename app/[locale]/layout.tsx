import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import CookieBanner from "@/components/CookieBanner";
import { Analytics } from "@vercel/analytics/next";
import JsonLd from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://www.gmsportstudio.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(BASE_URL),

    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },

    description: t("description"),

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
      canonical: locale === "es" ? `${BASE_URL}/` : `${BASE_URL}/${locale}`,
      languages: {
        "es-ES": `${BASE_URL}/`,
        "en-US": `${BASE_URL}/en`,
        "x-default": `${BASE_URL}/`,
      },
    },

    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "es_ES",
      url: locale === "es" ? BASE_URL : `${BASE_URL}/${locale}`,
      siteName: "GmSportStudio",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: `${BASE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@josegalandev",
      creator: "@josegalandev",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: [`${BASE_URL}/opengraph-image`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <BackgroundEffects />
          <Navbar />
          <main className="flex-1 pt-16">
            <JsonLd />
            {children}
          </main>
          <CookieBanner />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
