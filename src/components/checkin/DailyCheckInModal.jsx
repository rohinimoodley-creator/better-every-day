import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { processUserFeedbackQuery } from '../../engine/wellnessIntelligenceEngine';
import { 
  X, 
  Sparkles, 
  Check, 
  Heart, 
  Send, 
  Zap, 
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

const MOODS = [
  { id: 'great', label: 'Great', emoji: '😄', color: '#52b788', desc: 'Feeling vibrant & upbeat' },
  { id: 'good', label: 'Good', emoji: '🙂', color: '#40916c', desc: 'Pleasant & steady' },
  { id: 'okay', label: 'Okay', emoji: '😐', color: '#e09f3e', desc: 'Neutral, taking it as it comes' },
  { id: 'low', label: 'Low', emoji: '😔', color: '#7b61ff', desc: 'A bit drained or quiet' },
  { id: 'difficult', label: 'Difficult', emoji: '😣', color: '#d64062', desc: 'Challenging or heavy' }
];

const ENERGY_LEVELS = [
  { value: 1, label: 'Gentle / Restful', icon: '🛋️', shortDesc: 'Low energy, honoring rest' },
  { value: 2, label: 'Soft Pace', icon: '☕', shortDesc: 'Warming up gently' },
  { value: 3, label: 'Steady', icon: '🚶', shortDesc: 'Balanced baseline pace' },
  { value: 4, label: 'Energized', icon: '⚡', shortDesc: 'Good stamina & focus' },
  { value: 5, label: 'High Vitality', icon: '🌟', shortDesc: 'Full of vitality & ready' }
];

const ASK_PROMPTS = [
  "Why am I so tired today?",
  "I really want chocolate.",
  "I don't feel like exercising.",
  "What should I focus on today?"
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

  // 1. Mood State
  const [mood, setMood] = useState(dailyCheckIn?.mood || 'good');

  // 2. Energy State (1 to 5)
  const [energy, setEnergy] = useState(dailyCheckIn?.energy || 3);

  // 3. Save / Confirmation state
  const [savedToast, setSavedToast] = useState(false);

  // 4. Optional Ask Better Every Day State
  const [openQuery, setOpenQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [showAskBed, setShowAskBed] = useState(false);

  if (!isOpen) return null;

  const currentEnergyObj = ENERGY_LEVELS.find(e => e.value === Number(energy)) || ENERGY_LEVELS[2];

  const handleSaveCheckIn = () => {
    recordCheckIn({
      mood,
      energy: Number(energy),
      isCompleted: true,
      date: new Date().toISOString().split('T')[0]
    });

    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.6 }
      });
    } catch(e) {}

    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  const handleRunAiQuery = (questionText) => {
    const q = (questionText || openQuery).trim();
    if (!q) return;

    setIsAsking(true);
    const contextData = {
      userProfile,
      checkIn: { mood, energy: Number(energy) },
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
        particleCount: 20,
        spread: 40,
        origin: { y: 0.7 }
      });
    } catch(e) {}
  };

  return (
    <div className="modal-backdrop" onClick={onClose} id="daily-checkin-modal-backdrop">
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          maxWidth: '520px',
          width: '94%',
          padding: '1.6rem 1.4rem',
          borderRadius: 'var(--radius-xl)',
          animation: 'scaleUp 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.35rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 800 }}>
              <Heart size={12} /> Daily Check-In
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0 0 0.15rem 0', color: 'var(--text-primary)' }}>
              How are you feeling today?
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
              Quick, calm daily pulse to personalize your rhythm.
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
        {/* 1. MOOD EMOJIS SELECTION                                                  */}
        {/* ========================================================================= */}
        <div style={{ marginBottom: '1.35rem' }}>
          <label style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.45rem' }}>
            1. Select Your Mood
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.45rem' }}>
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
                    padding: '0.75rem 0.2rem',
                    background: active ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                    border: active ? `2px solid ${m.color}` : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transform: active ? 'scale(1.04)' : 'scale(1)',
                    boxShadow: active ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '1.8rem' }}>{m.emoji}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ENERGY BAR SELECTION                                                   */}
        {/* ========================================================================= */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
            <label style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              2. Energy Level
            </label>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>{currentEnergyObj.icon}</span>
              <span>{currentEnergyObj.label} ({energy}/5)</span>
            </span>
          </div>

          {/* Interactive Segmented Energy Bar */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '0.35rem',
              background: 'var(--bg-tertiary)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '0.5rem'
            }}
          >
            {ENERGY_LEVELS.map(lvl => {
              const active = Number(energy) === lvl.value;
              const isFilled = Number(energy) >= lvl.value;
              return (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => setEnergy(lvl.value)}
                  style={{
                    padding: '0.65rem 0.2rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: active 
                      ? 'var(--accent-primary)' 
                      : isFilled 
                        ? 'var(--accent-primary-light)' 
                        : 'var(--bg-secondary)',
                    color: active ? '#ffffff' : isFilled ? 'var(--accent-primary)' : 'var(--text-muted)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.15rem',
                    transition: 'all 0.15s ease'
                  }}
                  title={lvl.shortDesc}
                >
                  <span style={{ fontSize: '1rem' }}>{lvl.icon}</span>
                  <span>{lvl.value}</span>
                </button>
              );
            })}
          </div>

          {/* Helper label */}
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            {currentEnergyObj.shortDesc}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SAVE CHECK-IN BUTTON                                                   */}
        {/* ========================================================================= */}
        <button
          id="save-daily-checkin-btn"
          type="button"
          onClick={handleSaveCheckIn}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '0.85rem',
            fontSize: '0.96rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 14px rgba(45, 106, 79, 0.25)',
            marginBottom: '1.25rem'
          }}
        >
          {savedToast ? (
            <>
              <Check size={18} />
              <span>Check-In Saved! 🌟</span>
            </>
          ) : (
            <>
              <Check size={18} />
              <span>Save Check-In</span>
            </>
          )}
        </button>

        {/* ========================================================================= */}
        {/* 4. OPTIONAL ASK BETTER EVERY DAY                                          */}
        {/* ========================================================================= */}
        <div 
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.1rem'
          }}
        >
          <div 
            onClick={() => setShowAskBed(!showAskBed)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              userSelect: 'none',
              padding: '0.4rem 0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '1.1rem' }}>💬</span>
              <div>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Ask Better Every Day
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                  (Optional)
                </span>
              </div>
            </div>

            <button
              type="button"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer'
              }}
            >
              <span>{showAskBed ? 'Hide' : 'Ask Question'}</span>
              {showAskBed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {showAskBed && (
            <div style={{ marginTop: '0.85rem', animation: 'fadeIn 0.2s ease-out' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.65rem 0' }}>
                Ask anything about cravings, low energy, motivation, or guidance for today:
              </p>

              {/* Quick Prompt Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                {ASK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRunAiQuery(prompt)}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0.3rem 0.65rem',
                      fontSize: '0.72rem',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    💡 {prompt}
                  </button>
                ))}
              </div>

              {/* Input field */}
              <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.85rem' }}>
                <input
                  type="text"
                  value={openQuery}
                  onChange={e => setOpenQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleRunAiQuery(openQuery); }}
                  placeholder="e.g. Why am I so tired? What should I eat?"
                  className="input-field"
                  style={{ flex: 1, fontSize: '0.82rem', padding: '0.5rem 0.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => handleRunAiQuery(openQuery)}
                  disabled={isAsking || !openQuery.trim()}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', gap: '0.3rem' }}
                >
                  <Send size={13} />
                  <span>Ask</span>
                </button>
              </div>

              {/* AI Guidance Response Card */}
              {aiResponse && (
                <div 
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1.5px solid var(--accent-primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <Sparkles size={14} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      Better Every Day Insight
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.45, margin: '0 0 0.5rem 0' }}>
                    {aiResponse.answer}
                  </p>

                  {aiResponse.oneSmallNextStep && (
                    <div style={{ background: 'var(--accent-primary-light)', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.76rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      🌱 <strong>One Gentle Step:</strong> {aiResponse.oneSmallNextStep}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
