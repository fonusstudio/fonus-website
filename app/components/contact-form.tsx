"use client";

import { FormEvent, useState } from "react";
import type { Locale } from "../content";

const labels = {
  es: {
    name: "Nombre y apellidos",
    company: "Empresa (opcional)",
    email: "Correo electrónico",
    phone: "Teléfono (opcional)",
    service: "Servicio de interés",
    message: "Cuéntanos tu proyecto",
    send: "Enviar solicitud",
    sending: "Enviando…",
    success: "Gracias. Hemos recibido tu solicitud.",
    unavailable:
      "El formulario estará activo muy pronto. Mientras tanto, escríbenos a info@fonusstudio.com.",
    error: "No hemos podido enviar el formulario. Inténtalo de nuevo o escríbenos por email.",
    choose: "Selecciona un servicio",
    services: ["Podcast", "Videopodcast", "Creación de contenido", "Branding y diseño", "Otro"],
  },
  en: {
    name: "Full name",
    company: "Company (optional)",
    email: "Email address",
    phone: "Telephone (optional)",
    service: "Service required",
    message: "Tell us about your project",
    send: "Send enquiry",
    sending: "Sending…",
    success: "Thank you. We have received your enquiry.",
    unavailable:
      "The form will be active shortly. In the meantime, email info@fonusstudio.com.",
    error: "We could not send the form. Please try again or contact us by email.",
    choose: "Choose a service",
    services: ["Podcast", "Video podcast", "Content creation", "Branding and design", "Other"],
  },
} as const;

export function ContactForm({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "unavailable" | "error">("idle");

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
      } else if (response.status === 503) {
        setStatus("unavailable");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const message = status === "success" ? t.success : status === "unavailable" ? t.unavailable : status === "error" ? t.error : "";

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
        <span>{t.service}</span>
        <select name="service" defaultValue="">
          <option value="" disabled>{t.choose}</option>
          {t.services.map((service) => <option key={service}>{service}</option>)}
        </select>
      </label>
      <label>
        <span>{t.message} *</span>
        <textarea name="message" rows={6} required />
      </label>
      <label className="website-field" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button className="button button-primary" type="submit" disabled={status === "sending"}>
        {status === "sending" ? t.sending : t.send}
      </button>
      {message && <p className={`form-status form-status-${status}`} role="status">{message}</p>}
    </form>
  );
}
