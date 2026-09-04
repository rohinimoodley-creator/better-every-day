import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MicroMovementPromptModal({
  isOpen,
  onClose,
  onCompleteBreak,
  onSkipBreak,
  preference = 'choose'
}) {
  const [completedMessage, setCompletedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSelectOption = (type) => {
    setCompletedMessage(true);
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored for environments without canvas support
    }

    if (onCompleteBreak) {
      onCompleteBreak(type);
    }

    setTimeout(() => {
      setCompletedMessage(false);
      onClose();
    }, 1400);
  };

  const handleSkip = () => {
    if (onSkipBreak) {
      onSkipBreak();
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: 440, textAlign: 'center', animation: 'scaleUp 0.2s ease-out' }}
      >
        {completedMessage ? (
          <div style={{ padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💚</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', margin: '0 0 0.25rem 0' }}>
              Nice reset 💚
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Your 30-minute interval has reset. Continue with your day with renewed focus.
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <span className="pill-badge primary" style={{ fontSize: '0.72rem', marginBottom: '0.35rem' }}>
                  <Sparkles size={12} /> 30-30 Movement Break
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Time for a little movement reset 🌱
                </h3>
              </div>

              <button 
                onClick={onClose}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', textAlign: 'left', margin: '0 0 1.25rem 0', lineHeight: 1.45 }}>
              Interrupting prolonged sitting helps refresh mental focus and eases body tension. Choose what feels comfortable for you right now:
            </p>

            {/* 2 Equal First-Class Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <button
                onClick={() => handleSelectOption('30 Steps')}
                className="card-interactive"
                style={{
                  background: preference === 'steps' ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                  border: preference === 'steps' ? '1.5px solid var(--accent-primary)' : '1.5px solid var(--border-glass)',
                  padding: '1rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🚶</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                        Take 30 Steps
                      </strong>
                      {preference === 'steps' && (
                        <span className="pill-badge primary" style={{ fontSize: '0.62rem' }}>Preferred</span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Walk around the room, down the hall, or in place
                    </span>
                  </div>
                </div>
                <ArrowRight size={16} color="var(--accent-primary)" />
              </button>

              <button
                onClick={() => handleSelectOption('Stretch & Reposition')}
                className="card-interactive"
                style={{
                  background: preference === 'stretch' ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                  border: preference === 'stretch' ? '1.5px solid var(--accent-primary)' : '1.5px solid var(--border-glass)',
                  padding: '1rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🧘</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                        Stretch & Reposition
                      </strong>
                      {preference === 'stretch' && (
                        <span className="pill-badge primary" style={{ fontSize: '0.62rem' }}>Preferred</span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Stand tall, roll shoulders, or change your sitting posture
                    </span>
                  </div>
                </div>
                <ArrowRight size={16} color="var(--accent-primary)" />
              </button>
            </div>

            {/* Skip Button (Never shames) */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={handleSkip}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.35rem 0.75rem'
                }}
              >
                Skip for now (We'll check back in 30 mins)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
