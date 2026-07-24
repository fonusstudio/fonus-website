export type Locale = "es" | "en";
export type PageName = "home" | "services" | "portfolio" | "contact";

export const CONTACT_EMAIL = "info@fonusstudio.com";
export const CONTACT_PHONE = "+34 614 69 27 75";

export const paths: Record<PageName, string> = {
  home: "",
  services: "services",
  portfolio: "portfolio",
  contact: "contact",
};

export function pageHref(locale: Locale, page: PageName) {
  const prefix = locale === "en" ? "/en" : "";
  const suffix = paths[page] ? `/${paths[page]}` : "";
  return `${prefix}${suffix}` || "/";
}

export const copy = {
  es: {
    nav: {
      home: "Inicio",
      services: "Servicios",
      portfolio: "Portfolio",
      contact: "Contacto",
      book: "Reservar sesión",
      menu: "Abrir menú",
    },
    home: {
      badge: "Estudio de producción audiovisual · Valencia",
      title: "Producción profesional para historias que merecen ser escuchadas y vistas.",
      intro:
        "Ayudamos a creadores, empresas y profesionales a producir contenido con calidad profesional en un entorno pensado para que tú solo tengas que comunicar.",
      primary: "Reservar sesión",
      secondary: "Descubrir servicios",
      manifestoEyebrow: "Fonus Studio",
      manifestoTitle: "Un estudio donde las ideas toman forma.",
      manifesto:
        "Creemos que una buena conversación merece más que una webcam y un micrófono improvisado. Por eso hemos creado un espacio que combina atención al detalle, equipamiento profesional y un ambiente cómodo y natural.",
      servicesEyebrow: "Qué hacemos",
      servicesTitle: "Todo lo que necesitas para crear contenido profesional.",
      studioTitle: "Un espacio diseñado para crear.",
      studioText:
        "Equipamiento profesional, iluminación, tratamiento acústico y dirección técnica cuidada. Mientras nosotros nos ocupamos de la parte técnica, tú puedes concentrarte en la conversación.",
      portfolioTitle: "Cada proyecto tiene su propia voz.",
      processTitle: "Un proceso sencillo, de principio a fin.",
      testimonialsTitle: "La confianza se construye proyecto a proyecto.",
      testimonialsText:
        "Este espacio se completará con testimonios y casos reales del estudio. La estructura ya está preparada para incorporarlos.",
      faqTitle: "Preguntas frecuentes",
      ctaTitle: "¿Tienes una idea? Nosotros ponemos el estudio.",
      ctaText: "Hablemos de tu proyecto y creemos contenido del que puedas sentirte orgulloso.",
    },
    services: {
      badge: "Servicios",
      title: "Producción audiovisual profesional, adaptada a tu proyecto.",
      intro:
        "Desde sesiones de grabación hasta producciones completas con edición, diseño y contenido optimizado para múltiples plataformas.",
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
      repeatExtrasLabel: "Posibles extras incluidos",
      repeatExtras: ["Edición", "Clips para redes", "Miniaturas", "Branding"],
      repeatCta: "Solicitar una propuesta",
      ctaTitle: "Cuéntanos tu proyecto.",
      ctaText: "Encontraremos la forma de convertir tu idea en contenido profesional.",
    },
    portfolio: {
      badge: "Portfolio",
      title: "Cada proyecto cuenta una historia diferente.",
      intro:
        "Estamos preparando una selección de producciones reales. Mientras tanto, esta versión muestra la dirección editorial y el comportamiento de la futura galería.",
      featured: "Trabajos destacados",
      featuredText: "Una galería preparada para podcasts, vídeo, campañas y contenido social.",
      behind: "Detrás de las cámaras",
      behindText:
        "La futura fotografía mostrará sesiones reales, conversaciones, iluminación, monitorización y el equipo trabajando.",
      studio: "El estudio",
      studioText:
        "Una selección visual del set, tratamiento acústico, cámaras, iluminación y equipamiento de audio.",
      ctaTitle: "¿Listo para crear tu próximo proyecto?",
    },
    contact: {
      badge: "Contacto",
      title: "Hablemos de tu próximo proyecto.",
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
      ["Producción de podcast", "Grabación, edición y postproducción de audio con calidad profesional."],
      ["Videopodcast", "Producciones multicámara pensadas para YouTube, Spotify y canales digitales."],
      ["Creación de contenido", "Reels, entrevistas, cursos, promociones y formatos adaptados a cada plataforma."],
      ["Branding y diseño", "Portadas, miniaturas, motion graphics y recursos visuales para tu contenido."],
    ],
    process: [
      ["Hablamos", "Conocemos tu proyecto y elegimos la mejor solución."],
      ["Grabamos", "Preparamos sonido, cámaras e iluminación."],
      ["Editamos", "Damos forma al contenido cuidando cada detalle."],
      ["Entregamos", "Recibes todo listo para publicar."],
    ],
    faqs: [
      ["¿Necesito experiencia delante de una cámara?", "No. Te acompañamos durante toda la sesión para que la grabación resulte natural y cómoda."],
      ["¿Puedo grabar vídeo además de audio?", "Sí. El estudio está preparado para audio, vídeo o ambas cosas simultáneamente."],
      ["¿Puedo reservar solo la grabación?", "Sí. Puedes recibir los archivos originales y encargarte de la edición por tu cuenta."],
    ],
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      portfolio: "Portfolio",
      contact: "Contact",
      book: "Book a session",
      menu: "Open menu",
    },
    home: {
      badge: "Creative production studio · Valencia",
      title: "Professional production for stories worth hearing and seeing.",
      intro:
        "We help creators, businesses and professionals produce high-quality content in a studio designed so you can focus entirely on your message.",
      primary: "Book a session",
      secondary: "Explore services",
      manifestoEyebrow: "Fonus Studio",
      manifestoTitle: "A studio where ideas come to life.",
      manifesto:
        "Every great conversation deserves more than a webcam and a built-in microphone. We combine professional equipment and careful technical direction with a relaxed, welcoming environment.",
      servicesEyebrow: "What we do",
      servicesTitle: "Everything you need to create professional content.",
      studioTitle: "Designed for creativity.",
      studioText:
        "Professional equipment, carefully planned lighting, acoustic treatment and expert technical direction. We handle the details while you focus on the conversation.",
      portfolioTitle: "Every project has its own voice.",
      processTitle: "A simple process, from idea to delivery.",
      testimonialsTitle: "Built on trust, one project at a time.",
      testimonialsText:
        "This section will feature verified client stories and studio case studies. The layout is ready for them.",
      faqTitle: "Frequently asked questions",
      ctaTitle: "Have an idea? We’ll provide the studio.",
      ctaText: "Let’s talk about your project and create content you’ll be proud to share.",
    },
    services: {
      badge: "Services",
      title: "Professional content production, tailored to your project.",
      intro:
        "From studio recording sessions to complete productions with editing, branding and platform-ready content.",
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
      repeatExtrasLabel: "Possible included extras",
      repeatExtras: ["Editing", "Social clips", "Thumbnails", "Branding"],
      repeatCta: "Request a proposal",
      ctaTitle: "Tell us about your project.",
      ctaText: "We’ll help turn your idea into professional content.",
    },
    portfolio: {
      badge: "Portfolio",
      title: "Every project has its own story.",
      intro:
        "We are preparing a selection of real productions. For now, this version shows the editorial direction and behaviour of the future gallery.",
      featured: "Featured work",
      featuredText: "A gallery ready for podcasts, video, campaigns and social content.",
      behind: "Behind the scenes",
      behindText:
        "Future photography will capture real sessions, conversations, lighting, monitoring and the team at work.",
      studio: "The studio",
      studioText:
        "A visual introduction to the set, acoustic treatment, cameras, lighting and audio equipment.",
      ctaTitle: "Ready to create your next project?",
    },
    contact: {
      badge: "Contact",
      title: "Let’s talk about your next project.",
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
      ["Podcast production", "Professional recording, editing and post-production for podcasts."],
      ["Video podcasting", "Multi-camera productions for YouTube, Spotify and digital channels."],
      ["Content creation", "Reels, interviews, courses, promotions and platform-ready formats."],
      ["Branding and design", "Artwork, thumbnails, motion graphics and visual assets for your content."],
    ],
    process: [
      ["Discover", "We learn about your project and choose the right solution."],
      ["Record", "We prepare the sound, cameras and lighting."],
      ["Edit", "We shape the content and refine every detail."],
      ["Deliver", "You receive everything ready to publish."],
    ],
    faqs: [
      ["Do I need experience on camera?", "No. We guide you throughout the session so the recording feels relaxed and natural."],
      ["Can I record video as well as audio?", "Yes. The studio is equipped for audio, video or both at the same time."],
      ["Can I book recording without editing?", "Yes. You can receive the original files and handle the edit yourself."],
    ],
  },
} as const;

export const serviceDetails = {
  es: [
    ["01", "Audio", "Sonido profesional para conversaciones que merecen ser escuchadas.", "Hasta 4 micrófonos · Monitorización de la sesion · Edición · Estudio Tratado Acousticamente"],
    ["02", "Video", "La fuerza del vídeo, sin complicaciones.", "Hasta 3 cámaras 4k · Iluminación Profesional · Edición ·  Monitorización de la sesion"],
    ["03", "Servicios extra", "Todo lo que necesitas para completar y reforzar tu contenido.", "Transcripción · Portadas · Miniaturas · Branding · Intros · Diseño sonoro"],
  ],
  en: [
    ["01", "Audio", "Professional audio for conversations worth sharing.", "Up to 4 microphones · Monitoring during the session· Editing · Mixing and mastering"],
    ["02", "Video", "The power of video, without the complexity.", "Up to 3 cameras · Studio Lighting · Editing · Monitoring during the session"],
    ["03", "Extra services", "Everything you need to complete and strengthen your content.", "Transcription · Artwork · Thumbnails · Branding · Intros · Sound design"],
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
      { name: "Profesional", price: "299 €", features: ["Todo lo incluido en Básico", "Limpieza, mezcla y montaje avanzado", "1 revisión"], popular: true },
      { name: "Premium", price: "449 €", features: ["Todo lo incluido en Profesional", "Música y efectos de sonido", "5 reels de audiograma", "2 revisiones"] },
    ],
    en: [
      { name: "Basic", price: "€249", features: ["Episode assembly", "Basic mixing and mastering"] },
      { name: "Professional", price: "€299", features: ["Everything included in Basic", "Advanced clean-up, mixing and editing", "1 revision"], popular: true },
      { name: "Premium", price: "€449", features: ["Everything included in Professional", "Music and sound effects", "5 audiogram reels", "2 revisions"] },
    ],
  },
  video: {
    es: [
      { name: "Básico", price: "299 €", features: ["Montaje del episodio", "Edición, mezcla y masterización básica"] },
      { name: "Profesional", price: "399 €", features: ["Todo lo incluido en Básico", "Limpieza, edición, mezcla y montaje avanzado", "1 revisión"], popular: true },
      { name: "Premium", price: "599 €", features: ["Todo lo incluido en Profesional", "Música y efectos de sonido", "Gráficos básicos: títulos e información", "5 vídeo reels"] },
    ],
    en: [
      { name: "Basic", price: "€299", features: ["Episode assembly", "Basic editing, mixing and mastering"] },
      { name: "Professional", price: "€399", features: ["Everything included in Basic", "Advanced clean-up, editing, mixing and assembly", "1 revision"], popular: true },
      { name: "Premium", price: "€599", features: ["Everything included in Professional", "Music and sound effects", "Basic graphics: titles and information", "5 video reels"] },
    ],
  },
  extras: {
    es: [
      { name: "Portadas y miniaturas", description: "Una imagen visual coherente y lista para publicar en cada episodio.", price: "49 €", priceNote: "por proyecto", features: ["Portada de vídeo", "Miniatura para plataformas"] },
      { name: "Pack de branding", description: "Creación de intros, animaciones y gráficos personalizados para tu marca, listos para utilizarse a lo largo de tu proyecto.", price: "299 €", priceOptions: [{ label: "Audio", price: "299 €" }, { label: "Vídeo", price: "449 €" }], features: ["Intro personalizada", "Gráficos personalizados", "Plantillas visuales"] },
      { name: "Transcripción y subtitulado", description: "Texto y subtítulos claros para mejorar la accesibilidad y ampliar el alcance.", price: "49 / 99 €", priceOptions: [{ label: "Audio", price: "49 €", note: "por episodio" }, { label: "Vídeo", price: "99 €", note: "por episodio" }], features: ["Transcripción completa", "Subtítulos para vídeo"] },
    ],
    en: [
      { name: "Covers and thumbnails", description: "A consistent visual identity, ready to publish with every episode.", price: "€49", priceNote: "per project", features: ["Video cover", "Platform-ready thumbnail"] },
      { name: "Branding pack", description: "Custom intros, animations and graphics for your brand, ready to use throughout your project.", price: "€299", priceOptions: [{ label: "Audio", price: "€299" }, { label: "Video", price: "€449" }], features: ["Custom intro", "Custom graphics", "Visual templates"] },
      { name: "Transcription and subtitling", description: "Clear text and subtitles that improve accessibility and expand your reach.", price: "€49 / €99", priceOptions: [{ label: "Audio", price: "€49", note: "per episode" }, { label: "Video", price: "€99", note: "per episode" }], features: ["Full transcription", "Video subtitles"] },
    ],
  },
} as const;
