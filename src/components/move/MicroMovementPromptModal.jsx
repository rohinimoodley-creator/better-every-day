import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import ContextualPip from '../mascot/ContextualPip';
import { useAudio } from '../../context/AudioContext';

export default function MicroMovementPromptModal({
  isOpen,
  onClose,
  onCompleteBreak,
  onSkipBreak,
  preference = 'choose'
}) {
  const { playChime } = useAudio();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [completedMessage, setCompletedMessage] = useState(false);
  const [loggedType, setLoggedType] = useState('');

  if (!isOpen) return null;

  const handleSelectOption = (type) => {
    setLoggedType(type);
    setIsTransitioning(true);

    try { playChime(528); } catch(e) {}
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 }
      });
    } catch {}

    if (onCompleteBreak) {
      onCompleteBreak(type);
    }

    setTimeout(() => {
      setCompletedMessage(true);
      setIsTransitioning(false);
    }, 280);

    setTimeout(() => {
      setCompletedMessage(false);
      onClose();
    }, 1700);
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
        className="modal-sheet card-glass" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: 460, 
          textAlign: 'center', 
          padding: '1.75rem',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--accent-primary)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          animation: 'scaleUp 0.2s ease-out'
        }}
      >
        {completedMessage ? (
          <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <ContextualPip 
              context="move" 
              size={64} 
              mood="celebrate"
              message="Nice reset! 🌱"
              showSpeechBubble={false}
            />
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-primary)', margin: '0 0 0.25rem 0' }}>
                Nice reset 💚
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                {loggedType ? `Logged ${loggedType}. ` : ''}Your 30-minute interval has refreshed smoothly.
              </p>
            </div>
          </div>
        ) : (
          <div
            style={{
              opacity: isTransitioning ? 0.35 : 1,
              transform: isTransitioning ? 'scale(0.97)' : 'scale(1)',
              transition: 'opacity 0.28s ease, transform 0.28s ease'
            }}
          >
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
                style={{ 
                  background: 'var(--bg-tertiary)', 
                  border: 'none', 
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer', 
                  color: 'var(--text-muted)' 
                }}
                title="Close"
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
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
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
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
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

