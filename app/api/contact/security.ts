const MAX_REQUEST_BYTES = 20_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_RETENTION_MS = 24 * 60 * 60 * 1000;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d\s().-]+$/;
const controlCharacters = /[\u0000-\u001f\u007f]/;
const messageControlCharacters = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

const createRateLimitTableSql = `
  CREATE TABLE IF NOT EXISTS contact_rate_limits (
    identifier TEXT PRIMARY KEY NOT NULL,
    window_started_at INTEGER NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    updated_at INTEGER NOT NULL
  )
`;

const createRateLimitIndexSql = `
  CREATE INDEX IF NOT EXISTS contact_rate_limits_updated_at_idx
  ON contact_rate_limits (updated_at)
`;

const upsertRateLimitSql = `
  INSERT INTO contact_rate_limits (identifier, window_started_at, request_count, updated_at)
  VALUES (?1, ?2, 1, ?2)
  ON CONFLICT(identifier) DO UPDATE SET
    window_started_at = CASE
      WHEN contact_rate_limits.window_started_at <= ?3 THEN ?2
      ELSE contact_rate_limits.window_started_at
    END,
    request_count = CASE
      WHEN contact_rate_limits.window_started_at <= ?3 THEN 1
      ELSE contact_rate_limits.request_count + 1
    END,
    updated_at = ?2
  RETURNING
    window_started_at AS windowStartedAt,
    request_count AS requestCount
`;

type ContactBody = Record<string, unknown>;

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  locale: "es" | "en";
  consent: true;
};

type ParseResult =
  | { ok: true; honeypot: true }
  | { ok: true; honeypot: false; body: ContactBody }
  | { ok: false; status: number; error: string };

type ValidationResult =
  | { ok: true; payload: ContactPayload }
  | { ok: false; error: string };

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

const rateLimitSchemaPromises = new WeakMap<D1Database, Promise<void>>();

async function ensureRateLimitSchema(db: D1Database) {
  let schemaPromise = rateLimitSchemaPromises.get(db);
  if (!schemaPromise) {
    schemaPromise = db
      .batch([
        db.prepare(createRateLimitTableSql),
        db.prepare(createRateLimitIndexSql),
        db.prepare("DELETE FROM contact_rate_limits WHERE updated_at < ?1").bind(
          Date.now() - RATE_LIMIT_RETENTION_MS,
        ),
      ])
      .then(() => undefined)
      .catch((error) => {
        rateLimitSchemaPromises.delete(db);
        throw error;
      });
    rateLimitSchemaPromises.set(db, schemaPromise);
  }

  return schemaPromise;
}

function getClientIdentifier(request: Request) {
  const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cloudflareIp) return cloudflareIp;

  const forwardedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwardedIp) return forwardedIp;

  return `unknown:${request.headers.get("user-agent") ?? "no-user-agent"}`;
}

async function hashIdentifier(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function readString(
  body: ContactBody,
  key: string,
  options: { min?: number; max: number; required?: boolean; allowLineBreaks?: boolean },
) {
  const rawValue = body[key];
  if (rawValue === undefined || rawValue === null) {
    return options.required ? null : "";
  }
  if (typeof rawValue !== "string") return null;

  const value = rawValue.trim();
  if (options.required && value.length < (options.min ?? 1)) return null;
  if (value.length > options.max) return null;
  if (!options.required && value.length === 0) return "";

  const invalidCharacters = options.allowLineBreaks ? messageControlCharacters : controlCharacters;
  if (invalidCharacters.test(value)) return null;
  return value;
}

export async function parseContactRequest(request: Request): Promise<ParseResult> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    return { ok: false, status: 415, error: "Unsupported content type" };
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return { ok: false, status: 413, error: "Request is too large" };
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return { ok: false, status: 400, error: "Invalid request" };
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
    return { ok: false, status: 413, error: "Request is too large" };
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return { ok: false, status: 400, error: "Invalid request" };
  }

  if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
    return { ok: false, status: 400, error: "Invalid request" };
  }

  const body = parsedBody as ContactBody;
  if (body.website !== undefined && body.website !== null && String(body.website).trim()) {
    return { ok: true, honeypot: true };
  }

  return { ok: true, honeypot: false, body };
}

export function validateContactPayload(body: ContactBody): ValidationResult {
  const name = readString(body, "name", { min: 2, max: 120, required: true });
  const email = readString(body, "email", { max: 254, required: true });
  const company = readString(body, "company", { max: 160 });
  const phone = readString(body, "phone", { max: 30 });
  const message = readString(body, "message", {
    min: 10,
    max: 5000,
    required: true,
    allowLineBreaks: true,
  });
  const locale = body.locale;
  const consent = body.consent;

  if (
    name === null ||
    email === null ||
    company === null ||
    phone === null ||
    message === null ||
    !emailPattern.test(email) ||
    (phone.length > 0 && (phone.length < 7 || !phonePattern.test(phone))) ||
    (locale !== "es" && locale !== "en") ||
    (consent !== true && consent !== "on")
  ) {
    return { ok: false, error: "Missing or invalid fields" };
  }

  return {
    ok: true,
    payload: {
      name,
      email: email.toLowerCase(),
      company,
      phone,
      message,
      locale,
      consent: true,
    },
  };
}

export async function enforceContactRateLimit(
  request: Request,
  db: D1Database,
): Promise<RateLimitResult> {
  await ensureRateLimitSchema(db);
  const now = Date.now();
  const identifier = await hashIdentifier(getClientIdentifier(request));
  const expiredBefore = now - RATE_LIMIT_WINDOW_MS;
  const row = await db
    .prepare(upsertRateLimitSql)
    .bind(identifier, now, expiredBefore)
    .first<{ windowStartedAt: number; requestCount: number }>();

  if (!row) throw new Error("Rate limit state could not be recorded");

  return {
    allowed: row.requestCount <= RATE_LIMIT_MAX_REQUESTS,
    limit: RATE_LIMIT_MAX_REQUESTS,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - row.requestCount),
    resetAt: row.windowStartedAt + RATE_LIMIT_WINDOW_MS,
  };
}

export function getRateLimitHeaders(result: RateLimitResult) {
  return {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}
