import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Sparkles, Clock, Utensils, Plus, CheckCircle, Search } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RecipeBrowser({ onOpenSubmitCommunity }) {
  const { communityRecipes, logMeal } = useWellness();

  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const tags = [
    'all',
    'High Protein',
    'Vegetarian',
    'Vegan',
    'Budget Friendly',
    'Family Friendly',
    'Muscle Building',
    'Weight Management'
  ];

  const filteredRecipes = communityRecipes.filter(r => {
    if (selectedTag !== 'all' && !r.tags.includes(selectedTag)) return false;
    if (searchQuery.trim() && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleLogToToday = (recipe) => {
    logMeal({
      title: recipe.title,
      mealType: recipe.category,
      calories: recipe.calories,
      protein: recipe.macros.protein,
      carbs: recipe.macros.carbs,
      fat: recipe.macros.fat,
      fiber: recipe.macros.fiber
    });

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch(e) {}
  };

  return (
    <div>
      {/* Search & Submit Recipe Top Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search healthy recipes or ingredients..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        <button 
          onClick={onOpenSubmitCommunity}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          <Plus size={15} /> Submit Community Recipe
        </button>
      </div>

      {/* Dietary Filter Pills */}
      <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
        {tags.map(t => (
          <button
            key={t}
            onClick={() => setSelectedTag(t)}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              border: selectedTag === t ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: selectedTag === t ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
              color: selectedTag === t ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {t === 'all' ? '✨ All Diets' : t}
          </button>
        ))}
      </div>

      {/* Recipes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {filteredRecipes.map(r => (
          <div 
            key={r.id}
            className="card-glass card-interactive"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.25rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="pill-badge orange" style={{ fontSize: '0.68rem' }}>
                  {r.category}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Clock size={12} /> {r.timeMinutes} min
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.8rem' }}>{r.image}</span>
                <h4 style={{ fontSize: '1.05rem', margin: 0, lineHeight: 1.3 }}>{r.title}</h4>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.85rem' }}>
                {r.description}
              </p>

              {/* Macros Breakdown */}
              <div 
                style={{
                  background: 'var(--bg-tertiary)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-around',
                  fontSize: '0.75rem',
                  marginBottom: '0.85rem'
                }}
              >
                <div><strong>{r.calories}</strong> <span style={{ color: 'var(--text-muted)' }}>kcal</span></div>
                <div><strong>{r.macros.protein}g</strong> <span style={{ color: 'var(--text-muted)' }}>Pro</span></div>
                <div><strong>{r.macros.carbs}g</strong> <span style={{ color: 'var(--text-muted)' }}>Carb</span></div>
                <div><strong>{r.macros.fat}g</strong> <span style={{ color: 'var(--text-muted)' }}>Fat</span></div>
                <div><strong>{r.macros.fiber}g</strong> <span style={{ color: 'var(--text-muted)' }}>Fib</span></div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
                {r.tags.map((tag, idx) => (
                  <span key={idx} style={{ fontSize: '0.68rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setSelectedRecipe(r)}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                Recipe & Micros
              </button>
              <button
                onClick={() => handleLogToToday(r)}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.2rem' }}
                title="Log this meal to today's nutrition"
              >
                <Plus size={13} /> Log Meal
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="modal-backdrop" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2.5rem' }}>{selectedRecipe.image}</span>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{selectedRecipe.title}</h3>
                <span className="pill-badge orange">{selectedRecipe.category} • {selectedRecipe.timeMinutes} mins</span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {selectedRecipe.description}
            </p>

            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>Ingredients:</h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {selectedRecipe.ingredients.map((ing, i) => (
                <li key={i} style={{ marginBottom: '0.25rem' }}>{ing}</li>
              ))}
            </ul>

            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>Micronutrient Profile:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
              <div>Iron: <strong>{selectedRecipe.micros.iron}</strong></div>
              <div>Calcium: <strong>{selectedRecipe.micros.calcium}</strong></div>
              <div>Vitamin C: <strong>{selectedRecipe.micros.vitC}</strong></div>
              <div>Vitamin D: <strong>{selectedRecipe.micros.vitD}</strong></div>
              <div>Folate: <strong>{selectedRecipe.micros.folate}</strong></div>
              <div>B Vitamins: <strong>{selectedRecipe.micros.bVitamins}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => { handleLogToToday(selectedRecipe); setSelectedRecipe(null); }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <Plus size={16} /> Log to Today
              </button>
              <button onClick={() => setSelectedRecipe(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
