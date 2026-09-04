import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { getCyclePhaseInfo } from '../../engine/cycleEngine';
import { Moon, Heart, Sparkles, Shield, AlertCircle, Calendar, RefreshCw } from 'lucide-react';
import CycleAwareSuggestionModal from './CycleAwareSuggestionModal';

export default function MenstrualModule() {
  const {
    userProfile,
    setUserProfile,
    syncCycleRecommendations = true,
    toggleSyncCycleRecommendations
  } = useWellness();

  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const isEnabled = userProfile.cycleTrackingEnabled;
  const cycleInfo = isEnabled && userProfile.lastPeriodStart
    ? getCyclePhaseInfo(userProfile.lastPeriodStart, userProfile.cycleLength || 28)
    : null;

  const [lastPeriodDate, setLastPeriodDate] = useState(userProfile.lastPeriodStart || '2026-08-10');
  const [cycleLength, setCycleLength] = useState(userProfile.cycleLength || 28);
  const [periodLength, setPeriodLength] = useState(userProfile.periodLength || 5);

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
  };

  return (
    <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="pill-badge rose">
              <Moon size={12} /> Optional Hormone & Cycle Syncing
            </span>
          </div>
          <h3 style={{ fontSize: '1.3rem', marginTop: '0.2rem' }}>Menstrual Wellness</h3>
        </div>

        {/* Master Enable / Disable Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={e => toggleCycleTracking(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.45 }}>
        This module is completely optional. Users who do not menstruate or prefer not to track have a complete wellness experience without this feature.
      </p>

      {isEnabled ? (
        <div>
          {/* Sub-Toggle: Sync Recommendations With My Cycle */}
          <div 
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              padding: '0.9rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                <RefreshCw size={15} color="var(--accent-rose)" />
                <span>Sync Recommendations With My Cycle</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                When enabled, Better Every Day offers supportive movement and nourishment suggestions aligned with your phase. You always retain full agency to accept, see, or skip any suggestion.
              </div>
            </div>

            <label className="toggle-switch" style={{ flexShrink: 0 }}>
              <input
                type="checkbox"
                checked={syncCycleRecommendations}
                onChange={toggleSyncCycleRecommendations}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Phase Card */}
          {cycleInfo && (
            <div 
              style={{
                background: 'linear-gradient(135deg, rgba(214, 64, 98, 0.08) 0%, rgba(123, 97, 255, 0.08) 100%)',
                border: '1px solid rgba(214, 64, 98, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>{cycleInfo.icon}</span>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: cycleInfo.color }}>
                      Day {cycleInfo.day} of {cycleInfo.totalDays} • Estimated {cycleInfo.phase} Phase
                    </span>
                    <h4 style={{ fontSize: '1.15rem', margin: '0.1rem 0 0 0' }}>{cycleInfo.headline}</h4>
                  </div>
                </div>

                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', gap: '0.35rem', borderColor: 'var(--accent-rose)', color: 'var(--accent-rose)' }}
                >
                  <Sparkles size={13} />
                  <span>Preview Suggestion Layer</span>
                </button>
              </div>

              {/* 4 Pillars of Phase Guidance */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    🥗 Nutrition Alignment
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {cycleInfo.nutritionGuidance}
                  </p>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    🏃 Exercise & Movement
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {cycleInfo.workoutGuidance}
                  </p>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    🌙 Rest & Self-Care
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {cycleInfo.restGuidance}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dates & Cycle Configuration Form */}
          <form onSubmit={handleSaveDates} style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Cycle Parameters</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Last Period Start Date
                </label>
                <input
                  type="date"
                  value={lastPeriodDate}
                  onChange={e => setLastPeriodDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Average Cycle Length (days)
                </label>
                <input
                  type="number"
                  min="21"
                  max="45"
                  value={cycleLength}
                  onChange={e => setCycleLength(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Period Duration (days)
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={periodLength}
                  onChange={e => setPeriodLength(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-sm">
              Save Cycle Dates
            </button>
          </form>

          {/* Non-Medical Notice */}
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            ℹ️ <em>Cycle-based suggestions are provided as supportive wellness insights, not medical advice or fertility management.</em>
          </div>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>
            Cycle tracking is currently off. Your recommendations on TODAY are driven entirely by your energy, sleep, mood, and daily check-ins.
          </p>
        </div>
      )}

      {/* Cycle-Aware Non-Blocking Suggestion Modal Demo */}
      <CycleAwareSuggestionModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        cyclePhase={cycleInfo?.phase || 'Luteal'}
        cycleDay={cycleInfo?.day || 22}
        originalAction={{
          title: 'High Intensity Interval Run (HIIT)',
          category: 'Workout',
          details: '45 mins strenuous tempo sprinting & cardio'
        }}
        suggestedAction={{
          title: 'Mindful Mat Pilates & Mobility Flow',
          category: 'Movement',
          details: '30 mins low-cortisol movement aligned with energy curve',
          benefit: 'Protects progesterone, avoids energy crashes, and supports joint mobility'
        }}
        onContinueOriginal={() => {}}
        onAcceptSuggestion={() => {}}
        onSkip={() => {}}
      />
    </div>
  );
}

