import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Search, Sun, Moon, Plus, Menu, X, FileText } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-bar');
        if (searchInput) {
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => searchInput.focus(), 300);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <nav
        id="main-nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--navbar-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${scrolled ? 'var(--navbar-border)' : 'transparent'}`,
          transition: 'border-color 0.2s ease, background 0.3s ease',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

            {/* Logo */}
            <Link
              to="/"
              id="nav-logo"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                textDecoration: 'none', color: 'var(--text-primary)',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShieldCheck size={20} color="white" strokeWidth={2.5} />
              </div>
              <span style={{
                fontSize: '1.25rem', fontWeight: 800,
                letterSpacing: '-0.03em',
              }}>
                HiredSafe
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

              {/* Search shortcut */}
              <button
                onClick={() => {
                  const searchInput = document.getElementById('search-bar');
                  if (searchInput) {
                    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => searchInput.focus(), 300);
                  } else {
                    window.location.href = '/#feed';
                  }
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 16px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-muted)',
                  color: 'var(--text-muted)',
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  minWidth: 200,
                }}
              >
                <Search size={16} />
                <span>Search...</span>
                <kbd style={{
                  marginLeft: 'auto',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 4,
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-muted)',
                  fontFamily: 'inherit',
                }}>
                  ⌘K
                </kbd>
              </button>

              {/* Manage Report */}
              <button
                onClick={() => document.dispatchEvent(new Event('openManageReport'))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 16px',
                  fontSize: '0.9375rem', fontWeight: 500,
                  color: 'var(--text-secondary)',
                  border: 'none', background: 'transparent',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'var(--bg-muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <FileText size={16} />
                Manage
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="btn-icon"
                style={{ width: 40, height: 40 }}
                id="theme-toggle"
                aria-label="Toggle theme"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light'
                  ? <Moon size={18} />
                  : <Sun size={18} />
                }
              </button>

              {/* Report CTA */}
              <Link
                to="/report"
                id="nav-report"
                className="btn-primary"
                style={{ fontSize: '0.9375rem', padding: '10px 20px', textDecoration: 'none' }}
              >
                <Plus size={16} strokeWidth={2.5} />
                Report
              </Link>
            </div>

            {/* Mobile menu button */}
            <div style={{ display: 'none' }} className="show-mobile">
              <button onClick={() => setMobileOpen(!mobileOpen)} className="btn-icon">
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay (CSS handles show/hide via media query) */}
      <style>{`
        @media (max-width: 768px) {
          .show-mobile { display: flex !important; }
        }
      `}</style>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', top: 56, left: 0, right: 0, bottom: 0,
            zIndex: 40, background: 'var(--bg-primary)',
            padding: '24px',
            display: 'flex', flexDirection: 'column', gap: 12,
            animation: 'fadeIn 0.2s ease both',
          }}
        >
          <Link to="/" className="btn-ghost" style={{ justifyContent: 'center', textDecoration: 'none' }}>
            Home
          </Link>
          <button
            onClick={() => { document.dispatchEvent(new Event('openManageReport')); setMobileOpen(false); }}
            className="btn-ghost"
            style={{ justifyContent: 'center' }}
          >
            <FileText size={14} />
            Manage Report
          </button>
          <Link to="/report" className="btn-primary" style={{ justifyContent: 'center', textDecoration: 'none' }}>
            <Plus size={14} strokeWidth={2.5} />
            Report a Company
          </Link>
          <button onClick={toggleTheme} className="btn-ghost" style={{ justifyContent: 'center' }}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      )}
    </>
  );
}
