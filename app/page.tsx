import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SitePage } from "./components/site-page";
import { LANGUAGE_COOKIE } from "./consent";
import { pageMetadata } from "./seo";

export const metadata: Metadata = pageMetadata("es", "home");

export default async function Home() {
  const language = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  if (language === "en") redirect("/en");
  return <SitePage locale="es" page="home" />;
}
