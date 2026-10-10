# Nexora — Intelligent Business Growth Platform

**Founder:** Kwenyi Basil Safeh  
**Location:** Douala, Cameroon  
**WhatsApp:** +237 679 592 027  
**Focus:** Cameroon, Africa & International small businesses

Nexora helps businesses identify problems, organise operations, improve financial visibility, attract customers and implement solutions.

## Current Status (Phase 1 + Phase 2)

### ✅ Completed

- **Phase 1** — Project foundation, design system, landing page, dashboard, navigation
- **Phase 2** — **Nexora Business Doctor** (signature feature)
  - Guided multi-step assessment
  - Business-type specific questions
  - Transparent scoring rules (no black-box)
  - Save & continue later (localStorage)
  - Full results page with:
    - Overall score
    - Category breakdown with status
    - Risks & opportunities
    - Prioritised recommendations with action steps
    - 30-day action plan
    - Suggested Nexora tools
    - Print / Save as PDF
    - Request expert help CTA
  - Clear distinction between user answers and calculated results

### ✅ Phase 3 — Smart Stock & Profit Tracker
- Product registration (name, SKU, category, unit, costs, thresholds)
- Opening stock + current stock
- Stock in (purchases) and adjustment out
- Sales recording with automatic stock reduction
- Expense tracking
- Supplier records
- Low-stock and out-of-stock alerts
- Inventory valuation at last purchase cost
- Gross profit calculation (Revenue − COGS)
- Clear distinction: Gross ≠ Net profit
- Export Products & Sales to CSV
- All values in XAF
- Persistent via localStorage (ready for Prisma later)

### ✅ Phase 4 — Customer Recovery Assistant
- Customer & prospect records
- Sales pipeline (New → Contacted → Qualified → Proposal → Won/Lost)
- Follow-up dates + overdue reminders
- Outstanding invoice tracking
- Communication history
- Inactive contact detection (30+ days)
- Template-based follow-up message drafts
- Copy message or open WhatsApp with pre-filled text
- Messages never sent automatically — user reviews first
- CSV export
- Privacy: data stays on device (localStorage)

### ✅ Phase 5 — Instant Business Launchpad
- Guided form: name, industry, services, location, WhatsApp, language, brand colour
- Auto-generated about, services, FAQs, CTAs, SEO title & description
- Editable content before preview
- Live mobile preview (iframe)
- WhatsApp enquiry button with pre-filled message
- Download HTML / Copy HTML
- Clear notice: draft only — not published until hosted
- EN + FR content generation
- Progress saved on device

### ✅ Phase 6 — Expert Help Marketplace
- 7 service categories with descriptions, deliverables, indicative XAF prices and timelines
- Request form (business, contact, requirements, budget, urgency)
- Request status tracking (submitted → in review → quoted → in progress → completed)
- One-click WhatsApp send to +237 679 592 027 with pre-filled details
- No automatic payments or commissions (as specified for v1)
- Data stored on device

### ✅ Phase 7 — Integration & polish
- Smart Dashboard reads all modules and shows live recommendations
- Business Doctor weak areas → direct links to Stock / Launchpad / CRM / Experts
- Stock low/out alerts surface on Dashboard
- CRM overdue follow-ups surface on Dashboard
- Tool cards show live badges (score, product count, overdue, pending)
- Mobile bottom navigation on all dashboard pages
- Consistent WhatsApp contact (+237 679 592 027) across the platform
- All modules connected as one growth system

### Platform complete (v1)
All six core modules + integrated dashboard are operational.
Next evolution (optional): authentication, Prisma/PostgreSQL persistence, multi-user, payments.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- lucide-react icons
- Zod + transparent rule-based scoring
- localStorage persistence (will move to Prisma + SQLite/PostgreSQL)

## Getting Started

```bash
cd nexora
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Key Routes

| Route                | Description                  |
|----------------------|------------------------------|
| `/`                  | Marketing landing page       |
| `/dashboard`         | Main dashboard               |
| `/business-doctor`   | Business Doctor assessment   |
| `/dashboard/stock`   | Smart Stock & Profit Tracker |
| `/dashboard/customers` | Customer Recovery Assistant |
| `/dashboard/launchpad` | Instant Business Launchpad |
| `/dashboard/experts`   | Expert Help Marketplace |

## Design Principles

- Mobile-first
- Clean, professional, premium
- FCFA / XAF ready
- English primary (French readiness planned)
- Low-bandwidth friendly
- Transparent calculations — never invent financial figures

## Important Notes

- Business Doctor currently stores data in the browser (localStorage).
- No fabricated metrics are ever shown.
- All scores are derived from the user’s answers using documented rules in `src/lib/business-doctor/scoring.ts`.
- Later phases will add proper authentication, database persistence and the remaining modules.

---

Built with care for real African and international small businesses.
