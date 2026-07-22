import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const company = String(body.company ?? "").trim().slice(0, 160);
  const phone = String(body.phone ?? "").trim().slice(0, 80);
  const service = String(body.service ?? "").trim().slice(0, 120);
  const message = String(body.message ?? "").trim().slice(0, 5000);

  if (name.length < 2 || !emailPattern.test(email) || message.length < 10) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Company", company || "—"],
    ["Telephone", phone || "—"],
    ["Service", service || "—"],
  ];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Fonus Studio Website <forms@send.fonusstudio.com>",
      to: ["info@fonusstudio.com"],
      reply_to: email,
      subject: `New website enquiry from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#1e1e1e">
          <h1 style="font-size:24px">New Fonus Studio enquiry</h1>
          <table style="width:100%;border-collapse:collapse">
            ${rows.map(([label, value]) => `<tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">${label}</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(value)}</td></tr>`).join("")}
          </table>
          <h2 style="font-size:18px;margin-top:28px">Project</h2>
          <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</p>
        </div>`,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
