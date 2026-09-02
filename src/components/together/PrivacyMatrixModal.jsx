import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import { ShieldCheck, Lock, Eye, X, AlertTriangle } from 'lucide-react';

export default function PrivacyMatrixModal({ profile, onClose }) {
  const { updatePrivacySetting } = useWellness();

  if (!profile) return null;

  const permissions = [
    { key: 'journal', label: 'Journal & Reflections', sensitive: true, desc: 'Private thoughts, gratitude notes, and free writing.' },
    { key: 'cycle', label: 'Menstrual Cycle Tracking', sensitive: true, desc: 'Phase estimation, symptoms, and cycle data.' },
    { key: 'goals', label: 'Wellness Priorities & Goals', sensitive: false, desc: 'Your current primary wellness target.' },
    { key: 'exercise', label: 'Workouts & Steps Activity', sensitive: false, desc: 'Completed walks, strength flows, and active minutes.' },
    { key: 'meals', label: 'Meal Logs & Recipes', sensitive: false, desc: 'Logged nourishment and submitted recipes.' },
    { key: 'calendar', label: 'Shared Social Calendar', sensitive: false, desc: 'Upcoming joint walks and wellness dates.' },
    { key: 'mood', label: 'Daily Mood Status', sensitive: false, desc: 'General daily mood chip (e.g. Energized, Calm).' }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
              <ShieldCheck size={12} /> Granular Privacy Control
            </span>
            <h3 style={{ fontSize: '1.25rem' }}>Permissions for {profile.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          🔒 <strong>Privacy by Design:</strong> Sensitive health logs and journals default to strictly private unless you explicitly opt in to share with this connection.
        </div>

        {/* Permission Toggles List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {permissions.map(perm => {
            const isShared = profile.privacy[perm.key];
            return (
              <div 
                key={perm.key}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {perm.label}
                    </span>
                    {perm.sensitive && (
                      <span className="pill-badge rose" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                        Sensitive
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                    {perm.desc}
                  </p>
                </div>

                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={!!isShared}
                    onChange={e => updatePrivacySetting(profile.id, perm.key, e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            );
          })}
        </div>

        <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
          Save Privacy Settings
        </button>
      </div>
    </div>
  );
}
