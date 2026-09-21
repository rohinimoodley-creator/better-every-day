import React from 'react';
import { Home, Activity, Mic, BarChart2, User } from 'lucide-react';

export default function Navbar({ activeTab, onSelectTab }) {
  const navItems = [
    { id: 'HOME', label: 'Home', icon: Home },
    { id: 'WELLNESS', label: 'Wellness', icon: Activity },
    { id: 'RECORD', label: 'Record', icon: Mic, isHighlight: true },
    { id: 'INSIGHTS', label: 'Insights', icon: BarChart2 },
    { id: 'YOU', label: 'You', icon: User }
  ];

  return (
    <nav className="navbar-bottom" role="navigation" aria-label="Main Navigation">
      <div className="navbar-container" style={{ maxWidth: 540 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHighlight = item.isHighlight;

          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id.toLowerCase()}`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`nav-item ${isActive ? 'active' : ''} ${isHighlight ? 'nav-item-record' : ''}`}
              onClick={() => onSelectTab(item.id)}
              style={{
                minHeight: '48px',
                minWidth: '48px',
                cursor: 'pointer',
                ...(isHighlight ? {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  top: -4
                } : {})
              }}
            >
              <div
                className="nav-icon-wrap"
                style={isHighlight ? {
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: isActive
                    ? 'linear-gradient(135deg, var(--accent-primary-hover) 0%, var(--accent-primary) 100%)'
                    : 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-calm) 100%)',
                  color: '#ffffff',
                  boxShadow: '0 3px 12px rgba(45, 106, 79, 0.35)',
                  marginBottom: 1
                } : undefined}
              >
                <Icon size={isHighlight ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isHighlight
                    ? (isActive ? 'var(--accent-primary)' : 'var(--text-primary)')
                    : (isActive ? 'var(--accent-primary)' : 'var(--text-muted)')
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
