import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import MascotCompanion from '../mascot/MascotCompanion';
import SmallStepCard from './SmallStepCard';
import RecommendationsList from './RecommendationsList';
import MetricPillars from './MetricPillars';
import ScoreCard from './ScoreCard';
import DailyCheckInModal from '../checkin/DailyCheckInModal';
import VisualDailySchedule from '../thrive/VisualDailySchedule';
import OverwhelmModal from '../thrive/OverwhelmModal';
import BreakItDownModal from '../thrive/BreakItDownModal';
import {
  Sparkles,
  Heart,
  Moon,
  RefreshCw,
  Calendar,
  Flame,
  Zap,
  Target,
  Pause,
  Play,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { AFFIRMATIONS_DATA } from '../../data/mockData';
import { getCyclePhaseInfo } from '../../engine/cycleEngine';

export default function TodayDashboard({ onNavigateTab }) {
  const { 
    userProfile, 
    dailyCheckIn, 
    personalizedDaily, 
    affirmationStyle, 
    setAffirmationStyle,
    howIThrive,
    toggleOneThingMode,
    toggleLowEnergyMode,
    completeSmallStep,
    smallStepState,
    loggedMeals,
    journalEntries
  } = useWellness();

  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isOverwhelmOpen, setIsOverwhelmOpen] = useState(false);
  const [isBreakItDownOpen, setIsBreakItDownOpen] = useState(false);
  const [affirmationIdx, setAffirmationIdx] = useState(0);
  const [dismissedDisclosures, setDismissedDisclosures] = useState([]);

  // Affirmations
  const affirmationsList = AFFIRMATIONS_DATA[affirmationStyle] || AFFIRMATIONS_DATA.soft_love;
  const currentAffirmation = affirmationsList[affirmationIdx % affirmationsList.length];

  const cycleInfo = userProfile.cycleTrackingEnabled && userProfile.lastPeriodStart
    ? getCyclePhaseInfo(userProfile.lastPeriodStart, userProfile.cycleLength || 28)
    : null;

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const nextAffirmation = () => {
    setAffirmationIdx(prev => prev + 1);
  };

  const isOneThingMode = howIThrive.oneThingModeActive;
  const isSimpleComplexity = howIThrive.complexityLevel === 'simple';

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      
      {/* Top Welcome Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
            <Calendar size={14} />
            <span>{todayDateFormatted}</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Good day, {userProfile.name} ✨
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => setIsCheckInOpen(true)}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.15rem', fontSize: '0.88rem' }}
          >
            <Heart size={16} /> Daily Check-In
          </button>
        </div>
      </div>

      {/* Adaptive Quick Modes Bar */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.4rem',
          marginBottom: '1.25rem',
          background: 'var(--bg-glass-card)',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border-glass)'
        }}
      >
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.2rem' }}>
          Adapt Day:
        </span>

        {/* Overwhelmed Emergency Button */}
        <button
          onClick={() => setIsOverwhelmOpen(true)}
          style={{
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid rgba(214, 64, 98, 0.4)',
            background: 'rgba(214, 64, 98, 0.1)',
            color: 'var(--accent-rose)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          🆘 I'm Overwhelmed
        </button>

        {/* Low Energy Mode Toggle */}
        <button
          onClick={toggleLowEnergyMode}
          style={{
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-pill)',
            border: howIThrive.lowEnergyMode ? '1px solid var(--accent-secondary)' : '1px solid var(--border-subtle)',
            background: howIThrive.lowEnergyMode ? 'var(--accent-secondary-light)' : 'transparent',
            color: howIThrive.lowEnergyMode ? 'var(--accent-secondary)' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          🔋 {howIThrive.lowEnergyMode ? 'Low Energy Active' : 'Low Energy Today'}
        </button>

        {/* One Thing Mode Toggle */}
        <button
          onClick={toggleOneThingMode}
          style={{
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-pill)',
            border: isOneThingMode ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            background: isOneThingMode ? 'var(--accent-primary-light)' : 'transparent',
            color: isOneThingMode ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          🎯 {isOneThingMode ? 'One Thing (Active)' : 'One Thing Mode'}
        </button>

        {/* Streak Pause Badge if paused */}
        {howIThrive.streakPaused && (
          <span 
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(123, 97, 255, 0.12)',
              color: 'var(--accent-purple)',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            ⏸️ Streak Paused (Protected)
          </span>
        )}
      </div>

      {/* =========================================================================
          ONE THING MODE ACTIVE VIEW
          ========================================================================= */}
      {isOneThingMode ? (
        <div 
          className="card-glass"
          style={{
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, var(--accent-primary-light) 100%)',
            border: '2px solid var(--accent-primary)',
            marginBottom: '1.5rem'
          }}
        >
          <span className="pill-badge primary" style={{ marginBottom: '1rem' }}>
            🎯 ONE THING FOCUS MODE
          </span>

          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            RIGHT NOW
          </h4>

          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            {personalizedDaily.smallStep?.icon || '💧'}
          </div>

          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', maxWidth: 500, margin: '0 auto 1.5rem', lineHeight: 1.3 }}>
            {personalizedDaily.smallStep?.text || 'Drink one glass of fresh water.'}
          </h3>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => {
                completeSmallStep();
              }}
              className="btn btn-primary btn-lg"
              style={{ minWidth: 160 }}
            >
              {smallStepState.isCompleted ? <><CheckCircle size={18} /> Done • Move Next</> : 'START NOW'}
            </button>

            <button
              onClick={() => setIsBreakItDownOpen(true)}
              className="btn btn-secondary"
            >
              Break It Down 🧩
            </button>
          </div>

          {/* Next Action Preview */}
          <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', maxWidth: 400, margin: '0 auto 1.5rem', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>UP NEXT:</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
              🚶 5-minute gentle fresh air stroll
            </p>
          </div>

          <button
            onClick={toggleOneThingMode}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem' }}
          >
            Exit One Thing Mode & View Full Dashboard
          </button>
        </div>
      ) : (
        /* STANDARD / COMPREHENSIVE DASHBOARD */
        <>
          {/* Optional Menstrual Cycle Sync Banner */}
          {cycleInfo && (
            <div 
              className="card-glass"
              style={{
                padding: '0.85rem 1.25rem',
                marginBottom: '1.25rem',
                background: 'linear-gradient(135deg, rgba(214, 64, 98, 0.08) 0%, rgba(123, 97, 255, 0.08) 100%)',
                borderColor: 'rgba(214, 64, 98, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{cycleInfo.icon}</span>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: cycleInfo.color, letterSpacing: '0.04em' }}>
                    Day {cycleInfo.day} • {cycleInfo.phase} Phase
                  </span>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {cycleInfo.headline} — {cycleInfo.recommendationTip}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onNavigateTab && onNavigateTab('PROFILE')} 
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', flexShrink: 0 }}
              >
                Cycle Details
              </button>
            </div>
          )}

          {/* Mascot Companion */}
          <MascotCompanion message={personalizedDaily.mascotMessage} mood={dailyCheckIn.energy >= 4 ? 'celebrate' : 'happy'} />

          {/* Hero Small Step Card */}
          <div style={{ marginTop: '1.25rem' }}>
            <SmallStepCard 
              smallStep={personalizedDaily.smallStep} 
              onBreakItDown={() => setIsBreakItDownOpen(true)}
            />
          </div>

          {/* Metric Pillars Snapshot */}
          <MetricPillars onNavigateTab={onNavigateTab} isSimple={isSimpleComplexity} />

          {/* Visual Daily Flow Schedule if enabled */}
          <VisualDailySchedule />

          {/* Daily Mindset Affirmation */}
          {!isSimpleComplexity && (
            <div 
              className="card-glass"
              style={{
                marginTop: '1.5rem',
                padding: '1.25rem 1.5rem',
                background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, rgba(123, 97, 255, 0.05) 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="pill-badge purple">
                    <Sparkles size={12} /> Daily Mindset
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Theme: {currentAffirmation.theme}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
                  <button
                    onClick={() => setAffirmationStyle('soft_love')}
                    style={{
                      background: affirmationStyle === 'soft_love' ? 'var(--bg-secondary)' : 'transparent',
                      border: 'none',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: affirmationStyle === 'soft_love' ? 'var(--accent-primary)' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    Soft Love 🌸
                  </button>
                  <button
                    onClick={() => setAffirmationStyle('tough_love')}
                    style={{
                      background: affirmationStyle === 'tough_love' ? 'var(--bg-secondary)' : 'transparent',
                      border: 'none',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: affirmationStyle === 'tough_love' ? 'var(--accent-secondary)' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    Tough Love ⚡
                  </button>
                </div>
              </div>

              <p style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: '1.08rem', 
                fontStyle: 'italic',
                color: 'var(--text-primary)', 
                margin: '0 0 0.75rem 0',
                lineHeight: 1.45
              }}>
                "{currentAffirmation.text}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={nextAffirmation}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', gap: '0.3rem' }}
                >
                  <RefreshCw size={12} /> Another Affirmation
                </button>
              </div>
            </div>
          )}

          {/* Progressive Disclosure: Feature Invitations (Prompt 10) */}
          {!isSimpleComplexity && !howIThrive.overwhelmModeActive && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
              {loggedMeals?.length >= 2 && !dismissedDisclosures.includes('disc_nourish') && (
                <div className="card-glass" style={{ padding: '0.85rem 1.15rem', borderLeft: '4px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.86rem', color: 'var(--accent-primary)' }}>✨ Discovered: Nutrition Patterns</strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                      You've logged {loggedMeals.length} meals! Explore non-diagnostic plant diversity and nourishment trends.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      onClick={() => onNavigateTab && onNavigateTab('NOURISH')}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem' }}
                    >
                      Explore
                    </button>
                    <button
                      onClick={() => setDismissedDisclosures(prev => [...prev, 'disc_nourish'])}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.74rem', padding: '0.3rem 0.5rem', color: 'var(--text-muted)' }}
                    >
                      Not now
                    </button>
                  </div>
                </div>
              )}

              {journalEntries?.length >= 1 && !dismissedDisclosures.includes('disc_gratitude') && (
                <div className="card-glass" style={{ padding: '0.85rem 1.15rem', borderLeft: '4px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.86rem', color: 'var(--accent-gold)' }}>💛 Discovered: Gratitude Moments</strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                      We noticed positive moments in your entries! Check out your Gratitude Discoveries.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      onClick={() => onNavigateTab && onNavigateTab('MIND')}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem' }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => setDismissedDisclosures(prev => [...prev, 'disc_gratitude'])}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.74rem', padding: '0.3rem 0.5rem', color: 'var(--text-muted)' }}
                    >
                      Not now
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3 Personalized Recommendations */}
          <RecommendationsList 
            recommendations={personalizedDaily.recommendations} 
            onNavigateTab={onNavigateTab} 
          />

          {/* Better Every Day Score */}
          {!isSimpleComplexity && <ScoreCard />}
        </>
      )}

      {/* Modals */}
      <DailyCheckInModal 
        isOpen={isCheckInOpen} 
        onClose={() => setIsCheckInOpen(false)} 
      />

      <OverwhelmModal
        isOpen={isOverwhelmOpen}
        onClose={() => setIsOverwhelmOpen(false)}
      />

      <BreakItDownModal
        isOpen={isBreakItDownOpen}
        onClose={() => setIsBreakItDownOpen(false)}
      />

    </div>
  );
}
