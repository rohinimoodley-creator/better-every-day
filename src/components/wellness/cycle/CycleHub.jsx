import React, { useState } from 'react';
import { useWellness } from '../../../context/WellnessContext';
import { getCyclePhaseInfo } from '../../../engine/cycleEngine';
import MenstrualEducationSection from './MenstrualEducationSection';
import { Moon, Heart, Sparkles, Shield, Calendar, RefreshCw, BookOpen, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CycleHub({ onNavigateTab }) {
  const {
    userProfile,
    setUserProfile,
    syncCycleRecommendations = true,
    toggleSyncCycleRecommendations
  } = useWellness();

  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isEnabled = userProfile?.cycleTrackingEnabled ?? false;
  const cycleInfo = isEnabled && userProfile?.lastPeriodStart
    ? getCyclePhaseInfo(userProfile.lastPeriodStart, userProfile.cycleLength || 28)
    : null;

  const [lastPeriodDate, setLastPeriodDate] = useState(userProfile?.lastPeriodStart || '2026-08-10');
  const [cycleLength, setCycleLength] = useState(userProfile?.cycleLength || 28);
  const [periodLength, setPeriodLength] = useState(userProfile?.periodLength || 5);

  const toggleCycleTracking = (enabled) => {
    setUserProfile(prev => ({
      ...prev,
      cycleTrackingEnabled: enabled
    }));
  };

  const handleSaveDates = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      lastPeriodStart: lastPeriodDate,
      cycleLength: Number(cycleLength),
      periodLength: Number(periodLength)
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    try {
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
    } catch (err) {}
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3.5rem' }}>
      
      {/* 1. Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
          <span className="pill-badge rose" style={{ fontSize: '0.7rem' }}>
            <Moon size={11} /> Cycle & Hormone Rhythm
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
          Cycle Rhythm 🌸
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
          Understand your monthly rhythm and align movement and fuel with your hormonal cadence.
        </p>
      </div>

      {/* 2. Master Toggle Card */}
      <div 
        className="card-glass"
        style={{
          padding: '1.15rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          border: '1.5px solid var(--border-glass)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            style={{ 
              width: 42, 
              height: 42, 
              borderRadius: '50%', 
              background: 'rgba(214, 64, 98, 0.15)', 
              color: 'var(--accent-rose)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0
            }}
          >
            🌸
          </div>
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Cycle Tracking
            </h4>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {isEnabled ? 'Active on this device' : 'Disabled (Hidden from other hubs)'}
            </span>
          </div>
        </div>

        <label className="toggle-switch" style={{ flexShrink: 0 }}>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={e => toggleCycleTracking(e.target.checked)}
          />
          <span className="toggle-slider" />
        </label>
      </div>

      {isEnabled ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Secondary Toggle: Influence recommendations across other hubs */}
          <div 
            className="card-glass"
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              background: 'linear-gradient(135deg, rgba(214, 64, 98, 0.06) 0%, var(--bg-glass-card) 100%)',
              border: `1.5px solid ${syncCycleRecommendations ? 'rgba(214, 64, 98, 0.3)' : 'var(--border-subtle)'}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <RefreshCw size={17} color="var(--accent-rose)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Influence recommendations across other hubs
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {syncCycleRecommendations ? 'Informs Move and Nourish suggestions gently' : 'Recommendations in Move & Nourish stay standard'}
                </span>
              </div>
            </div>

            <label className="toggle-switch" style={{ flexShrink: 0 }}>
              <input
                type="checkbox"
                checked={syncCycleRecommendations}
                onChange={e => toggleSyncCycleRecommendations(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* "Best for you" Dynamic Summary Badge */}
          {cycleInfo && (
            <div 
              className="card-glass"
              style={{
                padding: '1.15rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(214, 64, 98, 0.08) 0%, rgba(123, 97, 255, 0.08) 100%)',
                border: '1.5px solid rgba(214, 64, 98, 0.28)',
                borderRadius: 'var(--radius-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span className="pill-badge rose" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                    ✨ Best for You Right Now
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {cycleInfo.phase} Phase (Day {cycleInfo.day})
                  </span>
                </div>
                <span style={{ fontSize: '1.3rem' }}>{cycleInfo.icon}</span>
              </div>

              <h4 style={{ fontSize: '0.96rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: 'var(--text-primary)' }}>
                {cycleInfo.headline}
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem', marginTop: '0.6rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase' }}>
                    🏃 Movement
                  </span>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0', lineHeight: 1.35 }}>
                    {cycleInfo.workoutGuidance}
                  </p>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--accent-secondary)', fontWeight: 800, textTransform: 'uppercase' }}>
                    🥗 Nourishment
                  </span>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0', lineHeight: 1.35 }}>
                    {cycleInfo.nutritionGuidance}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Period Dates Form */}
          <form 
            onSubmit={handleSaveDates} 
            className="card-glass"
            style={{ padding: '1.15rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
          >
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={15} color="var(--accent-rose)" /> Period Dates & Length
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                  Last Period Start Date
                </label>
                <input
                  type="date"
                  value={lastPeriodDate}
                  onChange={e => setLastPeriodDate(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                  Cycle Length (Days)
                </label>
                <input
                  type="number"
                  min="21"
                  max="45"
                  value={cycleLength}
                  onChange={e => setCycleLength(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                  Period Duration (Days)
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={periodLength}
                  onChange={e => setPeriodLength(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}>
                Save Cycle Dates
              </button>

              {saveSuccess && (
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  ✓ Dates updated
                </span>
              )}
            </div>
          </form>

          {/* Learn More Button */}
          <button
            type="button"
            onClick={() => setIsLearnMoreOpen(true)}
            className="card-glass card-interactive"
            style={{
              padding: '0.9rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <BookOpen size={17} color="var(--accent-rose)" />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Learn More About Hormones & Phases
                </h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Scientifically accurate guide to the 4 phases
                </span>
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
              Open Guide →
            </span>
          </button>
        </div>
      ) : (
        <div className="card-glass" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.5 }}>
            Cycle tracking is currently off. Your recommendations in Move and Nourish are guided entirely by your daily energy, activity, and preferences.
          </p>
        </div>
      )}

      {/* Learn More Modal Sheet */}
      {isLearnMoreOpen && (
        <div className="modal-backdrop" onClick={() => setIsLearnMoreOpen(false)} style={{ zIndex: 1100 }}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: 580, 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={18} color="var(--accent-rose)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Cycle Guide & Hormonal Education
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsLearnMoreOpen(false)}
                style={{ 
                  background: 'var(--bg-tertiary)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 32, 
                  height: 32, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  color: 'var(--text-muted)' 
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <MenstrualEducationSection />
          </div>
        </div>
      )}

    </div>
  );
}
