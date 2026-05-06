import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle, Paperclip, CheckCircle, Copy } from 'lucide-react';
import { createReport } from '../services/api';

const CATEGORIES = [
  { id: 'fake_offer_letter', label: 'Fake offer letter', icon: '📄' },
  { id: 'upfront_payment', label: 'Upfront payment', icon: '💸' },
  { id: 'data_theft', label: 'Data theft', icon: '🔓' },
  { id: 'no_pay_ghosted', label: 'No pay / ghosted', icon: '🚫' },
  { id: 'training_fee_scam', label: 'Training fee scam', icon: '📚' },
  { id: 'phishing_malware', label: 'Phishing / malware', icon: '🎣' },
  { id: 'fake_company', label: 'Fake company', icon: '🏢' },
  { id: 'other', label: 'Other', icon: '⚠️' }
];

export default function ReportForm() {
  const [form, setForm] = useState({
    company_name: '',
    location: '',
    platform: '',
    risk_level: 'high',
    description: '',
    proof_link: '',
    flags: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [secretCode, setSecretCode] = useState('');

  const updateField = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const toggleCategory = (id) => {
    setForm((p) => ({
      ...p,
      flags: p.flags.includes(id) ? p.flags.filter((f) => f !== id) : [...p.flags, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { secret_code } = await createReport(form, true);
      setSecretCode(secret_code);
      setSuccess(true);
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(secretCode);
    alert('Code copied to clipboard!');
  };

  if (success) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card animate-scale-pop" style={{ textAlign: 'center', padding: 40, maxWidth: 480, width: '100%' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--risk-low-bg)', border: '1px solid var(--risk-low-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={32} color="var(--risk-low)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Report Submitted
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
            Thank you for helping keep the community safe. 
          </p>
          
          <div style={{ background: '#fff5eb', border: '1px solid #f5c09a', padding: 20, borderRadius: 8, marginBottom: 24, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d94b1f', fontWeight: 600, marginBottom: 8 }}>
              <AlertTriangle size={18} />
              Save your secret code
            </div>
            <p style={{ fontSize: '0.875rem', color: '#a04b28', marginBottom: 16 }}>
              You will need this code to edit or delete your report in the future. We cannot recover it if lost.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, background: '#fff', border: '1px solid #f5c09a', padding: '12px 16px', borderRadius: 6, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '2px', textAlign: 'center' }}>
                {secretCode}
              </div>
              <button onClick={copyCode} className="btn-ghost" style={{ border: '1px solid #f5c09a', background: '#fff' }}>
                <Copy size={18} />
              </button>
            </div>
          </div>

          <a href="/" className="btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px 80px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 600, width: '100%' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24 }}>
          Report a company
        </h1>

        <div style={{ background: '#fff9f0', border: '1px solid #f2dbb3', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 12 }}>
          <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 style={{ fontWeight: 600, color: '#92400e', marginBottom: 4 }}>Save your code — you won't get another chance</h4>
            <p style={{ fontSize: '0.875rem', color: '#b45309', lineHeight: 1.5 }}>
              After submitting, you'll receive a unique code. This is the <strong>only way</strong> to edit or delete your report. We don't store it and cannot recover it if lost.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div>
            <label className="section-heading" style={{ display: 'block', marginBottom: 8 }}>COMPANY NAME *</label>
            <input
              type="text"
              value={form.company_name}
              onChange={(e) => updateField('company_name', e.target.value)}
              placeholder="e.g. TechInterns India Pvt Ltd"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="section-heading" style={{ display: 'block', marginBottom: 8 }}>LOCATION / CITY</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="e.g. Bangalore, Remote, Pan-India"
              className="input-field"
            />
          </div>

          <div>
            <label className="section-heading" style={{ display: 'block', marginBottom: 8 }}>PLATFORM / WHERE YOU FOUND IT</label>
            <input
              type="text"
              value={form.platform}
              onChange={(e) => updateField('platform', e.target.value)}
              placeholder="e.g. LinkedIn, Internshala, WhatsApp"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="section-heading" style={{ display: 'block', marginBottom: 8 }}>RISK LEVEL</label>
            <select
              value={form.risk_level}
              onChange={(e) => updateField('risk_level', e.target.value)}
              className="input-field"
              style={{ cursor: 'pointer', appearance: 'none' }}
            >
              <option value="high">High — Charged money / stole data</option>
              <option value="suspicious">Suspicious — Unpaid work / fake offer</option>
              <option value="low">Low — Poor communication / other</option>
            </select>
          </div>

          <div>
            <label className="section-heading" style={{ display: 'block', marginBottom: 12 }}>CATEGORIES (SELECT ALL THAT APPLY)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map(cat => {
                const active = form.flags.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 12px', fontSize: '0.875rem',
                      background: active ? 'var(--brand-light)' : '#f3f1ec',
                      border: `1px solid ${active ? 'var(--brand)' : 'transparent'}`,
                      color: active ? 'var(--brand-dark)' : 'var(--text-primary)',
                      borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="section-heading" style={{ display: 'block', marginBottom: 8 }}>WHAT HAPPENED? *</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe what happened — amounts demanded, what was promised, any contact details..."
              className="input-field"
              rows={5}
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          <div>
            <label className="section-heading" style={{ display: 'block', marginBottom: 8 }}>SCREENSHOTS / EVIDENCE (OPTIONAL)</label>
            <div style={{
              border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', padding: 32,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'var(--bg-base)',
              cursor: 'pointer'
            }}>
              <Paperclip size={24} color="var(--text-secondary)" />
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Click to attach or drag & drop</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PNG, JPG, PDF — max 5MB each, up to 5 files</div>
            </div>
          </div>

          <div>
            <label className="section-heading" style={{ display: 'block', marginBottom: 8 }}>RELEVANT LINKS (OPTIONAL)</label>
            <input
              type="text"
              value={form.proof_link}
              onChange={(e) => updateField('proof_link', e.target.value)}
              placeholder="+ Add a link"
              className="input-field"
              style={{ borderStyle: 'dashed', borderWidth: 1.5, marginBottom: 4 }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>e.g. company website, job posting, social profile</div>
          </div>

          <button
            type="submit"
            disabled={submitting || !form.company_name}
            className="btn-primary"
            style={{ width: '100%', height: 48, fontSize: '1rem', marginTop: 8 }}
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Submit report'}
          </button>

        </form>
      </div>
    </div>
  );
}
