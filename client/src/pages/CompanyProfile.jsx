import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, BarChart3, Clock, AlertCircle } from 'lucide-react';
import { getReports } from '../services/api';
import CompanyCard from '../components/CompanyCard';
import RiskBadge from '../components/RiskBadge';

export default function CompanyProfile() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports({ search: decodedName }).then((res) => {
      // Exact or very close match filter
      const exactMatches = (res.data || []).filter(r => 
        r.company_name.toLowerCase() === decodedName.toLowerCase()
      );
      setReports(exactMatches);
      setLoading(false);
    });
  }, [decodedName]);

  if (loading) {
    return <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;
  }

  if (reports.length === 0) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Company not found</h2>
        <Link to="/" className="btn-ghost" style={{ marginTop: 16 }}>Back to home</Link>
      </div>
    );
  }

  // Aggregate stats
  const totalReports = reports.reduce((sum, r) => sum + r.report_count, 0);
  const highestScore = Math.max(...reports.map(r => r.risk_score));
  const riskLevel = highestScore <= 30 ? 'low' : highestScore <= 60 ? 'suspicious' : 'high';
  
  // Aggregate all flags
  const allFlags = new Set();
  reports.forEach(r => r.flags?.forEach(f => allFlags.add(f)));
  const uniqueFlags = Array.from(allFlags);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px 80px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 840, width: '100%' }}>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: 24 }}>
          <ArrowLeft size={14} /> Back to search
        </Link>

        {/* Header Profile Card */}
        <div className="card" style={{ padding: '32px', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-0.03em' }}>
                {decodedName}
              </h1>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <RiskBadge level={riskLevel} score={highestScore} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <BarChart3 size={14} /> {totalReports} Total Reports
                </div>
              </div>
            </div>
          </div>

          <div className="divider" style={{ margin: '24px 0' }} />

          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
              Reported Activities
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {uniqueFlags.map(flag => (
                <span key={flag} style={{
                  padding: '4px 12px', borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-muted)', border: '1px solid var(--border)',
                  fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-primary)',
                }}>
                  {flag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
          Report Timeline
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reports.map((report, i) => (
            <CompanyCard key={report.id} report={report} index={i} />
          ))}
        </div>

      </div>
    </div>
  );
}
