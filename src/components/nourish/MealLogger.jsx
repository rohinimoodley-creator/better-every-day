import React, { useState, useMemo } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Plus, Utensils, Flame, Sparkles, X, ChevronRight, Eye, EyeOff, Calendar, PieChart } from 'lucide-react';
import confetti from 'canvas-confetti';

// Smart heuristic to estimate calories and macros from title description
function estimateMealNutrition(description, mealType) {
  const text = (description || '').toLowerCase();
  let cal = 400;
  let pro = 18;
  let carb = 40;
  let fat = 12;
  let fib = 6;

  if (text.includes('salad') || text.includes('greens') || text.includes('veggie')) {
    cal = 280; pro = 10; carb = 22; fat = 14; fib = 9;
  }
  if (text.includes('salmon') || text.includes('fish') || text.includes('tuna')) {
    cal = 480; pro = 38; carb = 18; fat = 22; fib = 5;
  } else if (text.includes('chicken') || text.includes('turkey') || text.includes('breast')) {
    cal = 440; pro = 42; carb = 24; fat = 12; fib = 4;
  } else if (text.includes('steak') || text.includes('beef') || text.includes('burger')) {
    cal = 620; pro = 36; carb = 35; fat = 32; fib = 3;
  } else if (text.includes('egg') || text.includes('omelet') || text.includes('scramble')) {
    cal = 340; pro = 22; carb = 8; fat = 22; fib = 2;
  } else if (text.includes('oat') || text.includes('porridge') || text.includes('chia') || text.includes('smoothie')) {
    cal = 360; pro = 14; carb = 56; fat = 10; fib = 11;
  } else if (text.includes('pasta') || text.includes('noodle') || text.includes('spaghetti')) {
    cal = 560; pro = 20; carb = 78; fat = 16; fib = 6;
  } else if (text.includes('rice') || text.includes('quinoa') || text.includes('bowl')) {
    cal = 490; pro = 22; carb = 65; fat = 14; fib = 8;
  } else if (text.includes('pizza') || text.includes('burrito') || text.includes('taco')) {
    cal = 680; pro = 28; carb = 72; fat = 28; fib = 6;
  } else if (text.includes('snack') || text.includes('apple') || text.includes('fruit') || text.includes('nut')) {
    cal = 210; pro = 6; carb = 26; fat = 9; fib = 5;
  } else if (mealType === 'Breakfast') {
    cal = 380; pro = 16; carb = 46; fat = 12; fib = 6;
  } else if (mealType === 'Snack') {
    cal = 190; pro = 5; carb = 24; fat = 7; fib = 4;
  } else if (mealType === 'Dinner') {
    cal = 550; pro = 32; carb = 50; fat = 20; fib = 7;
  }

  return { calories: cal, protein: pro, carbs: carb, fat: fat, fiber: fib };
}

export default function MealLogger() {
  const { loggedMeals, logMeal, showMealSummary, toggleMealSummary } = useWellness();

  const [isOpen, setIsOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewPeriod, setReviewPeriod] = useState('today'); // 'today' | 'week' | 'month'

  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const [calorieMode, setCalorieMode] = useState('manual'); // 'manual' | 'estimate'
  const [isEstimated, setIsEstimated] = useState(false);
  const [calories, setCalories] = useState(400);
  const [protein, setProtein] = useState(20);
  const [carbs, setCarbs] = useState(45);
  const [fat, setFat] = useState(12);
  const [fiber, setFiber] = useState(8);

  // Auto-estimate when toggled to estimate or title updates in estimate mode
  const handleRunEstimate = (descToUse = title, typeToUse = mealType) => {
    if (!descToUse.trim()) return;
    const est = estimateMealNutrition(descToUse, typeToUse);
    setCalories(est.calories);
    setProtein(est.protein);
    setCarbs(est.carbs);
    setFat(est.fat);
    setFiber(est.fiber);
    setIsEstimated(true);
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    if (calorieMode === 'estimate' && val.trim().length > 2) {
      handleRunEstimate(val, mealType);
    }
  };

  const handleMealTypeChange = (val) => {
    setMealType(val);
    if (calorieMode === 'estimate' && title.trim().length > 2) {
      handleRunEstimate(title, val);
    }
  };

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
      fiber: Number(fiber),
      isEstimated,
      createdAt: new Date().toISOString()
    });

    setTitle('');
    setIsEstimated(false);
    setIsOpen(false);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch(err) {}
  };

  const totalCalories = loggedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalProtein = loggedMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const totalCarbs = loggedMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
  const totalFat = loggedMeals.reduce((acc, m) => acc + (m.fat || 0), 0);
  const totalFiber = loggedMeals.reduce((acc, m) => acc + (m.fiber || 0), 0);

  // Grouping for Review My Meals
  const mealsByPeriod = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      today: loggedMeals.filter(m => !m.createdAt || m.createdAt.startsWith(todayStr) || m.time?.includes('Today') || !m.createdAt),
      week: loggedMeals.filter(m => !m.createdAt || new Date(m.createdAt) >= sevenDaysAgo),
      month: loggedMeals.filter(m => !m.createdAt || new Date(m.createdAt) >= thirtyDaysAgo)
    };
  }, [loggedMeals]);

  const activeReviewMeals = mealsByPeriod[reviewPeriod] || [];

  const mealCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const categorizedMeals = mealCategories.map(cat => {
    const items = activeReviewMeals.filter(m => (m.mealType || '').toLowerCase() === cat.toLowerCase());
    const subtotalCal = items.reduce((sum, item) => sum + (item.calories || 0), 0);
    const subtotalPro = items.reduce((sum, item) => sum + (item.protein || 0), 0);
    return {
      category: cat,
      items,
      count: items.length,
      calories: subtotalCal,
      protein: subtotalPro
    };
  });

  return (
    <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      
      {/* Header with ON/OFF Macro Toggle & Quick Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '1.25rem' }}>
        <div>
          <span className="pill-badge orange" style={{ marginBottom: '0.25rem' }}>
            <Utensils size={12} /> Today's Nourishment
          </span>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Meal Log & Macro Summary
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Macro Summary ON/OFF Toggle */}
          <button
            onClick={toggleMealSummary}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
            title="Toggle visibility of the top macro summary strip"
          >
            {showMealSummary ? <Eye size={13} color="var(--accent-primary)" /> : <EyeOff size={13} color="var(--text-muted)" />}
            <span>Macro Summary: <strong>{showMealSummary ? 'ON' : 'OFF'}</strong></span>
          </button>

          {/* Review My Meals Button */}
          <button
            onClick={() => setIsReviewOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
          >
            <PieChart size={13} /> Review My Meals
          </button>

          {/* Quick Log Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={15} /> Quick Log Meal
          </button>
        </div>
      </div>

      {/* Macro Summary Strip (Visible only when showMealSummary is ON) */}
      {showMealSummary ? (
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
      ) : (
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Macro summary is hidden. Meal logging remains active below.</span>
          <button onClick={toggleMealSummary} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 700, fontSize: '0.76rem' }}>
            Show Summary
          </button>
        </div>
      )}

      {/* Expandable Manual / Estimated Meal Form */}
      {isOpen && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Add Meal or Snack</h4>
            
            {/* Calorie Mode Switcher: Manual vs Estimate */}
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
              <button
                type="button"
                onClick={() => { setCalorieMode('manual'); setIsEstimated(false); }}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: calorieMode === 'manual' ? 'var(--accent-primary)' : 'transparent',
                  color: calorieMode === 'manual' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ✏️ Manual Entry
              </button>
              <button
                type="button"
                onClick={() => { setCalorieMode('estimate'); handleRunEstimate(); }}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: calorieMode === 'estimate' ? 'var(--accent-secondary)' : 'transparent',
                  color: calorieMode === 'estimate' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Sparkles size={11} /> ✨ Estimate Calories
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Meal Description</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Grilled Salmon Salad with Avocado & Quinoa" 
                value={title} 
                onChange={e => handleTitleChange(e.target.value)} 
                className="input-field" 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
              <select value={mealType} onChange={e => handleMealTypeChange(e.target.value)} className="select-field">
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
          </div>

          {/* Calorie Estimation Status Banner */}
          {calorieMode === 'estimate' && (
            <div style={{ background: 'var(--accent-secondary-light)', border: '1px solid var(--accent-secondary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                <Sparkles size={14} color="var(--accent-secondary)" />
                <span><strong>Estimated: approximately {calories} calories</strong></span>
              </div>
              <button
                type="button"
                onClick={() => handleRunEstimate()}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Re-calculate
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Calories</label>
              <input type="number" value={calories} onChange={e => { setCalories(e.target.value); setIsEstimated(false); }} className="input-field" />
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
              Save Meal Log
            </button>
            <button type="button" onClick={() => setIsOpen(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Logged Meals List (Today's Quick View) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {loggedMeals.slice(0, 3).map(meal => (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pill-badge orange" style={{ fontSize: '0.68rem' }}>
                {meal.mealType}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{meal.title}</span>
              {meal.isEstimated && (
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>
                  ✨ est.
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              <span><strong>{meal.calories}</strong> kcal</span>
              <span>•</span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{meal.protein}g Pro</span>
            </div>
          </div>
        ))}

        {loggedMeals.length > 3 && (
          <button
            onClick={() => setIsReviewOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '0.4rem 0',
              textAlign: 'center'
            }}
          >
            + {loggedMeals.length - 3} more meals — Tap to Review All
          </button>
        )}
      </div>

      {/* REVIEW MY MEALS MODAL / PROGRESSIVE DISCLOSURE DRAWER */}
      {isReviewOpen && (
        <div className="modal-backdrop" onClick={() => setIsReviewOpen(false)}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: 640, maxHeight: '85vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>🍴</span>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Review My Meals</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Nourishment breakdown by category and timeframe
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsReviewOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Timeframe Tabs: Today | This Week | This Month */}
            <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-pill)', marginBottom: '1.25rem' }}>
              {[
                { id: 'today', label: 'Today' },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setReviewPeriod(tab.id)}
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: reviewPeriod === tab.id ? 'var(--accent-primary)' : 'transparent',
                    color: reviewPeriod === tab.id ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 4 Categorized Sections: Breakfast, Lunch, Dinner, Snacks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categorizedMeals.map(catGroup => {
                const iconMap = {
                  Breakfast: '🍳',
                  Lunch: '🥗',
                  Dinner: '🍲',
                  Snack: '🍎'
                };
                return (
                  <div 
                    key={catGroup.category} 
                    style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      padding: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>{iconMap[catGroup.category] || '🍽️'}</span>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{catGroup.category}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({catGroup.count})</span>
                      </div>
                      {catGroup.count > 0 && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          <span style={{ color: 'var(--accent-secondary)' }}>{catGroup.calories} kcal</span> • <span style={{ color: 'var(--accent-primary)' }}>{catGroup.protein}g Pro</span>
                        </div>
                      )}
                    </div>

                    {catGroup.items.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {catGroup.items.map(item => (
                          <div 
                            key={item.id}
                            style={{
                              background: 'var(--bg-tertiary)',
                              padding: '0.55rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '0.82rem'
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</span>
                              {item.isEstimated && (
                                <span style={{ fontSize: '0.68rem', color: 'var(--accent-secondary)', marginLeft: 6, fontWeight: 700 }}>
                                  ✨ est.
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                              <span><strong>{item.calories}</strong> kcal</span>
                              <span>{item.protein}g P</span>
                              <span>{item.carbs}g C</span>
                              <span>{item.fat}g F</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.2rem 0' }}>
                        No {catGroup.category.toLowerCase()} logged for this period.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
              <button 
                onClick={() => setIsReviewOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

