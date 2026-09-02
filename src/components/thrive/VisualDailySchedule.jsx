import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Clock, CheckCircle2, Circle, PlayCircle } from 'lucide-react';

export default function VisualDailySchedule() {
  const { visualSchedule, updateScheduleItemStatus, howIThrive } = useWellness();

  if (!howIThrive.visualScheduleEnabled) return null;

  return (
    <div className="card-glass" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={16} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Visual Daily Flow</h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Time → Activity → Status
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {visualSchedule.map((item, idx) => {
          const isDone = item.status === 'completed';
          const isCurrent = item.status === 'current';

          return (
            <div
              key={item.id}
              onClick={() => {
                const nextStatus = isDone ? 'upcoming' : isCurrent ? 'completed' : 'current';
                updateScheduleItemStatus(item.id, nextStatus);
              }}
              style={{
                background: isCurrent 
                  ? 'var(--accent-primary-light)' 
                  : isDone 
                  ? 'var(--bg-tertiary)' 
                  : 'var(--bg-secondary)',
                border: isCurrent 
                  ? '2px solid var(--accent-primary)' 
                  : '1px solid var(--border-glass)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-primary)', minWidth: 46 }}>
                  {item.time}
                </span>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: isDone ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Explicit Icon + Text Status (Never rely on color alone) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700 }}>
                {isDone && (
                  <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <CheckCircle2 size={15} /> [Completed]
                  </span>
                )}
                {isCurrent && (
                  <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <PlayCircle size={15} /> [Current Focus]
                  </span>
                )}
                {!isDone && !isCurrent && (
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Circle size={14} /> [Upcoming]
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
