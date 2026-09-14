import type { MetadataRoute } from "next";
import { absolutePageUrl, INDEXABLE_PAGES } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only list searchable pages. Omit lastModified until real edit dates exist.
  return (["es", "en"] as const).flatMap((locale) =>
    INDEXABLE_PAGES.map((page) => ({ url: absolutePageUrl(locale, page) })),
  );
}
