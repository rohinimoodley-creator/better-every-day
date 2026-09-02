import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import { generateWellnessInsights } from '../../engine/insightsEngine';
import { Sparkles, TrendingUp, Compass, Info } from 'lucide-react';

export default function WellnessInsightsView() {
  const insights = generateWellnessInsights({});

  return (
    <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div>
          <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
            <TrendingUp size={12} /> Personalized Pattern Recognition
          </span>
          <h3 style={{ fontSize: '1.3rem' }}>Wellness Insights</h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Observations, not diagnoses
        </span>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        Over time, Better Every Day connects the dots across your movement, sleep, water, and mood logs to reveal gentle, supportive lifestyle patterns.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.85rem' }}>
        {insights.map(ins => (
          <div
            key={ins.id}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{ins.icon}</span>
                <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{ins.title}</h4>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.35 }}>
                "{ins.observation}"
              </p>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              💡 <strong>Gentle Tip:</strong> {ins.tip}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
