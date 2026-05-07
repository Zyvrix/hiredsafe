import { useState, useEffect } from 'react';
import { X, Loader2, Key } from 'lucide-react';
import { verifySecretCode, deleteReport } from '../services/api';
import { useToast } from './Toast';

export default function ManageReportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    document.addEventListener('openManageReport', handleOpen);
    return () => document.removeEventListener('openManageReport', handleOpen);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setCode('');
    setReport(null);
  };

  const handleFind = async (e) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    try {
      const res = await verifySecretCode(code);
      setReport(res.data);
    } catch {
      addToast({ type: 'error', title: 'Not found', message: 'Invalid secret code or report not found.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this report? This cannot be undone.')) return;
    setLoading(true);
    try {
      await deleteReport(report.id, code);
      addToast({ type: 'success', title: 'Deleted', message: 'Report deleted successfully.' });
      handleClose();
      window.location.reload();
    } catch {
      addToast({ type: 'error', title: 'Failed', message: 'Could not delete report.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="card animate-scale-pop" style={{
        width: '100%', maxWidth: 460, padding: 32, position: 'relative',
        boxShadow: 'var(--shadow-xl)',
      }}>
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'var(--bg-muted)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: 6, cursor: 'pointer',
            color: 'var(--text-muted)', display: 'flex',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--bg-muted)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-primary)'
          }}>
            <Key size={18} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Manage Report
          </h2>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>
          Enter the secret code you received when submitting the report to verify your identity.
        </p>

        {!report ? (
          <form onSubmit={handleFind}>
            <label className="label">Secret Code</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                placeholder="e.g. IS-A3K9P2"
                className="input-field"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'monospace' }}
                required
              />
              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0 24px' }}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Find'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{
              padding: 16, border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', marginBottom: 24, background: 'var(--bg-muted)',
            }}>
              <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, fontSize: '0.9375rem' }}>
                {report.company_name}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {(report.description || '').substring(0, 120)}{report.description?.length > 120 ? '...' : ''}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" onClick={() => setReport(null)} className="btn-secondary" style={{ flex: 1 }}>
                Back
              </button>
              <button
                type="button" onClick={handleDelete} disabled={loading}
                className="btn-primary"
                style={{ flex: 1, background: 'var(--risk-high)', color: 'white' }}
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
