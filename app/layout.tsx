import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { ConsentProvider } from "./components/consent-manager";
import { SITE_URL, studioStructuredData } from "./seo";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Fonus Studio | Producción audiovisual en Valencia",
      template: "%s | Fonus Studio",
    },
    description: "Estudio de podcast, videopodcast y producción audiovisual en Valencia.",
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      locale: "es_ES",
      alternateLocale: "en_GB",
      siteName: "Fonus Studio",
      images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "Fonus Studio — Producción audiovisual en Valencia" }],
    },
    twitter: { card: "summary_large_image", images: [`${SITE_URL}/og.png`] },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get("x-fonus-locale") === "en" ? "en" : "es";
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
  const validMeasurementId = /^G-[A-Z0-9]+$/i.test(measurementId);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        {validMeasurementId ? (
          <Script id="fonus-consent-default" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function gtag() {
                window.dataLayer.push(arguments);
              };
              window.gtag("consent", "default", {
                analytics_storage: "denied",
                functionality_storage: "denied",
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied",
                security_storage: "granted",
                wait_for_update: 500
              });
            `}
          </Script>
        ) : null}
        <ConsentProvider>{children}</ConsentProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(studioStructuredData).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
