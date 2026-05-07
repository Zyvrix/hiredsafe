import { AlertTriangle, X } from 'lucide-react';

export default function DuplicateWarning({ existing, onForce, onCancel }) {
  return (
    <div className="modal-overlay">
      <div
        className="card animate-scale-pop"
        style={{
          position: 'relative',
          padding: '32px 28px',
          width: '100%',
          maxWidth: 420,
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <button
          onClick={onCancel}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'var(--bg-muted)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: 4, cursor: 'pointer',
            color: 'var(--text-muted)', display: 'flex',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'var(--risk-suspicious-bg)',
            border: '1px solid var(--risk-suspicious-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={28} color="var(--risk-suspicious)" />
          </div>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, textAlign: 'center', color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
          Company Already Reported
        </h3>

        <p style={{ fontSize: '0.9375rem', textAlign: 'center', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
          <strong style={{ color: 'var(--text-primary)' }}>{existing.company_name}</strong>{' '}
          already has a risk score of{' '}
          <strong style={{ color: 'var(--risk-suspicious)' }}>{existing.risk_score}/100</strong>.
        </p>

        <p style={{ fontSize: '0.8125rem', textAlign: 'center', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 28 }}>
          Submitting again will increase their risk score and merge your categories into the existing report.
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} className="btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
          <button onClick={onForce} className="btn-primary" style={{ flex: 1, background: 'var(--risk-suspicious)', color: '#fff' }}>
            Submit Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
