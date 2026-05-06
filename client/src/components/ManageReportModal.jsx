import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { verifySecretCode, deleteReport } from '../services/api';

export default function ManageReportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    document.addEventListener('openManageReport', handleOpen);
    return () => document.removeEventListener('openManageReport', handleOpen);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setCode('');
    setReport(null);
    setError('');
  };

  const handleFind = async (e) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    setError('');
    try {
      const res = await verifySecretCode(code);
      setReport(res.data);
    } catch {
      setError('Invalid secret code or report not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this report?')) return;
    setLoading(true);
    try {
      await deleteReport(report.id, code);
      alert('Report deleted successfully');
      handleClose();
      window.location.reload();
    } catch {
      setError('Failed to delete report.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(6px)',
    }}>
      <div className="card animate-scale-pop" style={{
        width: '100%', maxWidth: 440, padding: 32, position: 'relative',
        background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
      }}>
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'var(--bg-muted)', border: '1px solid var(--border-strong)',
            borderRadius: 6, padding: 5, cursor: 'pointer',
            color: 'var(--text-muted)', display: 'flex',
          }}
        >
          <X size={16} />
        </button>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          Manage your report
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 24 }}>
          Enter your secret code to view or delete.
        </p>

        {!report ? (
          <form onSubmit={handleFind}>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              SECRET CODE
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                placeholder="e.g. IS-A3K9P2"
                className="input-field"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.95rem' }}
                required
              />
              <button type="submit" disabled={loading} className="btn-ghost" style={{ padding: '0 20px' }}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Find'}
              </button>
            </div>
            {error && <p style={{ color: 'var(--risk-high)', fontSize: '0.8rem', marginTop: 10 }}>{error}</p>}
          </form>
        ) : (
          <div>
            <div style={{
              padding: 16, border: '1px solid var(--border-strong)',
              borderRadius: 8, marginBottom: 20, background: 'var(--bg-muted)',
            }}>
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, fontSize: '0.95rem' }}>
                {report.company_name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {(report.description || '').substring(0, 100)}{report.description?.length > 100 ? '...' : ''}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setReport(null)} className="btn-ghost">Back</button>
              <button
                type="button" onClick={handleDelete} disabled={loading}
                className="btn-primary"
                style={{ background: 'var(--risk-high)', boxShadow: 'none' }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Delete Report'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
