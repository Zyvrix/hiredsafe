import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle, CheckCircle, Copy, Shield, UploadCloud } from 'lucide-react';
import { createReport } from '../services/api';
import { useToast } from '../components/Toast';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'fake_offer_letter', label: 'Fake offer letter' },
  { id: 'upfront_payment', label: 'Upfront payment' },
  { id: 'data_theft', label: 'Data theft' },
  { id: 'no_pay_ghosted', label: 'No pay / ghosted' },
  { id: 'training_fee_scam', label: 'Training fee scam' },
  { id: 'phishing_malware', label: 'Phishing / malware' },
  { id: 'fake_company', label: 'Fake company' },
  { id: 'other', label: 'Other' }
];

const PLATFORMS = [
  'LinkedIn', 'Internshala', 'Naukri', 'Indeed', 'WhatsApp', 'Telegram', 'Direct Email', 'Other'
];

export default function ReportForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    company_name: '', location: '', platform: 'LinkedIn',
    risk_level: 'high', description: '', proof_link: '', flags: [],
    anonymous: true
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
    if (form.flags.length === 0) {
      addToast({ type: 'error', title: 'Category required', message: 'Please select at least one category tag.' });
      return;
    }
    setSubmitting(true);
    try {
      const { secret_code } = await createReport(form, true);
      setSecretCode(secret_code);
      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Submit error:', err);
      addToast({ type: 'error', title: 'Submission failed', message: 'Failed to submit report. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(secretCode);
    addToast({ type: 'success', title: 'Copied', message: 'Secret code copied to clipboard!' });
  };

  if (success) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ textAlign: 'center', padding: '48px 40px', maxWidth: 460, width: '100%' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--risk-safe-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <CheckCircle size={28} color="var(--risk-safe)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Report Submitted
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: 32 }}>
            Your report is now live. Thank you for helping protect the community.
          </p>

          {/* Secret code */}
          <div style={{
            background: 'var(--bg-muted)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: 20, marginBottom: 32, textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--risk-suspicious)', fontWeight: 600, fontSize: '0.8125rem', marginBottom: 8 }}>
              <AlertTriangle size={15} /> Save this code
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
              This is the only way to edit or delete your report later. We cannot recover it if lost.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
                padding: '10px 16px', borderRadius: 'var(--radius-sm)',
                fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)',
                letterSpacing: '2px', textAlign: 'center', fontFamily: 'monospace',
              }}>
                {secretCode}
              </div>
              <button onClick={copyCode} className="btn-secondary" style={{ padding: '0 16px' }}>
                <Copy size={16} />
              </button>
            </div>
          </div>

          <button onClick={() => navigate('/')} className="btn-primary" style={{ width: '100%', height: 44 }}>
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '48px 24px 80px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 640, width: '100%' }}>
        
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.03em' }}>
            Report a Scam
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Submit details about fraudulent companies. Your identity remains completely anonymous.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Company Name" required>
                <input type="text" value={form.company_name} onChange={(e) => updateField('company_name', e.target.value)}
                  placeholder="e.g. Acme Corp" className="input-field" required />
              </Field>
            </div>
            
            <div style={{ gridColumn: '1 / -1', '@media (min-width: 640px)': { gridColumn: 'span 1' } }}>
              <Field label="Platform Source" required>
                <select value={form.platform} onChange={(e) => updateField('platform', e.target.value)} className="input-field">
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
            </div>

            <div style={{ gridColumn: '1 / -1', '@media (min-width: 640px)': { gridColumn: 'span 1' } }}>
              <Field label="Location" sublabel="City or Remote">
                <input type="text" value={form.location} onChange={(e) => updateField('location', e.target.value)}
                  placeholder="e.g. Bangalore" className="input-field" />
              </Field>
            </div>
          </div>

          <div className="divider" />

          <Field label="Risk Level" required>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { id: 'low', label: 'Safe', desc: 'Legit but poor communication' },
                { id: 'suspicious', label: 'Suspicious', desc: 'Unpaid test tasks, ghosting' },
                { id: 'high', label: 'High Risk', desc: 'Asked for money, data theft' }
              ].map(level => (
                <button
                  key={level.id} type="button"
                  onClick={() => updateField('risk_level', level.id)}
                  style={{
                    padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'left',
                    border: `1px solid ${form.risk_level === level.id ? 'var(--primary)' : 'var(--border)'}`,
                    background: form.risk_level === level.id ? 'var(--primary-light)' : 'var(--bg-surface)',
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{level.label}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{level.desc}</div>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Categories" sublabel="Select all that apply" required>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map(cat => {
                const active = form.flags.includes(cat.id);
                return (
                  <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                    style={{
                      padding: '6px 12px', fontSize: '0.8125rem',
                      background: active ? 'var(--text-primary)' : 'var(--bg-muted)',
                      border: '1px solid transparent',
                      color: active ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      borderRadius: 'var(--radius-full)', cursor: 'pointer', transition: 'all 0.15s',
                      fontWeight: 500,
                    }}>
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="divider" />

          <Field label="Detailed Description" required>
            <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)}
              placeholder="Provide specific details: names used, email addresses, amounts requested, timeline of events..."
              className="input-field" rows={5} required />
          </Field>

          <Field label="Evidence Link" sublabel="Drive link, screenshot URL, etc.">
            <div style={{ position: 'relative' }}>
              <input type="url" value={form.proof_link} onChange={(e) => updateField('proof_link', e.target.value)}
                placeholder="https://" className="input-field" style={{ paddingLeft: 40 }} />
              <UploadCloud size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </Field>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 8 }}>
            <input 
              type="checkbox" 
              checked={form.anonymous} 
              onChange={(e) => updateField('anonymous', e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
            />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Post this report anonymously
            </span>
          </label>

          <div style={{ marginTop: 8 }}>
            <button type="submit" disabled={submitting || !form.company_name} className="btn-primary"
              style={{ width: '100%', height: 48, fontSize: '1rem' }}>
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <><Shield size={16} /> Submit Report</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

function Field({ label, sublabel, required, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {label} {required && <span style={{ color: 'var(--risk-high)' }}>*</span>}
        </label>
        {sublabel && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sublabel}</span>}
      </div>
      {children}
    </div>
  );
}
