import { SearchX, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ searchActive }) {
  return (
    <div
      className="animate-fade-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <SearchX size={28} color="var(--text-muted)" />
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
        {searchActive ? 'No results found' : 'No reports yet'}
      </h3>

      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: 320, lineHeight: 1.65, marginBottom: 24 }}>
        {searchActive
          ? 'Try a different search term or adjust your filters.'
          : 'Be the first to report a suspicious company and help protect others.'}
      </p>

      {!searchActive && (
        <Link to="/report" className="btn-primary" style={{ textDecoration: 'none' }}>
          <PlusCircle size={15} />
          Report a Scam
        </Link>
      )}
    </div>
  );
}
