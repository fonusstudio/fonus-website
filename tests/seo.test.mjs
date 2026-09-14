import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";

const require = createRequire(import.meta.url);
const productionOrigin = "https://fonusstudio.com";
const searchablePaths = ["/", "/services", "/portfolio", "/contact", "/en", "/en/services", "/en/portfolio", "/en/contact"];
const legalPaths = ["/politica-privacidad", "/politica-cookies", "/aviso-legal", "/en/privacy-policy", "/en/cookie-policy", "/en/legal-notice"];
let server;
let baseUrl = process.env.SEO_BASE_URL;

// Verify the real Next.js production response, not the old Cloudflare build.
before(async () => {
  if (baseUrl) return;
  server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "--port", "0"], {
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  await new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(() => reject(new Error(`Next.js did not start: ${output}`)), 30_000);
    server.once("error", (error) => { clearTimeout(timeout); reject(error); });
    server.once("exit", (code) => { clearTimeout(timeout); reject(new Error(`Next.js exited (${code}): ${output}`)); });
    const onData = (chunk) => {
      output += chunk.toString();
      baseUrl = output.match(/http:\/\/localhost:\d+/)?.[0];
      if (baseUrl && /Ready in/.test(output)) { clearTimeout(timeout); resolve(); }
    };
    server.stdout.on("data", onData);
    server.stderr.on("data", onData);
  });
});

after(() => { server?.kill(); });

async function page(path, headers = {}) {
  const response = await fetch(new URL(path, baseUrl), {
    headers: { "user-agent": "Googlebot", ...headers },
    redirect: "manual",
  });
  return { response, html: await response.text() };
}

function metadataTag(html, attribute, name) {
  return [...html.matchAll(/<(?:meta|link)\b[^>]*>/g)]
    .map(([tag]) => tag).find((tag) => tag.includes(`${attribute}="${name}"`));
}

test("all public routes expose correct language, canonicals and indexing rules", async () => {
  const titles = new Set();
  for (const path of [...searchablePaths, ...legalPaths]) {
    const { response, html } = await page(path);
    assert.equal(response.status, 200, path);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path}: one main heading`);
    const locale = path === "/en" || path.startsWith("/en/") ? "en" : "es";
    assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`), path);
    const canonical = metadataTag(html, "rel", "canonical");
    assert.ok(canonical, `${path}: canonical`);
    const canonicalUrl = new URL(canonical.match(/href="([^"]+)"/)[1]);
    assert.equal(canonicalUrl.origin, productionOrigin, path);
    assert.equal(canonicalUrl.pathname, path, path);
    const robots = metadataTag(html, "name", "robots");
    assert.match(robots ?? "", legalPaths.includes(path) ? /content="noindex, follow"/ : /content="index, follow"/, path);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title?.endsWith(" | Fonus Studio"), `${path}: branded title`);
    assert.ok(!titles.has(title), `${path}: distinct title`);
    titles.add(title);
    assert.ok(metadataTag(html, "name", "description"), path);
    assert.ok(metadataTag(html, "property", "og:image")?.includes(`${productionOrigin}/og.png`), path);
    assert.ok(metadataTag(html, "property", "og:locale")?.includes(locale === "en" ? "en_GB" : "es_ES"), path);
  }
});

test("language alternates are reciprocal and include a Spanish default", async () => {
  for (const suffix of ["", "/services", "/portfolio", "/contact"]) {
    for (const path of [suffix || "/", `/en${suffix}`]) {
      const { html } = await page(path);
      for (const [locale, alternatePath] of [["es", suffix || "/"], ["en", `/en${suffix}`], ["x-default", suffix || "/"]]) {
        const tag = [...html.matchAll(/<link\b[^>]*>/g)].map(([value]) => value)
          .find((value) => new RegExp(`hreflang="${locale}"`, "i").test(value));
        assert.ok(tag, `${path}: ${locale} alternate`);
        assert.equal(new URL(tag.match(/href="([^"]+)"/)[1]).href, new URL(alternatePath, productionOrigin).href);
      }
    }
  }
});

test("homepages describe the podcast studio and include valid business and site data", async () => {
  for (const path of ["/", "/en"]) {
    const { html } = await page(path);
    assert.match(html, /<h1>[^<]*podcast[^<]*Valencia/i);
    assert.match(html, /Campoamor 68/);
    const graphs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .flatMap(([, json]) => JSON.parse(json)["@graph"] ?? []);
    const studio = graphs.find((entry) => entry["@type"] === "ProfessionalService");
    const website = graphs.find((entry) => entry["@type"] === "WebSite");
    assert.equal(studio.address.addressLocality, "Valencia");
    assert.equal(studio.telephone, "+34614692775");
    assert.equal(website.name, "Fonus Studio");
    assert.equal(website.publisher["@id"], studio["@id"]);
    assert.ok(!studio.aggregateRating, "No fabricated ratings");
  }
});

test("sitemap lists only canonical marketing pages and legal pages remain crawlable", async () => {
  const { response, html: xml } = await page("/sitemap.xml");
  assert.equal(response.status, 200);
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => new URL(url));
  assert.deepEqual(urls.map((url) => url.pathname).sort(), [...searchablePaths].sort());
  assert.ok(urls.every((url) => url.origin === productionOrigin));
  assert.doesNotMatch(xml, /<lastmod>/, "No invented update timestamps");
  const { html: robots } = await page("/robots.txt");
  assert.match(robots, /Sitemap: https:\/\/fonusstudio.com\/sitemap.xml/);
  assert.doesNotMatch(robots, /Disallow:\s*\//);
  const { html } = await page("/");
  assert.match(html, /href="\/politica-privacidad"/);
});

test("preview hosts and supplied language headers cannot corrupt metadata", async () => {
  const { html } = await page("/en", {
    "x-forwarded-host": "untrusted.example",
    "x-forwarded-proto": "http",
    "x-fonus-locale": "es",
  });
  assert.match(html, /<html[^>]*lang="en"/);
  assert.ok(metadataTag(html, "rel", "canonical")?.includes(`${productionOrigin}/en`));
  assert.doesNotMatch(metadataTag(html, "property", "og:image") ?? "", /untrusted/);
  const { html: spanish } = await page("/services", { "x-fonus-locale": "en" });
  assert.match(spanish, /<html[^>]*lang="es"/);
});

test("unknown routes remain 404 and the saved English preference still redirects", async () => {
  const missing = await page("/this-page-does-not-exist");
  assert.equal(missing.response.status, 404);
  assert.match(missing.html, /name="robots" content="noindex"/);
  const englishPreference = await page("/", { cookie: "fonus_language=en" });
  assert.equal(englishPreference.response.status, 307);
  assert.equal(englishPreference.response.headers.get("location"), "/en");
});
