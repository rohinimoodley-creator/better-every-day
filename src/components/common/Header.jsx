import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAuth } from '../../context/AuthContext';
import { Moon, Sun, Flame, Compass, User, LogIn } from 'lucide-react';
import VoiceLoggingModal from '../voice/VoiceLoggingModal';
import AuthModal from '../auth/AuthModal';

export default function Header({ onNavigateTab, onOpenWhatCanITrack }) {
  const { theme, setTheme, smallStepState, connectedDevices, triggerManualSync } = useWellness();
  const { currentUser } = useAuth();
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const isActuallyConnected = connectedDevices?.some(d => d.status === 'connected');

  const toggleTheme = () => {
    setTheme(theme === 'twilight' ? 'sage' : 'twilight');
  };

  return (
    <header 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
        borderBottom: '1px solid var(--border-glass)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 90
      }}
    >
      {/* Left Area: Explore Drawer Toggle + Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {onOpenWhatCanITrack && (
          <button
            onClick={onOpenWhatCanITrack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}
            title="Open Explore Directory"
          >
            <Compass size={14} color="var(--accent-primary)" />
            <span>Explore 🧭</span>
          </button>
        )}

        <div 
          onClick={() => onNavigateTab && onNavigateTab('HOME')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem' }}
        >
          <div 
            style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-calm) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)'
            }}
          >
            🌱
          </div>

          <div>
            <h1 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Better Every Day
            </h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Make today a little better
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Real Sync Indicator & Streak & Google Auth & Theme Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Sync Indicator reflecting actual device status */}
        <button
          onClick={triggerManualSync}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            padding: '0.3rem 0.6rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: isActuallyConnected ? 'var(--accent-primary)' : 'var(--text-muted)',
            cursor: 'pointer'
          }}
          title={isActuallyConnected ? 'Devices synced locally.' : 'No devices connected. Click to refresh.'}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActuallyConnected ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
          <span>{isActuallyConnected ? '🔄 Synced' : 'Offline'}</span>
        </button>

        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'var(--accent-secondary-light)',
            color: 'var(--accent-secondary)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.8rem',
            fontWeight: 700
          }}
          title="Daily Consistency Streak"
        >
          <Flame size={14} />
          <span>{smallStepState?.streakCount || 12}d</span>
        </div>

        {/* Google Authentication Button / Avatar */}
        <button
          type="button"
          onClick={() => setIsAuthOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: currentUser ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
            border: currentUser ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            padding: currentUser ? '0.2rem 0.55rem' : '0.35rem 0.65rem',
            borderRadius: 'var(--radius-pill)',
            cursor: 'pointer',
            fontSize: '0.76rem',
            fontWeight: 700,
            color: currentUser ? 'var(--accent-primary)' : 'var(--text-primary)',
            transition: 'all 0.15s ease'
          }}
          title={currentUser ? `Signed in as ${currentUser.displayName || currentUser.email}` : 'Sign in with Google'}
        >
          {currentUser ? (
            <>
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Avatar" 
                  style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                  {currentUser.displayName ? currentUser.displayName[0] : '🌱'}
                </span>
              )}
              <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.displayName?.split(' ')[0] || 'Account'}
              </span>
            </>
          ) : (
            <>
              <LogIn size={13} color="var(--accent-primary)" />
              <span>Sign In</span>
            </>
          )}
        </button>

        <button
          onClick={toggleTheme}
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
            color: 'var(--text-primary)'
          }}
          title={theme === 'twilight' ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}
        >
          {theme === 'twilight' ? <Sun size={16} color="var(--accent-gold)" /> : <Moon size={16} />}
        </button>
      </div>

      {isVoiceOpen && (
        <VoiceLoggingModal
          isOpen={isVoiceOpen}
          onClose={() => setIsVoiceOpen(false)}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />
      )}
    </header>
  );
}

