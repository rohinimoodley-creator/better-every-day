import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Sparkles, AlertCircle, Info, Plus } from 'lucide-react';

export default function NutritionGaps({ onAddFoodSuggestion }) {
  const { loggedMeals } = useWellness();

  // Aggregate totals
  const totalProtein = loggedMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const totalFiber = loggedMeals.reduce((acc, m) => acc + (m.fiber || 0), 0);
  
  // Micronutrient estimated statuses based on logged foods
  const hasGreens = loggedMeals.some(m => m.title?.toLowerCase().includes('spinach') || m.title?.toLowerCase().includes('veggie') || m.title?.toLowerCase().includes('rainbow'));
  const hasSalmonOrEgg = loggedMeals.some(m => m.title?.toLowerCase().includes('salmon') || m.title?.toLowerCase().includes('egg'));
  const hasYogurtOrSeeds = loggedMeals.some(m => m.title?.toLowerCase().includes('chia') || m.title?.toLowerCase().includes('yogurt') || m.title?.toLowerCase().includes('oats'));

  const nutrientStatus = [
    {
      name: 'Protein',
      logged: `${totalProtein}g`,
      target: '60g - 90g',
      status: totalProtein >= 40 ? 'Good Pace' : 'Moderate',
      suggestion: 'Edamame, Greek yogurt, lentils, eggs, tofu or wild salmon.',
      foodEmoji: '🥚'
    },
    {
      name: 'Dietary Fibre',
      logged: `${totalFiber}g`,
      target: '25g - 35g',
      status: totalFiber >= 20 ? 'Optimal' : 'Appears Low',
      suggestion: 'Chia seeds, raspberries, avocado, oats, and roasted chickpeas.',
      foodEmoji: '🥑'
    },
    {
      name: 'Iron',
      logged: hasGreens ? '~5.5mg' : '~1.8mg',
      target: '8mg - 18mg',
      status: hasGreens ? 'Balanced' : 'Appears Low',
      suggestion: 'Dark leafy greens (spinach, kale), lentils, pumpkin seeds with a squeeze of lemon.',
      foodEmoji: '🥬'
    },
    {
      name: 'Calcium',
      logged: hasYogurtOrSeeds ? '~420mg' : '~150mg',
      target: '1000mg',
      status: hasYogurtOrSeeds ? 'Good Support' : 'Appears Low',
      suggestion: 'Fortified plant milks, sesame tahini, organic yogurt, or sardines.',
      foodEmoji: '🥛'
    },
    {
      name: 'Vitamin C',
      logged: hasGreens ? '~75mg' : '~20mg',
      target: '75mg - 90mg',
      status: hasGreens ? 'Optimal' : 'Appears Low',
      suggestion: 'Bell peppers, oranges, kiwi, strawberries, or broccoli.',
      foodEmoji: '🍊'
    },
    {
      name: 'Vitamin D',
      logged: hasSalmonOrEgg ? '~14mcg' : '<2mcg',
      target: '15mcg - 20mcg',
      status: hasSalmonOrEgg ? 'Supported' : 'Appears Low',
      suggestion: 'Sunlight exposure, fortified oat milk, mushrooms exposed to UV, egg yolks.',
      foodEmoji: '☀️'
    },
    {
      name: 'Folate (B9)',
      logged: hasGreens ? '~220mcg' : '~80mcg',
      target: '400mcg',
      status: hasGreens ? 'Good' : 'Appears Low',
      suggestion: 'Lentils, asparagus, avocado, Brussels sprouts, and romaine lettuce.',
      foodEmoji: '🥦'
    },
    {
      name: 'B-Complex Vitamins',
      logged: hasSalmonOrEgg || hasYogurtOrSeeds ? 'Moderate' : 'Appears Low',
      target: 'Daily intake',
      status: hasSalmonOrEgg || hasYogurtOrSeeds ? 'Balanced' : 'Appears Low',
      suggestion: 'Nutritional yeast, whole grains, nuts, and legumes.',
      foodEmoji: '🌾'
    }
  ];

  return (
    <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div>
          <span className="pill-badge primary" style={{ marginBottom: '0.35rem' }}>
            <Sparkles size={12} /> Today So Far
          </span>
          <h3 style={{ fontSize: '1.3rem' }}>Nutritional Gap Insights</h3>
        </div>
      </div>

      {/* Non-Diagnostic Disclaimer Note */}
      <div 
        style={{
          background: 'var(--accent-primary-light)',
          borderLeft: '4px solid var(--accent-primary)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          marginBottom: '1.25rem',
          lineHeight: 1.45
        }}
      >
        <strong>Gentle Notice:</strong> These observations highlight whole food opportunities based on your logged meals today. They are not medical diagnostic evaluations. Please consult a qualified healthcare professional for medical nutrition guidance.
      </div>

      {/* Nutrients Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.85rem' }}>
        {nutrientStatus.map((item, idx) => {
          const isLow = item.status === 'Appears Low';
          return (
            <div 
              key={idx}
              style={{
                background: 'var(--bg-tertiary)',
                border: `1px solid ${isLow ? 'rgba(217, 119, 54, 0.3)' : 'var(--border-subtle)'}`,
                padding: '0.9rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {item.foodEmoji} {item.name}
                  </span>
                  <span 
                    className={`pill-badge ${isLow ? 'orange' : 'primary'}`}
                    style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}
                  >
                    {item.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Logged: <strong style={{ color: 'var(--text-primary)' }}>{item.logged}</strong> / Target: {item.target}
                </div>

                {isLow ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', margin: 0, lineHeight: 1.35 }}>
                    Your logged meals appear low in {item.name.toLowerCase()}. Consider adding: {item.suggestion}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                    Well supported today! Maintain with: {item.suggestion}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
