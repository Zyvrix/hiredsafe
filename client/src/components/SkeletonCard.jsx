export default function SkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 22px',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        gap: 16,
      }}
    >
      {/* Upvote area skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)' }} />
        <div className="skeleton" style={{ width: 16, height: 12 }} />
      </div>

      <div style={{ flex: 1 }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1 }}>
            <div className="skeleton" style={{ height: 18, width: 140, borderRadius: 4 }} />
            <div className="skeleton" style={{ height: 16, width: 60, borderRadius: 99 }} />
          </div>
        </div>

        {/* Description lines */}
        <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: '80%', marginBottom: 16 }} />

        {/* Flags */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          <div className="skeleton" style={{ height: 18, width: 80, borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 18, width: 60, borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 18, width: 90, borderRadius: 4 }} />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 14 }}>
          <div className="skeleton" style={{ height: 14, width: 70 }} />
          <div className="skeleton" style={{ height: 14, width: 90 }} />
          <div className="skeleton" style={{ height: 14, width: 60 }} />
        </div>
      </div>
    </div>
  );
}
