import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  Dumbbell,
  Users,
  MessageSquare,
  Lightbulb,
  Calendar,
  ShieldCheck,
  Plus,
  Heart,
  Eye,
  EyeOff,
  Search,
  MapPin,
  Check,
  AlertTriangle,
  X,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GymCommunityHub() {
  const {
    verifiedGyms,
    selectedGymId,
    setSelectedGym,
    gymCommunities,
    joinGymCommunity,
    leaveGymCommunity,
    updateGymCommunityPrompt,
    addGymDiscussion,
    addGymTip,
    toggleGymActivity,
    socialSettings,
    updateSocialSettings,
    userProfile
  } = useWellness();

  const [activeGymTab, setActiveGymTab] = useState('discussions'); // 'discussions' | 'tips' | 'activities' | 'members'
  const [isDiscussionModalOpen, setIsDiscussionModalOpen] = useState(false);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState('');
  const [discussionContent, setDiscussionContent] = useState('');
  const [tipText, setTipText] = useState('');
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  const selectedGym = verifiedGyms.find(g => g.id === selectedGymId) || verifiedGyms[0];
  const community = gymCommunities[selectedGymId] || {
    gymId: selectedGymId,
    name: `${selectedGym.name} Community`,
    joined: false,
    promptState: 'pending',
    discussions: [],
    tips: [],
    activities: [],
    members: []
  };

  const handlePostDiscussion = (e) => {
    e.preventDefault();
    if (!discussionTitle.trim()) return;

    addGymDiscussion(selectedGymId, {
      title: discussionTitle,
      content: discussionContent
    });

    setDiscussionTitle('');
    setDiscussionContent('');
    setIsDiscussionModalOpen(false);

    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  const handlePostTip = (e) => {
    e.preventDefault();
    if (!tipText.trim()) return;

    addGymTip(selectedGymId, tipText);
    setTipText('');
    setIsTipModalOpen(false);
  };

  return (
    <div>
      {/* Gym Selector Bar */}
      <div className="card-glass" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              🏋️ Selected Gym & Space
            </span>
            <h3 style={{ fontSize: '1.3rem', margin: '0.2rem 0' }}>{selectedGym.name}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
              {selectedGym.address} • {selectedGym.city}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select
              value={selectedGymId}
              onChange={e => setSelectedGym(e.target.value)}
              className="input-field"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', width: 'auto' }}
            >
              {verifiedGyms.map(g => (
                <option key={g.id} value={g.id}>
                  {g.icon} {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gym Community Discovery Banner if not joined */}
      {!community.joined && community.promptState !== 'dont_show' && (
        <div 
          style={{
            background: 'linear-gradient(135deg, var(--bg-glass) 0%, var(--accent-primary-light) 100%)',
            border: '1px solid var(--accent-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🏋️</span>
                <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Join {selectedGym.name} Community?</h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.45 }}>
                Connect with local members, discover beginner-friendly times, share machine tips, and join voluntary walks.
                <em> Your exact workout schedules are never disclosed.</em>
              </p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => joinGymCommunity(selectedGymId)}
                  className="btn btn-primary btn-sm"
                >
                  Join Community
                </button>
                <button
                  onClick={() => updateGymCommunityPrompt(selectedGymId, 'maybe_later')}
                  className="btn btn-secondary btn-sm"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => updateGymCommunityPrompt(selectedGymId, 'dont_show')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Don't Show Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Community Workspace (Available when joined or exploring) */}
      <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Navigation Sub-Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[
              { id: 'discussions', label: '💬 Discussions' },
              { id: 'tips', label: '💡 Tips & Tricks' },
              { id: 'activities', label: '🏃 Group Activities' },
              { id: 'members', label: '👥 Members' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveGymTab(tab.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: activeGymTab === tab.id ? 'var(--accent-primary-light)' : 'transparent',
                  color: activeGymTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {activeGymTab === 'discussions' && (
              <button onClick={() => setIsDiscussionModalOpen(true)} className="btn btn-primary btn-sm" style={{ gap: '0.3rem' }}>
                <Plus size={13} /> Ask / Share
              </button>
            )}
            {activeGymTab === 'tips' && (
              <button onClick={() => setIsTipModalOpen(true)} className="btn btn-primary btn-sm" style={{ gap: '0.3rem' }}>
                <Plus size={13} /> Add Tip
              </button>
            )}
            <button onClick={() => setIsGuidelinesOpen(true)} className="btn btn-secondary btn-sm" style={{ fontSize: '0.72rem' }}>
              <ShieldCheck size={12} /> Guidelines
            </button>
          </div>
        </div>

        {/* TAB 1: DISCUSSIONS */}
        {activeGymTab === 'discussions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(community.discussions || []).map(d => (
              <div key={d.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{d.avatar}</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{d.title}</strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{d.time}</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', lineHeight: 1.45 }}>
                  {d.content}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
                  <span>By {d.author}</span>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <span>💬 {d.repliesCount} replies</span>
                    <span>❤️ {d.likes} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: TIPS & TRICKS */}
        {activeGymTab === 'tips' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(community.tips || []).map(t => (
              <div key={t.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Lightbulb size={16} color="var(--accent-secondary)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                      "{t.text}"
                    </p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>— Shared by {t.author}</span>
                  </div>
                </div>
                <span className="pill-badge primary" style={{ fontSize: '0.72rem', flexShrink: 0 }}>
                  ❤️ {t.likes} helpful
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: GROUP ACTIVITIES */}
        {activeGymTab === 'activities' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(community.activities || []).map(act => (
              <div key={act.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.98rem', margin: '0 0 0.2rem 0' }}>{act.title}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    ⏰ {act.time} • 📍 {act.meetingPoint}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', marginTop: '0.2rem', display: 'block' }}>
                    {act.participants} members attending
                  </span>
                </div>
                <button
                  onClick={() => toggleGymActivity(selectedGymId, act.id)}
                  className={`btn btn-sm ${act.joined ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {act.joined ? 'Attending ✓' : 'Join Activity'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: MEMBER DIRECTORY (OPT-IN ONLY) */}
        {activeGymTab === 'members' && (
          <div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              🔒 <strong>Privacy Shield:</strong> Only members who have enabled <em>"Show me in gym community"</em> appear here. Private wellness logs are never exposed.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {(community.members || []).map(m => (
                <div key={m.id} style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{m.avatar}</span>
                    <div>
                      <h5 style={{ fontSize: '0.9rem', margin: 0 }}>{m.name}</h5>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Community Member</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                    {m.interests.map((int, i) => (
                      <span key={i} className="pill-badge primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CREATE DISCUSSION MODAL */}
      {isDiscussionModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsDiscussionModalOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Ask / Post in Gym Community</h3>
              <button onClick={() => setIsDiscussionModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePostDiscussion} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Question / Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Best beginner classes or quietest times?"
                  value={discussionTitle}
                  onChange={e => setDiscussionTitle(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Details</label>
                <textarea
                  rows={4}
                  placeholder="Share your thoughts or question respectfully..."
                  value={discussionContent}
                  onChange={e => setDiscussionContent(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Posting as: <strong>{socialSettings.displayNameType === 'anonymous' ? 'Anonymous Member' : userProfile.name}</strong>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
                Post to Community
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TIP MODAL */}
      {isTipModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsTipModalOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Share a Gym Tip 💡</h3>
              <button onClick={() => setIsTipModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePostTip} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Your Tip</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Shaded parking is available behind the west wing!"
                  value={tipText}
                  onChange={e => setTipText(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
                Share Tip
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COMMUNITY GUIDELINES MODAL */}
      {isGuidelinesOpen && (
        <div className="modal-backdrop" onClick={() => setIsGuidelinesOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Community Safety & Respect 🛡️</h3>
              <button onClick={() => setIsGuidelinesOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
              <li><strong>Zero Body Shaming:</strong> Encouragement only. We never judge bodies or workout styles.</li>
              <li><strong>No Extreme Diet or Medical Claims:</strong> Supplements and extreme fasting advice are prohibited.</li>
              <li><strong>Presence Privacy:</strong> Real-time gym attendance is never tracked or exposed.</li>
              <li><strong>Kindness First:</strong> Welcoming to beginners taking their first steps.</li>
            </ul>

            <button onClick={() => setIsGuidelinesOpen(false)} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
