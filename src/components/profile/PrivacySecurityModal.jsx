import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import PDFExportModal from './PDFExportModal';
import { ShieldCheck, Download, Trash2, AlertTriangle, X, Check, FileText } from 'lucide-react';

export default function PrivacySecurityModal({ isOpen, onClose }) {
  const { userProfile, dailyCheckIn, loggedMeals, journalEntries } = useWellness();
  const [copiedData, setCopiedData] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleExportJson = () => {
    const exportBundle = {
      userProfile,
      dailyCheckIn,
      loggedMeals,
      journalEntries,
      exportedAt: new Date().toISOString(),
      app: 'Better Every Day'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `better_every_day_data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2500);
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
              <ShieldCheck size={12} /> Privacy, Safety & Trust
            </span>
            <h3 style={{ fontSize: '1.3rem' }}>Your Data & Privacy Vault 🛡️</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Medical & Diagnostic Safety Notice */}
        <div 
          style={{
            background: 'var(--accent-primary-light)',
            borderLeft: '4px solid var(--accent-primary)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            marginBottom: '1.25rem',
            lineHeight: 1.45
          }}
        >
          <strong>Medical Notice & Boundaries:</strong> Better Every Day provides general self-care guidance and educational observations. The application does not diagnose vitamin deficiencies, hormonal imbalances, physiological diseases, or mental health disorders. Always consult licensed medical professionals for health diagnoses.
        </div>

        {/* Local-First & Sensitivity Statement */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Local-First Confidential Storage</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Your personal check-ins, journal reflections, and optional cycle dates are stored privately on your device. Nothing is shared with connected profiles without your explicit permission.
          </p>
        </div>

        {/* Export Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setIsPDFModalOpen(true)}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', gap: '0.4rem' }}
          >
            <FileText size={16} /> Choose & Export as PDF Report
          </button>

          <button 
            onClick={handleExportJson}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
          >
            <Download size={16} /> {copiedData ? '✓ Export Complete!' : 'Download Complete Data Backup (JSON)'}
          </button>

          {/* Delete All Data */}
          {!confirmDelete ? (
            <button 
              onClick={() => setConfirmDelete(true)}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.75rem', color: 'var(--accent-rose)', justifyContent: 'center' }}
            >
              <Trash2 size={16} /> Delete & Reset All Information
            </button>
          ) : (
            <div style={{ background: 'rgba(214, 64, 98, 0.1)', border: '1px solid var(--accent-rose)', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-rose)', fontWeight: 600, margin: '0 0 0.6rem 0' }}>
                Are you sure? This will wipe all local check-ins, logs, and journals.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button onClick={handleResetData} className="btn btn-primary btn-sm" style={{ background: 'var(--accent-rose)' }}>
                  Yes, Wipe Everything
                </button>
                <button onClick={() => setConfirmDelete(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
          Done
        </button>
      </div>

      {isPDFModalOpen && (
        <PDFExportModal
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
        />
      )}
    </div>
  );
}
