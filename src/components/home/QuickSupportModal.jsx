import React, { useState, useEffect } from 'react';
import { X, Sparkles, Wind, Play, Pause, RotateCcw, Heart, Sun, Volume2 } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

const MOTIVATIONAL_MESSAGES = [
  {
    quote: "You don't need to change everything at once. Making today a tiny bit gentler is already a great victory.",
    author: "Better Every Day",
    tag: "Self-Compassion"
  },
  {
    quote: "Your body is not a machine to be optimized. It is a garden to be listened to, watered, and tended.",
    author: "Gentle Rhythm",
    tag: "Body Listening"
  },
  {
    quote: "Progress isn't always doing more; sometimes progress is recognizing when to rest without guilt.",
    author: "Rest & Vitality",
    tag: "Rest"
  },
  {
    quote: "Consistency is about returning softly, not about never pausing. You are doing wonderfully.",
    author: "Sustainable Wellness",
    tag: "Consistency"
  }
];

export default function QuickSupportModal({ isOpen, mode, onClose, onNavigateTab }) {
  const { playChime } = useAudio();

  // Mode: 'motivation' | 'breathe'
  const [activeMode, setActiveMode] = useState(mode || 'motivation');
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Quick Breathe state (4-6 calming rhythm)
  const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale' | 'exhale'
  const [countdown, setCountdown] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(true);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    if (mode) setActiveMode(mode);
  }, [mode]);

  useEffect(() => {
    let timer = null;
    if (isOpen && activeMode === 'breathe' && isBreathingActive) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev > 1) return prev - 1;
          if (breathPhase === 'inhale') {
            setBreathPhase('exhale');
            return 6;
          } else {
            setBreathPhase('inhale');
            setCompletedCycles(c => c + 1);
            return 4;
          }
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, activeMode, isBreathingActive, breathPhase]);

  if (!isOpen) return null;

  const currentQuote = MOTIVATIONAL_MESSAGES[quoteIndex % MOTIVATIONAL_MESSAGES.length];

  const handleNextQuote = () => {
    setQuoteIndex(prev => prev + 1);
    try {
      confetti({ particleCount: 20, spread: 35, origin: { y: 0.6 } });
    } catch(e) {}
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 480, textAlign: 'center', padding: '1.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
            <button
              onClick={() => setActiveMode('motivation')}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: activeMode === 'motivation' ? 'var(--accent-primary)' : 'transparent',
                color: activeMode === 'motivation' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🌸 Quick Motivation
            </button>
            <button
              onClick={() => {
                setActiveMode('breathe');
                setIsBreathingActive(true);
                setBreathPhase('inhale');
                setCountdown(4);
              }}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: activeMode === 'breathe' ? 'var(--accent-primary)' : 'transparent',
                color: activeMode === 'breathe' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🫧 Quick Breathe
            </button>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {activeMode === 'motivation' ? (
          /* MOTIVATION CARD */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
              🌸
            </div>

            <div>
              <span className="pill-badge primary" style={{ fontSize: '0.68rem', marginBottom: '0.5rem' }}>
                {currentQuote.tag}
              </span>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.55, margin: '0.5rem 0' }}>
                "{currentQuote.quote}"
              </p>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                — {currentQuote.author}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
              <button onClick={handleNextQuote} className="btn btn-secondary btn-sm">
                Another Gentle Thought ✨
              </button>
              <button onClick={onClose} className="btn btn-primary btn-sm">
                I've Got This 💛
              </button>
            </div>
          </div>
        ) : (
          /* QUICK BREATHE */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.2rem 0' }}>
                1-Minute Calming Breath 🫧
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                4s Inhale • 6s Exhale to release physical and mental tension
              </p>
            </div>

            {/* Breathing Animated Circle */}
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'radial-gradient(circle, var(--accent-primary-light) 0%, var(--bg-secondary) 75%)',
                border: '3px solid var(--accent-primary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: breathPhase === 'inhale' ? 'scale(1.25)' : 'scale(0.9)',
                transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {countdown}s
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                {breathPhase === 'inhale' ? 'Breathe In' : 'Breathe Out'}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Completed Cycles: <strong style={{ color: 'var(--text-primary)' }}>{completedCycles}</strong>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className="btn btn-secondary btn-sm"
              >
                {isBreathingActive ? 'Pause' : 'Resume'}
              </button>
              <button onClick={onClose} className="btn btn-primary btn-sm">
                Done & Feeling Centered
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
