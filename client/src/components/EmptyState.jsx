import { SearchX, PlusCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function EmptyState({ searchActive, searchQuery, onAIResearch, aiLoading }) {
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

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 340, lineHeight: 1.5, marginBottom: 20 }}>
        {searchActive
          ? `We don't have any reports for "${searchQuery || 'this company'}". Want our AI to research it for you?`
          : 'No scams have been reported yet. Help protect others by submitting the first report.'}
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {searchActive && onAIResearch && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAIResearch(searchQuery)}
            disabled={aiLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 22px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              color: '#fff',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: aiLoading ? 'wait' : 'pointer',
              opacity: aiLoading ? 0.7 : 1,
              boxShadow: '0 2px 8px rgba(249, 115, 22, 0.25)',
              transition: 'all 0.2s',
            }}
          >
            <Sparkles size={16} />
            {aiLoading ? 'Researching…' : 'Research with AI'}
          </motion.button>
        )}

        {!searchActive && (
          <Link to="/report" className="btn-secondary" style={{ textDecoration: 'none' }}>
            <PlusCircle size={15} />
            Report a Company
          </Link>
        )}
      </div>
    </div>
  );
}

