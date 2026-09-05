import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAudio } from '../../context/AudioContext';
import { Pill, Plus, Check, Trash2, Edit2, Calendar, Sparkles, X, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import ContextualPip from '../mascot/ContextualPip';

export default function SupplementTracker() {
  const {
    supplements = [],
    supplementLogs = [],
    addSupplement,
    deleteSupplement,
    logSupplementDose,
    getSupplementStats
  } = useWellness();

  const { playChime } = useAudio();

  const [period, setPeriod] = useState('week'); // 'today' | 'week' | 'month'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // New Supplement form state
  const [name, setName] = useState('');
  const [amountPerDose, setAmountPerDose] = useState('');
  const [unit, setUnit] = useState('mg');
  const [pillsPerDose, setPillsPerDose] = useState('1');
  const [formType, setFormType] = useState('Capsule');
  const [timing, setTiming] = useState('Morning with food');

  const stats = getSupplementStats ? getSupplementStats(period) : { totalDoses: 0, suppMap: {} };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleLogDose = (supp) => {
    if (logSupplementDose) {
      logSupplementDose(supp.id);
      try { playChime(528); } catch(e) {}
      try {
        confetti({ particleCount: 22, spread: 40, origin: { y: 0.65 } });
      } catch(e) {}
      showToast(`✓ Logged ${supp.name} (${supp.amountPerDose} ${supp.unit}) for today 🌱`);
    }
  };

  const handleCreateSupplement = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (addSupplement) {
      addSupplement({
        name: name.trim(),
        amountPerDose: Number(amountPerDose) || 1,
        unit,
        pillsPerDose: Number(pillsPerDose) || 1,
        form: formType,
        timing
      });
      showToast(`Added ${name.trim()} to your supplements!`);
    }

    setName('');
    setAmountPerDose('');
    setPillsPerDose('1');
    setIsAddModalOpen(false);
  };

  const [showConsistency, setShowConsistency] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ background: 'var(--accent-primary-light)', border: '1px solid var(--accent-primary)', padding: '0.55rem 0.95rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', animation: 'fadeIn 0.2s ease-out' }}>
          {toastMessage}
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="card-glass" style={{ padding: '1.35rem', background: 'radial-gradient(circle at top left, rgba(64, 145, 108, 0.08) 0%, var(--bg-glass-card) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem', marginBottom: '0.3rem' }}>
              <Pill size={12} /> Optional Routine
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Vitamins & Supplements 💊
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
              One-tap daily tracking for vitamins, minerals, and supplements you take.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {supplements.length > 0 && (
              <button
                type="button"
                onClick={() => setShowConsistency(prev => !prev)}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.35rem', fontSize: '0.78rem', padding: '0.45rem 0.75rem' }}
              >
                <Calendar size={13} /> {showConsistency ? 'Hide Consistency' : 'View Routine Consistency'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.35rem', fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
            >
              <Plus size={14} /> Add Supplement
            </button>
          </div>
        </div>

        {/* List of User's Configured Supplements */}
        {supplements.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', marginTop: '0.75rem' }}>
            {supplements.map(supp => {
              const suppStat = stats.suppMap?.[supp.id] || {};
              const isDoneToday = suppStat.isLoggedToday;

              return (
                <div
                  key={supp.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: `1.5px solid ${isDoneToday ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                      <span className="pill-badge" style={{ fontSize: '0.68rem', background: 'var(--bg-tertiary)' }}>
                        {supp.form || 'Capsule'} • {supp.timing || 'Daily'}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteSupplement(supp.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}
                        title="Remove supplement"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text-primary)' }}>
                      {supp.name}
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <strong>{supp.amountPerDose} {supp.unit}</strong> ({supp.pillsPerDose} {supp.pillsPerDose === 1 ? 'pill' : 'pills'} per dose)
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.74rem', color: isDoneToday ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                      {isDoneToday ? '✓ Taken today' : 'Not logged today'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleLogDose(supp)}
                      className={`btn btn-sm ${isDoneToday ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', gap: '0.3rem', fontWeight: 700 }}
                    >
                      <Check size={13} /> {isDoneToday ? 'Log Again' : 'Taken Today ✓'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.75rem' }}>
            No vitamins or supplements added yet. Tap <strong>Add Supplement</strong> above if you take daily vitamins or minerals.
          </div>
        )}
      </div>

      {/* Supplement Intake History (Daily, Weekly, Monthly — Revealed on Click) */}
      {showConsistency && supplements.length > 0 && (
        <div className="card-glass" style={{ padding: '1.35rem', animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Supplement Routine Consistency
              </h4>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Gentle view of your consistency over time.
              </span>
            </div>

            {/* Period Selector Tabs: Daily | Weekly | Monthly */}
            <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
              {[
                { id: 'today', label: 'Daily' },
                { id: 'week', label: 'Weekly' },
                { id: 'month', label: 'Monthly' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPeriod(tab.id)}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: period === tab.id ? 'var(--accent-primary)' : 'transparent',
                    color: period === tab.id ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Consistency Overview Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {supplements.map(supp => {
              const suppStat = stats.suppMap?.[supp.id] || {};
              return (
                <div
                  key={supp.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.84rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                      💊
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{supp.name}</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {suppStat.consistencyText || 'Gentle habit in progress'}
                      </div>
                    </div>
                  </div>

                  <span className="pill-badge primary" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                    {suppStat.dosesCount || 0} {suppStat.dosesCount === 1 ? 'dose' : 'doses'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD SUPPLEMENT MODAL */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 480, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Add a Vitamin or Supplement 💊
                </h3>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Set up your dosage once for simple one-tap daily logging.
                </span>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSupplement} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                  Vitamin / Supplement Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Vitamin D3, Omega-3, Magnesium, Iron, Multivitamin"
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Amount per dose
                  </label>
                  <input
                    type="number"
                    required
                    value={amountPerDose}
                    onChange={e => setAmountPerDose(e.target.value)}
                    placeholder="1000"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Unit
                  </label>
                  <select value={unit} onChange={e => setUnit(e.target.value)} className="select-field">
                    <option value="mg">mg</option>
                    <option value="IU">IU</option>
                    <option value="mcg">mcg</option>
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="drops">drops</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Pills / Capsules
                  </label>
                  <input
                    type="number"
                    value={pillsPerDose}
                    onChange={e => setPillsPerDose(e.target.value)}
                    min="1"
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Form
                  </label>
                  <select value={formType} onChange={e => setFormType(e.target.value)} className="select-field">
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Softgel">Softgel</option>
                    <option value="Gummy">Gummy</option>
                    <option value="Liquid">Liquid / Drops</option>
                    <option value="Powder">Powder</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Preferred Timing
                  </label>
                  <select value={timing} onChange={e => setTiming(e.target.value)} className="select-field">
                    <option value="Morning with food">Morning with food</option>
                    <option value="With lunch">With lunch</option>
                    <option value="Evening before bed">Evening before bed</option>
                    <option value="With dinner">With dinner</option>
                    <option value="Empty stomach">Empty stomach</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.65rem' }}>
                  Save Supplement
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
