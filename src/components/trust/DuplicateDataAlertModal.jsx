import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Layers, ArrowRight, X, ShieldCheck } from 'lucide-react';

export default function DuplicateDataAlertModal({ onNavigateTab }) {
  const {
    duplicateSuggestions,
    duplicateAlertDismissed,
    dismissDuplicateAlert
  } = useWellness();

  const pendingDuplicates = (duplicateSuggestions || []).filter(d => d.status === 'pending');

  if (duplicateAlertDismissed || pendingDuplicates.length === 0) {
    return null;
  }

  const firstDup = pendingDuplicates[0];
  const message = firstDup.neutralPrompt || 'We found two sources for this information. Your data was found from multiple connected sources.';

  const handleReview = () => {
    dismissDuplicateAlert();
    if (onNavigateTab) {
      onNavigateTab('YOU', { section: 'privacy_data' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2rem)',
        maxWidth: 580,
        zIndex: 900,
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <div
        className="card-glass"
        style={{
          padding: '1.15rem 1.25rem',
          background: 'var(--bg-glass-card)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid var(--accent-primary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.22)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--accent-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                flexShrink: 0
              }}
            >
              <Layers size={17} />
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  Data Integrity & Multi-Source Notice
                </strong>
                <span className="pill-badge primary" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>
                  {firstDup.category}
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {pendingDuplicates.length} item{pendingDuplicates.length > 1 ? 's' : ''} with multiple sources
              </span>
            </div>
          </div>

          <button
            onClick={dismissDuplicateAlert}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.2rem',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Dismiss"
          >
            <X size={17} />
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
          <button
            type="button"
            onClick={dismissDuplicateAlert}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
          >
            Skip for Now
          </button>
          <button
            type="button"
            onClick={handleReview}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem', gap: '0.35rem' }}
          >
            Review Data Integrity & Duplicates <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
