import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://fonusstudio.com";
  const spanish = [
    "",
    "/services",
    "/portfolio",
    "/contact",
    "/politica-privacidad",
    "/politica-cookies",
    "/aviso-legal",
  ];
  const english = [
    "/en",
    "/en/services",
    "/en/portfolio",
    "/en/contact",
    "/en/privacy-policy",
    "/en/cookie-policy",
    "/en/legal-notice",
  ];
  return [...spanish, ...english].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path.includes("portfolio") ? "monthly" : "yearly",
    priority: path === "" || path === "/en" ? 1 : 0.8,
  }));
}
