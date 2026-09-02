import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import DailyCheckInModal from '../checkin/DailyCheckInModal';
import QuickSupportModal from './QuickSupportModal';
import GuideMeModal from './GuideMeModal';
import CustomizeOverviewModal, { ALL_OVERVIEW_PILLARS } from './CustomizeOverviewModal';
import PipSproutAvatar from '../mascot/PipSproutAvatar';
import MascotWardrobeModal from '../mascot/MascotWardrobeModal';
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
  Compass
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
    updateOverviewPillars
  } = useWellness();

  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isGuideMeOpen, setIsGuideMeOpen] = useState(false);
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
  const userName = userProfile?.name || 'Friend';

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

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      
      {/* 1. GREETING + MASCOT & DAILY CHECK-IN (Next to Greeting) */}
      <div 
        className="card-glass"
        style={{
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, var(--accent-primary-light) 100%)',
          padding: '1.5rem 1.75rem',
          border: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Integrated Pip the Sprout Mascot Avatar (Clickable to customize) */}
          <PipSproutAvatar size={56} mood="happy" onClick={() => setIsWardrobeOpen(true)} />

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {todayDateFormatted}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.1rem 0', letterSpacing: '-0.02em' }}>
              {greeting.text}, {userName} 🌱
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              How are you taking care of yourself today?
            </p>
          </div>
        </div>

        {/* Daily Check-In Button (Next to Greeting) */}
        <div>
          {isCheckedInToday ? (
            <button
              onClick={() => setIsCheckInOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'var(--bg-secondary)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--accent-primary)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                cursor: 'pointer'
              }}
              title="Click to view or update your Daily Check-In"
            >
              <CheckCircle size={15} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Daily Check-In
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsCheckInOpen(true)}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', fontWeight: 800, gap: '0.4rem', boxShadow: '0 3px 12px rgba(45, 106, 79, 0.25)' }}
            >
              <Sparkles size={15} />
              <span>Daily Check-In</span>
            </button>
          )}
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

      {/* 3. NEED A LITTLE SUPPORT? (Moved Above Wellness Overview) */}
      <div 
        className="card-glass"
        style={{
          padding: '1.25rem 1.4rem',
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, rgba(224, 86, 96, 0.05) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Need a little support? 💛
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Quick access to lift your spirit or reset your nervous system
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button
            onClick={() => setQuickSupportMode('motivation')}
            className="card-interactive"
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>🌸</span>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Quick Motivation
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Gentle perspective
              </div>
            </div>
          </button>

          <button
            onClick={() => setQuickSupportMode('breathe')}
            className="card-interactive"
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>🫧</span>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Quick Breathe
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                1-min de-stress circle
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. CUSTOMIZABLE WEEKLY WELLNESS OVERVIEW */}
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
              onClick={() => setIsCustomizeOverviewOpen(true)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-pill)',
                padding: '0.35rem 0.75rem',
                color: 'var(--text-primary)',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              title="Choose what pillars appear in your overview"
            >
              <Sliders size={12} color="var(--accent-primary)" />
              <span>Customize</span>
            </button>

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

      {/* 5. TODAY & UPCOMING SCHEDULE */}
      <div className="card-glass" style={{ padding: '1.25rem 1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CalendarIcon size={16} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Today & Upcoming
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

        {upcomingEvents.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {upcomingEvents.map(evt => (
              <div
                key={evt.id}
                onClick={() => onNavigateTab && onNavigateTab('WELLNESS', { category: 'calendar' })}
                className="card-interactive"
                style={{
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem' }}>
                    {evt.category === 'Social' ? '🫶' : evt.category === 'Workout' ? '🏃' : '✨'}
                  </span>
                  <div>
                    <strong style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>{evt.title}</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {evt.date === todayDateStr ? 'Today' : evt.date} at {evt.time} {evt.location ? `• ${evt.location}` : ''}
                    </div>
                  </div>
                </div>

                <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  View →
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            No events scheduled for today. Tap Calendar to add a workout, dinner, or reminder.
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

    </div>
  );
}
