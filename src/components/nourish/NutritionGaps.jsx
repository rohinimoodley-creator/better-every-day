import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Sparkles, Info, ShieldCheck, Leaf, Pill, Apple } from 'lucide-react';

export default function NutritionGaps() {
  const { loggedMeals = [], supplements = [], supplementLogs = [] } = useWellness();

  const [activeSourceFilter, setActiveSourceFilter] = useState('all'); // 'all' | 'food' | 'supplements'

  // Combine food descriptions & ingredients
  const mealText = loggedMeals.map(m => `${m.title || ''} ${(m.ingredients || []).join(' ')}`).join(' ').toLowerCase();

  const totalProtein = loggedMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const totalFiber = loggedMeals.reduce((acc, m) => acc + (m.fiber || 0), 0);
  
  // Nutrient detection from food
  const hasGreens = mealText.includes('spinach') || mealText.includes('kale') || mealText.includes('greens') || mealText.includes('broccoli') || mealText.includes('salad');
  const hasCitrusOrBerry = mealText.includes('berry') || mealText.includes('orange') || mealText.includes('lemon') || mealText.includes('bell pepper') || mealText.includes('kiwi');
  const hasFishOrSeeds = mealText.includes('salmon') || mealText.includes('tuna') || mealText.includes('fish') || mealText.includes('chia') || mealText.includes('flax') || mealText.includes('walnut');
  const hasDairyOrYogurt = mealText.includes('yogurt') || mealText.includes('milk') || mealText.includes('tahini') || mealText.includes('sesame') || mealText.includes('cheese');
  const hasNutsOrBeans = mealText.includes('oat') || mealText.includes('quinoa') || mealText.includes('lentil') || mealText.includes('chickpea') || mealText.includes('almond') || mealText.includes('bean');

  // Check supplement logs for today
  const todayStr = new Date().toISOString().split('T')[0];
  const loggedSuppNames = supplementLogs
    .filter(l => l.date === todayStr)
    .map(l => (l.name || '').toLowerCase());

  const hasSuppD = loggedSuppNames.some(n => n.includes('vitamin d') || n.includes('d3'));
  const hasSuppMag = loggedSuppNames.some(n => n.includes('magnesium'));
  const hasSuppOmega = loggedSuppNames.some(n => n.includes('omega') || n.includes('fish oil'));
  const hasSuppIron = loggedSuppNames.some(n => n.includes('iron'));
  const hasSuppMulti = loggedSuppNames.some(n => n.includes('multi'));

  const nutrientDiscoveries = [
    {
      id: 'protein',
      name: 'Protein',
      icon: '🥚',
      foodSource: `${totalProtein}g estimated from meals`,
      supplementSource: 'None logged',
      combinedStatus: totalProtein >= 40 ? 'Well Supported' : 'Moderate',
      foodSuggestion: 'Greek yogurt, eggs, lentils, edamame, tofu, poultry, or salmon.',
      details: 'Supports muscle repair, cellular repair, and steady satiety throughout your day.'
    },
    {
      id: 'fiber',
      name: 'Dietary Fibre',
      icon: '🥑',
      foodSource: `${totalFiber}g estimated from meals`,
      supplementSource: 'Whole foods primary',
      combinedStatus: totalFiber >= 20 ? 'Optimal Intake' : 'Comfortable Pace',
      foodSuggestion: 'Chia seeds, berries, avocado, oats, lentils, and roasted chickpeas.',
      details: 'Nourishes healthy gut microbiome and supports smooth blood glucose stability.'
    },
    {
      id: 'iron',
      name: 'Iron',
      icon: '🥬',
      foodSource: hasGreens ? 'Identified in leafy greens & legumes' : 'Appears lighter today',
      supplementSource: (hasSuppIron || hasSuppMulti) ? 'Provided via daily supplement' : 'None logged',
      combinedStatus: (hasGreens || hasSuppIron || hasSuppMulti) ? 'Supported' : 'Light intake',
      foodSuggestion: 'Dark leafy greens (spinach, kale), lentils, pumpkin seeds with a squeeze of lemon.',
      details: 'Essential for oxygen transport in red blood cells and sustained daytime vitality.'
    },
    {
      id: 'vitaminC',
      name: 'Vitamin C',
      icon: '🍊',
      foodSource: hasCitrusOrBerry ? 'Present in citrus, berries & peppers' : 'Light in today’s meals',
      supplementSource: hasSuppMulti ? 'Supported via multivitamin' : 'None logged',
      combinedStatus: (hasCitrusOrBerry || hasSuppMulti) ? 'Optimal' : 'Discoverable',
      foodSuggestion: 'Bell peppers, oranges, kiwi, strawberries, tomatoes, or broccoli.',
      details: 'Potent cellular antioxidant that enhances iron absorption and collagen synthesis.'
    },
    {
      id: 'vitaminD',
      name: 'Vitamin D',
      icon: '☀️',
      foodSource: hasFishOrSeeds ? 'Present in wild fish & fortified foods' : 'Limited in whole foods',
      supplementSource: (hasSuppD || hasSuppMulti) ? 'Supplied via Vitamin D supplement' : 'None logged',
      combinedStatus: (hasSuppD || hasFishOrSeeds) ? 'Supported' : 'Gentle note',
      foodSuggestion: 'Morning sunlight exposure, wild salmon, UV mushrooms, and fortified milks.',
      details: 'Supports bone mineral density, immunity, and healthy hormone synthesis.'
    },
    {
      id: 'magnesium',
      name: 'Magnesium',
      icon: '🌰',
      foodSource: hasNutsOrBeans ? 'Present in oats, nuts & seeds' : 'Moderate in logged meals',
      supplementSource: (hasSuppMag || hasSuppMulti) ? 'Supplied via Magnesium supplement' : 'None logged',
      combinedStatus: (hasNutsOrBeans || hasSuppMag) ? 'Supported' : 'Discoverable',
      foodSuggestion: 'Pumpkin seeds, almonds, dark chocolate, spinach, and quinoa.',
      details: 'Co-factor in over 300 enzymatic reactions supporting nerve calm and muscle relaxation.'
    },
    {
      id: 'omega3',
      name: 'Omega-3 Fatty Acids',
      icon: '🐟',
      foodSource: hasFishOrSeeds ? 'Identified in salmon, chia & seeds' : 'Light in meals today',
      supplementSource: hasSuppOmega ? 'Supplied via Omega-3 softgel' : 'None logged',
      combinedStatus: (hasFishOrSeeds || hasSuppOmega) ? 'Supported' : 'Gentle note',
      foodSuggestion: 'Wild salmon, walnuts, chia seeds, hemp hearts, and flaxseed.',
      details: 'Supports brain membrane fluidity, cardiovascular health, and balanced inflammatory response.'
    },
    {
      id: 'calcium',
      name: 'Calcium',
      icon: '🥛',
      foodSource: hasDairyOrYogurt ? 'Identified in yogurt & fortified foods' : 'Light in meals today',
      supplementSource: hasSuppMulti ? 'Partially in multivitamin' : 'None logged',
      combinedStatus: hasDairyOrYogurt ? 'Supported' : 'Discoverable',
      foodSuggestion: 'Fortified plant milks, sesame tahini, organic yogurt, or sardines.',
      details: 'Essential for bone matrix strength, muscular contractions, and nerve signaling.'
    }
  ];

  const [showDetailedInsight, setShowDetailedInsight] = useState(false);

  // Approximate percentage calculations for display
  const getEstimatedPercent = (item) => {
    if (item.id === 'protein') return Math.min(100, Math.round((totalProtein / 50) * 100)) || 65;
    if (item.id === 'fiber') return Math.min(100, Math.round((totalFiber / 25) * 100)) || 58;
    if (item.id === 'iron') return (hasGreens || hasSuppIron || hasSuppMulti) ? 78 : 45;
    if (item.id === 'vitaminC') return (hasCitrusOrBerry || hasSuppMulti) ? 85 : 50;
    if (item.id === 'vitaminD') return (hasSuppD || hasFishOrSeeds) ? 75 : 40;
    if (item.id === 'magnesium') return (hasNutsOrBeans || hasSuppMag) ? 70 : 48;
    if (item.id === 'omega3') return (hasFishOrSeeds || hasSuppOmega) ? 80 : 35;
    if (item.id === 'calcium') return (hasDairyOrYogurt || hasSuppMulti) ? 68 : 42;
    return 60;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header & Source Filter */}
      <div className="card-glass" style={{ padding: '1.4rem', background: 'radial-gradient(circle at top left, var(--accent-primary-light) 0%, var(--bg-glass-card) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
                <Sparkles size={12} /> Supportive Food Analysis
              </span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Nutritional Insight ✨
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', lineHeight: 1.45 }}>
              Discovers the key vitamins, minerals, and micronutrients naturally present across your logged meals and supplements today.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDetailedInsight(prev => !prev)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.45rem 0.9rem', gap: '0.35rem' }}
          >
            <Info size={14} /> {showDetailedInsight ? 'Hide Detailed Insight' : 'View Detailed Insight'}
          </button>
        </div>

        {/* Quick Summary of Key Vitamins & Nutrients with Estimated Percentages */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.55rem', marginTop: '0.65rem' }}>
          {nutrientDiscoveries.slice(0, 6).map(item => {
            const pct = getEstimatedPercent(item);
            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.75rem',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Non-Diagnostic Educational Notice */}
        <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.95rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-muted)', borderLeft: '3px solid var(--accent-primary)', lineHeight: 1.4, marginTop: '0.85rem' }}>
          💡 <strong>Gentle Note:</strong> These observations highlight whole food opportunities based on your logged ingredients today. They are educational discoveries and not medical diagnostic evaluations.
        </div>
      </div>

      {/* Detailed View - Revealed on Click */}
      {showDetailedInsight && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', animation: 'fadeIn 0.2s ease-out' }}>
          {/* Source Tabs: All Sources | Food Only | Supplements Only */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
              {[
                { id: 'all', label: 'All Sources' },
                { id: 'food', label: '🥗 Food' },
                { id: 'supplements', label: '💊 Supplements' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveSourceFilter(f.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: activeSourceFilter === f.id ? 'var(--accent-primary)' : 'transparent',
                    color: activeSourceFilter === f.id ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nutrients Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '0.85rem' }}>
            {nutrientDiscoveries.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '1.1rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                      {item.icon} {item.name}
                    </span>
                    <span className="pill-badge primary" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      {item.combinedStatus} (~{getEstimatedPercent(item)}%)
                    </span>
                  </div>

                  {/* Distinguish Food Source vs Supplement Source */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', margin: '0.6rem 0', background: 'var(--bg-tertiary)', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.76rem' }}>
                    {(activeSourceFilter === 'all' || activeSourceFilter === 'food') && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                        <Apple size={12} color="var(--accent-primary)" />
                        <span><strong>Food:</strong> {item.foodSource}</span>
                      </div>
                    )}
                    {(activeSourceFilter === 'all' || activeSourceFilter === 'supplements') && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                        <Pill size={12} color="var(--accent-secondary)" />
                        <span><strong>Supplements:</strong> {item.supplementSource}</span>
                      </div>
                    )}
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.4rem 0', lineHeight: 1.4 }}>
                    {item.details}
                  </p>
                </div>

                <div style={{ paddingTop: '0.45rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  🌿 <strong>Enjoy with:</strong> {item.foodSuggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

