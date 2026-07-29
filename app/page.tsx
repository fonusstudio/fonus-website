import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SitePage } from "./components/site-page";
import { LANGUAGE_COOKIE } from "./consent";

export const metadata: Metadata = {
  title: "Estudio de podcast y producción audiovisual en Valencia",
  description:
    "Producción profesional de podcasts, videopodcasts y contenido para marcas y creadores en Valencia.",
  alternates: {
    canonical: "/",
    languages: { es: "/", en: "/en" },
  },
};

export default async function Home() {
  const language = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  if (language === "en") redirect("/en");
  return <SitePage locale="es" page="home" />;
}
