import React, { useState } from 'react';
import { ArrowRight, Sparkles, Info, ThumbsUp, ThumbsDown, X, ShieldCheck } from 'lucide-react';
import { useWellness } from '../../context/WellnessContext';

export default function RecommendationsList({ recommendations, onNavigateTab }) {
  const { incrementHydration, submitRecommendationFeedback } = useWellness();
  const [expandedWhyId, setExpandedWhyId] = useState(null);
  const [dismissedLocal, setDismissedLocal] = useState([]);

  const handleActionClick = (rec) => {
    if (rec.id === 'rec_recover_2' || rec.id === 'rec_balance_1') {
      incrementHydration(250);
    }
    if (onNavigateTab && rec.tab) {
      onNavigateTab(rec.tab);
    }
  };

  const handleFeedback = (recId, type) => {
    if (type === 'not_relevant') {
      setDismissedLocal(prev => [...prev, recId]);
      submitRecommendationFeedback(recId, 'not_helpful', 'Not relevant to my current routine');
    } else {
      submitRecommendationFeedback(recId, 'helpful');
    }
  };

  const visibleRecs = recommendations.filter(r => !dismissedLocal.includes(r.id));

  if (visibleRecs.length === 0) return null;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
            <Sparkles size={18} color="var(--accent-primary)" /> Tailored For You Today
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
            Based on your mood, energy, and body signals.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {visibleRecs.map((rec, index) => {
          const isWhyOpen = expandedWhyId === rec.id;
          return (
            <div
              key={rec.id || index}
              className="card-glass"
              style={{
                padding: '1.15rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div 
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--accent-primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      flexShrink: 0
                    }}
                  >
                    {rec.icon || '🌱'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span className="pill-badge primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                        {rec.tag || 'Guidance'}
                      </span>
                      <h4 style={{ fontSize: '0.98rem', margin: 0 }}>{rec.title}</h4>
                    </div>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                      {rec.desc}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                  <button
                    onClick={() => setExpandedWhyId(isWhyOpen ? null : rec.id)}
                    style={{
                      background: isWhyOpen ? 'var(--accent-primary-light)' : 'transparent',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                    title="Why am I seeing this recommendation?"
                  >
                    <Info size={12} />
                    <span>Why?</span>
                  </button>

                  <button
                    onClick={() => handleActionClick(rec)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span>{rec.actionText || 'Open'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* WHY AM I SEEING THIS? ACCORDION DRAWER */}
              {isWhyOpen && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-primary)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ShieldCheck size={14} /> Why am I seeing this?
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Non-diagnostic suggestion</span>
                  </div>

                  <p style={{ color: 'var(--text-primary)', margin: '0 0 0.4rem 0', lineHeight: 1.45 }}>
                    {rec.whyText || `Based on your recent daily check-in signals and activity rhythm. This is tailored to help you take one achievable small step without pressure.`}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Was this helpful?</span>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        onClick={() => handleFeedback(rec.id, 'helpful')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                      >
                        👍 Helpful
                      </button>
                      <button
                        onClick={() => handleFeedback(rec.id, 'not_relevant')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', color: 'var(--text-muted)' }}
                      >
                        🚫 Not relevant to me
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
