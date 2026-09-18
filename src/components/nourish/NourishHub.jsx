import React, { useState } from 'react';
import MealLogger from './MealLogger';
import RecipeBrowser from './RecipeBrowser';
import BodyTranslator from './BodyTranslator';
import NutritionGaps from './NutritionGaps';
import SupplementTracker from './SupplementTracker';
import CommunityRecipeQueue from './CommunityRecipeQueue';
import { useWellness } from '../../context/WellnessContext';
import { getCyclePhaseInfo } from '../../engine/cycleEngine';
import { Utensils, Sparkles, BookOpen, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export default function NourishHub() {
  const { userProfile, isCycleSyncActive, mealLogs = [] } = useWellness();
  const [activeSubTab, setActiveSubTab] = useState('logger'); // 'logger' | 'translator' | 'insights' | 'supplements'
  const [isRecipesExpanded, setIsRecipesExpanded] = useState(false); // Collapsed by default
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isCyclePreviewOpen, setIsCyclePreviewOpen] = useState(false);

  const cycleInfo = isCycleSyncActive && userProfile?.lastPeriodStart
    ? getCyclePhaseInfo(userProfile.lastPeriodStart, userProfile.cycleLength || 28)
    : null;

  const todayMealsCount = mealLogs ? mealLogs.length : 0;

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="pill-badge orange" style={{ fontSize: '0.72rem' }}>
              <Utensils size={12} /> Nutrition & Fuel
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Nourish & Decode 🥗
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Nourish with joy, log meals simply, explore cravings, and track your daily vitality.
          </p>
        </div>

        {/* 4 Sub-Tabs */}
        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-pill)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveSubTab('logger')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeSubTab === 'logger' ? 'var(--bg-secondary)' : 'transparent',
              color: activeSubTab === 'logger' ? 'var(--accent-secondary)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeSubTab === 'logger' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            🍽️ Log Meals & Fuel
          </button>

          <button
            onClick={() => setActiveSubTab('translator')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeSubTab === 'translator' ? 'var(--bg-secondary)' : 'transparent',
              color: activeSubTab === 'translator' ? 'var(--accent-secondary)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeSubTab === 'translator' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            🧭 Body Translator
          </button>

          <button
            onClick={() => setActiveSubTab('insights')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeSubTab === 'insights' ? 'var(--bg-secondary)' : 'transparent',
              color: activeSubTab === 'insights' ? 'var(--accent-secondary)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeSubTab === 'insights' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            ✨ Nutritional Insight
          </button>

          <button
            onClick={() => setActiveSubTab('supplements')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeSubTab === 'supplements' ? 'var(--bg-secondary)' : 'transparent',
              color: activeSubTab === 'supplements' ? 'var(--accent-secondary)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeSubTab === 'supplements' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            💊 Vitamins & Supplements
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌸 OPTIONAL PREVIEW SUGGESTION LAYER (Only when Cycle Sync is ON)         */}
      {/* ========================================================================= */}
      {isCycleSyncActive && cycleInfo && (
        <div 
          className="card-glass" 
          style={{
            padding: '1.1rem 1.35rem',
            background: 'linear-gradient(135deg, rgba(214, 64, 98, 0.06) 0%, rgba(217, 119, 54, 0.06) 100%)',
            border: '1.5px solid rgba(214, 64, 98, 0.28)',
            borderRadius: 'var(--radius-lg)',
            transition: 'all 0.2s ease'
          }}
        >
          <div 
            onClick={() => setIsCyclePreviewOpen(!isCyclePreviewOpen)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div 
                style={{ 
                  width: 38, 
                  height: 38, 
                  borderRadius: '50%', 
                  background: 'rgba(214, 64, 98, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}
              >
                {cycleInfo.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.1rem' }}>
                  <span className="pill-badge rose" style={{ fontSize: '0.66rem', padding: '1px 6px', fontWeight: 800 }}>
                    🌸 Preview Suggestion Layer
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {cycleInfo.phase} Phase • Day {cycleInfo.day} of {cycleInfo.totalDays}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Preview Cycle-Aware Suggestions
                </h4>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                {isCyclePreviewOpen ? 'Hide Preview' : 'View Preview'}
              </span>
              {isCyclePreviewOpen ? <ChevronUp size={16} color="var(--accent-rose)" /> : <ChevronDown size={16} color="var(--accent-rose)" />}
            </div>
          </div>

          {isCyclePreviewOpen && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(214, 64, 98, 0.18)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', animation: 'fadeIn 0.2s ease-out' }}>
              
              {/* Current Plan vs Cycle-Aware Preview Side-by-Side */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Current Nutrition Plan
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                    Your usual meal logging remains unchanged.
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block', lineHeight: 1.35 }}>
                    {todayMealsCount > 0 ? `You have logged ${todayMealsCount} meal${todayMealsCount > 1 ? 's' : ''} today. Calorie and macronutrient goals are never modified.` : 'Log meals freely without restrictions or mandatory targets.'}
                  </span>
                </div>

                <div style={{ background: 'rgba(214, 64, 98, 0.08)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(214, 64, 98, 0.3)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-rose)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles size={12} /> 🌸 Cycle-Aware Suggestion
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                    Informed by your {cycleInfo.phase} phase:
                  </p>
                  <p style={{ fontSize: '0.79rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', lineHeight: 1.45 }}>
                    {cycleInfo.nutritionGuidance}
                  </p>
                </div>
              </div>

              {/* Informational & Non-Medical Note */}
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.45rem', lineHeight: 1.4 }}>
                <ShieldCheck size={15} color="var(--accent-secondary)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Informational preview only.</strong> This does not diagnose nutrient deficiencies or prescribe supplements. You decide what meals and foods feel right for you.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Sub-Tab View Rendering */}
      {activeSubTab === 'logger' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          {/* Always Visible: Meal Logger, Top 3 Meals, Macro Summary & Online Recipe Tools */}
          <MealLogger />

          {/* Progressive Disclosure: Collapsible Recipe Collection */}
          <div className="card-glass" style={{ padding: '1.25rem' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={17} color="var(--accent-secondary)" />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Explore Nourishing Recipes & Community Favorites
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {isRecipesExpanded ? 'Showing full recipe catalog' : 'Tap to reveal quick recipes and community inspirations'}
                  </span>
                </div>
              </div>

              <div style={{ color: 'var(--text-muted)' }}>
                {isRecipesExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {/* Revealed Recipes Catalog */}
            {isRecipesExpanded && (
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <RecipeBrowser onOpenSubmitCommunity={() => setIsCommunityModalOpen(true)} />
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'translator' && <BodyTranslator />}
      {activeSubTab === 'insights' && <NutritionGaps />}
      {activeSubTab === 'supplements' && <SupplementTracker />}

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

