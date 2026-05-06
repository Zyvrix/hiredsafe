import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>

          {/* Logo */}
          <Link
            to="/"
            id="nav-logo"
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(232,93,63,0.25)',
              }}
            >
              <ShieldCheck size={17} color="white" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontSize: '1.05rem',
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
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                border: 'none',
                background: 'transparent',
                padding: '8px 16px',
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Manage Report
            </button>
            <Link
              to="/report"
              id="nav-report"
              className="btn-primary"
              style={{
                fontSize: '0.875rem',
                padding: '8px 20px',
                textDecoration: 'none',
                borderRadius: 8,
              }}
            >
              + Report
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
