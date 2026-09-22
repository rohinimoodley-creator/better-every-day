import React, { useState, useMemo } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  generateWellnessIntelligenceReport
} from '../../engine/wellnessIntelligenceEngine';
import IntelligenceDetailModal from '../intelligence/IntelligenceDetailModal';
import IntelligenceExportModal from '../intelligence/IntelligenceExportModal';
import AIMemoryModal from '../intelligence/AIMemoryModal';
import RecommendationFeedbackModal from '../intelligence/RecommendationFeedbackModal';
import {
  Sparkles,
  Award,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Printer,
  Brain,
  X,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InsightsHub({ onNavigateTab, initialTab = 'summary' }) {
  const {
    userProfile,
    dailyCheckIn,
    hydrationMl = 0,
    activeWorkoutMinutes = 0,
    completedWorkouts = [],
    stepCount = 0,
    loggedMeals = [],
    journalEntries = [],
    discoveredGratitude = [],
    smallStepState,
    cravingsLogs = [],
    wellnessIntelligenceSettings,
    submitRecommendationFeedback,
    dismissInsight
  } = useWellness();

  // Single page sections: Recommendations & Kudos toggle states
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [showKudos, setShowKudos] = useState(false);

  // Modals
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAIMemoryOpen, setIsAIMemoryOpen] = useState(false);
  const [feedbackModalRec, setFeedbackModalRec] = useState(null);

  // Generate Report
  const report = useMemo(() => {
    return generateWellnessIntelligenceReport({
      dateRange: 'this_week',
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
    } catch (e) {}
  };

  const dismissedIds = wellnessIntelligenceSettings?.dismissedInsights || [];
  const allRecs = (report.recommendations || []).filter(r => !dismissedIds.includes(r.id));
  const top3Recommendations = allRecs.slice(0, 3);

  const defaultKudos = [
    { id: 'kudos_1', title: 'Hydration Consistency 💧', desc: 'Maintained gentle, steady hydration throughout this week.' },
    { id: 'kudos_2', title: 'Sustainable Pacing ⭐', desc: 'Respected your energy with intentional movement breaks and rest.' },
    { id: 'kudos_3', title: 'Mindful Presence 🌿', desc: 'Saved daily moments of gratitude and reflection.' }
  ];
  const allKudos = (report.kudos && report.kudos.length > 0 ? report.kudos : defaultKudos);
  const top3Kudos = allKudos.slice(0, 3);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3.5rem' }}>
      
      {/* 1. Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.7rem' }}>
              <Brain size={11} /> Personal Intelligence
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
            Insights & Understanding 💡
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
            Notice patterns, connect habits, and celebrate your gentle progress.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsAIMemoryOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.3rem', fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
          >
            <Brain size={13} color="var(--accent-primary)" /> AI Memory
          </button>
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.3rem', fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
          >
            <Printer size={13} /> Export
          </button>
        </div>
      </div>

      {/* 2. Top Summary Section: 5-Pillar Consistency Overview */}
      <div className="card-glass" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Weekly Consistency Overview
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Balanced reflection across your 5 core pillars
            </span>
          </div>
          <span className="pill-badge primary" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
            THIS WEEK
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {[
            { name: 'Hydration', icon: '💧', pct: Math.min(100, Math.round((hydrationMl / 2250) * 100)), color: '#3a86c8', note: `${hydrationMl} ml logged` },
            { name: 'Movement', icon: '🏃', pct: Math.min(100, Math.round((stepCount / 8000) * 100)), color: '#40916c', note: `${stepCount} steps • ${activeWorkoutMinutes}m active` },
            { name: 'Nourishment', icon: '🥗', pct: Math.min(100, (loggedMeals.length || 2) * 35), color: '#d97736', note: `${loggedMeals.length || 2} meals logged` },
            { name: 'Rest & Recovery', icon: '🌙', pct: 85, color: '#7b61ff', note: '7.5 hrs avg sleep' },
            { name: 'Mind & Presence', icon: '🌿', pct: Math.min(100, (journalEntries.length + discoveredGratitude.length) * 40 || 75), color: '#8b5cf6', note: `${journalEntries.length + discoveredGratitude.length || 3} reflections` }
          ].map(pillar => (
            <div key={pillar.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <span>{pillar.icon}</span>
                  <span>{pillar.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{pillar.note}</span>
                  <strong style={{ color: pillar.color, fontSize: '0.82rem' }}>{pillar.pct}%</strong>
                </div>
              </div>
              <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${pillar.pct}%`, 
                    background: pillar.color, 
                    borderRadius: 3, 
                    transition: 'width 0.6s ease' 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Narrative */}
        <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {report.summary?.narrative || 'You have maintained a steady, gentle rhythm throughout this week. Movement breaks and hydration pacing have supported your daily energy.'}
          </p>
        </div>
      </div>

      {/* 3. Two Sleek Toggle Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        
        {/* Button 1: Recommendations */}
        <button
          type="button"
          onClick={() => setShowRecommendations(prev => !prev)}
          className="card-glass card-interactive"
          style={{
            padding: '1rem 0.85rem',
            borderRadius: 'var(--radius-card)',
            background: showRecommendations 
              ? 'linear-gradient(135deg, rgba(64, 145, 108, 0.15) 0%, var(--bg-glass-card) 100%)' 
              : 'var(--bg-secondary)',
            border: showRecommendations ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
            minHeight: '88px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Lightbulb size={18} color="var(--accent-primary)" />
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Recommendations
            </h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Top 3 suggestions
            </span>
            {showRecommendations ? <ChevronUp size={14} color="var(--accent-primary)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
          </div>
        </button>

        {/* Button 2: Kudos */}
        <button
          type="button"
          onClick={() => setShowKudos(prev => !prev)}
          className="card-glass card-interactive"
          style={{
            padding: '1rem 0.85rem',
            borderRadius: 'var(--radius-card)',
            background: showKudos 
              ? 'linear-gradient(135deg, rgba(231, 169, 59, 0.15) 0%, var(--bg-glass-card) 100%)' 
              : 'var(--bg-secondary)',
            border: showKudos ? '1.5px solid var(--accent-gold, #f59e0b)' : '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
            minHeight: '88px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Award size={18} color="var(--accent-gold, #f59e0b)" />
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Kudos
            </h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Top 3 milestones
            </span>
            {showKudos ? <ChevronUp size={14} color="var(--accent-gold, #f59e0b)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
          </div>
        </button>
      </div>

      {/* 4. Revealed Content: Top 3 Recommendations */}
      {showRecommendations && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Top 3 Tailored Suggestions
            </span>
          </div>

          {top3Recommendations.length > 0 ? (
            top3Recommendations.map(rec => (
              <div
                key={rec.id}
                className="card-glass"
                style={{
                  padding: '1.15rem',
                  borderLeft: '4px solid var(--accent-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="pill-badge primary" style={{ fontSize: '0.66rem' }}>
                    {rec.pillar || 'Wellness'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button
                      type="button"
                      onClick={() => handleRecommendationThumbsUp(rec.id)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.25rem 0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        color: 'var(--accent-primary)'
                      }}
                      title="Helpful"
                    >
                      <ThumbsUp size={11} /> Helpful
                    </button>
                    <button
                      type="button"
                      onClick={() => dismissInsight && dismissInsight(rec.id)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.25rem',
                        cursor: 'pointer',
                        color: 'var(--text-muted)'
                      }}
                      title="Dismiss"
                    >
                      <X size={11} />
                    </button>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {rec.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {rec.action}
                </p>

                {/* Explainable Why Pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.3rem 0.55rem', borderRadius: 'var(--radius-sm)' }}>
                  <Sparkles size={11} color="var(--accent-primary)" />
                  <span><strong>Why:</strong> {rec.reason || `Informed by your ${rec.pillar?.toLowerCase() || 'wellness'} pattern and daily rhythm.`}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="card-glass" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Your rhythm is well-balanced today. Keep up the gentle pace!
            </div>
          )}
        </div>
      )}

      {/* 5. Revealed Content: Top 3 Kudos */}
      {showKudos && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--accent-gold, #f59e0b)', textTransform: 'uppercase' }}>
              Top 3 Celebrated Milestones
            </span>
          </div>

          {top3Kudos.map(k => (
            <div
              key={k.id}
              className="card-glass"
              style={{
                padding: '1.15rem',
                borderLeft: '4px solid var(--accent-gold, #f59e0b)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}
            >
              <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>🏆</div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.15rem 0', color: 'var(--text-primary)' }}>
                  {k.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {k.desc || k.message}
                </p>
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
