import { useState } from 'react';
import { MapPin, ChevronUp, Clock, ExternalLink } from 'lucide-react';
import { upvoteReport } from '../services/api';

const RISK_STYLES = {
  high: { bg: 'rgba(244,63,94,0.12)', color: '#f43f5e', label: 'HIGH RISK' },
  suspicious: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'SUSPICIOUS' },
  low: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'LOW RISK' }
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function CompanyCard({ report }) {
  const [upvotes, setUpvotes] = useState(report.upvotes || 0);
  const [upvoted, setUpvoted] = useState(false);

  const handleUpvote = async () => {
    if (upvoted) return;
    setUpvoted(true);
    setUpvotes(p => p + 1);
    try {
      await upvoteReport(report.id);
    } catch {
      setUpvoted(false);
      setUpvotes(p => p - 1);
    }
  };

  const risk = RISK_STYLES[report.risk_level] || RISK_STYLES.low;

  return (
    <div className="card" style={{ padding: '18px 20px', display: 'flex', gap: 14 }}>

      {/* Upvote */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingTop: 2 }}>
        <button
          onClick={handleUpvote}
          style={{
            width: 38, height: 38, borderRadius: 8,
            border: `1px solid ${upvoted ? 'var(--brand)' : 'var(--border-strong)'}`,
            background: upvoted ? 'var(--brand-light)' : 'var(--bg-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: upvoted ? 'default' : 'pointer',
            transition: 'all 0.15s',
            color: upvoted ? 'var(--brand)' : 'var(--text-muted)',
          }}
        >
          <ChevronUp size={18} strokeWidth={upvoted ? 3 : 2} />
        </button>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: upvoted ? 'var(--brand)' : 'var(--text-muted)' }}>
          {upvotes}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Title + Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {report.company_name}
          </h3>
          <span style={{
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em',
            padding: '2px 7px', borderRadius: 4,
            background: risk.bg, color: risk.color,
          }}>
            {risk.label}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55,
          margin: '0 0 12px 0',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {report.description || 'No description provided.'}
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {report.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <MapPin size={11} /> {report.location}
            </span>
          )}
          {report.proof_link && (
            <a href={report.proof_link} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
              <ExternalLink size={11} />
              <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {report.proof_link.replace(/^https?:\/\//, '')}
              </span>
            </a>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Clock size={11} /> {timeAgo(report.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
