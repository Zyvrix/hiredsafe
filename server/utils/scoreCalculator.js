/**
 * Smart Risk Score Calculator
 *
 * Scoring weights:
 *   +40  →  asked_for_money
 *   +20  →  fake_offer_letter
 *   +15  →  no_interview
 *   +10  →  unpaid_work
 *   +15  →  data_theft
 *
 * Multiple-reports bonus is applied externally when duplicates are merged.
 *
 * Risk tiers:
 *    0–30  →  Low Risk      (green)
 *   31–60  →  Suspicious    (yellow)
 *   61–100 →  High Risk     (red)
 */

const FLAG_WEIGHTS = {
  upfront_payment: 40,
  fake_offer_letter: 20,
  data_theft: 15,
  no_pay_ghosted: 15,
  training_fee_scam: 30,
  phishing_malware: 30,
  fake_company: 50,
  other: 5,
};

const MULTIPLE_REPORTS_BONUS = 15;

/**
 * Calculate risk score from an array of flag strings.
 * @param {string[]} flags  – e.g. ["asked_for_money", "no_interview"]
 * @param {boolean}  isDuplicate – whether this is a repeat report
 * @returns {{ score: number, level: string }}
 */
function calculateScore(flags = [], isDuplicate = false) {
  let score = 0;

  for (const flag of flags) {
    if (FLAG_WEIGHTS[flag]) {
      score += FLAG_WEIGHTS[flag];
    }
  }

  if (isDuplicate) {
    score += MULTIPLE_REPORTS_BONUS;
  }

  // Cap at 100
  score = Math.min(score, 100);

  let level;
  if (score <= 30) level = "low";
  else if (score <= 60) level = "suspicious";
  else level = "high";

  return { score, level };
}

/**
 * Merge two flag arrays, keeping unique values.
 */
function mergeFlags(existingFlags = [], newFlags = []) {
  const set = new Set([...existingFlags, ...newFlags]);
  return Array.from(set);
}

module.exports = { calculateScore, mergeFlags, FLAG_WEIGHTS, MULTIPLE_REPORTS_BONUS };
