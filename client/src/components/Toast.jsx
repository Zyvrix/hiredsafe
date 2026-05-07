import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const ICONS = {
  success: <CheckCircle size={18} style={{ color: '#16A34A', flexShrink: 0 }} />,
  error: <AlertTriangle size={18} style={{ color: '#DC2626', flexShrink: 0 }} />,
  info: <Info size={18} style={{ color: '#F97316', flexShrink: 0 }} />,
};

function Toast({ id, type = 'info', title, message, onRemove }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(id), 200);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onRemove(id), 200);
  };

  return (
    <div className={`toast ${exiting ? 'toast-exit' : ''}`}>
      {ICONS[type] || ICONS.info}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
            {title}
          </div>
        )}
        {message && (
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {message}
          </div>
        )}
      </div>
      <button
        onClick={handleClose}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', padding: 2, display: 'flex',
          flexShrink: 0,
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-4), { id, type, title, message }]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
