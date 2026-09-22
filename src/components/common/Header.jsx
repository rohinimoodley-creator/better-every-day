import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAuth } from '../../context/AuthContext';
import { Moon, Sun, Flame, Compass, LogIn } from 'lucide-react';
import AuthModal from '../auth/AuthModal';

export default function Header({ onNavigateTab, onOpenWhatCanITrack }) {
  const { theme, setTheme, smallStepState, connectedDevices, triggerManualSync, userProfile } = useWellness();
  const { currentUser } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const isActuallyConnected = connectedDevices?.some(d => d.status === 'connected');
  const isStreakEnabled = userProfile?.trackStreakCounter !== false && userProfile?.streakTracking !== false;

  const toggleTheme = () => {
    setTheme(theme === 'twilight' ? 'sage' : 'twilight');
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        padding: '0 0.85rem',
        borderBottom: '1px solid var(--border-glass)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        boxSizing: 'border-box'
      }}
    >
      {/* Left: Explore Drawer Icon Button + Brand Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
        {onOpenWhatCanITrack && (
          <button
            type="button"
            onClick={onOpenWhatCanITrack}
            aria-label="Open Explore Directory"
            title="Open Explore Directory"
            style={{
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              color: 'var(--accent-primary)',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Compass size={17} />
          </button>
        )}

        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab && onNavigateTab('HOME')}
          onKeyDown={(e) => e.key === 'Enter' && onNavigateTab && onNavigateTab('HOME')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-calm) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.95rem',
              boxShadow: '0 2px 8px rgba(45, 106, 79, 0.25)',
              flexShrink: 0
            }}
          >
            🌱
          </div>

          <h1
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              margin: 0,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            Better Every Day
          </h1>
        </div>
      </div>

      {/* Right Controls: Streak Chip (if enabled) + Sync Chip (if connected) + Auth + Theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
        {/* Sync Indicator: only shown when connected or failed */}
        {isActuallyConnected && (
          <button
            type="button"
            onClick={triggerManualSync}
            aria-label="Sync status: Connected"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '0.25rem 0.55rem',
              minHeight: 34,
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--accent-primary)',
              cursor: 'pointer'
            }}
            title="Devices synced locally. Click to refresh."
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }} />
            <span>Synced</span>
          </button>
        )}

        {/* Streak Chip (only if Track Streak Counter is ON) */}
        {isStreakEnabled && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              background: 'var(--accent-secondary-light)',
              color: 'var(--accent-secondary)',
              padding: '0.25rem 0.6rem',
              minHeight: 32,
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.78rem',
              fontWeight: 700
            }}
            title="Daily Consistency Streak"
            aria-label={`Streak: ${smallStepState?.streakCount || 12} days`}
          >
            <Flame size={13} />
            <span className="tabular-nums">{smallStepState?.streakCount || 12}d</span>
          </div>
        )}

        {/* Google Authentication Button / Avatar */}
        <button
          type="button"
          onClick={() => setIsAuthOpen(true)}
          aria-label={currentUser ? `Account: ${currentUser.displayName || currentUser.email}` : 'Sign In'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: currentUser ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
            border: currentUser ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            padding: currentUser ? '0.2rem 0.45rem' : '0.25rem 0.55rem',
            minHeight: 34,
            borderRadius: 'var(--radius-pill)',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: currentUser ? 'var(--accent-primary)' : 'var(--text-primary)'
          }}
        >
          {currentUser ? (
            currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Avatar"
                style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem'
                }}
              >
                {currentUser.displayName ? currentUser.displayName[0] : '🌱'}
              </span>
            )
          ) : (
            <>
              <LogIn size={13} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.72rem' }}>Sign In</span>
            </>
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'twilight' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            flexShrink: 0
          }}
          title={theme === 'twilight' ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}
        >
          {theme === 'twilight' ? <Sun size={15} color="var(--accent-gold)" /> : <Moon size={15} />}
        </button>
      </div>

      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />
      )}
    </header>
  );
}
