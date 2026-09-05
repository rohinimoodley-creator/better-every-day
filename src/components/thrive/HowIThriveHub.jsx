import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { CONTENT_CATEGORIES } from '../../data/mockData';
import DailyRhythmCard from './DailyRhythmCard';
import AIMemoryModal from '../intelligence/AIMemoryModal';
import CustomizeOverviewModal from '../home/CustomizeOverviewModal';
import SavedAudioModal from './SavedAudioModal';
import PipSproutAvatar from '../mascot/PipSproutAvatar';
import MascotWardrobeModal from '../mascot/MascotWardrobeModal';
import {
  Sliders,
  Flame,
  Play,
  BarChart2,
  Brain,
  Mic,
  Music,
  Clock,
  Upload,
  Sparkles
} from 'lucide-react';

export default function HowIThriveHub() {
  const {
    howIThrive,
    updateHowIThrive,
    userProfile,
    setUserProfile,
    smallStepState,
    overviewFrequency,
    updateOverviewFrequency,
    overviewPillars
  } = useWellness();

  const [activeTab, setActiveTab] = useState('rhythm');
  const [isAIMemoryOpen, setIsAIMemoryOpen] = useState(false);
  const [isCustomizeOverviewOpen, setIsCustomizeOverviewOpen] = useState(false);
  const [isSavedAudioModalOpen, setIsSavedAudioModalOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Consolidated notification states
  const [reminderTime, setReminderTime] = useState(howIThrive.reminderTime || '08:30');
  const [eveningReviewTime, setEveningReviewTime] = useState(howIThrive.eveningReviewTime || '21:00');
  const [nudgesEnabled, setNudgesEnabled] = useState(howIThrive.nudgesEnabled !== false);

  const triggerSaveNotification = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleUpdate = (key, value) => {
    updateHowIThrive(key, value);
    triggerSaveNotification();
  };

  const handleSaveNotifications = (updates) => {
    updateHowIThrive(updates);
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

  const tabs = [
    { id: 'rhythm', label: '🌱 My Daily Rhythm', desc: 'Schedule & shifts' },
    { id: 'overview', label: '📊 Home Wellness Overview', desc: 'Summary frequency' },
    { id: 'streaks', label: '🎯 Flexible Streaks', desc: 'Shame-free pauses' },
    { id: 'communication', label: '💬 Communication Tone', desc: 'Language & phrasing' },
    { id: 'sensory', label: '🐝 Sensory & Mascot', desc: 'Animations & audio' },
    { id: 'content', label: '📝 Content Preferences', desc: 'Exclusions & topics' },
    { id: 'notifications', label: '🔔 Notification Budget', desc: 'Reminders & nudges' },
    { id: 'ai_memory', label: '🤖 AI & Memory', desc: 'Personalized memory' },
    { id: 'voice', label: '🎙️ Voice & Reflection', desc: 'Transcription modes' }
  ];

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      
      {/* Hero Intro Header */}
      <div 
        className="card-glass" 
        style={{ 
          padding: '1.5rem', 
          marginBottom: '1.25rem', 
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, var(--accent-primary-light) 100%)',
          border: '2px solid var(--border-glass)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
          <span className="pill-badge primary">
            <Sliders size={12} /> Adaptive Personalization Engine
          </span>
        </div>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
          How I Thrive 🌱
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', fontStyle: 'italic' }}>
          "Better Every Day adapts to how I live, think, communicate, and prefer to use the app."
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
          Tailor your daily schedule, communication style, mascot companionship, audio thresholds, and notification volume with zero judgment.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div 
        className="card-glass"
        style={{ 
          display: 'flex', 
          gap: '0.35rem', 
          overflowX: 'auto', 
          padding: '0.5rem 0.75rem', 
          marginBottom: '1.25rem',
          scrollbarWidth: 'none'
        }}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: isActive ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                fontSize: '0.78rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: MY DAILY RHYTHM
          ========================================================================= */}
      {activeTab === 'rhythm' && (
        <DailyRhythmCard />
      )}

      {/* =========================================================================
          TAB 2: HOME WELLNESS OVERVIEW FREQUENCY
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
                <BarChart2 size={12} /> Dashboard Rhythm
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
              Home Wellness Overview Frequency 📊
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
              Choose how your wellness pillars are summarized on the Home screen.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
            {[
              { id: 'daily', label: 'Daily', desc: "Today's immediate meters" },
              { id: 'weekly', label: 'Weekly (Default)', desc: '7-Day balanced habit breakdown' },
              { id: 'monthly', label: 'Monthly', desc: '4-Week long-term habit trend' }
            ].map(opt => {
              const isSelected = overviewFrequency === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    updateOverviewFrequency && updateOverviewFrequency(opt.id);
                    triggerSaveNotification();
                  }}
                  style={{
                    padding: '0.85rem 0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: FLEXIBLE STREAKS & SHAME-FREE PAUSES
          ========================================================================= */}
      {activeTab === 'streaks' && (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
            Flexible Streaks & Shame-Free Pauses 🎯
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Streaks must never punish you for being human. Pause your streak anytime to protect your consistency progress.
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
                checked={howIThrive.streaksEnabled !== false}
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
            Communication Tone 💬
          </h3>
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
            Sensory & Mascot Controls 🐝
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Fine-tune animation physics, sound triggers, and companion presence.
          </p>

          {/* 1. Live Pip Personalisation Preview Card (Settings Pip) */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--accent-primary-light) 100%)',
              border: '1.5px solid var(--accent-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
              <PipSproutAvatar
                size={68}
                mood="happy"
                animated={howIThrive.animationLevel !== 'reduced' && howIThrive.animationLevel !== 'minimal'}
                showCustomiseBadge={true}
                onClick={() => setIsWardrobeOpen(true)}
                title="Click to customize Pip's wardrobe"
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    Pip the Sprout
                  </strong>
                  <span className="pill-badge primary" style={{ fontSize: '0.7rem' }}>
                    Personalisation Preview
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                  Customise Pip once here. Your chosen accessories and sensory settings automatically carry through every little moment.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsWardrobeOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.5rem 0.95rem', gap: '0.35rem', fontWeight: 800, flexShrink: 0 }}
            >
              <Sparkles size={14} /> Style Wardrobe & Aura
            </button>
          </div>

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
                { id: 'occasional', label: 'Occasional', desc: 'Milestones only' },
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
          <div style={{ marginBottom: '1.5rem' }}>
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

          {/* ========================================================================= */}
          {/* 🎉 DANCE BREAK PREFERENCES                                                */}
          {/* ========================================================================= */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  🎉 Dance Break Preferences
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                  Configure your one-tap Home Dance Break duration and music.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSavedAudioModalOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', gap: '0.35rem', whiteSpace: 'nowrap' }}
              >
                <Music size={13} color="var(--accent-primary)" />
                <span>🎵 View Saved Audio</span>
              </button>
            </div>

            {/* Duration Preference */}
            {(() => {
              const dancePrefs = howIThrive.danceBreakPreferences || {
                durationSec: 10,
                isCustom: false,
                customDuration: 22,
                soundType: 'builtin',
                selectedMediaId: null,
                startOffsetSec: 0
              };

              const updateDancePrefs = (updates) => {
                handleUpdate('danceBreakPreferences', {
                  ...dancePrefs,
                  ...updates
                });
              };

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
                  
                  {/* Duration Selector */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                      <Clock size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                      Default Dance Duration
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                      {[
                        { value: 5, label: '5 sec' },
                        { value: 10, label: '10 sec' },
                        { value: 15, label: '15 sec' },
                        { value: 30, label: '30 sec' }
                      ].map(p => {
                        const isSelected = !dancePrefs.isCustom && Number(dancePrefs.durationSec) === p.value;
                        return (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => updateDancePrefs({ isCustom: false, durationSec: p.value })}
                            style={{
                              padding: '0.45rem 0.25rem',
                              borderRadius: 'var(--radius-md)',
                              border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                              background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                              color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                              fontSize: '0.78rem',
                              fontWeight: isSelected ? 800 : 600,
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {p.label}
                          </button>
                        );
                      })}

                      {/* Custom Duration Button */}
                      <button
                        type="button"
                        onClick={() => updateDancePrefs({ isCustom: true })}
                        style={{
                          padding: '0.45rem 0.25rem',
                          borderRadius: 'var(--radius-md)',
                          border: dancePrefs.isCustom ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          background: dancePrefs.isCustom ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                          color: dancePrefs.isCustom ? 'var(--accent-primary)' : 'var(--text-primary)',
                          fontSize: '0.78rem',
                          fontWeight: dancePrefs.isCustom ? 800 : 600,
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        ⏱️ Custom
                      </button>
                    </div>

                    {/* Custom Input */}
                    {dancePrefs.isCustom && (
                      <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-secondary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Custom seconds:</span>
                        <input
                          type="number"
                          min="3"
                          max="300"
                          value={dancePrefs.customDuration || 22}
                          onChange={e => updateDancePrefs({ customDuration: Math.max(3, Number(e.target.value)) })}
                          style={{
                            width: 65,
                            padding: '0.3rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1.5px solid var(--accent-primary)',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.84rem',
                            fontWeight: 800,
                            textAlign: 'center'
                          }}
                        />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          (e.g. 7s, 12s, 22s, 45s, 60s)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Audio Preference */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                      <Music size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                      Preferred Dance Music
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => updateDancePrefs({ soundType: 'builtin' })}
                        style={{
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          border: dancePrefs.soundType === 'builtin' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          background: dancePrefs.soundType === 'builtin' ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                          color: dancePrefs.soundType === 'builtin' ? 'var(--accent-primary)' : 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ fontWeight: 800 }}>🎵 Better Every Day Tune</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Built-in upbeat melody</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateDancePrefs({ soundType: 'custom' })}
                        style={{
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          border: dancePrefs.soundType === 'custom' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          background: dancePrefs.soundType === 'custom' ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                          color: dancePrefs.soundType === 'custom' ? 'var(--accent-primary)' : 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ fontWeight: 800 }}>📁 Use My Own Audio</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Uploaded songs & clips</div>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: CONTENT FILTERS
          ========================================================================= */}
      {activeTab === 'content' && (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
            Content Preferences & Exclusions 📝
          </h3>
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
          TAB 7: NOTIFICATION BUDGET & CONSOLIDATED REMINDERS
          ========================================================================= */}
      {activeTab === 'notifications' && (
        <div className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
              Notification Budget & Smart Bundling 🔔
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Never get overwhelmed by constant app pings. Consolidate schedules, daily limits, and gentle nudges.
            </p>
          </div>

          {/* Daily Budget Selector */}
          <div>
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

          {/* Consolidated Scheduled Reminders (Relocated from Main Notification tab) */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, margin: '0 0 0.3rem 0', color: 'var(--text-primary)' }}>
              ⏰ Personalized Nudge Times
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
              Calm, pressure-free reminders tailored to your daily schedule.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  🌅 Morning Intention Nudge
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={e => {
                    setReminderTime(e.target.value);
                    handleSaveNotifications({ reminderTime: e.target.value });
                  }}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  🌙 Evening Reflection Reminder
                </label>
                <input
                  type="time"
                  value={eveningReviewTime}
                  onChange={e => {
                    setEveningReviewTime(e.target.value);
                    handleSaveNotifications({ eveningReviewTime: e.target.value });
                  }}
                  className="input-field"
                />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.84rem' }}>
              <input
                type="checkbox"
                checked={nudgesEnabled}
                onChange={e => {
                  setNudgesEnabled(e.target.checked);
                  handleSaveNotifications({ nudgesEnabled: e.target.checked });
                }}
                style={{ width: 16, height: 16 }}
              />
              <span>Enable gentle mid-day hydration reminders</span>
            </label>
          </div>

          {/* Smart Bundling Preview */}
          <div style={{ background: 'var(--accent-primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
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
          TAB 8: AI & MEMORY
          ========================================================================= */}
      {activeTab === 'ai_memory' && (
        <div className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                <Brain size={18} color="var(--accent-primary)" /> AI Personalization & Memory Controls 🤖
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                View, manage, or clear the contextual memory Better Every Day uses to support you.
              </p>
            </div>

            <button
              onClick={() => setIsAIMemoryOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.35rem' }}
            >
              <Brain size={14} /> Manage AI Memory
            </button>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, border: '1px solid var(--border-subtle)' }}>
            🔒 <strong>Memory Sovereignty:</strong> You have 100% control over everything stored in memory. The app remembers your preferred exercise intensity, hydration patterns, and wind-down preferences locally without external sharing. You can edit or erase memory items anytime.
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 9: VOICE RECORDING & REFLECTION
          ========================================================================= */}
      {activeTab === 'voice' && (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.35rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
            <Mic size={18} color="var(--accent-primary)" /> Voice Recording & Reflection Settings 🎙️
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Customize how voice recordings are transcribed and incorporated into your daily records.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {[
              { id: 'automatically_update', title: 'AUTOMATICALLY UPDATE', desc: 'Auto-detect meals, mood, workouts, and water from voice entries.' },
              { id: 'ask_each_time', title: 'ASK ME EVERY TIME', desc: 'Review detected events before saving to records.' },
              { id: 'never_update', title: 'TRANSCRIPT ONLY', desc: 'Save transcripts as reflections without auto-logging metrics.' }
            ].map(opt => {
              const active = (userProfile.voiceSettings?.updateMode || 'ask_each_time') === opt.id || (opt.id === 'automatically_update' && userProfile.voiceSettings?.updateMode === 'always_update');
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    setUserProfile(prev => ({
                      ...prev,
                      voiceSettings: { ...(prev.voiceSettings || {}), updateMode: opt.id }
                    }));
                    triggerSaveNotification();
                  }}
                  style={{
                    background: active ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                    border: `2px solid ${active ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                    {opt.title}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{opt.desc}</div>
                </div>
              );
            })}
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
      {isAIMemoryOpen && (
        <AIMemoryModal isOpen={isAIMemoryOpen} onClose={() => setIsAIMemoryOpen(false)} />
      )}

      {isCustomizeOverviewOpen && (
        <CustomizeOverviewModal isOpen={isCustomizeOverviewOpen} onClose={() => setIsCustomizeOverviewOpen(false)} />
      )}

      {isSavedAudioModalOpen && (
        <SavedAudioModal
          isOpen={isSavedAudioModalOpen}
          onClose={() => setIsSavedAudioModalOpen(false)}
          selectedMediaId={howIThrive.danceBreakPreferences?.selectedMediaId}
          onSelectMedia={(mediaId) => {
            handleUpdate('danceBreakPreferences', {
              ...(howIThrive.danceBreakPreferences || {}),
              soundType: 'custom',
              selectedMediaId: mediaId
            });
          }}
          startOffsetSec={howIThrive.danceBreakPreferences?.startOffsetSec || 0}
          onChangeOffset={(offset) => {
            handleUpdate('danceBreakPreferences', {
              ...(howIThrive.danceBreakPreferences || {}),
              startOffsetSec: offset
            });
          }}
          durationSec={
            howIThrive.danceBreakPreferences?.isCustom
              ? (Number(howIThrive.danceBreakPreferences?.customDuration) || 15)
              : (Number(howIThrive.danceBreakPreferences?.durationSec) || 10)
          }
        />
      )}

      {isWardrobeOpen && (
        <MascotWardrobeModal onClose={() => setIsWardrobeOpen(false)} />
      )}

    </div>
  );
}
