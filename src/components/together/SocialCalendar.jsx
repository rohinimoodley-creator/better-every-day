import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  RefreshCw,
  MessageSquare,
  X,
  Check,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SocialCalendar() {
  const {
    socialEvents,
    updateEventStatus,
    createSocialEvent,
    relationships,
    socialSettings,
    userProfile
  } = useWellness();

  const [activeSubTab, setActiveSubTab] = useState('confirmed'); // 'confirmed' | 'invitations'
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [rescheduleModalEvent, setRescheduleModalEvent] = useState(null);
  const [counterTime, setCounterTime] = useState('19:00');
  const [counterDate, setCounterDate] = useState('2026-08-23');
  const [counterNote, setCounterNote] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-08-23');
  const [time, setTime] = useState('18:00');
  const [location, setLocation] = useState('Emerald River Park Trail');
  const [withUser, setWithUser] = useState('Maya (Partner)');
  const [category, setCategory] = useState('Walk & Talk');
  const [notes, setNotes] = useState('');

  const friendsList = relationships.filter(r => r.relationshipType === 'friend' || r.isMutual);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    createSocialEvent({
      title,
      date,
      time,
      location,
      withUser,
      category,
      notes
    });

    setTitle('');
    setNotes('');
    setIsCreateOpen(false);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  const handleAccept = (eventId) => {
    updateEventStatus(eventId, 'accepted');
    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  const handleDecline = (eventId) => {
    updateEventStatus(eventId, 'declined');
  };

  const handleSendReschedule = (e) => {
    e.preventDefault();
    if (!rescheduleModalEvent) return;

    updateEventStatus(
      rescheduleModalEvent.id, 
      'reschedule_requested', 
      `Proposed new time: ${counterDate} at ${counterTime}. Note: ${counterNote || 'Looking forward to it!'}`
    );
    setRescheduleModalEvent(null);
    setCounterNote('');
  };

  const confirmedEvents = socialEvents.filter(e => e.status === 'accepted');
  const pendingInvitations = socialEvents.filter(e => e.status === 'pending' || e.status === 'reschedule_requested');

  return (
    <div>
      {/* Top Header & Scheduling Action */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.2rem 0' }}>
            <Calendar size={18} color="var(--accent-primary)" /> Social & Activity Calendar
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Plan shared walks, healthy dinners, and group workouts with friends.
          </p>
        </div>

        <button 
          onClick={() => setIsCreateOpen(true)}
          className="btn btn-primary btn-sm"
          style={{ gap: '0.35rem' }}
        >
          <Plus size={14} /> Schedule Activity
        </button>
      </div>

      {/* Friends-Only Privacy Policy Badge */}
      <div style={{ background: 'var(--bg-tertiary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={14} color="var(--accent-primary)" />
          <span><strong>Invitation Policy:</strong> Friends Only (Mutual Follows Only).</span>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Separate from personal period calendar</span>
      </div>

      {/* Sub Tabs: Confirmed vs Pending Invitations */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveSubTab('confirmed')}
          style={{
            padding: '0.35rem 0.8rem',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: activeSubTab === 'confirmed' ? 'var(--accent-primary-light)' : 'transparent',
            color: activeSubTab === 'confirmed' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer'
          }}
        >
          📅 Confirmed Activities
        </button>
        <button
          onClick={() => setActiveSubTab('invitations')}
          style={{
            padding: '0.35rem 0.8rem',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: activeSubTab === 'invitations' ? 'var(--accent-primary-light)' : 'transparent',
            color: activeSubTab === 'invitations' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer'
          }}
        >
          📥 Activity Invitations
        </button>
      </div>

      {/* CONFIRMED ACTIVITIES LIST */}
      {activeSubTab === 'confirmed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {confirmedEvents.length > 0 ? (
            confirmedEvents.map(evt => (
              <div
                key={evt.id}
                className="card-glass"
                style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-primary)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span className="pill-badge primary" style={{ fontSize: '0.68rem', marginBottom: '0.2rem' }}>
                      {evt.category}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{evt.title}</h4>
                  </div>
                  <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
                    <Check size={12} /> Confirmed
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} color="var(--accent-primary)" />
                    <span>{evt.date} at {evt.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="var(--accent-primary)" />
                    <span>{evt.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <UserCheck size={14} color="var(--accent-primary)" />
                    <span>With: {evt.withUser}</span>
                  </div>
                </div>

                {evt.notes && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.35rem 0 0 0', fontStyle: 'italic' }}>
                    "{evt.notes}"
                  </p>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No upcoming confirmed activities. Schedule a walk with a friend! 🌿
            </div>
          )}
        </div>
      )}

      {/* ACTIVITY INVITATIONS INBOX */}
      {activeSubTab === 'invitations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {pendingInvitations.length > 0 ? (
            pendingInvitations.map(evt => (
              <div
                key={evt.id}
                className="card-glass"
                style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-secondary)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div>
                    <span className="pill-badge orange" style={{ fontSize: '0.68rem', marginBottom: '0.2rem' }}>
                      {evt.status === 'reschedule_requested' ? '🔄 Reschedule Proposed' : '📩 Invitation from Friend'}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{evt.title}</h4>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Invited by: {evt.proposedBy}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0.75rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} />
                    <span>{evt.date} at {evt.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} />
                    <span>{evt.location}</span>
                  </div>
                </div>

                {evt.rescheduleNote && (
                  <div style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--accent-secondary)', marginBottom: '0.75rem' }}>
                    💬 {evt.rescheduleNote}
                  </div>
                )}

                {/* Accept / Decline / Reschedule Action Bar */}
                <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <button onClick={() => handleAccept(evt.id)} className="btn btn-primary btn-sm">
                    <Check size={13} /> Accept
                  </button>
                  <button onClick={() => handleDecline(evt.id)} className="btn btn-secondary btn-sm">
                    Decline
                  </button>
                  <button onClick={() => setRescheduleModalEvent(evt)} className="btn btn-secondary btn-sm" style={{ gap: '0.25rem' }}>
                    <RefreshCw size={12} /> Reschedule
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Your invitations inbox is clear! ✨
            </div>
          )}
        </div>
      )}

      {/* SCHEDULE EVENT MODAL */}
      {isCreateOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Schedule Wellness Activity</h3>
              <button onClick={() => setIsCreateOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Activity Title</label>
                <input
                  type="text"
                  placeholder="e.g. Sunset Park Walk"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Invite Friend (Mutual Follows Only)</label>
                <select
                  value={withUser}
                  onChange={e => setWithUser(e.target.value)}
                  className="input-field"
                >
                  {friendsList.map(f => (
                    <option key={f.id} value={`${f.name} (${(f.labels || [])[0] || 'Friend'})`}>
                      {f.name} ({(f.labels || [])[0] || 'Friend'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Meeting Location</label>
                <input
                  type="text"
                  placeholder="e.g. Emerald River Trailhead"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Notes / Encouragement</label>
                <input
                  type="text"
                  placeholder="e.g. Grab a matcha first and walk the loop!"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
                Send Activity Invitation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RESCHEDULE NEGOTIATION MODAL */}
      {rescheduleModalEvent && (
        <div className="modal-backdrop" onClick={() => setRescheduleModalEvent(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Suggest Another Time 🔄</h3>
              <button onClick={() => setRescheduleModalEvent(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Propose a revised date or time for <strong>{rescheduleModalEvent.title}</strong> with {rescheduleModalEvent.proposedBy}.
            </p>

            <form onSubmit={handleSendReschedule} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>New Date</label>
                  <input
                    type="date"
                    value={counterDate}
                    onChange={e => setCounterDate(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>New Time</label>
                  <input
                    type="time"
                    value={counterTime}
                    onChange={e => setCounterTime(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Note for {rescheduleModalEvent.proposedBy}</label>
                <input
                  type="text"
                  placeholder="e.g. Can we do 19:30 after dinner wraps up? 🧘"
                  value={counterNote}
                  onChange={e => setCounterNote(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
                Send Reschedule Proposal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
