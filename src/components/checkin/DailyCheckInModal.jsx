import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { processUserFeedbackQuery } from '../../engine/wellnessIntelligenceEngine';
import { 
  X, 
  Sparkles, 
  Check, 
  Heart, 
  MessageSquare, 
  Send, 
  Lightbulb, 
  ArrowRight,
  HelpCircle,
  Brain,
  Coffee,
  Smile,
  Zap,
  Moon,
  Wind
} from 'lucide-react';
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

const ASK_PROMPTS = [
  "Why am I so tired today?",
  "I really want chocolate.",
  "I don't feel like exercising.",
  "I've had a lot on my mind.",
  "What should I focus on today?",
  "I don't know what I need today."
];

export default function DailyCheckInModal({ isOpen, onClose }) {
  const {
    dailyCheckIn,
    recordCheckIn,
    userProfile,
    hydrationMl,
    activeWorkoutMinutes,
    completedWorkouts,
    stepCount,
    loggedMeals,
    cravingsLogs,
    sleepLogs,
    journalEntries,
    discoveredGratitude,
    cycleData
  } = useWellness();

  // Guided Check-In State
  const [mood, setMood] = useState(dailyCheckIn?.mood || 'good');
  const [energy, setEnergy] = useState(dailyCheckIn?.energy || 3);
  const [stress, setStress] = useState(dailyCheckIn?.stress || 2);
  const [sleep, setSleep] = useState(dailyCheckIn?.sleep || 4);
  const [bodyTags, setBodyTags] = useState(dailyCheckIn?.bodyTags || ['Calm']);

  // Open Check-In (Ask Better Every Day) State
  const [openQuery, setOpenQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  if (!isOpen) return null;

  const toggleBodyTag = (tag) => {
    setBodyTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleRunAiQuery = (questionText) => {
    const q = (questionText || openQuery).trim();
    if (!q) return;

    setIsAsking(true);
    const contextData = {
      userProfile,
      checkIn: { mood, energy: Number(energy), stress: Number(stress), sleep: Number(sleep), bodyTags },
      dailyCheckIn,
      hydrationMl,
      activeWorkoutMinutes,
      completedWorkouts,
      stepCount,
      loggedMeals,
      cravingsLogs,
      sleepLogs,
      journalEntries,
      discoveredGratitude,
      cycleData
    };

    const result = processUserFeedbackQuery(q, contextData);
    setAiResponse(result);
    setOpenQuery('');
    setIsAsking(false);

    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 }
      });
    } catch(e) {}
  };

  const handleSaveCheckIn = () => {
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
    <div className="modal-backdrop" onClick={onClose} id="daily-checkin-modal-backdrop">
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          maxWidth: '560px',
          width: '94%',
          padding: '1.75rem',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Heart size={12} /> Daily Check-In
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
              Tell Better Every Day how you're doing
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
              Answer a simple question, or just share what's on your mind.
            </p>
          </div>
          <button 
            onClick={onClose} 
            id="close-daily-checkin-btn"
            aria-label="Close Daily Check-In"
            style={{ 
              background: 'var(--bg-tertiary)', 
              border: 'none', 
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer', 
              color: 'var(--text-secondary)' 
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: GUIDED CHECK-IN (🌱) */}
        {/* ========================================================================= */}
        <div style={{ marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)' }}>
          {/* Mood Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              😊 How are you feeling right now?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
              {MOODS.map(m => {
                const active = mood === m.id;
                return (
                  <button
                    key={m.id}
                    id={`checkin-mood-${m.id}`}
                    type="button"
                    onClick={() => setMood(m.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.55rem 0.2rem',
                      background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                      border: active ? `2px solid ${m.color}` : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{m.emoji}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body Signals / What do you need today? */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.45rem' }}>
              💭 What is your body experiencing today?
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {BODY_SIGNALS.map(tag => {
                const active = bodyTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    id={`checkin-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => toggleBodyTag(tag)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.78rem',
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

          {/* 1-5 Metric Sliders (Energy, Stress, Sleep) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            {/* Energy */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>⚡ Energy Level</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{energy} / 5 {energy <= 2 ? '(Gentle)' : energy >= 4 ? '(High)' : '(Steady)'}</span>
              </div>
              <input
                id="checkin-slider-energy"
                type="range"
                min="1"
                max="5"
                step="1"
                value={energy}
                onChange={e => setEnergy(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            {/* Stress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>🍃 Stress Level</span>
                <span style={{ fontWeight: 700, color: stress >= 4 ? 'var(--accent-rose)' : 'var(--accent-primary)' }}>
                  {stress} / 5 {stress <= 2 ? '(Calm)' : stress >= 4 ? '(Elevated)' : '(Manageable)'}
                </span>
              </div>
              <input
                id="checkin-slider-stress"
                type="range"
                min="1"
                max="5"
                step="1"
                value={stress}
                onChange={e => setStress(e.target.value)}
                style={{ width: '100%', accentColor: stress >= 4 ? 'var(--accent-rose)' : 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            {/* Sleep */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>🌙 Sleep Quality</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>
                  {sleep} / 5 {sleep <= 2 ? '(Restless)' : sleep >= 4 ? '(Deep)' : '(Okay)'}
                </span>
              </div>
              <input
                id="checkin-slider-sleep"
                type="range"
                min="1"
                max="5"
                step="1"
                value={sleep}
                onChange={e => setSleep(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
              />
            </div>
          </div>

          <button 
            id="save-daily-checkin-btn"
            className="btn btn-primary" 
            onClick={handleSaveCheckIn}
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.92rem', marginTop: '1.25rem', gap: '0.4rem' }}
          >
            <Check size={16} /> Save Daily Check-In
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: OPEN CHECK-IN — 💬 SOMETHING ELSE ON YOUR MIND? */}
        {/* ========================================================================= */}
        <div 
          id="ask-better-every-day-section"
          style={{
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--accent-primary-light) 100%)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '1.1rem' }}>💬</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Something else on your mind?
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.85rem 0' }}>
            <strong>Ask Better Every Day</strong> — tap any thought below or type whatever is happening today:
          </p>

          {/* Quick preset prompt chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {ASK_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                id={`ask-bed-chip-${idx}`}
                type="button"
                onClick={() => handleRunAiQuery(promptText)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                “{promptText}”
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleRunAiQuery(); }}
            style={{ display: 'flex', gap: '0.5rem', marginBottom: aiResponse ? '1rem' : '0' }}
          >
            <input
              id="ask-bed-custom-input"
              type="text"
              placeholder="Tell Better Every Day what's happening..."
              value={openQuery}
              onChange={e => setOpenQuery(e.target.value)}
              className="input-field"
              style={{ flex: 1, fontSize: '0.84rem', padding: '0.6rem 0.85rem' }}
            />
            <button 
              type="submit" 
              id="ask-bed-submit-btn"
              className="btn btn-primary" 
              disabled={isAsking}
              style={{ gap: '0.35rem', padding: '0.6rem 1rem', fontSize: '0.84rem' }}
            >
              <Sparkles size={14} /> Ask
            </button>
          </form>

          {/* AI Response Card */}
          {aiResponse && (
            <div 
              id="ask-bed-response-card"
              style={{ 
                background: 'var(--bg-card)', 
                padding: '1.15rem', 
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--accent-primary)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="pill-badge primary" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                  <Sparkles size={11} /> Better Every Day Response
                </span>
                <button 
                  onClick={() => setAiResponse(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem' }}
                >
                  Dismiss
                </button>
              </div>

              {aiResponse.query && (
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  “{aiResponse.query}”
                </div>
              )}

              <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.55, margin: 0 }}>
                {aiResponse.answer || aiResponse.response}
              </p>

              {aiResponse.suggestions && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Lightbulb size={12} /> Gentle Consideration
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', lineHeight: 1.45 }}>
                    {aiResponse.suggestions}
                  </p>
                </div>
              )}

              {aiResponse.oneSmallNextStep && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-primary-light)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--accent-primary)' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    One Small Step:
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {aiResponse.oneSmallNextStep}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
