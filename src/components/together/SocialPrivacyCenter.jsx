import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  Shield,
  ShieldCheck,
  BellOff,
  Bell,
  Lock,
  Heart,
  Eye,
  EyeOff,
  UserCheck,
  AlertTriangle,
  Sparkles,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SocialPrivacyCenter() {
  const {
    relationships,
    updateRelationshipPrivacy,
    socialSettings,
    updateSocialSettings,
    toggleSocialQuietMode,
    userProfile
  } = useWellness();

  const [activePartner, setActivePartner] = useState(relationships.find(r => r.labels?.includes('Partner')) || relationships[0]);

  const categories = [
    { key: 'exercise', label: 'Exercise & Workouts', desc: 'Completed walks and workouts', sensitive: false },
    { key: 'steps', label: 'Daily Step Progress', desc: 'Step counts and progress toward goal', sensitive: false },
    { key: 'water', label: 'Water & Hydration', desc: 'Hydration logs and water intake', sensitive: false },
    { key: 'meals', label: 'Logged Meals & Recipes', desc: 'Dishes, nutrients, and meal plans', sensitive: false },
    { key: 'mood', label: 'Daily Mood Status', desc: 'General mood check-in (e.g. Calm, Energized)', sensitive: false },
    { key: 'calendar', label: 'Shared Social Calendar', desc: 'Confirmed social walks and activities', sensitive: false },
    { key: 'cycle', label: 'Menstrual Phase (Partner Support)', desc: 'Simplified, non-invasive supportive guidance for partner', sensitive: true },
    { key: 'journal', label: 'Journal Reflections', desc: 'Private personal journal writing', sensitive: true },
    { key: 'insights', label: 'Wellness Intelligence Insights', desc: 'Personal patterns and AI interpretations', sensitive: true }
  ];

  return (
    <div>
      {/* SOCIAL QUIET MODE HERO BANNER */}
      <div 
        className="card-glass"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          borderLeft: `5px solid ${socialSettings.socialQuietMode ? 'var(--accent-secondary)' : 'var(--accent-primary)'}`,
          background: socialSettings.socialQuietMode ? 'var(--accent-primary-light)' : 'var(--bg-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              {socialSettings.socialQuietMode ? <BellOff size={18} color="var(--accent-secondary)" /> : <Bell size={18} color="var(--accent-primary)" />}
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Social Quiet Mode</h4>
              <span className={`pill-badge ${socialSettings.socialQuietMode ? 'orange' : 'primary'}`} style={{ fontSize: '0.68rem' }}>
                {socialSettings.socialQuietMode ? 'ACTIVE (Paused)' : 'OFF (Connected)'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
              Temporarily mute all social invitations, cheers, and community alerts. Your personal wellness tracking continues uninterrupted.
            </p>
          </div>

          <button
            onClick={toggleSocialQuietMode}
            className={`btn btn-sm ${socialSettings.socialQuietMode ? 'btn-primary' : 'btn-secondary'}`}
          >
            {socialSettings.socialQuietMode ? 'Turn Off Quiet Mode' : 'Enable Quiet Mode'}
          </button>
        </div>
      </div>

      {/* SUPPORTIVE PARTNER MENSTRUAL CARE VIEW */}
      {userProfile.cycleTrackingEnabled && (
        <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <span className="pill-badge rose">
              <Heart size={12} /> Partner Support Mode
            </span>
          </div>
          <h4 style={{ fontSize: '1.15rem', margin: '0 0 0.35rem 0' }}>Simplified Partner Cycle Guidance</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            If enabled, your partner receives respectful, non-invasive suggestions (e.g. <em>"A little extra patience and rest may be appreciated today"</em>). Private symptoms and journals are never exposed.
          </p>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>Share supportive guidance with partner (Maya)</strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Non-diagnostic, respectful communication only.</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={socialSettings.partnerMenstrualSharing}
                onChange={e => updateSocialSettings({ partnerMenstrualSharing: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      )}

      {/* GRANULAR PERMISSION MATRIX & INSTANT REVOCATION */}
      <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.2rem' }}>
              <ShieldCheck size={12} /> Granular Consent
            </span>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Sharing Boundaries & Instant Revocation</h3>
          </div>

          {/* Partner Selector */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {relationships.map(r => (
              <button
                key={r.id}
                onClick={() => setActivePartner(r)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  border: activePartner.id === r.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: activePartner.id === r.id ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                  color: activePartner.id === r.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {r.avatar} {r.name}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Configuring what <strong>{activePartner.name}</strong> is permitted to see. Defaults to private.
        </p>

        {/* Permissions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {categories.map(cat => {
            const isGranted = !!(activePartner.privacy || {})[cat.key];
            return (
              <div
                key={cat.key}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {cat.label}
                    </span>
                    {cat.sensitive && (
                      <span className="pill-badge rose" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                        Sensitive
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                    {cat.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isGranted ? (
                    <button
                      onClick={() => updateRelationshipPrivacy(activePartner.id, cat.key, false)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', padding: '0.2rem 0.5rem' }}
                    >
                      Revoke
                    </button>
                  ) : (
                    <button
                      onClick={() => updateRelationshipPrivacy(activePartner.id, cat.key, true)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                    >
                      Grant
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
