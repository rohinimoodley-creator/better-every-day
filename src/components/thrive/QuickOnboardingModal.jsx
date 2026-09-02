import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Sparkles, Heart, Check, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const FEEL_OPTIONS = [
  { id: 'calm_natural', label: 'Calm & Natural', emoji: '🌿', theme: 'sage', desc: 'Soft greens, gentle encouragement, natural rhythms.' },
  { id: 'soft_gentle', label: 'Soft & Gentle', emoji: '🌸', theme: 'lavender', desc: 'Compassionate pacing, delicate tones, no pressure.' },
  { id: 'fresh_bright', label: 'Fresh & Bright', emoji: '🌊', theme: 'sage', desc: 'Clear horizons, vibrant clarity, clean lines.' },
  { id: 'calm_dark', label: 'Calm & Dark', emoji: '🌙', theme: 'twilight', desc: 'Midnight emerald, low-light relaxation, peaceful contrast.' },
  { id: 'energetic', label: 'Energetic & Focused', emoji: '🔥', theme: 'sunset', desc: 'Action-oriented momentum, direct cues, warm amber.' },
  { id: 'playful', label: 'Playful & Uplifting', emoji: '✨', theme: 'lavender', desc: 'Cheeky mascot cheers, joyful micro-wins, bubbly colors.' }
];

export default function QuickOnboardingModal({ isOpen, onClose, onOpenFullThrive }) {
  const { howIThrive, updateHowIThrive, setTheme } = useWellness();

  const [selectedFeel, setSelectedFeel] = useState(howIThrive.feelPreference || 'calm_natural');
  const [taskStyle, setTaskStyle] = useState(howIThrive.taskStyle || 'full_day');
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleFinish = (openFull = false) => {
    const match = FEEL_OPTIONS.find(f => f.id === selectedFeel);
    if (match) setTheme(match.theme);

    updateHowIThrive({
      feelPreference: selectedFeel,
      taskStyle,
      onboardingCompleted: true
    });

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch(e) {}

    onClose();
    if (openFull && onOpenFullThrive) {
      onOpenFullThrive();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
              <Sparkles size={12} /> How I Thrive
            </span>
            <h3 style={{ fontSize: '1.3rem' }}>Welcome to Better Every Day 🌱</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.45 }}>
          "Everyone works differently. Tell us what helps you feel your best, and we'll adapt Better Every Day to you."
        </p>

        {step === 1 ? (
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.6rem' }}>
              How would you like Better Every Day to feel?
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {FEEL_OPTIONS.map(opt => {
                const active = selectedFeel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedFeel(opt.id)}
                    style={{
                      padding: '0.85rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: active ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '1.4rem' }}>{opt.emoji}</span>
                      {active && (
                        <div style={{ background: 'var(--accent-primary)', color: '#fff', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{opt.label}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{opt.desc}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setStep(2)} 
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.85rem' }}
              >
                Next Step <ArrowRight size={15} />
              </button>
              <button onClick={() => handleFinish(false)} className="btn btn-secondary">
                Skip Setup
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.6rem' }}>
              How do you prefer your daily activities organized?
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {[
                { id: 'one_at_a_time', title: '🎯 One task at a time (One Thing Mode)', desc: 'Show me only the next single action to prevent feeling overwhelmed.' },
                { id: 'full_day', title: '📋 See my full day at a glance', desc: 'Display my daily pillars, recommendations, and schedules together.' }
              ].map(item => {
                const active = taskStyle === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setTaskStyle(item.id)}
                    style={{
                      background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                      border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                onClick={() => handleFinish(false)} 
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                ✨ Save & Start My Day
              </button>

              <button 
                onClick={() => handleFinish(true)}
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.82rem' }}
              >
                Want to personalize further? Open Full How I Thrive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
