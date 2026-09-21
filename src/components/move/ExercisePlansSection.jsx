import React, { useState } from 'react';
import { 
  Play, 
  Plus, 
  Heart, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Sparkles, 
  Trash2, 
  Camera, 
  ChevronRight, 
  Calendar,
  Settings2,
  CheckCircle2,
  Check
} from 'lucide-react';
import { WORKOUTS_DATABASE } from '../../data/mockData';
import { useWellness } from '../../context/WellnessContext';
import SegmentedControl from '../common/SegmentedControl';
import confetti from 'canvas-confetti';

const PLAN_SEGMENTS = [
  { id: 'create', label: 'Create Your Own' },
  { id: 'browse', label: 'Browse' },
  { id: 'favourites', label: 'Favourites' }
];

const CATEGORY_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'mobility', label: 'Mobility' },
  { id: 'strength', label: 'Strength' },
  { id: 'low_impact', label: 'Low Impact' },
  { id: 'posture', label: 'Posture' }
];

export default function ExercisePlansSection({
  onStartBeginnerPlan,
  onStartWorkout,
  onOpenCustomModal,
  onOpenPhotoModal
}) {
  const {
    savedPlanIds = [],
    favouritePlanIds = [],
    customExercises = [],
    savePlanToHub,
    removePlanFromHub,
    toggleFavouritePlan,
    deleteCustomExercise
  } = useWellness();

  const [activeTab, setActiveTab] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleToggleSave = (planId, e) => {
    e.stopPropagation();
    if (savedPlanIds.includes(planId)) {
      removePlanFromHub(planId);
      showToast('Removed from saved plans');
    } else {
      savePlanToHub(planId);
      showToast('✓ Saved to My Hub');
      try { confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } }); } catch(e) {}
    }
  };

  const handleToggleFav = (planId, e) => {
    e.stopPropagation();
    toggleFavouritePlan(planId);
    if (!favouritePlanIds.includes(planId)) {
      showToast('❤️ Added to favourites');
      try { confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } }); } catch(e) {}
    } else {
      showToast('Removed from favourites');
    }
  };

  const filteredPlans = WORKOUTS_DATABASE.filter(plan => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'beginner') return plan.intensity === 'Gentle' || plan.durationMin <= 10;
    if (selectedCategory === 'mobility') return plan.category === 'Mobility & Stretching';
    if (selectedCategory === 'strength') return plan.category === 'Strength Training' || plan.category === 'Pilates';
    if (selectedCategory === 'low_impact') return plan.category === 'Mobility & Stretching' || plan.category === 'Walking' || plan.category === 'Yoga';
    if (selectedCategory === 'posture') return plan.category.toLowerCase().includes('stretch') || plan.category.toLowerCase().includes('yoga') || plan.title.toLowerCase().includes('posture');
    return true;
  });

  const favouritePlansList = WORKOUTS_DATABASE.filter(plan => favouritePlanIds.includes(plan.id));

  // Active weekly schedule mock data
  const weekDays = [
    { day: 'M', completed: true, today: false },
    { day: 'T', completed: true, today: false },
    { day: 'W', completed: false, today: true },
    { day: 'T', completed: false, today: false },
    { day: 'F', completed: false, today: false },
    { day: 'S', completed: false, today: false },
    { day: 'S', completed: false, today: false }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ background: 'var(--accent-primary-light)', border: '1px solid var(--accent-primary)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', animation: 'fadeIn 0.2s ease-out' }}>
          {toastMessage}
        </div>
      )}

      {/* 3-Segment Control */}
      <SegmentedControl
        options={PLAN_SEGMENTS}
        value={activeTab}
        onChange={setActiveTab}
      />

      {/* ========================================================================= */}
      {/* 1. CREATE YOUR OWN SUB-VIEW                                               */}
      {/* ========================================================================= */}
      {activeTab === 'create' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          
          {/* Active Plan Card (~140dp) */}
          <div 
            className="card-glass" 
            style={{ 
              padding: '1rem 1.15rem', 
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--accent-primary)',
              background: 'linear-gradient(135deg, var(--accent-primary-light) 0%, var(--bg-glass-card) 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="pill-badge primary" style={{ fontSize: '0.66rem', fontWeight: 800 }}>
                  ACTIVE PLAN · WEEK 2 OF 4
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0.2rem 0 0.1rem 0', color: 'var(--text-primary)' }}>
                  Gentle Mobility & Core
                </h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Day 3: 15-Minute Morning Reset
                </p>
              </div>

              <button
                type="button"
                onClick={() => onStartWorkout(WORKOUTS_DATABASE[0])}
                className="btn btn-primary btn-sm"
                style={{ minHeight: 44, padding: '0.45rem 1rem', fontSize: '0.84rem', fontWeight: 800, gap: '0.35rem' }}
                aria-label="Start today's planned session"
              >
                <Play size={15} />
                <span>Start</span>
              </button>
            </div>

            {/* Weekly Schedule Strip (7 day dots) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>This Week:</span>
              <div style={{ display: 'flex', gap: '0.45rem' }}>
                {weekDays.map((d, i) => (
                  <div 
                    key={i} 
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: d.completed ? 'var(--accent-primary)' : d.today ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                      border: d.today ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      color: d.completed ? '#fff' : d.today ? 'var(--accent-primary)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.68rem',
                      fontWeight: 800
                    }}
                  >
                    {d.completed ? '✓' : d.day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Exercises Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Custom Exercises ({customExercises.length})
              </span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={onOpenPhotoModal}
                  className="btn btn-secondary btn-sm"
                  style={{ minHeight: 36, fontSize: '0.74rem', padding: '0.3rem 0.6rem', gap: '0.25rem' }}
                >
                  <Camera size={12} color="var(--accent-primary)" /> Photo
                </button>
                <button
                  type="button"
                  onClick={onOpenCustomModal}
                  className="btn btn-secondary btn-sm"
                  style={{ minHeight: 36, fontSize: '0.74rem', padding: '0.3rem 0.6rem', gap: '0.25rem' }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>

            {customExercises.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {customExercises.map(ex => (
                  <div
                    key={ex.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{ex.name}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.45rem' }}>
                        {ex.durationSec ? `${ex.durationSec}s` : ''} {ex.reps ? `• ${ex.reps} reps` : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteCustomExercise(ex.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem' }}
                      title="Delete exercise"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                No custom exercises yet. Tap Photo or Add to create your own!
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BROWSE SUB-VIEW                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'browse' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          
          {/* Quick Start Beginner Plan Hero (Inside Browse) */}
          <div 
            className="card-glass card-interactive"
            onClick={onStartBeginnerPlan}
            style={{
              padding: '0.85rem 1rem',
              border: '1.5px solid var(--accent-primary)',
              background: 'linear-gradient(135deg, var(--accent-primary-light) 0%, var(--bg-glass-card) 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div 
                style={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 'var(--radius-md)', 
                  background: 'var(--accent-primary)', 
                  color: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1.1rem' 
                }}
              >
                🌱
              </div>
              <div>
                <span className="pill-badge primary" style={{ fontSize: '0.62rem', marginBottom: '0.1rem' }}>
                  QUICK START
                </span>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0.05rem 0', color: 'var(--text-primary)' }}>
                  Beginner Plan · Start Gentle
                </h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Bite-sized starting movements for new or returning movers.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ minHeight: 38, fontSize: '0.76rem', padding: '0.35rem 0.75rem', gap: '0.25rem' }}
              aria-label="Open beginner plan"
            >
              <span>Start</span>
              <ChevronRight size={13} />
            </button>
          </div>
          
          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '0.15rem' }}>
            {CATEGORY_CHIPS.map(c => {
              const active = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  style={{
                    minHeight: 36,
                    padding: '0.25rem 0.7rem',
                    borderRadius: 'var(--radius-pill)',
                    border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    background: active ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: active ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.74rem',
                    fontWeight: active ? 800 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Compact Plan Cards (~120-140dp) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
            {filteredPlans.map(plan => {
              const isSaved = savedPlanIds.includes(plan.id);
              const isFav = favouritePlanIds.includes(plan.id);

              return (
                <div
                  key={plan.id}
                  className="card-glass card-interactive"
                  onClick={() => onStartWorkout(plan)}
                  style={{
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                      <span className="pill-badge primary" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                        {plan.category}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <button
                          type="button"
                          onClick={(e) => handleToggleSave(plan.id, e)}
                          style={{
                            background: isSaved ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                            border: 'none',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: isSaved ? 'var(--accent-primary)' : 'var(--text-muted)'
                          }}
                          title={isSaved ? 'Saved' : 'Save to Hub'}
                        >
                          {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleToggleFav(plan.id, e)}
                          style={{
                            background: isFav ? 'rgba(235, 87, 87, 0.15)' : 'var(--bg-tertiary)',
                            border: 'none',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: isFav ? '#e63946' : 'var(--text-muted)'
                          }}
                          title={isFav ? 'Favourited' : 'Add to favourites'}
                        >
                          <Heart size={13} fill={isFav ? '#e63946' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '0.94rem', fontWeight: 800, margin: '0 0 0.15rem 0', color: 'var(--text-primary)' }}>
                      {plan.title}
                    </h4>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {plan.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.35rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>⏱️ {plan.durationMin}m • {plan.intensity || 'Gentle'}</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Start →</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FAVOURITES SUB-VIEW                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'favourites' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {favouritePlansList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
              {favouritePlansList.map(plan => (
                <div
                  key={plan.id}
                  className="card-glass card-interactive"
                  onClick={() => onStartWorkout(plan)}
                  style={{
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="pill-badge primary" style={{ fontSize: '0.65rem' }}>{plan.category}</span>
                      <h4 style={{ fontSize: '0.94rem', fontWeight: 800, margin: '0.15rem 0 0 0', color: 'var(--text-primary)' }}>
                        {plan.title}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleToggleFav(plan.id, e)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#e63946' }}
                    >
                      <Heart size={14} fill="#e63946" />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.35rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>⏱️ {plan.durationMin}m • {plan.intensity || 'Gentle'}</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Start →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              No favorite plans yet. Tap the heart ❤️ icon on any exercise plan to keep it handy!
            </div>
          )}
        </div>
      )}

    </div>
  );
}

