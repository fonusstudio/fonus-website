import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageHref, type Locale, type PageName } from "../content";
import { SitePage } from "../components/site-page";

const validPages: PageName[] = ["home", "services", "portfolio", "contact"];

function resolveRoute(slug: string[]): { locale: Locale; page: PageName } | null {
  const locale: Locale = slug[0] === "en" ? "en" : "es";
  const route = locale === "en" ? slug.slice(1) : slug;
  const page = (route[0] || "home") as PageName;
  if (route.length > 1 || !validPages.includes(page)) return null;
  return { locale, page };
}

const seo = {
  es: {
    home: ["Estudio de podcast y producción audiovisual en Valencia", "Producción profesional para creadores, empresas y profesionales."],
    services: ["Servicios y precios", "Grabación, edición, videopodcast, contenido y branding con precios claros."],
    portfolio: ["Portfolio", "Producciones de podcast, vídeo y contenido creadas en Fonus Studio."],
    contact: ["Contacto y reservas", "Contacta con Fonus Studio o reserva una reunión gratuita en Valencia."],
  },
  en: {
    home: ["Podcast and creative production studio in Valencia", "Professional production for creators, businesses and professionals."],
    services: ["Services and pricing", "Recording, editing, video podcasting, content and branding with clear pricing."],
    portfolio: ["Portfolio", "Podcast, video and content productions created at Fonus Studio."],
    contact: ["Contact and booking", "Contact Fonus Studio or book a free discovery meeting in Valencia."],
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const route = resolveRoute((await params).slug);
  if (!route) return {};
  const [title, description] = seo[route.locale][route.page];
  const alternateLocale: Locale = route.locale === "es" ? "en" : "es";
  return {
    title,
    description,
    alternates: {
      canonical: pageHref(route.locale, route.page),
      languages: {
        [route.locale]: pageHref(route.locale, route.page),
        [alternateLocale]: pageHref(alternateLocale, route.page),
      },
    },
    openGraph: { title, description, url: pageHref(route.locale, route.page) },
  };
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const route = resolveRoute((await params).slug);
  if (!route) notFound();
  return <SitePage locale={route.locale} page={route.page} />;
}
