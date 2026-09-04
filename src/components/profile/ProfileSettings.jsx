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
  { id: 'how_i_thrive', label: 'How I Thrive', icon: Sliders, desc: 'Adaptive Personalization' },
  { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Themes & Text Scaling' },
  { id: 'privacy_data', label: 'Privacy & Data', icon: ShieldCheck, desc: 'Vault & PDF Export' },
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
    updateHowIThrive,
    toggleOneThingMode,
    toggleLowEnergyMode
  } = useWellness();

  // Normalize initialSection in case legacy links pass notifications/accessibility
  const resolvedSection = (initialSection === 'notifications' || initialSection === 'accessibility' || initialSection === 'ai_memory' || initialSection === 'voice')
    ? 'how_i_thrive'
    : (initialSection || 'how_i_thrive');

  const [activeSection, setActiveSection] = useState(resolvedSection);
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
            Personalization & Settings 👤
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
          <HowIThriveHub />
        )}

        {/* 3.2 APPEARANCE & THEMES (Includes Relocated Text Enlargement) */}
        {activeSection === 'appearance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card-glass" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.6rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                    <Palette size={18} color="var(--accent-primary)" /> Color Palette & Themes
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                    Choose a calming color system or generate a custom AI theme.
                  </p>
                </div>

                <button
                  onClick={() => setIsThemeCreatorOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  <Sparkles size={14} /> Custom Theme AI
                </button>
              </div>

              {/* Theme Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
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

              {/* Text Enlargement (Relocated from How I Thrive) */}
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                    Text Enlargement & Scaling 🔍
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Adjust font size across all dashboards, check-ins, and guides.
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'standard', label: 'Standard Text (100%)', desc: 'Default readability' },
                    { id: 'large', label: 'Large Text (115%)', desc: 'Enhanced size' },
                    { id: 'extra_large', label: 'Extra Large (125%)', desc: 'Maximum legibility' }
                  ].map(ts => {
                    const active = (howIThrive?.textSize || 'standard') === ts.id;
                    return (
                      <button
                        key={ts.id}
                        type="button"
                        onClick={() => updateHowIThrive && updateHowIThrive('textSize', ts.id)}
                        style={{
                          background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                          border: active ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          padding: '0.75rem 0.5rem',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div>{ts.label}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{ts.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3.3 PRIVACY & DATA VAULT */}
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
