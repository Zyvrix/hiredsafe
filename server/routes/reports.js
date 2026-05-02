const express = require("express");
const { calculateScore, mergeFlags } = require("../utils/scoreCalculator");

const router = express.Router();

/* ───────────────────────────────────────────
   In-memory store (swap with Supabase later)
   ─────────────────────────────────────────── */
let reports = [];
let nextId = 1;

// Seed some demo data so the UI isn't empty on first load
const SEED = [
  {
    company_name: "QuickHire Solutions",
    platform: "LinkedIn",
    description:
      "Offered a remote data-entry internship but asked for ₹2,000 registration fee before any interview. Sent a generic offer letter with no company branding.",
    proof_link: "https://example.com/proof1",
    flags: ["asked_for_money", "no_interview", "fake_offer_letter"],
    report_count: 3,
  },
  {
    company_name: "BrightFuture Interns",
    platform: "Internshala",
    description:
      "Required unpaid full-time work for 3 months with vague promises of a stipend. No formal contract provided.",
    proof_link: "https://example.com/proof2",
    flags: ["unpaid_work", "no_interview"],
    report_count: 2,
  },
  {
    company_name: "NovaTech Global",
    platform: "Naukri",
    description:
      "Collected Aadhaar and PAN details during application. No interview conducted, and the company website is a single-page template.",
    proof_link: "https://example.com/proof3",
    flags: ["data_theft", "no_interview"],
    report_count: 1,
  },
  {
    company_name: "SkillBridge Academy",
    platform: "LinkedIn",
    description:
      "Paid training program disguised as an internship. Charged ₹5,000 for 'certification' before starting.",
    proof_link: "https://example.com/proof4",
    flags: ["asked_for_money"],
    report_count: 1,
  },
  {
    company_name: "CloudNine Ventures",
    platform: "Indeed",
    description:
      "Sent an offer letter from a Gmail address. Never conducted any interview. No online presence for the company.",
    proof_link: "https://example.com/proof5",
    flags: ["fake_offer_letter", "no_interview", "asked_for_money"],
    report_count: 4,
  },
  {
    company_name: "DataPulse Analytics",
    platform: "Internshala",
    description:
      "Promised a stipend after a 'trial period' of 2 months. Trial involved real client work with no compensation.",
    proof_link: "https://example.com/proof6",
    flags: ["unpaid_work"],
    report_count: 1,
  },
];

// Initialize seed data
SEED.forEach((item) => {
  const isDuplicate = item.report_count > 1;
  const { score, level } = calculateScore(item.flags, isDuplicate);
  reports.push({
    id: nextId++,
    ...item,
    risk_score: Math.min(score + (item.report_count - 1) * 5, 100), // slight bump per extra report
    risk_level: level,
    created_at: new Date().toISOString(),
  });
});
// Re-compute levels after manual score adjustment
reports.forEach((r) => {
  if (r.risk_score <= 30) r.risk_level = "low";
  else if (r.risk_score <= 60) r.risk_level = "suspicious";
  else r.risk_level = "high";
});

/* ───────────────────────────────────────────
   GET /api/reports
   Query params: search, risk, platform, sort
   ─────────────────────────────────────────── */
router.get("/", (req, res) => {
  let results = [...reports];

  // Search by company name
  const { search, risk, platform, sort } = req.query;
  if (search) {
    const q = search.toLowerCase();
    results = results.filter((r) =>
      r.company_name.toLowerCase().includes(q)
    );
  }

  // Filter by risk level
  if (risk && risk !== "all") {
    results = results.filter((r) => r.risk_level === risk);
  }

  // Filter by platform
  if (platform && platform !== "all") {
    results = results.filter(
      (r) => r.platform.toLowerCase() === platform.toLowerCase()
    );
  }

  // Sorting
  if (sort === "highest_risk") {
    results.sort((a, b) => b.risk_score - a.risk_score);
  } else if (sort === "most_reported") {
    results.sort((a, b) => b.report_count - a.report_count);
  } else {
    // Default: newest first
    results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  res.json({ data: results, count: results.length });
});

/* ───────────────────────────────────────────
   GET /api/reports/:id
   ─────────────────────────────────────────── */
router.get("/:id", (req, res) => {
  const report = reports.find((r) => r.id === parseInt(req.params.id));
  if (!report) return res.status(404).json({ error: "Report not found" });
  res.json({ data: report });
});

/* ───────────────────────────────────────────
   POST /api/reports
   Body: { company_name, platform, description, proof_link, flags, force }
   ─────────────────────────────────────────── */
router.post("/", (req, res) => {
  const { company_name, platform, description, proof_link, flags, force } =
    req.body;

  // Validation
  if (!company_name || !platform) {
    return res
      .status(400)
      .json({ error: "company_name and platform are required." });
  }

  // Check for duplicate
  const existing = reports.find(
    (r) => r.company_name.toLowerCase() === company_name.toLowerCase()
  );

  if (existing && !force) {
    return res.status(409).json({
      error: "duplicate",
      message: `"${existing.company_name}" has already been reported with a risk score of ${existing.risk_score}.`,
      existing,
    });
  }

  if (existing && force) {
    // Merge into existing report
    existing.flags = mergeFlags(existing.flags, flags || []);
    existing.report_count += 1;
    if (description) {
      existing.description = description; // latest description wins
    }
    if (proof_link) {
      existing.proof_link = proof_link;
    }

    const { score, level } = calculateScore(existing.flags, true);
    // Add a small bump per additional report, capped at 100
    existing.risk_score = Math.min(
      score + (existing.report_count - 1) * 5,
      100
    );
    existing.risk_level =
      existing.risk_score <= 30
        ? "low"
        : existing.risk_score <= 60
        ? "suspicious"
        : "high";

    return res.json({ data: existing, merged: true });
  }

  // New report
  const { score, level } = calculateScore(flags || [], false);
  const report = {
    id: nextId++,
    company_name,
    platform,
    description: description || "",
    proof_link: proof_link || "",
    flags: flags || [],
    risk_score: score,
    risk_level: level,
    report_count: 1,
    created_at: new Date().toISOString(),
  };

  reports.unshift(report); // Add to front (newest first)
  res.status(201).json({ data: report });
});

module.exports = router;
