export default function SkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 22px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ flex: 1, paddingRight: 12 }}>
          <div className="skeleton" style={{ height: 16, width: '65%', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 12, width: 70 }} />
        </div>
        <div className="skeleton" style={{ height: 22, width: 72, borderRadius: 99 }} />
      </div>

      {/* Description lines */}
      <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: '80%', marginBottom: 16 }} />

      {/* Flags */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        <div className="skeleton" style={{ height: 20, width: 90, borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 20, width: 72, borderRadius: 4 }} />
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <div className="skeleton" style={{ height: 12, width: 60 }} />
        <div className="skeleton" style={{ height: 12, width: 72 }} />
      </div>
    </div>
  );
}
