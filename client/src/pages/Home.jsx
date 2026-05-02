import { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, TrendingUp, AlertTriangle, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import CompanyCard from '../components/CompanyCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { getReports } from '../services/api';

export default function Home() {
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filters, setFilters]   = useState({ risk: 'all', platform: 'all', sort: 'newest' });
  const [stats, setStats]       = useState({ total: 0, high: 0, suspicious: 0 });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filters.risk !== 'all') params.risk = filters.risk;
      if (filters.platform !== 'all') params.platform = filters.platform;
      if (filters.sort !== 'newest') params.sort = filters.sort;
      const result = await getReports(params);
      setReports(result.data || []);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    getReports().then((result) => {
      const all = result.data || [];
      setStats({
        total:      all.length,
        high:       all.filter((r) => r.risk_level === 'high').length,
        suspicious: all.filter((r) => r.risk_level === 'suspicious').length,
      });
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchReports, 300);
    return () => clearTimeout(t);
  }, [fetchReports]);

  const trendingScams = reports
    .filter((r) => r.risk_level === 'high')
    .sort((a, b) => b.report_count - a.report_count)
    .slice(0, 3);

  const showTrending = trendingScams.length > 0 && !search && filters.risk === 'all';

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ─── Hero ─── */}
      <section
        style={{
          background: 'linear-gradient(180deg, rgba(99,102,241,0.07) 0%, var(--bg-base) 100%)',
          borderBottom: '1px solid var(--border)',
          padding: '56px 24px 48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>

          {/* Eyebrow */}
          <div
            className="animate-fade-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 99,
              background: 'var(--brand-light)',
              border: '1px solid rgba(79,110,247,0.2)',
              marginBottom: 24,
            }}
          >
            <ShieldAlert size={13} color="var(--brand)" strokeWidth={2.5} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand)', letterSpacing: '0.01em' }}>
              Protecting interns &amp; job seekers
            </span>
          </div>

          {/* Heading */}
          <h1
            className="animate-fade-up"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: 16,
              animationDelay: '60ms',
            }}
          >
            Verify Before<br />You Apply
          </h1>

          {/* Sub */}
          <p
            className="animate-fade-up"
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              maxWidth: 480,
              margin: '0 auto 32px',
              lineHeight: 1.65,
              animationDelay: '120ms',
            }}
          >
            Search companies, check risk scores, and report suspicious
            internship postings. Don't become a victim of fake offers.
          </p>

          {/* Search */}
          <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32, animationDelay: '160ms' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search company name..." />
          </div>

          {/* Stats */}
          <div
            className="animate-fade-up"
            style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', animationDelay: '200ms' }}
          >
            <StatPill icon={<AlertTriangle size={13} />} label="Companies Flagged" value={stats.total}      color="var(--brand)"          />
            <StatPill icon={<TrendingUp   size={13} />} label="High Risk"          value={stats.high}        color="var(--risk-high)"      />
            <StatPill icon={<Users        size={13} />} label="Suspicious"         value={stats.suspicious}  color="var(--risk-suspicious)" />
          </div>
        </div>
      </section>

      {/* ─── Content ─── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px 80px' }}>

        {/* Trending Scams */}
        {showTrending && (
          <div className="animate-fade-up" style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingUp size={15} color="var(--risk-high)" />
              <span className="section-heading" style={{ color: 'var(--risk-high)' }}>Trending Scams</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {trendingScams.map((report) => (
                <CompanyCard
                  key={`t-${report.id}`}
                  report={report}
                  style={{ borderColor: 'var(--risk-high-border)', background: 'var(--risk-high-bg)' }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <FilterBar filters={filters} onFilterChange={setFilters} />
          {!loading && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {reports.length} {reports.length === 1 ? 'result' : 'results'}
              {search && <> for "<strong style={{ color: 'var(--text-secondary)' }}>{search}</strong>"</>}
            </span>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : reports.length === 0 ? (
          <EmptyState searchActive={!!search || filters.risk !== 'all' || filters.platform !== 'all'} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {reports.map((report, i) => (
              <div
                key={report.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <CompanyCard report={report} />
              </div>
            ))}
          </div>
        )}

        {/* CTA Banner */}
        {!loading && reports.length > 0 && (
          <div
            className="animate-fade-up"
            style={{
              marginTop: 48,
              padding: '28px 32px',
              background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-muted) 100%)',
              border: '1px solid rgba(99,102,241,0.22)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              boxShadow: 'var(--shadow-md), 0 0 40px rgba(99,102,241,0.1)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div>
              <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.02em' }}>
                Know about a scam?
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Help the community by reporting a suspicious company.
              </p>
            </div>
            <Link to="/report" className="btn-primary" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Report a Scam <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function StatPill({ icon, label, value, color }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 16px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 99,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <span style={{ color, display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}
