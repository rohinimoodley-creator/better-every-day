import React, { useState } from 'react';
import GratitudeStudio from './GratitudeStudio';
import MindsetAffirmations from './MindsetAffirmations';
import { Sparkles, Heart, Sun } from 'lucide-react';

export default function MindHub() {
  const [activeTab, setActiveTab] = useState('gratitude'); // 'gratitude' | 'motivation'

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="pill-badge purple" style={{ fontSize: '0.72rem' }}>
              <Sparkles size={12} /> Mindset & Emotional Wellbeing
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Mind & Daily Reflection 🧘
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Cultivate gentle inner strength, appreciate daily micro-wins, and build positive neural pathways.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-pill)' }}>
          <button
            onClick={() => setActiveTab('gratitude')}
            style={{
              padding: '0.4rem 0.95rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTab === 'gratitude' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'gratitude' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeTab === 'gratitude' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            🙏 Gratitude Studio
          </button>

          <button
            onClick={() => setActiveTab('motivation')}
            style={{
              padding: '0.4rem 0.95rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTab === 'motivation' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'motivation' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeTab === 'motivation' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            🌸 Daily Motivation
          </button>
        </div>
      </div>

      {/* Tab Render */}
      <div>
        {activeTab === 'gratitude' && <GratitudeStudio />}
        {activeTab === 'motivation' && <MindsetAffirmations />}
      </div>

    </div>
  );
}
