import React from 'react';
import GratitudeStudio from './GratitudeStudio';
import { Sparkles, Heart } from 'lucide-react';

export default function MindHub() {
  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
          <span className="pill-badge purple" style={{ fontSize: '0.72rem' }}>
            <Sparkles size={12} /> Mind & Emotional Wellbeing
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Mind & Gratitude 🧘
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
          Capture your own moments of appreciation and discover the quiet joys in your day.
        </p>
      </div>

      {/* Primary Experience: My Gratitude & Gratitude Discovery */}
      <GratitudeStudio />

    </div>
  );
}

