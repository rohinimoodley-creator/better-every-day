import React, { useState } from 'react';
import { X, Check, Droplet, Footprints, Utensils, Moon, Sparkles, Wind, Heart, Activity, ArrowUp, ArrowDown, ShieldAlert, AlertCircle, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { useWellness } from '../../context/WellnessContext';

export const ALL_OVERVIEW_PILLARS = [
  { id: 'move', label: 'Move', desc: 'Workouts, active pacing & steps', icon: Footprints, color: '#3a86c8' },
  { id: 'nourish', label: 'Nourish', desc: 'Meals, whole foods, and vitality balance', icon: Utensils, color: '#d97736' },
  { id: 'hydrate', label: 'Hydrate', desc: 'Daily water intake & cellular flow', icon: Droplet, color: '#3a86c8' },
  { id: 'rest', label: 'Rest', desc: 'Sleep duration & night recovery', icon: Moon, color: '#7b61ff' },
  { id: 'mind', label: 'Mind', desc: 'Gratitude reflections & mindset', icon: Sparkles, color: '#8b5cf6' },
  { id: 'cycle', label: 'Cycle', desc: 'Cycle phase & energy syncing', icon: Heart, color: '#d64062' },
  { id: 'breathwork', label: 'Breathwork', desc: 'Calming nervous system regulation', icon: Wind, color: '#40916c' },
  { id: 'steps', label: 'Steps', desc: 'Daily step cadence & outdoor walks', icon: Activity, color: '#2d6a4f' }
];

export default function CustomizeOverviewModal({ isOpen, onClose, selectedPillars = [], onUpdatePillars }) {
  const { wellnessHubVisibility = {}, updateWellnessHubVisibility } = useWellness();
  const [pendingRemovalPillar, setPendingRemovalPillar] = useState(null);

  if (!isOpen) return null;

  const isHubActiveInWellness = (pillarId) => {
    if (pillarId === 'steps') {
      return wellnessHubVisibility.move !== false;
    }
    return wellnessHubVisibility[pillarId] !== false;
  };

  const handleInitiateRemove = (id, e) => {
    if (e) e.stopPropagation();
    if (selectedPillars.length <= 1) {
      // Keep at least 1 pillar
      return;
    }
    setPendingRemovalPillar(id);
  };

  const handleAddPillar = (id) => {
    // Only allow adding if active in Wellness Hub
    if (!isHubActiveInWellness(id)) return;
    if (!selectedPillars.includes(id)) {
      onUpdatePillars([...selectedPillars, id]);
    }
  };

  // Option 1: Keep in Overview & Wellness Hub
  const handleKeepBoth = () => {
    setPendingRemovalPillar(null);
  };

  // Option 2: Remove from Overview, Keep in Wellness Hub
  const handleRemoveFromOverviewOnly = () => {
    if (!pendingRemovalPillar) return;
    onUpdatePillars(selectedPillars.filter(p => p !== pendingRemovalPillar));
    setPendingRemovalPillar(null);
  };

  // Option 3: Remove from Overview & Wellness Hub
  const handleRemoveFromBoth = () => {
    if (!pendingRemovalPillar) return;
    const pillarToRemove = pendingRemovalPillar;
    onUpdatePillars(selectedPillars.filter(p => p !== pillarToRemove));
    if (updateWellnessHubVisibility) {
      const hubKey = pillarToRemove === 'steps' ? 'move' : pillarToRemove;
      updateWellnessHubVisibility(hubKey, false);
    }
    setPendingRemovalPillar(null);
  };

  // Option 4: Cancel
  const handleCancelRemoval = () => {
    setPendingRemovalPillar(null);
  };

  const movePillar = (index, direction, e) => {
    e.stopPropagation();
    const newPillars = [...selectedPillars];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newPillars.length) return;
    const temp = newPillars[index];
    newPillars[index] = newPillars[targetIndex];
    newPillars[targetIndex] = temp;
    onUpdatePillars(newPillars);
  };

  // Active Hubs (filtered so invalid states never show)
  const activePillarsFull = selectedPillars
    .filter(id => isHubActiveInWellness(id))
    .map(id => ALL_OVERVIEW_PILLARS.find(p => p.id === id))
    .filter(Boolean);

  // Available Hubs to Add: MUST only display wellness hubs that are currently active in Wellness Hub and not displayed
  const availablePillars = ALL_OVERVIEW_PILLARS.filter(p => {
    const isAlreadySelected = selectedPillars.includes(p.id);
    const isActiveInHub = isHubActiveInWellness(p.id);
    return !isAlreadySelected && isActiveInHub;
  });

  const disabledHubsCount = ALL_OVERVIEW_PILLARS.filter(p => !isHubActiveInWellness(p.id)).length;
  const removalTargetInfo = pendingRemovalPillar ? ALL_OVERVIEW_PILLARS.find(p => p.id === pendingRemovalPillar) : null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', padding: '1.6rem', position: 'relative' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Customize Wellness Overview 📊
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Select which active wellness hubs appear on your Home screen and arrange their order.
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* 1. Active Selected Hubs with Reorder */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.45rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Active on Home ({activePillarsFull.length})</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Use arrows to reorder</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {activePillarsFull.map((pil, idx) => {
              const Icon = pil.icon;
              return (
                <div
                  key={pil.id}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--accent-primary)',
                    background: 'var(--accent-primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={pil.color} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                        {pil.label}
                      </strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {pil.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => movePillar(idx, -1, e)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        cursor: idx === 0 ? 'not-allowed' : 'pointer',
                        opacity: idx === 0 ? 0.3 : 1,
                        color: 'var(--text-primary)'
                      }}
                      title="Move up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === activePillarsFull.length - 1}
                      onClick={(e) => movePillar(idx, 1, e)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        cursor: idx === activePillarsFull.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: idx === activePillarsFull.length - 1 ? 0.3 : 1,
                        color: 'var(--text-primary)'
                      }}
                      title="Move down"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleInitiateRemove(pil.id, e)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-pill)',
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: 'var(--text-secondary)'
                      }}
                      title="Remove from Home overview"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Available Hubs to Add (Only active in Wellness Hub) */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.45rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Available Hubs to Add</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {availablePillars.length} available
            </span>
          </div>

          {availablePillars.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {availablePillars.map(pil => {
                const Icon = pil.icon;
                return (
                  <div
                    key={pil.id}
                    onClick={() => handleAddPillar(pil.id)}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={16} color={pil.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {pil.label}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {pil.desc}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                      onClick={(e) => { e.stopPropagation(); handleAddPillar(pil.id); }}
                    >
                      + Add
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px dashed var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              All currently active wellness hubs are already shown on your Home screen.
            </div>
          )}

          {disabledHubsCount > 0 && (
            <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', fontSize: '0.73rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={15} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
              <span>
                Looking for another hub? Re-enable disabled hubs anytime in <strong>You → Content Preferences & Exclusions</strong> to make them available here.
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Changes apply instantly to your Home screen.
          </span>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.5rem 1.4rem', fontSize: '0.84rem' }}>
            Done
          </button>
        </div>

        {/* 3. Dedicated 4-Option Removal Confirmation Modal */}
        {pendingRemovalPillar && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 1300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
            onClick={handleCancelRemoval}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: 460,
                width: '100%',
                background: 'var(--bg-primary)',
                border: '2px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.6rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                animation: 'modalFadeIn 0.2s ease-out'
              }}
            >
              <h4 style={{ fontSize: '1.18rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: 'var(--text-primary)' }}>
                Where would you like to keep this hub?
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 1.25rem 0' }}>
                You can choose whether this hub stays in your Wellness Hub or is hidden from both places. You can change this anytime from Content Preferences & Exclusions.
              </p>

              {removalTargetInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '1.1rem' }}>
                  {React.createElement(removalTargetInfo.icon, { size: 18, color: removalTargetInfo.color })}
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {removalTargetInfo.label} Hub
                  </strong>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {/* Option 1 */}
                <button
                  type="button"
                  onClick={handleKeepBoth}
                  style={{
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-subtle)',
                    background: 'var(--bg-secondary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                    Keep in Overview & Wellness Hub
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    No changes are made. Keep this hub visible everywhere.
                  </div>
                </button>

                {/* Option 2 */}
                <button
                  type="button"
                  onClick={handleRemoveFromOverviewOnly}
                  style={{
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--accent-primary)',
                    background: 'var(--accent-primary-light)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                    Remove from Overview, Keep in Wellness Hub
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Remove from Home Overview, but keep fully active and accessible in Wellness. All data preserved.
                  </div>
                </button>

                {/* Option 3 */}
                <button
                  type="button"
                  onClick={handleRemoveFromBoth}
                  style={{
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid rgba(214, 64, 98, 0.3)',
                    background: 'rgba(214, 64, 98, 0.08)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-rose)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(214, 64, 98, 0.3)'}
                >
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--accent-rose)', marginBottom: '0.15rem' }}>
                    Remove from Overview & Wellness Hub
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Hide from both Home and Wellness Hub. Underlying feature & historical data are preserved and never deleted.
                  </div>
                </button>

                {/* Option 4 */}
                <button
                  type="button"
                  onClick={handleCancelRemoval}
                  style={{
                    marginTop: '0.35rem',
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

