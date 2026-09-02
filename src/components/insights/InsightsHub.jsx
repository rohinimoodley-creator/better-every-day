import React, { useState, useMemo } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  generateWellnessIntelligenceReport,
  processUserFeedbackQuery,
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
  MessageSquare,
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

const ASK_PROMPTS = [
  "Why have I been feeling so tired lately?",
  "Why am I hungrier than usual?",
  "Is there a pattern between my sleep and mood?",
  "What has changed in my routine this week?",
  "What are my biggest wellness wins?",
  "What small step should I focus on next?"
];

export const INSIGHTS_TABS = [
  { id: 'overview', label: 'Overview', icon: Target },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'patterns', label: 'Patterns', icon: Sparkles },
  { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  { id: 'kudos', label: 'Kudos', icon: Award },
  { id: 'ask', label: 'Ask Better Every Day', icon: MessageSquare, isHighlight: true }
];

export default function InsightsHub({ onNavigateTab, initialTab = 'overview' }) {
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

  const [activeTab, setActiveTab] = useState(initialTab || 'overview');
  const [dateRange, setDateRange] = useState('this_week');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  // Modals
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAIMemoryOpen, setIsAIMemoryOpen] = useState(false);
  const [feedbackModalRec, setFeedbackModalRec] = useState(null);

  // Ask AI State
  const [userQuery, setUserQuery] = useState('');
  const [activeQueryResult, setActiveQueryResult] = useState(null);

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

  const handleRunQuery = (question) => {
    const q = question || userQuery;
    if (!q.trim()) return;
    const result = processUserFeedbackQuery(q, { report, userProfile });
    setActiveQueryResult(result);
    setUserQuery('');
    try {
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
    } catch(e) {}
  };

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
      
      {/* 4.1 OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Key Score & Balance */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="card-glass" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Overall Wellness Score
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)', margin: '0.2rem 0' }}>
                {report.wellnessScore || 84}/100
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Strong baseline consistency across hydration and mindful breaks.
              </p>
            </div>

            <div className="card-glass" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Primary Pattern Highlight
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.3rem 0' }}>
                {report.patterns?.[0]?.title || 'Sleep + Mood Synchrony'}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                {report.patterns?.[0]?.description || 'On days with 7+ hours sleep, afternoon mood and energy stay higher.'}
              </p>
            </div>
          </div>

          {/* Quick Pillar Health Meter */}
          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.85rem 0' }}>
              Pillar Balance Snapshot
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
              {[
                { name: 'Hydration', val: '92%', icon: Droplets, color: '#3a86c8' },
                { name: 'Movement', val: '78%', icon: Footprints, color: 'var(--accent-primary)' },
                { name: 'Nourish', val: '85%', icon: Utensils, color: 'var(--accent-secondary)' },
                { name: 'Rest', val: '88%', icon: Moon, color: '#7b61ff' },
                { name: 'Mind', val: '90%', icon: Sparkles, color: '#8b5cf6' }
              ].map(p => {
                const Icon = p.icon;
                return (
                  <div key={p.name} style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <Icon size={12} color={p.color} /> {p.name}
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                      {p.val}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Recommendation CTA */}
          {activeRecommendations.length > 0 && (
            <div 
              className="card-glass"
              style={{
                padding: '1.25rem',
                borderLeft: '4px solid var(--accent-primary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <span className="pill-badge primary" style={{ fontSize: '0.68rem', marginBottom: '0.2rem' }}>
                  💡 Suggested Focus
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.2rem 0' }}>
                  {activeRecommendations[0].title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {activeRecommendations[0].action}
                </p>
              </div>

              <button 
                onClick={() => setActiveTab('recommendations')}
                className="btn btn-secondary btn-sm"
              >
                View All Recommendations →
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4.2 SUMMARY */}
      {activeTab === 'summary' && (
        <div className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
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

      {/* 4.3 PATTERNS */}
      {activeTab === 'patterns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(report.patterns || []).map(pat => (
            <div
              key={pat.id}
              className="card-glass"
              style={{
                padding: '1.25rem',
                borderLeft: '4px solid #7b61ff',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedDetailItem({ type: 'pattern', data: pat })}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {pat.title}
                </h4>
                <span className="pill-badge primary" style={{ fontSize: '0.68rem' }}>
                  {pat.confidence || 'Strong Correlation'}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
                {pat.description}
              </p>
              <div style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                Tap to explore correlation details →
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4.4 RECOMMENDATIONS & OBSERVATIONS */}
      {activeTab === 'recommendations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Gentle Proactive Observations (Previously Alerts) */}
          {activeAlerts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.5rem' }}>
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
            Actionable Next Steps
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

      {/* 4.6 KUDOS */}
      {activeTab === 'kudos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(report.kudos || [
            { id: 1, title: 'Hydration Hero 💧', desc: 'Met hydration goal 4 days in a row.' },
            { id: 2, title: 'Gentle Pacing Star ⭐', desc: 'Listened to your body with timely rest pauses.' }
          ]).map(k => (
            <div
              key={k.id}
              className="card-glass"
              style={{
                padding: '1.25rem',
                borderLeft: '4px solid var(--accent-gold)',
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

      {/* 4.7 ASK BETTER EVERY DAY */}
      {activeTab === 'ask' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div 
            className="card-glass"
            style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, var(--accent-primary-light) 100%)',
              border: '1px solid var(--border-glass)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <Sparkles size={16} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                Ask Better Every Day 💬
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
              Ask anything about your health trends, sleep, moods, cravings, and habits.
            </p>

            {/* Prompt presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
              {ASK_PROMPTS.map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunQuery(promptText)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  "{promptText}"
                </button>
              ))}
            </div>

            {/* Custom Query Input */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleRunQuery(); }}
              style={{ display: 'flex', gap: '0.5rem' }}
            >
              <input
                type="text"
                placeholder="Ask about your routine, fatigue, food patterns..."
                value={userQuery}
                onChange={e => setUserQuery(e.target.value)}
                className="input-field"
                style={{ flex: 1, fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ gap: '0.3rem' }}>
                <Sparkles size={14} /> Ask
              </button>
            </form>
          </div>

          {/* Query Result Card */}
          {activeQueryResult && (
            <div className="card-glass" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
                  Analysis for: "{activeQueryResult.question || activeQueryResult.topic}"
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: '0 0 0.85rem 0' }}>
                {activeQueryResult.response || activeQueryResult.answer}
              </p>

              {activeQueryResult.suggestions && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                    Gentle Adjustment
                  </span>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                    {activeQueryResult.suggestions}
                  </p>
                </div>
              )}
            </div>
          )}
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
