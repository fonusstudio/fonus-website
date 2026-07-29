"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { Locale } from "../content";
import { CONSENT_COOKIE, CONSENT_VERSION, LANGUAGE_COOKIE } from "../consent";

const SIX_MONTHS_SECONDS = 60 * 60 * 24 * 183;
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export type ConsentPreferences = {
  version: number;
  functional: boolean;
  analytics: boolean;
  updatedAt: string;
};

type ConsentContextValue = {
  preferences: ConsentPreferences | null;
  ready: boolean;
  modalOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (selection: Pick<ConsentPreferences, "functional" | "analytics">) => void;
  enableFunctional: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

const ui = {
  es: {
    title: "Tu privacidad, a tu manera.",
    text: "Usamos tecnologías esenciales y, solo si lo autorizas, contenido funcional y analítica. No utilizamos cookies publicitarias.",
    accept: "Aceptar todas",
    reject: "Rechazar no esenciales",
    customise: "Personalizar",
    policy: "Política de Cookies",
    modalTitle: "Preferencias de cookies",
    modalText: "Elige qué servicios pueden activarse. Puedes cambiar tu decisión en cualquier momento desde el pie de página.",
    essential: "Esenciales",
    essentialText: "Necesarias para el funcionamiento, la seguridad y para recordar tu elección.",
    functional: "Funcionales",
    functionalText: "Idioma y contenidos de Cal.com, Google Maps y Vimeo.",
    analytics: "Analíticas",
    analyticsText: "Google Analytics 4 para comprender el uso del sitio.",
    always: "Siempre activas",
    save: "Guardar preferencias",
    cancel: "Cancelar",
    close: "Cerrar preferencias de cookies",
    preferences: "Preferencias de cookies",
  },
  en: {
    title: "Privacy, on your terms.",
    text: "We use essential technologies and, only if you allow them, functional content and analytics. We do not use advertising cookies.",
    accept: "Accept all",
    reject: "Reject non-essential",
    customise: "Customise",
    policy: "Cookie Policy",
    modalTitle: "Cookie preferences",
    modalText: "Choose which services may be enabled. You can change your decision at any time from the footer.",
    essential: "Essential",
    essentialText: "Required for operation, security and remembering your choice.",
    functional: "Functional",
    functionalText: "Language and Cal.com, Google Maps and Vimeo content.",
    analytics: "Analytics",
    analyticsText: "Google Analytics 4 to understand website usage.",
    always: "Always on",
    save: "Save preferences",
    cancel: "Cancel",
    close: "Close cookie preferences",
    preferences: "Cookie preferences",
  },
} as const;

function currentLocale(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
}

function getConsentCookieValue() {
  return document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1) ?? "";
}

function parseConsent(rawCookie: string): ConsentPreferences | null {
  if (!rawCookie) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(rawCookie)) as Partial<ConsentPreferences>;
    if (
      parsed.version !== CONSENT_VERSION ||
      typeof parsed.functional !== "boolean" ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.updatedAt !== "string"
    ) {
      return null;
    }
    return parsed as ConsentPreferences;
  } catch {
    return null;
  }
}

function subscribeToConsent(callback: () => void) {
  window.addEventListener("fonus-consent-change", callback);
  return () => window.removeEventListener("fonus-consent-change", callback);
}

function subscribeToHydration() {
  return () => undefined;
}

function setCookie(name: string, value: string, maxAge: number) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function deleteCookie(name: string) {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, ".fonusstudio.com"];
  for (const domain of domains) {
    const domainAttribute = domain ? `; Domain=${domain}` : "";
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${domainAttribute}`;
  }
}

function clearCategoryCookies(category: "functional" | "analytics") {
  if (category === "functional") deleteCookie(LANGUAGE_COOKIE);
  if (category === "analytics") {
    for (const item of document.cookie.split("; ")) {
      const name = item.split("=")[0];
      if (name === "_ga" || name.startsWith("_ga_")) deleteCookie(name);
    }
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = currentLocale(pathname);
  const consentCookie = useSyncExternalStore(subscribeToConsent, getConsentCookieValue, () => "");
  const preferences = parseConsent(consentCookie);
  const ready = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function commit(selection: Pick<ConsentPreferences, "functional" | "analytics">) {
    const previous = preferences;
    const next: ConsentPreferences = {
      version: CONSENT_VERSION,
      functional: selection.functional,
      analytics: selection.analytics,
      updatedAt: new Date().toISOString(),
    };
    setCookie(CONSENT_COOKIE, JSON.stringify(next), SIX_MONTHS_SECONDS);
    window.dispatchEvent(new Event("fonus-consent-change"));
    setModalOpen(false);

    const revokedFunctional = previous?.functional && !next.functional;
    const revokedAnalytics = previous?.analytics && !next.analytics;
    if (revokedFunctional) clearCategoryCookies("functional");
    if (revokedAnalytics) clearCategoryCookies("analytics");
    if (revokedFunctional || revokedAnalytics) window.location.reload();
  }

  const value: ConsentContextValue = {
    preferences,
    ready,
    modalOpen,
    openPreferences: () => setModalOpen(true),
    closePreferences: () => setModalOpen(false),
    acceptAll: () => commit({ functional: true, analytics: true }),
    rejectNonEssential: () => commit({ functional: false, analytics: false }),
    savePreferences: commit,
    enableFunctional: () => commit({
      functional: true,
      analytics: preferences?.analytics ?? false,
    }),
  };

  return (
    <ConsentContext.Provider value={value}>
      {children}
      <ConsentUi locale={locale} />
      <ConsentAwareAnalytics />
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) throw new Error("useConsent must be used inside ConsentProvider");
  return context;
}

function ConsentUi({ locale }: { locale: Locale }) {
  const consent = useConsent();
  const t = ui[locale];
  const policyHref = locale === "es" ? "/politica-cookies" : "/en/cookie-policy";

  return (
    <>
      {consent.ready && !consent.preferences && !consent.modalOpen ? (
        <section className="cookie-banner" aria-labelledby="cookie-banner-title">
          <div className="cookie-banner-copy">
            <p className="eyebrow">Fonus Studio · Privacy</p>
            <h2 id="cookie-banner-title">{t.title}</h2>
            <p>{t.text} <Link href={policyHref}>{t.policy}</Link>.</p>
          </div>
          <div className="cookie-banner-actions">
            <button className="button button-primary" type="button" onClick={consent.acceptAll}>{t.accept}</button>
            <button className="button button-secondary" type="button" onClick={consent.rejectNonEssential}>{t.reject}</button>
            <button className="cookie-text-button" type="button" onClick={consent.openPreferences}>{t.customise}</button>
          </div>
        </section>
      ) : null}
      {consent.modalOpen ? <PreferencesModal locale={locale} /> : null}
    </>
  );
}

function PreferencesModal({ locale }: { locale: Locale }) {
  const consent = useConsent();
  const t = ui[locale];
  const dialogRef = useRef<HTMLDivElement>(null);
  const [functional, setFunctional] = useState(consent.preferences?.functional ?? false);
  const [analytics, setAnalytics] = useState(consent.preferences?.analytics ?? false);

  useEffect(() => {
    const dialog = dialogRef.current;
    const site = document.querySelector<HTMLElement>(".site-root");
    site?.setAttribute("inert", "");
    dialog?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        consent.closePreferences();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      site?.removeAttribute("inert");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [consent]);

  return (
    <div className="cookie-modal-backdrop">
      <div
        className="cookie-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
        aria-describedby="cookie-modal-description"
        ref={dialogRef}
      >
        <div className="cookie-modal-heading">
          <div>
            <p className="eyebrow">Fonus Studio · Privacy</p>
            <h2 id="cookie-modal-title">{t.modalTitle}</h2>
          </div>
          <button className="cookie-modal-close" type="button" onClick={consent.closePreferences} aria-label={t.close} data-autofocus>×</button>
        </div>
        <p id="cookie-modal-description">{t.modalText}</p>

        <div className="cookie-options">
          <div className="cookie-option">
            <div><h3>{t.essential}</h3><p>{t.essentialText}</p></div>
            <span className="cookie-always">{t.always}</span>
          </div>
          <label className="cookie-option">
            <div><h3>{t.functional}</h3><p>{t.functionalText}</p></div>
            <span className="switch">
              <input type="checkbox" checked={functional} onChange={(event) => setFunctional(event.target.checked)} />
              <span aria-hidden="true" />
            </span>
          </label>
          <label className="cookie-option">
            <div><h3>{t.analytics}</h3><p>{t.analyticsText}</p></div>
            <span className="switch">
              <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
              <span aria-hidden="true" />
            </span>
          </label>
        </div>

        <div className="cookie-modal-actions">
          <button className="button button-primary" type="button" onClick={() => consent.savePreferences({ functional, analytics })}>{t.save}</button>
          <button className="button button-secondary" type="button" onClick={consent.rejectNonEssential}>{t.reject}</button>
          <button className="cookie-text-button" type="button" onClick={consent.closePreferences}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}

export function CookiePreferencesButton({ locale }: { locale: Locale }) {
  const consent = useConsent();
  return (
    <button className="footer-cookie-button" type="button" onClick={consent.openPreferences}>
      {ui[locale].preferences}
    </button>
  );
}

type LanguagePreferenceLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  hrefLang: Locale;
  "aria-label": string;
};

export function LanguagePreferenceLink({
  children,
  hrefLang,
  ...props
}: LanguagePreferenceLinkProps) {
  const consent = useConsent();

  function rememberLanguage() {
    if (consent.preferences?.functional) {
      setCookie(LANGUAGE_COOKIE, hrefLang, ONE_YEAR_SECONDS);
    }
  }

  return <Link {...props} hrefLang={hrefLang} onClick={rememberLanguage}>{children}</Link>;
}

type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: Gtag;
};

function ConsentAwareAnalytics() {
  const { preferences, ready } = useConsent();
  const pathname = usePathname();
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
  const validMeasurementId = /^G-[A-Z0-9]+$/i.test(measurementId);
  const loadedRef = useRef(false);
  const initialPathRef = useRef(pathname);

  useEffect(() => {
    if (!ready || !validMeasurementId) return;
    const analyticsWindow = window as AnalyticsWindow;
    // The root layout creates this queue before hydration so Google sees the
    // denied defaults before any config or event command.
    if (!Array.isArray(analyticsWindow.dataLayer)) analyticsWindow.dataLayer = [];
    if (typeof analyticsWindow.gtag !== "function") {
      analyticsWindow.gtag = function gtag() {
        // Google Tag expects the function's Arguments object, not a rest array.
        // eslint-disable-next-line prefer-rest-params
        analyticsWindow.dataLayer?.push(arguments);
      };
    }
    const gtag = analyticsWindow.gtag;

    if (!preferences?.analytics) return;
    gtag("consent", "update", {
      analytics_storage: "granted",
      functionality_storage: preferences.functional ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    if (!loadedRef.current) {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.async = true;
      script.dataset.fonusAnalytics = "true";
      document.head.appendChild(script);
      gtag("js", new Date());
      gtag("config", measurementId, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      loadedRef.current = true;
    }
  }, [measurementId, preferences, ready, validMeasurementId]);

  useEffect(() => {
    if (!preferences?.analytics || !loadedRef.current || pathname === initialPathRef.current) return;
    (window as AnalyticsWindow).gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, preferences?.analytics]);

  return null;
}

export function FunctionalEmbed({
  title,
  description,
  buttonLabel,
  policyLabel,
  policyHref,
  children,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  policyLabel: string;
  policyHref: string;
  children: ReactNode;
}) {
  const consent = useConsent();
  if (consent.preferences?.functional) return <>{children}</>;

  return (
    <div className="embed-placeholder" role="group" aria-label={title}>
      <span className="embed-placeholder-mark" aria-hidden="true">◎</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="embed-placeholder-actions">
        <button className="button button-primary" type="button" onClick={consent.enableFunctional}>{buttonLabel}</button>
        <a href={policyHref} target="_blank" rel="noreferrer">{policyLabel} ↗</a>
      </div>
    </div>
  );
}
