import React, { useState } from 'react';
import MealLogger from './MealLogger';
import RecipeBrowser from './RecipeBrowser';
import BodyTranslator from './BodyTranslator';
import NutritionGaps from './NutritionGaps';
import SupplementTracker from './SupplementTracker';
import CommunityRecipeQueue from './CommunityRecipeQueue';
import { Utensils, Sparkles, BookOpen, ChevronDown, ChevronUp, Compass, Pill } from 'lucide-react';

export default function NourishHub() {
  const [activeSubTab, setActiveSubTab] = useState('logger'); // 'logger' | 'translator' | 'insights' | 'supplements'
  const [isRecipesExpanded, setIsRecipesExpanded] = useState(false); // Collapsed by default
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);

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

