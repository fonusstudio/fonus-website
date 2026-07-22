import type { Metadata } from "next";
import { headers } from "next/headers";
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
  const studioSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Fonus Studio",
    url: "https://fonusstudio.com",
    email: "info@fonusstudio.com",
    telephone: "+34614692775",
    address: {
      "@type": "PostalAddress",
      streetAddress: "C/ Campoamor 68",
      postalCode: "46022",
      addressLocality: "Valencia",
      addressCountry: "ES",
    },
  };

  return (
    <html lang="es">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(studioSchema) }}
        />
      </body>
    </html>
  );
}
