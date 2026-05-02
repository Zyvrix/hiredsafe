import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import DuplicateWarning from '../components/DuplicateWarning';
import { createReport } from '../services/api';

const PLATFORMS = ['LinkedIn', 'Internshala', 'Naukri', 'Indeed', 'Other'];

const RED_FLAGS = [
  { key: 'asked_for_money',   label: 'Asked for money',          emoji: '💰', desc: 'Registration fees, equipment charges, etc.' },
  { key: 'no_interview',      label: 'No interview conducted',   emoji: '🚫', desc: 'Offered a role without any screening' },
  { key: 'fake_offer_letter', label: 'Fake offer letter',        emoji: '📄', desc: 'Generic or suspicious offer documentation' },
  { key: 'data_theft',        label: 'Data / identity theft',    emoji: '🔓', desc: 'Asked for Aadhaar, PAN, bank details early' },
  { key: 'unpaid_work',       label: 'Unpaid work',              emoji: '⏳', desc: 'No compensation for extended trial period' },
];

const RISK_WEIGHTS = { asked_for_money: 40, fake_offer_letter: 20, no_interview: 15, unpaid_work: 10, data_theft: 15 };

export default function ReportForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company_name: '',
    platform: 'LinkedIn',
    description: '',
    proof_link: '',
    flags: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [duplicate,  setDuplicate]  = useState(null);

  const updateField = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const toggleFlag = (flag) =>
    setForm((p) => ({
      ...p,
      flags: p.flags.includes(flag) ? p.flags.filter((f) => f !== flag) : [...p.flags, flag],
    }));

  const handleSubmit = async (e, force = false) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    setDuplicate(null);
    try {
      await createReport(form, force);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      if (err.response?.status === 409) setDuplicate(err.response.data.existing);
      else console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const score = Math.min(form.flags.reduce((s, f) => s + (RISK_WEIGHTS[f] || 0), 0), 100);
  const level = score <= 30 ? 'low' : score <= 60 ? 'suspicious' : 'high';
  const levelColors = { low: 'var(--risk-low)', suspicious: 'var(--risk-suspicious)', high: 'var(--risk-high)' };
  const levelLabels = { low: 'Low Risk', suspicious: 'Suspicious', high: 'High Risk' };

  if (success) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-scale-pop" style={{ textAlign: 'center', padding: 40 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--risk-low-bg)',
              border: '1px solid var(--risk-low-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CheckCircle size={32} color="var(--risk-low)" />
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 8 }}>
            Report Submitted
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Thank you for helping keep the community safe. Redirecting…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '48px 24px 80px' }}>
      {duplicate && (
        <DuplicateWarning
          existing={duplicate}
          onForce={() => handleSubmit(null, true)}
          onCancel={() => setDuplicate(null)}
        />
      )}

      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        {/* Page Header */}
        <div className="animate-fade-up" style={{ marginBottom: 32 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              borderRadius: 99,
              background: 'var(--risk-high-bg)',
              border: '1px solid var(--risk-high-border)',
              marginBottom: 14,
            }}
          >
            <AlertTriangle size={12} color="var(--risk-high)" strokeWidth={2.5} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--risk-high)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Report a Scam
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: 8 }}>
            Submit a Company Report
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Help protect others by reporting suspicious internship or job postings. All reports are reviewed by the community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-up"
          style={{ animationDelay: '80ms', display: 'flex', flexDirection: 'column', gap: 20 }}
        >

          {/* Card wrapper */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px 28px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* Company Name */}
            <div>
              <label className="label" htmlFor="input-company-name">
                Company Name <span style={{ color: 'var(--risk-high)' }}>*</span>
              </label>
              <input
                id="input-company-name"
                type="text"
                value={form.company_name}
                onChange={(e) => updateField('company_name', e.target.value)}
                placeholder="e.g. QuickHire Solutions"
                required
                className="input-field"
              />
            </div>

            {/* Platform */}
            <div>
              <label className="label" htmlFor="input-platform">
                Platform <span style={{ color: 'var(--risk-high)' }}>*</span>
              </label>
              <select
                id="input-platform"
                value={form.platform}
                onChange={(e) => updateField('platform', e.target.value)}
                className="input-field"
                style={{ cursor: 'pointer' }}
              >
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="label" htmlFor="input-description">Description</label>
              <textarea
                id="input-description"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe your experience with this company…"
                rows={4}
                className="input-field"
                style={{ resize: 'none', lineHeight: 1.6 }}
              />
            </div>

            {/* Proof Link */}
            <div>
              <label className="label" htmlFor="input-proof-link">Proof Link <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
              <input
                id="input-proof-link"
                type="url"
                value={form.proof_link}
                onChange={(e) => updateField('proof_link', e.target.value)}
                placeholder="https://…"
                className="input-field"
              />
            </div>
          </div>

          {/* Red Flags Card */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px 28px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <p className="label" style={{ marginBottom: 14, fontSize: '0.875rem' }}>Red Flags</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {RED_FLAGS.map((flag) => {
                const active = form.flags.includes(flag.key);
                return (
                  <button
                    key={flag.key}
                    type="button"
                    onClick={() => toggleFlag(flag.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      border: `1.5px solid ${active ? 'var(--border-focus)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      background: active ? 'var(--brand-light)' : 'var(--bg-base)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{flag.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: active ? 'var(--brand)' : 'var(--text-primary)', marginBottom: 2 }}>
                        {flag.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{flag.desc}</div>
                    </div>
                    {/* Checkbox */}
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 5,
                        background: active ? 'var(--brand)' : 'var(--bg-surface)',
                        border: `2px solid ${active ? 'var(--brand)' : 'var(--border-strong)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {active && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Score Preview */}
            {form.flags.length > 0 && (
              <div
                className="animate-fade-up"
                style={{
                  marginTop: 16,
                  padding: '14px 16px',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Estimated Risk Score
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: levelColors[level] }}>
                      {levelLabels[level]}
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: levelColors[level], fontVariantNumeric: 'tabular-nums' }}>
                      {score}/100
                    </span>
                  </div>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 99,
                      width: `${score}%`,
                      background: levelColors[level],
                      transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            id="submit-report"
            type="submit"
            disabled={!form.company_name || submitting}
            className="btn-primary"
            style={{ width: '100%', height: 46, fontSize: '0.9375rem' }}
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={15} /> Submit Report</>}
          </button>
        </form>
      </div>
    </div>
  );
}
