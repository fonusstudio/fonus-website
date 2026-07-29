"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { pageHref, type Locale } from "../content";

const labels = {
  es: {
    name: "Nombre y apellidos",
    company: "Empresa (opcional)",
    email: "Correo electrónico",
    phone: "Teléfono (opcional)",
    message: "Cuéntanos tu proyecto",
    messageHint: "Mínimo 10 caracteres.",
    messageTooShort: "Escribe al menos 10 caracteres.",
    consent:
      "He leído y acepto la Política de Privacidad y consiento el tratamiento de mis datos personales para responder a mi consulta.",
    consentRequired: "Debes aceptar la Política de Privacidad para enviar tu consulta.",
    send: "Enviar solicitud",
    sending: "Enviando…",
    successTitle: "¡Solicitud enviada!",
    success: "Gracias por escribirnos. Te hemos enviado un correo de confirmación y te responderemos lo antes posible.",
    sendAnother: "Enviar otro mensaje",
    unavailable:
      "El formulario estará activo muy pronto. Mientras tanto, escríbenos a info@fonusstudio.com.",
    rateLimited: "Has enviado varias solicitudes. Espera unos minutos antes de intentarlo de nuevo.",
    error: "No hemos podido enviar el formulario. Inténtalo de nuevo o escríbenos por email.",
  },
  en: {
    name: "Full name",
    company: "Company (optional)",
    email: "Email address",
    phone: "Telephone (optional)",
    message: "Tell us about your project",
    messageHint: "Minimum 10 characters.",
    messageTooShort: "Please enter at least 10 characters.",
    consent:
      "I have read and accept the Privacy Policy and consent to my personal data being processed for the purpose of responding to my enquiry.",
    consentRequired: "You must accept the Privacy Policy to send your enquiry.",
    send: "Send enquiry",
    sending: "Sending…",
    successTitle: "Enquiry sent!",
    success: "Thank you for contacting us. We have sent you a confirmation email and will reply as soon as possible.",
    sendAnother: "Send another message",
    unavailable:
      "The form will be active shortly. In the meantime, email info@fonusstudio.com.",
    rateLimited: "Several enquiries have been sent. Please wait a few minutes before trying again.",
    error: "We could not send the form. Please try again or contact us by email.",
  },
} as const;

export function ContactForm({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "unavailable" | "rate-limited" | "error">("idle");
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, locale }),
      });

      if (response.ok) {
        form.reset();
        setStatus("success");
      } else if (response.status === 429) {
        setStatus("rate-limited");
      } else if (response.status === 503) {
        setStatus("unavailable");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const message = status === "unavailable" ? t.unavailable : status === "rate-limited" ? t.rateLimited : status === "error" ? t.error : "";

  if (status === "success") {
    return (
      <div className="form-success-card" role="status" tabIndex={-1} ref={successRef}>
        <span className="form-success-icon" aria-hidden="true">✓</span>
        <h3>{t.successTitle}</h3>
        <p>{t.success}</p>
        <button className="button button-secondary" type="button" onClick={() => setStatus("idle")}>
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="field-grid">
        <label>
          <span>{t.name} *</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>{t.company}</span>
          <input name="company" autoComplete="organization" />
        </label>
        <label>
          <span>{t.email} *</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>{t.phone}</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>
      <label>
        <span>{t.message} *</span>
        <textarea
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={5000}
          aria-describedby={`contact-message-hint-${locale}`}
          onInvalid={(event) => {
            if (event.currentTarget.validity.tooShort) {
              event.currentTarget.setCustomValidity(t.messageTooShort);
            }
          }}
          onInput={(event) => event.currentTarget.setCustomValidity("")}
        />
        <small id={`contact-message-hint-${locale}`} className="field-hint">
          {t.messageHint}
        </small>
      </label>
      <label className="website-field" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="consent-field">
        <input
          name="consent"
          type="checkbox"
          required
          value="on"
          onInvalid={(event) => event.currentTarget.setCustomValidity(t.consentRequired)}
          onChange={(event) => event.currentTarget.setCustomValidity("")}
        />
        <span>
          {t.consent.split(locale === "es" ? "Política de Privacidad" : "Privacy Policy")[0]}
          <a href={pageHref(locale, "privacy")} target="_blank" rel="noreferrer">
            {locale === "es" ? "Política de Privacidad" : "Privacy Policy"}
          </a>
          {t.consent.split(locale === "es" ? "Política de Privacidad" : "Privacy Policy")[1]}
          {" *"}
        </span>
      </label>
      <button className="button button-primary" type="submit" disabled={status === "sending"}>
        {status === "sending" ? t.sending : t.send}
      </button>
      {message && <p className={`form-status form-status-${status}`} role="status">{message}</p>}
    </form>
  );
}
