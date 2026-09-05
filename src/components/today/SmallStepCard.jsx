import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAudio } from '../../context/AudioContext';
import { CheckCircle, Sparkles, Clock, Flame, ListPlus, PauseCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import ContextualPip from '../mascot/ContextualPip';

export default function SmallStepCard({ smallStep, onBreakItDown }) {
  const { smallStepState, completeSmallStep, howIThrive } = useWellness();
  const { playChime } = useAudio();

  const handleComplete = () => {
    if (!smallStepState.isCompleted) {
      completeSmallStep();
      if (howIThrive.soundMascot !== false) {
        playChime(660);
      }
      if (howIThrive.animationLevel !== 'minimal') {
        try {
          confetti({
            particleCount: 55,
            spread: 70,
            origin: { y: 0.65 }
          });
        } catch (e) {}
      }
    }
  };

  const isDone = smallStepState.isCompleted;
  const isPaused = howIThrive.streakPaused;
  const streaksOn = howIThrive.streaksEnabled !== false;

  return (
    <div 
      className="card-glass"
      style={{
        background: isDone 
          ? 'linear-gradient(135deg, rgba(82, 183, 136, 0.15) 0%, rgba(64, 145, 108, 0.08) 100%)'
          : 'linear-gradient(135deg, var(--bg-glass-card) 0%, rgba(255, 245, 235, 0.7) 100%)',
        borderColor: isDone ? 'var(--accent-primary)' : 'rgba(217, 119, 54, 0.3)',
        padding: '1.5rem',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="pill-badge orange">
            <Sparkles size={12} /> Today's Small Step
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Clock size={12} /> {smallStep?.duration || '2 min'}
          </span>
        </div>

        {/* Streak Counter or Paused Banner */}
        {isPaused ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
            <PauseCircle size={15} />
            <span>Streak Paused ({smallStepState.streakCount}d safe)</span>
          </div>
        ) : streaksOn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>
            <Flame size={15} />
            <span>{smallStepState.streakCount} days consistent</span>
          </div>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🌱 Daily Consistency</span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
            {smallStep?.text || 'Drink one tall glass of water before your next task.'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            {isDone 
              ? "✨ Beautifully done! Consistency, not perfection, builds lifelong wellness." 
              : "No pressure to do everything. Just complete this one small action today."}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          {isDone && (
            <ContextualPip context="completion" layout="avatar-only" size={36} />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button
              onClick={handleComplete}
              className={`btn ${isDone ? 'btn-soft' : 'btn-primary'}`}
              style={{
                padding: '0.75rem 1.25rem',
                boxShadow: isDone ? 'none' : '0 4px 14px rgba(217, 119, 54, 0.3)',
                background: isDone ? 'var(--accent-primary-light)' : 'linear-gradient(135deg, #d97736 0%, #f48c42 100%)',
                color: isDone ? 'var(--accent-primary)' : '#ffffff'
              }}
            >
              {isDone ? (
                <>
                  <CheckCircle size={18} /> Done Today!
                </>
              ) : (
                <>
                  <Sparkles size={16} /> I Did This!
                </>
              )}
            </button>

            {onBreakItDown && !isDone && (
              <button
                onClick={onBreakItDown}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
              >
                <ListPlus size={12} /> Break It Down
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Shame-Free Reassurance Footnote */}
      <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <span>🌿 Life happens? Never any shame here.</span>
        <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>Tomorrow is another opportunity.</span>
      </div>
    </div>
  );
}
