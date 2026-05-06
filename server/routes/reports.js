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
  } else if (sort === "most_upvoted") {
    query = query.order("upvotes", { ascending: false });
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
  const { company_name, location, platform, description, proof_link, flags, force } =
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
  
  // Generate secret code
  const secret_code = "IS-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const newReport = {
    company_name,
    location: location || "",
    platform,
    description: description || "",
    proof_link: proof_link || "",
    flags: safeFlags,
    risk_score: score,
    risk_level: level,
    report_count: 1,
    secret_code
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

  res.status(201).json({ data: insertedData, secret_code });
});

/* ───────────────────────────────────────────
   POST /api/reports/:id/upvote
   ─────────────────────────────────────────── */
router.post("/:id/upvote", async (req, res) => {
  const { data: report, error: fetchError } = await supabase
    .from("reports")
    .select("upvotes")
    .eq("id", req.params.id)
    .single();

  if (fetchError || !report) return res.status(404).json({ error: "Report not found" });

  const { data, error } = await supabase
    .from("reports")
    .update({ upvotes: report.upvotes + 1 })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: "Failed to upvote" });
  res.json({ data });
});

/* ───────────────────────────────────────────
   POST /api/reports/verify-code
   Body: { secret_code }
   ─────────────────────────────────────────── */
router.post("/verify-code", async (req, res) => {
  const { secret_code } = req.body;
  if (!secret_code) return res.status(400).json({ error: "Secret code is required" });

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("secret_code", secret_code)
    .maybeSingle();

  if (error || !data) return res.status(404).json({ error: "Invalid secret code or report not found" });
  res.json({ data });
});

/* ───────────────────────────────────────────
   DELETE /api/reports/:id
   Body: { secret_code }
   ─────────────────────────────────────────── */
router.delete("/:id", async (req, res) => {
  const { secret_code } = req.body;
  if (!secret_code) return res.status(400).json({ error: "Secret code is required" });

  // Verify
  const { data: report, error: fetchError } = await supabase
    .from("reports")
    .select("secret_code")
    .eq("id", req.params.id)
    .single();

  if (fetchError || !report || report.secret_code !== secret_code) {
    return res.status(403).json({ error: "Invalid secret code" });
  }

  // Delete
  const { error } = await supabase
    .from("reports")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ error: "Failed to delete" });
  res.json({ success: true });
});

module.exports = router;
