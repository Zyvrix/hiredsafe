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
    } catch (err) {
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
      window.location.reload(); // Refresh to update list
    } catch (err) {
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
      background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)'
    }}>
      <div className="card" style={{
        width: '100%', maxWidth: 480, padding: 32, position: 'relative',
        background: 'var(--bg-surface)'
      }}>
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 8, padding: 6, cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
          Manage your report
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 24 }}>
          Enter your code to edit or delete.
        </p>

        {!report ? (
          <form onSubmit={handleFind}>
            <label className="section-heading" style={{ marginBottom: 8, display: 'block' }}>SECRET CODE</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                type="text"
                placeholder="e.g. IS-A3K9P2"
                className="input-field"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{ flex: 1, textTransform: 'uppercase', fontSize: '1rem', padding: '12px 16px' }}
                required
              />
              <button type="submit" disabled={loading} className="btn-ghost" style={{ padding: '0 24px', fontSize: '1rem' }}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Find'}
              </button>
            </div>
            {error && <p style={{ color: 'var(--risk-high)', fontSize: '0.875rem', marginTop: 12 }}>{error}</p>}
          </form>
        ) : (
          <div>
            <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 8, marginBottom: 24, background: 'var(--bg-muted)' }}>
              <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{report.company_name}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{report.description.substring(0, 80)}...</p>
            </div>
            
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setReport(null)} className="btn-ghost">
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleDelete} 
                disabled={loading}
                className="btn-primary" 
                style={{ background: 'var(--risk-high)', boxShadow: 'none' }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Delete Report'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
