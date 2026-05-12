const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const supabase = require("../utils/supabase");

const router = express.Router();

/* ───────────────────────────────────────────
   Initialize Gemini
   ─────────────────────────────────────────── */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let model = null;
if (GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
  });
} else {
  console.warn("⚠️  GEMINI_API_KEY not set. AI research endpoint will be unavailable.");
}

/* ───────────────────────────────────────────
   POST /api/ai/research
   Body: { company_name }
   ─────────────────────────────────────────── */
router.post("/research", async (req, res) => {
  try {
    const { company_name } = req.body;

    if (!company_name || company_name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: "Company name is required (minimum 2 characters).",
      });
    }

    if (!model) {
      return res.status(503).json({
        success: false,
        error: "AI research is not configured. GEMINI_API_KEY is missing.",
      });
    }

    const normalizedName = company_name.trim();

    /* ── Step 1: Check cache ── */
    const { data: cached, error: cacheError } = await supabase
      .from("ai_research")
      .select("*")
      .ilike("company_name", normalizedName)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cached && !cacheError) {
      // Check if cache is less than 7 days old
      const cacheAge = Date.now() - new Date(cached.created_at).getTime();
      const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

      if (cacheAge < SEVEN_DAYS) {
        console.log(`[AI] Cache hit for "${normalizedName}"`);
        return res.json({
          success: true,
          data: cached,
          cached: true,
        });
      }
    }

    /* ── Step 2: Call Gemini AI ── */
    console.log(`[AI] Researching "${normalizedName}" via Gemini...`);

    const prompt = `You are a world-class job scam detection expert and company verification analyst. A student wants to know if "${normalizedName}" is safe to apply to for jobs/internships.

TASK: Analyze this company and return a structured JSON risk assessment.

ANALYSIS CHECKLIST:
1. Is this a well-known, publicly traded, or Fortune 500/Global 2000 company?
2. Does it have an established website, LinkedIn page with real employees, and verifiable physical offices?
3. Are there scam reports on platforms like Glassdoor, Indeed, BBB, Trustpilot, or Reddit?
4. Are there red flags like: no website, asking for money, using free email domains (gmail/yahoo) for recruitment, vague job descriptions, "too good to be true" salary offers?
5. How long has the company existed? Is it registered with government business registries?

RISK SCORE CALIBRATION (follow this precisely):
- 0-10: Major well-known companies (Amazon, Google, Microsoft, Apple, TCS, Infosys, Wipro, Accenture, Meta, Netflix, etc.). These are obviously safe.
- 10-25: Established mid-size companies with strong online presence, real offices, and years of operation.
- 25-40: Smaller but verifiable companies with some online presence.
- 40-60: Companies with limited information available — not necessarily scams, but caution is warranted.
- 60-75: Companies with multiple warning signs (very new, no verifiable info, suspicious patterns).
- 75-100: Companies with strong scam indicators (fake addresses, money requests, known fraud reports).

CRITICAL RULES:
- DO NOT assign risk_score above 25 to any well-known, established company unless there are specific, documented scam concerns about that company's recruitment process.
- If the company name is clearly gibberish or nonsensical text (like "asdf", "xyz123"), set risk_level to "high" and risk_score to 85+ because real companies don't have such names.
- Be balanced and fair. Unknown ≠ scam. Small ≠ dangerous.
- If the company is legitimate but has some employee complaints about work culture, that's NOT a scam red flag.

Return ONLY a JSON object with this EXACT structure:
{
  "summary": "A 2-3 sentence overview of the company and whether it is safe to apply to.",
  "risk_level": "safe" or "suspicious" or "high",
  "risk_score": <number 0-100 following the calibration guide above>,
  "red_flags": ["specific concerns, if any — empty array if none"],
  "positive_signals": ["specific positive indicators of legitimacy"],
  "recommendation": "Clear, actionable advice for the student (1-2 sentences).",
  "sources": ["types of sources you considered, e.g. 'Company website', 'LinkedIn', 'Glassdoor'"]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        console.error("[AI] Failed to parse Gemini response:", text);
        return res.status(500).json({
          success: false,
          error: "AI returned an invalid response. Please try again.",
        });
      }
    }

    // Validate and sanitize the response
    const sanitized = {
      company_name: normalizedName,
      summary: analysis.summary || "No summary available.",
      risk_level: ["safe", "suspicious", "high"].includes(analysis.risk_level)
        ? analysis.risk_level
        : "suspicious",
      risk_score:
        typeof analysis.risk_score === "number"
          ? Math.max(0, Math.min(100, analysis.risk_score))
          : 50,
      red_flags: Array.isArray(analysis.red_flags) ? analysis.red_flags : [],
      positive_signals: Array.isArray(analysis.positive_signals)
        ? analysis.positive_signals
        : [],
      recommendation: analysis.recommendation || "Exercise caution when applying.",
      sources: Array.isArray(analysis.sources) ? analysis.sources : [],
    };

    /* ── Step 3: Cache the result ── */
    const { error: insertError } = await supabase
      .from("ai_research")
      .insert([sanitized]);

    if (insertError) {
      console.warn("[AI] Failed to cache result:", insertError.message);
      // Don't fail the request — still return the result
    }

    console.log(`[AI] Research complete for "${normalizedName}" → ${sanitized.risk_level} (${sanitized.risk_score}/100)`);

    return res.json({
      success: true,
      data: sanitized,
      cached: false,
    });
  } catch (err) {
    console.error("[AI] Research error:", err);
    return res.status(500).json({
      success: false,
      error: "AI research failed. Please try again later.",
    });
  }
});

module.exports = router;
