import React, { useState, useRef } from 'react';
import { X, Printer, Download, FileText, Table, ShieldCheck, Calendar, BookOpen } from 'lucide-react';

export default function IntelligenceExportModal({ isOpen, onClose, report, userProfile }) {
  const printRef = useRef(null);
  const [exportFormat, setExportFormat] = useState('pdf'); // 'pdf' | 'word' | 'text'
  const [exportSection, setExportSection] = useState('full'); // 'full' | 'progress_only' | 'insights_only' | 'weekly_only' | 'gratitude_only'

  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = () => {
    let doc = `# BETTER EVERY DAY — WELLNESS INTELLIGENCE REPORT\n`;
    doc += `Prepared for: ${userProfile.name}\n`;
    doc += `Period: ${report.currentPeriodLabel} (${new Date().toLocaleDateString()})\n`;
    doc += `Report Scope: ${exportSection.replace('_', ' ').toUpperCase()}\n\n`;
    doc += `========================================================\n\n`;

    if (exportSection === 'full' || exportSection === 'progress_only') {
      doc += `## 1. EXECUTIVE SUMMARY\n`;
      doc += `${report.overview.headline}\n\n`;
      report.overview.highlights.forEach(h => {
        doc += `* ${h.icon} ${h.title}: ${h.stat} — ${h.note}\n`;
      });
      doc += `\n--------------------------------------------------------\n\n`;
    }

    if (exportSection === 'full' || exportSection === 'insights_only') {
      doc += `## 2. WHAT WE NOTICED (PATTERNS & OBSERVATIONS)\n`;
      report.patterns.forEach((p, idx) => {
        doc += `### ${idx + 1}. ${p.title} (${p.tier?.label || 'Pattern'})\n`;
        doc += `* Observation: ${p.observation}\n`;
        doc += `* Why explanation: ${p.whyExplanation}\n`;
        doc += `* Why we noticed this: ${p.whyText}\n\n`;
      });
      doc += `\n--------------------------------------------------------\n\n`;
    }

    if (exportSection === 'full' || exportSection === 'weekly_only') {
      doc += `## 3. WEEKLY REVIEW\n`;
      doc += `* Motivation: "${report.weeklyReview.motivation}"\n`;
      doc += `* What Went Well: ${report.weeklyReview.whatWentWell}\n`;
      doc += `* What You Did: ${report.weeklyReview.whatYouDid}\n`;
      doc += `* What Might Help: ${report.weeklyReview.whatMightHelp}\n\n`;
      doc += `\n--------------------------------------------------------\n\n`;
    }

    if (exportSection === 'full' || exportSection === 'gratitude_only') {
      doc += `## 4. MY BETTER EVERY DAY JOURNEY\n`;
      doc += `${report.myStory.narrative}\n\n`;
    }

    const blob = new Blob([doc], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BetterEveryDay_Intelligence_${userProfile.name}_${report.dateRange}_${exportSection}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPlainText = () => {
    let txt = `BETTER EVERY DAY - WELLNESS INTELLIGENCE REPORT\n`;
    txt += `User: ${userProfile.name}\n`;
    txt += `Period: ${report.currentPeriodLabel}\n\n`;
    txt += `SUMMARY: ${report.overview.headline}\n\n`;
    txt += `WINS:\n`;
    report.overview.highlights.forEach(k => { txt += `- ${k.title}: ${k.stat}\n`; });
    txt += `\nRECOMMENDATIONS:\n`;
    report.recommendations.forEach(r => { txt += `- ${r.category}: ${r.what} (Why: ${r.why})\n`; });

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BetterEveryDay_Intelligence_${userProfile.name}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
              <BookOpen size={12} /> Progress Exporter
            </span>
            <h3 style={{ fontSize: '1.35rem', margin: 0 }}>Export Wellness Intelligence 📄</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Format Selector Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
          {[
            { id: 'pdf', label: '📄 PDF / Binder Print', icon: <Printer size={16} /> },
            { id: 'word', label: '📝 Word / Document (.md)', icon: <FileText size={16} /> },
            { id: 'text', label: '📄 Plain Text Summary', icon: <Table size={16} /> }
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

        {/* Section Scope Selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
          {[
            { id: 'full', label: 'Full Wellness Report' },
            { id: 'progress_only', label: 'Progress & Highlights' },
            { id: 'insights_only', label: 'Patterns & Observations' },
            { id: 'weekly_only', label: 'Weekly Review' },
            { id: 'gratitude_only', label: 'Journey Story' }
          ].map(sc => (
            <button
              key={sc.id}
              onClick={() => setExportSection(sc.id)}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-pill)',
                border: exportSection === sc.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                background: exportSection === sc.id ? 'var(--accent-primary-light)' : 'transparent',
                color: exportSection === sc.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '0.74rem',
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
              Wellness Intelligence Report • {report.currentPeriodLabel} • Prepared for {userProfile.name}
            </p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#2d6a4f', margin: '0 0 0.4rem 0' }}>Summary</h4>
            <p style={{ fontSize: '0.85rem', color: '#333', margin: '0 0 0.5rem 0' }}>{report.overview.headline}</p>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#444' }}>
              {report.overview.highlights.map(h => (
                <li key={h.id} style={{ marginBottom: '0.2rem' }}>
                  <strong>{h.title}:</strong> {h.stat} ({h.note})
                </li>
              ))}
            </ul>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#2d6a4f', margin: '0 0 0.4rem 0' }}>Meaningful Wins & Rhythms</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#444' }}>
              {report.overview.highlights.map(k => (
                <li key={k.id} style={{ marginBottom: '0.2rem' }}>
                  <strong>{k.title}:</strong> {k.stat} — {k.note}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Security Notice */}
        <div style={{ background: 'rgba(244, 140, 66, 0.12)', border: '1px solid rgba(244, 140, 66, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--accent-secondary)' }}>
          <ShieldCheck size={16} flexShrink={0} />
          <span>Security Notice: This export contains personal health, nutrition, and lifestyle summaries. Store your downloaded file securely.</span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {exportFormat === 'pdf' && (
            <button onClick={handlePrint} className="btn btn-primary" style={{ flex: 1, padding: '0.85rem' }}>
              <Printer size={16} /> Print / Save as PDF
            </button>
          )}

          {exportFormat === 'word' && (
            <button onClick={handleDownloadDoc} className="btn btn-primary" style={{ flex: 1, padding: '0.85rem' }}>
              <Download size={16} /> Download Document (.md / Word)
            </button>
          )}

          {exportFormat === 'text' && (
            <button onClick={handleDownloadPlainText} className="btn btn-primary" style={{ flex: 1, padding: '0.85rem' }}>
              <FileText size={16} /> Download Plain Text Summary
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
