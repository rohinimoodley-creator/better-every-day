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
  ArrowLeft,
  Smile,
  Zap,
  Coffee,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';

const MOODS = [
  { id: 'great', label: 'Great', emoji: '😄', color: '#52b788', desc: 'Feeling vibrant & upbeat' },
  { id: 'good', label: 'Good', emoji: '🙂', color: '#40916c', desc: 'Pleasant & steady' },
  { id: 'okay', label: 'Okay', emoji: '😐', color: '#e09f3e', desc: 'Neutral, taking it as it comes' },
  { id: 'low', label: 'Low', emoji: '😔', color: '#7b61ff', desc: 'A bit drained or quiet' },
  { id: 'difficult', label: 'Difficult', emoji: '😣', color: '#d64062', desc: 'Challenging or heavy' }
];

const ENERGY_OPTIONS = [
  { value: 1, label: 'Gentle / Restful', icon: '🛋️', desc: 'Low energy, need softness' },
  { value: 3, label: 'Steady', icon: '🚶', desc: 'Balanced baseline pace' },
  { value: 5, label: 'High Vitality', icon: '⚡', desc: 'Raring to go & active' }
];

const DAILY_NEEDS = [
  { id: 'quiet', label: 'A quiet moment', icon: '🍃' },
  { id: 'movement', label: 'Fresh air & gentle movement', icon: '🚶' },
  { id: 'nourish', label: 'Warm, nourishing food', icon: '🥗' },
  { id: 'hydrate', label: 'Hydration boost', icon: '💧' },
  { id: 'rest', label: 'Rest & early wind-down', icon: '🌙' },
  { id: 'breath', label: 'A deep breath & stretch', icon: '🧘' },
  { id: 'encouragement', label: 'Gentle encouragement', icon: '💛' },
  { id: 'easiness', label: 'Permission to take it easy', icon: '☁️' }
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

  // Step state: 1 (Mood) | 2 (Energy) | 3 (Needs) | 4 (Completed / Ask BED)
  const [currentStep, setCurrentStep] = useState(1);

  // Check-In Form State
  const [mood, setMood] = useState(dailyCheckIn?.mood || 'good');
  const [energy, setEnergy] = useState(dailyCheckIn?.energy || 3);
  const [selectedNeeds, setSelectedNeeds] = useState(dailyCheckIn?.needs || ['A quiet moment']);

  // Open Check-In (Ask Better Every Day) State
  const [openQuery, setOpenQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  if (!isOpen) return null;

  const toggleNeed = (needLabel) => {
    setSelectedNeeds(prev => 
      prev.includes(needLabel) 
        ? prev.filter(n => n !== needLabel) 
        : [...prev, needLabel]
    );
  };

  const handleSelectMood = (moodId) => {
    setMood(moodId);
    // Smooth auto-advance to step 2 after brief delay
    setTimeout(() => {
      setCurrentStep(2);
    }, 250);
  };

  const handleRunAiQuery = (questionText) => {
    const q = (questionText || openQuery).trim();
    if (!q) return;

    setIsAsking(true);
    const contextData = {
      userProfile,
      checkIn: { mood, energy: Number(energy), needs: selectedNeeds },
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

  const handleCompleteCheckIn = () => {
    recordCheckIn({
      mood,
      energy: Number(energy),
      needs: selectedNeeds,
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

    setCurrentStep(4);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} id="daily-checkin-modal-backdrop">
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          maxWidth: '540px',
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
              {currentStep === 4 ? "You're all checked in! 🌟" : "How are you today?"}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
              {currentStep === 4 
                ? "Your gentle daily rhythm has been recorded."
                : `Step ${currentStep} of 3 — One thoughtful question at a time.`}
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
        {/* STEP 1: 😊 HOW ARE YOU FEELING TODAY?                                     */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                😊 How are you feeling today?
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
                Select what best matches your general mood right now:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.45rem' }}>
                {MOODS.map(m => {
                  const active = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      id={`checkin-mood-${m.id}`}
                      type="button"
                      onClick={() => handleSelectMood(m.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.75rem 0.25rem',
                        background: active ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                        border: active ? `2px solid ${m.color}` : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '1.75rem' }}>{m.emoji}</span>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                💬 Ask Better Every Day directly
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.35rem', padding: '0.5rem 1rem' }}
              >
                Next <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: ⚡ ENERGY LEVEL (Optional & Adaptive)                             */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  ⚡ How is your energy today?
                </h4>
                <span className="pill-badge gray" style={{ fontSize: '0.65rem' }}>
                  Optional
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
                Helps tailor movement pacing and daily suggestions without pressure.
              </p>

              {/* Quick Energy Presets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {ENERGY_OPTIONS.map(opt => {
                  const active = Number(energy) === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setEnergy(opt.value)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: active ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: active ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>{opt.icon}</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{opt.label}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{opt.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Fine-tune Slider */}
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Fine-tune rating:</span>
                  <strong style={{ color: 'var(--accent-primary)' }}>{energy} / 5</strong>
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
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <ArrowLeft size={14} /> Back
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn btn-secondary btn-sm"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.35rem', padding: '0.5rem 1rem' }}
                >
                  Next <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: 💭 WHAT DO YOU NEED TODAY?                                        */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                💭 What do you need today?
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
                Select anything that would support you most today (choose one or more):
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {DAILY_NEEDS.map(need => {
                  const active = selectedNeeds.includes(need.label);
                  return (
                    <button
                      key={need.id}
                      type="button"
                      onClick={() => toggleNeed(need.label)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        fontWeight: active ? 700 : 500,
                        background: active ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                        color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                        border: active ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span>{need.icon}</span>
                        <span>{need.label}</span>
                      </span>
                      {active && <Check size={14} color="var(--accent-primary)" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <ArrowLeft size={14} /> Back
              </button>

              <button
                id="save-daily-checkin-btn"
                type="button"
                onClick={handleCompleteCheckIn}
                className="btn btn-primary"
                style={{ padding: '0.55rem 1.25rem', gap: '0.35rem', fontWeight: 800 }}
              >
                <Check size={15} /> Save Check-In
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: COMPLETED SUMMARY + 💬 ASK BETTER EVERY DAY                       */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div style={{ animation: 'fadeIn 0.2s ease-out', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Compassionate Summary Card */}
            <div 
              style={{
                background: 'var(--bg-secondary)',
                padding: '1.15rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                borderLeft: '4px solid var(--accent-primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.96rem', color: 'var(--text-primary)' }}>
                  Today's Check-In Summary 🌱
                </strong>
                <span className="pill-badge primary" style={{ fontSize: '0.68rem' }}>
                  Logged ✓
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Mood: <strong>{MOODS.find(m => m.id === mood)?.label || 'Good'}</strong> • Energy: <strong>{energy}/5</strong>
                {selectedNeeds.length > 0 && (
                  <div style={{ marginTop: '0.3rem' }}>
                    Needs: <em>{selectedNeeds.join(', ')}</em>
                  </div>
                )}
              </div>
            </div>

            {/* Something else on your mind? 💬 Ask Better Every Day */}
            <div 
              id="ask-better-every-day-section"
              style={{
                background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--accent-primary-light) 100%)',
                border: '1.5px solid var(--accent-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '1.2rem' }}>💬</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Something else on your mind?
                </h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0' }}>
                <strong>Ask Better Every Day</strong> — tap a thought or type what's on your mind:
              </p>

              {/* Quick Thought Prompts */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
                {ASK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRunAiQuery(prompt)}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      background: 'var(--bg-secondary)',
                      color: 'var(--accent-primary)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>

              {/* Query Input */}
              <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  value={openQuery}
                  onChange={e => setOpenQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRunAiQuery(openQuery)}
                  placeholder="Ask or share anything (e.g. why do I feel sluggish?)"
                  className="input-field"
                  style={{ fontSize: '0.82rem', flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleRunAiQuery(openQuery)}
                  disabled={!openQuery.trim() || isAsking}
                  className="btn btn-primary"
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', gap: '0.3rem' }}
                >
                  <Send size={13} /> Ask
                </button>
              </div>

              {/* AI Response Card */}
              {aiResponse && (
                <div 
                  style={{ 
                    background: 'var(--bg-card)', 
                    padding: '1rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-glass)',
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                    <Sparkles size={14} color="var(--accent-primary)" />
                    <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>Better Every Day Observation:</strong>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
                    {aiResponse.suggestion || aiResponse.response || aiResponse}
                  </p>
                </div>
              )}
            </div>

            {/* Done Button */}
            <button
              type="button"
              onClick={onClose}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.92rem', fontWeight: 800 }}
            >
              Done & Continue
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
