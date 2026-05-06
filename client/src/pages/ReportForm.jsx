import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle, CheckCircle, Copy, Shield } from 'lucide-react';
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
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company_name: '', location: '', platform: '',
    risk_level: 'high', description: '', proof_link: '', flags: [],
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
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card animate-scale-pop" style={{ textAlign: 'center', padding: '48px 40px', maxWidth: 460, width: '100%' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--brand-light)', border: '1px solid var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <CheckCircle size={28} color="var(--brand)" />
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Report submitted
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 28 }}>
            Your report is now live and helping protect others.
          </p>

          {/* Secret code */}
          <div style={{
            background: 'var(--bg-muted)', border: '1px solid var(--border-strong)',
            borderRadius: 8, padding: 20, marginBottom: 28, textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8 }}>
              <AlertTriangle size={15} /> Save this code
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
              This is the only way to manage your report later. We can't recover it.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
                padding: '10px 16px', borderRadius: 6,
                fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand)',
                letterSpacing: '2px', textAlign: 'center', fontFamily: 'monospace',
              }}>
                {secretCode}
              </div>
              <button onClick={copyCode} className="btn-ghost" style={{ padding: '0 14px' }}>
                <Copy size={16} />
              </button>
            </div>
          </div>

          <button onClick={() => navigate('/')} className="btn-primary" style={{ width: '100%' }}>
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '48px 24px 80px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 560, width: '100%' }}>

        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.75rem', fontWeight: 800,
          color: 'var(--text-primary)', marginBottom: 8,
          letterSpacing: '-0.03em',
        }}>
          Report a company
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 32 }}>
          Help protect the community. Your identity stays anonymous.
        </p>

        {/* Warning */}
        <div style={{
          background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: 28,
          display: 'flex', gap: 12,
        }}>
          <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <span style={{ fontWeight: 600, color: '#f59e0b', fontSize: '0.85rem' }}>
              You'll get a secret code after submitting
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>
              Save it — it's the only way to edit or delete your report later.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          <Field label="Company name" required>
            <input type="text" value={form.company_name} onChange={(e) => updateField('company_name', e.target.value)}
              placeholder="e.g. QuickHire Solutions Pvt Ltd" className="input-field" required />
          </Field>

          <Field label="Location / City">
            <input type="text" value={form.location} onChange={(e) => updateField('location', e.target.value)}
              placeholder="e.g. Bangalore, Remote, Pan-India" className="input-field" />
          </Field>

          <Field label="Platform" required>
            <input type="text" value={form.platform} onChange={(e) => updateField('platform', e.target.value)}
              placeholder="e.g. LinkedIn, Internshala, WhatsApp" className="input-field" required />
          </Field>

          <Field label="Severity">
            <select value={form.risk_level} onChange={(e) => updateField('risk_level', e.target.value)}
              className="input-field" style={{ cursor: 'pointer' }}>
              <option value="high">High — Charged money / stole data</option>
              <option value="suspicious">Suspicious — Unpaid work / fake offer</option>
              <option value="low">Low — Poor communication / other</option>
            </select>
          </Field>

          <Field label="Categories">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map(cat => {
                const active = form.flags.includes(cat.id);
                return (
                  <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '7px 12px', fontSize: '0.825rem',
                      background: active ? 'var(--brand-light)' : 'var(--bg-muted)',
                      border: `1px solid ${active ? 'var(--brand)' : 'var(--border-strong)'}`,
                      color: active ? 'var(--brand)' : 'var(--text-secondary)',
                      borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
                      fontWeight: active ? 600 : 500,
                    }}>
                    <span>{cat.icon}</span> {cat.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="What happened?" required>
            <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe amounts demanded, what was promised, contact details..."
              className="input-field" rows={5} style={{ resize: 'vertical' }} required />
          </Field>

          <Field label="Evidence link" sublabel="optional">
            <input type="text" value={form.proof_link} onChange={(e) => updateField('proof_link', e.target.value)}
              placeholder="https://..." className="input-field" />
          </Field>

          <button type="submit" disabled={submitting || !form.company_name} className="btn-primary"
            style={{ width: '100%', height: 48, fontSize: '0.95rem', marginTop: 8 }}>
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <><Shield size={16} /> Submit report</>}
          </button>

        </form>
      </div>
    </div>
  );
}

function Field({ label, sublabel, required, children }) {
  return (
    <div>
      <label style={{
        fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
        color: 'var(--text-muted)', textTransform: 'uppercase',
        display: 'block', marginBottom: 8,
      }}>
        {label} {required && <span style={{ color: 'var(--risk-high)' }}>*</span>}
        {sublabel && <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', marginLeft: 6 }}>({sublabel})</span>}
      </label>
      {children}
    </div>
  );
}
