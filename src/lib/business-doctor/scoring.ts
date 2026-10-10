import {
  Answer,
  AssessmentCategory,
  AssessmentResult,
  BusinessType,
  CategoryResult,
  Priority,
  Recommendation,
  CATEGORY_LABELS,
} from "@/types/business-doctor";
import { getQuestionsForBusinessType, ASSESSMENT_QUESTIONS } from "./questions";
import { v4 as uuidv4 } from "uuid";

function getStatus(score: number): CategoryResult["status"] {
  if (score >= 80) return "strong";
  if (score >= 60) return "moderate";
  if (score >= 35) return "weak";
  return "critical";
}

function getPriorityFromScore(score: number): Priority {
  if (score < 35) return "critical";
  if (score < 55) return "high";
  if (score < 75) return "medium";
  return "low";
}

const CATEGORY_RECOMMENDATIONS: Record<
  AssessmentCategory,
  (score: number, businessType: BusinessType) => Recommendation[]
> = {
  financial_records: (score) => {
    const recs: Recommendation[] = [];
    if (score < 70) {
      recs.push({
        id: "rec_fin_1",
        title: "Set up simple daily financial tracking",
        description:
          "Start recording every sale and expense in a structured way. Even a well-organised spreadsheet is a major improvement over notebooks or memory.",
        priority: getPriorityFromScore(score),
        effort: "medium",
        timeframe: "This week",
        nexoraTool: "Smart Stock & Profit Tracker",
        actionSteps: [
          "Choose one tool (Excel, Google Sheets, or Nexora Stock Tracker)",
          "Create columns: Date, Type (Sale/Expense), Amount, Description, Category",
          "Record every transaction for the next 7 days without exception",
          "Review the totals every Sunday evening",
        ],
      });
    }
    if (score < 50) {
      recs.push({
        id: "rec_fin_2",
        title: "Separate business and personal money",
        description:
          "Open a dedicated mobile money wallet or bank account for the business. This single step dramatically improves clarity and professionalism.",
        priority: "critical",
        effort: "low",
        timeframe: "This week",
        actionSteps: [
          "Open a business mobile money or bank account",
          "Transfer all business cash into it",
          "Pay yourself a fixed weekly/monthly amount as salary",
        ],
      });
    }
    return recs;
  },

  sales_profitability: (score) => {
    const recs: Recommendation[] = [];
    if (score < 70) {
      recs.push({
        id: "rec_sales_1",
        title: "Calculate gross profit on your top products",
        description:
          "Knowing which items actually make money (not just which sell the most) allows you to focus effort and inventory correctly.",
        priority: getPriorityFromScore(score),
        effort: "medium",
        timeframe: "Next 7–10 days",
        nexoraTool: "Smart Stock & Profit Tracker",
        actionSteps: [
          "List your 10 best-selling products/services",
          "Write the purchase cost and selling price for each",
          "Calculate: (Selling price – Cost) ÷ Selling price × 100",
          "Identify the 3 highest-margin and 3 lowest-margin items",
        ],
      });
    }
    return recs;
  },

  inventory: (score, businessType) => {
    const recs: Recommendation[] = [];
    if (score < 75 && ["retail", "wholesale", "restaurant", "clinic", "salon"].includes(businessType)) {
      recs.push({
        id: "rec_inv_1",
        title: "Implement basic stock tracking",
        description:
          "Running out of popular items loses sales. Having excess stock ties up cash. Simple tracking solves both problems.",
        priority: getPriorityFromScore(score),
        effort: "medium",
        timeframe: "Next 14 days",
        nexoraTool: "Smart Stock & Profit Tracker",
        actionSteps: [
          "Create a list of all products with current quantity",
          "Record every purchase and every sale against the list",
          "Set a minimum stock level for your top 20 items",
          "Review low-stock items every Monday",
        ],
      });
    }
    return recs;
  },

  customer_acquisition: (score) => {
    const recs: Recommendation[] = [];
    if (score < 70) {
      recs.push({
        id: "rec_cust_1",
        title: "Build a simple customer contact list",
        description:
          "Your existing customers are your cheapest source of new revenue. Capture their WhatsApp numbers and stay in touch.",
        priority: getPriorityFromScore(score),
        effort: "low",
        timeframe: "This week",
        nexoraTool: "Customer Recovery Assistant",
        actionSteps: [
          "Create a spreadsheet or use Nexora CRM with Name, Phone, Last purchase",
          "Ask every customer for their WhatsApp number this week",
          "Send one helpful message (new stock, tip, or thank you) within 7 days",
        ],
      });
    }
    return recs;
  },

  online_visibility: (score) => {
    const recs: Recommendation[] = [];
    if (score < 80) {
      recs.push({
        id: "rec_online_1",
        title: "Establish a professional online presence",
        description:
          "Most customers now search on their phone before calling. A clean website + Google profile + business email dramatically increases trust and enquiries.",
        priority: getPriorityFromScore(score),
        effort: "medium",
        timeframe: "Next 14–21 days",
        nexoraTool: "Instant Business Launchpad",
        actionSteps: [
          "Claim or create your Google Business Profile",
          "Add clear photos, opening hours, and WhatsApp number",
          "Create a simple one-page website with Nexora Launchpad",
          "Use a professional email address (info@yourbusiness.com)",
        ],
      });
    }
    return recs;
  },

  supplier_management: (score) => {
    const recs: Recommendation[] = [];
    if (score < 65) {
      recs.push({
        id: "rec_supp_1",
        title: "Document and diversify key suppliers",
        description:
          "Relying on a single unreliable supplier creates risk. Keeping simple records of prices and performance gives you negotiating power.",
        priority: getPriorityFromScore(score),
        effort: "low",
        timeframe: "Next 10 days",
        actionSteps: [
          "List your top 5 suppliers with contact and typical delivery time",
          "Note the last 3 purchase prices for your main items",
          "Identify at least one alternative supplier for your critical products",
        ],
      });
    }
    return recs;
  },

  operations: (score) => {
    const recs: Recommendation[] = [];
    if (score < 70) {
      recs.push({
        id: "rec_ops_1",
        title: "Document your core daily processes",
        description:
          "When everything depends on you, the business cannot grow. Writing down how key tasks are done allows others to help and improves consistency.",
        priority: getPriorityFromScore(score),
        effort: "medium",
        timeframe: "Next 14 days",
        actionSteps: [
          "List the 5 most important daily/weekly tasks",
          "Write simple step-by-step instructions for each",
          "Train one person on at least two of those tasks",
          "Test by being away for half a day",
        ],
      });
    }
    return recs;
  },

  cash_flow: (score) => {
    const recs: Recommendation[] = [];
    if (score < 70) {
      recs.push({
        id: "rec_cash_1",
        title: "Create a simple 30-day cash plan",
        description:
          "Most cash shortages are predictable. A basic weekly forecast prevents surprises and late payments.",
        priority: getPriorityFromScore(score),
        effort: "medium",
        timeframe: "This week",
        actionSteps: [
          "List all expected expenses for the next 30 days",
          "List expected income (realistic, not optimistic)",
          "Identify the weeks where money will be tight",
          "Decide in advance what you will delay or prioritise",
        ],
      });
    }
    return recs;
  },

  customer_service: (score) => {
    const recs: Recommendation[] = [];
    if (score < 75) {
      recs.push({
        id: "rec_cs_1",
        title: "Install a simple enquiry follow-up system",
        description:
          "Many sales are lost simply because the business did not reply or follow up. A basic system recovers lost revenue.",
        priority: getPriorityFromScore(score),
        effort: "low",
        timeframe: "This week",
        nexoraTool: "Customer Recovery Assistant",
        actionSteps: [
          "Create a list or use Nexora CRM for every enquiry",
          "Respond to every message within 2 hours during business hours",
          "Set a reminder to follow up after 24–48 hours if no reply",
          "Track which follow-ups convert into sales",
        ],
      });
    }
    return recs;
  },
};

export function calculateAssessment(
  businessName: string,
  businessType: BusinessType,
  answers: Record<string, string | string[]>,
  location?: string
): AssessmentResult {
  const questions = getQuestionsForBusinessType(businessType);
  const answerList: Answer[] = [];

  // Build answers with scores
  for (const q of questions) {
    const raw = answers[q.id];
    if (raw === undefined) continue;

    let score = 0;
    if (q.type === "single" && typeof raw === "string") {
      const opt = q.options.find((o) => o.value === raw);
      score = opt?.score ?? 0;
    } else if (Array.isArray(raw)) {
      // average of selected
      const scores = raw
        .map((v) => q.options.find((o) => o.value === v)?.score ?? 0)
        .filter((s) => s > 0);
      score = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    }

    answerList.push({ questionId: q.id, value: raw, score });
  }

  // Group by category
  const categoryMap = new Map<AssessmentCategory, { scores: number[]; findings: string[] }>();

  for (const q of questions) {
    const ans = answerList.find((a) => a.questionId === q.id);
    if (!ans) continue;

    if (!categoryMap.has(q.category)) {
      categoryMap.set(q.category, { scores: [], findings: [] });
    }
    const entry = categoryMap.get(q.category)!;
    entry.scores.push(ans.score);

    // Generate simple finding based on score
    if (ans.score < 40) {
      entry.findings.push(`Weak area detected in: "${q.text}"`);
    } else if (ans.score >= 85) {
      entry.findings.push(`Strength: good practice on "${q.text.slice(0, 50)}..."`);
    }
  }

  const categories: CategoryResult[] = [];
  let totalScore = 0;
  let categoryCount = 0;

  for (const [cat, data] of categoryMap) {
    const avg =
      data.scores.length > 0
        ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
        : 0;

    const recommendations = CATEGORY_RECOMMENDATIONS[cat](avg, businessType);

    categories.push({
      category: cat,
      label: CATEGORY_LABELS[cat],
      score: avg,
      maxScore: 100,
      status: getStatus(avg),
      findings: data.findings.slice(0, 3),
      recommendations,
    });

    totalScore += avg;
    categoryCount++;
  }

  const overallScore = categoryCount > 0 ? Math.round(totalScore / categoryCount) : 0;

  // Collect risks & opportunities
  const risks: string[] = [];
  const opportunities: string[] = [];
  const recommendedTools = new Set<string>();

  for (const cat of categories) {
    if (cat.status === "critical" || cat.status === "weak") {
      risks.push(`${cat.label}: score ${cat.score}/100 – needs immediate attention`);
    }
    if (cat.status === "strong") {
      opportunities.push(`${cat.label}: already strong – protect and build on this`);
    }
    for (const rec of cat.recommendations) {
      if (rec.nexoraTool) recommendedTools.add(rec.nexoraTool);
    }
  }

  // 30-day action plan (prioritised)
  const allRecs = categories.flatMap((c) => c.recommendations);
  const sortedRecs = allRecs.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  });

  const actionPlan30Days = [
    {
      week: 1,
      title: "Foundation & Quick Wins",
      tasks: sortedRecs
        .filter((r) => r.priority === "critical" || r.timeframe.includes("week"))
        .slice(0, 4)
        .flatMap((r) => r.actionSteps.slice(0, 2)),
    },
    {
      week: 2,
      title: "Systems & Tracking",
      tasks: sortedRecs
        .filter((r) => r.effort === "medium" || r.nexoraTool)
        .slice(0, 3)
        .flatMap((r) => r.actionSteps.slice(0, 2)),
    },
    {
      week: 3,
      title: "Visibility & Customers",
      tasks: sortedRecs
        .filter(
          (r) =>
            r.nexoraTool === "Instant Business Launchpad" ||
            r.nexoraTool === "Customer Recovery Assistant"
        )
        .flatMap((r) => r.actionSteps.slice(0, 2))
        .slice(0, 4),
    },
    {
      week: 4,
      title: "Review & Optimise",
      tasks: [
        "Review all numbers recorded during the month",
        "Identify the single biggest remaining bottleneck",
        "Decide which Nexora tool or expert help to activate next",
        "Celebrate progress and set the next 30-day goal",
      ],
    },
  ];

  // Clean empty weeks
  const cleanedPlan = actionPlan30Days.map((w) => ({
    ...w,
    tasks: w.tasks.length > 0 ? w.tasks : ["Continue implementing previous actions and review progress"],
  }));

  const summary =
    overallScore >= 75
      ? `Your business shows solid foundations (overall score ${overallScore}/100). Focus on the remaining weak areas to accelerate growth.`
      : overallScore >= 50
        ? `Your business has moderate strength (overall score ${overallScore}/100). Several important gaps need attention to improve profitability and stability.`
        : `Your business has significant gaps (overall score ${overallScore}/100). Prioritising the critical recommendations below will create the biggest improvement in the next 30 days.`;

  return {
    id: uuidv4(),
    businessName,
    businessType,
    location,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    answers: answerList,
    overallScore,
    categories,
    risks,
    opportunities,
    actionPlan30Days: cleanedPlan,
    recommendedTools: Array.from(recommendedTools),
    summary,
  };
}
