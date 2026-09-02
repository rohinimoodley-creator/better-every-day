import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import PrivacySecurityModal from './PrivacySecurityModal';
import HowIThriveHub from '../thrive/HowIThriveHub';
import TrustCentreHub from '../trust/TrustCentreHub';
import AIMemoryModal from '../intelligence/AIMemoryModal';
import ThemeCreatorModal from '../thrive/ThemeCreatorModal';
import OverwhelmModal from '../thrive/OverwhelmModal';
import BreakItDownModal from '../thrive/BreakItDownModal';
import EcosystemPreview from './EcosystemPreview';
import {
  User,
  Palette,
  Target,
  ShieldCheck,
  Heart,
  Sparkles,
  Moon,
  Droplet,
  Footprints,
  Sliders,
  ArrowRight,
  BarChart2,
  Shield,
  Bell,
  Mic,
  Brain,
  Eye,
  Zap,
  HelpCircle,
  Key,
  Database,
  Lock,
  Sun
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const YOU_SECTIONS = [
  { id: 'how_i_thrive', label: 'How I Thrive', icon: Sliders, desc: 'Pace & Communication' },
  { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Themes & Visuals' },
  { id: 'ai_memory', label: 'AI & Memory', icon: Brain, desc: 'Memory Controls & AI' },
  { id: 'voice', label: 'Voice', icon: Mic, desc: 'Voice Settings' },
  { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Reminders & Nudges' },
  { id: 'accessibility', label: 'Accessibility', icon: Zap, desc: 'ADHD & Calm Modes' },
  { id: 'privacy_data', label: 'Privacy & Data', icon: ShieldCheck, desc: 'Vault & Sovereignty' },
  { id: 'account', label: 'Account', icon: User, desc: 'Profile & Targets' }
];

export default function ProfileSettings({ initialSection = 'how_i_thrive' }) {
  const {
    userProfile,
    setUserProfile,
    theme,
    setTheme,
    overviewFrequency,
    updateOverviewFrequency,
    howIThrive,
    toggleOneThingMode,
    toggleLowEnergyMode
  } = useWellness();

  const [activeSection, setActiveSection] = useState(initialSection || 'how_i_thrive');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isAIMemoryOpen, setIsAIMemoryOpen] = useState(false);
  const [isThemeCreatorOpen, setIsThemeCreatorOpen] = useState(false);
  const [isOverwhelmOpen, setIsOverwhelmOpen] = useState(false);
  const [isBreakItDownOpen, setIsBreakItDownOpen] = useState(false);

  // Account State
  const [name, setName] = useState(userProfile.name || 'Rohini');
  const [goal, setGoal] = useState(userProfile.wellnessGoal || 'energy_vitality');
  const [hydrationGoal, setHydrationGoal] = useState(userProfile.hydrationGoalMl || 2250);
  const [stepGoal, setStepGoal] = useState(userProfile.stepGoal || 8000);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Notification State
  const [reminderTime, setReminderTime] = useState('08:30');
  const [eveningReviewTime, setEveningReviewTime] = useState('21:00');
  const [nudgesEnabled, setNudgesEnabled] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name,
      wellnessGoal: goal,
      hydrationGoalMl: Number(hydrationGoal),
      stepGoal: Number(stepGoal)
    }));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);

    try {
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.6 } });
    } catch(err) {}
  };

  const themes = [
    { id: 'sage', name: 'Sage Serenity', hex: '#2d6a4f', icon: '🌿' },
    { id: 'twilight', name: 'Midnight Emerald', hex: '#52b788', icon: '🌙' },
    { id: 'sunset', name: 'Sunset Warmth', hex: '#d95d39', icon: '🌅' },
    { id: 'lavender', name: 'Lavender Dream', hex: '#6c5ce7', icon: '🌸' }
  ];

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 1. Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
              <User size={12} /> You & Preferences
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Personalisation & Settings 👤
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Tailor Better Every Day to your personal pace, privacy preferences, and daily rhythm.
          </p>
        </div>

        <button 
          onClick={() => setIsPrivacyModalOpen(true)}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.35rem', fontSize: '0.78rem' }}
        >
          <ShieldCheck size={14} color="var(--accent-primary)" /> Data Vault 🔒
        </button>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div 
        className="card-glass"
        style={{
          padding: '0.65rem 0.85rem',
          display: 'flex',
          gap: '0.35rem',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}
      >
        {YOU_SECTIONS.map(sec => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: isActive ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.78rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
            >
              <Icon size={14} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Section Views */}
      <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
        
        {/* 3.1 HOW I THRIVE */}
        {activeSection === 'how_i_thrive' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card-glass" style={{ padding: '1.25rem 1.4rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                Home Wellness Overview Frequency 📊
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.85rem 0' }}>
                Choose how your wellness pillars are summarized on the Home screen.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { id: 'daily', label: 'Daily', desc: "Today's meters" },
                  { id: 'weekly', label: 'Weekly', desc: '7-Day breakdown (Default)' },
                  { id: 'monthly', label: 'Monthly', desc: '4-Week habit trend' }
                ].map(opt => {
                  const isSelected = overviewFrequency === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateOverviewFrequency && updateOverviewFrequency(opt.id)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                        background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {opt.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <HowIThriveHub />
          </div>
        )}

        {/* 3.2 APPEARANCE */}
        {activeSection === 'appearance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card-glass" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Palette size={17} color="var(--accent-primary)" /> Color Palette & Themes
                </h3>

                <button
                  onClick={() => setIsThemeCreatorOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  <Sparkles size={14} /> Custom Theme AI
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                {themes.map(th => {
                  const active = theme === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => setTheme(th.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.85rem 1rem',
                        background: active ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                        border: active ? `2px solid ${th.hex}` : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>{th.icon}</span>
                      <div>
                        <div>{th.name}</div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{active ? 'Active' : 'Select'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3.3 AI & MEMORY */}
        {activeSection === 'ai_memory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card-glass" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Brain size={17} color="var(--accent-primary)" /> AI Personalisation & Memory Controls
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

              <div style={{ background: 'var(--bg-secondary)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                🔒 <strong>Memory Sovereignty:</strong> You have 100% control over everything stored in memory. You can edit or erase memory items anytime.
              </div>
            </div>
          </div>
        )}

        {/* 3.4 VOICE */}
        {activeSection === 'voice' && (
          <div className="card-glass" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.35rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mic size={17} color="var(--accent-primary)" /> Voice Recording & Reflection Settings
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
                    onClick={() => setUserProfile(prev => ({
                      ...prev,
                      voiceSettings: { ...(prev.voiceSettings || {}), updateMode: opt.id }
                    }))}
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

        {/* 3.5 NOTIFICATIONS */}
        {activeSection === 'notifications' && (
          <div className="card-glass" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.35rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Bell size={17} color="var(--accent-primary)" /> Reminder & Nudge Preferences
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Calm, pressure-free reminders tailored to your daily schedule.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Morning Intention Nudge
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={e => setReminderTime(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Evening Reflection Reminder
                </label>
                <input
                  type="time"
                  value={eveningReviewTime}
                  onChange={e => setEveningReviewTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.84rem' }}>
              <input
                type="checkbox"
                checked={nudgesEnabled}
                onChange={e => setNudgesEnabled(e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              <span>Enable gentle mid-day hydration reminders</span>
            </label>
          </div>
        )}

        {/* 3.6 ACCESSIBILITY & ADAPTIVE MODES */}
        {activeSection === 'accessibility' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card-glass" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.35rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={17} color="var(--accent-primary)" /> Accessibility & Neurodivergent-Friendly Modes
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Designed with ADHD, autism, and sensory sensitivity principles in mind.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.92rem', margin: '0 0 0.3rem 0' }}>🎯 One Thing Mode</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.6rem 0' }}>
                    Removes all competing dashboard cards and shows only 1 single focus item.
                  </p>
                  <button onClick={toggleOneThingMode} className="btn btn-secondary btn-sm">
                    {howIThrive?.oneThingModeActive ? 'Disable One Thing' : 'Enable One Thing Mode'}
                  </button>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.92rem', margin: '0 0 0.3rem 0' }}>🔋 Low Energy Mode</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.6rem 0' }}>
                    Simplifies targets down to essential micro-actions when exhausted.
                  </p>
                  <button onClick={toggleLowEnergyMode} className="btn btn-secondary btn-sm">
                    {howIThrive?.lowEnergyModeActive ? 'Disable Low Energy' : 'Enable Low Energy Mode'}
                  </button>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.92rem', margin: '0 0 0.3rem 0' }}>🧘 Overwhelm Support</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.6rem 0' }}>
                    Instant grounding exercise with calming rhythm and gentle prompt.
                  </p>
                  <button onClick={() => setIsOverwhelmOpen(true)} className="btn btn-secondary btn-sm">
                    Open Overwhelm Support
                  </button>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.92rem', margin: '0 0 0.3rem 0' }}>🧩 Break It Down Tool</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.6rem 0' }}>
                    Breaks large, overwhelming habits into bite-sized 2-minute steps.
                  </p>
                  <button onClick={() => setIsBreakItDownOpen(true)} className="btn btn-secondary btn-sm">
                    Open Break It Down
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3.7 PRIVACY & DATA VAULT */}
        {activeSection === 'privacy_data' && (
          <TrustCentreHub />
        )}

        {/* 3.8 ACCOUNT */}
        {activeSection === 'account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <form onSubmit={handleSaveProfile} className="card-glass" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={17} color="var(--accent-primary)" /> Profile & Wellness Baseline
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Primary Wellness Goal
                  </label>
                  <select value={goal} onChange={e => setGoal(e.target.value)} className="select-field">
                    <option value="energy_vitality">⚡ Energy & Vitality</option>
                    <option value="stress_relief">🍃 Stress Relief & Calm</option>
                    <option value="movement_habits">🏃 Daily Movement Rhythm</option>
                    <option value="balanced_eating">🥗 Balanced Nourishment</option>
                    <option value="better_sleep">🌙 Deeper Rest & Sleep</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Daily Hydration Target (ml)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    max="5000"
                    step="250"
                    value={hydrationGoal}
                    onChange={e => setHydrationGoal(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Daily Step Target
                  </label>
                  <input
                    type="number"
                    min="2000"
                    max="30000"
                    step="500"
                    value={stepGoal}
                    onChange={e => setStepGoal(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary">
                  Save Profile Settings
                </button>
                {savedSuccess && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    ✓ Saved successfully!
                  </span>
                )}
              </div>
            </form>

            <EcosystemPreview />
          </div>
        )}

      </div>

      {/* Modals */}
      {isPrivacyModalOpen && (
        <PrivacySecurityModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />
      )}

      {isAIMemoryOpen && (
        <AIMemoryModal
          isOpen={isAIMemoryOpen}
          onClose={() => setIsAIMemoryOpen(false)}
        />
      )}

      {isThemeCreatorOpen && (
        <ThemeCreatorModal
          isOpen={isThemeCreatorOpen}
          onClose={() => setIsThemeCreatorOpen(false)}
        />
      )}

      {isOverwhelmOpen && (
        <OverwhelmModal
          isOpen={isOverwhelmOpen}
          onClose={() => setIsOverwhelmOpen(false)}
        />
      )}

      {isBreakItDownOpen && (
        <BreakItDownModal
          isOpen={isBreakItDownOpen}
          onClose={() => setIsBreakItDownOpen(false)}
        />
      )}
    </div>
  );
}
