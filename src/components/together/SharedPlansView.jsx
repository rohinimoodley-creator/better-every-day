import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  FileText,
  Users,
  Plus,
  Check,
  Utensils,
  Footprints,
  Calendar,
  Sparkles,
  Shield,
  Edit2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SharedPlansView() {
  const { sharedPlans, createSharedPlan, updateSharedPlan, userProfile } = useWellness();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [planTitle, setPlanTitle] = useState('');
  const [planType, setPlanType] = useState('partner'); // 'partner' | 'group' | 'individual'
  const [planCategory, setPlanCategory] = useState('Movement');
  const [myTarget, setMyTarget] = useState('30-minute walk');
  const [partnerName, setPartnerName] = useState('Maya (Partner)');
  const [partnerTarget, setPartnerTarget] = useState('20-minute stroll');
  const [planSchedule, setPlanSchedule] = useState('Mon, Wed, Fri at 18:00');
  const [planNotes, setPlanNotes] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!planTitle.trim()) return;

    createSharedPlan({
      title: planTitle,
      type: planType,
      category: planCategory,
      icon: planCategory === 'Nutrition' ? '🥗' : '🚶',
      participants: [
        { userId: 'user_1', name: `${userProfile?.name || 'Rohini'} (You)`, target: myTarget, completedThisWeek: 0 },
        { userId: 'user_2', name: partnerName, target: partnerTarget, completedThisWeek: 0 }
      ],
      schedule: planSchedule,
      notes: planNotes
    });

    setPlanTitle('');
    setPlanNotes('');
    setIsCreateOpen(false);

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  return (
    <div>
      {/* Header & Create Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.2rem 0' }}>
            <FileText size={18} color="var(--accent-primary)" /> Shared Wellness & Meal Plans
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Coordinated routines with personalized targets for each participant.
          </p>
        </div>

        <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
          <Plus size={14} /> Create Shared Plan
        </button>
      </div>

      {/* Philosophy banner */}
      <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        ✨ <strong>Personalized Co-Living:</strong> Everyone can participate in shared activities with individual targets suited to their energy and schedule.
      </div>

      {/* Shared Plans Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {sharedPlans.map(plan => (
          <div key={plan.id} className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>{plan.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{plan.title}</h4>
                    <span className="pill-badge primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                      {plan.type.toUpperCase()} • {plan.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Individual Participant Targets */}
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Individual Participant Targets
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {plan.participants.map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                      <span className="pill-badge blue" style={{ fontSize: '0.72rem' }}>
                        {p.target || p.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meal dishes if recipe plan */}
              {plan.dishes && (
                <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Coordinated Recipes:</strong>
                  <ul style={{ margin: '0.2rem 0 0 1.2rem', padding: 0 }}>
                    {plan.dishes.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              )}

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ⏰ <strong>Schedule:</strong> {plan.schedule}
              </div>
            </div>

            {plan.notes && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: '0.75rem 0 0 0', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                "{plan.notes}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* CREATE PLAN MODAL */}
      {isCreateOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Create Shared Wellness Plan</h3>
              <button onClick={() => setIsCreateOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Plan Title</label>
                <input
                  type="text"
                  placeholder="e.g. Evening Walking & Mobility"
                  value={planTitle}
                  onChange={e => setPlanTitle(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Plan Type</label>
                  <select value={planType} onChange={e => setPlanType(e.target.value)} className="input-field">
                    <option value="partner">Partner Plan (2 People)</option>
                    <option value="group">Group Plan (3+ People)</option>
                    <option value="individual">Individual Plan</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Category</label>
                  <select value={planCategory} onChange={e => setPlanCategory(e.target.value)} className="input-field">
                    <option value="Movement">Movement & Walking</option>
                    <option value="Nutrition">Meal Prep & Nourishment</option>
                    <option value="Mind & Rest">Mindfulness & Sleep</option>
                  </select>
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Your Individual Target</label>
                <input
                  type="text"
                  placeholder="e.g. 30-minute walk"
                  value={myTarget}
                  onChange={e => setMyTarget(e.target.value)}
                  className="input-field"
                  required
                />

                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginTop: '0.5rem', marginBottom: '0.2rem' }}>Partner / Participant Target</label>
                <input
                  type="text"
                  placeholder="e.g. 20-minute stroll"
                  value={partnerTarget}
                  onChange={e => setPartnerTarget(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Schedule & Days</label>
                <input
                  type="text"
                  placeholder="e.g. Mon, Wed, Fri at 18:00"
                  value={planSchedule}
                  onChange={e => setPlanSchedule(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
                Save Shared Plan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
