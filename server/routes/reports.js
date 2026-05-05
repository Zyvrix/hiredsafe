const express = require("express");
const supabase = require("../utils/supabase");
const { calculateScore, mergeFlags } = require("../utils/scoreCalculator");

const router = express.Router();

/* ───────────────────────────────────────────
   GET /api/reports
   Query params: search, risk, platform, sort
   ─────────────────────────────────────────── */
router.get("/", async (req, res) => {
  const { search, risk, platform, sort } = req.query;

  let query = supabase.from("reports").select("*");

  // Search by company name (ilike for case-insensitive partial match)
  if (search) {
    query = query.ilike("company_name", `%${search}%`);
  }

  // Filter by risk level
  if (risk && risk !== "all") {
    query = query.eq("risk_level", risk);
  }

  // Filter by platform
  if (platform && platform !== "all") {
    query = query.ilike("platform", platform);
  }

  // Sorting
  if (sort === "highest_risk") {
    query = query.order("risk_score", { ascending: false });
  } else if (sort === "most_reported") {
    query = query.order("report_count", { ascending: false });
  } else {
    // Default: newest first
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase GET error:", error);
    return res.status(500).json({ error: "Failed to fetch reports" });
  }

  res.json({ data, count: data.length });
});

/* ───────────────────────────────────────────
   GET /api/reports/:id
   ─────────────────────────────────────────── */
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Report not found" });
  }

  res.json({ data });
});

/* ───────────────────────────────────────────
   POST /api/reports
   Body: { company_name, platform, description, proof_link, flags, force }
   ─────────────────────────────────────────── */
router.post("/", async (req, res) => {
  const { company_name, platform, description, proof_link, flags, force } =
    req.body;

  // Validation
  if (!company_name || !platform) {
    return res
      .status(400)
      .json({ error: "company_name and platform are required." });
  }

  // Check for existing report (case insensitive match on company name)
  const { data: existingData, error: searchError } = await supabase
    .from("reports")
    .select("*")
    .ilike("company_name", company_name)
    .maybeSingle();

  const existing = existingData;

  if (existing && !force) {
    return res.status(409).json({
      error: "duplicate",
      message: `"${existing.company_name}" has already been reported with a risk score of ${existing.risk_score}.`,
      existing,
    });
  }

  if (existing && force) {
    // Merge into existing report
    const newFlags = mergeFlags(existing.flags || [], flags || []);
    const newReportCount = existing.report_count + 1;
    
    // Description and proof link update: latest wins, unless empty
    const newDescription = description || existing.description;
    const newProofLink = proof_link || existing.proof_link;

    const { score, level } = calculateScore(newFlags, true);
    
    // Add a small bump per additional report, capped at 100
    const riskScore = Math.min(score + (newReportCount - 1) * 5, 100);
    const riskLevel =
      riskScore <= 30 ? "low" : riskScore <= 60 ? "suspicious" : "high";

    const { data: updatedData, error: updateError } = await supabase
      .from("reports")
      .update({
        flags: newFlags,
        report_count: newReportCount,
        description: newDescription,
        proof_link: newProofLink,
        risk_score: riskScore,
        risk_level: riskLevel
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (updateError) {
      console.error("Supabase UPDATE error:", updateError);
      return res.status(500).json({ error: "Failed to update report" });
    }

    return res.json({ data: updatedData, merged: true });
  }

  // New report
  const safeFlags = flags || [];
  const { score, level } = calculateScore(safeFlags, false);
  
  const newReport = {
    company_name,
    platform,
    description: description || "",
    proof_link: proof_link || "",
    flags: safeFlags,
    risk_score: score,
    risk_level: level,
    report_count: 1
  };

  const { data: insertedData, error: insertError } = await supabase
    .from("reports")
    .insert([newReport])
    .select()
    .single();

  if (insertError) {
    console.error("Supabase INSERT error:", insertError);
    return res.status(500).json({ error: "Failed to create report" });
  }

  res.status(201).json({ data: insertedData });
});

module.exports = router;
