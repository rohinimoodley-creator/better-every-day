import React, { useState } from 'react';
import { X, BarChart2, Activity, Droplets, Utensils, Sparkles, Moon, Heart, ChevronRight, Check } from 'lucide-react';

export default function IntelligenceDetailModal({ isOpen, onClose, report, userProfile }) {
  const [activeCategory, setActiveCategory] = useState('all');

  if (!isOpen || !report) return null;

  const categories = [
    { id: 'all', label: 'All Pillars' },
    { id: 'movement', label: '🚶 Movement' },
    { id: 'hydration', label: '💧 Hydration' },
    { id: 'nutrition', label: '🥗 Nutrition' },
    { id: 'mind', label: '✨ Mind & Gratitude' },
    { id: 'rest', label: '🌙 Rest & Sleep' }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 680, maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.2rem' }}>
              <BarChart2 size={12} /> Deep Dive Analysis
            </span>
            <h3 style={{ fontSize: '1.35rem', margin: 0 }}>Detailed Wellness Intelligence 📊</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: activeCategory === c.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                background: activeCategory === c.id ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                color: activeCategory === c.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Detailed Content Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Movement Details */}
          {(activeCategory === 'all' || activeCategory === 'movement') && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', padding: '1.15rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>🚶</span>
                <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Movement & Step Rhythms</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                Compared to your previous baseline, your movement frequency is up by 20%. Outdoor walking continues to be your primary movement anchor with higher average consistency on weekdays.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Active Days</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>4 / 7 Days</span>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Daily Avg Steps</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>5,840 Steps</span>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Favorite Mode</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Morning Walk</span>
                </div>
              </div>
            </div>
          )}

          {/* Hydration Details */}
          {(activeCategory === 'all' || activeCategory === 'hydration') && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', padding: '1.15rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>💧</span>
                <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Hydration Intake & Timing</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                Water intake is strongest between 8:00 AM and 11:30 AM. Intake averages 5.4 cups/day against your personal target of 9 cups.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Daily Average</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>1,350 ml</span>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Consistency Rate</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>78%</span>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Best Window</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Morning Wakeup</span>
                </div>
              </div>
            </div>
          )}

          {/* Nutrition Details */}
          {(activeCategory === 'all' || activeCategory === 'nutrition') && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', padding: '1.15rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>🥗</span>
                <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Nutritional Variety & Satiety</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                Across your logged meals, whole plant diversity and fiber-rich grain bowls correlated with balanced afternoon energy. Foods rich in plant iron (spinach, lentils) appeared in 3 of your last 8 logged meals.
              </p>
              <div style={{ background: 'rgba(45, 106, 79, 0.08)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                ℹ️ General nutrition observation. Non-diagnostic.
              </div>
            </div>
          )}

          {/* Mind & Gratitude Details */}
          {(activeCategory === 'all' || activeCategory === 'mind') && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', padding: '1.15rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>✨</span>
                <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Mindfulness, Gratitude & Social Ties</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                You have captured multiple positive moments relating to family, friends, and nature walks. Social check-ins with friends (Maya, Lucas) consistently correlated with joyful mood ratings.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
