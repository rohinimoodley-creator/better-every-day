import React, { useState, useMemo } from 'react';
import { useWellness } from '../../../context/WellnessContext';
import {
  Sun,
  Moon,
  Sparkles,
  Droplet,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Clock,
  Calendar,
  ShieldCheck,
  Heart,
  Tag,
  Sliders,
  Check,
  Info,
  ChevronRight,
  Filter,
  Search,
  Bell,
  Eye,
  Star,
  X,
  Target,
  Camera,
  Layers,
  Sparkle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AddEditProductModal from './AddEditProductModal';
import EditRoutineStepModal from './EditRoutineStepModal';
import { SKINCARE_CATEGORIES, AVAILABLE_SKIN_GOALS } from '../../../data/mockData';
import { formatPlural } from '../../../utils/formatters.js';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SkincareHub() {
  const {
    skincareProducts = [],
    skincareRoutines = {},
    skincareLogs = {},
    skincareGoals = [],
    skincareSettings = {},
    addSkincareProduct,
    updateSkincareProduct,
    deleteSkincareProduct,
    toggleSkincareStepComplete,
    resetSkincareRoutineDay,
    addSkincareStepToRoutine,
    updateSkincareRoutineStep,
    removeSkincareStepFromRoutine,
    reorderSkincareRoutineSteps,
    addSkincareRoutine,
    deleteSkincareRoutine,
    updateSkincareGoals,
    dailyRhythm = { dayStartTime: '07:00', sleepTime: '23:00' }
  } = useWellness();

  // Launcher Pop-up States (5 buttons)
  const [isMorningOpen, setIsMorningOpen] = useState(false);
  const [isEveningOpen, setIsEveningOpen] = useState(false);
  const [isWeeklyOpen, setIsWeeklyOpen] = useState(false);
  const [isShelfOpen, setIsShelfOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);

  // Sub-modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingStepInfo, setEditingStepInfo] = useState(null); // { routineKey, step }
  const [isAddStepPickerOpen, setIsAddStepPickerOpen] = useState(false);
  const [activeRoutineForAddStep, setActiveRoutineForAddStep] = useState('morning');
  const [isCreateRoutineOpen, setIsCreateRoutineOpen] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineIcon, setNewRoutineIcon] = useState('✨');

  // Shelf Search & Filter
  const [shelfSearch, setShelfSearch] = useState('');
  const [shelfCategoryFilter, setShelfCategoryFilter] = useState('all');

  // Filter for today's scheduled steps vs all
  const [showOnlyTodaySteps, setShowOnlyTodaySteps] = useState(skincareSettings.showOnlyTodaySteps || false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDayName = DAYS_OF_WEEK[new Date().getDay()]; // 'Mon', 'Tue', etc.

  // Routine Step Calculations
  const getRoutineStats = (routineKey) => {
    const routine = skincareRoutines[routineKey] || { steps: [] };
    const logs = (skincareLogs[todayStr] && skincareLogs[todayStr][routineKey]) || { completedSteps: [] };
    const completedStepIds = logs.completedSteps || [];
    const steps = routine.steps || [];
    const displayed = showOnlyTodaySteps
      ? steps.filter(s => !s.scheduleDays || s.scheduleDays.length === 0 || s.scheduleDays.includes(todayDayName))
      : steps;
    const completed = displayed.filter(s => completedStepIds.includes(s.id)).length;
    return {
      total: displayed.length,
      completed,
      isDone: displayed.length > 0 && completed === displayed.length,
      steps: displayed,
      completedStepIds
    };
  };

  const morningStats = getRoutineStats('morning');
  const eveningStats = getRoutineStats('evening');
  const weeklyStats = getRoutineStats('weekly');

  // Handle Step Toggle
  const handleToggleStep = (routineKey, stepId) => {
    toggleSkincareStepComplete(routineKey, stepId, todayStr);
    const stats = getRoutineStats(routineKey);
    const wasAlreadyDone = stats.completedStepIds.includes(stepId);
    if (!wasAlreadyDone && stats.completed + 1 === stats.total) {
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      } catch(e) {}
    }
  };

  // Reorder steps
  const handleMoveStep = (routineKey, index, direction) => {
    const routine = skincareRoutines[routineKey] || { steps: [] };
    const steps = [...(routine.steps || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    const temp = steps[index];
    steps[index] = steps[targetIndex];
    steps[targetIndex] = temp;

    const updated = steps.map((s, i) => ({ ...s, order: i + 1 }));
    reorderSkincareRoutineSteps(routineKey, updated);
  };

  // Complete entire routine at once
  const handleCompleteAllRoutine = (routineKey) => {
    const stats = getRoutineStats(routineKey);
    stats.steps.forEach(step => {
      if (!stats.completedStepIds.includes(step.id)) {
        toggleSkincareStepComplete(routineKey, step.id, todayStr);
      }
    });
    try {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
    } catch(e) {}
  };

  // Filtered shelf products
  const filteredProducts = useMemo(() => {
    return skincareProducts.filter(prod => {
      const matchesSearch = prod.name.toLowerCase().includes(shelfSearch.toLowerCase()) || 
        (prod.brand && prod.brand.toLowerCase().includes(shelfSearch.toLowerCase())) ||
        (prod.keyIngredients && prod.keyIngredients.some(ing => ing.toLowerCase().includes(shelfSearch.toLowerCase())));
      const matchesCat = shelfCategoryFilter === 'all' || prod.category === shelfCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [skincareProducts, shelfSearch, shelfCategoryFilter]);

  // Goal Toggle
  const handleToggleGoal = (goalId) => {
    const updated = skincareGoals.includes(goalId)
      ? skincareGoals.filter(g => g !== goalId)
      : [...skincareGoals, goalId];
    updateSkincareGoals(updated);
  };

  // Gentle Organizational Insights data
  const hydrationProducts = useMemo(() => {
    return skincareProducts.filter(p => 
      p.keyIngredients?.some(ing => ing.toLowerCase().includes('hyaluron') || ing.toLowerCase().includes('ceramide') || ing.toLowerCase().includes('glycerin') || ing.toLowerCase().includes('squalane')) ||
      p.name.toLowerCase().includes('hydrat') || p.category === 'moisturiser'
    );
  }, [skincareProducts]);

  const morningHasSpf = useMemo(() => {
    return (skincareRoutines.morning?.steps || []).some(s => {
      const prod = skincareProducts.find(p => p.id === s.productId);
      return prod?.category === 'sunscreen' || s.customName?.toLowerCase().includes('spf') || s.customName?.toLowerCase().includes('sun');
    });
  }, [skincareRoutines.morning, skincareProducts]);

  // Helper to render routine steps checklist inside modal
  const renderRoutineContent = (routineKey, title, icon, colorTheme, stats, onClose) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Progress Card */}
        <div 
          style={{
            background: colorTheme === 'yellow' ? 'rgba(231, 169, 59, 0.08)' : colorTheme === 'purple' ? 'rgba(123, 97, 255, 0.08)' : 'rgba(64, 145, 108, 0.08)',
            border: `1.5px solid ${colorTheme === 'yellow' ? 'rgba(231, 169, 59, 0.3)' : colorTheme === 'purple' ? 'rgba(123, 97, 255, 0.3)' : 'rgba(64, 145, 108, 0.3)'}`,
            padding: '1rem',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.isDone ? '🎉 Routine Completed Today!' : `${stats.completed} of ${stats.total} steps completed`}
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : '0%'}
            </span>
          </div>

          <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
            <div 
              style={{
                height: '100%',
                width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`,
                background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-calm) 100%)',
                borderRadius: 3,
                transition: 'width 0.3s ease'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={() => handleCompleteAllRoutine(routineKey)}
              disabled={stats.isDone || stats.total === 0}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.76rem', padding: '0.35rem 0.75rem', gap: '0.3rem', fontWeight: 800 }}
            >
              <Check size={13} />
              <span>{stats.isDone ? '✓ Completed' : 'Mark All Done'}</span>
            </button>

            {stats.completed > 0 && (
              <button
                type="button"
                onClick={() => resetSkincareRoutineDay(routineKey, todayStr)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', color: 'var(--text-muted)' }}
              >
                <RotateCcw size={11} style={{ marginRight: 3 }} /> Reset
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setActiveRoutineForAddStep(routineKey);
                setIsAddStepPickerOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', gap: '0.25rem', fontWeight: 700 }}
            >
              <Plus size={13} /> Add Step
            </button>
          </div>
        </div>

        {/* Steps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {stats.steps.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0' }}>
                No steps added to this routine yet.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveRoutineForAddStep(routineKey);
                  setIsAddStepPickerOpen(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <Plus size={14} /> Add Product
              </button>
            </div>
          ) : (
            stats.steps.map((step, index) => {
              const product = skincareProducts.find(p => p.id === step.productId);
              const isCompleted = stats.completedStepIds.includes(step.id);

              return (
                <div
                  key={step.id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isCompleted ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                    border: isCompleted ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.65rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    <button
                      type="button"
                      onClick={() => handleToggleStep(routineKey, step.id)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        border: isCompleted ? 'none' : '2px solid var(--border-glass)',
                        background: isCompleted ? 'var(--accent-primary)' : 'var(--bg-card, #fff)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      {isCompleted ? <Check size={16} /> : null}
                    </button>

                    <div 
                      style={{ 
                        width: 34, 
                        height: 34, 
                        borderRadius: 'var(--radius-sm)', 
                        background: 'var(--bg-tertiary)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '1.1rem',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}
                    >
                      {product?.photo ? (
                        <img src={product.photo} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        product?.icon || '🧴'
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                          {index + 1}.
                        </span>
                        <span 
                          style={{ 
                            fontSize: '0.88rem', 
                            fontWeight: 800, 
                            color: 'var(--text-primary)',
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            opacity: isCompleted ? 0.75 : 1
                          }}
                        >
                          {step.customName || product?.name}
                        </span>
                        {product?.brand && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            • {product.brand}
                          </span>
                        )}
                      </div>
                      {(step.notes || product?.notes) && (
                        <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '0.1rem 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {step.notes || product?.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveStep(routineKey, index, -1)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.2rem 0.35rem', opacity: index === 0 ? 0.3 : 1 }}
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={index === stats.steps.length - 1}
                      onClick={() => handleMoveStep(routineKey, index, 1)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.2rem 0.35rem', opacity: index === stats.steps.length - 1 ? 0.3 : 1 }}
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingStepInfo({ routineKey, step })}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.2rem 0.4rem' }}
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3.5rem' }}>
      
      {/* 1. Clean Compact Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
          <span className="pill-badge primary" style={{ fontSize: '0.7rem' }}>
            🧴 Skincare & Self-Care
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
          Skincare Hub 🧴✨
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
          Choose an option below to manage routines, browse shelf products, or review skin goals.
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
        {/* 1. Morning Routine */}
        <button
          type="button"
          onClick={() => setIsMorningOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, rgba(231, 169, 59, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(231, 169, 59, 0.22)',
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
              background: '#e7a93b', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(231, 169, 59, 0.25)'
            }}
          >
            <Sun size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Morning Routine
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {morningStats.completed}/{morningStats.total} steps done
            </span>
          </div>
        </button>

        {/* 2. Evening Routine */}
        <button
          type="button"
          onClick={() => setIsEveningOpen(true)}
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
              background: '#7b61ff', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(123, 97, 255, 0.25)'
            }}
          >
            <Moon size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Evening Routine
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {eveningStats.completed}/{eveningStats.total} steps done
            </span>
          </div>
        </button>

        {/* 3. Weekly Rituals */}
        <button
          type="button"
          onClick={() => setIsWeeklyOpen(true)}
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
            <Calendar size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Weekly Rituals
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Masks & exfoliants
            </span>
          </div>
        </button>

        {/* 4. My Product Shelf */}
        <button
          type="button"
          onClick={() => setIsShelfOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, rgba(45, 106, 79, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(45, 106, 79, 0.22)',
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
              background: 'var(--accent-primary)', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)'
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              My Product Shelf
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {skincareProducts.length} items cataloged
            </span>
          </div>
        </button>

        {/* 5. Skin Goals & Insights (Spanning 2 columns) */}
        <button
          type="button"
          onClick={() => setIsGoalsOpen(true)}
          className="card-glass card-interactive"
          style={{
            gridColumn: 'span 2',
            background: 'linear-gradient(135deg, rgba(214, 64, 98, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(214, 64, 98, 0.22)',
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
                background: 'var(--accent-rose)', 
                color: '#ffffff',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(214, 64, 98, 0.25)',
                flexShrink: 0
              }}
            >
              <Target size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Skin Goals & Insights
              </h4>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {skincareGoals.length} intentions selected • Rhythm reminders
              </span>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(214, 64, 98, 0.12)', 
            padding: '0.35rem 0.75rem', 
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--accent-rose)'
          }}>
            Explore →
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5 FEATURE POP-UP SHEETS / MODALS                                          */}
      {/* ========================================================================= */}

      {/* 1. Morning Routine Modal */}
      {isMorningOpen && (
        <div className="modal-backdrop" onClick={() => setIsMorningOpen(false)} style={{ zIndex: 1100 }}>
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
                <Sun size={18} color="#e7a93b" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Morning Routine
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsMorningOpen(false)}
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

            {renderRoutineContent('morning', 'Morning Routine', '☀️', 'yellow', morningStats, () => setIsMorningOpen(false))}
          </div>
        </div>
      )}

      {/* 2. Evening Routine Modal */}
      {isEveningOpen && (
        <div className="modal-backdrop" onClick={() => setIsEveningOpen(false)} style={{ zIndex: 1100 }}>
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
                <Moon size={18} color="#7b61ff" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Evening Routine
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsEveningOpen(false)}
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

            {renderRoutineContent('evening', 'Evening Routine', '🌙', 'purple', eveningStats, () => setIsEveningOpen(false))}
          </div>
        </div>
      )}

      {/* 3. Weekly Rituals Modal */}
      {isWeeklyOpen && (
        <div className="modal-backdrop" onClick={() => setIsWeeklyOpen(false)} style={{ zIndex: 1100 }}>
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
                <Calendar size={18} color="var(--accent-calm)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Weekly Rituals & Masks
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsWeeklyOpen(false)}
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

            {renderRoutineContent('weekly', 'Weekly Rituals', '📅', 'green', weeklyStats, () => setIsWeeklyOpen(false))}
          </div>
        </div>
      )}

      {/* 4. Product Shelf Modal */}
      {isShelfOpen && (
        <div className="modal-backdrop" onClick={() => setIsShelfOpen(false)} style={{ zIndex: 1100 }}>
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
                <Layers size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  My Product Shelf ({skincareProducts.length})
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsShelfOpen(false)}
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

            {/* Shelf Actions & Search */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search products or ingredients..."
                  value={shelfSearch}
                  onChange={e => setShelfSearch(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.1rem', fontSize: '0.82rem' }}
                />
              </div>

              <button
                type="button"
                onClick={() => { setEditingProduct(null); setIsAddProductOpen(true); }}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.35rem', fontWeight: 800 }}
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            {/* Products Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.75rem' }}>
              {filteredProducts.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    No products found.
                  </p>
                </div>
              ) : (
                filteredProducts.map(product => {
                  const catObj = SKINCARE_CATEGORIES.find(c => c.id === product.category) || { label: product.category, icon: '🧴' };
                  return (
                    <div
                      key={product.id}
                      style={{
                        padding: '0.9rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.65rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                          <span className="pill-badge" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                            {catObj.icon} {catObj.label}
                          </span>
                          {product.isFavorite && (
                            <Star size={13} color="var(--accent-secondary)" fill="var(--accent-secondary)" />
                          )}
                        </div>

                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0.15rem 0 0.05rem 0', color: 'var(--text-primary)' }}>
                          {product.name}
                        </h4>
                        {product.brand && (
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {product.brand}
                          </div>
                        )}
                        {product.keyIngredients && product.keyIngredients.length > 0 && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                            Key: {product.keyIngredients.slice(0, 3).join(', ')}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => { setEditingProduct(product); setIsAddProductOpen(true); }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', gap: '0.2rem' }}
                        >
                          <Edit2 size={11} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSkincareProduct(product.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#ef4444' }}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Skin Goals & Insights Modal */}
      {isGoalsOpen && (
        <div className="modal-backdrop" onClick={() => setIsGoalsOpen(false)} style={{ zIndex: 1100 }}>
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
                <Target size={18} color="var(--accent-rose)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Skin Goals & Insights
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsGoalsOpen(false)}
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

            {/* Intentions Grid */}
            <div>
              <h4 style={{ fontSize: '0.94rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                Personal Skincare Intentions
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.55rem' }}>
                {AVAILABLE_SKIN_GOALS.map(goal => {
                  const isSelected = skincareGoals.includes(goal.id);
                  return (
                    <div
                      key={goal.id}
                      onClick={() => handleToggleGoal(goal.id)}
                      style={{
                        background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                        border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.55rem'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{goal.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {goal.label}
                          </span>
                          {isSelected && <Check size={13} color="var(--accent-primary)" />}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
                          {goal.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Smart Rhythm Reminders */}
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-primary)' }}>
                <Bell size={14} color="var(--accent-primary)" /> Daily Rhythm Reminders
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0 0 0.65rem 0' }}>
                Morning ready at ~{dailyRhythm.dayStartTime || '07:00'} • Evening wind-down at ~{dailyRhythm.sleepTime || '22:30'}
              </p>
              {morningHasSpf && (
                <div style={{ fontSize: '0.74rem', color: '#e7a93b', fontWeight: 700 }}>
                  ☀️ Daytime SPF protection is active in your morning routine.
                </div>
              )}
            </div>

            {/* Gentle Organizational Notice */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-primary)', fontSize: '0.73rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              🛡️ <strong>Wellness Companion:</strong> Routine and self-care tracking to help you feel refreshed. If you experience persistent skin discomfort, seek qualified dermatological advice.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECONDARY MODALS (Add/Edit Product, Add Step, Edit Step)                  */}
      {/* ========================================================================= */}

      {/* Add / Edit Product Modal */}
      {isAddProductOpen && (
        <AddEditProductModal
          isOpen={isAddProductOpen}
          onClose={() => { setIsAddProductOpen(false); setEditingProduct(null); }}
          editingProduct={editingProduct}
          onSave={(prod) => {
            if (editingProduct) {
              updateSkincareProduct(editingProduct.id, prod);
            } else {
              addSkincareProduct(prod);
            }
          }}
        />
      )}

      {/* Edit Routine Step Modal */}
      {editingStepInfo && (
        <EditRoutineStepModal
          isOpen={Boolean(editingStepInfo)}
          onClose={() => setEditingStepInfo(null)}
          routineKey={editingStepInfo.routineKey}
          step={editingStepInfo.step}
          products={skincareProducts}
          onSave={(updates) => updateSkincareRoutineStep(editingStepInfo.routineKey, editingStepInfo.step.id, updates)}
          onRemove={(stepId) => removeSkincareStepFromRoutine(editingStepInfo.routineKey, stepId)}
        />
      )}

      {/* Add Step From Shelf Picker Modal */}
      {isAddStepPickerOpen && (
        <div 
          className="modal-backdrop"
          onClick={() => setIsAddStepPickerOpen(false)}
          style={{ zIndex: 1200 }}
        >
          <div 
            className="modal-sheet" 
            style={{
              maxWidth: 500,
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '1.25rem'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                Add Product to Routine
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddStepPickerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem' }}>
              {skincareProducts.map(prod => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => {
                    addSkincareStepToRoutine(activeRoutineForAddStep, {
                      productId: prod.id,
                      customName: prod.name,
                      notes: prod.notes,
                      scheduleDays: prod.scheduleDays
                    });
                    setIsAddStepPickerOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{prod.icon || '🧴'}</span>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>{prod.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{prod.brand || prod.category}</div>
                    </div>
                  </div>
                  <Plus size={14} color="var(--accent-primary)" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAddStepPickerOpen(false);
                setEditingProduct(null);
                setIsAddProductOpen(true);
              }}
              className="btn btn-secondary"
              style={{ width: '100%', gap: '0.35rem', fontSize: '0.8rem' }}
            >
              <Plus size={14} /> Create New Product for Shelf
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
