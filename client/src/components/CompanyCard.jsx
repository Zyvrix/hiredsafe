import { useState } from 'react';
import { ExternalLink, MapPin, MessageCircle, Share2, ChevronUp } from 'lucide-react';
import { upvoteReport } from '../services/api';

const RISK_STYLES = {
  high: { bg: '#fee2e2', color: '#b91c1c', label: 'HIGH RISK' },
  suspicious: { bg: '#fef3c7', color: '#b45309', label: 'SUSPICIOUS' },
  low: { bg: '#d1fae5', color: '#047857', label: 'UNCONFIRMED' }
};

export default function CompanyCard({ report }) {
  const [upvotes, setUpvotes] = useState(report.upvotes || 0);
  const [upvoted, setUpvoted] = useState(false);

  const handleUpvote = async () => {
    if (upvoted) return;
    try {
      setUpvoted(true);
      setUpvotes(p => p + 1);
      await upvoteReport(report.id);
    } catch (err) {
      setUpvoted(false);
      setUpvotes(p => p - 1);
      console.error(err);
    }
  };

  const risk = RISK_STYLES[report.risk_level] || RISK_STYLES.low;

  // Formatting date logic
  const dateStr = report.created_at ? new Date(report.created_at).toLocaleDateString() : 'recently';

  return (
    <div className="card" style={{ padding: '20px', display: 'flex', gap: 16 }}>
      
      {/* Upvote Column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <button 
          onClick={handleUpvote}
          style={{ 
            width: 36, height: 36, 
            borderRadius: 8, 
            border: `1px solid ${upvoted ? 'var(--brand)' : 'var(--border)'}`, 
            background: upvoted ? 'var(--brand-light)' : 'var(--bg-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: upvoted ? 'default' : 'pointer',
            transition: 'all 0.15s',
            color: upvoted ? 'var(--brand)' : 'var(--text-secondary)'
          }}
        >
          <ChevronUp size={20} strokeWidth={upvoted ? 3 : 2} />
        </button>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {upvotes}
        </span>
      </div>

      {/* Content Column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {report.company_name}
          </h3>
          <span style={{ 
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em',
            padding: '2px 6px', borderRadius: 4,
            background: risk.bg, color: risk.color, border: `1px solid ${risk.color}30`
          }}>
            {risk.label}
          </span>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
          {report.description || 'No description provided.'}
        </p>

        {/* Meta Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          {report.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <MapPin size={12} color="#f43f5e" />
              {report.location}
            </div>
          )}
          
          {report.proof_link && (
            <a 
              href={report.proof_link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}
            >
              <ExternalLink size={12} />
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 200 }}>
                {report.proof_link.replace(/^https?:\/\//, '')}
              </span>
            </a>
          )}

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {dateStr}
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <MessageCircle size={14} />
            {report.report_count > 1 ? `${report.report_count} reports` : '1 report'}
          </div>
          
          <button style={{ 
            display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', 
            color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' 
          }}>
            <Share2 size={14} />
            Share
          </button>
        </div>

      </div>
    </div>
  );
}
