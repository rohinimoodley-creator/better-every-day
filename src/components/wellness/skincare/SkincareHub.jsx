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
    updateSkincareSettings,
    dailyRhythm = { dayStartTime: '07:00', sleepTime: '23:00' }
  } = useWellness();

  // Smart initial routine selection based on current time of day
  const currentHour = new Date().getHours();
  const initialTab = currentHour < 15 ? 'morning' : 'evening';
  const [activeTab, setActiveTab] = useState(initialTab); // 'morning' | 'evening' | 'weekly' | custom routine id | 'shelf' | 'goals'

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingStepInfo, setEditingStepInfo] = useState(null); // { routineKey, step }
  const [isAddStepPickerOpen, setIsAddStepPickerOpen] = useState(false);
  const [isCreateRoutineOpen, setIsCreateRoutineOpen] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineIcon, setNewRoutineIcon] = useState('✨');
  const [customGoalText, setCustomGoalText] = useState('');

  // Shelf Search & Filter
  const [shelfSearch, setShelfSearch] = useState('');
  const [shelfCategoryFilter, setShelfCategoryFilter] = useState('all');

  // Filter for today's scheduled steps vs all
  const [showOnlyTodaySteps, setShowOnlyTodaySteps] = useState(skincareSettings.showOnlyTodaySteps || false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDayName = DAYS_OF_WEEK[new Date().getDay()]; // 'Mon', 'Tue', etc.

  // Current active routine
  const currentRoutine = skincareRoutines[activeTab] || { steps: [] };
  const currentRoutineLogs = (skincareLogs[todayStr] && skincareLogs[todayStr][activeTab]) || { completedSteps: [] };
  const completedStepIds = currentRoutineLogs.completedSteps || [];

  // Filter steps if "Today's Steps" is active
  const displayedSteps = useMemo(() => {
    const steps = currentRoutine.steps || [];
    if (!showOnlyTodaySteps) return steps;

    return steps.filter(step => {
      if (!step.scheduleDays || step.scheduleDays.length === 0) return true;
      return step.scheduleDays.includes(todayDayName);
    });
  }, [currentRoutine.steps, showOnlyTodaySteps, todayDayName]);

  const totalStepsCount = displayedSteps.length;
  const completedCount = displayedSteps.filter(s => completedStepIds.includes(s.id)).length;
  const isAllCompleted = totalStepsCount > 0 && completedCount === totalStepsCount;

  // Handle Step Toggle
  const handleToggleStep = (stepId) => {
    toggleSkincareStepComplete(activeTab, stepId, todayStr);
    const wasAlreadyDone = completedStepIds.includes(stepId);
    if (!wasAlreadyDone && completedCount + 1 === totalStepsCount) {
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      } catch(e) {}
    }
  };

  // Reorder steps
  const handleMoveStep = (index, direction) => {
    const steps = [...(currentRoutine.steps || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    const temp = steps[index];
    steps[index] = steps[targetIndex];
    steps[targetIndex] = temp;

    // update order
    const updated = steps.map((s, i) => ({ ...s, order: i + 1 }));
    reorderSkincareRoutineSteps(activeTab, updated);
  };

  // Complete entire routine at once
  const handleCompleteAllRoutine = () => {
    displayedSteps.forEach(step => {
      if (!completedStepIds.includes(step.id)) {
        toggleSkincareStepComplete(activeTab, step.id, todayStr);
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

  // Create Custom Routine
  const handleCreateCustomRoutine = (e) => {
    e.preventDefault();
    if (!newRoutineName.trim()) return;
    const routineKey = 'custom_' + Date.now();
    addSkincareRoutine(routineKey, {
      name: newRoutineName.trim(),
      shortTitle: newRoutineName.trim(),
      icon: newRoutineIcon,
      targetTime: 'As Needed',
      reminderText: `Your ${newRoutineName.trim()} skincare ritual is ready.`
    });
    setNewRoutineName('');
    setIsCreateRoutineOpen(false);
    setActiveTab(routineKey);
  };

  // Routine list for tabs
  const routineTabs = useMemo(() => {
    const defaultKeys = ['morning', 'evening', 'weekly'];
    const tabsList = [];

    // Core keys first
    if (skincareRoutines.morning) {
      tabsList.push({ id: 'morning', label: '☀️ Morning', badge: formatPlural((skincareRoutines.morning.steps || []).length, 'step') });
    }
    if (skincareRoutines.evening) {
      tabsList.push({ id: 'evening', label: '🌙 Evening', badge: formatPlural((skincareRoutines.evening.steps || []).length, 'step') });
    }
    if (skincareRoutines.weekly) {
      tabsList.push({ id: 'weekly', label: '📅 Weekly & Rituals', badge: formatPlural((skincareRoutines.weekly.steps || []).length, 'step') });
    }

    // Additional / custom routines
    Object.keys(skincareRoutines).forEach(key => {
      if (!defaultKeys.includes(key)) {
        const r = skincareRoutines[key];
        tabsList.push({
          id: key,
          label: `${r.icon || '✨'} ${r.name || key}`,
          badge: formatPlural((r.steps || []).length, 'step'),
          isCustom: true
        });
      }
    });

    return tabsList;
  }, [skincareRoutines]);

  const isCurrentTabRoutine = Boolean(skincareRoutines[activeTab]);

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

  const exfoliantSteps = useMemo(() => {
    return Object.values(skincareRoutines).flatMap(r => r.steps || []).filter(s => {
      const prod = skincareProducts.find(p => p.id === s.productId);
      return prod?.category === 'exfoliant' || s.customName?.toLowerCase().includes('exfoli') || s.customName?.toLowerCase().includes('bha') || s.customName?.toLowerCase().includes('aha');
    });
  }, [skincareRoutines, skincareProducts]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      
      {/* 1. Header Banner */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
              🧴 Skincare & Self-Care
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              (Today: {todayDayName})
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
            Skin Care Routine 🧴✨
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Build and maintain a calm, flexible routine without pressure or complicated lists.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsCreateRoutineOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem', padding: '0.5rem 0.85rem', fontWeight: 700 }}
          >
            <Plus size={14} />
            <span>New Routine</span>
          </button>

          <button
            type="button"
            onClick={() => { setEditingProduct(null); setIsAddProductOpen(true); }}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.35rem', padding: '0.5rem 0.95rem', fontWeight: 800 }}
          >
            <Plus size={15} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div 
        className="card-glass"
        style={{
          display: 'flex',
          gap: '0.35rem',
          padding: '0.5rem 0.75rem',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}
      >
        {routineTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: isActive ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span 
                style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-tertiary)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}

        {/* Shelf & Goals Fixed Tabs */}
        {[
          { id: 'shelf', label: '🧴 My Product Shelf', badge: `${skincareProducts.length} items` },
          { id: 'goals', label: '🎯 Skin Goals & Insights', badge: `${skincareGoals.length} goals` }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: isActive ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span 
                style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-tertiary)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. ACTIVE ROUTINE VIEW (Morning, Evening, Weekly, Custom)                  */}
      {/* ========================================================================= */}
      {isCurrentTabRoutine && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.2s ease-out' }}>
          
          {/* Routine Status & Progress Card */}
          <div 
            className="card-glass" 
            style={{
              padding: '1.35rem',
              borderRadius: 'var(--radius-lg)',
              background: activeTab === 'morning' 
                ? 'linear-gradient(135deg, rgba(231, 169, 59, 0.08) 0%, var(--bg-glass-card) 100%)' 
                : activeTab === 'evening'
                  ? 'linear-gradient(135deg, rgba(123, 97, 255, 0.08) 0%, var(--bg-glass-card) 100%)'
                  : 'linear-gradient(135deg, rgba(64, 145, 108, 0.08) 0%, var(--bg-glass-card) 100%)',
              border: activeTab === 'morning' 
                ? '1.5px solid rgba(231, 169, 59, 0.3)' 
                : activeTab === 'evening'
                  ? '1.5px solid rgba(123, 97, 255, 0.3)'
                  : '1.5px solid rgba(64, 145, 108, 0.3)'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem' }}>
                  <span className="pill-badge primary" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                    {activeTab === 'morning' ? '☀️ MORNING' : activeTab === 'evening' ? '🌙 EVENING' : activeTab === 'weekly' ? '📅 WEEKLY RITUAL' : `${currentRoutine.icon || '✨'} CUSTOM ROUTINE`}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {activeTab === 'morning' 
                      ? `Suggested time: ~${dailyRhythm.dayStartTime || '07:00'} (Day Start)` 
                      : activeTab === 'evening'
                        ? `Suggested time: ~${dailyRhythm.sleepTime ? 'Before ' + dailyRhythm.sleepTime : '22:30'} (Wind-Down)` 
                        : 'Flexible Self-Care'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
                  {currentRoutine.name}
                </h3>
              </div>

              {/* Action Buttons: Add Step, Filter, Delete Custom */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowOnlyTodaySteps(!showOnlyTodaySteps)}
                  className={`btn ${showOnlyTodaySteps ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ fontSize: '0.74rem', padding: '0.35rem 0.7rem', gap: '0.3rem' }}
                  title="Toggle between today's scheduled steps and all steps"
                >
                  <Filter size={13} />
                  <span>{showOnlyTodaySteps ? `Today (${todayDayName}) Only` : 'Show All Days'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddStepPickerOpen(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.74rem', padding: '0.35rem 0.7rem', gap: '0.3rem', fontWeight: 700 }}
                >
                  <Plus size={13} />
                  <span>Add Step to Routine</span>
                </button>

                {currentRoutine.isCustom && (
                  <button
                    type="button"
                    onClick={() => {
                      deleteSkincareRoutine(activeTab);
                      setActiveTab('morning');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem', padding: '0.35rem 0.55rem', color: '#ef4444' }}
                    title="Delete custom routine"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Completion Progress Bar */}
            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {isAllCompleted 
                    ? '🎉 Routine Complete! Skin feeling fresh & cared for.' 
                    : `${completedCount} of ${totalStepsCount} steps completed today`}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {totalStepsCount > 0 ? `${Math.round((completedCount / totalStepsCount) * 100)}%` : '0%'}
                </span>
              </div>

              <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' }}>
                <div 
                  style={{
                    height: '100%',
                    width: `${totalStepsCount > 0 ? (completedCount / totalStepsCount) * 100 : 0}%`,
                    background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-calm) 100%)',
                    borderRadius: 4,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>

              {/* Quick Completion Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleCompleteAllRoutine}
                  disabled={isAllCompleted || totalStepsCount === 0}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.85rem', gap: '0.3rem', fontWeight: 800 }}
                >
                  <Check size={13} />
                  <span>{isAllCompleted ? '✓ Completed Today' : 'Mark All Completed'}</span>
                </button>

                {completedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => resetSkincareRoutineDay(activeTab, todayStr)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', color: 'var(--text-muted)' }}
                  >
                    <RotateCcw size={11} style={{ marginRight: 3 }} /> Reset Today's Checkmarks
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Routine Steps List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {displayedSteps.length === 0 ? (
              <div className="card-glass" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 0.85rem 0' }}>
                  {showOnlyTodaySteps 
                    ? `No steps scheduled for ${todayDayName}. Switch filter to view all routine steps.` 
                    : 'No steps added to this routine yet.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddStepPickerOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  <Plus size={14} /> Add First Product
                </button>
              </div>
            ) : (
              displayedSteps.map((step, index) => {
                const product = skincareProducts.find(p => p.id === step.productId);
                const isCompleted = completedStepIds.includes(step.id);
                const isScheduledToday = !step.scheduleDays || step.scheduleDays.includes(todayDayName);

                return (
                  <div
                    key={step.id}
                    className="card-glass"
                    style={{
                      padding: '0.95rem 1.15rem',
                      borderRadius: 'var(--radius-md)',
                      background: isCompleted ? 'var(--accent-primary-light)' : 'var(--bg-glass-card)',
                      border: isCompleted ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Left Checkbox & Step Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStep(step.id)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          border: isCompleted ? 'none' : '2px solid var(--border-glass)',
                          background: isCompleted ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isCompleted ? <Check size={18} /> : null}
                      </button>

                      {/* Icon or Product Photo */}
                      <div 
                        style={{ 
                          width: 38, 
                          height: 38, 
                          borderRadius: 'var(--radius-sm)', 
                          background: 'var(--bg-tertiary)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '1.2rem',
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

                      {/* Title & Notes */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                            Step {index + 1}.
                          </span>
                          <span 
                            style={{ 
                              fontSize: '0.92rem', 
                              fontWeight: 800, 
                              color: 'var(--text-primary)',
                              textDecoration: isCompleted ? 'line-through' : 'none',
                              opacity: isCompleted ? 0.75 : 1
                            }}
                          >
                            {step.customName || product?.name}
                          </span>
                          {product?.brand && (
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              • {product.brand}
                            </span>
                          )}
                          {step.scheduleDays && step.scheduleDays.length < 7 && (
                            <span className="pill-badge" style={{ fontSize: '0.64rem', padding: '1px 6px' }}>
                              📅 {step.scheduleDays.join('/')}
                            </span>
                          )}
                        </div>

                        {(step.notes || product?.notes) && (
                          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {step.notes || product?.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Step Actions: Up / Down / Edit */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveStep(index, -1)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.25rem 0.4rem', opacity: index === 0 ? 0.3 : 1 }}
                        title="Move step up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={index === displayedSteps.length - 1}
                        onClick={() => handleMoveStep(index, 1)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.25rem 0.4rem', opacity: index === displayedSteps.length - 1 ? 0.3 : 1 }}
                        title="Move step down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingStepInfo({ routineKey: activeTab, step })}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.25rem 0.45rem' }}
                        title="Edit step"
                      >
                        <Edit2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PRODUCT SHELF VIEW                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'shelf' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', animation: 'fadeIn 0.2s ease-out' }}>
          
          {/* Search & Category Filter Bar */}
          <div className="card-glass" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search products by name, brand, or ingredient..."
                  value={shelfSearch}
                  onChange={e => setShelfSearch(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.2rem', fontSize: '0.84rem' }}
                />
              </div>

              <select
                value={shelfCategoryFilter}
                onChange={e => setShelfCategoryFilter(e.target.value)}
                className="select-field"
                style={{ width: 'auto', minWidth: 150, fontSize: '0.84rem' }}
              >
                <option value="all">All Categories 🧴</option>
                {SKINCARE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
            {filteredProducts.length === 0 ? (
              <div className="card-glass" style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 0.85rem 0' }}>
                  No products matched your search.
                </p>
                <button
                  type="button"
                  onClick={() => { setShelfSearch(''); setShelfCategoryFilter('all'); }}
                  className="btn btn-secondary btn-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredProducts.map(product => {
                const catObj = SKINCARE_CATEGORIES.find(c => c.id === product.category) || { label: product.category, icon: '🧴' };
                return (
                  <div
                    key={product.id}
                    className="card-glass"
                    style={{
                      padding: '1.15rem',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                          {product.photo ? (
                            <img 
                              src={product.photo} 
                              alt={product.name} 
                              style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1.5px solid var(--border-glass)' }} 
                            />
                          ) : (
                            <span style={{ fontSize: '1.35rem' }}>{product.icon || catObj.icon}</span>
                          )}
                          <div>
                            <span className="pill-badge" style={{ fontSize: '0.64rem', padding: '1px 6px' }}>
                              {catObj.label}
                            </span>
                          </div>
                        </div>

                        {product.isFavorite && (
                          <Star size={14} color="var(--accent-secondary)" fill="var(--accent-secondary)" />
                        )}
                      </div>

                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0.2rem 0 0.1rem 0', color: 'var(--text-primary)' }}>
                        {product.name}
                      </h4>
                      {product.brand && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {product.brand}
                        </div>
                      )}

                      {/* When used & frequency */}
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.45rem' }}>
                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                          {product.whenUsed === 'morning' ? '☀️ Morning' : product.whenUsed === 'evening' ? '🌙 Evening' : product.whenUsed === 'both' ? '☀️🌙 AM & PM' : '📅 Weekly'}
                        </span>
                        {product.frequency === 'specific_days' && product.scheduleDays && (
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                            {product.scheduleDays.join('/')}
                          </span>
                        )}
                      </div>

                      {/* Ingredients */}
                      {product.keyIngredients && product.keyIngredients.length > 0 && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.35 }}>
                          <strong>Key:</strong> {product.keyIngredients.slice(0, 3).join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem', marginTop: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => { setEditingProduct(product); setIsAddProductOpen(true); }}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', gap: '0.25rem' }}
                      >
                        <Edit2 size={12} /> Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteSkincareProduct(product.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.45rem', color: '#ef4444' }}
                        title="Delete product"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SKIN GOALS & GENTLE ORGANIZATIONAL INSIGHTS                             */}
      {/* ========================================================================= */}
      {activeTab === 'goals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.2s ease-out' }}>
          
          {/* Skin Goals Selection Card */}
          <div className="card-glass" style={{ padding: '1.35rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '0 0 0.2rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                <Target size={18} color="var(--accent-primary)" /> Personal Skincare Intentions & Goals
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Select what feels right for you. These personalize your routine organization and gentle suggestions without medical promises.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
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
                      padding: '0.85rem 1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{goal.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {goal.label}
                        </span>
                        {isSelected && <Check size={14} color="var(--accent-primary)" />}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.15rem' }}>
                        {goal.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smart Reminders Connected to My Daily Rhythm */}
          <div className="card-glass" style={{ padding: '1.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.15rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                  <Bell size={16} color="var(--accent-primary)" /> Smart Rhythm Reminders
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Reminders seamlessly use your existing <strong>My Daily Rhythm</strong> schedule.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  ☀️ Morning Skincare Nudge
                </span>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  Ready at {dailyRhythm.dayStartTime || '07:00'} (Day Start)
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'block' }}>
                  "It's a good time for your fresh morning skincare routine."
                </span>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  🌙 Evening Skincare Wind-Down
                </span>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  Ready at {dailyRhythm.sleepTime ? 'Before ' + dailyRhythm.sleepTime : '22:30'} (Wind-Down)
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'block' }}>
                  "Your evening skincare routine is ready."
                </span>
              </div>
            </div>
          </div>

          {/* Gentle Routine Insights & Organization */}
          <div className="card-glass" style={{ padding: '1.35rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
              <Sparkles size={16} color="var(--accent-calm)" /> Gentle Organizational Insights
            </h4>

            {/* Dynamic Insight Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <Sparkles size={15} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>Evening Consistency</span>
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  ✨ You've been keeping up with your evening routine consistently before bed.
                </p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <Droplet size={15} color="#3a86c8" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>Hydration Focus</span>
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  💧 You have {hydrationProducts.length} hydration-focused products supporting your skin comfort.
                </p>
              </div>

              {morningHasSpf && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <Sun size={15} color="#e7a93b" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>Sun Protection</span>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    ☀️ Daytime SPF protection is active in your morning routine.
                  </p>
                </div>
              )}

              {exfoliantSteps.length > 0 && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <Sparkle size={15} color="#8b5cf6" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>Balanced Pacing</span>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    🌿 Active exfoliants are thoughtfully spaced across select days.
                  </p>
                </div>
              )}
            </div>

            {/* Non-Medical Disclaimer Guarantee */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-primary)', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              🛡️ <strong>Wellness & Routine Companion:</strong> Better Every Day is a wellness and routine-management tool, not a dermatology diagnostic system. It does not diagnose skin conditions, prescribe medications or treatments, or make curative claims about acne, pigmentation, or eczema. If you experience persistent skin discomfort or concerns, we warmly encourage seeking qualified dermatological advice.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODALS                                                                 */}
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

      {/* Create Custom Routine Modal */}
      {isCreateRoutineOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2200,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setIsCreateRoutineOpen(false)}
        >
          <div 
            className="card-glass" 
            style={{
              width: '100%',
              maxWidth: 460,
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-glass-card, #ffffff)',
              border: '1.5px solid var(--border-subtle)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                Create Custom Skincare Routine
              </h3>
              <button 
                type="button" 
                onClick={() => setIsCreateRoutineOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem', borderRadius: '50%' }}
              >
                <X size={15} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
              Add an extra routine such as <em>Weekly Pamper</em>, <em>Post-Workout Refresh</em>, or <em>Travel Routine</em>.
            </p>

            <form onSubmit={handleCreateCustomRoutine} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
                  Routine Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekend Pamper, Workout Cleanse"
                  value={newRoutineName}
                  onChange={e => setNewRoutineName(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
                  Choose Icon
                </label>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {['✨', '🧖‍♀️', '🌿', '🏊‍♀️', '✈️', '🌸', '🍵', '💧'].map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewRoutineIcon(ic)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-sm)',
                        border: newRoutineIcon === ic ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: newRoutineIcon === ic ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                        fontSize: '1.1rem',
                        cursor: 'pointer'
                      }}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsCreateRoutineOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1.5, fontWeight: 800 }}>
                  Create Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Step From Shelf Picker Modal */}
      {isAddStepPickerOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2200,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setIsAddStepPickerOpen(false)}
        >
          <div 
            className="card-glass" 
            style={{
              width: '100%',
              maxWidth: 500,
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-glass-card, #ffffff)',
              border: '1.5px solid var(--border-subtle)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                Add Product to {currentRoutine.name || 'Routine'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddStepPickerOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem', borderRadius: '50%' }}
              >
                <X size={15} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
              Choose an existing product from your shelf, or create a new one.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {skincareProducts.map(prod => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => {
                    addSkincareStepToRoutine(activeTab, {
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
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {prod.photo ? (
                      <img src={prod.photo} alt={prod.name} style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '1.2rem' }}>{prod.icon || '🧴'}</span>
                    )}
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>{prod.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{prod.brand || prod.category}</div>
                    </div>
                  </div>
                  <Plus size={15} color="var(--accent-primary)" />
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
              style={{ width: '100%', gap: '0.35rem', fontSize: '0.82rem' }}
            >
              <Plus size={14} /> Create New Product for Shelf
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
