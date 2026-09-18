import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAuth } from '../../context/AuthContext';
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
  Sun,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const YOU_SECTIONS = [
  { id: 'how_i_thrive', label: 'How I Thrive', icon: Sliders, desc: 'Adaptive Personalization' },
  { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Themes & Text Scaling' },
  { id: 'privacy_data', label: 'Privacy & Data Vault', icon: ShieldCheck, desc: 'Local-first controls & export' },
  { id: 'account', label: 'Account', icon: User, desc: 'Personal profile, height & weight' }
];

export default function ProfileSettings({ onNavigateTab, initialSection }) {
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
    toggleLowEnergyMode,
    evaluateWaterGoalSafety
  } = useWellness();

  // Normalize initialSection in case legacy links pass notifications/accessibility
  const resolvedSection = (initialSection === 'notifications' || initialSection === 'accessibility' || initialSection === 'ai_memory' || initialSection === 'voice')
    ? 'how_i_thrive'
    : (initialSection || 'how_i_thrive');

  const { currentUser, signInWithGoogle, logout } = useAuth();
  const [activeSection, setActiveSection] = useState(resolvedSection);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isAIMemoryOpen, setIsAIMemoryOpen] = useState(false);
  const [isThemeCreatorOpen, setIsThemeCreatorOpen] = useState(false);
  const [isOverwhelmOpen, setIsOverwhelmOpen] = useState(false);
  const [isBreakItDownOpen, setIsBreakItDownOpen] = useState(false);

  // Account State (Personal Profile, Height & Weight)
  const [name, setName] = useState(userProfile.name || 'Rohini');
  const [goal, setGoal] = useState(userProfile.wellnessGoal || 'energy_vitality');
  const [heightCm, setHeightCm] = useState(userProfile.heightCm || 168);
  const [weightKg, setWeightKg] = useState(userProfile.weightKg || 64);
  const [hydrationGoal, setHydrationGoal] = useState(userProfile.hydrationGoalMl || 2250);
  const [stepGoal, setStepGoal] = useState(userProfile.stepGoal || 8000);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setName(userProfile.name);
      if (userProfile.wellnessGoal) setGoal(userProfile.wellnessGoal);
      if (userProfile.heightCm) setHeightCm(userProfile.heightCm);
      if (userProfile.weightKg) setWeightKg(userProfile.weightKg);
      if (userProfile.hydrationGoalMl) setHydrationGoal(userProfile.hydrationGoalMl);
      if (userProfile.stepGoal) setStepGoal(userProfile.stepGoal);
    }
  }, [userProfile]);

  const profileHydrationSafety = evaluateWaterGoalSafety 
    ? evaluateWaterGoalSafety(hydrationGoal) 
    : { status: 'normal', isLow: false, isHigh: false, estimatedTarget: 2250, suggestedGoal: 2250 };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name,
      wellnessGoal: goal,
      heightCm: Number(heightCm) || 168,
      weightKg: Number(weightKg) || 64,
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

        {/* 3.4 ACCOUNT */}
        {activeSection === 'account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <form onSubmit={handleSaveProfile} className="card-glass" style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.15rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                  <User size={18} color="var(--accent-primary)" /> Account & Personal Profile
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Manage your personal identity, baseline physiological parameters, and daily wellness intentions.
                </p>
              </div>

              {/* Google Authentication & Cloud Sync Banner */}
              <div style={{ background: 'var(--bg-secondary)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {currentUser?.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt="Avatar" 
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} 
                      />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-calm) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: '#ffffff' }}>
                        {currentUser?.displayName ? currentUser.displayName[0] : '🌱'}
                      </div>
                    )}

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {currentUser ? currentUser.displayName || 'Connected User' : 'Local Guest Account'}
                        </span>
                        <span className="pill-badge primary" style={{ fontSize: '0.64rem', padding: '1px 6px' }}>
                          {currentUser ? 'Google Connected ☁️' : 'Local Vault Mode 🔒'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block' }}>
                        {currentUser ? currentUser.email : 'Personal offline storage active on this device'}
                      </span>
                    </div>
                  </div>

                  <div>
                    {currentUser ? (
                      <button
                        type="button"
                        onClick={logout}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', fontSize: '0.74rem' }}
                      >
                        Disconnect Account
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={signInWithGoogle}
                        className="btn btn-primary btn-sm"
                        style={{ gap: '0.4rem', fontSize: '0.76rem', fontWeight: 700 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24">
                          <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Sign in with Google</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 1. Personal Identity & Primary Intention */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
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
                    placeholder="Rohini"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Primary Wellness Intention
                  </label>
                  <select value={goal} onChange={e => setGoal(e.target.value)} className="select-field">
                    <option value="energy_vitality">⚡ Sustained Daytime Energy & Vitality</option>
                    <option value="gentle_consistency">🌱 Gentle Daily Consistency & Routine</option>
                    <option value="stress_reduction">🌿 Stress Reduction & Nervous System Calm</option>
                    <option value="movement_habits">🏃 Daily Movement Rhythm</option>
                    <option value="balanced_eating">🥗 Balanced Nourishment</option>
                    <option value="better_sleep">🌙 Deeper Rest & Sleep Recovery</option>
                  </select>
                </div>
              </div>

              {/* 2. Baseline Physiological Parameters (Height & Weight) */}
              <div style={{ background: 'var(--bg-secondary)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Personal Baseline (Height & Weight)
                  </div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Used exclusively to calibrate hydration pacing and exercise energy estimations.
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                      Baseline Height (cm)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="250"
                      value={heightCm}
                      onChange={e => setHeightCm(e.target.value)}
                      className="input-field"
                      placeholder="168"
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                      e.g. 168 cm (~5'6")
                    </span>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                      Baseline Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="300"
                      value={weightKg}
                      onChange={e => setWeightKg(e.target.value)}
                      className="input-field"
                      placeholder="64"
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                      e.g. 64 kg (~141 lbs)
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)', borderLeft: '3px solid var(--accent-primary)', paddingLeft: '0.6rem', lineHeight: 1.4 }}>
                  💡 <strong>Non-Judgmental Baseline:</strong> Height and weight are personal reference values for calculation calibration. They are never treated as mandatory daily weigh-in requirements, streak demands, or daily judgment metrics.
                </div>
              </div>

              {/* 3. Daily Targets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Daily Hydration Target (ml)
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="6000"
                    step="250"
                    value={hydrationGoal}
                    onChange={e => setHydrationGoal(e.target.value)}
                    className="input-field"
                  />
                  {profileHydrationSafety.isLow && (
                    <div style={{ fontSize: '0.74rem', color: '#d97736', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertCircle size={12} />
                      <span>Looks a little low for your usual day (~{profileHydrationSafety.estimatedTarget} ml estimated).</span>
                    </div>
                  )}
                  {profileHydrationSafety.isHigh && (
                    <div style={{ fontSize: '0.74rem', color: '#e63946', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertCircle size={12} />
                      <span>Looks quite high for one day. Consider a more moderate goal (~{profileHydrationSafety.suggestedGoal} ml).</span>
                    </div>
                  )}
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
                  Save Account Settings
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
