import React, { useState } from 'react';
import { Sparkles, Moon, ArrowRight, X, Heart, Utensils, Zap } from 'lucide-react';

export default function CycleAwareSuggestionModal({
  isOpen,
  onClose,
  cyclePhase = 'Luteal',
  cycleDay = 22,
  onContinueOriginal,
  onAcceptSuggestion,
  onSkip
}) {
  const [activeTab, setActiveTab] = useState('move'); // 'move' | 'nourish'

  if (!isOpen) return null;

  const moveExamples = {
    Menstrual: {
      original: { title: 'Standard Scheduled Workout', details: 'Your usual 35 min exercise routine remains unchanged.' },
      suggested: {
        title: 'Gentle Mobility or Restorative Walk',
        details: 'Some people find that gentle walks, dynamic mobility, or restorative yoga feel comforting. If you feel energetic, your usual routine is great too.',
        benefit: 'Zero pressure, promotes circulation, and respects lower energy windows'
      }
    },
    Follicular: {
      original: { title: 'Standard Scheduled Workout', details: 'Your usual 35 min exercise routine remains unchanged.' },
      suggested: {
        title: 'Brisk Walk, Pilates, or Strength Training',
        details: 'As natural vitality often builds, you might enjoy exploring higher-tempo cardio, Pilates, or progressive resistance if that feels good for you.',
        benefit: 'Takes advantage of building stamina and motivation'
      }
    },
    Ovulation: {
      original: { title: 'Standard Scheduled Workout', details: 'Your usual 35 min exercise routine remains unchanged.' },
      suggested: {
        title: 'High-Tempo Workout or Outdoor Run',
        details: 'Some people experience peak stamina around this window. One option could be a spirited workout, outdoor run, or social activity if you feel up for it.',
        benefit: 'Aligns with peak physical stamina and confidence'
      }
    },
    Luteal: {
      original: { title: 'High-Intensity Cardio Plan', details: 'Your usual planned workout remains completely intact.' },
      suggested: {
        title: 'Steady-State Walking & Mindful Mat Pilates',
        details: 'Progesterone can encourage a steadier pacing. You might prefer steady-state walking, mindful Pilates, or gentle bodyweight mobility.',
        benefit: 'Supports nervous system recovery and prevents energy crashes'
      }
    }
  };

  const nourishExamples = {
    Menstrual: {
      original: { title: 'Standard Nutrition Plan', details: 'Your logged meals and dietary targets remain unchanged.' },
      suggested: {
        title: 'Iron & Vitamin C Rich Nourishment',
        details: 'You may want to include meals containing foods rich in iron and vitamin C (such as dark leafy greens, citrus, lentils, and warm vegetable broths) during this part of your cycle if this feels comforting.',
        benefit: 'Warm, mineral-rich nourishment to support cellular vitality'
      }
    },
    Follicular: {
      original: { title: 'Standard Nutrition Plan', details: 'Your logged meals and dietary targets remain unchanged.' },
      suggested: {
        title: 'Fresh Vibrant Greens & Light Proteins',
        details: 'Some people enjoy fresh greens, citrus fruits, fermented foods, and lighter proteins as energy naturally returns.',
        benefit: 'Crisp, micronutrient-dense hydration and digestive ease'
      }
    },
    Ovulation: {
      original: { title: 'Standard Nutrition Plan', details: 'Your logged meals and dietary targets remain unchanged.' },
      suggested: {
        title: 'Antioxidant-Rich Berries & Balanced Fiber',
        details: 'Staying well-hydrated and enjoying colorful antioxidant-rich berries, leafy greens, and balanced fiber can support your daily vitality.',
        benefit: 'Cellular protection and sustained natural energy'
      }
    },
    Luteal: {
      original: { title: 'Standard Nutrition Plan', details: 'Your logged meals and dietary targets remain unchanged.' },
      suggested: {
        title: 'Grounding Complex Carbs & Magnesium-Rich Foods',
        details: 'Some people find that grounding complex carbohydrates (sweet potatoes, oats) and magnesium-rich foods (dark cacao, pumpkin seeds) feel nourishing.',
        benefit: 'Promotes sustained satiety and evening nervous system calm'
      }
    }
  };

  const currentMove = moveExamples[cyclePhase] || moveExamples.Luteal;
  const currentNourish = nourishExamples[cyclePhase] || nourishExamples.Luteal;
  const currentContent = activeTab === 'move' ? currentMove : currentNourish;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: 560, animation: 'scaleUp 0.2s ease-out' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <span className="pill-badge rose" style={{ fontSize: '0.72rem' }}>
                <Moon size={12} /> Cycle-Aware Suggestion Layer Preview
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {cyclePhase} Phase • Day {cycleDay}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Preview Cycle Suggestions 🌸
            </h3>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Philosophy statement: recommend, not police */}
        <div style={{ background: 'rgba(214, 64, 98, 0.08)', border: '1px solid rgba(214, 64, 98, 0.2)', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          💡 <strong>Better Every Day recommends, never polices.</strong> Suggestions are optional previews—your existing workout and nutrition plans are never automatically altered.
        </div>

        {/* Preview Tabs: Move vs Nourish */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-pill)', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setActiveTab('move')}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTab === 'move' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'move' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'move' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Zap size={14} /> Move Hub Preview
          </button>

          <button
            onClick={() => setActiveTab('nourish')}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTab === 'nourish' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'nourish' ? 'var(--accent-secondary)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'nourish' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Utensils size={14} /> Nourish Hub Preview
          </button>
        </div>

        {/* Comparison Cards: Original vs Suggested */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          
          {/* User's Original Planned Choice */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.9rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              Your Current Plan (Unchanged)
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {currentContent.original.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {currentContent.original.details}
            </div>
          </div>

          {/* Gentle Phase-Aligned Alternative */}
          <div style={{ background: 'linear-gradient(135deg, rgba(214, 64, 98, 0.06) 0%, rgba(123, 97, 255, 0.06) 100%)', border: '1.5px solid rgba(214, 64, 98, 0.35)', borderRadius: 'var(--radius-md)', padding: '0.95rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-rose)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              <Sparkles size={12} /> 🌸 Cycle-Aware Preview ({cyclePhase} Phase)
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
              {currentContent.suggested.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.4 }}>
              {currentContent.suggested.details}
            </div>
            {currentContent.suggested.benefit && (
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 600, marginTop: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Heart size={12} /> {currentContent.suggested.benefit}
              </div>
            )}
          </div>

        </div>

        {/* Explicit Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={() => {
              if (onContinueOriginal) onContinueOriginal();
              onClose();
            }}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.7rem', justifyContent: 'center', fontSize: '0.88rem' }}
          >
            <span>Continue With My Normal Plan</span>
            <ArrowRight size={15} />
          </button>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.65rem', justifyContent: 'center', fontSize: '0.82rem' }}
          >
            <span>Close Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}

