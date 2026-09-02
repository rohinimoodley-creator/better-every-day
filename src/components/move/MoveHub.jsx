import React, { useState } from 'react';
import { WORKOUTS_DATABASE } from '../../data/mockData';
import { useWellness } from '../../context/WellnessContext';
import ActivityTracker from './ActivityTracker';
import WorkoutPlayer from './WorkoutPlayer';
import CustomWorkoutModal from './CustomWorkoutModal';
import PhotoActivityModal from './PhotoActivityModal';
import { Play, Plus, Clock, Zap, Flame, Filter, Sparkles, CheckCircle, Camera, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export default function MoveHub() {
  const { activeWorkoutMinutes, completedWorkouts, setCompletedWorkouts } = useWellness();

  const [workoutsList, setWorkoutsList] = useState(WORKOUTS_DATABASE);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false); // Collapsed by default
  const [timeFilter, setTimeFilter] = useState('all'); // 'all' | 'quick' | 'standard' | 'deep'
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', 'Mobility & Stretching', 'Walking', 'Strength Training', 'Yoga', 'Pilates'];

  const filteredWorkouts = workoutsList.filter(w => {
    if (categoryFilter !== 'all' && w.category !== categoryFilter) return false;
    if (timeFilter === 'quick' && w.durationMin > 10) return false;
    if (timeFilter === 'standard' && (w.durationMin <= 10 || w.durationMin > 20)) return false;
    if (timeFilter === 'deep' && w.durationMin <= 20) return false;
    return true;
  });

  const handleWorkoutComplete = (workoutId) => {
    if (!completedWorkouts.includes(workoutId)) {
      setCompletedWorkouts(prev => [...prev, workoutId]);
    }
  };

  const handleSaveCustom = (newWorkout) => {
    setWorkoutsList(prev => [newWorkout, ...prev]);
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      
      {/* Header & Active Summary */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
              <Zap size={12} /> Movement & Pacing
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Move at Your Pace 🏃
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Listen to your body, celebrate gentle consistency, and move freely.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setIsPhotoModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem' }}
          >
            <Camera size={14} color="var(--accent-primary)" /> Add from Picture
          </button>

          <button 
            onClick={() => setIsCustomModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.35rem' }}
          >
            <Plus size={14} /> Add Manually
          </button>
        </div>
      </div>

      {/* Quick Start 1-Click Launcher */}
      <div 
        className="card-glass"
        style={{
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, var(--accent-primary-light) 100%)',
          border: '1.5px solid var(--accent-primary)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
            ⚡
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="pill-badge primary" style={{ fontSize: '0.68rem' }}>QUICK START</span>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Zero Friction • 5 Min</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', margin: '0.1rem 0', fontWeight: 800 }}>
              5-Minute Gentle Joint & Spine Awakening
            </h4>
          </div>
        </div>

        <button
          onClick={() => {
            const quickFiveMin = workoutsList[0] || WORKOUTS_DATABASE[0];
            setSelectedWorkout(quickFiveMin);
          }}
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.4rem', fontSize: '0.88rem', fontWeight: 800 }}
        >
          <Play size={15} /> Start 5-Min Flow
        </button>
      </div>

      {/* Live Activity & Step Tracker with Timer Modes */}
      <ActivityTracker />

      {/* Collapsible Movement Library (Progressive Disclosure) */}
      <div className="card-glass" style={{ padding: '1.25rem' }}>
        <div 
          onClick={() => setIsLibraryOpen(!isLibraryOpen)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={17} color="var(--accent-primary)" />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Movement Library & Guided Sessions
              </h3>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                {isLibraryOpen ? 'Showing full collection' : 'Tap to explore all saved workouts and stretches'}
              </span>
            </div>
          </div>

          <div style={{ color: 'var(--text-muted)' }}>
            {isLibraryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>

        {/* Revealed Content */}
        {isLibraryOpen && (
          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            
            {/* Category Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: categoryFilter === cat ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: categoryFilter === cat ? '#ffffff' : 'var(--text-primary)',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {cat === 'all' ? 'All Types' : cat}
                </button>
              ))}
            </div>

            {/* Workouts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
              {filteredWorkouts.map(w => {
                const isDone = completedWorkouts?.includes(w.id);
                return (
                  <div 
                    key={w.id}
                    className="card-glass card-interactive"
                    onClick={() => setSelectedWorkout(w)}
                    style={{
                      padding: '1.1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.65rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                        <span className="pill-badge primary" style={{ fontSize: '0.68rem' }}>
                          {w.category}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          <Clock size={12} />
                          <span>{w.durationMin}m</span>
                        </div>
                      </div>

                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text-primary)' }}>
                        {w.title}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                        {w.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.35rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {w.difficulty || 'Gentle'}
                      </span>
                      <button 
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.74rem', gap: '0.25rem' }}
                      >
                        <Play size={12} /> Start
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>

      {/* Workout Player Modal */}
      {selectedWorkout && (
        <WorkoutPlayer
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
          onComplete={handleWorkoutComplete}
        />
      )}

      {/* Custom Workout Modal */}
      {isCustomModalOpen && (
        <CustomWorkoutModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onSave={handleSaveCustom}
        />
      )}

      {/* Photo Activity AI Modal */}
      {isPhotoModalOpen && (
        <PhotoActivityModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onSaveActivity={handleSaveCustom}
        />
      )}

    </div>
  );
}
