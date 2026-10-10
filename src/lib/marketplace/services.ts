import { ServiceOffering } from "@/types/marketplace";

export const SERVICE_CATALOGUE: ServiceOffering[] = [
  {
    id: "website",
    title: "Website creation & maintenance",
    titleFr: "Création et maintenance de site web",
    description:
      "Mobile-first website with WhatsApp button, domain setup guidance, Google Business Profile and ongoing small updates.",
    descriptionFr:
      "Site web mobile-first avec bouton WhatsApp, guidance domaine, fiche Google et petites mises à jour.",
    deliverables: [
      "One-page or multi-page mobile-first site",
      "WhatsApp enquiry integration",
      "Basic SEO (title, description, structure)",
      "Guidance to connect your domain",
      "Optional monthly care (updates & backups)",
    ],
    deliverablesFr: [
      "Site une page ou multi-pages mobile-first",
      "Intégration WhatsApp",
      "SEO de base",
      "Guidance connexion de domaine",
      "Maintenance mensuelle optionnelle",
    ],
    indicativePrice: "From 150,000 XAF (~€230)",
    indicativePriceFr: "À partir de 150 000 XAF (~230 €)",
    timeline: "7–21 days depending on package",
    timelineFr: "7–21 jours selon le forfait",
  },
  {
    id: "bookkeeping",
    title: "Bookkeeping & financial records",
    titleFr: "Comptabilité et organisation des comptes",
    description:
      "Organise daily sales and expenses, separate business money, simple monthly reports and cash-flow visibility.",
    descriptionFr:
      "Organisation des ventes et dépenses, séparation des comptes, rapports mensuels simples et visibilité de trésorerie.",
    deliverables: [
      "Structured sales & expense tracking setup",
      "Monthly summary (revenue, costs, gross view)",
      "Guidance on separating personal vs business money",
      "Simple spreadsheet or Nexora Stock Tracker handover",
    ],
    deliverablesFr: [
      "Mise en place du suivi ventes & dépenses",
      "Résumé mensuel",
      "Guidance séparation comptes perso / business",
      "Remise fichier ou outil Nexora",
    ],
    indicativePrice: "From 75,000 XAF (~€115)",
    indicativePriceFr: "À partir de 75 000 XAF (~115 €)",
    timeline: "5–14 days",
    timelineFr: "5–14 jours",
  },
  {
    id: "inventory",
    title: "Excel & inventory management",
    titleFr: "Excel et gestion de stock",
    description:
      "Set up product lists, stock levels, low-stock alerts and basic gross-profit tracking for shops and wholesalers.",
    descriptionFr:
      "Listes de produits, niveaux de stock, alertes et suivi de marge brute pour boutiques et grossistes.",
    deliverables: [
      "Product catalogue with costs and sell prices",
      "Stock in / out workflow",
      "Low-stock thresholds",
      "Training on Nexora Stock Tracker or Excel",
    ],
    deliverablesFr: [
      "Catalogue produits avec coûts et prix",
      "Workflow entrées / sorties",
      "Seuils de stock bas",
      "Formation Nexora ou Excel",
    ],
    indicativePrice: "From 60,000 XAF (~€90)",
    indicativePriceFr: "À partir de 60 000 XAF (~90 €)",
    timeline: "3–10 days",
    timelineFr: "3–10 jours",
  },
  {
    id: "branding",
    title: "Branding & social media",
    titleFr: "Branding et réseaux sociaux",
    description:
      "Logo refresh, colour system, business card design and consistent social media visuals.",
    descriptionFr:
      "Rafraîchissement logo, couleurs, carte de visite et visuels réseaux sociaux cohérents.",
    deliverables: [
      "Logo (or redraw) + colour palette",
      "Business card design (print-ready)",
      "Social profile & cover templates",
      "Simple brand usage notes",
    ],
    deliverablesFr: [
      "Logo (ou retravail) + palette",
      "Carte de visite (prête à imprimer)",
      "Templates profil & couverture",
      "Notes d'usage de la marque",
    ],
    indicativePrice: "From 100,000 XAF (~€150)",
    indicativePriceFr: "À partir de 100 000 XAF (~150 €)",
    timeline: "7–14 days",
    timelineFr: "7–14 jours",
  },
  {
    id: "documentation",
    title: "Business documentation",
    titleFr: "Documentation d'entreprise",
    description:
      "Company profile, service catalogue, quotation templates and basic policy documents for tenders or clients.",
    descriptionFr:
      "Profil d'entreprise, catalogue de services, modèles de devis et documents de base.",
    deliverables: [
      "Company profile (PDF)",
      "Service / product catalogue",
      "Quotation or invoice template",
      "Optional simple policies (returns, delivery)",
    ],
    deliverablesFr: [
      "Profil entreprise (PDF)",
      "Catalogue services / produits",
      "Modèle de devis ou facture",
      "Politiques simples optionnelles",
    ],
    indicativePrice: "From 50,000 XAF (~€75)",
    indicativePriceFr: "À partir de 50 000 XAF (~75 €)",
    timeline: "5–12 days",
    timelineFr: "5–12 jours",
  },
  {
    id: "digital_setup",
    title: "Digital business setup",
    titleFr: "Mise en place digitale",
    description:
      "Professional email, Google Business Profile, domain guidance and WhatsApp Business basics.",
    descriptionFr:
      "Email professionnel, fiche Google, guidance domaine et bases WhatsApp Business.",
    deliverables: [
      "Business email setup guidance",
      "Google Business Profile setup / optimisation",
      "Domain registration guidance",
      "WhatsApp Business checklist",
    ],
    deliverablesFr: [
      "Guidance email professionnel",
      "Fiche Google Business",
      "Guidance nom de domaine",
      "Checklist WhatsApp Business",
    ],
    indicativePrice: "From 40,000 XAF (~€60)",
    indicativePriceFr: "À partir de 40 000 XAF (~60 €)",
    timeline: "2–7 days",
    timelineFr: "2–7 jours",
  },
  {
    id: "operations",
    title: "Business operations support",
    titleFr: "Support opérations",
    description:
      "Process documentation, daily checklists and practical advice so the business can run when you are away.",
    descriptionFr:
      "Documentation des process, checklists quotidiennes et conseils pratiques pour faire tourner l'activité sans vous.",
    deliverables: [
      "Core process write-ups (5 key tasks)",
      "Daily / weekly checklists",
      "Simple handover notes for staff",
      "One review call",
    ],
    deliverablesFr: [
      "Rédaction de 5 process clés",
      "Checklists journalières / hebdo",
      "Notes de passation pour le personnel",
      "Un appel de revue",
    ],
    indicativePrice: "From 80,000 XAF (~€120)",
    indicativePriceFr: "À partir de 80 000 XAF (~120 €)",
    timeline: "7–14 days",
    timelineFr: "7–14 jours",
  },
];

export function getService(id: string): ServiceOffering | undefined {
  return SERVICE_CATALOGUE.find((s) => s.id === id);
}
