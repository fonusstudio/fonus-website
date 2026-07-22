import Image from "next/image";
import Link from "next/link";
import { BOOKING_URL, CONTACT_EMAIL, CONTACT_PHONE, copy, pageHref, pricing, serviceDetails, type Locale, type PageName } from "../content";
import { ContactForm } from "./contact-form";

type Props = { locale: Locale; page: PageName };

function Header({ locale, page }: Props) {
  const t = copy[locale].nav;
  const opposite: Locale = locale === "es" ? "en" : "es";
  const links: [PageName, string][] = [
    ["home", t.home],
    ["services", t.services],
    ["portfolio", t.portfolio],
    ["contact", t.contact],
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href={pageHref(locale, "home")} aria-label="Fonus Studio">
          <Image src="/brand/fonus-logo-colour.svg" alt="Fonus Studio" width={168} height={72} priority />
        </Link>
        <nav className="desktop-nav" aria-label={locale === "es" ? "Navegación principal" : "Primary navigation"}>
          {links.map(([name, label]) => (
            <Link key={name} href={pageHref(locale, name)} aria-current={page === name ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="language-link" href={pageHref(opposite, page)} hrefLang={opposite}>
            {opposite.toUpperCase()}
          </Link>
          <a className="button button-primary header-cta" href={BOOKING_URL} target="_blank" rel="noreferrer">
            {t.book}
          </a>
          <details className="mobile-menu">
            <summary aria-label={t.menu}><span /><span /></summary>
            <nav>
              {links.map(([name, label]) => <Link key={name} href={pageHref(locale, name)}>{label}</Link>)}
              <Link href={pageHref(opposite, page)}>{opposite.toUpperCase()}</Link>
              <a href={BOOKING_URL} target="_blank" rel="noreferrer">{t.book}</a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

function Footer({ locale }: { locale: Locale }) {
  const t = copy[locale].nav;
  const legalTarget = `${pageHref(locale, "contact")}#legal`;
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Image src="/brand/fonus-logo-white.svg" alt="Fonus Studio" width={184} height={88} />
          <p>{locale === "es" ? "Estudio creativo de producción audiovisual en Valencia." : "Creative production studio in Valencia."}</p>
        </div>
        <div className="footer-column">
          <p className="footer-label">{locale === "es" ? "Explorar" : "Explore"}</p>
          <Link href={pageHref(locale, "services")}>{t.services}</Link>
          <Link href={pageHref(locale, "portfolio")}>{t.portfolio}</Link>
          <Link href={pageHref(locale, "contact")}>{t.contact}</Link>
        </div>
        <div className="footer-column">
          <p className="footer-label">{locale === "es" ? "Contacto" : "Contact"}</p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <a href="tel:+34614692775">{CONTACT_PHONE}</a>
          <span>Valencia, Spain</span>
        </div>
        <div className="footer-column">
          <p className="footer-label">Legal</p>
          <a href={legalTarget}>{locale === "es" ? "Privacidad" : "Privacy"}</a>
          <a href={legalTarget}>{locale === "es" ? "Cookies" : "Cookies"}</a>
          <a href={legalTarget}>{locale === "es" ? "Términos" : "Terms"}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Fonus Studio</span>
        <span>{locale === "es" ? "Todos los derechos reservados." : "All rights reserved."}</span>
      </div>
    </footer>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p className="section-lead">{text}</p>}
    </div>
  );
}

function ButtonRow({ locale, secondary = true }: { locale: Locale; secondary?: boolean }) {
  const t = copy[locale].home;
  return (
    <div className="button-row">
      <a className="button button-primary" href={BOOKING_URL} target="_blank" rel="noreferrer">{t.primary}</a>
      {secondary && <Link className="button button-secondary" href={pageHref(locale, "services")}>{t.secondary}</Link>}
    </div>
  );
}

function StudioVisual({ label, index = "01", src, alt = "" }: { label: string; index?: string; src?: string; alt?: string }) {
  return (
    <div className={`studio-visual ${src ? "studio-visual-has-photo" : ""}`} role="img" aria-label={label}>
      <div className="visual-noise" />
      {src ? (
        <Image className="visual-photo" src={src} alt={alt} fill sizes="(max-width: 800px) 100vw, 45vw" priority={index === "01"} unoptimized />
      ) : (
        <Image className="visual-mark" src="/brand/fonus-mark.png" alt="" width={512} height={512} />
      )}
      <div className="visual-caption"><span>{index}</span><span>{label}</span></div>
      <div className="rec-indicator"><i /> REC</div>
    </div>
  );
}

function FinalCta({ locale, title, text }: { locale: Locale; title: string; text?: string }) {
  return (
    <section className="final-cta section-shell">
      <div>
        <p className="eyebrow">Fonus Studio · Valencia</p>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      <ButtonRow locale={locale} secondary={false} />
    </section>
  );
}

function HomePage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" />{t.home.badge}</p>
          <h1>{t.home.title}</h1>
          <p className="hero-lead">{t.home.intro}</p>
          <ButtonRow locale={locale} />
        </div>
        <StudioVisual
          label={locale === "es" ? "Estudio preparado para una sesión" : "Studio ready for a session"}
          src="/images/hero-studio.webp"
          alt={locale === "es" ? "Estudio de podcast con cámaras y micrófonos" : "Podcast studio with cameras and microphones"}
        />
      </section>

      <section className="manifesto section-shell section-pad">
        <p className="eyebrow">{t.home.manifestoEyebrow}</p>
        <div className="manifesto-grid">
          <h2>{t.home.manifestoTitle}</h2>
          <p>{t.home.manifesto}</p>
        </div>
      </section>

      <section className="section-shell section-pad services-overview">
        <SectionHeading eyebrow={t.home.servicesEyebrow} title={t.home.servicesTitle} />
        <div className="service-grid">
          {t.servicesCards.map(([title, text], index) => (
            <Link className="service-card" href={pageHref(locale, "services")} key={title}>
              <span className="card-index">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="card-link">{locale === "es" ? "Ver servicio" : "View service"} <b>↗</b></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell section-pad studio-section">
        <StudioVisual
          label={locale === "es" ? "Equipamiento del estudio" : "Studio equipment"}
          index="02"
          src="/images/studio-equipment.webp"
          alt={locale === "es" ? "Micrófono, cámara y mesa de mezclas profesional" : "Professional microphone, camera and audio mixer"}
        />
        <div className="studio-copy">
          <p className="eyebrow">{locale === "es" ? "El estudio" : "The studio"}</p>
          <h2>{t.home.studioTitle}</h2>
          <p>{t.home.studioText}</p>
          <Link className="text-link" href={pageHref(locale, "portfolio")}>{locale === "es" ? "Conocer el espacio" : "Explore the space"} <span>↗</span></Link>
        </div>
      </section>

      <section className="section-shell section-pad portfolio-preview">
        <SectionHeading eyebrow="Portfolio" title={t.home.portfolioTitle} text={locale === "es" ? "La galería está preparada para recibir los primeros proyectos reales." : "The gallery is ready for the first real projects."} />
        <div className="portfolio-grid">
          {["Podcast", "Videopodcast", locale === "es" ? "Contenido social" : "Social content"].map((label, index) => (
            <div className={`portfolio-card portfolio-card-${index + 1}`} key={label}>
              <Image
                className="portfolio-photo"
                src={index === 0 ? "/images/podcast-session.webp" : index === 1 ? "/images/video-production.webp" : "/images/studio-equipment.webp"}
                alt=""
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
                unoptimized
              />
              <span>{label}</span><small>{locale === "es" ? "Proyecto próximamente" : "Project coming soon"}</small>
            </div>
          ))}
        </div>
        <Link className="button button-secondary" href={pageHref(locale, "portfolio")}>{locale === "es" ? "Ver portfolio" : "View portfolio"}</Link>
      </section>

      <section className="section-shell section-pad process-section">
        <SectionHeading eyebrow={locale === "es" ? "Cómo trabajamos" : "How it works"} title={t.home.processTitle} />
        <ol className="process-list">
          {t.process.map(([title, text], index) => (
            <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="section-shell section-pad trust-section">
        <div className="trust-card">
          <p className="eyebrow">{locale === "es" ? "Historias de clientes" : "Client stories"}</p>
          <h2>{t.home.testimonialsTitle}</h2>
          <p>{t.home.testimonialsText}</p>
        </div>
        <div className="trust-stats">
          <div><strong>4</strong><span>{locale === "es" ? "micrófonos" : "microphones"}</span></div>
          <div><strong>3</strong><span>{locale === "es" ? "cámaras 4K" : "4K cameras"}</span></div>
          <div><strong>48h</strong><span>{locale === "es" ? "archivos originales" : "original files"}</span></div>
        </div>
      </section>

      <section className="section-shell section-pad faq-section">
        <SectionHeading eyebrow="FAQ" title={t.home.faqTitle} />
        <div className="faq-list">
          {t.faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
        </div>
      </section>
      <FinalCta locale={locale} title={t.home.ctaTitle} text={t.home.ctaText} />
    </>
  );
}

function PricingGrid({ locale, items }: { locale: Locale; items: readonly { name: string; price: string; text: string; popular?: boolean }[] }) {
  return (
    <div className={`pricing-grid pricing-grid-${items.length}`}>
      {items.map((item) => (
        <article className={`price-card ${item.popular ? "price-card-popular" : ""}`} key={item.name}>
          {item.popular && <span className="popular-badge">{copy[locale].services.popular}</span>}
          <h3>{item.name}</h3>
          <p className="price">{item.price}</p>
          <p>{item.text}</p>
          <a className="button button-secondary" href={BOOKING_URL} target="_blank" rel="noreferrer">{copy[locale].nav.book}</a>
        </article>
      ))}
    </div>
  );
}

function ServicesPage({ locale }: { locale: Locale }) {
  const t = copy[locale].services;
  return (
    <>
      <section className="page-hero section-shell">
        <div><p className="eyebrow">{t.badge}</p><h1>{t.title}</h1><p>{t.intro}</p></div>
        <StudioVisual
          label={locale === "es" ? "Producción Fonus" : "Fonus production"}
          index="S"
          src="/images/video-production.webp"
          alt={locale === "es" ? "Producción de entrevista multicámara" : "Multi-camera interview production"}
        />
      </section>
      <section className="section-shell section-pad">
        <SectionHeading eyebrow="01—04" title={t.detailTitle} />
        <div className="service-detail-list">
          {serviceDetails[locale].map(([number, title, text, features]) => (
            <article key={number}><span>{number}</span><div><h2>{title}</h2><p>{text}</p><small>{features}</small></div></article>
          ))}
        </div>
      </section>
      <section className="pricing-section section-shell section-pad">
        <SectionHeading eyebrow={locale === "es" ? "Precios claros" : "Clear pricing"} title={t.pricingTitle} text={t.pricingIntro} />
        <div className="pricing-group"><h2>{t.recording}</h2><PricingGrid locale={locale} items={pricing.recording[locale]} /></div>
        <div className="pricing-group"><h2>{t.audio}</h2><PricingGrid locale={locale} items={pricing.audio[locale]} /></div>
        <div className="pricing-group"><h2>{t.video}</h2><PricingGrid locale={locale} items={pricing.video[locale]} /></div>
        <div className="pricing-group"><h2>{t.extras}</h2><PricingGrid locale={locale} items={pricing.extras[locale]} /></div>
        <a className="brochure-link" href="/downloads/fonus-studio-brochure.pdf" target="_blank" rel="noreferrer">
          {locale === "es" ? "Descargar brochure de servicios" : "Download services brochure"} <span>↓</span>
        </a>
      </section>
      <FinalCta locale={locale} title={t.ctaTitle} text={t.ctaText} />
    </>
  );
}

function PortfolioPage({ locale }: { locale: Locale }) {
  const t = copy[locale].portfolio;
  const categories = locale === "es" ? ["Podcast", "Videopodcast", "Campaña", "Contenido social", "Entrevista", "Producción corporativa"] : ["Podcast", "Video podcast", "Campaign", "Social content", "Interview", "Corporate production"];
  return (
    <>
      <section className="page-hero page-hero-portfolio section-shell">
        <div><p className="eyebrow">{t.badge}</p><h1>{t.title}</h1><p>{t.intro}</p></div>
        <StudioVisual
          label={locale === "es" ? "Galería editorial" : "Editorial gallery"}
          index="P"
          src="/images/podcast-session.webp"
          alt={locale === "es" ? "Dos personas grabando un podcast" : "Two people recording a podcast"}
        />
      </section>
      <section className="section-shell section-pad">
        <SectionHeading eyebrow={t.featured} title={t.featuredText} />
        <div className="portfolio-full-grid">
          {categories.map((category, index) => (
            <article className={`work-placeholder work-placeholder-${(index % 4) + 1}`} key={category}>
              <Image
                className="work-photo"
                src={index % 3 === 0 ? "/images/podcast-session.webp" : index % 3 === 1 ? "/images/video-production.webp" : "/images/studio-equipment.webp"}
                alt=""
                fill
                sizes="(max-width: 800px) 100vw, 55vw"
                unoptimized
              />
              <div className="work-number">0{index + 1}</div>
              <div><h3>{category}</h3><p>{locale === "es" ? "Contenido real próximamente" : "Real work coming soon"}</p></div>
            </article>
          ))}
        </div>
      </section>
      <section className="section-shell section-pad editorial-duo">
        <div><p className="eyebrow">{t.behind}</p><h2>{t.behind}</h2><p>{t.behindText}</p></div>
        <StudioVisual label={t.behind} index="BTS" src="/images/video-production.webp" alt={t.behind} />
      </section>
      <section className="section-shell section-pad editorial-duo editorial-duo-reverse">
        <StudioVisual label={t.studio} index="ST" src="/images/studio-equipment.webp" alt={t.studio} />
        <div><p className="eyebrow">Fonus Studio</p><h2>{t.studio}</h2><p>{t.studioText}</p></div>
      </section>
      <FinalCta locale={locale} title={t.ctaTitle} />
    </>
  );
}

function ContactPage({ locale }: { locale: Locale }) {
  const t = copy[locale].contact;
  return (
    <>
      <section className="contact-hero section-shell">
        <p className="eyebrow">{t.badge}</p>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </section>
      <section className="section-shell contact-layout section-pad">
        <div className="contact-sidebar">
          <div><p className="eyebrow">{t.details}</p><h2>{locale === "es" ? "Estamos aquí para ayudarte." : "We’re here to help."}</h2></div>
          <div className="contact-item"><span>{t.emailLabel}</span><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div>
          <div className="contact-item"><span>{t.phoneLabel}</span><a href="tel:+34614692775">{CONTACT_PHONE}</a></div>
          <div className="contact-item"><span>{t.locationLabel}</span><p>{t.location}</p><small>{t.hours}</small></div>
          <div className="meeting-card"><span className="live-dot" /><h3>{t.meetingTitle}</h3><p>{t.meetingText}</p><a className="button button-primary" href={BOOKING_URL} target="_blank" rel="noreferrer">{t.bookMeeting}</a></div>
        </div>
        <div className="form-panel"><p className="eyebrow">{locale === "es" ? "Formulario" : "Enquiry form"}</p><h2>{t.formTitle}</h2><ContactForm locale={locale} /></div>
      </section>
      <section className="section-shell map-section section-pad">
        <div><p className="eyebrow">Valencia · 46022</p><h2>{t.mapTitle}</h2><p>{t.location}</p></div>
        <iframe title={locale === "es" ? "Mapa de Fonus Studio" : "Fonus Studio map"} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=C%2F%20Campoamor%2068%2C%2046022%20Valencia%2C%20Spain&output=embed" />
      </section>
      <section className="section-shell legal-note" id="legal">
        <p>{locale === "es" ? "Los textos legales definitivos se incorporarán antes del lanzamiento público." : "Final legal documents will be added before public launch."}</p>
      </section>
    </>
  );
}

export function SitePage({ locale, page }: Props) {
  return (
    <div className="site-root">
      <Header locale={locale} page={page} />
      <main>
        {page === "home" && <HomePage locale={locale} />}
        {page === "services" && <ServicesPage locale={locale} />}
        {page === "portfolio" && <PortfolioPage locale={locale} />}
        {page === "contact" && <ContactPage locale={locale} />}
      </main>
      <Footer locale={locale} />
    </div>
  );
}
