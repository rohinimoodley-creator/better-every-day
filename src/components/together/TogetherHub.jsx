import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import SocialCalendar from './SocialCalendar';
import WellnessCircles from './WellnessCircles';
import SharedPlansView from './SharedPlansView';
import GymCommunityHub from './GymCommunityHub';
import SocialChallengesView from './SocialChallengesView';
import SocialPrivacyCenter from './SocialPrivacyCenter';
import {
  Users,
  Calendar,
  ShieldCheck,
  Heart,
  FileText,
  Dumbbell,
  Trophy,
  Sparkles,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TogetherHub() {
  const { socialSettings, updateSocialParticipationLevel, howIThrive } = useWellness();
  const [activeTab, setActiveTab] = useState('circles'); // 'circles' | 'calendar' | 'plans' | 'gym' | 'challenges' | 'privacy'

  const participationLevel = socialSettings.socialParticipationLevel || 'friends';

  const navTabs = [
    { id: 'circles', label: '👥 Friends & Circles' },
    { id: 'calendar', label: '📅 Social Calendar' },
    { id: 'plans', label: '📋 Shared Plans' },
    { id: 'gym', label: '🏋️ My Gym' },
    { id: 'challenges', label: '🏆 Challenges & Feed' },
    { id: 'privacy', label: '🔒 Sharing & Privacy' }
  ];

  const handleLevelChange = (level) => {
    updateSocialParticipationLevel(level);
    try {
      confetti({
        particleCount: 20,
        spread: 35,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* Main Header & Participation Switcher */}
      <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
              <Heart size={12} /> Social Wellness Ecosystem
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
              Together & Community 🤝
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              "I can grow with other people without having to compete with them."
            </p>
          </div>

          {/* Social Participation Mode Selector */}
          <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Participation Level
            </div>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[
                { id: 'private', label: 'Private', icon: '🔒' },
                { id: 'friends', label: 'Friends', icon: '👥' },
                { id: 'community', label: 'Community', icon: '🌱' },
                { id: 'competitive', label: 'Competitive', icon: '🏆' }
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => handleLevelChange(lvl.id)}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: participationLevel === lvl.id ? 'var(--accent-primary)' : 'transparent',
                    color: participationLevel === lvl.id ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                  title={`Switch to ${lvl.label} mode`}
                >
                  <span>{lvl.icon}</span> {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* OVERWHELM MODE CALM NOTICE */}
      {howIThrive?.overwhelmMode && (
        <div style={{ background: 'var(--accent-primary-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', borderLeft: '4px solid var(--accent-primary)' }}>
          <strong style={{ fontSize: '0.86rem', color: 'var(--accent-primary)' }}>🧘 Overwhelm Mode Active:</strong>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginLeft: '0.35rem' }}>
            Social feeds and leaderboards are automatically softened to protect your energy.
          </span>
        </div>
      )}

      {/* Sub-Nav Tabs Toolbar */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.6rem'
        }}
      >
        {navTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTab === tab.id ? 'var(--accent-primary-light)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render Active Tab View */}
      {activeTab === 'circles' && <WellnessCircles />}
      {activeTab === 'calendar' && <SocialCalendar />}
      {activeTab === 'plans' && <SharedPlansView />}
      {activeTab === 'gym' && <GymCommunityHub />}
      {activeTab === 'challenges' && <SocialChallengesView />}
      {activeTab === 'privacy' && <SocialPrivacyCenter />}
    </div>
  );
}
