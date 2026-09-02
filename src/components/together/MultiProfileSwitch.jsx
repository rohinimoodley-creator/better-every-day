import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Users, Shield, Flame, UserCheck, Settings } from 'lucide-react';
import PrivacyMatrixModal from './PrivacyMatrixModal';

export default function MultiProfileSwitch() {
  const { connectedProfiles, activeProfileId, setActiveProfileId } = useWellness();
  const [selectedProfileForPrivacy, setSelectedProfileForPrivacy] = useState(null);

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Users size={18} color="var(--accent-primary)" /> Connected Loved Ones & Profiles
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Share encouragement with partners, friends, and family with individual privacy boundaries.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {connectedProfiles.map(p => {
          const isSelf = p.relation === 'self';
          const isActive = activeProfileId === p.id;

          return (
            <div 
              key={p.id}
              className="card-glass"
              style={{
                padding: '1.25rem',
                border: isActive ? '2px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>{p.avatar}</span>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{p.name}</h4>
                      <span className="pill-badge primary" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                        {p.relation.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.82rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>
                    <Flame size={14} />
                    <span>{p.consistencyStreak}d</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem' }}>
                  "{p.status}"
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <button
                  onClick={() => setSelectedProfileForPrivacy(p)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  <Shield size={13} /> Privacy Controls
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Privacy Matrix Modal */}
      {selectedProfileForPrivacy && (
        <PrivacyMatrixModal
          profile={selectedProfileForPrivacy}
          onClose={() => setSelectedProfileForPrivacy(null)}
        />
      )}
    </div>
  );
}
