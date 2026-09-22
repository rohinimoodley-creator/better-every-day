import React, { useState, useEffect } from 'react';
import MealLogger from './MealLogger';
import RecipeBrowser from './RecipeBrowser';
import BodyTranslator from './BodyTranslator';
import NutritionGaps from './NutritionGaps';
import SupplementTracker from './SupplementTracker';
import CommunityRecipeQueue from './CommunityRecipeQueue';
import HydrateHub from '../hydrate/HydrateHub';
import { useWellness } from '../../context/WellnessContext';
import { getCyclePhaseInfo } from '../../engine/cycleEngine';
import { 
  Utensils, 
  Sparkles, 
  Compass, 
  Pill, 
  Droplet, 
  X, 
  BookOpen, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export default function NourishHub({ initialSubModal = null }) {
  const { userProfile, isCycleSyncActive, mealLogs = [], hydrationMl = 0, linkEngineOutput } = useWellness();

  // Launcher Pop-up States (5 buttons)
  const [isLogMealsOpen, setIsLogMealsOpen] = useState(false);
  const [isCravingsOpen, setIsCravingsOpen] = useState(false);
  const [isSupplementsOpen, setIsSupplementsOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isHydrateOpen, setIsHydrateOpen] = useState(false);

  // Sub-modal states
  const [isRecipesExpanded, setIsRecipesExpanded] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isCyclePreviewOpen, setIsCyclePreviewOpen] = useState(false);

  useEffect(() => {
    if (initialSubModal === 'hydrate') {
      setIsHydrateOpen(true);
    } else if (initialSubModal === 'meals' || initialSubModal === 'logger') {
      setIsLogMealsOpen(true);
    } else if (initialSubModal === 'cravings' || initialSubModal === 'translator') {
      setIsCravingsOpen(true);
    } else if (initialSubModal === 'supplements') {
      setIsSupplementsOpen(true);
    } else if (initialSubModal === 'insights') {
      setIsInsightsOpen(true);
    }
  }, [initialSubModal]);

  const cycleInfo = isCycleSyncActive && userProfile?.lastPeriodStart
    ? getCyclePhaseInfo(userProfile.lastPeriodStart, userProfile.cycleLength || 28)
    : null;

  const todayMealsCount = mealLogs ? mealLogs.length : 0;
  const targetHydration = linkEngineOutput?.adjustments?.adjustedHydrationGoal || userProfile?.hydrationGoalMl || 2250;
  const hydrationPct = Math.min(100, Math.round((hydrationMl / targetHydration) * 100));

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3.5rem' }}>
      
      {/* 1. Clean Compact Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
          <span className="pill-badge orange" style={{ fontSize: '0.7rem' }}>
            <Utensils size={11} /> Nutrition & Hydration
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
          Nourish & Hydrate 🥗💧
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
          Choose an option below to log fuel, translate cravings, track supplements, or hydrate.
        </p>
      </div>

      {/* 2. Sleek Launcher Grid (5 buttons) */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '0.75rem' 
        }}
      >
        {/* 1. Log Meals */}
        <button
          type="button"
          onClick={() => setIsLogMealsOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, rgba(217, 119, 54, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(217, 119, 54, 0.22)',
            borderRadius: 'var(--radius-card)',
            padding: '1.1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            minHeight: '120px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '50%', 
              background: 'var(--accent-secondary)', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(217, 119, 54, 0.25)'
            }}
          >
            <Utensils size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Log Meals
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {todayMealsCount} logged today • Recipes
            </span>
          </div>
        </button>

        {/* 2. Explore Cravings (renamed from Body Translator) */}
        <button
          type="button"
          onClick={() => setIsCravingsOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, rgba(224, 159, 62, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(224, 159, 62, 0.22)',
            borderRadius: 'var(--radius-card)',
            padding: '1.1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            minHeight: '120px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '50%', 
              background: '#e09f3e', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(224, 159, 62, 0.25)'
            }}
          >
            <Compass size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Explore Cravings
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Decode body signals
            </span>
          </div>
        </button>

        {/* 3. Vitamins & Supplements */}
        <button
          type="button"
          onClick={() => setIsSupplementsOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, rgba(64, 145, 108, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(64, 145, 108, 0.22)',
            borderRadius: 'var(--radius-card)',
            padding: '1.1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            minHeight: '120px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '50%', 
              background: 'var(--accent-calm)', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(64, 145, 108, 0.25)'
            }}
          >
            <Pill size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Vitamins & Supplements
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Daily stacks & timing
            </span>
          </div>
        </button>

        {/* 4. Nutritional Insight */}
        <button
          type="button"
          onClick={() => setIsInsightsOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(123, 97, 255, 0.22)',
            borderRadius: 'var(--radius-card)',
            padding: '1.1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            minHeight: '120px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '50%', 
              background: 'var(--accent-purple)', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(123, 97, 255, 0.25)'
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Nutritional Insight
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Micronutrient balance
            </span>
          </div>
        </button>

        {/* 5. Hydrate (Full hydration feature moved here, spanning 2 columns) */}
        <button
          type="button"
          onClick={() => setIsHydrateOpen(true)}
          className="card-glass card-interactive"
          style={{
            gridColumn: 'span 2',
            background: 'linear-gradient(135deg, rgba(58, 134, 200, 0.15) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(58, 134, 200, 0.28)',
            borderRadius: 'var(--radius-card)',
            padding: '1.1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'left',
            gap: '1rem',
            cursor: 'pointer',
            minHeight: '80px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div 
              style={{ 
                width: 44, 
                height: 44, 
                borderRadius: '50%', 
                background: '#3a86c8', 
                color: '#ffffff',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(58, 134, 200, 0.25)',
                flexShrink: 0
              }}
            >
              <Droplet size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Hydrate 💧
              </h4>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {hydrationMl} / {targetHydration} ml logged ({hydrationPct}%)
              </span>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(58, 134, 200, 0.12)', 
            padding: '0.35rem 0.75rem', 
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#3a86c8'
          }}>
            Quick Log →
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5 POP-UP MODAL SHEETS                                                     */}
      {/* ========================================================================= */}

      {/* 1. Log Meals Modal */}
      {isLogMealsOpen && (
        <div className="modal-backdrop" onClick={() => setIsLogMealsOpen(false)} style={{ zIndex: 1100 }}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: 580, 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Utensils size={18} color="var(--accent-secondary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Log Meals & Fuel
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsLogMealsOpen(false)}
                style={{ 
                  background: 'var(--bg-tertiary)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 32, 
                  height: 32, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  color: 'var(--text-muted)' 
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <MealLogger />

            {/* Collapsible Recipes Inside Modal */}
            <div className="card-glass" style={{ padding: '1rem' }}>
              <div 
                onClick={() => setIsRecipesExpanded(!isRecipesExpanded)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={16} color="var(--accent-secondary)" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Browse Recipe Inspiration
                  </span>
                </div>
                {isRecipesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {isRecipesExpanded && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <RecipeBrowser onOpenSubmitCommunity={() => setIsCommunityModalOpen(true)} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Explore Cravings Modal */}
      {isCravingsOpen && (
        <div className="modal-backdrop" onClick={() => setIsCravingsOpen(false)} style={{ zIndex: 1100 }}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: 580, 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Compass size={18} color="#e09f3e" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Explore Cravings & Decode Signals
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsCravingsOpen(false)}
                style={{ 
                  background: 'var(--bg-tertiary)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 32, 
                  height: 32, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  color: 'var(--text-muted)' 
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <BodyTranslator />
          </div>
        </div>
      )}

      {/* 3. Vitamins & Supplements Modal */}
      {isSupplementsOpen && (
        <div className="modal-backdrop" onClick={() => setIsSupplementsOpen(false)} style={{ zIndex: 1100 }}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: 580, 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Pill size={18} color="var(--accent-calm)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Vitamins & Daily Supplements
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsSupplementsOpen(false)}
                style={{ 
                  background: 'var(--bg-tertiary)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 32, 
                  height: 32, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  color: 'var(--text-muted)' 
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <SupplementTracker />
          </div>
        </div>
      )}

      {/* 4. Nutritional Insight Modal */}
      {isInsightsOpen && (
        <div className="modal-backdrop" onClick={() => setIsInsightsOpen(false)} style={{ zIndex: 1100 }}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: 580, 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={18} color="var(--accent-purple)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Nutritional Insight & Micro Balance
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsInsightsOpen(false)}
                style={{ 
                  background: 'var(--bg-tertiary)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 32, 
                  height: 32, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  color: 'var(--text-muted)' 
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cycle Preview if active */}
            {isCycleSyncActive && cycleInfo && (
              <div 
                className="card-glass" 
                style={{
                  padding: '0.9rem',
                  background: 'linear-gradient(135deg, rgba(214, 64, 98, 0.08) 0%, rgba(217, 119, 54, 0.08) 100%)',
                  border: '1.5px solid rgba(214, 64, 98, 0.28)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <span className="pill-badge rose" style={{ fontSize: '0.65rem' }}>
                    🌸 Cycle-Aware Suggestion
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {cycleInfo.phase} Phase (Day {cycleInfo.day})
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                  {cycleInfo.nutritionGuidance}
                </p>
              </div>
            )}

            <NutritionGaps />
          </div>
        </div>
      )}

      {/* 5. Hydrate Modal */}
      {isHydrateOpen && (
        <div className="modal-backdrop" onClick={() => setIsHydrateOpen(false)} style={{ zIndex: 1100 }}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: 580, 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Droplet size={18} color="#3a86c8" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Hydration Tracker
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsHydrateOpen(false)}
                style={{ 
                  background: 'var(--bg-tertiary)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 32, 
                  height: 32, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  color: 'var(--text-muted)' 
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <HydrateHub />
          </div>
        </div>
      )}

      {/* Community Recipe Queue Modal */}
      {isCommunityModalOpen && (
        <CommunityRecipeQueue
          isOpen={isCommunityModalOpen}
          onClose={() => setIsCommunityModalOpen(false)}
        />
      )}

    </div>
  );
}
