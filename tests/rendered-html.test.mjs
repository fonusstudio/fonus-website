import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

function createFakeRateLimitDb() {
  const entries = new Map();

  return {
    prepare(sql) {
      let bindings = [];
      const statement = {
        bind(...values) {
          bindings = values;
          return statement;
        },
        async run() {
          if (sql.includes("DELETE FROM contact_rate_limits")) {
            const [cutoff] = bindings;
            for (const [identifier, entry] of entries) {
              if (entry.updatedAt < cutoff) entries.delete(identifier);
            }
          }
          return { success: true, results: [] };
        },
        async first() {
          if (!sql.includes("INSERT INTO contact_rate_limits")) return null;

          const [identifier, now, expiredBefore] = bindings;
          const existing = entries.get(identifier);
          const entry = !existing || existing.windowStartedAt <= expiredBefore
            ? { windowStartedAt: now, requestCount: 1, updatedAt: now }
            : { ...existing, requestCount: existing.requestCount + 1, updatedAt: now };
          entries.set(identifier, entry);
          return {
            windowStartedAt: entry.windowStartedAt,
            requestCount: entry.requestCount,
          };
        },
      };
      return statement;
    },
    async batch(statements) {
      return Promise.all(statements.map((statement) => statement.run()));
    },
  };
}

const environment = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
  DB: createFakeRateLimitDb(),
};

async function request(path) {
  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    environment,
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function contactRequest(body, ip, contentType = "application/json") {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  return worker.fetch(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": contentType,
        "x-forwarded-for": ip,
      },
      body: payload,
    }),
    environment,
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the Spanish homepage with production metadata", async () => {
  const response = await request("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="es">/i);
  assert.match(html, /Fonus Studio/);
  assert.match(html, /Producci.n profesional para historias/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/fonusstudio\.com\/"/i);
  assert.match(html, /<meta property="og:image"/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("renders every public page in Spanish and English", async () => {
  const paths = [
    "/services",
    "/portfolio",
    "/contact",
    "/en",
    "/en/services",
    "/en/portfolio",
    "/en/contact",
  ];

  for (const path of paths) {
    const response = await request(path);
    assert.equal(response.status, 200, `${path} should render successfully`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  }
});

test("renders the services page with a full hero image", async () => {
  const response = await request("/services");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<section class="services-hero">/i);
  assert.match(html, /video-production\.webp/i);
  assert.match(html, /services-hero-photo/i);
});

test("groups packages beneath their matching service", async () => {
  const response = await request("/services");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.doesNotMatch(html, /service-detail-list|pricing-section/i);
  assert.match(html, /<article class="service-offer">[\s\S]*?<h2>Audio<\/h2>[\s\S]*?Producci.n de audio[\s\S]*?Solo grabaci.n/i);
  assert.match(html, /<article class="service-offer">[\s\S]*?<h2>Video<\/h2>[\s\S]*?Producci.n de v.deo[\s\S]*?Solo grabaci.n/i);
  assert.ok((html.match(/pricing-grid pricing-grid-4/g) ?? []).length >= 2);
  assert.ok((html.match(/price-card-recording-only/g) ?? []).length >= 2);
  assert.match(html, /<article class="service-offer">[\s\S]*?Servicios extra[\s\S]*?Packs y complementos[\s\S]*?Portadas y miniaturas[\s\S]*?Pack de branding[\s\S]*?Transcripci.n y subtitulado/i);
});

test("offers negotiated long-term plans in both languages", async () => {
  const spanishResponse = await request("/services");
  assert.equal(spanishResponse.status, 200);
  const spanishHtml = await spanishResponse.text();
  assert.match(spanishHtml, /Acuerdos para sesiones recurrentes/i);
  assert.match(spanishHtml, /precio por sesi.n negociado/i);
  assert.match(spanishHtml, /Posibles extras incluidos/i);

  const englishResponse = await request("/en/services");
  assert.equal(englishResponse.status, 200);
  const englishHtml = await englishResponse.text();
  assert.match(englishHtml, /Long-term deals for repeat sessions/i);
  assert.match(englishHtml, /per-session rate negotiated/i);
  assert.match(englishHtml, /Possible included extras/i);
});

test("uses Cal.com for discovery meeting bookings", async () => {
  const spanishResponse = await request("/contact");
  assert.equal(spanishResponse.status, 200);

  const spanishHtml = await spanishResponse.text();
  assert.match(spanishHtml, /data-cal-link="fonusstudio\/30min"/i);
  assert.match(spanishHtml, /data-cal-namespace="30min"/i);
  const spanishTrigger = spanishHtml.match(/<button[^>]*data-cal-link="fonusstudio\/30min"[^>]*>/i)?.[0];
  assert.ok(spanishTrigger, "Spanish booking trigger should be a button");
  assert.doesNotMatch(spanishTrigger, /\btarget=/i);
  assert.doesNotMatch(spanishTrigger, /\bhref=/i);
  assert.doesNotMatch(spanishHtml, /<select[^>]*name="service"/i);
  assert.doesNotMatch(spanishHtml, /Selecciona un servicio/i);
  assert.match(spanishHtml, /name="website"/i);
  assert.match(spanishHtml, /tabindex="-1"/i);
  assert.doesNotMatch(spanishHtml, /calendar\.app\.google/i);

  const englishResponse = await request("/en/contact");
  assert.equal(englishResponse.status, 200);
  const englishHtml = await englishResponse.text();
  assert.match(englishHtml, /data-cal-link="fonusstudio\/welcome-meeting"/i);
  assert.match(englishHtml, /data-cal-namespace="welcome-meeting"/i);
  const englishTrigger = englishHtml.match(/<button[^>]*data-cal-link="fonusstudio\/welcome-meeting"[^>]*>/i)?.[0];
  assert.ok(englishTrigger, "English booking trigger should be a button");
  assert.doesNotMatch(englishTrigger, /\btarget=/i);
  assert.doesNotMatch(englishTrigger, /\bhref=/i);
});

test("silently accepts honeypot submissions without sending", async () => {
  const response = await contactRequest(
    { website: "https://spam.example", locale: "es" },
    "192.0.2.10",
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(response.headers.get("RateLimit-Limit"), null);
});

test("validates contact submissions on the server", async () => {
  const unsupported = await contactRequest("plain text", "192.0.2.20", "text/plain");
  assert.equal(unsupported.status, 415);

  const oversized = await contactRequest(
    { message: "x".repeat(20_001) },
    "192.0.2.21",
  );
  assert.equal(oversized.status, 413);

  const invalid = await contactRequest(
    {
      name: "A",
      email: "not-an-email",
      company: "",
      phone: "call me",
      message: "Too short",
      locale: "es",
    },
    "192.0.2.22",
  );
  assert.equal(invalid.status, 400);
  assert.equal(invalid.headers.get("RateLimit-Remaining"), "4");
});

test("rate limits repeated contact attempts", async () => {
  const ip = "192.0.2.30";
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await contactRequest({}, ip);
    assert.equal(response.status, 400);
  }

  const blocked = await contactRequest({}, ip);
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get("RateLimit-Limit"), "5");
  assert.equal(blocked.headers.get("RateLimit-Remaining"), "0");
  assert.ok(Number(blocked.headers.get("Retry-After")) > 0);
});

test("sends the studio notification and submitter confirmation together", async () => {
  const originalFetch = globalThis.fetch;
  const previousApiKey = process.env.RESEND_API_KEY;
  const previousFromEmail = process.env.CONTACT_FROM_EMAIL;
  const previousToEmail = process.env.CONTACT_TO_EMAIL;
  let resendRequest;

  process.env.RESEND_API_KEY = "re_test_key";
  process.env.CONTACT_FROM_EMAIL = "Fonus Studio <forms@contact.fonusstudio.com>";
  process.env.CONTACT_TO_EMAIL = "info@fonusstudio.com";
  globalThis.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    assert.equal(url, "https://api.resend.com/emails/batch");
    resendRequest = init;
    return Response.json({ data: [{ id: "internal" }, { id: "confirmation" }] });
  };

  try {
    const response = await contactRequest(
      {
        name: "Test Client",
        email: "client@example.com",
        company: "Example Company",
        phone: "+34 600 000 000",
        message: "This is a safe automated test enquiry for the contact form.",
        locale: "es",
        website: "",
      },
      "192.0.2.40",
    );
    assert.equal(response.status, 200);
  } finally {
    globalThis.fetch = originalFetch;
    if (previousApiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousApiKey;
    if (previousFromEmail === undefined) delete process.env.CONTACT_FROM_EMAIL;
    else process.env.CONTACT_FROM_EMAIL = previousFromEmail;
    if (previousToEmail === undefined) delete process.env.CONTACT_TO_EMAIL;
    else process.env.CONTACT_TO_EMAIL = previousToEmail;
  }

  assert.ok(resendRequest);
  const outboundEmails = JSON.parse(resendRequest.body);
  assert.equal(outboundEmails.length, 2);
  assert.deepEqual(outboundEmails[0].to, ["info@fonusstudio.com"]);
  assert.equal(outboundEmails[0].reply_to, "client@example.com");
  assert.deepEqual(outboundEmails[1].to, ["client@example.com"]);
  assert.equal(outboundEmails[1].reply_to, "info@fonusstudio.com");
  assert.match(outboundEmails[1].subject, /Hemos recibido tu solicitud/i);
  assert.match(outboundEmails[1].html, /Gracias por escribirnos/i);
});

test("serves search-engine files and a real not-found page", async () => {
  const robots = await request("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap:\s*https:\/\/fonusstudio\.com\/sitemap\.xml/i);

  const sitemap = await request("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get("content-type") ?? "", /application\/xml/i);
  assert.match(await sitemap.text(), /https:\/\/fonusstudio\.com\/en\/contact/i);

  const missing = await request("/this-page-does-not-exist");
  assert.equal(missing.status, 404);
});
