import React from 'react';
import { Sparkles, Moon, ArrowRight, Check, X, Shield, Heart } from 'lucide-react';

export default function CycleAwareSuggestionModal({
  isOpen,
  onClose,
  cyclePhase = 'Luteal',
  cycleDay = 22,
  originalAction = {
    title: 'High Intensity Interval Training (HIIT)',
    category: 'Workout',
    details: '45 mins strenuous cardio & sprinting'
  },
  suggestedAction = {
    title: 'Mindful Mat Pilates & Mobility Walk',
    category: 'Gentle Movement',
    details: '30 mins low-cortisol movement aligned with energy curve',
    benefit: 'Supports progesterone balance and prevents post-exercise crash'
  },
  onContinueOriginal,
  onAcceptSuggestion,
  onSkip
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: 540, animation: 'scaleUp 0.2s ease-out' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <span className="pill-badge rose" style={{ fontSize: '0.72rem' }}>
                <Moon size={12} /> Cycle-Aware Suggestion
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {cyclePhase} Phase • Day {cycleDay}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Tune Into Today's Rhythm 🌸
            </h3>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Philosophy statement: recommend, not police */}
        <div style={{ background: 'rgba(214, 64, 98, 0.08)', border: '1px solid rgba(214, 64, 98, 0.2)', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          💡 <strong>Better Every Day recommends, never polices.</strong> Your body and your choices always come first.
        </div>

        {/* Comparison Cards: Original vs Suggested */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          
          {/* User's Original Planned Choice */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.9rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              Your Current Plan
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {originalAction.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {originalAction.details}
            </div>
          </div>

          {/* Gentle Phase-Aligned Alternative */}
          <div style={{ background: 'linear-gradient(135deg, rgba(214, 64, 98, 0.06) 0%, rgba(123, 97, 255, 0.06) 100%)', border: '1.5px solid rgba(214, 64, 98, 0.35)', borderRadius: 'var(--radius-md)', padding: '0.95rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-rose)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              <Sparkles size={12} /> Suggested Phase Alternative
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
              {suggestedAction.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {suggestedAction.details}
            </div>
            {suggestedAction.benefit && (
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 600, marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Heart size={12} /> {suggestedAction.benefit}
              </div>
            )}
          </div>

        </div>

        {/* 3 Explicit Choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Choice 1: Continue with my choice (Honors user agency) */}
          <button
            onClick={() => {
              if (onContinueOriginal) onContinueOriginal();
              onClose();
            }}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.7rem', justifyContent: 'center', fontSize: '0.88rem' }}
          >
            <span>Continue With My Choice</span>
            <ArrowRight size={15} />
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {/* Choice 2: See / Accept the suggestion */}
            <button
              onClick={() => {
                if (onAcceptSuggestion) onAcceptSuggestion();
                onClose();
              }}
              className="btn btn-secondary"
              style={{ padding: '0.65rem', justifyContent: 'center', fontSize: '0.82rem', borderColor: 'var(--accent-rose)', color: 'var(--accent-rose)' }}
            >
              <Sparkles size={14} />
              <span>See the Suggestion</span>
            </button>

            {/* Choice 3: Skip for now */}
            <button
              onClick={() => {
                if (onSkip) onSkip();
                onClose();
              }}
              className="btn btn-secondary"
              style={{ padding: '0.65rem', justifyContent: 'center', fontSize: '0.82rem' }}
            >
              <span>Skip for Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
