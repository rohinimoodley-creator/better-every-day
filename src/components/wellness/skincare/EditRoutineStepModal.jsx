import React, { useState } from 'react';
import { X, Check, Trash2, ArrowUp, ArrowDown, Calendar, Clock, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function EditRoutineStepModal({
  isOpen,
  onClose,
  routineKey,
  step,
  products = [],
  onSave,
  onRemove
}) {
  if (!isOpen || !step) return null;

  const product = products.find(p => p.id === step.productId);
  const [customName, setCustomName] = useState(step.customName || product?.name || 'Skincare Step');
  const [notes, setNotes] = useState(step.notes || product?.notes || '');
  const [isSpecificDays, setIsSpecificDays] = useState(Boolean(step.scheduleDays && step.scheduleDays.length > 0 && step.scheduleDays.length < 7));
  const [selectedDays, setSelectedDays] = useState(step.scheduleDays || product?.scheduleDays || DAYS_OF_WEEK);

  const handleToggleDay = (day) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      customName: customName.trim(),
      notes: notes.trim(),
      scheduleDays: isSpecificDays ? selectedDays : null
    });
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2200,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        className="card-glass" 
        style={{
          width: '100%',
          maxWidth: 520,
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-glass-card, #ffffff)',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
                {routineKey === 'morning' ? '☀️ Morning Step' : routineKey === 'evening' ? '🌙 Evening Step' : '📅 Ritual Step'}
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Edit Routine Step
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
              Linked product: {product?.name || 'Custom step'}
            </p>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
              Step Name / Action Title
            </label>
            <input
              type="text"
              required
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
              Step Notes & Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Apply 2-3 drops on damp skin, pat gently"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.84rem' }}
            />
          </div>

          {/* Schedule Frequency */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Frequency for this Step
              </label>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button
                  type="button"
                  onClick={() => setIsSpecificDays(false)}
                  style={{
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: !isSpecificDays ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: !isSpecificDays ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Every Day
                </button>
                <button
                  type="button"
                  onClick={() => setIsSpecificDays(true)}
                  style={{
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: isSpecificDays ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: isSpecificDays ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Specific Days
                </button>
              </div>
            </div>

            {isSpecificDays && (
              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Select applicable days (e.g. Mon / Wed / Fri for gentle exfoliant):
                </span>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {DAYS_OF_WEEK.map(d => {
                    const isSelected = selectedDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleToggleDay(d)}
                        style={{
                          flex: 1,
                          minWidth: 36,
                          padding: '0.35rem 0.25rem',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                          color: isSelected ? '#ffffff' : 'var(--text-primary)',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => { onRemove(step.id); onClose(); }}
              className="btn btn-secondary btn-sm"
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', gap: '0.3rem' }}
            >
              <Trash2 size={13} />
              <span>Remove from Routine</span>
            </button>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 800 }}>
                Save Step
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
