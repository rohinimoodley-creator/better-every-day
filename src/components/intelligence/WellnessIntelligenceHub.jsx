import React, { useState, useMemo } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  generateWellnessIntelligenceReport,
  processUserFeedbackQuery,
  PATTERN_CONFIDENCE_TIERS,
  ALERT_PRIORITIES
} from '../../engine/wellnessIntelligenceEngine';
import IntelligenceDetailModal from './IntelligenceDetailModal';
import IntelligenceExportModal from './IntelligenceExportModal';
import AIMemoryModal from './AIMemoryModal';
import RecommendationFeedbackModal from './RecommendationFeedbackModal';
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
  MessageSquare,
  HelpCircle,
  Compass,
  FileText,
  Heart,
  Brain,
  Search,
  Lock,
  Smile
} from 'lucide-react';
import confetti from 'canvas-confetti';

const FEEDBACK_PRESET_QUESTIONS = [
  "How am I doing overall?",
  "What are my biggest wins?",
  "What should I focus on next?",
  "What patterns do you see in my routine?",
  "What has changed since I joined Better Every Day?"
];

export default function WellnessIntelligenceHub({ onNavigateTab }) {
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

  // Navigation & Sub-Tabs
  // 1: patterns, 2: progress, 3: gaps, 4: recommendations, 5: kudos, 6: alerts, 7: nutrition_craving, 8: gratitude, 9: my_story
  const [activeViewTab, setActiveViewTab] = useState('patterns');
  const [dateRange, setDateRange] = useState('this_week');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [viewMode, setViewMode] = useState('quick'); // 'quick' | 'detailed'

  // Modals
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAIMemoryOpen, setIsAIMemoryOpen] = useState(false);
  const [feedbackModalRec, setFeedbackModalRec] = useState(null);

  // Interactive "Get Feedback" State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [activeFeedbackResult, setActiveFeedbackResult] = useState(null);
  const [showGoalAdaptation, setShowGoalAdaptation] = useState(false);

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

  const handleRunFeedback = (question) => {
    const q = question || userQuery;
    if (!q.trim()) return;
    const result = processUserFeedbackQuery(q, { report, userProfile });
    setActiveFeedbackResult(result);
    setUserQuery('');
    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.7 }
      });
    } catch(e) {}
  };

  const handleRecommendationThumbsUp = (recId) => {
    submitRecommendationFeedback(recId, 'helpful');
    try {
      confetti({
        particleCount: 20,
        spread: 35,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  const dismissedIds = wellnessIntelligenceSettings?.dismissedInsights || [];
  const activeRecommendations = report.recommendations.filter(r => !dismissedIds.includes(r.id));
  const activeAlerts = report.alerts.filter(a => !dismissedIds.includes(a.id));

  return (
    <div style={{ maxWidth: 940, margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1rem' }}>
        <div>
          <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
            <Sparkles size={12} /> Personal Wellness Intelligence
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
            Progress & Insights 💡
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            "You don't need to change everything. Just understand your rhythms and make today a tiny bit better."
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsAIMemoryOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.3rem', fontSize: '0.78rem' }}
          >
            <Brain size={14} color="var(--accent-primary)" /> AI Memory
          </button>
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.3rem', fontSize: '0.78rem' }}
          >
            <MessageSquare size={14} color="var(--accent-primary)" /> Get Feedback
          </button>
          <button
            onClick={() => setIsExportOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.3rem', fontSize: '0.78rem' }}
          >
            <Printer size={14} /> Export Summary
          </button>
        </div>
      </div>

      {/* Date Range & Quick/Detailed View Toggle Bar */}
      <div 
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-glass)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Calendar size={15} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Analyzing:</span>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="input-field"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
          >
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="this_month">This Month</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="three_months">Last 3 Months</option>
            <option value="six_months">Last 6 Months</option>
            <option value="this_year">This Year</option>
            <option value="since_joining">Since I Joined Better Every Day</option>
            <option value="all_time">All Available History</option>
            <option value="custom">Custom Date Range</option>
          </select>

          {dateRange === 'custom' && (
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
              <input
                type="date"
                value={customFrom}
                onChange={e => setCustomFrom(e.target.value)}
                className="input-field"
                style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
              />
              <span style={{ fontSize: '0.75rem' }}>→</span>
              <input
                type="date"
                value={customTo}
                onChange={e => setCustomTo(e.target.value)}
                className="input-field"
                style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
              />
            </div>
          )}
        </div>

        {/* View Mode Toggle: Quick vs Detailed */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
          <button
            onClick={() => setViewMode('quick')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: viewMode === 'quick' ? 'var(--bg-secondary)' : 'transparent',
              color: viewMode === 'quick' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Quick View
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: viewMode === 'detailed' ? 'var(--bg-secondary)' : 'transparent',
              color: viewMode === 'detailed' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Detailed View 🔍
          </button>
        </div>
      </div>

      {/* Main 6+ Categories Navigation Toolbar */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.6rem'
        }}
      >
        {[
          { id: 'patterns', label: '🔎 Patterns' },
          { id: 'progress', label: '📈 Progress' },
          { id: 'gaps', label: '🌱 Gaps' },
          { id: 'recommendations', label: '💡 Suggestions' },
          { id: 'kudos', label: '🎉 Kudos' },
          { id: 'alerts', label: '⚠️ Alerts' },
          { id: 'nutrition_craving', label: '🥗 Nutrition & Cravings' },
          { id: 'gratitude', label: '💛 Gratitude Discovery' },
          { id: 'my_story', label: '📖 My Wellness Story' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveViewTab(tab.id)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeViewTab === tab.id ? 'var(--accent-primary-light)' : 'transparent',
              color: activeViewTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          VIEW 1: PATTERNS (Things the App Noticed)
          ========================================================================= */}
      {activeViewTab === 'patterns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            🔎 <strong>Pattern Intelligence:</strong> Meaningful correlations identified across your activity, sleep, mood, and hydration. Presented cautiously without assuming direct causality.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {report.patterns.map(pat => (
              <div key={pat.id} className="card-glass" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{pat.icon}</span>
                      <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{pat.title}</h4>
                    </div>
                    <span className={pat.tier.badgeClass} style={{ fontSize: '0.65rem' }}>
                      {pat.tier.label}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', margin: '0 0 0.65rem 0', lineHeight: 1.45 }}>
                    "{pat.observation}"
                  </p>

                  <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <strong>Why this matters:</strong> {pat.whyExplanation}
                  </div>

                  {viewMode === 'detailed' && (
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Evidence Details:</span>
                      <ul style={{ margin: '0.2rem 0 0 1rem', padding: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {pat.evidence.map((ev, i) => <li key={i}>{ev}</li>)}
                      </ul>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                        Methodology: {pat.whyText}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.75rem' }}>
                  <button
                    onClick={() => setSelectedDetailItem({ ...pat, modalType: 'pattern' })}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
                  >
                    View Deep Dive →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: PROGRESS (Things That Are Improving)
          ========================================================================= */}
      {activeViewTab === 'progress' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            📈 <strong>My Progress:</strong> Period-over-period comparisons. A decrease is never automatically labeled "bad"—context and recovery always matter.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {report.progressSummary.map(item => (
              <div key={item.id} className="card-glass" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                    <h4 style={{ fontSize: '1rem', margin: 0 }}>{item.title}</h4>
                  </div>
                  <span className="pill-badge primary" style={{ fontSize: '0.68rem' }}>
                    {item.status}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                  {item.detail}
                </p>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  💡 {item.contextNote}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: GAPS / AREAS TO FOCUS ON (No Failure Language)
          ========================================================================= */}
      {activeViewTab === 'gaps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            🌱 <strong>Areas to Focus On:</strong> Gentle opportunities for growth. We never use failure, weakness, or streak-shaming language.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {report.gaps.map(gap => (
              <div key={gap.id} className="card-glass" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>{gap.icon}</span>
                  <h4 style={{ fontSize: '1rem', margin: 0 }}>{gap.title}</h4>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
                  <strong>What we noticed:</strong> {gap.observation}
                </p>

                <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  💡 <strong>Gentle Opportunity:</strong> {gap.opportunity}
                </div>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  ✨ {gap.encouragement}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: RECOMMENDATIONS (Small Change Principle; WHAT / WHY / HOW)
          ========================================================================= */}
      {activeViewTab === 'recommendations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            💡 <strong>Actionable Suggestions:</strong> Grounded in the Small Change Principle. Rate suggestions to continuously refine what is recommended.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {activeRecommendations.map(rec => (
              <div key={rec.id} className="card-glass" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{rec.icon}</span>
                      <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{rec.category}</h4>
                    </div>
                    <span className="pill-badge primary" style={{ fontSize: '0.65rem' }}>
                      {rec.tag}
                    </span>
                  </div>

                  {/* WHAT */}
                  <div style={{ background: 'var(--accent-primary-light)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '0.6rem' }}>
                    <strong style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>WHAT:</strong>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', margin: '0.15rem 0 0 0', fontWeight: 600 }}>
                      {rec.what}
                    </p>
                  </div>

                  {/* WHY */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    <strong>WHY:</strong> {rec.why}
                  </div>

                  {/* HOW */}
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <strong>HOW:</strong> {rec.how}
                  </div>
                </div>

                {/* Feedback Toolbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.85rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Was this helpful?</span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => handleRecommendationThumbsUp(rec.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', gap: '0.2rem' }}
                      title="Helpful"
                    >
                      <ThumbsUp size={12} /> Yes
                    </button>
                    <button
                      onClick={() => setFeedbackModalRec(rec)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', gap: '0.2rem' }}
                      title="Not helpful"
                    >
                      <ThumbsDown size={12} /> No
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 5: KUDOS (Milestone Celebrations)
          ========================================================================= */}
      {activeViewTab === 'kudos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            🎉 <strong>Kudos & Celebrations:</strong> Positive trends worth continuing. We celebrate presence and self-care rather than rigid perfection.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {report.kudos.map(k => (
              <div key={k.id} className="card-glass" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>{k.icon}</span>
                  <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{k.title}</h4>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: '0 0 0.4rem 0', fontWeight: 600 }}>
                  {k.achievement}
                </p>

                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  ✨ {k.significance}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 6: ALERTS (Prioritized with Safety Boundaries)
          ========================================================================= */}
      {activeViewTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            ⚠️ <strong>Alerts vs. Recommendations:</strong> Alerts highlight important patterns worth monitoring. Better Every Day never diagnoses conditions or replaces medical professionals.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activeAlerts.length > 0 ? (
              activeAlerts.map(alt => (
                <div key={alt.id} className="card-glass" style={{ padding: '1.25rem', borderLeft: `4px solid ${alt.priority.id === 'safety' ? 'var(--accent-rose)' : 'var(--accent-secondary)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{alt.priority.icon}</span>
                      <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{alt.title}</h4>
                      <span className={alt.priority.badgeClass} style={{ fontSize: '0.65rem' }}>
                        {alt.priority.label}
                      </span>
                    </div>

                    <button
                      onClick={() => dismissInsight(alt.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Dismiss
                    </button>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                    {alt.message}
                  </p>

                  <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    🛡️ <strong>Safety & Context:</strong> {alt.safetyNote}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No active alerts at this time. Everything is looking steady! ✨
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 7: NUTRITION & CRAVING INTELLIGENCE
          ========================================================================= */}
      {activeViewTab === 'nutrition_craving' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Nutrient Patterns */}
          <div className="card-glass" style={{ padding: '1.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🥗</span>
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{report.nutrientPatterns.headline}</h4>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.45 }}>
              {report.nutrientPatterns.observation}
            </p>

            {report.nutrientPatterns.hasSufficientData && (
              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  Gentle Nourishing Food Ideas:
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.3rem' }}>
                  {report.nutrientPatterns.foodExamples.map((food, i) => (
                    <span key={i} className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              🛡️ {report.nutrientPatterns.safetyNote}
            </span>
          </div>

          {/* Craving Intelligence */}
          <div className="card-glass" style={{ padding: '1.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🍫</span>
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Craving Intelligence (Non-Deficiency Context)</h4>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 0.85rem 0' }}>
              Cravings are normal human signals influenced by sleep, stress, routine, and joy. They are never treated as proof of medical deficiency.
            </p>

            {report.cravingInsights.map((crav, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{crav.craving} Cravings:</strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0.4rem 0' }}>
                  {crav.explanation}
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)' }}>
                  🌱 <strong>Gentle Idea:</strong> {crav.gentleAlternative}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 8: GRATITUDE DISCOVERY & COMPARISON
          ========================================================================= */}
      {activeViewTab === 'gratitude' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Comparison View: What I Wrote vs What BED Noticed */}
          <div className="card-glass" style={{ padding: '1.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.4rem' }}>✨</span>
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Manual Entry vs. Discovered Moments</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 0.85rem 0' }}>
              Compare what you wrote in your daily journal with the micro-moments Better Every Day noticed.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>What You Wrote:</span>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', margin: '0.25rem 0 0 0', fontStyle: 'italic' }}>
                  "{report.gratitudeComparison.recentComparison.whatIUserWrote}"
                </p>
              </div>

              <div style={{ background: 'var(--accent-primary-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Moments We Noticed:</span>
                <ul style={{ margin: '0.25rem 0 0 1.1rem', padding: 0, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  {report.gratitudeComparison.recentComparison.whatAppNoticed.map((m, i) => (
                    <li key={i} style={{ marginBottom: '0.2rem' }}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Frequent Gratitude Themes */}
          <div className="card-glass" style={{ padding: '1.35rem' }}>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.65rem 0' }}>Frequent Sources of Daily Happiness</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {report.gratitudeComparison.frequencyThemes.map((th, i) => (
                <div key={i} style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{th.theme}</strong>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{th.note}</div>
                  </div>
                  <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
                    {th.count} times
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 9: MY WELLNESS STORY (Long-Term Narrative)
          ========================================================================= */}
      {activeViewTab === 'my_story' && (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.6rem' }}>📖</span>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{report.myStory.title}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Joined on {report.myStory.dateJoined} • {report.myStory.totalDays} Days of Progress
                </span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{report.myStory.stats.totalWorkouts}</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Active Walk Sessions</span>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{report.myStory.stats.totalHydrationLiters}L</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Water Consumed</span>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{report.myStory.stats.totalGratitudeMoments}</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Gratitude Moments</span>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{report.myStory.stats.streakMilestone}</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Compassionate Streak</span>
            </div>
          </div>

          {/* Long-Term Narrative Text */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-line', lineHeight: 1.6, fontSize: '0.88rem', color: 'var(--text-primary)', borderLeft: '4px solid var(--accent-primary)' }}>
            {report.myStory.narrative}
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE "GET FEEDBACK" MODAL
          ========================================================================= */}
      {isFeedbackOpen && (
        <div className="modal-backdrop" onClick={() => setIsFeedbackOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.4rem' }}>💬</span>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Consult Better Every Day</h3>
              </div>
              <button onClick={() => setIsFeedbackOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Ask any question about your wellness data, trends, or progress to receive supportive feedback.
            </p>

            {/* Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
              {FEEDBACK_PRESET_QUESTIONS.map((pq, i) => (
                <button
                  key={i}
                  onClick={() => handleRunFeedback(pq)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.6rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  {pq}
                </button>
              ))}
            </div>

            {/* Question Input */}
            <form onSubmit={e => { e.preventDefault(); handleRunFeedback(); }} style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
              <input
                type="text"
                placeholder="Ask about your progress..."
                value={userQuery}
                onChange={e => setUserQuery(e.target.value)}
                className="input-field"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Ask
              </button>
            </form>

            {/* Answer Display */}
            {activeFeedbackResult && (
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div>
                  <strong style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>🌟 What's Going Well:</strong>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', margin: '0.15rem 0 0 0' }}>
                    {activeFeedbackResult.whatsGoingWell}
                  </p>
                </div>
                <div>
                  <strong style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', textTransform: 'uppercase' }}>🔎 What We Noticed:</strong>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', margin: '0.15rem 0 0 0' }}>
                    {activeFeedbackResult.whatWeNoticed}
                  </p>
                </div>
                <div>
                  <strong style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>🌱 One Small Next Step:</strong>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', margin: '0.15rem 0 0 0', fontWeight: 600 }}>
                    {activeFeedbackResult.oneSmallNextStep}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedDetailItem && (
        <IntelligenceDetailModal
          item={selectedDetailItem}
          type={selectedDetailItem.modalType}
          onClose={() => setSelectedDetailItem(null)}
        />
      )}

      {/* AI MEMORY MODAL */}
      {isAIMemoryOpen && (
        <AIMemoryModal onClose={() => setIsAIMemoryOpen(false)} />
      )}

      {/* RECOMMENDATION FEEDBACK MODAL */}
      {feedbackModalRec && (
        <RecommendationFeedbackModal
          recommendation={feedbackModalRec}
          onClose={() => setFeedbackModalRec(null)}
        />
      )}

      {/* EXPORT MODAL */}
      {isExportOpen && (
        <IntelligenceExportModal
          report={report}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
}
