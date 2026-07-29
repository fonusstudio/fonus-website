import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { BUSINESS } from "./business";
import { ConsentProvider } from "./components/consent-manager";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "fonusstudio.com";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", base).toString();

  return {
    metadataBase: base,
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
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Fonus Studio — Producción audiovisual en Valencia" }],
    },
    twitter: { card: "summary_large_image", images: [socialImage] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
  const validMeasurementId = /^G-[A-Z0-9]+$/i.test(measurementId);
  const studioSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BUSINESS.tradingName,
    legalName: BUSINESS.legalName,
    taxID: BUSINESS.taxId,
    url: BUSINESS.website,
    email: BUSINESS.email,
    telephone: "+34614692775",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      postalCode: BUSINESS.postalCode,
      addressLocality: BUSINESS.city,
      addressCountry: "ES",
    },
  };

  return (
    <html lang="es" suppressHydrationWarning>
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(studioSchema) }}
        />
      </body>
    </html>
  );
}
