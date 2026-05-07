export default function RiskBadge({ level, score }) {
  const config = {
    low: {
      label: 'Safe',
      background: 'var(--risk-safe-bg)',
      color: 'var(--risk-safe)',
      borderColor: 'var(--risk-safe-border)',
    },
    suspicious: {
      label: 'Suspicious',
      background: 'var(--risk-suspicious-bg)',
      color: 'var(--risk-suspicious)',
      borderColor: 'var(--risk-suspicious-border)',
    },
    high: {
      label: 'High Risk',
      background: 'var(--risk-high-bg)',
      color: 'var(--risk-high)',
      borderColor: 'var(--risk-high-border)',
    },
  };

  const c = config[level] || config.low;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span
        className="badge"
        style={{
          background: c.background,
          color: c.color,
          borderColor: c.borderColor,
          padding: '4px 12px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          fontSize: '0.6875rem'
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: c.color,
            flexShrink: 0,
          }}
        />
        {c.label}
      </span>
      {score !== undefined && (
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: c.color,
            fontVariantNumeric: 'tabular-nums',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          {score}/100
        </span>
      )}
    </div>
  );
}
