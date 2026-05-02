export default function RiskBadge({ level, score }) {
  const config = {
    low: {
      label: 'Low Risk',
      background: 'var(--risk-low-bg)',
      color: 'var(--risk-low)',
      borderColor: 'var(--risk-low-border)',
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
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: c.color,
            animation: level === 'high' ? 'pulse-dot 2s ease-in-out infinite' : 'none',
            flexShrink: 0,
          }}
        />
        {c.label}
      </span>
      {score !== undefined && (
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: c.color,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {score}
        </span>
      )}
    </div>
  );
}
