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
  BookOpen, 
  Activity, 
  Smile, 
  ShieldCheck 
} from 'lucide-react';
import { WORKOUTS_DATABASE } from '../../data/mockData';
import { useWellness } from '../../context/WellnessContext';
import ContextualPip from '../mascot/ContextualPip';
import confetti from 'canvas-confetti';

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

  // Active Sub-Tab: 'my_exercises' | 'plans' | 'favourites'
  const [activeTab, setActiveTab] = useState('my_exercises');
  const [tagFilter, setTagFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleToggleSave = (planId, e) => {
    e.stopPropagation();
    if (savedPlanIds.includes(planId)) {
      removePlanFromHub(planId);
      showToast('Removed from My Hub');
    } else {
      savePlanToHub(planId);
      showToast('✓ Saved to My Hub for future use!');
      try { confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } }); } catch(e) {}
    }
  };

  const handleToggleFav = (planId, e) => {
    e.stopPropagation();
    toggleFavouritePlan(planId);
    if (!favouritePlanIds.includes(planId)) {
      showToast('❤️ Added to Favourite Plans!');
      try { confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } }); } catch(e) {}
    } else {
      showToast('Removed from Favourite Plans');
    }
  };

  const availableTags = ['all', 'Beginner', 'Gentle', 'Low Impact', 'Mobility', 'Full Body', 'At Home', 'Short Session'];

  const filteredCommunityPlans = WORKOUTS_DATABASE.filter(plan => {
    if (tagFilter === 'all') return true;
    if (tagFilter === 'Beginner') return plan.intensity === 'Gentle' || plan.durationMin <= 10;
    if (tagFilter === 'Gentle') return plan.intensity === 'Gentle' || plan.intensity === 'Restorative';
    if (tagFilter === 'Low Impact') return plan.category === 'Mobility & Stretching' || plan.category === 'Walking' || plan.category === 'Yoga';
    if (tagFilter === 'Mobility') return plan.category === 'Mobility & Stretching';
    if (tagFilter === 'Full Body') return plan.category === 'Strength Training' || plan.category === 'Pilates';
    if (tagFilter === 'At Home') return plan.equipment.toLowerCase().includes('bodyweight') || plan.equipment.toLowerCase().includes('none') || plan.equipment.toLowerCase().includes('mat');
    if (tagFilter === 'Short Session') return plan.durationMin <= 15;
    return true;
  });

  const favouritePlansList = WORKOUTS_DATABASE.filter(plan => favouritePlanIds.includes(plan.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ background: 'var(--accent-primary-light)', border: '1px solid var(--accent-primary)', padding: '0.55rem 0.95rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', animation: 'fadeIn 0.2s ease-out' }}>
          {toastMessage}
        </div>
      )}

      {/* Sub-Tab Navigation (NO COUNTS IN HEADINGS) */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.35rem', scrollbarWidth: 'none' }}>
        {[
          { id: 'my_exercises', label: 'My Exercise Plan' },
          { id: 'plans', label: 'Browse Exercise Plans' },
          { id: 'favourites', label: 'Favourite Exercise Plans' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: 'var(--radius-pill)',
              border: activeTab === tab.id ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: activeTab === tab.id ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
              color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-primary)',
              fontSize: '0.82rem',
              fontWeight: activeTab === tab.id ? 800 : 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. BEGINNER PLAN 🌱 SUB-VIEW                                              */}
      {/* ========================================================================= */}
      {activeTab === 'beginner' && (
        <div className="card-glass" style={{ padding: '1.4rem', border: '1.5px solid var(--accent-primary)', background: 'radial-gradient(circle at top, var(--accent-primary-light) 0%, var(--bg-secondary) 100%)', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ maxWidth: 500 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                <span className="pill-badge primary" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  🌱 ZERO PRESSURE • START EASY
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                Beginner Plan
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Designed specifically for when you don't feel like exercising or are completely new. Starts with gentle stretches and builds gradually one easy movement at a time.
              </p>
            </div>

            <ContextualPip 
              context="move" 
              size={56} 
              mood="happy"
              message="No pressure. Let's keep it easy!"
              showSpeechBubble={false}
            />
          </div>

          {/* 4-Stage Progressive Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
            {[
              { num: '1', title: 'Ease In', desc: 'Gentle neck & side stretches' },
              { num: '2', title: 'Wake Up', desc: 'Soft march & arm swings' },
              { num: '3', title: 'Get Moving', desc: 'Comfortable squats & reaches' },
              { num: '4', title: 'Optional', desc: 'Gentle progression' }
            ].map(stage => (
              <div key={stage.num} style={{ background: 'var(--bg-glass-card)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-primary)' }}>Stage {stage.num}</span>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.1rem' }}>{stage.title}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{stage.desc}</div>
              </div>
            ))}
          </div>

          {/* Start CTA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              ✨ Stop at any point with full credit. No checklists or guilt.
            </div>

            <button
              type="button"
              onClick={onStartBeginnerPlan}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.4rem', fontSize: '0.88rem', fontWeight: 800, gap: '0.4rem' }}
            >
              <Play size={15} /> Start Beginner Plan
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MY EXERCISES SUB-VIEW                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'my_exercises' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Header & Quick Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                My Exercises
              </h3>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Your personal library of custom exercises and movement routines.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onOpenPhotoModal}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', gap: '0.3rem' }}
              >
                <Camera size={13} color="var(--accent-primary)" /> Add from Picture
              </button>

              <button
                type="button"
                onClick={onOpenCustomModal}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.78rem', gap: '0.3rem' }}
              >
                <Plus size={13} /> Add Exercise Manually
              </button>
            </div>
          </div>

          {/* Custom Exercises List */}
          {customExercises.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
              {customExercises.map(ex => (
                <div
                  key={ex.id}
                  className="card-glass"
                  style={{
                    padding: '1rem 1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.65rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                      <span className="pill-badge primary" style={{ fontSize: '0.66rem' }}>
                        {ex.category || 'Custom'}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteCustomExercise(ex.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}
                        title="Delete exercise"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text-primary)' }}>
                      {ex.name}
                    </h4>
                    {ex.notes && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                        {ex.notes}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    <span>{ex.durationSec ? `${ex.durationSec}s` : ''} {ex.reps ? `• ${ex.reps} reps` : ''}</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Custom Item</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--bg-secondary)', padding: '1.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              You have not added any custom exercises yet. Tap <strong>Add Exercise Manually</strong> or <strong>Add from Picture</strong> to create your own!
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EXERCISE PLANS (COMMUNITY / SHARED LIBRARY)                            */}
      {/* ========================================================================= */}
      {activeTab === 'plans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Exercise Plans
            </h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Explore supportive movement plans shared by the Better Every Day community.
            </span>
          </div>

          {/* Supportive Tag Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setTagFilter(tag)}
                style={{
                  padding: '0.3rem 0.7rem',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: tagFilter === tag ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: tagFilter === tag ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tag === 'all' ? 'All Plans' : tag}
              </button>
            ))}
          </div>

          {/* Plans Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
            {filteredCommunityPlans.map(plan => {
              const isSaved = savedPlanIds.includes(plan.id);
              const isFav = favouritePlanIds.includes(plan.id);

              return (
                <div
                  key={plan.id}
                  className="card-glass card-interactive"
                  onClick={() => onStartWorkout(plan)}
                  style={{
                    padding: '1.15rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <span className="pill-badge primary" style={{ fontSize: '0.66rem' }}>
                        {plan.category}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {/* Save to Hub Button */}
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
                          title={isSaved ? 'Saved to My Hub' : 'Save to My Hub'}
                        >
                          {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                        </button>

                        {/* Favourite Button */}
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
                          title={isFav ? 'Favourited' : 'Add to Favourites'}
                        >
                          <Heart size={14} fill={isFav ? '#e63946' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                      {plan.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                      {plan.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.45rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={12} /> {plan.durationMin}m
                      </span>
                      <span>• {plan.intensity || 'Gentle'}</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.3rem 0.75rem', fontSize: '0.74rem', gap: '0.25rem' }}
                    >
                      <Play size={12} /> Preview
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FAVOURITE PLANS SUB-VIEW                                               */}
      {/* ========================================================================= */}
      {activeTab === 'favourites' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Favourite Plans
            </h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Plans you've marked as favourites for quick, easy access.
            </span>
          </div>

          {favouritePlansList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
              {favouritePlansList.map(plan => (
                <div
                  key={plan.id}
                  className="card-glass card-interactive"
                  onClick={() => onStartWorkout(plan)}
                  style={{
                    padding: '1.15rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <span className="pill-badge primary" style={{ fontSize: '0.66rem' }}>
                        {plan.category}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleToggleFav(plan.id, e)}
                        style={{
                          background: 'rgba(235, 87, 87, 0.15)',
                          border: 'none',
                          borderRadius: '50%',
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#e63946'
                        }}
                        title="Remove from Favourites"
                      >
                        <Heart size={14} fill="#e63946" />
                      </button>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                      {plan.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                      {plan.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.45rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      <Clock size={12} />
                      <span>{plan.durationMin}m • {plan.intensity || 'Gentle'}</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.3rem 0.75rem', fontSize: '0.74rem', gap: '0.25rem' }}
                    >
                      <Play size={12} /> Start Flow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--bg-secondary)', padding: '1.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              No plans marked as favourites yet. Click the heart ❤️ icon on any plan in <strong>Exercise Plans</strong> to pin it here!
            </div>
          )}

        </div>
      )}

    </div>
  );
}
