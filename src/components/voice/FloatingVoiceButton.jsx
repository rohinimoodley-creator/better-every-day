import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import VoiceLoggingModal from './VoiceLoggingModal';

export default function FloatingVoiceButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Keyboard shortcut listener: Alt + V
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        setIsModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '1.5rem',
          zIndex: 90,
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-calm) 100%)',
          color: '#ffffff',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 24px rgba(45, 106, 79, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform var(--transition-fast)'
        }}
        title="Voice Log (Alt + V)"
        aria-label="Natural Voice Logging (Alt + V)"
      >
        <Mic size={24} />
      </button>

      {isModalOpen && (
        <VoiceLoggingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
