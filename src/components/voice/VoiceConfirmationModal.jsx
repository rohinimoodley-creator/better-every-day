import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAudio } from '../../context/AudioContext';
import { Check, X, Edit2, AlertCircle, Sparkles, CheckCircle2, Mic } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VoiceConfirmationModal({ isOpen, onClose, parsedResult, onConfirmed }) {
  const { applyParsedVoiceUpdates } = useWellness();
  const { playChime } = useAudio();

  const [items, setItems] = useState(parsedResult?.items || []);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editText, setEditText] = useState('');

  if (!isOpen || !parsedResult) return null;

  const toggleItem = (id) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, selected: !it.selected } : it));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const startEdit = (item) => {
    setEditingItemId(item.id);
    setEditText(item.label);
  };

  const saveEdit = (id) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, label: editText } : it));
    setEditingItemId(null);
  };

  const handleConfirmSelected = () => {
    const selectedItems = items.filter(it => it.selected);
    if (selectedItems.length > 0) {
      applyParsedVoiceUpdates(selectedItems);
      playChime(660);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch(e) {}
    }
    if (onConfirmed) onConfirmed();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
              <Mic size={12} /> Intelligent Extraction
            </span>
            <h3 style={{ fontSize: '1.35rem' }}>Here is what I heard 🎙️</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Spoken Quote Box */}
        <div 
          style={{
            background: 'var(--bg-tertiary)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            borderLeft: '4px solid var(--accent-primary)',
            fontSize: '0.88rem',
            fontStyle: 'italic',
            color: 'var(--text-secondary)'
          }}
        >
          "{parsedResult.rawTranscript}"
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Review the extracted items below. Only selected items will be added to your wellness hubs:
        </p>

        {/* Extracted Items Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem', maxHeight: '42vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {items.map(item => {
            const isEditing = editingItemId === item.id;
            return (
              <div 
                key={item.id}
                style={{
                  background: item.selected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                  border: `1px solid ${item.selected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleItem(item.id)}
                      style={{ cursor: 'pointer', width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                    <div>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <input 
                            type="text" 
                            value={editText} 
                            onChange={e => setEditText(e.target.value)} 
                            className="input-field" 
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.82rem' }}
                          />
                          <button onClick={() => saveEdit(item.id)} className="btn btn-primary btn-sm">Save</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {item.label}
                        </span>
                      )}
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                        {item.category} • {item.details}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    {!isEditing && (
                      <button 
                        onClick={() => startEdit(item)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        title="Edit text"
                      >
                        <Edit2 size={13} />
                      </button>
                    )}
                    <button 
                      onClick={() => removeItem(item.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-rose)' }}
                      title="Remove"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Duplicate Warning Prompt */}
                {item.isDuplicate && (
                  <div 
                    style={{
                      background: 'rgba(244, 140, 66, 0.15)',
                      border: '1px solid rgba(244, 140, 66, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.75rem',
                      color: 'var(--accent-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <AlertCircle size={13} />
                    <span>{item.duplicateWarning}</span>
                  </div>
                )}
              </div>
            );
          })}

          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No items selected. Speak or write again.
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', position: 'sticky', bottom: 0, background: 'var(--bg-secondary)', paddingTop: '0.5rem' }}>
          <button 
            onClick={handleConfirmSelected}
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.85rem' }}
            disabled={items.filter(it => it.selected).length === 0}
          >
            <Check size={16} /> Confirm & Apply Selected ({items.filter(it => it.selected).length})
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
