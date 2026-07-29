import Link from "next/link";
import { LEGAL_LAST_UPDATED } from "../business";
import { pageHref, type Locale } from "../content";
import { legalDocuments } from "../legal-content";

type LegalPageName = "privacy" | "cookies" | "legal";

const webAddressPattern = /^(https?:\/\/|www\.)/i;

function TableCell({ value }: { value: string }) {
  if (webAddressPattern.test(value)) {
    const href = value.startsWith("http") ? value : `https://${value}`;
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {value.replace(/^https?:\/\//, "")}
        <span className="external-mark" aria-hidden="true"> ↗</span>
      </a>
    );
  }

  return value;
}

export function LegalPage({ locale, page }: { locale: Locale; page: LegalPageName }) {
  const document = legalDocuments[page][locale];
  const related = [
    ["privacy", locale === "es" ? "Privacidad" : "Privacy"],
    ["cookies", locale === "es" ? "Cookies" : "Cookies"],
    ["legal", locale === "es" ? "Aviso legal" : "Legal notice"],
  ] as const;

  return (
    <article className="legal-page">
      <header className="legal-hero">
        <div className="section-shell">
          <p className="eyebrow">{document.eyebrow}</p>
          <h1>{document.title}</h1>
          <p className="legal-intro">{document.intro}</p>
          <p className="legal-updated">
            {document.updatedLabel}: <time dateTime="2026-07-29">{LEGAL_LAST_UPDATED[locale]}</time>
          </p>
        </div>
      </header>

      <div className="legal-layout section-shell section-pad">
        <aside className="legal-toc" aria-label={document.contentsLabel}>
          <p className="footer-label">{document.contentsLabel}</p>
          <nav>
            {document.sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>{section.title}</a>
            ))}
          </nav>
        </aside>

        <div className="legal-copy">
          {document.sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
              {section.table ? (
                <div className="legal-table-wrap" tabIndex={0} role="region" aria-label={section.title}>
                  <table>
                    <thead>
                      <tr>
                        {section.table.headers.map((header) => <th scope="col" key={header}>{header}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row.join("|")}>
                          {row.map((cell, index) => (
                            index === 0
                              ? <th scope="row" key={cell}><TableCell value={cell} /></th>
                              : <td key={`${cell}-${index}`}><TableCell value={cell} /></td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          ))}

          <nav className="legal-related" aria-label={locale === "es" ? "Otros documentos legales" : "Other legal documents"}>
            {related.map(([name, label]) => (
              <Link
                key={name}
                href={pageHref(locale, name)}
                aria-current={page === name ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </article>
  );
}
