import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  CheckCircle2,
  Info,
  ExternalLink,
  Zap,
  Clock,
} from 'lucide-react';

/* ─── Skeleton loader for the research panel ─── */
export function AIResearchSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
      style={{
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}
    >
      {/* Animated sparkle icon */}
      <motion.div
        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'linear-gradient(135deg, var(--primary-light), rgba(249, 115, 22, 0.15))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Sparkles size={24} color="var(--primary)" />
      </motion.div>

      <div style={{ textAlign: 'center' }}>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}
        >
          AI is researching this company…
        </h3>
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}
        >
          Analyzing online presence, reviews, and scam reports.
        </p>
      </div>

      {/* Skeleton bars */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[100, 85, 92, 70].map((w, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
            style={{
              height: 14,
              width: `${w}%`,
              borderRadius: 6,
              background: 'var(--bg-muted)',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Risk config ─── */
const riskConfig = {
  safe: {
    icon: ShieldCheck,
    label: 'Likely Safe',
    color: 'var(--risk-safe)',
    bg: 'var(--risk-safe-bg)',
    border: 'var(--risk-safe-border)',
  },
  suspicious: {
    icon: ShieldAlert,
    label: 'Suspicious',
    color: 'var(--risk-suspicious)',
    bg: 'var(--risk-suspicious-bg)',
    border: 'var(--risk-suspicious-border)',
  },
  high: {
    icon: ShieldX,
    label: 'High Risk',
    color: 'var(--risk-high)',
    bg: 'var(--risk-high-bg)',
    border: 'var(--risk-high-border)',
  },
};

/* ─── Main panel ─── */
export default function AIResearchPanel({ data, onClose }) {
  if (!data) return null;

  const risk = riskConfig[data.risk_level] || riskConfig.suspicious;
  const RiskIcon = risk.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="card"
      style={{ overflow: 'hidden' }}
    >
      {/* ── Header gradient strip ── */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${risk.color}, var(--primary))`,
        }}
      />

      <div style={{ padding: '28px 28px 24px' }}>
        {/* ── Top row: badge + title ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: risk.bg,
                border: `1px solid ${risk.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <RiskIcon size={22} color={risk.color} />
            </motion.div>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 2,
                }}
              >
                <Sparkles size={14} color="var(--primary)" />
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  AI Research
                </span>
              </div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                {data.company_name}
              </h3>
            </div>
          </div>

          {/* Risk badge */}
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: risk.bg,
              border: `1px solid ${risk.border}`,
              fontSize: '0.75rem',
              fontWeight: 700,
              color: risk.color,
              whiteSpace: 'nowrap',
            }}
          >
            {risk.label}
          </div>
        </div>

        {/* ── Risk Score Bar ── */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              Risk Score
            </span>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: risk.color,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {data.risk_score}
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                /100
              </span>
            </span>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-muted)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.risk_score}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              style={{
                height: '100%',
                borderRadius: 'var(--radius-full)',
                background: `linear-gradient(90deg, ${risk.color}CC, ${risk.color})`,
              }}
            />
          </div>
        </div>

        {/* ── Summary ── */}
        <div
          style={{
            padding: 16,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-muted)',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 8,
            }}
          >
            <Info size={14} color="var(--text-secondary)" />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Summary
            </span>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {data.summary}
          </p>
        </div>

        {/* ── Red Flags + Positive Signals ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
            marginBottom: 20,
          }}
        >
          {/* Red flags */}
          {data.red_flags && data.red_flags.length > 0 && (
            <div
              style={{
                padding: 16,
                borderRadius: 'var(--radius-md)',
                background: 'var(--risk-high-bg)',
                border: `1px solid var(--risk-high-border)`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                <AlertTriangle size={14} color="var(--risk-high)" />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--risk-high)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Red Flags
                </span>
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {data.red_flags.map((flag, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.5,
                      paddingLeft: 16,
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 2,
                        color: 'var(--risk-high)',
                        fontSize: '0.75rem',
                      }}
                    >
                      •
                    </span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Positive signals */}
          {data.positive_signals && data.positive_signals.length > 0 && (
            <div
              style={{
                padding: 16,
                borderRadius: 'var(--radius-md)',
                background: 'var(--risk-safe-bg)',
                border: `1px solid var(--risk-safe-border)`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                <CheckCircle2 size={14} color="var(--risk-safe)" />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--risk-safe)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Positive Signals
                </span>
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {data.positive_signals.map((signal, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.5,
                      paddingLeft: 16,
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 2,
                        color: 'var(--risk-safe)',
                        fontSize: '0.75rem',
                      }}
                    >
                      ✓
                    </span>
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Recommendation ── */}
        <div
          style={{
            padding: 16,
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-light)',
            border: `1px solid var(--primary-border)`,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 8,
            }}
          >
            <Zap size={14} color="var(--primary)" />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Recommendation
            </span>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              margin: 0,
              fontWeight: 500,
            }}
          >
            {data.recommendation}
          </p>
        </div>

        {/* ── Sources ── */}
        {data.sources && data.sources.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Sources Consulted
            </span>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginTop: 8,
              }}
            >
              {data.sources.map((src, i) => {
                const searchQuery = encodeURIComponent(`${data.company_name} ${src}`);
                const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
                return (
                  <a
                    key={i}
                    href={searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-muted)',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--primary-light)';
                      e.currentTarget.style.color = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-muted)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <ExternalLink size={10} />
                    {src}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Footer disclaimer ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
            }}
          >
            <Sparkles size={12} />
            Powered by AI · Results may not be 100% accurate
          </div>

          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-muted)',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--bg-muted)';
              }}
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
