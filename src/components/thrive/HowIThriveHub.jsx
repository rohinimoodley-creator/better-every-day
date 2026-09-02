import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { CONTENT_CATEGORIES } from '../../data/mockData';
import ThemeCreatorModal from './ThemeCreatorModal';
import BreakItDownModal from './BreakItDownModal';
import OverwhelmModal from './OverwhelmModal';
import {
  Sparkles,
  Heart,
  Target,
  BatteryCharging,
  Eye,
  MessageSquare,
  Clock,
  Palette,
  Bell,
  RotateCcw,
  ShieldCheck,
  Check,
  Zap,
  Sliders,
  Volume2,
  SlidersHorizontal,
  Flame,
  Pause,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HowIThriveHub() {
  const {
    howIThrive,
    updateHowIThrive,
    resetHowIThrive,
    userProfile,
    theme,
    setTheme,
    smallStepState
  } = useWellness();

  const [activeTab, setActiveTab] = useState('attention');
  const [isThemeCreatorOpen, setIsThemeCreatorOpen] = useState(false);
  const [isBreakItDownOpen, setIsBreakItDownOpen] = useState(false);
  const [isOverwhelmOpen, setIsOverwhelmOpen] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const triggerSaveNotification = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleUpdate = (key, value) => {
    updateHowIThrive(key, value);
    triggerSaveNotification();
  };

  const handleToggleContentPreference = (categoryName, listType) => {
    const current = howIThrive.contentPreferences || { showMore: [], showLess: [], hidden: [] };
    const list = current[listType] || [];
    const updated = list.includes(categoryName)
      ? list.filter(c => c !== categoryName)
      : [...list, categoryName];

    updateHowIThrive('contentPreferences', {
      ...current,
      [listType]: updated
    });
    triggerSaveNotification();
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      
      {/* Hero Intro Header */}
      <div 
        className="card-glass" 
        style={{ 
          padding: '1.5rem', 
          marginBottom: '1.5rem', 
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, var(--accent-primary-light) 100%)',
          border: '2px solid var(--border-glass)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
          <span className="pill-badge primary">
            <Sliders size={12} /> Adaptive Experience Engine
          </span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          How I Thrive 🌱
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', fontStyle: 'italic' }}>
          "Better Every Day adapts to me. I don't have to adapt to the app."
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
          Everyone works differently. Customize your attention styles, sensory inputs, communication tones, and schedules without needing to identify with any medical diagnosis.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { id: 'attention', label: '🎯 Attention & Tasks' },
          { id: 'energy', label: '🔋 Energy & Overwhelm' },
          { id: 'streaks', label: '⏸️ Flexible Streaks' },
          { id: 'communication', label: '💬 Communication Tone' },
          { id: 'sensory', label: '👂 Sensory & Mascot' },
          { id: 'appearance', label: '🎨 Appearance & Themes' },
          { id: 'content', label: '🚫 Content Filters' },
          { id: 'notifications', label: '🔔 Notifications & Budget' },
          { id: 'reset', label: '🛡️ Privacy & Reset' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-pill)',
              border: activeTab === tab.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: activeTab === tab.id ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
              color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          TAB 1: ATTENTION & TASKS
          ========================================================================= */}
      {activeTab === 'attention' && (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Attention & Task Structure</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Choose how daily tasks are presented to prevent executive fatigue.
          </p>

          {/* Task Style: One at a time vs Full Day */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Daily Display Style
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              {[
                { id: 'one_at_a_time', title: '🎯 One Task at a Time (One Thing Mode)', desc: 'Focus strictly on the single next action. No distracting competing lists.' },
                { id: 'full_day', title: '📋 Full Day Snapshot', desc: 'See all metrics, daily recommendations, and habits at once.' }
              ].map(opt => {
                const active = howIThrive.taskStyle === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleUpdate('taskStyle', opt.id)}
                    style={{
                      background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                      border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {opt.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{opt.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progressive Complexity */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Progressive Interface Complexity
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'simple', label: 'Simple (Essentials Only)', desc: '💧 Water, 🚶 Move, 🥗 Food, 💛 Mind' },
                { id: 'standard', label: 'Standard (Balanced)', desc: 'Steps, Sleep, Macros, Guidance' },
                { id: 'advanced', label: 'Advanced (Deep Insights)', desc: 'Micronutrients, Trends, Statistics' }
              ].map(lvl => {
                const active = howIThrive.complexityLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => handleUpdate('complexityLevel', lvl.id)}
                    style={{
                      background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                      border: active ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{lvl.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lvl.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Break It Down Launcher */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.2rem 0' }}>Break It Down Tool</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Break complex tasks like dinner, workouts, or evening routines into micro-steps.
              </p>
            </div>
            <button 
              onClick={() => setIsBreakItDownOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ flexShrink: 0 }}
            >
              Open Break It Down
            </button>
          </div>

          {/* Routine & Timer Pacing Toggles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                Routine Predictability
              </label>
              <select 
                value={howIThrive.routineStyle || 'flexible'} 
                onChange={e => handleUpdate('routineStyle', e.target.value)}
                className="select-field"
                style={{ fontSize: '0.82rem' }}
              >
                <option value="flexible">Flexible Routines (Adaptive)</option>
                <option value="predictable">Predictable Routines (Consistent order)</option>
              </select>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                Timers & Pacing
              </label>
              <select 
                value={howIThrive.timerPreference || 'countdowns'} 
                onChange={e => handleUpdate('timerPreference', e.target.value)}
                className="select-field"
                style={{ fontSize: '0.82rem' }}
              >
                <option value="countdowns">Visual Countdowns</option>
                <option value="stopwatch">Open Stopwatch</option>
                <option value="none">No Timers (Untimed)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ENERGY & OVERWHELM
          ========================================================================= */}
      {activeTab === 'energy' && (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Energy & Overwhelm Modes</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Tools to protect your capacity on difficult, low-spoon, or overwhelmed days.
          </p>

          {/* Low Energy Mode Switch */}
          <div 
            style={{
              background: howIThrive.lowEnergyMode ? 'var(--accent-secondary-light)' : 'var(--bg-tertiary)',
              border: `1px solid ${howIThrive.lowEnergyMode ? 'var(--accent-secondary)' : 'var(--border-subtle)'}`,
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '1.3rem' }}>🔋</span>
                <h4 style={{ fontSize: '1.05rem', margin: 0 }}>Low Energy Mode Today</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, maxWidth: 480 }}>
                Automatically scales recommendations down (30-min workout → 5-min stretch; meal prep → simple snack; 30-min journal → 1 sentence).
              </p>
            </div>

            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={howIThrive.lowEnergyMode}
                onChange={e => handleUpdate('lowEnergyMode', e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Overwhelm Mode Launcher */}
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.08) 0%, rgba(214, 64, 98, 0.08) 100%)',
              border: '1px solid rgba(123, 97, 255, 0.25)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}
          >
            <div>
              <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.2rem 0' }}>🆘 I'm Overwhelmed (Emergency Soother)</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Temporarily pauses all lists and replaces the screen with Pause (breath), Reset (grounding), and One Small Thing.
              </p>
            </div>

            <button 
              onClick={() => setIsOverwhelmOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ background: 'var(--accent-purple)' }}
            >
              Open Calm Space
            </button>
          </div>

          {/* "Don't Rush Me" Instruction Speed */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              "Don't Rush Me" — Exercise & Breathing Pacing
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'standard', label: 'Standard Pacing', desc: 'Normal automatic timing between steps' },
                { id: 'slower', label: 'Slower Pacing', desc: '50% longer resting pauses between exercises' },
                { id: 'manual_advance', label: 'Manual Advance ✋', desc: 'You choose when to click next. Never auto-advances.' }
              ].map(sp => {
                const active = howIThrive.instructionSpeed === sp.id;
                return (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => handleUpdate('instructionSpeed', sp.id)}
                    style={{
                      background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                      border: active ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{sp.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{sp.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: FLEXIBLE STREAKS & BREAKS
          ========================================================================= */}
      {activeTab === 'streaks' && (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Flexible Streaks & Shame-Free Pauses</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Streaks must never punish you for being human. Pause your streak anytime to protect your progress.
          </p>

          {/* Streak Status Box */}
          <div 
            style={{
              background: howIThrive.streakPaused ? 'rgba(123, 97, 255, 0.1)' : 'var(--accent-secondary-light)',
              border: `1px solid ${howIThrive.streakPaused ? 'var(--accent-purple)' : 'var(--accent-secondary)'}`,
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={20} color="var(--accent-secondary)" />
                <h4 style={{ fontSize: '1.1rem', margin: 0 }}>
                  {howIThrive.streakPaused ? '⏸️ Streak Currently Paused' : `🔥 Active Consistency: ${smallStepState.streakCount} Days`}
                </h4>
              </div>

              <span className="pill-badge primary">
                {howIThrive.streakPaused ? 'Progress Safe' : 'Protected'}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
              {howIThrive.streakPaused 
                ? `You've completed ${smallStepState.streakCount} days. Your progress is completely safe. We'll be right here when you're ready to pick back up.`
                : "Need time away for illness, travel, or a rest day? Pause anytime without losing your count."}
            </p>

            {howIThrive.streakPaused ? (
              <button 
                onClick={() => handleUpdate({ streakPaused: false, streakPauseReason: null })}
                className="btn btn-primary btn-sm"
              >
                <Play size={14} /> Resume My Streak Today
              </button>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  { id: 'rest_day', label: '⏸️ Take Rest Day' },
                  { id: 'recovery', label: '🩹 Illness / Recovery Break' },
                  { id: 'travel', label: '✈️ Travel / Vacation Break' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleUpdate({ streakPaused: true, streakPauseReason: r.id })}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem' }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Master Streak Enable / Disable */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                Track Streak Counter
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                If streak numbers cause you stress, you can disable them entirely.
              </span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={howIThrive.streaksEnabled}
                onChange={e => handleUpdate('streaksEnabled', e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: COMMUNICATION TONE
          ========================================================================= */}
      {activeTab === 'communication' && (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Communication Tone</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Choose how Better Every Day and Pip speak with you across tasks, affirmations, and check-ins.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              {
                id: 'soft_gentle',
                name: '🌸 Soft & Gentle',
                sample: '"You don\'t have to do everything today. Would you like to take one small step?"',
                tone: 'Compassionate, unhurried, reassuring'
              },
              {
                id: 'direct_practical',
                name: '🎯 Direct & Practical',
                sample: '"Next action: drink a glass of water."',
                tone: 'Clear, concise, no extra fluff'
              },
              {
                id: 'detailed',
                name: '📊 Detailed & Contextual',
                sample: '"You\'ve logged two glasses of water today. Your target is six more for optimal focus."',
                tone: 'Explanatory, informational, numbers-oriented'
              },
              {
                id: 'playful',
                name: '✨ Playful & Cheerful',
                sample: '"Bestie, let\'s get that tiny win! 💛 Adventure awaits."',
                tone: 'Uplifting, cheeky, enthusiastic'
              },
              {
                id: 'minimal',
                name: '▪️ Minimal',
                sample: '"Drink water."',
                tone: 'Ultra brief, zero cognitive load'
              }
            ].map(style => {
              const active = howIThrive.communicationStyle === style.id;
              return (
                <div
                  key={style.id}
                  onClick={() => handleUpdate('communicationStyle', style.id)}
                  style={{
                    background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    border: `2px solid ${active ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {style.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{style.tone}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--accent-primary)', margin: 0 }}>
                    {style.sample}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: SENSORY & MASCOT
          ========================================================================= */}
      {activeTab === 'sensory' && (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Sensory & Mascot Controls</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Fine-tune animation physics, sound triggers, and companion presence.
          </p>

          {/* Animation Level */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
              Animation & Movement
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'standard', label: 'Standard Animation', desc: 'Smooth spring physics & confetti' },
                { id: 'reduced', label: 'Reduced Motion', desc: 'No floating mascot or bouncy effects' },
                { id: 'minimal', label: 'Minimal / None', desc: 'Instant static transitions' }
              ].map(a => {
                const active = howIThrive.animationLevel === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleUpdate('animationLevel', a.id)}
                    style={{
                      background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                      border: active ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{a.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mascot Interaction Level */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
              Mascot (Pip) Interaction Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
              {[
                { id: 'full', label: 'Full', desc: 'Regular quotes & tips' },
                { id: 'occasional', label: 'Occasional', desc: 'Milestones & cheers only' },
                { id: 'minimal', label: 'Minimal', desc: 'Visual avatar only' },
                { id: 'off', label: 'Off', desc: 'Disable companion' }
              ].map(m => {
                const active = howIThrive.mascotInteractionLevel === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleUpdate('mascotInteractionLevel', m.id)}
                    style={{
                      background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                      border: active ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      padding: '0.65rem 0.4rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{m.label}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Controls */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
              Independent Audio Controls
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {[
                { key: 'soundInterface', label: 'UI Click & Button Sounds' },
                { key: 'soundMascot', label: 'Mascot Chimes & Milestones' },
                { key: 'soundNotification', label: 'Gentle Notification Reminders' },
                { key: 'soundWellness', label: 'Calm Audio & Soundscapes' }
              ].map(s => (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>{s.label}</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={howIThrive[s.key] !== false}
                      onChange={e => handleUpdate(s.key, e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: APPEARANCE & THEMES
          ========================================================================= */}
      {activeTab === 'appearance' && (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.2rem 0' }}>Appearance & Themes 🎨</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Customize color palettes, contrast ratios, and text size scaling.
              </p>
            </div>
            <button 
              onClick={() => setIsThemeCreatorOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <Palette size={14} /> Open Theme Creator
            </button>
          </div>

          {/* High Contrast Mode Toggle */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                High-Contrast Mode (WCAG AAA)
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Bold borders, high-contrast foregrounds, and zero reliance on color alone.
              </span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={howIThrive.highContrast}
                onChange={e => handleUpdate('highContrast', e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Text Size Scaling */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
              Text Size Scaling
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'standard', label: 'Standard Text (100%)' },
                { id: 'large', label: 'Large Text (115%)' },
                { id: 'extra_large', label: 'Extra Large (125%)' }
              ].map(ts => (
                <button
                  key={ts.id}
                  onClick={() => handleUpdate('textSize', ts.id)}
                  style={{
                    background: howIThrive.textSize === ts.id ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    border: howIThrive.textSize === ts.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    padding: '0.65rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  {ts.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: CONTENT FILTERS
          ========================================================================= */}
      {activeTab === 'content' && (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Content Preferences & Exclusions</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You control what categories appear in your recommendations, feeds, and searches. Private & non-diagnostic.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {CONTENT_CATEGORIES.map(cat => {
              const prefs = howIThrive.contentPreferences || { showMore: [], showLess: [], hidden: [] };
              const isHidden = prefs.hidden?.includes(cat.id);
              const isMore = prefs.showMore?.includes(cat.id);

              return (
                <div 
                  key={cat.id}
                  style={{
                    background: isHidden ? 'rgba(0,0,0,0.03)' : 'var(--bg-tertiary)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: isHidden ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>{cat.icon}</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button
                      onClick={() => handleToggleContentPreference(cat.id, 'showMore')}
                      style={{
                        padding: '0.25rem 0.55rem',
                        borderRadius: 'var(--radius-pill)',
                        border: isMore ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: isMore ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                        color: isMore ? 'var(--accent-primary)' : 'var(--text-muted)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      ⭐ Show More
                    </button>
                    <button
                      onClick={() => handleToggleContentPreference(cat.id, 'hidden')}
                      style={{
                        padding: '0.25rem 0.55rem',
                        borderRadius: 'var(--radius-pill)',
                        border: isHidden ? '1px solid var(--accent-rose)' : '1px solid var(--border-subtle)',
                        background: isHidden ? 'rgba(214, 64, 98, 0.15)' : 'var(--bg-secondary)',
                        color: isHidden ? 'var(--accent-rose)' : 'var(--text-muted)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {isHidden ? '🚫 Hidden' : 'Hide Topic'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 8: NOTIFICATIONS & BUDGET
          ========================================================================= */}
      {activeTab === 'notifications' && (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Notification Budget & Smart Bundling</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Never get overwhelmed by constant app pings. Set your strict daily notification ceiling.
          </p>

          {/* Daily Budget Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
              Daily Maximum Wellness Notification Budget
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {['none', 1, 2, 3, 5, 10, 'unlimited'].map(b => (
                <button
                  key={b}
                  onClick={() => handleUpdate('notificationBudget', b)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-pill)',
                    border: howIThrive.notificationBudget === b ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: howIThrive.notificationBudget === b ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    color: howIThrive.notificationBudget === b ? 'var(--accent-primary)' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {b === 'none' ? '🚫 Zero (None)' : b === 'unlimited' ? '♾️ Unlimited' : `${b} per day`}
                </button>
              ))}
            </div>
          </div>

          {/* Smart Bundling Preview */}
          <div style={{ background: 'var(--accent-primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              💡 Smart Bundling Enabled
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
              Instead of 5 separate alerts, the app combines pending items into one gentle update: <br/>
              <em>"💛 Evening Check-In: You're 2 glasses short of hydration & your gratitude space is ready. [Take 2 min]"</em>
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 9: PRIVACY & RESET
          ========================================================================= */}
      {activeTab === 'reset' && (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Privacy Guarantee & Reset Personalization</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You maintain 100% control over your personalization settings.
          </p>

          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}>🔒 Strict Non-Diagnostic Privacy</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              Your preferences are stored locally on your device. Better Every Day never assigns diagnostic labels (like ADHD or Autism) and never shares your sensory or executive function settings with other connected users.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}>Reset Personalization Settings</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              This restores all How I Thrive settings to sensible defaults. Your logged check-ins, journals, and health logs will remain completely intact.
            </p>

            <button
              onClick={() => {
                resetHowIThrive();
                triggerSaveNotification();
              }}
              className="btn btn-secondary"
              style={{ color: 'var(--accent-rose)' }}
            >
              <RotateCcw size={15} /> Reset How I Thrive to Defaults
            </button>
          </div>
        </div>
      )}

      {/* Toast Save Indicator */}
      {showSavedToast && (
        <div 
          style={{
            position: 'fixed',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--accent-primary)',
            color: '#ffffff',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.85rem',
            fontWeight: 700,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 300,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          ✓ Adaptive Preference Saved!
        </div>
      )}

      {/* Modals */}
      <ThemeCreatorModal isOpen={isThemeCreatorOpen} onClose={() => setIsThemeCreatorOpen(false)} />
      <BreakItDownModal isOpen={isBreakItDownOpen} onClose={() => setIsBreakItDownOpen(false)} />
      <OverwhelmModal isOpen={isOverwhelmOpen} onClose={() => setIsOverwhelmOpen(false)} />
    </div>
  );
}
