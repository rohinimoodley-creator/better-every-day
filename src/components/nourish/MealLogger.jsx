import React, { useState, useMemo } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { 
  Plus, Utensils, Flame, Sparkles, X, ChevronRight, Eye, EyeOff, 
  Calendar, PieChart, Edit2, Trash2, Bookmark, Globe, Camera, 
  Upload, Check, Share2, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RECIPES_DATABASE } from '../../data/mockData';

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
  const { 
    loggedMeals, logMeal, editMeal, deleteMeal,
    showMealSummary, toggleMealSummary,
    savedCustomMeals, saveMealAsCustom, toggleShareMealToCommunity,
    sharedCommunityMeals
  } = useWellness();

  const [isOpen, setIsOpen] = useState(false);
  const [editingMealId, setEditingMealId] = useState(null);
  const [mealToDelete, setMealToDelete] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewPeriod, setReviewPeriod] = useState('today'); // 'today' | 'week' | 'month'

  // Existing Meal Picker Modal
  const [isExistingMealModalOpen, setIsExistingMealModalOpen] = useState(false);

  // Online Recipe Modal
  const [isOnlineRecipeModalOpen, setIsOnlineRecipeModalOpen] = useState(false);
  const [recipeInputMode, setRecipeInputMode] = useState('paste'); // 'paste' | 'upload'
  const [recipeText, setRecipeText] = useState('');
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeCategory, setRecipeCategory] = useState('Lunch');
  const [recipePhotoSelected, setRecipePhotoSelected] = useState(false);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [parsedRecipeResult, setParsedRecipeResult] = useState(null);
  const [shareToCommunityAfterAdd, setShareToCommunityAfterAdd] = useState(true);

  // Form Fields
  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const [isEstimated, setIsEstimated] = useState(false);
  const [calories, setCalories] = useState(400);
  const [protein, setProtein] = useState(20);
  const [carbs, setCarbs] = useState(45);
  const [fat, setFat] = useState(12);
  const [fiber, setFiber] = useState(8);

  // Auto-estimate or manual estimate trigger
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

  const handleStartEdit = (meal) => {
    setEditingMealId(meal.id);
    setTitle(meal.title || '');
    setMealType(meal.mealType || 'Lunch');
    setCalories(meal.calories || 400);
    setProtein(meal.protein || 20);
    setCarbs(meal.carbs || 45);
    setFat(meal.fat || 12);
    setFiber(meal.fiber || 8);
    setIsEstimated(!!meal.isEstimated);
    setIsOpen(true);
  };

  const handleCancelForm = () => {
    setIsOpen(false);
    setEditingMealId(null);
    setTitle('');
    setIsEstimated(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingMealId) {
      editMeal(editingMealId, {
        title,
        mealType,
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
        fiber: Number(fiber),
        isEstimated
      });
    } else {
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
    }

    handleCancelForm();

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch(err) {}
  };

  const confirmDelete = () => {
    if (mealToDelete) {
      deleteMeal(mealToDelete.id);
      setMealToDelete(null);
    }
  };

  // Pre-fill from existing meal
  const handleSelectExistingMeal = (meal) => {
    setTitle(meal.title || meal.name);
    setMealType(meal.mealType || meal.category || 'Lunch');
    setCalories(meal.calories || meal.macros?.calories || 400);
    setProtein(meal.protein || meal.macros?.protein || 20);
    setCarbs(meal.carbs || meal.macros?.carbs || 45);
    setFat(meal.fat || meal.macros?.fat || 12);
    setFiber(meal.fiber || meal.macros?.fiber || 6);
    setIsEstimated(false);
    setIsExistingMealModalOpen(false);
    setIsOpen(true);
  };

  // Parse online recipe
  const handleParseRecipe = () => {
    const raw = recipeText.trim();
    if (!raw && !recipeTitle) return;

    const parsedTitle = recipeTitle.trim() || raw.split('\n')[0].replace(/^(recipe:|how to make|ingredients:)/i, '').trim() || 'Online Recipe';
    const est = estimateMealNutrition(raw + ' ' + parsedTitle, recipeCategory);

    setParsedRecipeResult({
      title: parsedTitle,
      category: recipeCategory,
      calories: est.calories,
      protein: est.protein,
      carbs: est.carbs,
      fat: est.fat,
      fiber: est.fiber,
      rawText: raw,
      isCommunity: shareToCommunityAfterAdd
    });
  };

  // OCR Upload simulation
  const handleSimulatePhotoOCR = () => {
    setIsAnalyzingPhoto(true);
    setTimeout(() => {
      setIsAnalyzingPhoto(false);
      setRecipePhotoSelected(true);
      const mockOcrTitle = 'Zesty Lemon Herb Roasted Chicken with Asparagus';
      setRecipeTitle(mockOcrTitle);
      const est = estimateMealNutrition(mockOcrTitle, 'Dinner');
      setParsedRecipeResult({
        title: mockOcrTitle,
        category: 'Dinner',
        calories: est.calories,
        protein: est.protein,
        carbs: est.carbs,
        fat: est.fat,
        fiber: est.fiber,
        ingredients: ['Chicken breast', 'Asparagus', 'Lemon', 'Olive oil', 'Garlic', 'Rosemary'],
        isCommunity: shareToCommunityAfterAdd
      });
    }, 1200);
  };

  const handleSaveParsedRecipe = (action = 'save') => {
    if (!parsedRecipeResult) return;

    const newMeal = {
      title: parsedRecipeResult.title,
      category: parsedRecipeResult.category || 'Lunch',
      calories: parsedRecipeResult.calories,
      macros: {
        protein: parsedRecipeResult.protein,
        carbs: parsedRecipeResult.carbs,
        fat: parsedRecipeResult.fat,
        fiber: parsedRecipeResult.fiber
      },
      ingredients: parsedRecipeResult.ingredients || ['Fresh ingredients from online recipe'],
      isCommunity: shareToCommunityAfterAdd,
      submittedBy: 'You'
    };

    saveMealAsCustom(newMeal);

    if (action === 'log') {
      logMeal({
        title: newMeal.title,
        mealType: newMeal.category,
        calories: newMeal.calories,
        protein: newMeal.macros.protein,
        carbs: newMeal.macros.carbs,
        fat: newMeal.macros.fat,
        fiber: newMeal.macros.fiber,
        isEstimated: true,
        createdAt: new Date().toISOString()
      });
    }

    setIsOnlineRecipeModalOpen(false);
    setParsedRecipeResult(null);
    setRecipeText('');
    setRecipeTitle('');
    setRecipePhotoSelected(false);

    try {
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.7 } });
    } catch(e) {}
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

          {/* Use My Existing Meal */}
          <button
            onClick={() => setIsExistingMealModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
            title="Pick a saved recipe or previous custom meal"
          >
            <Bookmark size={13} /> Use My Existing Meal
          </button>

          {/* Add Online Recipe */}
          <button
            onClick={() => setIsOnlineRecipeModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
            title="Import an online recipe via photo or paste"
          >
            <Globe size={13} /> Add an Online Recipe
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
            onClick={() => {
              if (isOpen) {
                handleCancelForm();
              } else {
                setEditingMealId(null);
                setIsOpen(true);
              }
            }}
            className="btn btn-primary btn-sm"
          >
            <Plus size={15} /> Quick Log Meal
          </button>
        </div>
      </div>

      {/* When Macro Summary is ON: Display 5-Column Macro Strip */}
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
        /* When Macro Summary is OFF: Display top 3 recent meals in this space (Clean, no 'hidden' message) */
        <div style={{ marginBottom: '1.25rem', background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <h4 style={{ fontSize: '0.86rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Top Recent Meals
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Quick view & manage
            </span>
          </div>

          {loggedMeals.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.3rem 0' }}>
              No meals logged today yet. Tap "Quick Log Meal" to get started!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {loggedMeals.slice(0, 3).map(meal => (
                <div 
                  key={meal.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className="pill-badge orange" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                      {meal.mealType}
                    </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{meal.title}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                      ({meal.calories} kcal • {meal.protein}g Pro)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      onClick={() => handleStartEdit(meal)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.2rem 0.45rem', fontSize: '0.72rem', gap: '0.2rem' }}
                      title="Edit this meal"
                    >
                      <Edit2 size={11} /> Edit
                    </button>
                    <button
                      onClick={() => setMealToDelete(meal)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.2rem 0.45rem', fontSize: '0.72rem', color: 'var(--accent-rose)', gap: '0.2rem' }}
                      title="Remove this meal"
                    >
                      <Trash2 size={11} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expandable Manual / Estimated Meal Form */}
      {isOpen && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', margin: 0 }}>
              {editingMealId ? 'Edit Meal Log' : 'Add Meal or Snack'}
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Meal Description</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Grilled Salmon Salad with Avocado & Quinoa" 
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

          {/* Action Row: Estimated Calories button placed on the LEFT of Save Meal Log button */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => handleRunEstimate()}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: 700,
                color: 'var(--accent-secondary)',
                border: '1px solid var(--accent-secondary)'
              }}
              title="Calculate estimated macros and calories from your meal title"
            >
              <Sparkles size={13} /> Estimated Calories {isEstimated ? `(~${calories} kcal)` : ''}
            </button>

            <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              {editingMealId ? 'Update Meal Log' : 'Save Meal Log'}
            </button>

            <button type="button" onClick={handleCancelForm} className="btn btn-secondary btn-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Logged Meals List (Today's Standard View when Macro Summary is ON) */}
      {showMealSummary && (
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  <span><strong>{meal.calories}</strong> kcal</span>
                  <span> • </span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{meal.protein}g Pro</span>
                </div>

                <button
                  onClick={() => handleStartEdit(meal)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.2rem 0.4rem', fontSize: '0.72rem' }}
                  title="Edit meal"
                >
                  <Edit2 size={11} />
                </button>
                <button
                  onClick={() => setMealToDelete(meal)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.2rem 0.4rem', fontSize: '0.72rem', color: 'var(--accent-rose)' }}
                  title="Remove meal"
                >
                  <Trash2 size={11} />
                </button>
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
      )}

      {/* USE MY EXISTING MEAL MODAL */}
      {isExistingMealModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsExistingMealModalOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 580, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Bookmark size={16} color="var(--accent-primary)" /> Choose from My Saved Meals
              </h3>
              <button onClick={() => setIsExistingMealModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Select a meal from your saved custom recipes or community favorites to pre-fill your log instantly.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[...savedCustomMeals, ...RECIPES_DATABASE].map(item => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {item.category} • {item.calories} kcal • {item.macros?.protein || item.protein}g protein
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectExistingMeal(item)}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.78rem' }}
                  >
                    Select & Log
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD ONLINE RECIPE MODAL */}
      {isOnlineRecipeModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsOnlineRecipeModalOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 600, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={18} color="var(--accent-secondary)" /> Add an Online Recipe
              </h3>
              <button onClick={() => setIsOnlineRecipeModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Sub-modes: Upload Picture OCR vs Copy & Paste */}
            <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)', marginBottom: '1rem' }}>
              <button
                onClick={() => setRecipeInputMode('paste')}
                style={{
                  flex: 1,
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: recipeInputMode === 'paste' ? 'var(--accent-primary)' : 'transparent',
                  color: recipeInputMode === 'paste' ? '#fff' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                📋 Copy & Paste Text / URL
              </button>
              <button
                onClick={() => setRecipeInputMode('upload')}
                style={{
                  flex: 1,
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: recipeInputMode === 'upload' ? 'var(--accent-primary)' : 'transparent',
                  color: recipeInputMode === 'upload' ? '#fff' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                📷 Upload Picture / Screenshot
              </button>
            </div>

            {recipeInputMode === 'paste' ? (
              <div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Recipe Title (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Avocado Toast with Poached Egg & Microgreens"
                    value={recipeTitle}
                    onChange={e => setRecipeTitle(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Paste Recipe Text or Ingredients</label>
                  <textarea
                    rows={4}
                    placeholder="Paste ingredients, recipe steps, or website description..."
                    value={recipeText}
                    onChange={e => setRecipeText(e.target.value)}
                    className="input-field"
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Meal Category</label>
                  <select value={recipeCategory} onChange={e => setRecipeCategory(e.target.value)} className="select-field">
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleParseRecipe}
                  className="btn btn-secondary"
                  style={{ width: '100%', marginBottom: '1rem', fontWeight: 700 }}
                >
                  ✨ Parse Ingredients & Calculate Macros
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', border: '2px dashed var(--border-glass)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <Camera size={36} color="var(--accent-primary)" style={{ marginBottom: '0.5rem' }} />
                <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.4rem 0' }}>Upload Photo or Screenshot of Recipe</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Smart OCR recognizes ingredients and extracts nutritional estimates.
                </p>
                <button
                  type="button"
                  onClick={handleSimulatePhotoOCR}
                  disabled={isAnalyzingPhoto}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Upload size={14} /> {isAnalyzingPhoto ? 'Analyzing with OCR...' : 'Select Recipe Photo / Screenshot'}
                </button>
              </div>
            )}

            {/* Parsed Result Card */}
            {parsedRecipeResult && (
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.92rem', margin: 0, color: 'var(--text-primary)' }}>
                    ✨ Extracted: {parsedRecipeResult.title}
                  </h4>
                  <span className="pill-badge orange" style={{ fontSize: '0.7rem' }}>
                    {parsedRecipeResult.calories} kcal
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                  <span>Protein: <strong>{parsedRecipeResult.protein}g</strong></span>
                  <span>Carbs: <strong>{parsedRecipeResult.carbs}g</strong></span>
                  <span>Fat: <strong>{parsedRecipeResult.fat}g</strong></span>
                  <span>Fiber: <strong>{parsedRecipeResult.fiber}g</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                  <input
                    type="checkbox"
                    id="shareCommunityCheckbox"
                    checked={shareToCommunityAfterAdd}
                    onChange={e => setShareToCommunityAfterAdd(e.target.checked)}
                  />
                  <label htmlFor="shareCommunityCheckbox" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    Share recipe with the Community Library
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleSaveParsedRecipe('save')}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    Save to My Library
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveParsedRecipe('log')}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    Save & Log Meal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DELETE MEAL CONFIRMATION MODAL */}
      {mealToDelete && (
        <div className="modal-backdrop" onClick={() => setMealToDelete(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 420, textAlign: 'center' }}>
            <AlertCircle size={36} color="var(--accent-rose)" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Remove Meal?</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0' }}>
              Are you sure you want to remove <strong>"{mealToDelete.title}"</strong> from your log?
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setMealToDelete(null)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-primary btn-sm" style={{ flex: 1, background: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}>
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

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


