import { useState, useEffect } from 'react';
import { Search, Heart, ArrowUpRight, Shield, BarChart3, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import CompanyCard from '../components/CompanyCard';
import { getReports } from '../services/api';

export default function Home() {
  const [reports, setReports] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ risk: 'all', sort: 'newest' });
  const [stats, setStats] = useState({ totalReports: 0, totalCompanies: 0, totalUpvotes: 0 });

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
    if (filters.risk !== 'all') filtered = filtered.filter(r => r.risk_level === filters.risk);
    if (filters.sort === 'most_upvoted') filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    else if (filters.sort === 'highest_risk') filtered.sort((a, b) => b.risk_score - a.risk_score);
    else filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setReports(filtered);
  }, [search, filters, allData]);

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ─── Hero ─── */}
      <section style={{
        padding: '80px 24px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative' }}>

          {/* Live indicator */}
          <div className="animate-fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 99,
            background: 'var(--bg-muted)', border: '1px solid var(--border-strong)',
            marginBottom: 32,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', animation: 'pulse-glow 2s infinite' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
              {stats.totalReports} reports tracked live
            </span>
          </div>

          <h1 className="animate-fade-up" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.045em',
            lineHeight: 1.05,
            color: 'var(--text-primary)',
            marginBottom: 20,
            animationDelay: '80ms',
          }}>
            Don't fall for it.
          </h1>

          <p className="animate-fade-up" style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            maxWidth: 500,
            margin: '0 auto 40px',
            animationDelay: '140ms',
          }}>
            Every fake internship you report saves hundreds of students 
            from getting scammed. Search. Report. Protect each other.
          </p>

          <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'center', gap: 12, animationDelay: '200ms' }}>
            <Link to="/report" className="btn-primary" style={{ padding: '13px 32px', fontSize: '0.95rem', textDecoration: 'none' }}>
              <Shield size={16} /> Report a scam
            </Link>
            <button
              onClick={() => document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-ghost"
              style={{ padding: '13px 28px', fontSize: '0.95rem' }}
            >
              Browse reports <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 48px' }}>
        <div className="animate-fade-up" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
          animationDelay: '260ms',
        }}>
          {[
            { icon: <BarChart3 size={18} />, value: stats.totalReports, label: 'Reports Filed', color: 'var(--brand)' },
            { icon: <Shield size={18} />, value: stats.totalCompanies, label: 'Companies Flagged', color: '#f59e0b' },
            { icon: <Users size={18} />, value: stats.totalUpvotes, label: 'Community Upvotes', color: 'var(--accent)' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '20px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: `${s.color}15`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: s.color,
                }}>
                  {s.icon}
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginTop: 6 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Feed ─── */}
      <section id="feed" style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, city, or keyword..."
            className="input-field"
            style={{ paddingLeft: 40, height: 46, fontSize: '0.9rem' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All', dot: null },
            { key: 'high', label: 'High Risk', dot: '#f43f5e' },
            { key: 'suspicious', label: 'Suspicious', dot: '#f59e0b' },
            { key: 'low', label: 'Low Risk', dot: '#10b981' },
          ].map(f => {
            const active = filters.risk === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilters(p => ({ ...p, risk: f.key }))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600,
                  background: active ? 'var(--bg-elevated)' : 'transparent',
                  border: `1px solid ${active ? 'var(--border-strong)' : 'var(--border)'}`,
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {f.dot && <div style={{ width: 7, height: 7, borderRadius: '50%', background: f.dot }} />}
                {f.label}
              </button>
            );
          })}

          <div style={{ marginLeft: 'auto' }}>
            <select
              value={filters.sort}
              onChange={(e) => setFilters(p => ({ ...p, sort: e.target.value }))}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 500,
                background: 'var(--bg-muted)', border: '1px solid var(--border-strong)',
                color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="newest">Newest first</option>
              <option value="most_upvoted">Most upvoted</option>
              <option value="highest_risk">Highest risk</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Recent Reports
          </span>
          {!loading && (
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-muted)', padding: '3px 10px', borderRadius: 4, border: '1px solid var(--border)' }}>
              {reports.length} {reports.length === 1 ? 'report' : 'reports'}
            </span>
          )}
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card" style={{ padding: '20px 24px', display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8 }} />
                  <div className="skeleton" style={{ width: 14, height: 10 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <div className="skeleton" style={{ height: 15, width: '40%' }} />
                    <div className="skeleton" style={{ height: 15, width: 60, borderRadius: 4 }} />
                  </div>
                  <div className="skeleton" style={{ height: 11, width: '85%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 11, width: '55%' }} />
                </div>
              </div>
            ))
          ) : reports.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '72px 24px',
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🛡️</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                {search || filters.risk !== 'all' ? 'No matching reports found' : 'The coast is clear — for now'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
                {search || filters.risk !== 'all'
                  ? 'Try a different search term or adjust your filters.'
                  : 'No scams have been reported yet. If you know about one, be the first to speak up.'}
              </p>
              {!search && filters.risk === 'all' && (
                <Link to="/report" className="btn-primary" style={{ textDecoration: 'none' }}>
                  <Shield size={15} /> File the first report
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
