import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div
      style={{
        position: 'relative',
        maxWidth: 560,
        width: '100%',
      }}
    >
      <Search
        size={16}
        style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
        }}
      />
      <input
        id="search-bar"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search companies...'}
        className="input-field"
        style={{ paddingLeft: 40, paddingRight: value ? 40 : 14, height: 42 }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--bg-muted)',
            border: 'none',
            borderRadius: 4,
            padding: '2px 4px',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
