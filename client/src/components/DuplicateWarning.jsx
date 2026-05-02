import { AlertTriangle, X } from 'lucide-react';

export default function DuplicateWarning({ existing, onForce, onCancel }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'rgba(15,17,23,0.4)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div
        className="animate-scale-pop"
        style={{
          position: 'relative',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px 28px',
          width: '100%',
          maxWidth: 420,
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Close */}
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'var(--bg-muted)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: 4,
            cursor: 'pointer',
            display: 'flex',
            color: 'var(--text-muted)',
          }}
        >
          <X size={15} />
        </button>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'var(--risk-suspicious-bg)',
              border: '1px solid var(--risk-suspicious-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={24} color="var(--risk-suspicious)" />
          </div>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 800, textAlign: 'center', color: 'var(--text-primary)', marginBottom: 10, letterSpacing: '-0.02em' }}>
          Company Already Reported
        </h3>

        <p style={{ fontSize: '0.8125rem', textAlign: 'center', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
          <strong style={{ color: 'var(--text-primary)' }}>{existing.company_name}</strong>{' '}
          already has a risk score of{' '}
          <strong style={{ color: 'var(--risk-suspicious)' }}>{existing.risk_score}/100</strong>.
        </p>

        <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
          Submitting again will increase the risk score and merge your flags into the existing report.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            className="btn-ghost"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Cancel
          </button>
          <button
            onClick={onForce}
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Submit Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
