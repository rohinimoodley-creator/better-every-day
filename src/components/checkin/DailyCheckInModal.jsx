import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { X, Sparkles, Check, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const MOODS = [
  { id: 'great', label: 'Great', emoji: '😄', color: '#52b788' },
  { id: 'good', label: 'Good', emoji: '🙂', color: '#40916c' },
  { id: 'okay', label: 'Okay', emoji: '😐', color: '#e09f3e' },
  { id: 'low', label: 'Low', emoji: '😔', color: '#7b61ff' },
  { id: 'difficult', label: 'Difficult', emoji: '😣', color: '#d64062' }
];

const BODY_SIGNALS = [
  'Hungry', 'Tired', 'Sore', 'Bloated', 'Energized',
  'Restless', 'Calm', 'Stressed', 'Motivated', 'Craving something'
];

export default function DailyCheckInModal({ isOpen, onClose }) {
  const { dailyCheckIn, recordCheckIn } = useWellness();

  const [mood, setMood] = useState(dailyCheckIn?.mood || 'good');
  const [energy, setEnergy] = useState(dailyCheckIn?.energy || 3);
  const [stress, setStress] = useState(dailyCheckIn?.stress || 2);
  const [sleep, setSleep] = useState(dailyCheckIn?.sleep || 4);
  const [bodyTags, setBodyTags] = useState(dailyCheckIn?.bodyTags || ['Calm']);

  if (!isOpen) return null;

  const toggleBodyTag = (tag) => {
    setBodyTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    recordCheckIn({
      mood,
      energy: Number(energy),
      stress: Number(stress),
      sleep: Number(sleep),
      bodyTags
    });

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch(e) {}

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.35rem' }}>
              <Heart size={12} /> Daily Check-In
            </span>
            <h3 style={{ fontSize: '1.35rem' }}>How is your body & mind today?</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Mood Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.6rem' }}>
            Current Mood
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
            {MOODS.map(m => {
              const active = mood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.6rem 0.2rem',
                    background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    border: active ? `2px solid ${m.color}` : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span style={{ fontSize: '1.6rem' }}>{m.emoji}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1-5 Metric Sliders (Energy, Stress, Sleep) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Energy */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>⚡ Energy Level</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{energy} / 5 {energy <= 2 ? '(Gentle)' : energy >= 4 ? '(High)' : '(Steady)'}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={energy}
              onChange={e => setEnergy(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>1 Low / Exhausted</span>
              <span>3 Balanced</span>
              <span>5 Energized</span>
            </div>
          </div>

          {/* Stress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>🍃 Stress Level</span>
              <span style={{ fontWeight: 700, color: stress >= 4 ? 'var(--accent-rose)' : 'var(--accent-primary)' }}>
                {stress} / 5 {stress <= 2 ? '(Calm)' : stress >= 4 ? '(Elevated)' : '(Manageable)'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={stress}
              onChange={e => setStress(e.target.value)}
              style={{ width: '100%', accentColor: stress >= 4 ? 'var(--accent-rose)' : 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>1 Very Peaceful</span>
              <span>3 Moderate</span>
              <span>5 Overwhelmed</span>
            </div>
          </div>

          {/* Sleep */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>🌙 Sleep Quality</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>
                {sleep} / 5 {sleep <= 2 ? '(Restless)' : sleep >= 4 ? '(Deep)' : '(Okay)'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={sleep}
              onChange={e => setSleep(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>1 Poor / Broken</span>
              <span>3 Fair</span>
              <span>5 Deeply Restored</span>
            </div>
          </div>
        </div>

        {/* Body Signals Tags */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
            What is your body experiencing?
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {BODY_SIGNALS.map(tag => {
              const active = bodyTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleBodyTag(tag)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    background: active ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: active ? '#ffffff' : 'var(--text-secondary)',
                    border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {tag} {active && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
        >
          <Sparkles size={18} /> Update Today's Guidance
        </button>
      </div>
    </div>
  );
}
