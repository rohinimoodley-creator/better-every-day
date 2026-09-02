import React, { useState } from 'react';
import { useWellness } from '../../../context/WellnessContext';
import BodyTranslator from '../../nourish/BodyTranslator';
import BodySignalsModal from '../../body/BodySignalsModal';
import {
  Activity,
  Heart,
  Sparkles,
  AlertCircle,
  Plus,
  Flame,
  CheckCircle,
  Info,
  ShieldCheck,
  Search,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

const QUICK_BODY_SIGNALS = [
  { id: 'sig_energy_high', label: 'Energized & Light', icon: '⚡', category: 'Energy' },
  { id: 'sig_muscle_sore', label: 'Muscle Soreness', icon: '💪', category: 'Muscles' },
  { id: 'sig_head_tension', label: 'Head Tension', icon: '🧠', category: 'Head' },
  { id: 'sig_digestion_calm', label: 'Smooth Digestion', icon: '🥗', category: 'Gut' },
  { id: 'sig_fatigue', label: 'Sluggish / Heavy', icon: '🥱', category: 'Energy' },
  { id: 'sig_joint_stiff', label: 'Joint Stiffness', icon: '🦴', category: 'Joints' }
];

export default function BodyHub({ onNavigateTab }) {
  const { userProfile } = useWellness();
  const [loggedSignals, setLoggedSignals] = useState([
    { id: 1, signal: 'Energized & Light', time: 'Today, 08:30', note: 'Felt great after morning walk' },
    { id: 2, signal: 'Neck & Shoulder Tightness', time: 'Yesterday, 16:00', note: 'Desk posture check suggested' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customSignal, setCustomSignal] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('signals'); // 'signals' | 'translator'

  const handleQuickLog = (signal) => {
    const newEntry = {
      id: Date.now(),
      signal: signal.label,
      time: 'Just now',
      note: 'Quick logged from Body Hub'
    };
    setLoggedSignals(prev => [newEntry, ...prev]);
    try {
      confetti({ particleCount: 20, spread: 35, origin: { y: 0.7 } });
    } catch(err) {}
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customSignal.trim()) return;
    setLoggedSignals(prev => [
      { id: Date.now(), signal: customSignal, time: 'Just now', note: 'Personal observation' },
      ...prev
    ]);
    setCustomSignal('');
    try {
      confetti({ particleCount: 20, spread: 35, origin: { y: 0.7 } });
    } catch(err) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
              <Activity size={12} /> Physical Wellbeing
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            How My Body Feels 🧘
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Listen to body signals, physical symptoms, and translate sensations into helpful actions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary btn-sm"
          style={{ gap: '0.35rem' }}
        >
          <Plus size={14} /> Log Body Signal
        </button>
      </div>

      {/* Sub Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveSubTab('signals')}
          style={{
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: activeSubTab === 'signals' ? 'var(--accent-primary-light)' : 'transparent',
            color: activeSubTab === 'signals' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer'
          }}
        >
          🩺 Body Signals & Symptoms
        </button>

        <button
          onClick={() => setActiveSubTab('translator')}
          style={{
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: activeSubTab === 'translator' ? 'var(--accent-primary-light)' : 'transparent',
            color: activeSubTab === 'translator' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer'
          }}
        >
          🔍 Body Sensation Translator
        </button>
      </div>

      {activeSubTab === 'signals' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Quick Signal Buttons */}
          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.75rem 0' }}>
              Quick Log Current Sensation
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.6rem' }}>
              {QUICK_BODY_SIGNALS.map(sig => (
                <button
                  key={sig.id}
                  onClick={() => handleQuickLog(sig)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-glass)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{sig.icon}</span>
                  <span>{sig.label}</span>
                </button>
              ))}
            </div>

            {/* Custom input */}
            <form onSubmit={handleAddCustom} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
              <input
                type="text"
                placeholder="Or type a custom sensation (e.g., lower back stiffness, tingling)..."
                value={customSignal}
                onChange={e => setCustomSignal(e.target.value)}
                className="input-field"
                style={{ flex: 1, fontSize: '0.82rem' }}
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                Add
              </button>
            </form>
          </div>

          {/* Recent Signals Log */}
          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={16} color="var(--accent-primary)" /> Recent Body Signal History
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {loggedSignals.map(item => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 0.95rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {item.signal}
                    </span>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {item.note}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <BodyTranslator />
      )}

      {/* Global Body Signals Modal */}
      {isModalOpen && (
        <BodySignalsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
