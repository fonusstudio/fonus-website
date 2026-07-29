"use client";

import type { ReactNode } from "react";
import type { Locale } from "../content";
import { useConsent } from "./consent-manager";

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
  const consent = useConsent();

  function openBooking() {
    if (!consent.preferences?.functional) consent.enableFunctional();
    configureCalEmbed(booking.namespace);
    queuePopupWhileEmbedLoads(booking.namespace, booking.path);
  }

  return (
    <div className="booking-consent">
      {!consent.preferences?.functional ? (
        <p>
          {locale === "es"
            ? "Al continuar, habilitarás el calendario de Cal.com y sus tecnologías funcionales."
            : "Continuing enables the Cal.com calendar and its functional technologies."}
        </p>
      ) : null}
      <button
        type="button"
        className="button button-primary"
        onClick={openBooking}
        data-cal-link={booking.path}
        data-cal-namespace={booking.namespace}
        data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
      >
        {consent.preferences?.functional
          ? children
          : locale === "es" ? "Habilitar y reservar" : "Enable and book"}
      </button>
      <a className="booking-privacy-link" href="https://cal.com/privacy" target="_blank" rel="noreferrer">
        {locale === "es" ? "Privacidad de Cal.com ↗" : "Cal.com privacy ↗"}
      </a>
    </div>
  );
}
