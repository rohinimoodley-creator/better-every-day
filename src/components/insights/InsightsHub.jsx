import React, { useState, useMemo } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  generateWellnessIntelligenceReport,
  PATTERN_CONFIDENCE_TIERS,
  ALERT_PRIORITIES
} from '../../engine/wellnessIntelligenceEngine';
import IntelligenceDetailModal from '../intelligence/IntelligenceDetailModal';
import IntelligenceExportModal from '../intelligence/IntelligenceExportModal';
import AIMemoryModal from '../intelligence/AIMemoryModal';
import RecommendationFeedbackModal from '../intelligence/RecommendationFeedbackModal';
import {
  BarChart2,
  Calendar,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Award,
  Target,
  Lightbulb,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Printer,
  Edit3,
  RefreshCw,
  Clock,
  Droplets,
  Footprints,
  Utensils,
  Moon,
  Info,
  ShieldCheck,
  ArrowRight,
  Flame,
  HelpCircle,
  Compass,
  FileText,
  Heart,
  Brain,
  Search,
  Lock,
  Smile,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const INSIGHTS_TABS = [
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  { id: 'kudos', label: 'Kudos', icon: Award }
];

export default function InsightsHub({ onNavigateTab, initialTab = 'summary' }) {
  const {
    userProfile,
    dailyCheckIn,
    hydrationMl,
    activeWorkoutMinutes,
    completedWorkouts,
    stepCount,
    loggedMeals,
    journalEntries,
    discoveredGratitude,
    smallStepState,
    cravingsLogs,
    wellnessIntelligenceSettings,
    submitRecommendationFeedback,
    dismissInsight
  } = useWellness();

  const [activeTab, setActiveTab] = useState(initialTab === 'overview' || initialTab === 'patterns' ? 'summary' : (initialTab || 'summary'));
  const [dateRange, setDateRange] = useState('this_week');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);
  const [recommendationsGenerated, setRecommendationsGenerated] = useState(true);

  // Modals
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAIMemoryOpen, setIsAIMemoryOpen] = useState(false);
  const [feedbackModalRec, setFeedbackModalRec] = useState(null);

  // Generate Report
  const report = useMemo(() => {
    return generateWellnessIntelligenceReport({
      dateRange,
      customFrom,
      customTo,
      userProfile,
      checkIn: dailyCheckIn,
      hydrationMl,
      activeWorkoutMinutes,
      completedWorkouts,
      stepCount,
      loggedMeals,
      journalEntries,
      discoveredGratitude,
      smallStepState,
      cravingsLogs
    });
  }, [
    dateRange,
    customFrom,
    customTo,
    userProfile,
    dailyCheckIn,
    hydrationMl,
    activeWorkoutMinutes,
    completedWorkouts,
    stepCount,
    loggedMeals,
    journalEntries,
    discoveredGratitude,
    smallStepState,
    cravingsLogs
  ]);



  const handleRecommendationThumbsUp = (recId) => {
    if (submitRecommendationFeedback) submitRecommendationFeedback(recId, 'helpful');
    try {
      confetti({ particleCount: 20, spread: 35, origin: { y: 0.6 } });
    } catch(e) {}
  };

  const dismissedIds = wellnessIntelligenceSettings?.dismissedInsights || [];
  const activeRecommendations = (report.recommendations || []).filter(r => !dismissedIds.includes(r.id));
  const activeAlerts = (report.alerts || []).filter(a => !dismissedIds.includes(a.id));

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 1. Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
              <Brain size={12} /> Personal Intelligence
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Insights & Understanding 💡
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            "Help me understand myself." Notice patterns, connect dots, and make gentle adjustments.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsAIMemoryOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.3rem', fontSize: '0.78rem' }}
          >
            <Brain size={14} color="var(--accent-primary)" /> AI Memory
          </button>
          <button
            onClick={() => setIsExportOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.3rem', fontSize: '0.78rem' }}
          >
            <Printer size={14} /> Export Report
          </button>
        </div>
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
        {INSIGHTS_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
              <span>{tab.label}</span>
              {tab.id === 'alerts' && activeAlerts.length > 0 && (
                <span style={{ background: '#d64062', color: '#fff', fontSize: '0.65rem', padding: '0.05rem 0.35rem', borderRadius: '10px' }}>
                  {activeAlerts.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Date Range Selector Bar */}
      <div 
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          padding: '0.5rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.8rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Calendar size={14} color="var(--accent-primary)" />
          <span style={{ fontWeight: 700 }}>Timeframe:</span>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="input-field"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.76rem', width: 'auto' }}
          >
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="last_week">Last Week</option>
            <option value="this_month">This Month</option>
          </select>
        </div>

        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {report.patterns?.length || 0} patterns observed across 5 pillars
        </span>
      </div>

      {/* 4. Tab Views */}
      
      {/* 4.1 SUMMARY */}
      {activeTab === 'summary' && (
        <div className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            {report.summary?.headline || 'Weekly Wellness Narrative'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {report.summary?.narrative || 'You have maintained steady rhythm throughout this week. Mindful breaks and water intake have been especially solid.'}
          </p>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Key Accomplishments
            </span>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              <li>Completed 5 consecutive morning water glasses.</li>
              <li>Logged daily reflections on 6 out of 7 days.</li>
              <li>Protected streak through 1 rest pause day.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 4.2 RECOMMENDATIONS & OBSERVATIONS */}
      {activeTab === 'recommendations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Header & Trigger Button */}
          <div className="card-glass" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Tailored Recommendations ✨
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                Personalized suggestions adapted to your {dateRange === 'today' ? 'day' : dateRange === 'this_month' ? 'month' : 'week'} and daily rhythm.
              </p>
            </div>
            <button
              onClick={() => {
                setIsGeneratingRecs(true);
                setTimeout(() => {
                  setIsGeneratingRecs(false);
                  setRecommendationsGenerated(true);
                  try { confetti({ particleCount: 22, spread: 40, origin: { y: 0.6 } }); } catch(e) {}
                }, 500);
              }}
              disabled={isGeneratingRecs}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.8rem', gap: '0.4rem', padding: '0.45rem 0.9rem' }}
            >
              <Sparkles size={14} /> {isGeneratingRecs ? 'Generating Suggestions...' : 'Generate Recommendations'}
            </button>
          </div>

          {/* Gentle Proactive Observations */}
          {activeAlerts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Noticed Observations
              </div>
              {activeAlerts.map(alt => (
                <div
                  key={alt.id}
                  className="card-glass"
                  style={{
                    padding: '1.1rem 1.25rem',
                    borderLeft: '4px solid var(--accent-secondary)',
                    background: 'var(--accent-secondary-light)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                      💡 Gentle Observation
                    </span>
                    <button
                      onClick={() => dismissInsight && dismissInsight(alt.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text-primary)' }}>
                    {alt.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {alt.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Actionable Recommendations */}
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Actionable Next Steps ({dateRange.replace('_', ' ')})
          </div>

          {activeRecommendations.map(rec => (
            <div
              key={rec.id}
              className="card-glass"
              style={{
                padding: '1.25rem',
                borderLeft: '4px solid var(--accent-primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="pill-badge primary" style={{ fontSize: '0.68rem' }}>
                  {rec.pillar || 'Wellness'}
                </span>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    onClick={() => handleRecommendationThumbsUp(rec.id)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.3rem 0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      color: 'var(--accent-primary)'
                    }}
                    title="Helpful"
                  >
                    <ThumbsUp size={12} /> Helpful
                  </button>
                  <button
                    onClick={() => dismissInsight && dismissInsight(rec.id)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.3rem',
                      cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}
                    title="Dismiss"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>{rec.title}</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>{rec.action}</p>
            </div>
          ))}
        </div>
      )}

      {/* 4.3 KUDOS */}
      {activeTab === 'kudos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(report.kudos && report.kudos.length > 0 ? report.kudos : [
            { id: 1, title: 'Hydration Consistency 💧', desc: `Maintained gentle, steady hydration throughout ${dateRange === 'this_month' ? 'this month' : 'this week'}.` },
            { id: 2, title: 'Sustainable Pacing ⭐', desc: 'Respected your body with intentional movement breaks and rest.' },
            { id: 3, title: 'Mindful Presence 🌿', desc: 'Saved daily moments of gratitude and reflection.' }
          ]).map(k => (
            <div
              key={k.id}
              className="card-glass"
              style={{
                padding: '1.25rem',
                borderLeft: '4px solid var(--accent-gold, #f59e0b)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ fontSize: '2rem' }}>🏆</div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.2rem 0' }}>{k.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>{k.desc || k.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}



      {/* Modals */}
      {selectedDetailItem && (
        <IntelligenceDetailModal
          item={selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
        />
      )}

      {isExportOpen && (
        <IntelligenceExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          report={report}
        />
      )}

      {isAIMemoryOpen && (
        <AIMemoryModal
          isOpen={isAIMemoryOpen}
          onClose={() => setIsAIMemoryOpen(false)}
        />
      )}
    </div>
  );
}
