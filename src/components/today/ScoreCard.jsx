import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import { ShieldCheck, Info } from 'lucide-react';

export default function ScoreCard() {
  const { betterEveryDayScore } = useWellness();
  const { score, breakdown, ratingMessage, badgeColor } = betterEveryDayScore;

  // Calculate SVG circular stroke offset
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div 
      className="card-glass"
      style={{
        marginTop: '1.5rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, rgba(82, 183, 136, 0.06) 100%)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
            <ShieldCheck size={12} /> Daily Alignment
          </span>
          <h3 style={{ fontSize: '1.15rem' }}>Better Every Day Score</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Info size={13} />
          <span>Consistency, not perfection</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
        {/* Circular Progress Gauge */}
        <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
          <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="var(--bg-tertiary)"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={badgeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
          </svg>
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              / 100
            </span>
          </div>
        </div>

        {/* Holistic Explanations */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {ratingMessage}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '0.4rem' }}>
            {breakdown.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  background: item.achieved ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                  border: `1px solid ${item.achieved ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.5rem',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>{item.icon}</span>
                <span style={{ fontWeight: 600, color: item.achieved ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                  {item.label} ({item.pts})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
