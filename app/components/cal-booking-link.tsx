"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import type { Locale } from "../content";

const CAL_EMBED_SCRIPT_URL = "https://app.cal.com/embed/embed.js";
const CAL_BOOKINGS = {
  es: { namespace: "30min", path: "fonusstudio/30min" },
  en: { namespace: "welcome-meeting", path: "fonusstudio/welcome-meeting" },
} as const;

type CalFunction = {
  (...args: unknown[]): void;
  config?: { forwardQueryParams?: boolean };
  loaded?: boolean;
  ns?: Record<string, CalFunction>;
  q?: unknown[][];
};

function configureCalEmbed(namespace: string) {
  const calWindow = window as Window & { Cal?: CalFunction };
  const enqueue = (target: CalFunction, args: unknown[]) => {
    target.q ??= [];
    target.q.push(args);
  };

  if (!calWindow.Cal) {
    const cal = ((...args: unknown[]) => {
      if (!cal.loaded) {
        cal.ns = {};
        cal.q ??= [];
        const script = document.createElement("script");
        script.src = CAL_EMBED_SCRIPT_URL;
        script.async = true;
        script.addEventListener("load", () => {
          document.documentElement.dataset.calEmbedReady = "true";
        }, { once: true });
        document.head.appendChild(script);
        cal.loaded = true;
      }

      if (args[0] === "init") {
        const api = ((...apiArgs: unknown[]) => enqueue(api, apiArgs)) as CalFunction;
        const namespace = args[1];
        api.q = [];

        if (typeof namespace === "string") {
          cal.ns ??= {};
          const namespacedApi = cal.ns[namespace] ?? api;
          cal.ns[namespace] = namespacedApi;
          enqueue(namespacedApi, args);
          enqueue(cal, ["initNamespace", namespace]);
        } else {
          enqueue(cal, args);
        }
        return;
      }

      enqueue(cal, args);
    }) as CalFunction;

    calWindow.Cal = cal;
  }

  const cal = calWindow.Cal;
  cal("init", namespace, { origin: "https://app.cal.com" });
  cal.config ??= {};
  cal.config.forwardQueryParams = true;
  cal.ns?.[namespace]?.("ui", {
    cssVarsPerTheme: {
      light: { "cal-brand": "#000000" },
      dark: { "cal-brand": "#ff6123" },
    },
    hideEventTypeDetails: false,
    layout: "month_view",
  });
}

function queuePopupWhileEmbedLoads(namespace: string, path: string) {
  if (document.documentElement.dataset.calEmbedReady === "true") return;

  const calWindow = window as Window & { Cal?: CalFunction };
  calWindow.Cal?.ns?.[namespace]?.("modal", { calLink: path });
}

type CalBookingLinkProps = {
  children: ReactNode;
  locale: Locale;
};

export function CalBookingLink({ children, locale }: CalBookingLinkProps) {
  const booking = CAL_BOOKINGS[locale];

  useEffect(() => {
    configureCalEmbed(booking.namespace);
  }, [booking.namespace]);

  return (
    <button
      type="button"
      className="button button-primary"
      onClick={() => queuePopupWhileEmbedLoads(booking.namespace, booking.path)}
      data-cal-link={booking.path}
      data-cal-namespace={booking.namespace}
      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
    >
      {children}
    </button>
  );
}
