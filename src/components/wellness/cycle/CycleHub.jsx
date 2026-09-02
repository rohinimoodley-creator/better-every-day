import React from 'react';
import { useWellness } from '../../../context/WellnessContext';
import MenstrualModule from '../../profile/MenstrualModule';
import { Moon, Heart, Sparkles, Shield, Calendar } from 'lucide-react';

export default function CycleHub({ onNavigateTab }) {
  const { userProfile } = useWellness();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
          <span className="pill-badge rose" style={{ fontSize: '0.72rem' }}>
            <Moon size={12} /> Cycle & Hormone Syncing
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Cycle & Hormone Rhythm 🌸
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
          Understand your monthly phases, align workouts and nourishment with your natural hormonal cadence.
        </p>
      </div>

      <MenstrualModule />
    </div>
  );
}
