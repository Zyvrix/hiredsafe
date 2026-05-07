import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border)',
      padding: '64px 24px 32px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '64px'
        }}>
          {/* Brand Col */}
          <div style={{ gridColumn: '1 / -1', '@media (min-width: 768px)': { gridColumn: 'span 2' } }}>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              textDecoration: 'none', color: 'var(--text-primary)',
              marginBottom: 16
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShieldCheck size={14} color="var(--bg-surface)" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
                HiredSafe
              </span>
            </Link>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 300 }}>
              Protecting students from fake internships, unpaid work scams, and fraudulent recruiters.
              Search before you apply.
            </p>
          </div>

          {/* Links Cols */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li><Link to="/report" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Report a Company</Link></li>
              <li><Link to="/#feed" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Search Scams</Link></li>
              <li><button onClick={() => document.dispatchEvent(new Event('openManageReport'))} style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Manage Report</button></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li><a href="#" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Safety Guidelines</a></li>
              <li><a href="#" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Common Job Scams</a></li>
              <li><a href="#" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>How to Verify Offers</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li><a href="#" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</a></li>
              <li><a href="#" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: 24 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
            © {new Date().getFullYear()} HiredSafe. Community-driven fraud prevention.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: '0.8125rem' }}
          >
            Open Source
          </a>
        </div>
      </div>
    </footer>
  );
}
