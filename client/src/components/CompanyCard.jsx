import RiskBadge from './RiskBadge';
import { ExternalLink, Users } from 'lucide-react';

const FLAG_LABELS = {
  asked_for_money:  'Asked for Money',
  fake_offer_letter: 'Fake Offer Letter',
  no_interview:     'No Interview',
  unpaid_work:      'Unpaid Work',
  data_theft:       'Data Theft',
};

export default function CompanyCard({ report, style }) {
  const {
    company_name,
    platform,
    description,
    risk_score,
    risk_level,
    flags,
    report_count,
    proof_link,
  } = report;

  return (
    <div
      className="card"
      style={{ padding: '20px 22px', cursor: 'default', ...style }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: 5,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {company_name}
          </h3>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              background: 'var(--bg-muted)',
              padding: '2px 8px',
              borderRadius: 4,
              border: '1px solid var(--border)',
            }}
          >
            {platform}
          </span>
        </div>
        <RiskBadge level={risk_level} score={risk_score} />
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: 14,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {description || 'No description provided.'}
      </p>

      {/* Flags */}
      {(flags || []).length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {(flags || []).map((flag) => (
            <span
              key={flag}
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--brand)',
                background: 'var(--brand-light)',
                border: '1px solid rgba(79,110,247,0.18)',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              {FLAG_LABELS[flag] || flag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: '1px solid var(--border)',
        }}
      >
        <div>
          {report_count > 1 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--risk-suspicious)',
              }}
            >
              <Users size={12} />
              {report_count} reports
            </span>
          )}
        </div>
        {proof_link && (
          <a
            href={proof_link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--brand)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            <ExternalLink size={12} />
            View Proof
          </a>
        )}
      </div>
    </div>
  );
}
