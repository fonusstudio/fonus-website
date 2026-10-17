import { BUSINESS } from "./business";

export type Locale = "es" | "en";
export type PageName =
  | "home"
  | "services"
  | "portfolio"
  | "contact"
  | "privacy"
  | "cookies"
  | "legal";

export const CONTACT_EMAIL = BUSINESS.email;
export const CONTACT_PHONE = BUSINESS.phoneDisplay;

export const paths: Record<Locale, Record<PageName, string>> = {
  es: {
    home: "",
    services: "services",
    portfolio: "portfolio",
    contact: "contact",
    privacy: "politica-privacidad",
    cookies: "politica-cookies",
    legal: "aviso-legal",
  },
  en: {
    home: "",
    services: "services",
    portfolio: "portfolio",
    contact: "contact",
    privacy: "privacy-policy",
    cookies: "cookie-policy",
    legal: "legal-notice",
  },
};

export function pageHref(locale: Locale, page: PageName) {
  const prefix = locale === "en" ? "/en" : "";
  const path = paths[locale][page];
  const suffix = path ? `/${path}` : "";
  return `${prefix}${suffix}` || "/";
}

export function pageFromPath(locale: Locale, path: string): PageName | null {
  const entry = Object.entries(paths[locale]).find(([, value]) => value === path);
  return (entry?.[0] as PageName | undefined) ?? null;
}

export const copy = {
  es: {
    nav: {
      home: "Inicio",
      services: "Servicios",
      portfolio: "Portfolio y Estudio",
      contact: "Contacto",
      book: "Reservar sesión",
      menu: "Abrir menú",
    },
    home: {
      badge: "Fonus Studio · Grabación y producción",
      title: "Tu estudio de podcast en Valencia.",
      intro:
        "Graba tu podcast o videopodcast en un estudio preparado para que tú solo tengas que comunicar. Acompañamos a creadores, empresas y profesionales con grabación, edición y producción audiovisual.",
      primary: "Reservar sesión",
      secondary: "Ver servicios y precios",
      manifestoEyebrow: "Fonus Studio",
      manifestoTitle: "Un estudio donde las ideas toman forma.",
      manifesto:
        "Creemos que una buena conversación merece más que una webcam y un micrófono improvisado. Por eso hemos creado un espacio que combina atención al detalle, equipamiento profesional y un ambiente cómodo y natural.",
      servicesEyebrow: "Qué hacemos",
      servicesTitle: "Todo lo que necesitas para crear contenido profesional.",
      studioTitle: "Graba en nuestro estudio.",
      portfolioTitle: "Cada proyecto tiene su propia voz.",
      testimonialsTitle: "La confianza se construye proyecto a proyecto.",
      testimonialsText:
        "Este espacio se completará con testimonios y casos reales del estudio. La estructura ya está preparada para incorporarlos.",
      faqTitle: "Preguntas frecuentes",
      ctaTitle: "¿Tienes una idea? Nosotros ponemos el estudio.",
      ctaText: "Hablemos de tu proyecto y creemos contenido del que puedas sentirte orgulloso.",
    },
    services: {
      badge: "Servicios",
      title: "Grabación y edición de podcast en Valencia.",
      intro:
        "Elige una sesión de grabación de audio o videopodcast en Fonus Studio, o una producción completa con edición, diseño y contenido listo para tus plataformas.",
      detailTitle: "Nos adaptamos a la forma en la que quieres crear.",
      pricingTitle: "Paquetes y precios",
      pricingIntro: "Elige el nivel de producción que mejor se adapta a tus necesidades.",
      recording: "Solo grabación",
      audio: "Producción de audio",
      video: "Producción de vídeo",
      extras: "Servicios adicionales",
      popular: "Más popular",
      from: "por episodio",
      repeatEyebrow: "Para proyectos continuos",
      repeatTitle: "Acuerdos para sesiones recurrentes",
      repeatText:
        "Si tienes previsto grabar de forma recurrente, podemos preparar un acuerdo a largo plazo con un precio por sesión negociado según el volumen y la frecuencia.",
      repeatBenefit:
        "El plan puede incluir extras seleccionados para ofrecerte una solución más completa y previsible.",
      repeatCulture:
        "También valoramos especialmente los proyectos creativos y con potencial. Podemos ofrecer condiciones especiales a iniciativas que contribuyen al arte y la cultura, ayudando a que las buenas ideas encuentren el espacio y los recursos para crecer.",
      repeatCta: "Ponte en contacto",
      ctaTitle: "Cuéntanos tu proyecto.",
      ctaText: "Encontraremos la forma de convertir tu idea en contenido profesional.",
    },
    portfolio: {
      badge: "Portfolio y estudio",
      title: "Conoce nuestro estudio de podcast en Valencia.",
      intro: "Descubre el espacio y el equipo de Fonus Studio.",
      featured: "Trabajos destacados",
      behind: "Detrás de las cámaras",
      behindText:
        "Detrás de cada producción hay un equipo dispuesto a ayudarte a desarrollar tu idea, guiando tanto el lado técnico como el creativo. Te asesoramos en el guion, el ritmo, la ejecución y la distribución para sacar el máximo partido a tu proyecto.",
      behindPoints: [
        "Asesoramiento para dar forma al guion y la estructura",
        "Dirección y asistencia durante la grabación",
        "Monitorización en tiempo real para cuidar cada detalle",
        "Edición lista para publicar en tus plataformas",
      ],
      studio: "El estudio",
      studioText:
        "Nuestro espacio está cuidadosamente preparado para ofrecer la máxima calidad, con equipamiento profesional y un ambiente cómodo para que tú te centres en lo más importante.",
      studioPoints: [
        "Hasta 4 micrófonos de alta fidelidad",
        "3 cámaras 4K e iluminación de estudio",
        "Estudio tratado acústicamente para un sonido óptimo",
        "Plató preparado para podcast, entrevistas y talleres",
      ],
      ctaTitle: "¿Listo para crear tu próximo proyecto?",
    },
    contact: {
      badge: "Contacto",
      title: "Reserva tu sesión de podcast en Valencia.",
      intro:
        "Cuéntanos qué quieres crear y te ayudaremos a encontrar la mejor forma de hacerlo realidad.",
      details: "Información de contacto",
      emailLabel: "Correo electrónico",
      phoneLabel: "Teléfono",
      locationLabel: "Estudio",
      location: "C/ Campoamor 68, 46022 Valencia",
      meetingTitle: "Reunión de descubrimiento gratuita",
      meetingText:
        "Elige una fecha en nuestro calendario para hablar de tu proyecto, resolver dudas y encontrar el servicio adecuado.",
      bookMeeting: "Reservar una reunión",
      formTitle: "Cuéntanos tu proyecto",
      mapTitle: "Ven a conocernos",
    },
    servicesCards: [
      ["Producción de Audio", "Grabación, edición y postproducción de audio con calidad profesional."],
      ["Producción de Vídeo", "Producciones multicámara pensadas para YouTube, Spotify y canales digitales."],
      ["Creación de contenido", "Reels, entrevistas, cursos, promociones y formatos adaptados a cada plataforma."],
      ["Branding y diseño", "Portadas, miniaturas, motion graphics y recursos visuales para tu contenido."],
    ],
    faqs: [
      ["¿Dónde está el estudio de podcast?", "Fonus Studio está en C/ Campoamor 68, 46022 Valencia. Puedes consultar la ubicación en nuestra página de contacto y reservar una reunión gratuita para hablar de tu proyecto."],
      ["¿Qué equipo incluye una sesión de grabación?", "El estudio dispone de hasta 4 micrófonos, tratamiento acústico y asistencia durante la grabación. Para videopodcast también contamos con 3 cámaras 4K e iluminación de estudio. Consulta los servicios para elegir tu paquete."],
      ["¿Necesito experiencia delante de una cámara?", "No. Te acompañamos durante toda la sesión para que la grabación resulte natural y cómoda."],
      ["¿Se puede personalizar el plató?", "Sí, disponemos de una variedad de decoraciones y te invitamos a traer lo que quieras para darle tu toque a la imagen."],
      ["¿Puedo reservar solo la grabación?", "Sí. Puedes recibir los archivos originales y encargarte de la edición por tu cuenta."],
      ["¿Puedo reservar solo la edición?", "Sí. Podemos editar material que hayas grabado por tu cuenta o con otro servicio y prepararlo para distribuirlo como prefieras."],
    ],
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      portfolio: "Portfolio & Studio",
      contact: "Contact",
      book: "Book a session",
      menu: "Open menu",
    },
    home: {
      badge: "Fonus Studio · Recording and production",
      title: "Your podcast studio in Valencia.",
      intro:
        "Record your podcast or video podcast in a studio designed so you can focus on your message. We support creators, businesses and professionals with recording, editing and audiovisual production.",
      primary: "Book a session",
      secondary: "View services and prices",
      manifestoEyebrow: "Fonus Studio",
      manifestoTitle: "A studio where ideas come to life.",
      manifesto:
        "Every great conversation deserves more than a webcam and a built-in microphone. We combine professional equipment and careful technical direction with a relaxed, welcoming environment.",
      servicesEyebrow: "What we do",
      servicesTitle: "Everything you need to create professional content.",
      studioTitle: "Record at our studio.",
      portfolioTitle: "Every project has its own voice.",
      testimonialsTitle: "Built on trust, one project at a time.",
      testimonialsText:
        "This section will feature verified client stories and studio case studies. The layout is ready for them.",
      faqTitle: "Frequently asked questions",
      ctaTitle: "Have an idea? We’ll provide the studio.",
      ctaText: "Let’s talk about your project and create content you’ll be proud to share.",
    },
    services: {
      badge: "Services",
      title: "Podcast recording and editing in Valencia.",
      intro:
        "Choose an audio or video podcast recording session at Fonus Studio, or a complete production with editing, branding and content ready for your platforms.",
      detailTitle: "We adapt to the way you create.",
      pricingTitle: "Packages and pricing",
      pricingIntro: "Choose the production level that best fits your project.",
      recording: "Recording only",
      audio: "Audio production",
      video: "Video production",
      extras: "Additional services",
      popular: "Most popular",
      from: "per episode",
      repeatEyebrow: "For ongoing projects",
      repeatTitle: "Long-term deals for repeat sessions",
      repeatText:
        "If you plan to record regularly, we can create a long-term agreement with a per-session rate negotiated around your volume and frequency.",
      repeatBenefit:
        "Your plan can include selected extras for a more complete and predictable production setup.",
      repeatCulture:
        "We also place special value on creative projects with real promise. We can offer special terms to initiatives that contribute to the arts and culture, helping strong ideas find the space and resources to grow.",
      repeatCta: "Get in touch",
      ctaTitle: "Tell us about your project.",
      ctaText: "We’ll help turn your idea into professional content.",
    },
    portfolio: {
      badge: "Portfolio and studio",
      title: "Explore our podcast studio in Valencia.",
      intro: "Discover the space and equipment at Fonus Studio.",
      featured: "Featured work",
      behind: "Behind the scenes",
      behindText:
        "Behind every production is a team ready to help you develop your idea, guiding both the technical and creative sides. We advise you on the script, pacing, execution and distribution to get the most from your project.",
      behindPoints: [
        "Guidance to shape your script and structure",
        "Direction and support throughout the recording",
        "Real-time monitoring to protect every detail",
        "Editing ready to publish across your platforms",
      ],
      studio: "The studio",
      studioText:
        "Our space is carefully prepared to deliver the highest quality, with professional equipment and a comfortable environment so you can focus on what matters most.",
      studioPoints: [
        "Up to 4 high-fidelity microphones",
        "3 4K cameras and studio lighting",
        "Acoustically treated studio for optimal sound",
        "A set prepared for podcasts, interviews and workshops",
      ],
      ctaTitle: "Ready to create your next project?",
    },
    contact: {
      badge: "Contact",
      title: "Book your podcast session in Valencia.",
      intro:
        "Tell us what you want to create and we’ll help you find the best way to bring it to life.",
      details: "Contact information",
      emailLabel: "Email",
      phoneLabel: "Telephone",
      locationLabel: "Studio",
      location: "C/ Campoamor 68, 46022 Valencia",
      meetingTitle: "Free discovery meeting",
      meetingText:
        "Choose a time in our calendar to discuss your project, answer questions and find the right service.",
      bookMeeting: "Book a meeting",
      formTitle: "Tell us about your project",
      mapTitle: "Visit the studio",
    },
    servicesCards: [
      ["Audio production", "Professional recording, editing and post-production for podcasts."],
      ["Video production", "Multi-camera productions for YouTube, Spotify and digital channels."],
      ["Content creation", "Reels, interviews, courses, promotions and platform-ready formats."],
      ["Branding and design", "Artwork, thumbnails, motion graphics and visual assets for your content."],
    ],
    faqs: [
      ["Where is the podcast studio?", "Fonus Studio is at C/ Campoamor 68, 46022 Valencia. Find the location on our contact page and book a free discovery meeting to discuss your project."],
      ["What equipment is included in a recording session?", "The studio has up to 4 microphones, acoustic treatment and recording support. For video podcasts, we also have 3 4K cameras and studio lighting. See our services to choose your package."],
      ["Do I need experience on camera?", "No. We guide you throughout the session so the recording feels relaxed and natural."],
      ["Can I customise the set?", "Yes. We have a range of set designs, and you are welcome to bring anything you would like to give the image your own touch."],
      ["Can I book recording without editing?", "Yes. You can receive the original files and handle the edit yourself."],
      ["Can I book editing only?", "Yes. We can edit material you have recorded yourself or with another service, and prepare it for distribution the way you prefer."],
    ],
  },
} as const;

export const serviceDetails = {
  es: [
    ["01", "Audio", "Sonido profesional para conversaciones que merecen ser escuchadas.", "Hasta 4 micrófonos · Monitorización de la sesion · Edición · Estudio Tratado Acousticamente"],
    ["02", "Video", "La fuerza del vídeo, sin complicaciones.", "Hasta 3 cámaras 4k · Iluminación Profesional · Edición ·  Monitorización de la sesion"],
    ["03", "Servicios extra", "Todo lo que necesitas para completar y reforzar tu contenido.", "Portadas · Miniaturas · Branding · Intros · Diseño sonoro"],
  ],
  en: [
    ["01", "Audio", "Professional audio for conversations worth sharing.", "Up to 4 microphones · Monitoring during the session· Editing · Mixing and mastering"],
    ["02", "Video", "The power of video, without the complexity.", "Up to 3 cameras · Studio Lighting · Editing · Monitoring during the session"],
    ["03", "Extra services", "Everything you need to complete and strengthen your content.", "Artwork · Thumbnails · Branding · Intros · Sound design"],
  ],
} as const;

export const pricing = {
  recording: {
    es: [
      { name: "Audio", price: "120 €", features: ["1 hora de grabación", "Hasta 4 micrófonos", "Estudio tratado acústicamente", "Asistencia en dirección y grabación"] },
      { name: "Vídeo", price: "120 €", features: ["1 hora de grabación", "Hasta 4 micrófonos", "3 cámaras 4K", "Iluminación de estudio"] },
    ],
    en: [
      { name: "Audio", price: "€120", features: ["1-hour recording session", "Up to 4 microphones", "Acoustically treated studio", "Recording direction and assistance"] },
      { name: "Video", price: "€180", features: ["1-hour recording session", "Up to 4 microphones", "3 4K cameras", "Studio lighting"] },
    ],
  },
  audio: {
    es: [
      { name: "Básico", price: "249 €", features: ["Montaje del episodio", "Mezcla y masterización básica"] },
      { name: "Premium", price: "399 €", features: ["Todo lo incluido en Básico", "Limpieza, mezcla y montaje avanzado", "Música y efectos de sonido", "Transcripción completa", "5 reels de audiograma", "2 revisiones"] },
    ],
    en: [
      { name: "Basic", price: "€249", features: ["Episode assembly", "Basic mixing and mastering"] },
      { name: "Premium", price: "€399", features: ["Everything included in Basic", "Advanced clean-up, mixing and editing", "Music and sound effects", "Full transcription", "5 audiogram reels", "2 revisions"] },
    ],
  },
  video: {
    es: [
      { name: "Básico", price: "299 €", features: ["Montaje del episodio", "Edición, mezcla y masterización básica"] },
      { name: "Profesional", price: "399 €", features: ["Todo lo incluido en Básico", "Limpieza, edición, mezcla y montaje avanzado", "Subtítulos para vídeo", "3 reels de vídeo", "1 revisión"], popular: true },
      { name: "Premium", price: "599 €", features: ["Todo lo incluido en Profesional", "Música y efectos de sonido", "Gráficos básicos: títulos e información", "Subtítulos para vídeo", "5 reels de vídeo"] },
    ],
    en: [
      { name: "Basic", price: "€299", features: ["Episode assembly", "Basic editing, mixing and mastering"] },
      { name: "Professional", price: "€399", features: ["Everything included in Basic", "Advanced clean-up, editing, mixing and assembly", "Video subtitles", "3 video reels", "1 revision"], popular: true },
      { name: "Premium", price: "€599", features: ["Everything included in Professional", "Music and sound effects", "Basic graphics: titles and information", "Video subtitles", "5 video reels"] },
    ],
  },
  extras: {
    es: [
      { name: "Portadas y miniaturas", description: "Una imagen visual coherente y lista para publicar en cada episodio.", price: "49 €", priceNote: "por proyecto", features: ["Portada de vídeo", "Miniatura para plataformas"] },
      { name: "Pack de branding", description: "Creación de intros, animaciones y gráficos personalizados para tu marca, listos para utilizarse a lo largo de tu proyecto.", price: "299 €", priceOptions: [{ label: "Audio", price: "299 €" }, { label: "Vídeo", price: "449 €" }], features: ["Intro personalizada", "Gráficos personalizados", "Plantillas visuales"] },
    ],
    en: [
      { name: "Covers and thumbnails", description: "A consistent visual identity, ready to publish with every episode.", price: "€49", priceNote: "per project", features: ["Video cover", "Platform-ready thumbnail"] },
      { name: "Branding pack", description: "Custom intros, animations and graphics for your brand, ready to use throughout your project.", price: "€299", priceOptions: [{ label: "Audio", price: "€299" }, { label: "Video", price: "€449" }], features: ["Custom intro", "Custom graphics", "Visual templates"] },
    ],
  },
} as const;
