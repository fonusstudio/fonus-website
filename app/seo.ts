import type { Metadata } from "next";
import { BUSINESS } from "./business";
import { pageHref, type Locale, type PageName } from "./content";

// Keep canonicals tied to the public domain, including on preview deployments.
export const SITE_URL = BUSINESS.website;
export const INDEXABLE_PAGES = ["home", "services", "portfolio", "contact"] as const;

const pageSeo = {
  es: {
    home: ["Estudio de podcast en Valencia", "Graba tu podcast o videopodcast en Fonus Studio, Valencia. Hasta 4 micrófonos, 3 cámaras 4K, asistencia técnica y edición. Consulta servicios y reserva."],
    services: ["Grabación de podcast en Valencia: servicios y precios", "Servicios de grabación y edición de podcast y videopodcast en Valencia. Compara sesiones de audio, vídeo multicámara y paquetes de producción en Fonus Studio."],
    portfolio: ["Nuestro estudio de podcast en Valencia", "Conoce Fonus Studio en C/ Campoamor 68, Valencia: espacio tratado acústicamente, hasta 4 micrófonos, 3 cámaras 4K y asistencia durante la grabación."],
    contact: ["Reserva tu sesión de podcast en Valencia", "Contacta con Fonus Studio en C/ Campoamor 68, 46022 Valencia. Reserva una sesión de podcast o una reunión gratuita para hablar de tu proyecto."],
    privacy: ["Política de Privacidad", "Cómo Local Boosting S.L. trata y protege los datos personales en Fonus Studio."],
    cookies: ["Política de Cookies", "Información y control de las cookies esenciales, funcionales y analíticas de Fonus Studio."],
    legal: ["Aviso Legal", "Información corporativa y condiciones de uso de fonusstudio.com."],
  },
  en: {
    home: ["Podcast Studio in Valencia", "Record your podcast or video podcast at Fonus Studio in Valencia. Up to 4 microphones, 3 4K cameras, technical support and editing. Explore services and book."],
    services: ["Podcast Recording in Valencia: Services & Prices", "Explore podcast recording and editing in Valencia. Compare audio sessions, multi-camera video podcasts and complete production packages at Fonus Studio."],
    portfolio: ["Inside Our Podcast Studio in Valencia", "Explore Fonus Studio at C/ Campoamor 68, Valencia: an acoustically treated space, up to 4 microphones, 3 4K cameras and recording support."],
    contact: ["Book a Podcast Recording Session in Valencia", "Contact Fonus Studio at C/ Campoamor 68, 46022 Valencia. Book a podcast recording session or a free discovery meeting to discuss your project."],
    privacy: ["Privacy Policy", "How Local Boosting S.L. processes and protects personal data at Fonus Studio."],
    cookies: ["Cookie Policy", "Information and controls for Fonus Studio’s essential, functional and analytics cookies."],
    legal: ["Legal Notice", "Company information and terms of use for fonusstudio.com."],
  },
} as const;

export function isIndexablePage(page: PageName) {
  return INDEXABLE_PAGES.some((indexable) => indexable === page);
}

export function absolutePageUrl(locale: Locale, page: PageName) {
  return new URL(pageHref(locale, page), SITE_URL).href;
}

export function pageMetadata(locale: Locale, page: PageName): Metadata {
  const [title, description] = pageSeo[locale][page];
  const fullTitle = `${title} | ${BUSINESS.tradingName}`;
  const url = absolutePageUrl(locale, page);
  const index = isIndexablePage(page);
  const socialImage = {
    url: `${SITE_URL}/og.png`,
    width: 1200,
    height: 630,
    alt: "Fonus Studio — Producción audiovisual en Valencia",
  };

  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      languages: {
        es: absolutePageUrl("es", page),
        en: absolutePageUrl("en", page),
        "x-default": absolutePageUrl("es", page),
      },
    },
    // Legal pages must remain crawlable so Google can read their noindex rule.
    robots: { index, follow: true },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url,
      siteName: BUSINESS.tradingName,
      locale: locale === "es" ? "es_ES" : "en_GB",
      alternateLocale: locale === "es" ? "en_GB" : "es_ES",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [socialImage.url],
    },
  };
}

export const studioStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: BUSINESS.tradingName,
      alternateName: "Fonus",
      url: `${SITE_URL}/`,
      inLanguage: ["es", "en"],
      publisher: { "@id": `${SITE_URL}/#studio` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#studio`,
      name: BUSINESS.tradingName,
      legalName: BUSINESS.legalName,
      taxID: BUSINESS.taxId,
      url: `${SITE_URL}/`,
      description: "Estudio de grabación de podcast y videopodcast en Valencia. Podcast recording, video production and editing in Valencia.",
      image: `${SITE_URL}/images/hero-studio.webp`,
      logo: `${SITE_URL}/brand/fonus-logo-colour.svg`,
      email: BUSINESS.email,
      telephone: BUSINESS.phoneHref.replace("tel:", ""),
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.streetAddress,
        postalCode: BUSINESS.postalCode,
        addressLocality: BUSINESS.city,
        addressRegion: BUSINESS.province,
        addressCountry: "ES",
      },
      areaServed: { "@type": "City", name: BUSINESS.city },
    },
  ],
};
