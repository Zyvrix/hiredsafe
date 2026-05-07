import { useState, useEffect } from 'react';
import { Search, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CompanyCard from '../components/CompanyCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { getReports } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* ─── Hero Section ─── */}
      <section style={{
        padding: '64px 24px 48px',
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: 840, width: '100%', textAlign: 'center' }}>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: 32,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--risk-safe)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Community verified fraud prevention
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: 24,
            }}
          >
            Protect yourself from <br className="hide-mobile" />
            <span style={{ color: 'var(--primary)' }}>fake job scams.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: 580,
              margin: '0 auto 40px',
            }}
          >
            Search companies before applying. Report suspicious recruiters. 
            Help students stay safe with crowd-sourced verification.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}
          >
            <Link to="/report" className="btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
              Report a Scam
            </Link>
            <button
              onClick={() => {
                const el = document.getElementById('search-bar');
                if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
              }}
              className="btn-secondary"
              style={{ padding: '12px 28px', fontSize: '1rem' }}
            >
              Verify a Company
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section style={{ padding: '0 24px 64px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            maxWidth: 1000, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16,
          }}
        >
          {[
            { label: 'Reports Filed', value: stats.totalReports, icon: <AlertTriangle size={18} />, color: 'var(--risk-suspicious)' },
            { label: 'Companies Flagged', value: stats.totalCompanies, icon: <ShieldCheck size={18} />, color: 'var(--risk-high)' },
            { label: 'Community Upvotes', value: stats.totalUpvotes, icon: <TrendingUp size={18} />, color: 'var(--primary)' },
            { label: 'Platform Status', value: 'Active', icon: <CheckCircle2 size={18} />, color: 'var(--risk-safe)' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ color: stat.color }}>{stat.icon}</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {stat.value}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── Search & Feed Section ─── */}
      <section id="feed" style={{ padding: '0 24px 80px', flex: 1 }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Recent Reports
            </h2>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Showing {reports.length} results
            </div>
          </div>

          {/* Search Bar */}
          <div className="card" style={{ padding: '16px', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="search-bar"
                type="text"
                placeholder="Search by company name, location, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field"
                style={{ paddingLeft: 42, height: 48, fontSize: '0.9375rem', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { value: 'all', label: 'All' },
                  { value: 'high', label: 'High Risk' },
                  { value: 'suspicious', label: 'Suspicious' },
                  { value: 'low', label: 'Safe' },
                ].map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFilters(p => ({ ...p, risk: f.value }))}
                    style={{
                      padding: '6px 14px', borderRadius: 'var(--radius-full)',
                      fontSize: '0.8125rem', fontWeight: 500,
                      background: filters.risk === f.value ? 'var(--text-primary)' : 'var(--bg-muted)',
                      color: filters.risk === f.value ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      border: 'none', cursor: 'pointer', transition: 'all 0.15s'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              
              <select
                value={filters.sort}
                onChange={(e) => setFilters(p => ({ ...p, sort: e.target.value }))}
                className="input-field"
                style={{ width: 'auto', padding: '6px 32px 6px 12px', height: 'auto', fontSize: '0.8125rem' }}
              >
                <option value="newest">Newest First</option>
                <option value="most_upvoted">Most Upvoted</option>
                <option value="highest_risk">Highest Risk</option>
              </select>
            </div>
          </div>

          {/* Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : reports.length === 0 ? (
              <EmptyState searchActive={search.length > 0 || filters.risk !== 'all'} />
            ) : (
              <AnimatePresence mode="popLayout">
                {reports.map((report, i) => (
                  <CompanyCard key={report.id} report={report} index={i} />
                ))}
              </AnimatePresence>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
