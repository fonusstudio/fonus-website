import type { Metadata } from "next";
import { SitePage } from "./components/site-page";

export const metadata: Metadata = {
  title: "Estudio de podcast y producción audiovisual en Valencia",
  description:
    "Producción profesional de podcasts, videopodcasts y contenido para marcas y creadores en Valencia.",
  alternates: {
    canonical: "/",
    languages: { es: "/", en: "/en" },
  },
};

export default function Home() {
  return <SitePage locale="es" page="home" />;
}
