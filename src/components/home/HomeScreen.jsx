import React, { useState, useMemo } from 'react';
import { useWellness } from '../../context/WellnessContext';
import DailyCheckInModal from '../checkin/DailyCheckInModal';
import QuickSupportModal from './QuickSupportModal';
import GuideMeModal from './GuideMeModal';
import CustomizeOverviewModal from './CustomizeOverviewModal';
import PipSproutAvatar from '../mascot/PipSproutAvatar';
import MascotWardrobeModal from '../mascot/MascotWardrobeModal';
import OverwhelmModal from '../thrive/OverwhelmModal';
import DanceBreakModal from './DanceBreakModal';
import GentleStepCard from './GentleStepCard';
import SegmentedControl from '../common/SegmentedControl';
import { formatNumber } from '../../utils/formatters';
import {
  Sparkles,
  Heart,
  Footprints,
  Utensils,
  Moon,
  Droplet,
  Calendar as CalendarIcon,
  Activity,
  ChevronRight,
  Sliders,
  Wind,
  CheckCircle,
  Compass,
  Plus
} from 'lucide-react';

export default function HomeScreen({ onNavigateTab }) {
  const {
    userProfile,
    dailyCheckIn,
    hydrationMl,
    stepCount,
    loggedMeals,
    socialEvents,
    overviewFrequency,
    updateOverviewFrequency,
    overviewPillars,
    wellnessHubVisibility = {},
    skincareRoutines = {},
    skincareLogs = {},
    linkEngineOutput,
    dismissSuggestion,
    adjustedHydrationGoal
  } = useWellness();

  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isTakeAMomentOpen, setIsTakeAMomentOpen] = useState(false);
  const [isGuideMeOpen, setIsGuideMeOpen] = useState(false);
  const [isDancePartyOpen, setIsDancePartyOpen] = useState(false);
  const [isCustomizeOverviewOpen, setIsCustomizeOverviewOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [quickSupportMode, setQuickSupportMode] = useState(null); // null | 'motivation' | 'breathe'
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: '🌅' };
    if (hour < 17) return { text: 'Good afternoon', icon: '☀️' };
    return { text: 'Good evening', icon: '🌙' };
  };

  const greeting = getGreeting();
  const userName = userProfile?.name || 'Rohini';

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const todayDateStr = new Date().toISOString().split('T')[0];
  const isCheckedInToday = Boolean(dailyCheckIn && (dailyCheckIn.date === todayDateStr || dailyCheckIn.mood));

  // Link Engine Adjusted Goals & Percentages
  const hydrationGoal = adjustedHydrationGoal || userProfile?.hydrationGoalMl || 2250;
  const currentHydration = hydrationMl || 0;
  const hydrationPercent = Math.min(100, Math.round((currentHydration / hydrationGoal) * 100));

  const stepsGoal = userProfile?.stepGoal || 8000;
  const currentSteps = stepCount || 0;
  const stepsPercent = Math.min(100, Math.round((currentSteps / stepsGoal) * 100));

  const mealsCount = (loggedMeals || []).length || 0;

  const activeRoutineKey = new Date().getHours() < 15 ? 'morning' : 'evening';
  const currentRoutineSteps = skincareRoutines?.[activeRoutineKey]?.steps || [];
  const todayRoutineLogs = (skincareLogs[todayDateStr] && skincareLogs[todayDateStr][activeRoutineKey])?.completedSteps || [];
  const skincarePercent = currentRoutineSteps.length > 0
    ? Math.min(100, Math.round((todayRoutineLogs.length / currentRoutineSteps.length) * 100))
    : 100;

  // Overview Pillars Config
  const allPillarConfigs = {
    hydrate: {
      id: 'hydrate',
      label: 'Hydrate',
      icon: Droplet,
      color: '#3a86c8',
      activeDays: [0, 1, 2, 3, 4],
      pct: hydrationPercent,
      dailyVal: `${formatNumber(currentHydration)} ml`,
      dailyPct: hydrationPercent
    },
    move: {
      id: 'move',
      label: 'Move',
      icon: Footprints,
      color: '#3a86c8',
      activeDays: [0, 2, 3, 5],
      pct: stepsPercent,
      dailyVal: `${formatNumber(currentSteps)} steps`,
      dailyPct: stepsPercent
    },
    nourish: {
      id: 'nourish',
      label: 'Nourish',
      icon: Utensils,
      color: '#d97736',
      activeDays: [0, 1, 2, 3, 4, 5],
      pct: 85,
      dailyVal: `${mealsCount} meals`,
      dailyPct: Math.min(100, mealsCount * 33)
    },
    rest: {
      id: 'rest',
      label: 'Rest',
      icon: Moon,
      color: '#7b61ff',
      activeDays: [0, 1, 3, 4, 5],
      pct: 75,
      dailyVal: '8h 05m',
      dailyPct: 85
    },
    skincare: {
      id: 'skincare',
      label: 'Skincare',
      icon: Sparkles,
      color: '#e7a93b',
      activeDays: [0, 1, 2, 3, 4, 5, 6],
      pct: skincarePercent,
      dailyVal: `${todayRoutineLogs.length}/${currentRoutineSteps.length || 4} steps`,
      dailyPct: skincarePercent
    },
    mind: {
      id: 'mind',
      label: 'Mind',
      icon: Sparkles,
      color: '#8b5cf6',
      activeDays: [1, 2, 4],
      pct: 60,
      dailyVal: '2 moments',
      dailyPct: 65
    },
    breathwork: {
      id: 'breathwork',
      label: 'Breathwork',
      icon: Wind,
      color: '#40916c',
      activeDays: [0, 2, 4, 5],
      pct: 70,
      dailyVal: '1 session',
      dailyPct: 80
    },
    cycle: {
      id: 'cycle',
      label: 'Cycle',
      icon: Heart,
      color: '#d64062',
      activeDays: [0, 1, 2, 3, 4, 5, 6],
      pct: 90,
      dailyVal: 'Follicular',
      dailyPct: 100
    },
    steps: {
      id: 'steps',
      label: 'Steps',
      icon: Activity,
      color: '#2d6a4f',
      activeDays: [0, 1, 2, 3, 4, 5],
      pct: stepsPercent,
      dailyVal: `${formatNumber(currentSteps)} steps`,
      dailyPct: stepsPercent
    }
  };

  const activePillarsList = (overviewPillars || ['hydrate', 'move', 'nourish', 'rest', 'mind'])
    .filter((id) => {
      if (id === 'steps') return wellnessHubVisibility?.move !== false;
      return wellnessHubVisibility?.[id] !== false;
    })
    .map((id) => allPillarConfigs[id])
    .filter(Boolean);

  const navigateToWellness = (category) => {
    if (onNavigateTab) {
      onNavigateTab('WELLNESS', { category: category === 'steps' ? 'move' : category });
    }
  };

  const handleGentleStepAction = (suggestion) => {
    if (suggestion.targetTab) {
      onNavigateTab(suggestion.targetTab, { category: suggestion.targetCategory, deepLink: suggestion.deepLink });
    }
  };

  // Upcoming Schedule / Events
  const allUpcomingEvents = (socialEvents || [])
    .filter((e) => e.date >= todayDateStr && (e.status === 'accepted' || !e.status))
    .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));

  const nextUpcomingEvent = allUpcomingEvents[0] || null;

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* 1. GREETING ROW (~72dp, Section 6.1) */}
      <div
        className="card-compact"
        style={{
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, var(--accent-primary-light) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          padding: '0.65rem 0.85rem',
          minHeight: '68px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          {/* 40dp Avatar */}
          <div
            onClick={() => setIsWardrobeOpen(true)}
            style={{ cursor: 'pointer', flexShrink: 0 }}
            title="Style Pip's wardrobe & aura"
          >
            <PipSproutAvatar size={40} mood="happy" showCustomiseBadge={false} />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <h2
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {greeting.text}, {userName} 🌱
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {todayDateFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Dance Party Chip */}
        <button
          type="button"
          onClick={() => setIsDancePartyOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.3rem 0.65rem',
            minHeight: '34px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--accent-primary)',
            background: 'var(--bg-secondary)',
            color: 'var(--accent-primary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: 'var(--shadow-sm)'
          }}
          title="Instant spontaneous movement — Dance Party!"
        >
          <span>💃</span>
          <span>Dance Party</span>
        </button>
      </div>

      {/* 2. QUICK ACTIONS (1 Row of 3 Equal ~64dp Tiles, Section 6.1) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        {/* Check-In */}
        <button
          type="button"
          onClick={() => setIsCheckInOpen(true)}
          className="btn"
          style={{
            background: isCheckedInToday ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
            color: isCheckedInToday ? 'var(--accent-primary)' : 'var(--text-primary)',
            border: isCheckedInToday ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-card)',
            padding: '0.55rem 0.45rem',
            minHeight: '58px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.2rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ fontSize: '1rem' }}>💬</span>
            {isCheckedInToday && <CheckCircle size={13} color="var(--accent-primary)" />}
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Check-In</span>
        </button>

        {/* Take a Moment */}
        <button
          type="button"
          onClick={() => setIsTakeAMomentOpen(true)}
          className="btn"
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-card)',
            padding: '0.55rem 0.45rem',
            minHeight: '58px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.2rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <span style={{ fontSize: '1rem' }}>🫧</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Take a Moment</span>
        </button>

        {/* Quick Motivation */}
        <button
          type="button"
          onClick={() => setQuickSupportMode('motivation')}
          className="btn"
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-card)',
            padding: '0.55rem 0.45rem',
            minHeight: '58px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.2rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <span style={{ fontSize: '1rem' }}>✨</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Quick Motivation</span>
        </button>
      </div>

      {/* 3. TODAY'S GENTLE STEP (Link Engine Card ~72dp, Section 6.1) */}
      {linkEngineOutput?.primaryGentleStep && (
        <GentleStepCard
          suggestion={linkEngineOutput.primaryGentleStep}
          onAction={handleGentleStepAction}
          onDismiss={dismissSuggestion}
        />
      )}

      {/* 4. WELLNESS OVERVIEW (3-Column Grid ~88dp Tiles, Section 6.1) */}
      <div className="card-compact" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {/* Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Activity size={16} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Wellness Overview
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('WELLNESS')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.15rem',
              padding: '0.2rem 0'
            }}
          >
            <span>Open Hub</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Controls Row: Timeframe + Customize + One Thing Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', flexWrap: 'wrap' }}>
          <SegmentedControl
            options={[
              { id: 'daily', label: 'Daily' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'monthly', label: 'Monthly' }
            ]}
            value={overviewFrequency}
            onChange={(val) => updateOverviewFrequency(val)}
            size="sm"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {/* One Thing | Full View Toggle */}
            <button
              type="button"
              onClick={() => setIsGuideMeOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-pill)',
                padding: '0.25rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                cursor: 'pointer',
                minHeight: '32px'
              }}
              title="Focus on one thing at a time"
            >
              <Compass size={12} />
              <span>One Thing</span>
            </button>

            {/* Customize */}
            <button
              type="button"
              onClick={() => setIsCustomizeOverviewOpen(true)}
              aria-label="Customize overview pillars"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              title="Customize Overview"
            >
              <Sliders size={13} />
            </button>
          </div>
        </div>

        {/* 3-Column Metrics Grid of ~88dp Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
          {activePillarsList.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                onClick={() => navigateToWellness(p.id)}
                className="card-interactive"
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '74px',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Icon size={13} color={p.color} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {p.label}
                    </span>
                  </div>
                  <span className="tabular-nums" style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {p.pct}%
                  </span>
                </div>

                <div className="tabular-nums" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.15rem 0' }}>
                  {p.dailyVal}
                </div>

                {/* Thin Progress Bar */}
                <div style={{ height: 3.5, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${p.dailyPct}%`,
                      height: '100%',
                      background: p.color,
                      borderRadius: 'var(--radius-pill)',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. NEXT UPCOMING EVENT (Compact ~48dp Row, Section 6.1) */}
      <div
        className="card-compact"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.55rem 0.85rem',
          minHeight: '48px'
        }}
      >
        <div
          onClick={() => onNavigateTab && onNavigateTab('WELLNESS', { category: 'calendar' })}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1, cursor: 'pointer' }}
        >
          <CalendarIcon size={15} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
          {nextUpcomingEvent ? (
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  Next
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {nextUpcomingEvent.title}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {nextUpcomingEvent.date === todayDateStr ? 'Today' : nextUpcomingEvent.date} at {nextUpcomingEvent.time}
              </span>
            </div>
          ) : (
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              No upcoming events today
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab('WELLNESS', { category: 'calendar' })}
          className="btn-soft"
          style={{
            padding: '0.3rem 0.65rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            minHeight: '32px'
          }}
        >
          <span>{nextUpcomingEvent ? 'Details' : '+ Add Event'}</span>
          <ChevronRight size={12} />
        </button>
      </div>

      {/* MODALS */}
      {isCheckInOpen && (
        <DailyCheckInModal
          isOpen={isCheckInOpen}
          onClose={() => setIsCheckInOpen(false)}
        />
      )}

      {isTakeAMomentOpen && (
        <OverwhelmModal
          isOpen={isTakeAMomentOpen}
          onClose={() => setIsTakeAMomentOpen(false)}
        />
      )}

      {quickSupportMode && (
        <QuickSupportModal
          isOpen={Boolean(quickSupportMode)}
          onClose={() => setQuickSupportMode(null)}
          mode={quickSupportMode}
        />
      )}

      {isGuideMeOpen && (
        <GuideMeModal
          isOpen={isGuideMeOpen}
          onClose={() => setIsGuideMeOpen(false)}
          onNavigateTab={onNavigateTab}
        />
      )}

      {isDancePartyOpen && (
        <DanceBreakModal
          isOpen={isDancePartyOpen}
          onClose={() => setIsDancePartyOpen(false)}
        />
      )}

      {isCustomizeOverviewOpen && (
        <CustomizeOverviewModal
          isOpen={isCustomizeOverviewOpen}
          onClose={() => setIsCustomizeOverviewOpen(false)}
        />
      )}

      {isWardrobeOpen && (
        <MascotWardrobeModal
          isOpen={isWardrobeOpen}
          onClose={() => setIsWardrobeOpen(false)}
        />
      )}
    </div>
  );
}
