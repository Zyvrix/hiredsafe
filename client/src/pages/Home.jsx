import { useState, useEffect, useCallback } from 'react';
import { Search, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CompanyCard from '../components/CompanyCard';
import { getReports } from '../services/api';

export default function Home() {
  const [reports, setReports]   = useState([]);
  const [allData, setAllData]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filters, setFilters]   = useState({ risk: 'all', sort: 'newest' });
  const [stats, setStats]       = useState({ totalReports: 0, totalCompanies: 0, totalUpvotes: 0 });

  // Single fetch on mount for stats + initial list
  useEffect(() => {
    getReports().then((result) => {
      const all = result.data || [];
      setAllData(all);
      setReports(all);
      const uniqueCompanies = new Set(all.map(r => r.company_name.toLowerCase())).size;
      const upvotes = all.reduce((sum, r) => sum + (r.upvotes || 0), 0);
      setStats({ totalReports: all.length, totalCompanies: uniqueCompanies, totalUpvotes: upvotes });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Client-side filtering (instant, no API delay)
  useEffect(() => {
    let filtered = [...allData];
    
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(r => 
        r.company_name.toLowerCase().includes(q) ||
        (r.location || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q)
      );
    }

    if (filters.risk !== 'all') {
      filtered = filtered.filter(r => r.risk_level === filters.risk);
    }

    if (filters.sort === 'most_upvoted') {
      filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else if (filters.sort === 'highest_risk') {
      filtered.sort((a, b) => b.risk_score - a.risk_score);
    } else {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setReports(filtered);
  }, [search, filters, allData]);

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ─── Hero Section ─── */}
      <section style={{ padding: '72px 24px 56px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>

          {/* Eyebrow badge */}
          <div
            className="animate-fade-up"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 99,
              background: '#f0ede8', border: '1px solid #ddd8cf',
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7a7062', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Community Verified Reports
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up"
            style={{
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              fontSize: 'clamp(2.25rem, 5.5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              color: '#1a1c2e',
              marginBottom: 20,
              animationDelay: '60ms',
            }}
          >
            Protect yourself from<br />fake internships
          </h1>

          {/* Subheading */}
          <p
            className="animate-fade-up"
            style={{
              fontSize: '1.05rem',
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: 6,
              animationDelay: '120ms',
            }}
          >
            Search before you apply. Report what you've experienced.
          </p>
          <p className="animate-fade-up" style={{ fontSize: '0.95rem', color: '#9ca3af', marginBottom: 36, animationDelay: '140ms' }}>
            For Students by Students. <Heart size={13} style={{ display: 'inline', verticalAlign: '-1px' }} color="#e85d3f" />
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 48, animationDelay: '180ms' }}>
            <Link to="/report" className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem', textDecoration: 'none', borderRadius: 8 }}>
              Report a company
            </Link>
            <button
              onClick={() => {
                document.getElementById('reports-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-ghost"
              style={{ padding: '12px 28px', fontSize: '0.95rem', borderRadius: 8 }}
            >
              Verify a company
            </button>
          </div>

        </div>
      </section>

      {/* ─── Main Content ─── */}
      <section id="reports-section" style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Stats Row */}
        <div
          className="animate-fade-up"
          style={{
            display: 'flex', marginBottom: 32,
            border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-surface)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            animationDelay: '220ms',
          }}
        >
          {[
            { val: stats.totalReports, label: 'REPORTS FILED' },
            { val: stats.totalCompanies, label: 'COMPANIES FLAGGED' },
            { val: stats.totalUpvotes, label: 'UPVOTES' },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                flex: 1, padding: '24px 28px',
                borderRight: i < 2 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', marginTop: 8, textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="animate-fade-up" style={{ position: 'relative', marginBottom: 20, animationDelay: '260ms' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, location, category..."
            className="input-field"
            style={{ paddingLeft: 42, height: 48, fontSize: '0.95rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}
          />
        </div>

        {/* Filters */}
        <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, flexWrap: 'wrap', animationDelay: '300ms' }}>
          {[
            { key: 'all', label: 'All', dot: null },
            { key: 'high', label: 'High risk', dot: '#ef4444' },
            { key: 'suspicious', label: 'Suspicious', dot: '#f59e0b' },
            { key: 'low', label: 'Unconfirmed', dot: '#10b981' },
          ].map(f => {
            const active = filters.risk === f.key;
            const isColored = f.key !== 'all' && active;
            const bgActive = f.key === 'high' ? '#e85d3f' : f.key === 'suspicious' ? '#f59e0b' : f.key === 'low' ? '#10b981' : '#fff';

            return (
              <button
                key={f.key}
                onClick={() => setFilters(p => ({ ...p, risk: f.key }))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 16px', borderRadius: 99, fontSize: '0.8125rem', fontWeight: 600,
                  background: isColored ? bgActive : (active ? '#fff' : 'transparent'),
                  border: `1px solid ${isColored ? bgActive : (active ? 'var(--border-strong)' : 'var(--border)')}`,
                  color: isColored ? '#fff' : 'var(--text-primary)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {f.dot && <div style={{ width: 8, height: 8, borderRadius: '50%', background: isColored ? '#fff' : f.dot }} />}
                {f.label}
              </button>
            );
          })}

          <div style={{ height: 24, width: 1, background: 'var(--border)' }} />

          <select
            value={filters.sort}
            onChange={(e) => setFilters(p => ({ ...p, sort: e.target.value }))}
            style={{
              padding: '7px 16px', borderRadius: 99, fontSize: '0.8125rem', fontWeight: 600,
              background: '#fff', border: '1px solid var(--border)',
              color: 'var(--text-primary)', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="newest">Latest</option>
            <option value="most_upvoted">↑ Most upvoted</option>
            <option value="highest_risk">Highest risk</option>
          </select>
        </div>

        {/* List Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
            Recent Reports
          </h2>
          <span style={{
            fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)',
            background: 'var(--bg-muted)', padding: '3px 10px', borderRadius: 4,
            border: '1px solid var(--border)',
          }}>
            {reports.length} reports
          </span>
        </div>

        {/* Report List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="card"
                style={{ padding: 24, display: 'flex', gap: 16 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8 }} />
                  <div className="skeleton" style={{ width: 16, height: 12 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <div className="skeleton" style={{ height: 16, width: '45%' }} />
                    <div className="skeleton" style={{ height: 16, width: 70, borderRadius: 4 }} />
                  </div>
                  <div className="skeleton" style={{ height: 12, width: '90%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 16 }} />
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div className="skeleton" style={{ height: 10, width: 80 }} />
                    <div className="skeleton" style={{ height: 10, width: 120 }} />
                  </div>
                </div>
              </div>
            ))
          ) : reports.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '64px 24px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔍</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                {search || filters.risk !== 'all' ? 'No matching reports' : 'No reports yet'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                {search || filters.risk !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Be the first to report a suspicious company.'}
              </p>
              {!search && filters.risk === 'all' && (
                <Link to="/report" className="btn-primary" style={{ textDecoration: 'none' }}>
                  Report a company <ArrowRight size={14} />
                </Link>
              )}
            </div>
          ) : (
            reports.map((report, i) => (
              <div key={report.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}>
                <CompanyCard report={report} />
              </div>
            ))
          )}
        </div>

      </section>
    </div>
  );
}
