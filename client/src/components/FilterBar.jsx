const RISK_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High Risk' },
  { value: 'suspicious', label: 'Suspicious' },
  { value: 'low', label: 'Low Risk' },
];

const PLATFORM_FILTERS = [
  { value: 'all', label: 'All Platforms' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Internshala', label: 'Internshala' },
  { value: 'Naukri', label: 'Naukri' },
  { value: 'Indeed', label: 'Indeed' },
  { value: 'Other', label: 'Other' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'highest_risk', label: 'Highest Risk' },
  { value: 'most_reported', label: 'Most Reported' },
];

const riskColor = {
  all: { color: 'var(--text-secondary)', bg: 'var(--bg-muted)', border: 'var(--border)' },
  high: { color: 'var(--risk-high)', bg: 'var(--risk-high-bg)', border: 'var(--risk-high-border)' },
  suspicious: { color: 'var(--risk-suspicious)', bg: 'var(--risk-suspicious-bg)', border: 'var(--risk-suspicious-border)' },
  low: { color: 'var(--risk-low)', bg: 'var(--risk-low-bg)', border: 'var(--risk-low-border)' },
};

export default function FilterBar({ filters, onFilterChange }) {
  const { risk, platform, sort } = filters;

  return (
    <div
      id="filter-bar"
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}
    >
      {/* Risk Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {RISK_FILTERS.map((f) => {
          const active = risk === f.value;
          const c = riskColor[f.value];
          return (
            <button
              key={f.value}
              onClick={() => onFilterChange({ ...filters, risk: f.value })}
              style={{
                padding: '5px 13px',
                fontSize: '0.8rem',
                fontWeight: active ? 700 : 500,
                border: `1.5px solid ${active ? c.border : 'var(--border)'}`,
                borderRadius: 99,
                background: active ? c.bg : 'var(--bg-surface)',
                color: active ? c.color : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                lineHeight: 1,
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'var(--bg-muted)';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'var(--bg-surface)';
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

      {/* Platform Select */}
      <select
        id="filter-platform"
        value={platform}
        onChange={(e) => onFilterChange({ ...filters, platform: e.target.value })}
        style={{
          padding: '5px 12px',
          fontSize: '0.8rem',
          fontWeight: 500,
          border: '1.5px solid var(--border)',
          borderRadius: 8,
          background: 'var(--bg-surface)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          outline: 'none',
          fontFamily: 'inherit',
        }}
      >
        {PLATFORM_FILTERS.map((f) => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>

      {/* Sort Select */}
      <select
        id="filter-sort"
        value={sort}
        onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
        style={{
          padding: '5px 12px',
          fontSize: '0.8rem',
          fontWeight: 500,
          border: '1.5px solid var(--border)',
          borderRadius: 8,
          background: 'var(--bg-surface)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          outline: 'none',
          fontFamily: 'inherit',
        }}
      >
        {SORT_OPTIONS.map((f) => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>
    </div>
  );
}
