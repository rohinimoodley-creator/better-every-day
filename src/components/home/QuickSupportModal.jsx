import React, { useState } from 'react';
import { X, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import ContextualPip from '../mascot/ContextualPip';

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
  },
  {
    quote: "Small steps taken with kindness take you further than giant leaps fueled by pressure.",
    author: "Small Steps",
    tag: "Mindset"
  },
  {
    quote: "Right now is a fresh moment. You don't carry the weight of the whole week into this one breath.",
    author: "Present Ease",
    tag: "Perspective"
  }
];

export default function QuickSupportModal({ isOpen, onClose }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  if (!isOpen) return null;

  const currentQuote = MOTIVATIONAL_MESSAGES[quoteIndex % MOTIVATIONAL_MESSAGES.length];

  const handleNextQuote = () => {
    setQuoteIndex(prev => prev + 1);
    try {
      confetti({ particleCount: 20, spread: 35, origin: { y: 0.6 } });
    } catch(e) {}
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
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span className="pill-badge primary" style={{ fontSize: '0.74rem', padding: '0.25rem 0.65rem', fontWeight: 800 }}>
            <Sparkles size={12} /> Quick Motivation
          </span>

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

        {/* Mascot & Encouragement Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ContextualPip 
              context="mind" 
              size={64} 
              mood="happy"
              message="Take a gentle breath. You're doing great."
              showSpeechBubble={false}
            />
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem 1.15rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', width: '100%' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.68rem', marginBottom: '0.5rem', display: 'inline-block' }}>
              {currentQuote.tag}
            </span>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.55, margin: '0.4rem 0' }}>
              "{currentQuote.quote}"
            </p>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              — {currentQuote.author}
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem', width: '100%', justifyContent: 'center' }}>
            <button 
              onClick={handleNextQuote} 
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.82rem' }}
            >
              Another Perspective ✨
            </button>
            <button 
              onClick={onClose} 
              className="btn btn-primary btn-sm"
              style={{ flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.82rem' }}
            >
              I've Got This 💛
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
