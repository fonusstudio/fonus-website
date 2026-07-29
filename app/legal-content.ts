import type { Locale } from "./content";

export type LegalTable = {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
};

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  table?: LegalTable;
};

export type LegalDocument = {
  eyebrow: string;
  title: string;
  intro: string;
  updatedLabel: string;
  contentsLabel: string;
  sections: readonly LegalSection[];
};

type LegalPage = "privacy" | "cookies" | "legal";

const providerRowsEs = [
  ["Vercel", "Alojamiento, entrega del sitio y registros técnicos de seguridad.", "https://vercel.com/legal/privacy-notice"],
  ["Google Workspace", "Correo corporativo y gestión de comunicaciones.", "https://policies.google.com/privacy"],
  ["Resend", "Envío del formulario de contacto y de su confirmación.", "https://resend.com/legal/privacy-policy"],
  ["Cal.com", "Gestión de reservas cuando el usuario habilita y utiliza el calendario.", "https://cal.com/privacy"],
  ["Google Analytics 4", "Medición agregada del uso del sitio, solo con consentimiento analítico.", "https://policies.google.com/privacy"],
  ["Google Maps", "Visualización del mapa, solo cuando el usuario habilita contenido funcional.", "https://policies.google.com/privacy"],
  ["Vimeo", "Reproducción de vídeos de portfolio, solo cuando el usuario habilita contenido funcional.", "https://vimeo.com/legal/privacy"],
] as const;

const providerRowsEn = [
  ["Vercel", "Hosting, website delivery and technical security logs.", "https://vercel.com/legal/privacy-notice"],
  ["Google Workspace", "Business email and communications management.", "https://policies.google.com/privacy"],
  ["Resend", "Delivery of contact enquiries and confirmation messages.", "https://resend.com/legal/privacy-policy"],
  ["Cal.com", "Booking management when the visitor enables and uses the calendar.", "https://cal.com/privacy"],
  ["Google Analytics 4", "Aggregate website measurement, only with analytics consent.", "https://policies.google.com/privacy"],
  ["Google Maps", "Map display, only when the visitor enables functional content.", "https://policies.google.com/privacy"],
  ["Vimeo", "Portfolio video playback, only when the visitor enables functional content.", "https://vimeo.com/legal/privacy"],
] as const;

const privacy: Record<Locale, LegalDocument> = {
  es: {
    eyebrow: "Protección de datos",
    title: "Política de Privacidad",
    intro:
      "Esta política explica de forma clara cómo Local Boosting S.L., que opera bajo la marca Fonus Studio, recoge y utiliza datos personales a través de fonusstudio.com.",
    updatedLabel: "Última actualización",
    contentsLabel: "Contenido",
    sections: [
      {
        id: "responsable",
        title: "1. Responsable del tratamiento",
        paragraphs: [
          "Responsable: Local Boosting S.L. · Nombre comercial: Fonus Studio · NIF/CIF: B70991237 · Domicilio: C/Campoamor 68, 46022 Valencia, España · Correo de privacidad: info@fonusstudio.com · Teléfono: +34 614 692 775.",
          "Local Boosting S.L. está inscrita en el Registro Mercantil de Valencia, Tomo 11545, Folio 161, Hoja V-217447.",
        ],
      },
      {
        id: "datos",
        title: "2. Datos que tratamos",
        bullets: [
          "Consultas: nombre, correo electrónico, teléfono, empresa y contenido del mensaje.",
          "Reservas en Cal.com: nombre, correo electrónico, teléfono y datos de la cita que el usuario facilite.",
          "Datos técnicos: dirección IP, tipo de navegador, dispositivo, fecha, hora y registros estrictamente necesarios para seguridad, prevención de abuso y funcionamiento del sitio.",
          "Preferencias: elección de idioma y registro de consentimiento de cookies.",
          "Analítica, únicamente con consentimiento: identificadores en línea, páginas visitadas, interacción, datos aproximados de ubicación y características del dispositivo facilitados por Google Analytics 4.",
        ],
        paragraphs: [
          "No solicitamos categorías especiales de datos. Rogamos no incluir información especialmente sensible en mensajes o reservas.",
        ],
      },
      {
        id: "finalidades",
        title: "3. Finalidades, bases jurídicas y conservación",
        table: {
          headers: ["Tratamiento", "Finalidad y base jurídica", "Conservación"],
          rows: [
            ["Consultas", "Responder y realizar actuaciones precontractuales solicitadas. Consentimiento y art. 6.1.b RGPD.", "12 meses desde la última comunicación, salvo que la relación pase a ser contractual."],
            ["Reservas", "Organizar la reunión solicitada. Consentimiento y medidas precontractuales.", "Hasta 12 meses después de la cita, salvo que la relación pase a ser contractual."],
            ["Clientes", "Prestar el servicio, facturar y cumplir obligaciones. Contrato y obligación legal.", "Durante la relación y los plazos legales aplicables; con carácter general, 6 años para documentación mercantil y 4 años para obligaciones tributarias."],
            ["Seguridad", "Proteger el sitio, prevenir fraude y resolver incidencias. Interés legítimo.", "Solo durante el tiempo necesario para investigar y proteger el servicio, conforme a los plazos operativos del proveedor."],
            ["Preferencias y contenidos integrados", "Recordar elecciones y habilitar Cal.com, Google Maps o Vimeo. Consentimiento.", "Hasta que se retire el consentimiento o expire la preferencia indicada en la Política de Cookies."],
            ["Analítica", "Conocer de forma agregada el uso y mejorar el sitio. Consentimiento.", "Datos de usuario de GA4: máximo 14 meses; cookies: los plazos descritos en la Política de Cookies."],
          ],
        },
        paragraphs: [
          "Cuando finalice un plazo, los datos se eliminarán o bloquearán durante el tiempo imprescindible para atender posibles responsabilidades legales.",
        ],
      },
      {
        id: "destinatarios",
        title: "4. Proveedores y destinatarios",
        paragraphs: [
          "No vendemos datos ni los cedemos para publicidad. Pueden acceder a ellos proveedores que actúan como encargados del tratamiento o responsables independientes en la medida necesaria para prestar sus servicios:",
          "También podrán comunicarse datos a administraciones, juzgados y autoridades cuando exista una obligación legal.",
        ],
        table: {
          headers: ["Proveedor", "Servicio", "Información"],
          rows: providerRowsEs,
        },
      },
      {
        id: "transferencias",
        title: "5. Transferencias internacionales",
        paragraphs: [
          "Algunos proveedores pueden tratar datos fuera del Espacio Económico Europeo. Cuando exista una transferencia internacional, se utilizarán las garantías exigidas por el RGPD, como una decisión de adecuación —incluido, cuando resulte aplicable, el Marco de Privacidad de Datos UE–EE. UU.—, cláusulas contractuales tipo u otro mecanismo válido. Puede solicitar información sobre las garantías aplicables escribiendo a info@fonusstudio.com.",
        ],
      },
      {
        id: "derechos",
        title: "6. Sus derechos",
        paragraphs: [
          "Puede solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad, así como retirar el consentimiento en cualquier momento sin afectar a la licitud del tratamiento anterior.",
          "Para ejercerlos, escriba a info@fonusstudio.com indicando el derecho que desea ejercer. Podremos pedir información razonable para verificar su identidad. Si considera que sus derechos no han sido atendidos, puede reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).",
        ],
      },
      {
        id: "decisiones",
        title: "7. Carácter de los datos y decisiones automatizadas",
        paragraphs: [
          "Los campos marcados como obligatorios son necesarios para responder a la consulta o tramitar la reserva. Si no se facilitan, no podremos prestar esa atención. No elaboramos perfiles con efectos jurídicos ni tomamos decisiones exclusivamente automatizadas. No ofrecemos newsletter, cuentas de usuario, pagos ni subida de archivos a través de este sitio.",
        ],
      },
      {
        id: "menores",
        title: "8. Menores de edad",
        paragraphs: [
          "Los servicios se dirigen a profesionales y organizaciones. No recogemos conscientemente datos de menores de 14 años. Si detectamos que se han facilitado sin la autorización exigible, los eliminaremos.",
        ],
      },
      {
        id: "seguridad",
        title: "9. Seguridad y actualizaciones",
        paragraphs: [
          "Aplicamos medidas técnicas y organizativas proporcionadas al riesgo, entre ellas cifrado en tránsito, controles de acceso y prevención de abuso del formulario. Ningún sistema es absolutamente infalible.",
          "Podremos actualizar esta política por cambios legales, técnicos o de servicio. La versión vigente y su fecha se publicarán en esta página.",
        ],
      },
    ],
  },
  en: {
    eyebrow: "Data protection",
    title: "Privacy Policy",
    intro:
      "This policy explains how Local Boosting S.L., trading as Fonus Studio, collects and uses personal data through fonusstudio.com.",
    updatedLabel: "Last updated",
    contentsLabel: "Contents",
    sections: [
      {
        id: "controller",
        title: "1. Data controller",
        paragraphs: [
          "Controller: Local Boosting S.L. · Trading name: Fonus Studio · Spanish tax ID: B70991237 · Registered address: C/Campoamor 68, 46022 Valencia, Spain · Privacy email: info@fonusstudio.com · Telephone: +34 614 692 775.",
          "Local Boosting S.L. is registered with the Valencia Commercial Registry, Volume 11545, Page 161, Sheet V-217447.",
        ],
      },
      {
        id: "data",
        title: "2. Personal data we process",
        bullets: [
          "Enquiries: name, email address, telephone number, company and message.",
          "Cal.com bookings: name, email address, telephone number and appointment details supplied by the visitor.",
          "Technical data: IP address, browser and device type, date, time and logs strictly required for security, abuse prevention and website operation.",
          "Preferences: language choice and cookie consent record.",
          "Analytics, with consent only: online identifiers, visited pages, interactions, approximate location and device information supplied through Google Analytics 4.",
        ],
        paragraphs: [
          "We do not request special-category data. Please do not include particularly sensitive information in enquiries or bookings.",
        ],
      },
      {
        id: "purposes",
        title: "3. Purposes, lawful bases and retention",
        table: {
          headers: ["Processing", "Purpose and lawful basis", "Retention"],
          rows: [
            ["Enquiries", "To respond and take requested pre-contractual steps. Consent and Article 6(1)(b) GDPR.", "12 months from the last communication, unless the enquiry becomes a client relationship."],
            ["Bookings", "To arrange the requested meeting. Consent and pre-contractual steps.", "Up to 12 months after the meeting, unless it becomes a client relationship."],
            ["Clients", "To deliver services, invoice and comply with law. Contract and legal obligation.", "For the relationship and applicable statutory periods; generally 6 years for commercial records and 4 years for Spanish tax obligations."],
            ["Security", "To protect the site, prevent fraud and resolve incidents. Legitimate interests.", "Only as long as needed to investigate and protect the service, subject to the provider’s operational periods."],
            ["Preferences and embedded content", "To remember choices and enable Cal.com, Google Maps or Vimeo. Consent.", "Until consent is withdrawn or the preference expires as described in the Cookie Policy."],
            ["Analytics", "To understand aggregate use and improve the site. Consent.", "GA4 user-level data: no more than 14 months; cookies: the periods in the Cookie Policy."],
          ],
        },
        paragraphs: [
          "After a retention period ends, data is deleted or securely restricted for the time needed to address possible legal liabilities.",
        ],
      },
      {
        id: "recipients",
        title: "4. Service providers and recipients",
        paragraphs: [
          "We do not sell personal data or disclose it for advertising. The following providers may access data as processors or independent controllers only to the extent required for their services:",
          "Data may also be disclosed to public authorities, regulators and courts where required by law.",
        ],
        table: {
          headers: ["Provider", "Service", "Information"],
          rows: providerRowsEn,
        },
      },
      {
        id: "transfers",
        title: "5. International transfers",
        paragraphs: [
          "Some providers may process data outside the European Economic Area. Where an international transfer occurs, safeguards required by the GDPR are used, such as an adequacy decision —including the EU–US Data Privacy Framework where applicable—, Standard Contractual Clauses or another valid mechanism. You may ask about applicable safeguards at info@fonusstudio.com.",
        ],
      },
      {
        id: "rights",
        title: "6. Your rights",
        paragraphs: [
          "You may request access, rectification, erasure, restriction, objection and portability, and withdraw consent at any time without affecting processing carried out before withdrawal.",
          "Email info@fonusstudio.com and identify the right you wish to exercise. We may request reasonable information to verify your identity. You may lodge a complaint with the Spanish Data Protection Agency at www.aepd.es or with your local supervisory authority.",
        ],
      },
      {
        id: "choices",
        title: "7. Required information and automated decisions",
        paragraphs: [
          "Fields marked as required are necessary to answer an enquiry or arrange a booking. Without them, we cannot provide that response. We do not make solely automated decisions with legal or similarly significant effects. This site provides no newsletter, user accounts, payments or file uploads.",
        ],
      },
      {
        id: "children",
        title: "8. Children",
        paragraphs: [
          "Our services are intended for professionals and organisations. We do not knowingly collect data from children under 14. If we learn that data has been supplied without the required authorisation, we will delete it.",
        ],
      },
      {
        id: "security",
        title: "9. Security and policy changes",
        paragraphs: [
          "We use technical and organisational measures proportionate to the risk, including encryption in transit, access controls and form-abuse prevention. No system can be guaranteed completely secure.",
          "We may update this policy to reflect legal, technical or service changes. The current version and date will always appear on this page.",
        ],
      },
    ],
  },
};

const cookies: Record<Locale, LegalDocument> = {
  es: {
    eyebrow: "Control y transparencia",
    title: "Política de Cookies",
    intro:
      "Fonus Studio utiliza únicamente tecnologías esenciales, funcionales y analíticas. No empleamos cookies de marketing ni publicidad.",
    updatedLabel: "Última actualización",
    contentsLabel: "Contenido",
    sections: [
      {
        id: "definicion",
        title: "1. Qué son las cookies",
        paragraphs: [
          "Las cookies y tecnologías similares, como el almacenamiento local, guardan o leen información en el dispositivo. Algunas son necesarias para recordar su elección de privacidad; las demás solo se activan con su consentimiento.",
        ],
      },
      {
        id: "categorias",
        title: "2. Categorías utilizadas",
        table: {
          headers: ["Categoría", "Uso", "Estado"],
          rows: [
            ["Esenciales", "Funcionamiento básico, seguridad y conservación de la elección de cookies.", "Siempre activas; no requieren consentimiento."],
            ["Funcionales", "Preferencia de idioma y contenido solicitado de Cal.com, Google Maps y Vimeo.", "Desactivadas hasta que el usuario las acepte."],
            ["Analíticas", "Google Analytics 4 para medir uso y rendimiento de forma agregada.", "Desactivadas hasta que el usuario las acepte."],
          ],
        },
      },
      {
        id: "detalle",
        title: "3. Tecnologías concretas",
        table: {
          headers: ["Tecnología o servicio", "Proveedor", "Finalidad", "Duración"],
          rows: [
            ["fonus_cookie_consent", "Local Boosting S.L.", "Guardar la selección de categorías y la versión del consentimiento.", "6 meses"],
            ["fonus_language", "Local Boosting S.L.", "Recordar el idioma elegido. Solo se crea con consentimiento funcional.", "12 meses"],
            ["Cal.com", "Cal.com, Inc.", "Mostrar el calendario y tramitar una reserva. Puede usar cookies o almacenamiento propios al habilitarlo.", "Según la configuración y política de Cal.com"],
            ["Google Maps", "Google", "Cargar el mapa solicitado. Google puede usar tecnologías propias al habilitarlo.", "Según la configuración y política de Google"],
            ["Vimeo", "Vimeo.com, Inc.", "Reproducir vídeos solicitados. Vimeo puede usar tecnologías propias al habilitarlo.", "Según la configuración y política de Vimeo"],
            ["_ga", "Google Analytics 4", "Distinguir usuarios de forma seudónima.", "2 años"],
            ["_ga_<ID-del-contenedor>", "Google Analytics 4", "Mantener el estado de la sesión.", "2 años"],
          ],
        },
        paragraphs: [
          "Las filas de Cal.com, Google Maps y Vimeo identifican servicios de terceros, no inventarios cerrados de cookies: sus tecnologías pueden variar. Ninguno de esos servicios se carga antes de aceptar la categoría funcional. Google Analytics tampoco se descarga ni envía datos antes de aceptar la categoría analítica.",
        ],
      },
      {
        id: "consentimiento",
        title: "4. Cómo gestionar el consentimiento",
        paragraphs: [
          "En la primera visita puede aceptar todas, rechazar las no esenciales o personalizar cada categoría. Rechazar es tan sencillo como aceptar. La elección se conserva durante 6 meses y se solicitará de nuevo al vencer o si cambia sustancialmente el uso de tecnologías.",
          "Puede cambiar o retirar su elección en cualquier momento mediante “Preferencias de cookies” en el pie de página. La retirada no afecta a la licitud del tratamiento anterior. Al desactivar una categoría, el sitio elimina las cookies propias que puede controlar y deja de cargar el servicio en visitas posteriores; también puede borrar cookies ya guardadas desde el navegador.",
        ],
      },
      {
        id: "terceros",
        title: "5. Información de terceros",
        table: {
          headers: ["Servicio", "Política"],
          rows: [
            ["Cal.com", "https://cal.com/privacy"],
            ["Google Analytics y Google Maps", "https://policies.google.com/technologies/cookies"],
            ["Vimeo", "https://vimeo.com/legal/privacy/cookies"],
          ],
        },
      },
      {
        id: "responsable",
        title: "6. Responsable y contacto",
        paragraphs: [
          "El responsable es Local Boosting S.L. (Fonus Studio), NIF B70991237, C/Campoamor 68, 46022 Valencia, España. Para cuestiones sobre privacidad o cookies: info@fonusstudio.com.",
        ],
      },
    ],
  },
  en: {
    eyebrow: "Control and transparency",
    title: "Cookie Policy",
    intro:
      "Fonus Studio uses essential, functional and analytics technologies only. We do not use marketing or advertising cookies.",
    updatedLabel: "Last updated",
    contentsLabel: "Contents",
    sections: [
      {
        id: "definition",
        title: "1. What cookies are",
        paragraphs: [
          "Cookies and similar technologies, such as local storage, store or read information on a device. Some are needed to remember your privacy choice; all others are activated only with consent.",
        ],
      },
      {
        id: "categories",
        title: "2. Categories in use",
        table: {
          headers: ["Category", "Use", "Status"],
          rows: [
            ["Essential", "Core operation, security and storage of the cookie choice.", "Always active; consent is not required."],
            ["Functional", "Language preference and requested Cal.com, Google Maps and Vimeo content.", "Off until the visitor accepts."],
            ["Analytics", "Google Analytics 4 for aggregate usage and performance measurement.", "Off until the visitor accepts."],
          ],
        },
      },
      {
        id: "details",
        title: "3. Specific technologies",
        table: {
          headers: ["Technology or service", "Provider", "Purpose", "Duration"],
          rows: [
            ["fonus_cookie_consent", "Local Boosting S.L.", "Stores selected categories and the consent version.", "6 months"],
            ["fonus_language", "Local Boosting S.L.", "Remembers the chosen language. Created only with functional consent.", "12 months"],
            ["Cal.com", "Cal.com, Inc.", "Displays the calendar and processes a booking. It may use its own cookies or storage once enabled.", "Under Cal.com’s configuration and policy"],
            ["Google Maps", "Google", "Loads the requested map. Google may use its own technologies once enabled.", "Under Google’s configuration and policy"],
            ["Vimeo", "Vimeo.com, Inc.", "Plays requested videos. Vimeo may use its own technologies once enabled.", "Under Vimeo’s configuration and policy"],
            ["_ga", "Google Analytics 4", "Distinguishes users pseudonymously.", "2 years"],
            ["_ga_<container-id>", "Google Analytics 4", "Maintains session state.", "2 years"],
          ],
        },
        paragraphs: [
          "The Cal.com, Google Maps and Vimeo rows identify third-party services, not a fixed cookie inventory: their technologies may change. None of these services loads before functional consent. Google Analytics is not downloaded and sends no data before analytics consent.",
        ],
      },
      {
        id: "consent",
        title: "4. Managing consent",
        paragraphs: [
          "On the first visit you can accept all, reject non-essential technologies or customise each category. Rejecting is as easy as accepting. The choice is stored for 6 months and requested again when it expires or if our use changes materially.",
          "You may change or withdraw your choice at any time through “Cookie preferences” in the footer. Withdrawal does not affect earlier lawful processing. When a category is disabled, the site removes first-party cookies it can control and stops loading that service on later visits; you can also delete existing cookies through your browser.",
        ],
      },
      {
        id: "third-parties",
        title: "5. Third-party information",
        table: {
          headers: ["Service", "Policy"],
          rows: [
            ["Cal.com", "https://cal.com/privacy"],
            ["Google Analytics and Google Maps", "https://policies.google.com/technologies/cookies"],
            ["Vimeo", "https://vimeo.com/legal/privacy/cookies"],
          ],
        },
      },
      {
        id: "controller",
        title: "6. Controller and contact",
        paragraphs: [
          "The controller is Local Boosting S.L. (Fonus Studio), Spanish tax ID B70991237, C/Campoamor 68, 46022 Valencia, Spain. For privacy or cookie questions: info@fonusstudio.com.",
        ],
      },
    ],
  },
};

const legal: Record<Locale, LegalDocument> = {
  es: {
    eyebrow: "Información corporativa",
    title: "Aviso Legal",
    intro:
      "Este aviso identifica al titular de fonusstudio.com y establece las condiciones básicas de acceso y uso del sitio.",
    updatedLabel: "Última actualización",
    contentsLabel: "Contenido",
    sections: [
      {
        id: "titular",
        title: "1. Titular del sitio",
        paragraphs: [
          "Titular: Local Boosting S.L. · Nombre comercial: Fonus Studio · NIF/CIF: B70991237 · Domicilio: C/Campoamor 68, 46022 Valencia, España · Correo: info@fonusstudio.com · Teléfono: +34 614 692 775 · Sitio web: https://fonusstudio.com.",
          "Inscrita en el Registro Mercantil de Valencia, Tomo 11545, Folio 161, Hoja V-217447.",
        ],
      },
      {
        id: "objeto",
        title: "2. Objeto y aceptación",
        paragraphs: [
          "El sitio presenta el estudio, los servicios de producción audiovisual, trabajos autorizados y medios de contacto y reserva. El acceso implica aceptar este Aviso Legal. Si no está de acuerdo, debe abstenerse de utilizar el sitio.",
        ],
      },
      {
        id: "uso",
        title: "3. Uso responsable",
        bullets: [
          "Utilizar el sitio de forma lícita, diligente y respetuosa con terceros.",
          "No intentar acceder sin autorización, introducir código malicioso, alterar el servicio ni realizar envíos abusivos.",
          "No copiar, reutilizar o explotar contenidos más allá de lo permitido por la ley o por una autorización escrita.",
        ],
      },
      {
        id: "propiedad",
        title: "4. Propiedad intelectual e industrial",
        paragraphs: [
          "Salvo indicación contraria, el diseño, estructura, textos, marca Fonus Studio, recursos gráficos, software y demás contenidos propios pertenecen a Local Boosting S.L. o se utilizan con licencia. Quedan reservados todos los derechos.",
          "La propiedad intelectual de los clientes —incluidos logos, vídeos, podcasts, testimonios y otros materiales— sigue perteneciendo a cada cliente o a sus legítimos titulares. Fonus Studio solo muestra dichos materiales cuando existe permiso mediante contrato, acuerdo u otra autorización escrita. Su aparición en este sitio no concede al visitante licencia alguna.",
        ],
      },
      {
        id: "responsabilidad",
        title: "5. Disponibilidad y responsabilidad",
        paragraphs: [
          "Procuramos que la información sea correcta y que el sitio esté disponible, pero no garantizamos ausencia total de errores o interrupciones. Podemos actualizar, suspender o modificar contenidos por mantenimiento, seguridad o mejora.",
          "Local Boosting S.L. no responde de daños derivados de usos ilícitos, incompatibilidades del dispositivo, ataques de terceros o circunstancias fuera de su control, sin perjuicio de las responsabilidades que no puedan excluirse por ley.",
        ],
      },
      {
        id: "terceros",
        title: "6. Enlaces y servicios de terceros",
        paragraphs: [
          "El sitio puede enlazar o integrar Cal.com, Google Maps y Vimeo. Su activación es voluntaria y se somete a sus propias condiciones y políticas. Los enlaces externos se facilitan por conveniencia y no implican control ni aprobación de todo su contenido.",
        ],
      },
      {
        id: "privacidad",
        title: "7. Privacidad y cookies",
        paragraphs: [
          "El tratamiento de datos personales se rige por la Política de Privacidad. El uso de cookies y servicios integrados se explica en la Política de Cookies, donde el visitante puede gestionar o retirar su consentimiento.",
        ],
      },
      {
        id: "ley",
        title: "8. Legislación y jurisdicción",
        paragraphs: [
          "Este sitio se rige por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de Valencia cuando dicha sumisión sea legalmente válida. Si el usuario tiene la condición de consumidor, se respetará el fuero imperativo que le corresponda.",
        ],
      },
      {
        id: "copyright",
        title: "9. Reserva de derechos",
        paragraphs: ["© Local Boosting S.L. Todos los derechos reservados."],
      },
    ],
  },
  en: {
    eyebrow: "Company information",
    title: "Legal Notice",
    intro:
      "This notice identifies the owner of fonusstudio.com and sets out the core terms governing access to and use of the website.",
    updatedLabel: "Last updated",
    contentsLabel: "Contents",
    sections: [
      {
        id: "owner",
        title: "1. Website owner",
        paragraphs: [
          "Owner: Local Boosting S.L. · Trading name: Fonus Studio · Spanish tax ID: B70991237 · Registered address: C/Campoamor 68, 46022 Valencia, Spain · Email: info@fonusstudio.com · Telephone: +34 614 692 775 · Website: https://fonusstudio.com.",
          "Registered with the Valencia Commercial Registry, Volume 11545, Page 161, Sheet V-217447.",
        ],
      },
      {
        id: "purpose",
        title: "2. Purpose and acceptance",
        paragraphs: [
          "The website presents the studio, audiovisual production services, authorised client work and contact and booking channels. By accessing it, you accept this Legal Notice. If you do not agree, please do not use the site.",
        ],
      },
      {
        id: "use",
        title: "3. Responsible use",
        bullets: [
          "Use the website lawfully, diligently and with respect for third parties.",
          "Do not attempt unauthorised access, introduce malicious code, disrupt the service or make abusive submissions.",
          "Do not copy, reuse or exploit content except where permitted by law or written authorisation.",
        ],
      },
      {
        id: "ip",
        title: "4. Intellectual and industrial property",
        paragraphs: [
          "Unless stated otherwise, the design, structure, copy, Fonus Studio brand, graphics, software and other original content belong to Local Boosting S.L. or are used under licence. All rights are reserved.",
          "Client intellectual property —including logos, videos, podcasts, testimonials and other materials— remains the property of the client or other lawful owner. Fonus Studio displays those materials only where permission has been granted by contract, agreement or other written authorisation. Their appearance here grants no licence to visitors.",
        ],
      },
      {
        id: "liability",
        title: "5. Availability and liability",
        paragraphs: [
          "We take reasonable care to keep information accurate and the site available, but cannot guarantee a complete absence of errors or interruption. Content may be updated, suspended or changed for maintenance, security or improvement.",
          "Local Boosting S.L. is not liable for loss caused by unlawful use, device incompatibility, third-party attacks or circumstances beyond its control, without limiting liability that cannot lawfully be excluded.",
        ],
      },
      {
        id: "third-parties",
        title: "6. Third-party links and services",
        paragraphs: [
          "The site may link to or integrate Cal.com, Google Maps and Vimeo. Enabling them is voluntary and subject to their own terms and policies. External links are provided for convenience and do not mean we control or endorse all external content.",
        ],
      },
      {
        id: "privacy",
        title: "7. Privacy and cookies",
        paragraphs: [
          "Personal-data processing is described in the Privacy Policy. Cookies and embedded services are explained in the Cookie Policy, where visitors can manage or withdraw consent.",
        ],
      },
      {
        id: "law",
        title: "8. Governing law and jurisdiction",
        paragraphs: [
          "This website is governed by Spanish law. The parties submit to the courts of Valencia where that submission is legally valid. Consumers retain any mandatory jurisdiction rights available to them.",
        ],
      },
      {
        id: "copyright",
        title: "9. Rights reserved",
        paragraphs: ["© Local Boosting S.L. All rights reserved."],
      },
    ],
  },
};

export const legalDocuments: Record<LegalPage, Record<Locale, LegalDocument>> = {
  privacy,
  cookies,
  legal,
};
