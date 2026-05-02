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
        background: 'rgba(8, 12, 24, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
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
              Hire<span style={{ color: 'var(--brand)' }}>Safe</span>
            </span>
          </Link>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link
              to="/"
              id="nav-home"
              className="btn-ghost"
              style={{
                fontSize: '0.8125rem',
                fontWeight: pathname === '/' ? 600 : 500,
                color: pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: pathname === '/' ? 'var(--bg-muted)' : 'transparent',
                borderColor: pathname === '/' ? 'var(--border-strong)' : 'var(--border)',
                padding: '7px 14px',
                textDecoration: 'none',
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/report"
              id="nav-report"
              className="btn-primary"
              style={{ fontSize: '0.8125rem', padding: '7px 16px', textDecoration: 'none' }}
            >
              <Plus size={15} strokeWidth={2.5} />
              Report Scam
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
