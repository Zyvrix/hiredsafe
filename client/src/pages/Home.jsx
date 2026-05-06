import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import CompanyCard from '../components/CompanyCard';
import SkeletonCard from '../components/SkeletonCard';
import { getReports } from '../services/api';

export default function Home() {
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filters, setFilters]   = useState({ risk: 'all', sort: 'newest' });
  const [stats, setStats]       = useState({ totalReports: 0, totalCompanies: 0, totalUpvotes: 0 });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filters.risk !== 'all') params.risk = filters.risk;
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
      const uniqueCompanies = new Set(all.map(r => r.company_name.toLowerCase())).size;
      const upvotes = all.reduce((sum, r) => sum + (r.upvotes || 0), 0);
      setStats({
        totalReports: all.length,
        totalCompanies: uniqueCompanies,
        totalUpvotes: upvotes,
      });
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchReports, 300);
    return () => clearTimeout(t);
  }, [fetchReports]);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px 80px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 800, width: '100%' }}>

        {/* Stats Section */}
        <div className="card" style={{ display: 'flex', marginBottom: 32, padding: 0, overflow: 'hidden' }}>
          <div style={{ flex: 1, padding: '24px 32px', borderRight: '1px solid var(--border)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stats.totalReports}</div>
            <div className="section-heading" style={{ marginTop: 8 }}>REPORTS FILED</div>
          </div>
          <div style={{ flex: 1, padding: '24px 32px', borderRight: '1px solid var(--border)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stats.totalCompanies}</div>
            <div className="section-heading" style={{ marginTop: 8 }}>COMPANIES FLAGGED</div>
          </div>
          <div style={{ flex: 1, padding: '24px 32px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stats.totalUpvotes}</div>
            <div className="section-heading" style={{ marginTop: 8 }}>UPVOTES</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, location, category..."
            className="input-field"
            style={{ paddingLeft: 40, height: 48, fontSize: '0.95rem', background: 'var(--bg-surface)' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
          <button 
            onClick={() => setFilters(p => ({ ...p, risk: 'all' }))}
            style={{ 
              padding: '6px 16px', borderRadius: 99, fontSize: '0.8125rem', fontWeight: 600,
              background: filters.risk === 'all' ? '#fff' : 'transparent',
              border: `1px solid ${filters.risk === 'all' ? 'var(--border-strong)' : 'var(--border)'}`,
              color: 'var(--text-primary)', cursor: 'pointer'
            }}
          >
            All
          </button>

          <button 
            onClick={() => setFilters(p => ({ ...p, risk: 'high' }))}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 16px', borderRadius: 99, fontSize: '0.8125rem', fontWeight: 600,
              background: filters.risk === 'high' ? '#e85d3f' : '#fff',
              border: `1px solid ${filters.risk === 'high' ? '#e85d3f' : 'var(--border)'}`,
              color: filters.risk === 'high' ? '#fff' : 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.15s'
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: filters.risk === 'high' ? '#fff' : '#ef4444' }} />
            High risk
          </button>

          <button 
            onClick={() => setFilters(p => ({ ...p, risk: 'suspicious' }))}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 16px', borderRadius: 99, fontSize: '0.8125rem', fontWeight: 600,
              background: filters.risk === 'suspicious' ? '#f59e0b' : '#fff',
              border: `1px solid ${filters.risk === 'suspicious' ? '#f59e0b' : 'var(--border)'}`,
              color: filters.risk === 'suspicious' ? '#fff' : 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.15s'
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: filters.risk === 'suspicious' ? '#fff' : '#f59e0b' }} />
            Suspicious
          </button>

          <button 
            onClick={() => setFilters(p => ({ ...p, risk: 'low' }))}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 16px', borderRadius: 99, fontSize: '0.8125rem', fontWeight: 600,
              background: filters.risk === 'low' ? '#10b981' : '#fff',
              border: `1px solid ${filters.risk === 'low' ? '#10b981' : 'var(--border)'}`,
              color: filters.risk === 'low' ? '#fff' : 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.15s'
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: filters.risk === 'low' ? '#fff' : '#10b981' }} />
            Unconfirmed
          </button>

          <div style={{ height: 24, width: 1, background: 'var(--border)' }} />

          <select 
            value={filters.sort}
            onChange={(e) => setFilters(p => ({ ...p, sort: e.target.value }))}
            style={{ 
              padding: '6px 16px', borderRadius: 99, fontSize: '0.8125rem', fontWeight: 600,
              background: '#fff', border: '1px solid var(--border)',
              color: 'var(--text-primary)', cursor: 'pointer', outline: 'none'
            }}
          >
            <option value="newest">Latest</option>
            <option value="most_upvoted">↑ Most upvoted</option>
            <option value="highest_risk">Highest risk</option>
          </select>

        </div>

        {/* List Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 className="section-heading" style={{ color: 'var(--text-primary)', fontSize: '0.8125rem' }}>RECENT REPORTS</h2>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-muted)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>
            {reports.length} reports
          </span>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : reports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>No reports found.</div>
          ) : (
            reports.map((report) => <CompanyCard key={report.id} report={report} />)
          )}
        </div>

      </div>
    </div>
  );
}
