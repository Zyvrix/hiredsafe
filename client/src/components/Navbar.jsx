import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Plus } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 0 rgba(99,102,241,0.08)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

          {/* Logo */}
          <Link
            to="/"
            id="nav-logo"
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(79,110,247,0.3)',
              }}
            >
              <ShieldCheck size={18} color="white" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontSize: '1.0625rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
              }}
            >
              HireD<span style={{ color: 'var(--brand)' }}>Safe</span>
            </span>
          </Link>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => document.dispatchEvent(new Event('openManageReport'))}
              className="btn-ghost"
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                border: '1px solid transparent',
                background: 'transparent',
                padding: '8px 16px',
              }}
            >
              Manage Report
            </button>
            <Link
              to="/report"
              id="nav-report"
              className="btn-primary"
              style={{ fontSize: '0.875rem', padding: '8px 20px', textDecoration: 'none' }}
            >
              + Report
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
