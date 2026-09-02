import React from 'react';
import { Home, Activity, Mic, BarChart2, User } from 'lucide-react';

export default function Navbar({ activeTab, onSelectTab }) {
  const navItems = [
    { id: 'HOME', label: 'Home', icon: Home, subtitle: 'How am I doing?' },
    { id: 'WELLNESS', label: 'Wellness', icon: Activity, subtitle: 'Categories & rhythm' },
    { id: 'RECORD', label: 'Record', icon: Mic, subtitle: 'Tell me about your day', isHighlight: true },
    { id: 'INSIGHTS', label: 'Insights', icon: BarChart2, subtitle: 'Understand myself' },
    { id: 'YOU', label: 'You', icon: User, subtitle: 'Personalisation' }
  ];

  return (
    <nav className="navbar-bottom">
      <div className="navbar-container" style={{ maxWidth: 540 }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHighlight = item.isHighlight;

          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id.toLowerCase()}`}
              className={`nav-item ${isActive ? 'active' : ''} ${isHighlight ? 'nav-item-record' : ''}`}
              onClick={() => onSelectTab(item.id)}
              style={isHighlight ? {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                top: -6
              } : undefined}
            >
              <div 
                className="nav-icon-wrap"
                style={isHighlight ? {
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: isActive 
                    ? 'linear-gradient(135deg, var(--accent-primary-hover) 0%, var(--accent-primary) 100%)' 
                    : 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-calm) 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(45, 106, 79, 0.35)',
                  marginBottom: 2
                } : undefined}
              >
                <Icon size={isHighlight ? 22 : 19} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span style={isHighlight ? { fontWeight: 800, color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)' } : undefined}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
