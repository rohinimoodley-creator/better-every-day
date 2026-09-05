import React, { useState, useMemo } from 'react';
import { useWellness } from '../../../context/WellnessContext';
import { getCyclePhaseInfo, getCyclePhaseForDate } from '../../../engine/cycleEngine';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  X,
  Check,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
  Users,
  Activity,
  Moon
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WellnessCalendar({ onNavigateTab }) {
  const {
    socialEvents,
    createSocialEvent,
    updateSocialEvent,
    deleteSocialEvent,
    userProfile
  } = useWellness();

  // Views: 'month' | 'week'
  const [activeViewMode, setActiveViewMode] = useState('month');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'Social' | 'Workout' | 'Other'
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Form State: strictly 3 event types
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Workout'); // 'Social' | 'Workout' | 'Other'
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState('');
  const [withUser, setWithUser] = useState('');
  const [notes, setNotes] = useState('');

  // Cycle Info if enabled
  const isCycleEnabled = userProfile?.cycleTrackingEnabled;
  const cycleInfo = isCycleEnabled && userProfile?.lastPeriodStart
    ? getCyclePhaseInfo(userProfile.lastPeriodStart, userProfile.cycleLength || 28, userProfile.periodLength || 5)
    : null;

  const selectedDatePhase = isCycleEnabled && userProfile?.lastPeriodStart
    ? getCyclePhaseForDate(selectedDate, userProfile.lastPeriodStart, userProfile.cycleLength || 28, userProfile.periodLength || 5)
    : null;

  const handleOpenCreate = (prefillDate = null) => {
    setEditingEvent(null);
    setTitle('');
    setCategory('Workout');
    setDate(prefillDate || new Date().toISOString().split('T')[0]);
    setTime('09:00');
    setLocation('');
    setWithUser('');
    setNotes('');
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setTitle(evt.title || '');
    // Normalize to one of the 3 supported categories
    const cat = (evt.category === 'Social' || evt.eventType === 'social') ? 'Social'
      : (evt.category === 'Workout' || evt.category === 'Wellness' || evt.eventType === 'wellness') ? 'Workout'
      : 'Other';
    setCategory(cat);
    setDate(evt.date || new Date().toISOString().split('T')[0]);
    setTime(evt.time || '10:00');
    setLocation(evt.location || '');
    setWithUser(evt.withUser || '');
    setNotes(evt.notes || '');
    setIsCreateOpen(true);
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const eventPayload = {
      title,
      category,
      eventType: category.toLowerCase(),
      date,
      time,
      location: location || 'Personal / Local',
      withUser: withUser || 'Solo',
      notes,
      status: 'accepted'
    };

    if (editingEvent) {
      if (updateSocialEvent) {
        updateSocialEvent(editingEvent.id, eventPayload);
      }
    } else {
      createSocialEvent(eventPayload);
    }

    setIsCreateOpen(false);
    setEditingEvent(null);

    try {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.6 } });
    } catch(err) {}
  };

  const handleDelete = (eventId) => {
    if (deleteSocialEvent) {
      deleteSocialEvent(eventId);
    }
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    let list = socialEvents || [];
    if (activeFilter !== 'all') {
      list = list.filter(e => {
        const cat = (e.category === 'Social' || e.eventType === 'social') ? 'Social'
          : (e.category === 'Workout' || e.category === 'Wellness' || e.eventType === 'wellness') ? 'Workout'
          : 'Other';
        return cat === activeFilter;
      });
    }
    return [...list].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [socialEvents, activeFilter]);

  // Calendar Month Days Calculation
  const currentMonthDate = new Date(selectedDate);
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun

  const monthName = currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    setSelectedDate(prev.toISOString().split('T')[0]);
  };

  const handleNextMonth = () => {
    const next = new Date(year, month + 1, 1);
    setSelectedDate(next.toISOString().split('T')[0]);
  };

  const getCategoryBadge = (cat) => {
    const norm = (cat === 'Social' || cat === 'social') ? 'Social'
      : (cat === 'Workout' || cat === 'wellness' || cat === 'Wellness') ? 'Workout'
      : 'Other';
    if (norm === 'Social') return { label: '🫶 Social', color: '#e05660', bg: 'var(--accent-secondary-light)' };
    if (norm === 'Workout') return { label: '🏃 Workout', color: 'var(--accent-primary)', bg: 'var(--accent-primary-light)' };
    return { label: '✨ Other', color: '#7b61ff', bg: 'var(--bg-tertiary)' };
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      
      {/* 1. Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
              <CalendarIcon size={12} /> Life & Wellness Calendar
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Schedule & Rhythm 📅
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            A calm view of your workouts, social dates, and personal commitments.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* View Switcher: Month vs Week */}
          <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
            <button
              onClick={() => setActiveViewMode('month')}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: activeViewMode === 'month' ? 'var(--bg-secondary)' : 'transparent',
                color: activeViewMode === 'month' ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Month
            </button>
            <button
              onClick={() => setActiveViewMode('week')}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: activeViewMode === 'week' ? 'var(--bg-secondary)' : 'transparent',
                color: activeViewMode === 'week' ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Week
            </button>
          </div>

          <button
            onClick={() => handleOpenCreate(selectedDate)}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.3rem' }}
          >
            <Plus size={14} /> Add Event
          </button>
        </div>
      </div>

      {/* 2. Contextual Cycle Overlay Notification (if enabled) */}
      {isCycleEnabled && cycleInfo && (
        <div 
          className="card-glass"
          style={{
            padding: '0.75rem 1.1rem',
            background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, rgba(214, 64, 98, 0.08) 100%)',
            borderLeft: '4px solid var(--accent-rose)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>{cycleInfo.icon}</span>
            <div>
              <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                {cycleInfo.phase} Phase (Cycle Day {cycleInfo.day})
              </strong>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                {cycleInfo.headline} — {cycleInfo.recommendationTip}
              </div>
            </div>
          </div>
          <span className="pill-badge rose" style={{ fontSize: '0.68rem', flexShrink: 0 }}>
            Cycle Synced
          </span>
        </div>
      )}

      {/* 3. Category Filter Tabs: Social / Workout / Other */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Events' },
            { id: 'Social', label: '🫶 Social' },
            { id: 'Workout', label: '🏃 Workouts' },
            { id: 'Other', label: '✨ Other' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: activeFilter === f.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: activeFilter === f.id ? '#ffffff' : 'var(--text-primary)',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button onClick={handlePrevMonth} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
            <ChevronLeft size={15} />
          </button>
          <span style={{ fontSize: '0.86rem', fontWeight: 800, minWidth: 120, textAlign: 'center' }}>
            {monthName}
          </span>
          <button onClick={handleNextMonth} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* 4. Calendar Grid (Month View) */}
      {activeViewMode === 'month' && (
        <div className="card-glass" style={{ padding: '1.25rem' }}>
          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ padding: '0.25rem 0' }}>{d}</div>
            ))}
          </div>

          {/* Day Cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem' }}>
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} style={{ minHeight: 68, opacity: 0.3 }} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              const dayEvents = socialEvents?.filter(e => e.date === dateStr) || [];
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              // Dynamic Cycle Phase for this specific date
              const dayPhase = isCycleEnabled && userProfile?.lastPeriodStart
                ? getCyclePhaseForDate(dateStr, userProfile.lastPeriodStart, userProfile.cycleLength || 28, userProfile.periodLength || 5)
                : null;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    minHeight: 68,
                    padding: '0.35rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                    border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : isToday ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: isToday ? 800 : 600, color: isToday ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                    )}
                  </div>

                  {/* Cycle Phase Badge (Subtle Context) */}
                  {dayPhase && (
                    <div 
                      style={{
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        padding: '1px 3px',
                        borderRadius: '3px',
                        background: dayPhase.bg,
                        color: dayPhase.color,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '2px'
                      }}
                      title={dayPhase.label}
                    >
                      <span style={{ fontSize: '0.62rem' }}>{dayPhase.icon}</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{dayPhase.shortLabel}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', marginTop: '2px' }}>
                    {dayEvents.slice(0, 2).map(ev => {
                      const badge = getCategoryBadge(ev.category);
                      return (
                        <div
                          key={ev.id}
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            padding: '1px 3px',
                            borderRadius: '3px',
                            background: badge.bg,
                            color: badge.color,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Schedule List for Selected Date */}
      <div className="card-glass" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Events for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </h3>
            
            {/* Contextual Cycle Phase on Selected Date */}
            {selectedDatePhase && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem' }}>{selectedDatePhase.icon}</span>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: selectedDatePhase.color }}>
                  {selectedDatePhase.label} (Cycle Day {selectedDatePhase.cycleDay})
                </span>
                {selectedDatePhase.isPrediction && (
                  <span style={{ fontSize: '0.68rem', background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 'var(--radius-pill)', color: 'var(--text-muted)' }}>
                    Recalculates with your logs
                  </span>
                )}
              </div>
            )}

            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.15rem' }}>
              {filteredEvents.filter(e => e.date === selectedDate).length} event(s) scheduled
            </span>
          </div>

          <button onClick={() => handleOpenCreate(selectedDate)} className="btn btn-primary btn-sm" style={{ gap: '0.25rem' }}>
            <Plus size={13} /> Add to Day
          </button>
        </div>

        {filteredEvents.filter(e => e.date === selectedDate).length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filteredEvents.filter(e => e.date === selectedDate).map(evt => {
              const badge = getCategoryBadge(evt.category);
              return (
                <div
                  key={evt.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1.1rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="pill-badge" style={{ background: badge.bg, color: badge.color, fontSize: '0.7rem', fontWeight: 700 }}>
                      {badge.label}
                    </span>
                    <div>
                      <h4 style={{ fontSize: '0.94rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text-primary)' }}>
                        {evt.title}
                      </h4>
                      <div style={{ display: 'flex', gap: '0.65rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        <span>🕒 {evt.time}</span>
                        {evt.location && <span>📍 {evt.location}</span>}
                        {evt.withUser && evt.withUser !== 'Solo' && <span>👥 {evt.withUser}</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button onClick={() => handleOpenEdit(evt)} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.55rem' }} title="Edit">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => handleDelete(evt.id)} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.55rem', color: 'var(--accent-rose)' }} title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
            No events scheduled for this day. Tap "Add to Day" to plan an activity.
          </div>
        )}
      </div>

      {/* 6. CREATE / EDIT EVENT MODAL */}
      {isCreateOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                {editingEvent ? 'Edit Event' : 'Add Calendar Event'}
              </h3>
              <button onClick={() => setIsCreateOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                  Event Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dinner with Sarah, Morning Run, Dentist..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              {/* 3 Simplified Category Options */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                  Event Type (Choose One) *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                  {[
                    { id: 'Social', label: '🫶 Social', desc: 'Friends, dinner, date' },
                    { id: 'Workout', label: '🏃 Workout', desc: 'Gym, run, yoga' },
                    { id: 'Other', label: '✨ Other', desc: 'Appt, reminder, work' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      style={{
                        padding: '0.6rem 0.4rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${category === c.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                        background: category === c.id ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--text-primary)' }}>{c.label}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                  Location / Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Park, City Gym, Café..."
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsCreateOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Update Event' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
