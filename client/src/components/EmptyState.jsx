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
        padding: '64px 24px',
        textAlign: 'center',
        background: 'var(--bg-surface)',
        border: '1px dashed var(--border-strong)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'var(--bg-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <SearchX size={24} color="var(--text-muted)" />
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
        {searchActive ? 'No results found' : 'The coast is clear'}
      </h3>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 300, lineHeight: 1.5, marginBottom: 20 }}>
        {searchActive
          ? 'Try adjusting your search or filters to find what you are looking for.'
          : 'No scams have been reported yet. Help protect others by submitting the first report.'}
      </p>

      {!searchActive && (
        <Link to="/report" className="btn-secondary" style={{ textDecoration: 'none' }}>
          <PlusCircle size={15} />
          Report a Company
        </Link>
      )}
    </div>
  );
}
