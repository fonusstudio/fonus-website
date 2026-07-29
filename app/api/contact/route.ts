import { NextResponse } from "next/server";
import { parseContactRequest, validateContactPayload } from "./security";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const confirmationCopy = {
  es: {
    subject: "Hemos recibido tu solicitud — Fonus Studio",
    eyebrow: "SOLICITUD RECIBIDA",
    title: "Gracias por escribirnos.",
    intro: "Hemos recibido tu mensaje y te responderemos lo antes posible.",
    summary: "Tu mensaje",
    footer: "Si necesitas añadir algo, responde directamente a este correo.",
  },
  en: {
    subject: "We have received your enquiry — Fonus Studio",
    eyebrow: "ENQUIRY RECEIVED",
    title: "Thank you for contacting us.",
    intro: "We have received your message and will reply as soon as possible.",
    summary: "Your message",
    footer: "If you need to add anything, reply directly to this email.",
  },
} as const;

export async function POST(request: Request) {
  const parsedRequest = await parseContactRequest(request);
  if (!parsedRequest.ok) {
    return NextResponse.json(
      { error: parsedRequest.error },
      { status: parsedRequest.status },
    );
  }

  if (parsedRequest.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const validation = validateContactPayload(parsedRequest.body);
  if (!validation.ok) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 },
    );
  }

  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim() || "Fonus Studio Website <forms@contact.fonusstudio.com>";
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim() || "info@fonusstudio.com";
  const { name, email, company, phone, message, locale } = validation.payload;
  const confirmation = confirmationCopy[locale];

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Company", company || "—"],
    ["Telephone", phone || "—"],
    ["Privacy consent", "Yes"],
  ];

  const response = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `New website enquiry from ${name}`,
        text: `${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nProject\n${message}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#1e1e1e">
            <h1 style="font-size:24px">New Fonus Studio enquiry</h1>
            <table style="width:100%;border-collapse:collapse">
              ${rows.map(([label, value]) => `<tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">${label}</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(value)}</td></tr>`).join("")}
            </table>
            <h2 style="font-size:18px;margin-top:28px">Project</h2>
            <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</p>
          </div>`,
      },
      {
        from: fromEmail,
        to: [email],
        reply_to: toEmail,
        subject: confirmation.subject,
        text: `${confirmation.title}\n\n${confirmation.intro}\n\n${confirmation.summary}:\n${message}\n\n${confirmation.footer}\n\nFonus Studio\nC/ Campoamor 68, 46022 Valencia\n${toEmail}`,
        html: `
          <div style="margin:0;padding:36px 18px;background:#080808;font-family:Arial,sans-serif;color:#f5f1eb">
            <div style="max-width:620px;margin:auto;padding:42px;border:1px solid #33261f;background:#111111">
              <p style="margin:0 0 18px;color:#ff6123;font-size:12px;font-weight:700;letter-spacing:1.5px">${confirmation.eyebrow}</p>
              <h1 style="margin:0 0 18px;font-size:32px;line-height:1.1;color:#f5f1eb">${confirmation.title}</h1>
              <p style="margin:0 0 30px;color:#c8c0b8;font-size:16px;line-height:1.7">${confirmation.intro}</p>
              <div style="padding:22px;border-left:3px solid #ff6123;background:#171310">
                <p style="margin:0 0 10px;color:#ff6123;font-size:12px;font-weight:700;text-transform:uppercase">${confirmation.summary}</p>
                <p style="margin:0;white-space:pre-wrap;color:#f5f1eb;line-height:1.65">${escapeHtml(message)}</p>
              </div>
              <p style="margin:30px 0 8px;color:#c8c0b8;line-height:1.6">${confirmation.footer}</p>
              <p style="margin:0;color:#f5f1eb;font-weight:700">Fonus Studio</p>
              <p style="margin:6px 0 0;color:#8e8780;font-size:13px">C/ Campoamor 68, 46022 Valencia · ${escapeHtml(toEmail)}</p>
            </div>
          </div>`,
      },
    ]),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Email delivery failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
