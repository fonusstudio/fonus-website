/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import {
  enforceContactRateLimit,
  getRateLimitHeaders,
  parseContactRequest,
  validateContactPayload,
} from "../app/api/contact/security";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    if (url.pathname === "/api/contact" && request.method === "POST") {
      const parsedRequest = await parseContactRequest(request.clone());
      if (!parsedRequest.ok) {
        return Response.json(
          { error: parsedRequest.error },
          { status: parsedRequest.status },
        );
      }

      if (parsedRequest.honeypot) {
        return Response.json({ ok: true });
      }

      let rateLimit;
      try {
        rateLimit = await enforceContactRateLimit(request, env.DB);
      } catch {
        return Response.json(
          { error: "Form protection is temporarily unavailable" },
          { status: 503 },
        );
      }

      const rateLimitHeaders = getRateLimitHeaders(rateLimit);
      if (!rateLimit.allowed) {
        return Response.json(
          { error: "Too many requests" },
          {
            status: 429,
            headers: {
              ...rateLimitHeaders,
              "Retry-After": String(
                Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
              ),
            },
          },
        );
      }

      const validation = validateContactPayload(parsedRequest.body);
      if (!validation.ok) {
        return Response.json(
          { error: validation.error },
          { status: 400, headers: rateLimitHeaders },
        );
      }

      const appResponse = await handler.fetch(request, env, ctx);
      const headers = new Headers(appResponse.headers);
      for (const [name, value] of Object.entries(rateLimitHeaders)) {
        headers.set(name, value);
      }
      return new Response(appResponse.body, {
        status: appResponse.status,
        statusText: appResponse.statusText,
        headers,
      });
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
