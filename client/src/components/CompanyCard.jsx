import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronUp, Clock, ExternalLink, Share2, MessageCircle, Tag } from 'lucide-react';
import { upvoteReport, addComment } from '../services/api';
import { useToast } from './Toast';
import { motion } from 'framer-motion';

const RISK_CONFIG = {
  high: {
    bg: 'var(--risk-high-bg)',
    color: 'var(--risk-high)',
    border: 'var(--risk-high-border)',
    label: 'High Risk',
  },
  suspicious: {
    bg: 'var(--risk-suspicious-bg)',
    color: 'var(--risk-suspicious)',
    border: 'var(--risk-suspicious-border)',
    label: 'Suspicious',
  },
  low: {
    bg: 'var(--risk-safe-bg)',
    color: 'var(--risk-safe)',
    border: 'var(--risk-safe-border)',
    label: 'Safe',
  },
};

const FLAG_LABELS = {
  fake_offer_letter: 'Fake Offer',
  upfront_payment: 'Upfront Payment',
  data_theft: 'Data Theft',
  no_pay_ghosted: 'Ghosting',
  training_fee_scam: 'Training Scam',
  phishing_malware: 'Phishing',
  fake_company: 'Fake Company',
  other: 'Other',
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function CompanyCard({ report, index = 0 }) {
  const [upvotes, setUpvotes] = useState(report.upvotes || 0);
  const [upvoted, setUpvoted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(report.comments || []);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const { addToast } = useToast();

  const handleUpvote = async () => {
    if (upvoted) return;
    setUpvoted(true);
    setUpvotes(p => p + 1);
    try {
      await upvoteReport(report.id);
    } catch (err) {
      setUpvoted(false);
      setUpvotes(p => p - 1);
      const errMsg = err.response?.data?.error || err.message;
      addToast({ type: 'error', title: 'Failed to upvote', message: `Error: ${errMsg}` });
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setPosting(true);
    try {
      const data = await addComment(report.id, commentText, "Anonymous");
      setComments(data.comments || []);
      setCommentText('');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || err.message;
      addToast({ type: 'error', title: 'Failed to post', message: `Error: ${errMsg}` });
    } finally {
      setPosting(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/company/${encodeURIComponent(report.company_name)}`;
    try {
      await navigator.clipboard.writeText(url);
      addToast({ type: 'success', title: 'Link copied', message: 'Share link copied to clipboard.' });
    } catch {
      addToast({ type: 'info', title: 'Share', message: url });
    }
  };

  const risk = RISK_CONFIG[report.risk_level] || RISK_CONFIG.low;
  const flags = report.flags || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="card card-interactive" style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', gap: 16 }}>

          {/* Upvote column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, paddingTop: 2 }}>
            <button
              onClick={handleUpvote}
              aria-label="Upvote report"
              style={{
                width: 40, height: 40, borderRadius: 'var(--radius-md)',
                border: `1px solid ${upvoted ? 'var(--primary-border)' : 'var(--border)'}`,
                background: upvoted ? 'var(--primary-light)' : 'var(--bg-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: upvoted ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                color: upvoted ? 'var(--primary)' : 'var(--text-muted)',
              }}
            >
              <ChevronUp size={18} strokeWidth={upvoted ? 2.5 : 2} />
            </button>
            <span style={{
              fontSize: '0.75rem', fontWeight: 700,
              color: upvoted ? 'var(--primary)' : 'var(--text-muted)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {upvotes}
            </span>
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Title row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <Link
                to={`/company/${encodeURIComponent(report.company_name)}`}
                style={{
                  fontSize: '0.9375rem', fontWeight: 700,
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              >
                {report.company_name}
              </Link>
              <span
                className="badge"
                style={{
                  background: risk.bg,
                  color: risk.color,
                  borderColor: risk.border,
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: risk.color, flexShrink: 0,
                }} />
                {risk.label}
              </span>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6,
              margin: '0 0 10px 0',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {report.description || 'No description provided.'}
            </p>

            {/* Category tags */}
            {flags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                {flags.slice(0, 4).map(flag => (
                  <span key={flag} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-muted)', border: '1px solid var(--border)',
                    fontSize: '0.6875rem', fontWeight: 500, color: 'var(--text-secondary)',
                  }}>
                    <Tag size={9} />
                    {FLAG_LABELS[flag] || flag}
                  </span>
                ))}
                {flags.length > 4 && (
                  <span style={{
                    padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-muted)', border: '1px solid var(--border)',
                    fontSize: '0.6875rem', fontWeight: 500, color: 'var(--text-muted)',
                  }}>
                    +{flags.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {report.platform && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)',
                  padding: '2px 7px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                }}>
                  {report.platform}
                </span>
              )}
              {report.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <MapPin size={11} /> {report.location}
                </span>
              )}
              {report.proof_link && (
                <a href={report.proof_link} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}
                >
                  <ExternalLink size={11} />
                  <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Evidence
                  </span>
                </a>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Clock size={11} /> {timeAgo(report.created_at)}
              </span>

            </div>

            {/* Actions Row */}
            <div className="divider" style={{ margin: '16px 0 12px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => setShowComments(!showComments)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 6, 
                  background: 'none', border: 'none', 
                  color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 500,
                  cursor: 'pointer', transition: 'color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <MessageCircle size={14} /> 
                {comments.length} comment{comments.length !== 1 ? 's' : ''}
              </button>
              
              <button
                onClick={handleShare}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 500,
                  cursor: 'pointer', transition: 'color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <Share2 size={14} /> Share
              </button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div style={{ marginTop: 16, background: 'var(--bg-surface)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                {comments.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                    {comments.map((c) => (
                      <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                          {c.author.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{c.author}</span>
                            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{timeAgo(c.created_at)}</span>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', margin: '4px 0 0', lineHeight: 1.5 }}>
                            {c.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 16 }}>No comments yet. Be the first to share your thoughts.</p>
                )}
                
                <form onSubmit={handlePostComment} style={{ display: 'flex', gap: 8 }}>
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    className="input-field" 
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', fontSize: '0.875rem', borderRadius: 'var(--radius-md)', height: 40 }}
                    disabled={posting}
                  />
                  <button type="submit" disabled={posting || !commentText.trim()} className="btn-secondary" style={{ padding: '0 16px', height: 40 }}>
                    {posting ? '...' : 'Post'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
