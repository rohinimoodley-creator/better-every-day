import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  ChevronDown,
  Compass,
  ArrowRight,
  Shield,
  Sparkles,
  Mic,
  CheckCircle2,
  Lock,
  Volume2,
  Footprints,
  Utensils,
  Droplet,
  Moon,
  Activity,
  Heart,
  Calendar,
  Users,
  Award,
  BarChart2,
  FileText,
  HelpCircle,
  Brain,
  Search,
  Wind
} from 'lucide-react';

export const EXPLORE_SECTIONS = [
  {
    id: 'wellness',
    name: 'WELLNESS',
    icon: '🌱',
    desc: 'Core pillars of your health and rhythm',
    items: [
      { id: 'w_move', label: 'Move (Workouts & Steps)', targetTab: 'WELLNESS', params: { category: 'move' }, icon: Footprints },
      { id: 'w_nourish', label: 'Nourish (Meals & Recipes)', targetTab: 'WELLNESS', params: { category: 'nourish' }, icon: Utensils },
      { id: 'w_hydrate', label: 'Hydrate (Water Tracking & Rhythms)', targetTab: 'WELLNESS', params: { category: 'hydrate' }, icon: Droplet },
      { id: 'w_rest', label: 'Rest (Sleep & Soundscapes)', targetTab: 'WELLNESS', params: { category: 'rest' }, icon: Moon },
      { id: 'w_mind', label: 'Mind (Gratitude & Mindset)', targetTab: 'WELLNESS', params: { category: 'mind' }, icon: Sparkles },
      { id: 'w_breathwork', label: 'Breathwork (Guided Regulation)', targetTab: 'WELLNESS', params: { category: 'breathwork' }, icon: Wind },
      { id: 'w_cycle', label: 'Cycle (Hormone Syncing - Optional)', targetTab: 'WELLNESS', params: { category: 'cycle' }, icon: Heart },
      { id: 'w_calendar', label: 'Calendar (Life + Wellness Calendar)', targetTab: 'WELLNESS', params: { category: 'calendar' }, icon: Calendar }
    ]
  },
  {
    id: 'together',
    name: 'TOGETHER',
    icon: '👥',
    desc: 'Social connection and community circles',
    items: [
      { id: 't_friends', label: 'Friends & Family Circles', targetTab: 'TOGETHER', params: { subTab: 'circles' }, icon: Users },
      { id: 't_groups', label: 'Wellness Groups & Shared Plans', targetTab: 'TOGETHER', params: { subTab: 'plans' }, icon: Users },
      { id: 't_activities', label: 'Social Activities & Invitations', targetTab: 'WELLNESS', params: { category: 'calendar' }, icon: Calendar },
      { id: 't_challenges', label: 'Gentle Team Challenges', targetTab: 'TOGETHER', params: { subTab: 'challenges' }, icon: Award },
      { id: 't_community', label: 'Gym & Studio Communities', targetTab: 'TOGETHER', params: { subTab: 'gym' }, icon: Footprints }
    ]
  },
  {
    id: 'insights',
    name: 'INSIGHTS',
    icon: '💡',
    desc: 'AI understanding and personal correlations',
    items: [
      { id: 'i_overview', label: 'Overview & Balance Score', targetTab: 'INSIGHTS', params: { tab: 'overview' }, icon: BarChart2 },
      { id: 'i_summary', label: 'Progress Summary & Weekly Story', targetTab: 'INSIGHTS', params: { tab: 'summary' }, icon: FileText },
      { id: 'i_patterns', label: 'Patterns & Correlations', targetTab: 'INSIGHTS', params: { tab: 'patterns' }, icon: Sparkles },
      { id: 'i_recommendations', label: 'Actionable Recommendations & Observations', targetTab: 'INSIGHTS', params: { tab: 'recommendations' }, icon: Sparkles },
      { id: 'i_ask', label: 'Ask Better Every Day (AI Query)', targetTab: 'INSIGHTS', params: { tab: 'ask' }, icon: Brain }
    ]
  },
  {
    id: 'journal',
    name: 'JOURNAL & RECORD',
    icon: '🎙️',
    desc: 'Capture thoughts, daily moments, and reflections',
    items: [
      { id: 'j_record', label: 'Record Day (Voice Note)', targetTab: 'RECORD', params: {}, icon: Mic },
      { id: 'j_write', label: 'Write Reflection & Future Me', targetTab: 'RECORD', params: {}, icon: FileText },
      { id: 'j_gratitude', label: 'Gratitude Moments', targetTab: 'WELLNESS', params: { category: 'mind' }, icon: Sparkles }
    ]
  },
  {
    id: 'help',
    name: 'HELP & GUIDANCE',
    icon: 'ℹ️',
    desc: 'Philosophies, privacy guarantees, and support',
    items: [
      { id: 'h_works', label: 'How Better Every Day Works', targetTab: 'YOU', params: { section: 'how_i_thrive' }, icon: HelpCircle },
      { id: 'h_privacy', label: 'Data Sovereignty & Vault', targetTab: 'YOU', params: { section: 'privacy_data' }, icon: Lock }
    ]
  }
];

export default function WhatCanITrackDrawer({ 
  isOpen, 
  onClose, 
  activeTab, 
  onNavigateTab, 
  onOpenModal 
}) {
  const [expandedSections, setExpandedSections] = useState({
    wellness: true,
    together: true,
    insights: true,
    journal: true,
    help: false
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleSection = (secId) => {
    setExpandedSections(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  const handleItemClick = (item) => {
    if (item.targetTab && onNavigateTab) {
      onNavigateTab(item.targetTab, item.params);
      onClose();
    }
  };

  const filteredSections = EXPLORE_SECTIONS.map(sec => {
    if (!searchQuery.trim()) return sec;
    const q = searchQuery.toLowerCase();
    const matchingItems = sec.items.filter(item => 
      item.label.toLowerCase().includes(q) || 
      sec.name.toLowerCase().includes(q) ||
      sec.desc.toLowerCase().includes(q)
    );
    return { ...sec, items: matchingItems };
  }).filter(sec => sec.items.length > 0);

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        onClick={e => e.stopPropagation()} 
        style={{
          width: '100%',
          maxWidth: 420,
          height: '100vh',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          borderRight: '1px solid var(--border-glass)',
          animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div 
          style={{
            padding: '1.25rem 1.25rem 1rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span className="pill-badge primary" style={{ fontSize: '0.7rem' }}>
                <Compass size={12} /> Explore Directory
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
              Explore Better Every Day 🧭
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
              Find any feature quickly through its primary home. Everything is organized without cluttering Home.
            </p>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-sm)'
            }}
            title="Close Explore Drawer (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Box */}
        <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <input
            type="text"
            placeholder="🔍 Search all features (e.g. sleep, meals, friends, patterns)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-glass-card)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Scrollable Categories List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredSections.map(sec => {
              const isExpanded = expandedSections[sec.id] || searchQuery.trim().length > 0;

              return (
                <div 
                  key={sec.id} 
                  className="card-glass"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {/* Category Header */}
                  <div
                    onClick={() => toggleSection(sec.id)}
                    style={{
                      padding: '0.75rem 0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: isExpanded ? 'var(--bg-secondary)' : 'transparent',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{sec.icon}</span>
                      <div>
                        <strong style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>{sec.name}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.05rem' }}>
                          {sec.desc}
                        </div>
                      </div>
                    </div>

                    <div style={{ color: 'var(--text-muted)' }}>
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>

                  {/* Expanded Items */}
                  {isExpanded && (
                    <div style={{ padding: '0.5rem 0.85rem 0.75rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {sec.items.map(item => {
                        const ItemIcon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.5rem 0.7rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-glass)',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              {ItemIcon && <ItemIcon size={14} color="var(--accent-primary)" />}
                              <span>{item.label}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-primary)', fontSize: '0.72rem', fontWeight: 700 }}>
                              <span>Open</span>
                              <ArrowRight size={12} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Privacy Guarantee */}
        <div 
          style={{
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Lock size={13} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Primary Home Principle:</strong> Every feature has one dedicated home.
          </span>
        </div>
      </div>
    </div>
  );
}
