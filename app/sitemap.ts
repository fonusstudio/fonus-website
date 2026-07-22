import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://fonusstudio.com";
  const spanish = ["", "/services", "/portfolio", "/contact"];
  const english = ["/en", "/en/services", "/en/portfolio", "/en/contact"];
  return [...spanish, ...english].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path.includes("portfolio") ? "monthly" : "yearly",
    priority: path === "" || path === "/en" ? 1 : 0.8,
  }));
}
