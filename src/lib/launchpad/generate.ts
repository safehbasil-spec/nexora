import { LaunchpadInput, GeneratedContent, Industry } from "@/types/launchpad";

function parseServices(raw: string): string[] {
  return raw
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function industryAbout(industry: Industry, name: string, location: string, lang: "en" | "fr"): string {
  const loc = location || "Cameroon";
  if (lang === "fr") {
    const map: Record<Industry, string> = {
      retail: `${name} est votre boutique de confiance à ${loc}. Nous proposons des produits de qualité à des prix justes, avec un service client attentif.`,
      restaurant: `${name} vous accueille à ${loc} pour des plats savoureux préparés avec soin. Venez découvrir une cuisine qui fait plaisir.`,
      salon: `${name} est votre salon de beauté à ${loc}. Soins, coiffure et bien-être dans un cadre professionnel et accueillant.`,
      clinic: `${name} offre des soins de santé de qualité à ${loc}. Une équipe à votre écoute pour votre bien-être.`,
      hotel: `${name} vous propose un séjour confortable à ${loc}. Hospitalité, propreté et service au rendez-vous.`,
      education: `${name} est un établissement d'enseignement à ${loc}, engagé pour la réussite de chaque apprenant.`,
      service: `${name} fournit des services professionnels à ${loc}. Fiabilité, qualité et respect des délais.`,
      wholesale: `${name} est votre partenaire grossiste à ${loc}. Produits en gros, prix compétitifs, livraison fiable.`,
      other: `${name} est une entreprise basée à ${loc}, engagée à offrir un service de qualité à ses clients.`,
    };
    return map[industry];
  }
  const map: Record<Industry, string> = {
    retail: `${name} is your trusted shop in ${loc}. We offer quality products at fair prices, with friendly customer service.`,
    restaurant: `${name} welcomes you in ${loc} for delicious meals prepared with care. Come and enjoy food that makes you happy.`,
    salon: `${name} is your beauty salon in ${loc}. Hair, care and wellness in a professional and welcoming space.`,
    clinic: `${name} provides quality healthcare in ${loc}. A team that listens and cares for your well-being.`,
    hotel: `${name} offers a comfortable stay in ${loc}. Hospitality, cleanliness and reliable service.`,
    education: `${name} is an education centre in ${loc}, committed to the success of every learner.`,
    service: `${name} delivers professional services in ${loc}. Reliable, quality work delivered on time.`,
    wholesale: `${name} is your wholesale partner in ${loc}. Bulk products, competitive prices, dependable delivery.`,
    other: `${name} is a business based in ${loc}, committed to delivering quality service to its customers.`,
  };
  return map[industry];
}

function serviceDescriptions(items: string[], lang: "en" | "fr"): { title: string; description: string }[] {
  return items.map((title) => ({
    title,
    description:
      lang === "fr"
        ? `Découvrez notre offre ${title.toLowerCase()}. Qualité et service au rendez-vous.`
        : `Explore our ${title.toLowerCase()} offering. Quality and service you can count on.`,
  }));
}

function generateFaqs(
  name: string,
  location: string,
  phone: string | undefined,
  lang: "en" | "fr"
): { question: string; answer: string }[] {
  if (lang === "fr") {
    return [
      {
        question: "Où êtes-vous situés ?",
        answer: `Nous sommes basés à ${location || "Douala, Cameroun"}. Contactez-nous pour l'adresse exacte et les horaires.`,
      },
      {
        question: "Comment passer une commande ou prendre rendez-vous ?",
        answer: phone
          ? `Contactez-nous sur WhatsApp au ${phone} ou utilisez le bouton WhatsApp sur cette page. Nous répondons rapidement.`
          : `Utilisez le bouton WhatsApp sur cette page ou appelez-nous. Nous répondons rapidement.`,
      },
      {
        question: "Quels sont vos horaires ?",
        answer: `Contactez-nous pour connaître nos horaires d'ouverture. Nous faisons de notre mieux pour vous accueillir.`,
      },
      {
        question: `Pourquoi choisir ${name} ?`,
        answer: `Nous mettons la qualité, la transparence et le service client au cœur de notre activité. Votre satisfaction est notre priorité.`,
      },
    ];
  }
  return [
    {
      question: "Where are you located?",
      answer: `We are based in ${location || "Douala, Cameroon"}. Contact us for the exact address and opening hours.`,
    },
    {
      question: "How do I place an order or book?",
      answer: phone
        ? `Message us on WhatsApp at ${phone} or use the WhatsApp button on this page. We reply quickly.`
        : `Use the WhatsApp button on this page or call us. We reply quickly.`,
    },
    {
      question: "What are your opening hours?",
      answer: `Contact us for current opening hours. We do our best to welcome you when you need us.`,
    },
    {
      question: `Why choose ${name}?`,
      answer: `We put quality, transparency and customer service at the centre of everything we do. Your satisfaction is our priority.`,
    },
  ];
}

export function generateContent(input: LaunchpadInput): GeneratedContent {
  const lang = input.preferredLanguage;
  const name = input.businessName.trim();
  const location = input.location.trim() || "Douala, Cameroon";
  const servicesList = parseServices(input.productsServices);
  const phone = input.whatsapp || input.phone;

  const tagline =
    input.tagline?.trim() ||
    (lang === "fr"
      ? `Qualité et service à ${location}`
      : `Quality and service in ${location}`);

  const about =
    input.aboutText?.trim() || industryAbout(input.industry, name, location, lang);

  const services =
    servicesList.length > 0
      ? serviceDescriptions(servicesList, lang)
      : [
          {
            title: lang === "fr" ? "Nos services" : "Our services",
            description:
              lang === "fr"
                ? "Contactez-nous pour découvrir toutes nos offres."
                : "Contact us to discover everything we offer.",
          },
        ];

  const faqs = generateFaqs(name, location, phone, lang);

  const ctaPrimary =
    lang === "fr" ? "Nous contacter sur WhatsApp" : "Contact us on WhatsApp";
  const ctaSecondary =
    lang === "fr" ? "Voir nos services" : "See our services";

  const seoTitle = `${name} — ${location}`;
  const seoDescription =
    about.slice(0, 155) + (about.length > 155 ? "…" : "");

  const whatsappMessage =
    lang === "fr"
      ? `Bonjour ${name}, je vous contacte depuis votre site web.`
      : `Hello ${name}, I am contacting you from your website.`;

  return {
    businessName: name,
    tagline,
    about,
    services,
    faqs,
    ctaPrimary,
    ctaSecondary,
    seoTitle,
    seoDescription,
    whatsappMessage,
  };
}

export function buildWhatsAppUrl(phone: string | undefined, message: string): string | null {
  if (!phone) return null;
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "237" + cleaned.slice(1);
  if (!cleaned.startsWith("237") && cleaned.length === 9) cleaned = "237" + cleaned;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

/** Generate a simple standalone HTML preview the user can copy or save. */
export function generateHTML(
  input: LaunchpadInput,
  content: GeneratedContent
): string {
  const color = input.brandColor || "#0d9488";
  const wa = buildWhatsAppUrl(input.whatsapp || input.phone, content.whatsappMessage);
  const servicesHtml = content.services
    .map(
      (s) =>
        `<div class="card"><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.description)}</p></div>`
    )
    .join("\n");
  const faqsHtml = content.faqs
    .map(
      (f) =>
        `<details><summary>${escapeHtml(f.question)}</summary><p>${escapeHtml(f.answer)}</p></details>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="${input.preferredLanguage}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(content.seoTitle)}</title>
  <meta name="description" content="${escapeHtml(content.seoDescription)}" />
  <style>
    :root { --primary: ${color}; --bg: #f8fafc; --text: #0f172a; --muted: #64748b; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; }
    .wrap { max-width: 720px; margin: 0 auto; padding: 1.5rem; }
    header { background: white; border-bottom: 1px solid #e2e8f0; padding: 1rem 1.5rem; position: sticky; top: 0; }
    header .inner { max-width: 720px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-weight: 700; font-size: 1.15rem; color: var(--primary); }
    .btn { display: inline-flex; align-items: center; gap: 0.4rem; background: var(--primary); color: white; padding: 0.65rem 1.1rem; border-radius: 0.75rem; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
    .btn:hover { filter: brightness(0.95); }
    .hero { padding: 2.5rem 0 1.5rem; }
    .hero h1 { font-size: 1.85rem; line-height: 1.25; margin-bottom: 0.5rem; }
    .hero .tag { color: var(--muted); font-size: 1.05rem; margin-bottom: 1.25rem; }
    section { margin: 2rem 0; }
    section h2 { font-size: 1.25rem; margin-bottom: 1rem; }
    .about { background: white; border-radius: 1rem; padding: 1.25rem; border: 1px solid #e2e8f0; }
    .grid { display: grid; gap: 0.75rem; }
    @media (min-width: 520px) { .grid { grid-template-columns: 1fr 1fr; } }
    .card { background: white; border: 1px solid #e2e8f0; border-radius: 0.85rem; padding: 1rem; }
    .card h3 { font-size: 1rem; margin-bottom: 0.35rem; }
    .card p { font-size: 0.9rem; color: var(--muted); }
    details { background: white; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 0.85rem 1rem; margin-bottom: 0.5rem; }
    summary { font-weight: 600; cursor: pointer; }
    details p { margin-top: 0.5rem; font-size: 0.9rem; color: var(--muted); }
    footer { text-align: center; padding: 2rem 1rem; font-size: 0.8rem; color: var(--muted); }
    .sticky-wa { position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 50; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
  </style>
</head>
<body>
  <header>
    <div class="inner">
      <div class="logo">${escapeHtml(content.businessName)}</div>
      ${wa ? `<a class="btn" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
    </div>
  </header>
  <div class="wrap">
    <div class="hero">
      <h1>${escapeHtml(content.businessName)}</h1>
      <p class="tag">${escapeHtml(content.tagline)}</p>
      ${wa ? `<a class="btn" href="${wa}" target="_blank" rel="noopener">${escapeHtml(content.ctaPrimary)}</a>` : ""}
    </div>
    <section>
      <h2>${input.preferredLanguage === "fr" ? "À propos" : "About us"}</h2>
      <div class="about"><p>${escapeHtml(content.about)}</p></div>
    </section>
    <section>
      <h2>${input.preferredLanguage === "fr" ? "Services & Produits" : "Services & Products"}</h2>
      <div class="grid">${servicesHtml}</div>
    </section>
    <section>
      <h2>FAQ</h2>
      ${faqsHtml}
    </section>
  </div>
  <footer>
    ${escapeHtml(content.businessName)} · ${escapeHtml(input.location || "Cameroon")}
    ${input.phone ? ` · ${escapeHtml(input.phone)}` : ""}
    <br />Site draft generated with Nexora Launchpad
  </footer>
  ${wa ? `<a class="btn sticky-wa" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
