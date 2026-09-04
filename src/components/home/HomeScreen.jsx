import React, { useState, useMemo } from 'react';
import { useWellness } from '../../context/WellnessContext';
import DailyCheckInModal from '../checkin/DailyCheckInModal';
import QuickSupportModal from './QuickSupportModal';
import GuideMeModal from './GuideMeModal';
import CustomizeOverviewModal, { ALL_OVERVIEW_PILLARS } from './CustomizeOverviewModal';
import PipSproutAvatar from '../mascot/PipSproutAvatar';
import MascotWardrobeModal from '../mascot/MascotWardrobeModal';
import OverwhelmModal from '../thrive/OverwhelmModal';
import DancePartyModal from '../move/DancePartyModal';
import {
  Sparkles,
  Heart,
  Footprints,
  Utensils,
  Moon,
  Droplet,
  Calendar as CalendarIcon,
  ArrowRight,
  Activity,
  ChevronRight,
  Sliders,
  Wind,
  CheckCircle,
  Compass,
  Smile
} from 'lucide-react';
import { getCyclePhaseInfo } from '../../engine/cycleEngine';

export default function HomeScreen({ onNavigateTab }) {
  const {
    userProfile,
    dailyCheckIn,
    hydrationMl,
    stepCount,
    loggedMeals,
    socialEvents,
    overviewFrequency,
    overviewPillars,
    updateOverviewPillars,
    microMovementSettings,
    getMicroMovementStats
  } = useWellness();

  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isTakeAMomentOpen, setIsTakeAMomentOpen] = useState(false);
  const [isGuideMeOpen, setIsGuideMeOpen] = useState(false);
  const [isDancePartyOpen, setIsDancePartyOpen] = useState(false);
  const [isCustomizeOverviewOpen, setIsCustomizeOverviewOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [quickSupportMode, setQuickSupportMode] = useState(null); // null | 'motivation' | 'breathe'

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
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Overview Goals & Metrics
  const hydrationGoal = userProfile?.hydrationGoalMl || 2250;
  const currentHydration = hydrationMl || 1750;
  const hydrationPercent = Math.min(100, Math.round((currentHydration / hydrationGoal) * 100));

  const stepsGoal = userProfile?.stepGoal || 8000;
  const currentSteps = stepCount || 5420;
  const stepsPercent = Math.min(100, Math.round((currentSteps / stepsGoal) * 100));

  const mealsCount = (loggedMeals || []).length || 2;

  // Upcoming / Today events from calendar
  const todayDateStr = new Date().toISOString().split('T')[0];
  const upcomingEvents = (socialEvents || [])
    .filter(e => e.date >= todayDateStr && (e.status === 'accepted' || !e.status))
    .slice(0, 3);

  // Weekly Overview Mock Days Data (Mon-Sun)
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const allPillarConfigs = {
    hydrate: { id: 'hydrate', label: 'Hydrate', icon: Droplet, color: '#3a86c8', activeDays: [0, 1, 2, 3, 4], pct: 78, dailyVal: `${currentHydration}ml`, dailyPct: hydrationPercent },
    move: { id: 'move', label: 'Move', icon: Footprints, color: '#3a86c8', activeDays: [0, 2, 3, 5], pct: 68, dailyVal: `${currentSteps} steps`, dailyPct: stepsPercent },
    nourish: { id: 'nourish', label: 'Nourish', icon: Utensils, color: '#d97736', activeDays: [0, 1, 2, 3, 4, 5], pct: 85, dailyVal: `${mealsCount} meals`, dailyPct: 70 },
    rest: { id: 'rest', label: 'Rest', icon: Moon, color: '#7b61ff', activeDays: [0, 1, 3, 4, 5], pct: 75, dailyVal: '7h 15m', dailyPct: 85 },
    mind: { id: 'mind', label: 'Mind', icon: Sparkles, color: '#8b5cf6', activeDays: [1, 2, 4], pct: 60, dailyVal: '2 moments', dailyPct: 65 },
    breathwork: { id: 'breathwork', label: 'Breathwork', icon: Wind, color: '#40916c', activeDays: [0, 2, 4, 5], pct: 70, dailyVal: '1 session', dailyPct: 80 },
    cycle: { id: 'cycle', label: 'Cycle', icon: Heart, color: '#d64062', activeDays: [0, 1, 2, 3, 4, 5, 6], pct: 90, dailyVal: 'Follicular', dailyPct: 100 },
    steps: { id: 'steps', label: 'Steps', icon: Activity, color: '#2d6a4f', activeDays: [0, 1, 2, 3, 4, 5], pct: 82, dailyVal: `${currentSteps} steps`, dailyPct: stepsPercent }
  };

  const activePillarsList = (overviewPillars || ['hydrate', 'move', 'nourish', 'rest', 'mind'])
    .map(id => allPillarConfigs[id])
    .filter(Boolean);

  const navigateToWellness = (category) => {
    if (onNavigateTab) {
      onNavigateTab('WELLNESS', { category: category === 'steps' ? 'move' : category });
    }
  };

  const isCheckedInToday = dailyCheckIn && (dailyCheckIn.date === todayDateStr || dailyCheckIn.mood);

  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [scheduleScope, setScheduleScope] = useState('today'); // 'today' | 'week' | 'month'

  // Filter events by scope
  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const allUpcomingEvents = (socialEvents || [])
    .filter(e => e.date >= todayDateStr && (e.status === 'accepted' || !e.status))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const nextUpcomingEvent = allUpcomingEvents[0] || null;

  const scopedScheduleEvents = useMemo(() => {
    if (scheduleScope === 'today') {
      return allUpcomingEvents.filter(e => e.date === todayDateStr);
    } else if (scheduleScope === 'week') {
      return allUpcomingEvents.filter(e => e.date >= todayDateStr && e.date <= nextWeekStr);
    } else {
      return allUpcomingEvents.filter(e => {
        const d = new Date(e.date + 'T00:00:00');
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      });
    }
  }, [allUpcomingEvents, scheduleScope, todayDateStr, nextWeekStr, currentMonth, currentYear]);

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      
      {/* 1. GREETING + 3 COMPACT QUICK WELLNESS ACTIONS (Daily Check-In -> Take a Moment -> Quick Motivation) */}
      <div 
        className="card-glass"
        style={{
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, var(--accent-primary-light) 100%)',
          padding: '1.4rem 1.65rem',
          border: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.15rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Integrated Mascot Avatar (Clickable) */}
            <PipSproutAvatar size={52} mood="happy" onClick={() => setIsWardrobeOpen(true)} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {todayDateFormatted}
                </div>
                {microMovementSettings?.enabled && (
                  <span 
                    onClick={() => navigateToWellness('move')}
                    className="pill-badge primary" 
                    style={{ fontSize: '0.68rem', cursor: 'pointer', padding: '2px 8px' }}
                    title="Tap to open Micro-Movement in Move Hub"
                  >
                    🌱 {(getMicroMovementStats ? getMicroMovementStats().breaksTodayCount : 6)} movement breaks today
                  </span>
                )}
                <span 
                  onClick={() => setIsDancePartyOpen(true)}
                  className="pill-badge" 
                  style={{ 
                    fontSize: '0.68rem', 
                    cursor: 'pointer', 
                    padding: '2px 8px',
                    background: 'var(--accent-primary-light)',
                    color: 'var(--accent-primary)',
                    border: '1px solid var(--accent-primary)',
                    fontWeight: 700
                  }}
                  title="Spontaneous movement burst — 10s dance party!"
                >
                  💃 10s dance break?
                </span>
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.1rem 0', letterSpacing: '-0.02em' }}>
                {greeting.text}, {userName} 🌱
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: 0 }}>
                How are you taking care of yourself today?
              </p>
            </div>
          </div>
        </div>

        {/* Cohesive Quick Wellness Action Group (Strict order: Check-In -> Take a Moment -> Quick Motivation) */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.6rem',
            background: 'var(--bg-secondary)',
            padding: '0.6rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {/* 1. 💬 Daily Check-In */}
          <button
            onClick={() => setIsCheckInOpen(true)}
            className="btn"
            style={{
              background: isCheckedInToday ? 'var(--accent-primary-light)' : 'var(--accent-primary)',
              color: isCheckedInToday ? 'var(--accent-primary)' : '#ffffff',
              border: `1.5px solid var(--accent-primary)`,
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="How am I doing today?"
          >
            <span>💬</span>
            <span>1. Daily Check-In</span>
            {isCheckedInToday && <CheckCircle size={13} color="var(--accent-primary)" />}
          </button>

          {/* 2. 🫧 Take a Moment */}
          <button
            onClick={() => setIsTakeAMomentOpen(true)}
            className="btn"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(123, 97, 255, 0.35)',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Pause, breathe, and ground yourself"
          >
            <span>🫧</span>
            <span>2. Take a Moment</span>
          </button>

          {/* 3. ✨ Quick Motivation */}
          <button
            onClick={() => setQuickSupportMode('motivation')}
            className="btn"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(217, 119, 54, 0.35)',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Short, encouraging perspective"
          >
            <span>✨</span>
            <span>3. Quick Motivation</span>
          </button>
        </div>
      </div>

      {/* 2. EXPLORATION MODE: ONE THING OR FULL VIEW LAUNCHER */}
      <div 
        className="card-glass"
        style={{
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, rgba(45, 106, 79, 0.12) 100%)',
          border: '1.5px solid var(--accent-primary)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '50%', 
              background: 'var(--accent-primary)', 
              color: '#ffffff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0,
              boxShadow: '0 3px 10px rgba(45, 106, 79, 0.25)'
            }}
          >
            <Compass size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
              <span className="pill-badge primary" style={{ fontSize: '0.68rem' }}>
                EXPLORATION MODE
              </span>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                At Your Pace
              </span>
            </div>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: '0.1rem 0', color: 'var(--text-primary)' }}>
              How would you like to explore today?
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
              Focus on one gentle habit at a time, or view your full wellness dashboard.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsGuideMeOpen(true)}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.84rem', gap: '0.35rem', fontWeight: 800, boxShadow: '0 3px 10px rgba(45, 106, 79, 0.2)' }}
          >
            <span>🌱 One Thing at a Time</span>
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('WELLNESS')}
            className="btn btn-secondary"
            style={{ padding: '0.6rem 1.1rem', fontSize: '0.84rem', gap: '0.35rem' }}
          >
            <Compass size={14} color="var(--accent-primary)" />
            <span>Full View</span>
          </button>
        </div>
      </div>

      {/* 3. WEEKLY WELLNESS OVERVIEW (Clutter-free, Cleaned header) */}
      <div className="card-glass" style={{ padding: '1.25rem 1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={17} color="var(--accent-primary)" />
              Wellness Overview ({overviewFrequency === 'daily' ? 'Today' : overviewFrequency === 'monthly' ? 'This Month' : 'This Week'})
            </h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              {overviewFrequency === 'daily' ? "Today's progress meters" : overviewFrequency === 'monthly' ? "4-Week habit rhythm" : "7-Day progress across your chosen areas"}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => onNavigateTab && onNavigateTab('WELLNESS')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              <span>Open Hub</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* WEEKLY DISPLAY (Default) */}
        {overviewFrequency === 'weekly' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {activePillarsList.map(p => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  onClick={() => navigateToWellness(p.id)}
                  className="card-interactive"
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.6rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: p.color }}>
                      <Icon size={14} />
                      <span>{p.label}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>{p.pct}%</span>
                  </div>

                  {/* 7-Day Dots Indicator (Mon-Sun) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '3px' }}>
                    {weekDays.map((d, i) => {
                      const isFilled = p.activeDays.includes(i);
                      return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{d}</span>
                          <div 
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: '3px',
                              background: isFilled ? p.color : 'var(--bg-tertiary)',
                              opacity: isFilled ? 1 : 0.4
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DAILY DISPLAY (If preferred) */}
        {overviewFrequency === 'daily' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {activePillarsList.map(d => (
              <div
                key={d.id}
                onClick={() => navigateToWellness(d.id)}
                className="card-interactive"
                style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: d.color }}>{d.label}</span>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0.2rem 0' }}>{d.dailyVal}</div>
                <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${d.dailyPct}%`, height: '100%', background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MONTHLY DISPLAY (If preferred) */}
        {overviewFrequency === 'monthly' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {activePillarsList.map(p => (
              <div
                key={p.id}
                onClick={() => navigateToWellness(p.id)}
                className="card-interactive"
                style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: p.color }}>{p.label}</span>
                <div style={{ fontSize: '1rem', fontWeight: 800, margin: '0.2rem 0' }}>{p.pct}% Monthly</div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Steady consistency</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. SCHEDULE & RHYTHM (Next Upcoming Event + Review Full Schedule with Progressive Disclosure) */}
      <div className="card-glass" style={{ padding: '1.25rem 1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CalendarIcon size={16} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Next Upcoming Event
            </h3>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('WELLNESS', { category: 'calendar' })}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-primary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            <span>Calendar</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {nextUpcomingEvent ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Single Highlighted Next Upcoming Event */}
            <div
              onClick={() => onNavigateTab && onNavigateTab('WELLNESS', { category: 'calendar' })}
              className="card-interactive"
              style={{
                padding: '0.95rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--accent-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.3rem' }}>
                  {nextUpcomingEvent.category === 'Social' ? '🫶' : nextUpcomingEvent.category === 'Workout' ? '🏃' : '✨'}
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                    <span className="pill-badge primary" style={{ fontSize: '0.66rem' }}>
                      UP NEXT
                    </span>
                    <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                      {nextUpcomingEvent.title}
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    📅 {nextUpcomingEvent.date === todayDateStr ? 'Today' : nextUpcomingEvent.date} at {nextUpcomingEvent.time} {nextUpcomingEvent.location ? `• 📍 ${nextUpcomingEvent.location}` : ''}
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '0.76rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                Details →
              </span>
            </div>

            {/* Review Full Schedule Trigger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem', fontSize: '0.78rem' }}
                >
                  <CalendarIcon size={13} />
                  <span>{isScheduleExpanded ? 'Hide Schedule' : 'Review Full Schedule'}</span>
                </button>

                {isScheduleExpanded && (
                  <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-tertiary)', padding: '0.15rem', borderRadius: 'var(--radius-pill)' }}>
                    {[
                      { id: 'today', label: 'Rest of Today' },
                      { id: 'week', label: 'Rest of This Week' },
                      { id: 'month', label: 'Rest of This Month' }
                    ].map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setScheduleScope(s.id)}
                        style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-pill)',
                          border: 'none',
                          background: scheduleScope === s.id ? 'var(--accent-primary)' : 'transparent',
                          color: scheduleScope === s.id ? '#ffffff' : 'var(--text-muted)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Revealed Scope Schedule List */}
              {isScheduleExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.35rem' }}>
                  {scopedScheduleEvents.length > 0 ? (
                    scopedScheduleEvents.map(evt => (
                      <div
                        key={evt.id}
                        onClick={() => onNavigateTab && onNavigateTab('WELLNESS', { category: 'calendar' })}
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span>{evt.category === 'Social' ? '🫶' : evt.category === 'Workout' ? '🏃' : '✨'}</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{evt.title}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                            ({evt.date === todayDateStr ? 'Today' : evt.date} • {evt.time})
                          </span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 600 }}>View</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                      No other events found for {scheduleScope === 'today' ? 'the rest of today' : scheduleScope === 'week' ? 'the rest of this week' : 'the rest of this month'}.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            No upcoming events scheduled. Tap Calendar to add a workout, dinner, or reminder.
          </p>
        )}
      </div>

      {/* POP-UP MODALS */}
      {isGuideMeOpen && (
        <GuideMeModal
          isOpen={isGuideMeOpen}
          onClose={() => setIsGuideMeOpen(false)}
          onNavigateTab={onNavigateTab}
        />
      )}

      {isCheckInOpen && (
        <DailyCheckInModal
          isOpen={isCheckInOpen}
          onClose={() => setIsCheckInOpen(false)}
        />
      )}

      {isCustomizeOverviewOpen && (
        <CustomizeOverviewModal
          isOpen={isCustomizeOverviewOpen}
          onClose={() => setIsCustomizeOverviewOpen(false)}
          selectedPillars={overviewPillars || ['hydrate', 'move', 'nourish', 'rest', 'mind']}
          onUpdatePillars={updateOverviewPillars}
        />
      )}

      {quickSupportMode && (
        <QuickSupportModal
          isOpen={!!quickSupportMode}
          mode={quickSupportMode}
          onClose={() => setQuickSupportMode(null)}
          onNavigateTab={onNavigateTab}
        />
      )}

      {isWardrobeOpen && (
        <MascotWardrobeModal
          onClose={() => setIsWardrobeOpen(false)}
        />
      )}

      {isTakeAMomentOpen && (
        <OverwhelmModal
          isOpen={isTakeAMomentOpen}
          onClose={() => setIsTakeAMomentOpen(false)}
        />
      )}

      {/* 🎉 Dance Party Modal */}
      {isDancePartyOpen && (
        <DancePartyModal
          isOpen={isDancePartyOpen}
          onClose={() => setIsDancePartyOpen(false)}
          initialDuration={10}
        />
      )}

    </div>
  );
}
