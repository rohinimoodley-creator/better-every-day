import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  Trophy,
  Award,
  Heart,
  Flame,
  Check,
  Plus,
  Sparkles,
  Shield,
  Eye,
  EyeOff,
  TrendingUp,
  Smile,
  Pause,
  Play,
  Share2,
  Users,
  Palette,
  MessageCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CHEER_REACTIONS = [
  { key: 'love', label: '❤️ Celebrate' },
  { key: 'clap', label: '👏 Well done' },
  { key: 'proud', label: '🌱 Proud of you' },
  { key: 'momentum', label: '🔥 Momentum' }
];

export default function SocialChallengesView() {
  const {
    socialChallenges,
    toggleChallengeJoin,
    createCustomChallenge,
    pauseChallenge,
    resumeChallenge,
    socialSettings,
    updateSocialSettings,
    userProfile,
    userBadges,
    sharedCommunityThemes,
    socialFeedPosts,
    addSocialFeedPost,
    reactToSocialPost,
    setTheme
  } = useWellness();

  const [activeSubTab, setActiveSubTab] = useState('challenges'); // 'challenges' | 'feed' | 'leaderboard' | 'badges' | 'themes'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Movement');
  const [newType, setNewType] = useState('friend');
  const [newBaseline, setNewBaseline] = useState('15 mins gentle walk');
  const [newDays, setNewDays] = useState(7);
  const [newDesc, setNewDesc] = useState('');

  const [feedInput, setFeedInput] = useState('');
  const [feedActivityBadge, setFeedActivityBadge] = useState('🚶 Daily Walk');

  const [leaderboardScope, setLeaderboardScope] = useState(socialSettings.leaderboardScope || 'friends'); // 'friends' | 'gym' | 'regional' | 'global'
  const [leaderboardMode, setLeaderboardMode] = useState(socialSettings.leaderboardMode || 'supportive'); // 'supportive' | 'competitive' | 'private'

  const handleCreateChallenge = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createCustomChallenge({
      title: newTitle,
      category: newCategory,
      type: newType,
      individualBaseline: newBaseline,
      totalDays: newDays,
      description: newDesc || `Join us for a mindful ${newTitle} challenge!`
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  const handlePostFeed = (e) => {
    e.preventDefault();
    if (!feedInput.trim()) return;

    addSocialFeedPost({
      text: feedInput,
      activityBadge: feedActivityBadge
    });
    setFeedInput('');

    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  return (
    <div>
      {/* Sub Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-pill)' }}>
          {[
            { id: 'challenges', label: `🎯 Challenges (${socialChallenges.length})` },
            { id: 'feed', label: `💛 Social Feed & Cheers (${socialFeedPosts.length})` },
            { id: 'leaderboard', label: `🏆 Safe Leaderboards` },
            { id: 'badges', label: `🎖️ Badges (${userBadges.filter(b => b.unlocked).length}/${userBadges.length})` },
            { id: 'themes', label: `🎨 Community Themes (${sharedCommunityThemes.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: activeSubTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
                color: activeSubTab === tab.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeSubTab === 'challenges' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.75rem', gap: '0.3rem' }}
          >
            <Plus size={14} /> Create Challenge
          </button>
        )}
      </div>

      {/* =========================================================================
          TAB 1: INCLUSIVE & CUSTOM CHALLENGES
          ========================================================================= */}
      {activeSubTab === 'challenges' && (
        <div>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            🌱 <strong>Non-Punitive & Pausable:</strong> Participate at your own baseline. Pausing for rest, sick days, or travel never destroys your streak or wellness score.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {socialChallenges.map(chal => (
              <div key={chal.id} className="card-glass" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{chal.icon}</span>
                      <div>
                        <h4 style={{ fontSize: '1rem', margin: 0 }}>{chal.title}</h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {chal.category} • <strong style={{ textTransform: 'capitalize' }}>{chal.type || 'Community'}</strong>
                        </span>
                      </div>
                    </div>
                    <span className={`pill-badge ${chal.isPaused ? 'orange' : 'primary'}`} style={{ fontSize: '0.68rem' }}>
                      {chal.isPaused ? 'PAUSED ⏸️' : `${chal.daysLeft}d left`}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.45 }}>
                    {chal.description}
                  </p>

                  <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem', fontSize: '0.76rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      <span>Your Baseline: {chal.individualBaseline || '10 mins daily'}</span>
                      <span>{chal.userProgress} / {chal.totalDays} days</span>
                    </div>
                    <div className="progress-track" style={{ height: 6, marginBottom: '0.35rem' }}>
                      <div className="progress-fill" style={{ width: `${(chal.userProgress / chal.totalDays) * 100}%` }} />
                    </div>
                    {chal.groupProgressPercent !== undefined && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Group Completion: <strong>{chal.groupProgressPercent}%</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    👥 {chal.participantsCount} active
                  </span>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {chal.joined && (
                      <button
                        onClick={() => chal.isPaused ? resumeChallenge(chal.id) : pauseChallenge(chal.id, 'Rest & travel pause')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
                      >
                        {chal.isPaused ? <Play size={12} /> : <Pause size={12} />} {chal.isPaused ? 'Resume' : 'Pause'}
                      </button>
                    )}
                    <button
                      onClick={() => toggleChallengeJoin(chal.id)}
                      className={`btn btn-sm ${chal.joined ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {chal.joined ? 'Joined ✓' : 'Join Challenge'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SOCIAL FEED & CHEER WALL
          ========================================================================= */}
      {activeSubTab === 'feed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Post Composer */}
          <form onSubmit={handlePostFeed} className="card-glass" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.98rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Heart size={16} color="var(--accent-rose)" /> Share a Gentle Milestone or Reflection
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <input
                type="text"
                placeholder="e.g. Finished my morning stretch and feeling grounded for the day ahead! 🌿"
                value={feedInput}
                onChange={e => setFeedInput(e.target.value)}
                className="input-field"
                style={{ flex: 1 }}
                required
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Share Post
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tag action:</span>
              {['🚶 Daily Walk', '💧 Hydration Habit', '🧘 Mindful Rest', '🥗 Nourishing Meal'].map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setFeedActivityBadge(b)}
                  style={{
                    fontSize: '0.72rem',
                    background: feedActivityBadge === b ? 'var(--accent-primary-light)' : 'transparent',
                    border: feedActivityBadge === b ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.15rem 0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </form>

          {/* Social Posts List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {socialFeedPosts.map(post => (
              <div key={post.id} className="card-glass" style={{ padding: '1.15rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{post.avatar}</span>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{post.author}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                        {post.relationship} • {post.time}
                      </span>
                    </div>
                  </div>
                  {post.activityBadge && (
                    <span className="pill-badge primary" style={{ fontSize: '0.68rem' }}>
                      {post.activityBadge}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0.75rem 0', lineHeight: 1.5 }}>
                  {post.text}
                </p>

                {/* Encouragement Reactions Bar */}
                <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
                  {CHEER_REACTIONS.map(r => {
                    const count = post.reactions?.[r.key] || 0;
                    const isActive = post.userReaction === r.key;
                    return (
                      <button
                        key={r.key}
                        onClick={() => reactToSocialPost(post.id, r.key)}
                        style={{
                          background: isActive ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                          border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                          borderRadius: 'var(--radius-pill)',
                          padding: '0.2rem 0.55rem',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <span>{r.label}</span>
                        {count > 0 && <span style={{ fontWeight: 800 }}>{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SAFE LEADERBOARDS (OPT-IN)
          ========================================================================= */}
      {activeSubTab === 'leaderboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.2rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Trophy size={16} color="var(--accent-secondary)" /> Safe & Mindful Leaderboards
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Disabled by default. Ranks by habits and consistency milestones. Strictly <strong>zero weight or calorie competition</strong>.
                </p>
              </div>

              <button
                onClick={() => updateSocialSettings({ leaderboardOptIn: !socialSettings.leaderboardOptIn })}
                className={`btn btn-sm ${socialSettings.leaderboardOptIn ? 'btn-secondary' : 'btn-primary'}`}
              >
                {socialSettings.leaderboardOptIn ? 'Opt Out (Hide Rankings)' : 'Opt In to Leaderboards'}
              </button>
            </div>
          </div>

          {socialSettings.leaderboardOptIn ? (
            <div className="card-glass" style={{ padding: '1.5rem' }}>
              {/* Scope & Mode Filters */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.3rem', background: 'var(--bg-secondary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
                  {['friends', 'gym', 'regional', 'global'].map(scope => (
                    <button
                      key={scope}
                      onClick={() => setLeaderboardScope(scope)}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-pill)',
                        border: 'none',
                        background: leaderboardScope === scope ? 'var(--accent-primary-light)' : 'transparent',
                        color: leaderboardScope === scope ? 'var(--accent-primary)' : 'var(--text-muted)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {scope}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {[
                    { id: 'supportive', label: 'Supportive Mode' },
                    { id: 'competitive', label: 'Competitive Mode' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setLeaderboardMode(m.id)}
                      className={`btn btn-sm ${leaderboardMode === m.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Progress Anchor */}
              <div style={{ background: 'var(--accent-primary-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', borderLeft: '4px solid var(--accent-primary)' }}>
                <strong style={{ fontSize: '0.88rem', color: 'var(--accent-primary)' }}>🌟 Your Personal Progress (Most Important):</strong>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', margin: '0.2rem 0 0 0' }}>
                  You improved your walking consistency by 20% this month and maintained 5 consecutive days of mindful actions.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { rank: 1, name: 'Maya', metric: '18 Mindful Actions Completed', avatar: '👩' },
                  { rank: 2, name: `${userProfile.name} (You)`, metric: '16 Mindful Actions Completed', avatar: '🌱' },
                  { rank: 3, name: 'Lucas', metric: '14 Mindful Actions Completed', avatar: '👨' }
                ].map(item => (
                  <div key={item.rank} style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-primary)' }}>#{item.rank}</span>
                      <span style={{ fontSize: '1.3rem' }}>{item.avatar}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{item.name}</span>
                    </div>
                    <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
                      {item.metric}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Leaderboards are currently turned OFF. Your wellness is 100% personal and private. ✨
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: BADGES & MILESTONES
          ========================================================================= */}
      {activeSubTab === 'badges' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            🎖️ <strong>Meaningful Milestones:</strong> Badges celebrate genuine consistency and self-care. They never imply physical superiority or pressure.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
            {userBadges.map(b => (
              <div
                key={b.id}
                className="card-glass"
                style={{
                  padding: '1.25rem',
                  opacity: b.unlocked ? 1 : 0.65,
                  border: b.unlocked ? '1px solid var(--accent-primary)' : '1px dashed var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.6rem' }}>{b.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '0.96rem', margin: 0 }}>{b.title}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.category}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0.5rem 0' }}>
                  {b.description}
                </p>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: b.unlocked ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
                  {b.unlocked ? `Unlocked on ${b.dateEarned} ✓` : `In Progress: ${b.progressText}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: COMMUNITY THEMES SHOWCASE
          ========================================================================= */}
      {activeSubTab === 'themes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            🎨 <strong>Community Themes:</strong> Explore relaxing aesthetic themes created by friends. Sharing themes shares colors and imagery only—never private health or profile traits.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
            {sharedCommunityThemes.map(th => (
              <div key={th.id} className="card-glass" style={{ padding: '1.25rem', borderLeft: `5px solid ${th.primaryColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{th.icon}</span>
                    <strong style={{ fontSize: '0.94rem' }}>{th.title}</strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>by {th.author} {th.avatar}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0' }}>
                  {th.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>👥 {th.sharesCount} users</span>
                  <button
                    onClick={() => {
                      document.documentElement.style.setProperty('--accent-primary', th.primaryColor);
                      document.documentElement.style.setProperty('--accent-secondary', th.accentColor);
                      try {
                        confetti({ particleCount: 20, spread: 35, origin: { y: 0.6 } });
                      } catch(e) {}
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem' }}
                  >
                    Apply Theme
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE CUSTOM CHALLENGE MODAL */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Create Custom Wellness Challenge</h3>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateChallenge} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Challenge Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5-Day Sunset Walk Together"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Category
                  </label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="input-field">
                    <option value="Movement">Movement</option>
                    <option value="Hydration">Hydration</option>
                    <option value="Mind & Peace">Mind & Peace</option>
                    <option value="Rest & Sleep">Rest & Sleep</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Challenge Type
                  </label>
                  <select value={newType} onChange={e => setNewType(e.target.value)} className="input-field">
                    <option value="friend">Friends Challenge</option>
                    <option value="partner">Partner Goal</option>
                    <option value="family">Family Circle</option>
                    <option value="community">Open Community</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Personalized Baseline (e.g. 15 mins daily walk)
                </label>
                <input
                  type="text"
                  value={newBaseline}
                  onChange={e => setNewBaseline(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="30"
                    value={newDays}
                    onChange={e => setNewDays(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
                Launch Challenge 🎉
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
