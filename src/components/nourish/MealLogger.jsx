import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Plus, Utensils, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MealLogger() {
  const { loggedMeals, logMeal } = useWellness();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const [calories, setCalories] = useState(400);
  const [protein, setProtein] = useState(20);
  const [carbs, setCarbs] = useState(45);
  const [fat, setFat] = useState(12);
  const [fiber, setFiber] = useState(8);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    logMeal({
      title,
      mealType,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      fiber: Number(fiber)
    });

    setTitle('');
    setIsOpen(false);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch(e) {}
  };

  const totalCalories = loggedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalProtein = loggedMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const totalCarbs = loggedMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
  const totalFat = loggedMeals.reduce((acc, m) => acc + (m.fat || 0), 0);
  const totalFiber = loggedMeals.reduce((acc, m) => acc + (m.fiber || 0), 0);

  return (
    <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '1.25rem' }}>
        <div>
          <span className="pill-badge orange" style={{ marginBottom: '0.25rem' }}>
            <Utensils size={12} /> Today's Nourishment
          </span>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>Meal Log & Macro Summary</h3>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-primary btn-sm"
        >
          <Plus size={15} /> Quick Log Meal
        </button>
      </div>

      {/* Macro Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1.25rem', textAlign: 'center' }}>
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Calories</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{totalCalories}</div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Protein</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{totalProtein}g</div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Carbs</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3a86c8' }}>{totalCarbs}g</div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fat</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#e5a93c' }}>{totalFat}g</div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fibre</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#40916c' }}>{totalFiber}g</div>
        </div>
      </div>

      {/* Expandable Manual Form */}
      {isOpen && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Add Meal or Snack</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Meal Description</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Grilled Salmon Salad with Avocado" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="input-field" 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
              <select value={mealType} onChange={e => setMealType(e.target.value)} className="select-field">
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Calories</label>
              <input type="number" value={calories} onChange={e => setCalories(e.target.value)} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Protein (g)</label>
              <input type="number" value={protein} onChange={e => setProtein(e.target.value)} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Carbs (g)</label>
              <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Fat (g)</label>
              <input type="number" value={fat} onChange={e => setFat(e.target.value)} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Fibre (g)</label>
              <input type="number" value={fiber} onChange={e => setFiber(e.target.value)} className="input-field" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              Save Log
            </button>
            <button type="button" onClick={() => setIsOpen(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Logged Meals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {loggedMeals.map(meal => (
          <div 
            key={meal.id}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem'
            }}
          >
            <div>
              <span className="pill-badge orange" style={{ fontSize: '0.68rem', marginRight: '0.5rem' }}>
                {meal.mealType}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{meal.title}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              <span><strong>{meal.calories}</strong> kcal</span>
              <span>•</span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{meal.protein}g Pro</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
