import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Droplet, Footprints, Utensils, Moon, Plus } from 'lucide-react';

export default function MetricPillars({ onNavigateTab }) {
  const { 
    hydrationMl, 
    incrementHydration, 
    userProfile, 
    stepCount, 
    loggedMeals,
    dailyCheckIn 
  } = useWellness();

  const hydGoal = userProfile.hydrationGoalMl || 2000;
  const hydPercent = Math.min(100, Math.round((hydrationMl / hydGoal) * 100));

  const stepGoal = userProfile.stepGoal || 8000;
  const stepPercent = Math.min(100, Math.round((stepCount / stepGoal) * 100));
  const estimatedCaloriesBurned = Math.round(stepCount * 0.042);

  const totalCaloriesLogged = loggedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalProteinLogged = loggedMeals.reduce((acc, m) => acc + (m.protein || 0), 0);

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        
        {/* 1. Hydration Card */}
        <div className="card-glass" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(58, 134, 200, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a86c8' }}>
                <Droplet size={17} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Hydrate</span>
            </div>
            <button
              onClick={() => incrementHydration(250)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', gap: '0.2rem' }}
              title="Add 1 glass (250ml)"
            >
              <Plus size={12} /> 250ml
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{hydrationMl}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ {hydGoal} ml</span>
            <span className="pill-badge primary" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
              {hydPercent}%
            </span>
          </div>

          <div className="progress-track" style={{ height: 6 }}>
            <div 
              className="progress-fill" 
              style={{ width: `${hydPercent}%`, background: 'linear-gradient(90deg, #3a86c8 0%, #48cae4 100%)' }} 
            />
          </div>
        </div>

        {/* 2. Move & Steps Card */}
        <div 
          className="card-glass card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer' }}
          onClick={() => onNavigateTab && onNavigateTab('MOVE')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                <Footprints size={17} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Move</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. ~{estimatedCaloriesBurned} kcal</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stepCount.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ {stepGoal.toLocaleString()} steps</span>
            <span className="pill-badge primary" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
              {stepPercent}%
            </span>
          </div>

          <div className="progress-track" style={{ height: 6 }}>
            <div 
              className="progress-fill" 
              style={{ width: `${stepPercent}%`, background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-calm) 100%)' }} 
            />
          </div>
        </div>

        {/* 3. Nourish Card */}
        <div 
          className="card-glass card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer' }}
          onClick={() => onNavigateTab && onNavigateTab('NOURISH')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
                <Utensils size={17} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Nourish</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{loggedMeals.length} meals logged</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalCaloriesLogged}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>kcal</span>
            <span className="pill-badge orange" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
              {totalProteinLogged}g Protein
            </span>
          </div>

          <div className="progress-track" style={{ height: 6 }}>
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(100, (totalCaloriesLogged / 2000) * 100)}%`, background: 'linear-gradient(90deg, var(--accent-secondary) 0%, #f4a261 100%)' }} 
            />
          </div>
        </div>

        {/* 4. Sleep & Rest Card */}
        <div 
          className="card-glass" 
          style={{ padding: '1.25rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(123, 97, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
                <Moon size={17} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Sleep & Rest</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last Night</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {dailyCheckIn.sleep}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 5 Quality</span>
            <span className="pill-badge purple" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
              {dailyCheckIn.sleep >= 4 ? 'Restful' : dailyCheckIn.sleep === 3 ? 'Moderate' : 'Restless'}
            </span>
          </div>

          <div className="progress-track" style={{ height: 6 }}>
            <div 
              className="progress-fill" 
              style={{ width: `${(dailyCheckIn.sleep / 5) * 100}%`, background: 'linear-gradient(90deg, var(--accent-purple) 0%, #a855f7 100%)' }} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
