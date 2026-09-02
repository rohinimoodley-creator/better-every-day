import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  Users,
  Heart,
  Sparkles,
  Flame,
  Plus,
  UserPlus,
  UserCheck,
  Shield,
  MoreVertical,
  X,
  Check,
  Compass,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const RELATIONSHIP_LABELS = [
  'Friend',
  'Family',
  'Partner',
  'Gym buddy',
  'Accountability Partner',
  'Wellness buddy',
  'Bestie'
];

export default function WellnessCircles() {
  const {
    circles,
    createCircle,
    leaveCircle,
    cheerCircleMember,
    relationships,
    toggleFollowRelationship,
    blockRelationship,
    userProfile
  } = useWellness();

  const [activeSection, setActiveSection] = useState('circles'); // 'circles' | 'relationships' | 'accountability'
  const [isCreateCircleOpen, setIsCreateCircleOpen] = useState(false);
  const [circleName, setCircleName] = useState('');
  const [circleType, setCircleType] = useState('Friends');
  const [circleAvatar, setCircleAvatar] = useState('🌱');
  const [selectedLabels, setSelectedLabels] = useState(['Besties']);
  const [safetyReportTarget, setSafetyReportTarget] = useState(null);

  const handleCheer = (circleId, feedIdx) => {
    cheerCircleMember(circleId, feedIdx);
    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.7 }
      });
    } catch(e) {}
  };

  const handleCreateCircleSubmit = (e) => {
    e.preventDefault();
    if (!circleName.trim()) return;

    createCircle({
      name: circleName,
      type: circleType,
      avatar: circleAvatar,
      labels: selectedLabels,
      members: ['Devan (You)', 'Maya']
    });

    setCircleName('');
    setIsCreateCircleOpen(false);
    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  const accountabilityPartners = relationships.filter(r => 
    (r.labels || []).includes('Accountability Partner') || (r.labels || []).includes('Partner')
  );

  return (
    <div>
      {/* Sub-nav Pill Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-pill)' }}>
          <button
            onClick={() => setActiveSection('circles')}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeSection === 'circles' ? 'var(--bg-secondary)' : 'transparent',
              color: activeSection === 'circles' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🌱 Circles ({circles.length})
          </button>
          <button
            onClick={() => setActiveSection('relationships')}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeSection === 'relationships' ? 'var(--bg-secondary)' : 'transparent',
              color: activeSection === 'relationships' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            👥 Friends & Follows ({relationships.length})
          </button>
          <button
            onClick={() => setActiveSection('accountability')}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeSection === 'accountability' ? 'var(--bg-secondary)' : 'transparent',
              color: activeSection === 'accountability' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🎯 Accountability ({accountabilityPartners.length})
          </button>
        </div>

        {activeSection === 'circles' && (
          <button
            onClick={() => setIsCreateCircleOpen(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={14} /> Create Circle
          </button>
        )}
      </div>

      {/* =========================================================================
          SECTION 1: WELLNESS CIRCLES
          ========================================================================= */}
      {activeSection === 'circles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {circles.map(circle => (
            <div key={circle.id} className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Circle Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '2rem' }}>{circle.avatar}</span>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{circle.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {circle.type} • {circle.membersCount} members
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => leaveCircle(circle.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer' }}
                    title="Leave Circle"
                  >
                    Leave
                  </button>
                </div>

                {/* Challenge Card */}
                {circle.currentChallenge && (
                  <div 
                    style={{
                      background: 'var(--accent-primary-light)',
                      border: '1px solid rgba(82, 183, 136, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                        🎯 {circle.currentChallenge.title}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {circle.currentChallenge.daysLeft} days left
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', lineHeight: 1.35 }}>
                      {circle.currentChallenge.desc}
                    </p>

                    <div className="progress-track" style={{ height: 6 }}>
                      <div className="progress-fill" style={{ width: `${circle.currentChallenge.progressPercent}%` }} />
                    </div>
                  </div>
                )}

                {/* Circle Cheer Feed */}
                <h5 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Circle Cheer Wall
                </h5>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem' }}>
                  {(circle.activityFeed || []).map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: 'var(--bg-tertiary)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {item.user} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>• {item.time}</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                          {item.text}
                        </p>
                      </div>

                      <button 
                        onClick={() => handleCheer(circle.id, idx)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', gap: '0.2rem', flexShrink: 0 }}
                      >
                        <Heart size={12} color="var(--accent-rose)" /> {item.cheers || 0}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Members: {(circle.members || []).join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          SECTION 2: FRIENDS, FOLLOWS & RELATIONSHIPS
          ========================================================================= */}
      {activeSection === 'relationships' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            🤝 <strong>Relationship Architecture:</strong> <strong>Follow</strong> is one-way. When two users mutually follow each other, they become <strong>Friends</strong> (eligible for direct calendar invitations).
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {relationships.map(rel => {
              const isFriend = rel.relationshipType === 'friend';
              const isFollowing = rel.relationshipType === 'following';

              return (
                <div key={rel.id} className="card-glass" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontSize: '2rem' }}>{rel.avatar}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{rel.name}</h4>
                            <span className={`pill-badge ${isFriend ? 'primary' : isFollowing ? 'blue' : 'gray'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                              {isFriend ? 'Mutual Friend' : isFollowing ? 'Following' : 'Follower'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginTop: '0.25rem' }}>
                            {(rel.labels || []).map((lbl, idx) => (
                              <span key={idx} style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', background: 'var(--accent-primary-light)', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-sm)' }}>
                                {lbl}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', margin: '0 0 0.85rem 0', fontStyle: 'italic' }}>
                      "{rel.status}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <button
                      onClick={() => toggleFollowRelationship(rel.id)}
                      className={`btn btn-sm ${isFollowing || isFriend ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ flex: 1, fontSize: '0.75rem' }}
                    >
                      {isFollowing || isFriend ? 'Unfollow' : 'Follow Back'}
                    </button>
                    <button
                      onClick={() => setSafetyReportTarget(rel)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
                      title="Safety & Block Options"
                    >
                      <Shield size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: ACCOUNTABILITY PARTNERS
          ========================================================================= */}
      {activeSection === 'accountability' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            🎯 <strong>Accountability without Pressure:</strong> An accountability partner is someone you choose to check in with gently on specific habits (e.g. daily walking or evening water).
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {accountabilityPartners.map(p => (
              <div key={p.id} className="card-glass" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>{p.avatar}</span>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{p.name}</h4>
                    <span className="pill-badge primary" style={{ fontSize: '0.68rem' }}>
                      Accountability Anchor
                    </span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', borderLeft: '3px solid var(--accent-primary)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Shared Habit Focus
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                    {p.accountabilityFocus || 'Evening Walk & Hydration'}
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  💬 Ready to ask: <em>"Did you manage to take your 15-minute walk today?"</em>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE CIRCLE MODAL */}
      {isCreateCircleOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateCircleOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Create Wellness Circle</h3>
              <button onClick={() => setIsCreateCircleOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCircleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Circle Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sunset Walk Squad"
                  value={circleName}
                  onChange={e => setCircleName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Circle Avatar / Emoji</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['🌱', '💛', '🏃', '☕', '💧', '✨', '🌲'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setCircleAvatar(emoji)}
                      style={{
                        fontSize: '1.4rem',
                        padding: '0.35rem 0.6rem',
                        borderRadius: 'var(--radius-md)',
                        border: circleAvatar === emoji ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: circleAvatar === emoji ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Category Label</label>
                <select
                  value={circleType}
                  onChange={e => setCircleType(e.target.value)}
                  className="input-field"
                >
                  <option value="Friends">Friends</option>
                  <option value="Family">Family</option>
                  <option value="Partner">Partner</option>
                  <option value="Gym buddies">Gym buddies</option>
                  <option value="Accountability">Accountability</option>
                  <option value="Custom group">Custom group</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
                Create Circle
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SAFETY & BLOCKING MODAL */}
      {safetyReportTarget && (
        <div className="modal-backdrop" onClick={() => setSafetyReportTarget(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Safety Options for {safetyReportTarget.name}</h3>
              <button onClick={() => setSafetyReportTarget(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              You have complete control over who interacts with you on Better Every Day.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  blockRelationship(safetyReportTarget.id);
                  setSafetyReportTarget(null);
                }}
                className="btn btn-secondary"
                style={{ color: 'var(--accent-rose)', justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
              >
                🚫 Block {safetyReportTarget.name}
              </button>
              <button
                onClick={() => {
                  toggleFollowRelationship(safetyReportTarget.id);
                  setSafetyReportTarget(null);
                }}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
              >
                Remove from Friends / Unfollow
              </button>
              <button
                onClick={() => setSafetyReportTarget(null)}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
              >
                🚩 Report Inappropriate Behavior
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
