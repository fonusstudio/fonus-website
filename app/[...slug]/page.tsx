import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageFromPath, type Locale, type PageName } from "../content";
import { SitePage } from "../components/site-page";
import { pageMetadata } from "../seo";

function resolveRoute(slug: string[]): { locale: Locale; page: PageName } | null {
  const locale: Locale = slug[0] === "en" ? "en" : "es";
  const route = locale === "en" ? slug.slice(1) : slug;
  if (route.length > 1) return null;
  const page = pageFromPath(locale, route[0] ?? "");
  if (!page) return null;
  return { locale, page };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const route = resolveRoute((await params).slug);
  if (!route) return {};
  return pageMetadata(route.locale, route.page);
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const route = resolveRoute((await params).slug);
  if (!route) notFound();
  return <SitePage locale={route.locale} page={route.page} />;
}
