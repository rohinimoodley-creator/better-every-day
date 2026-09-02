import React, { useState, useRef } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { X, Printer, Download, Sparkles, BookOpen, FileText, Table, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function JournalExportModal({ isOpen, onClose, journalEntries = [], discoveredGratitude = [] }) {
  const { userProfile } = useWellness();
  const printRef = useRef(null);

  const [exportFormat, setExportFormat] = useState('pdf'); // 'pdf' | 'doc' | 'csv'
  const [exportScope, setExportScope] = useState('all'); // 'all' | 'gratitude_only' | 'discovery_only'
  const [dateRange, setDateRange] = useState('all_time');

  if (!isOpen) return null;

  const getFilteredExportData = () => {
    let list = [...journalEntries];
    if (exportScope === 'gratitude_only') {
      list = list.filter(j => j.type === 'gratitude');
    } else if (exportScope === 'discovery_only') {
      return discoveredGratitude.map(dg => ({
        id: dg.id,
        date: dg.date,
        type: 'gratitude_discovery',
        title: `Discovered Gratitude (${dg.theme})`,
        content: dg.text,
        notes: `Context: ${dg.rawSource}`
      }));
    }
    return list;
  };

  const exportData = getFilteredExportData();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = () => {
    let docContent = `# BETTER EVERY DAY — PERSONAL WELLNESS & GRATITUDE JOURNAL\n`;
    docContent += `Prepared for: ${userProfile.name}\n`;
    docContent += `Export Date: ${new Date().toLocaleDateString()}\n`;
    docContent += `Total Entries: ${exportData.length}\n\n`;
    docContent += `========================================================\n\n`;

    exportData.forEach((item, idx) => {
      docContent += `## ${idx + 1}. ${item.title || 'Untitled'}\n`;
      docContent += `* Date: ${item.date || 'N/A'} | Type: ${(item.type || 'journal').toUpperCase()}\n`;
      if (item.moodStamp) docContent += `* Mood: ${item.moodStamp}\n`;
      docContent += `\n`;
      if (item.entries && Array.isArray(item.entries)) {
        item.entries.forEach((e, i) => {
          docContent += `  - ${e}\n`;
        });
      } else {
        docContent += `${item.content || item.notes || ''}\n`;
      }
      docContent += `\n--------------------------------------------------------\n\n`;
    });

    const blob = new Blob([docContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BetterEveryDay_Journal_${userProfile.name}_${new Date().toISOString().split('T')[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    let csv = 'ID,Date,Type,Title,Content,Mood,Source\n';
    exportData.forEach(item => {
      const cleanContent = (item.entries ? item.entries.join(' | ') : (item.content || '')).replace(/"/g, '""');
      const cleanTitle = (item.title || '').replace(/"/g, '""');
      const cleanMood = (item.moodStamp || '').replace(/"/g, '""');
      csv += `"${item.id}","${item.date || ''}","${item.type || ''}","${cleanTitle}","${cleanContent}","${cleanMood}","${item.source || 'manual'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BetterEveryDay_Journal_${userProfile.name}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
              <BookOpen size={12} /> Data Export & Print Studio
            </span>
            <h3 style={{ fontSize: '1.35rem' }}>Export & Print Journal Pages 📜</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Format Selector Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { id: 'pdf', label: '📄 PDF / Binder Print', icon: <Printer size={16} /> },
            { id: 'doc', label: '📝 Word / Document', icon: <FileText size={16} /> },
            { id: 'csv', label: '📊 CSV Spreadsheet', icon: <Table size={16} /> }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setExportFormat(f.id)}
              style={{
                padding: '0.65rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                border: exportFormat === f.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                background: exportFormat === f.id ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                color: exportFormat === f.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              {f.icon}
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Scope Selector */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
          {[
            { id: 'all', label: 'Full Journal Archive' },
            { id: 'gratitude_only', label: 'Gratitude Space Only' },
            { id: 'discovery_only', label: 'Discovered Moments Only' }
          ].map(sc => (
            <button
              key={sc.id}
              onClick={() => setExportScope(sc.id)}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-pill)',
                border: exportScope === sc.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                background: exportScope === sc.id ? 'var(--accent-primary-light)' : 'transparent',
                color: exportScope === sc.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Printable Area Preview */}
        <div 
          ref={printRef}
          className="printable-area"
          style={{
            background: '#ffffff',
            border: '2px dashed var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            maxHeight: 280,
            overflowY: 'auto',
            marginBottom: '1.25rem',
            color: '#1a1a1a',
            fontFamily: "'Outfit', sans-serif"
          }}
        >
          <div style={{ textAlign: 'center', borderBottom: '2px solid #2d6a4f', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#2d6a4f', margin: '0 0 0.15rem 0' }}>BETTER EVERY DAY</h3>
            <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
              Wellness & Gratitude Journal • Prepared for {userProfile.name} • {exportData.length} Entries
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {exportData.map(j => (
              <div key={j.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '0.75rem', background: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.75rem', color: '#666' }}>
                  <span style={{ fontWeight: 700, textTransform: 'uppercase', color: '#2d6a4f' }}>{j.type}</span>
                  <span>{j.date}</span>
                </div>
                <h4 style={{ fontSize: '0.98rem', margin: '0 0 0.35rem 0', color: '#111' }}>{j.title}</h4>
                {j.entries && Array.isArray(j.entries) ? (
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#333', margin: 0 }}>
                    {j.entries.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: '#333', margin: 0 }}>{j.content || j.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security Warning Notice */}
        <div style={{ background: 'rgba(244, 140, 66, 0.12)', border: '1px solid rgba(244, 140, 66, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--accent-secondary)' }}>
          <ShieldCheck size={16} flexShrink={0} />
          <span>Security Notice: This export contains personal reflections and wellness notes. Store your downloaded file securely.</span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {exportFormat === 'pdf' && (
            <button onClick={handlePrint} className="btn btn-primary" style={{ flex: 1, padding: '0.85rem' }}>
              <Printer size={16} /> Print / Save as PDF
            </button>
          )}

          {exportFormat === 'doc' && (
            <button onClick={handleDownloadDoc} className="btn btn-primary" style={{ flex: 1, padding: '0.85rem' }}>
              <Download size={16} /> Download Document (.md / Word)
            </button>
          )}

          {exportFormat === 'csv' && (
            <button onClick={handleDownloadCSV} className="btn btn-primary" style={{ flex: 1, padding: '0.85rem' }}>
              <Table size={16} /> Download CSV Spreadsheet
            </button>
          )}

          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
