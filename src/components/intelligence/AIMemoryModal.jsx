import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  Brain,
  Shield,
  Trash2,
  X,
  Check,
  Lock,
  Sparkles,
  AlertTriangle,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AIMemoryModal({ onClose }) {
  const {
    aiMemories,
    deleteAIMemory,
    clearAllAIMemory,
    toggleAIMemory,
    wellnessIntelligenceSettings
  } = useWellness();

  const isEnabled = wellnessIntelligenceSettings?.aiMemoryEnabled ?? true;

  const handleDeleteItem = (id) => {
    deleteAIMemory(id);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all remembered AI context preferences?')) {
      clearAllAIMemory();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>AI Memory & Boundaries</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                User Context & Recommendation Preferences
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* AI Memory Master Switch */}
        <div 
          style={{
            background: isEnabled ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
            border: `1px solid ${isEnabled ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}
        >
          <div>
            <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              {isEnabled ? 'AI Context Memory Active' : 'AI Context Memory Disabled'}
            </strong>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
              {isEnabled ? 'Helps Better Every Day tailor suggestions to your pacing and schedule.' : 'Recommendations will use only your immediate single-day check-in.'}
            </p>
          </div>

          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={e => toggleAIMemory(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Sensitive Information Privacy Guarantee */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <Lock size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Strict Privacy Boundary:</strong> Private journals, confidential reflections, medical diagnoses, and medications are <em>never</em> stored as permanent AI memory.
          </div>
        </div>

        {/* List of Remembered Context Items */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h4 style={{ fontSize: '0.88rem', margin: 0, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Stored Preferences ({aiMemories.length})
          </h4>
          {aiMemories.length > 0 && (
            <button
              onClick={handleClearAll}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Clear All Memory
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 260, overflowY: 'auto', marginBottom: '1.25rem' }}>
          {aiMemories.length > 0 ? (
            aiMemories.map(mem => (
              <div
                key={mem.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  padding: '0.75rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <span className="pill-badge primary" style={{ fontSize: '0.65rem', marginBottom: '0.2rem' }}>
                    {mem.category}
                  </span>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: '0.15rem 0 0 0', lineHeight: 1.35 }}>
                    "{mem.preference}"
                  </p>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Added {mem.dateAdded}</span>
                </div>

                <button
                  onClick={() => handleDeleteItem(mem.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem' }}
                  title="Delete this remembered preference"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              No custom AI memories currently stored.
            </div>
          )}
        </div>

        <button onClick={onClose} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
          Done
        </button>
      </div>
    </div>
  );
}
