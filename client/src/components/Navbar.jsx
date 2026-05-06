import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(8, 8, 12, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>

          <Link to="/" id="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16,185,129,0.2)',
            }}>
              <ShieldCheck size={17} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              HireD<span style={{ color: 'var(--brand)' }}>Safe</span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => document.dispatchEvent(new Event('openManageReport'))}
              style={{
                fontSize: '0.85rem', fontWeight: 500,
                color: 'var(--text-secondary)', border: 'none',
                background: 'transparent', padding: '8px 14px',
                cursor: 'pointer', transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Manage Report
            </button>
            <Link
              to="/report" id="nav-report" className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 18px', textDecoration: 'none' }}
            >
              + Report
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
