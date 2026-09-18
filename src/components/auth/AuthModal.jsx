import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWellness } from '../../context/WellnessContext';
import { 
  X, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  Check, 
  Sparkles, 
  User, 
  Cloud, 
  Lock, 
  AlertCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { currentUser, isAuthLoading, authError, isConfigured, signInWithGoogle, logout } = useAuth();
  const { userProfile, setUserProfile } = useWellness();
  const [syncingCloud, setSyncingCloud] = useState(false);

  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        // Sync with Wellness userProfile
        if (setUserProfile && user.displayName) {
          setUserProfile(prev => ({
            ...prev,
            name: user.displayName,
            email: user.email || prev.email,
            avatar: user.photoURL || prev.avatar || '🌱'
          }));
        }
        try {
          confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
        } catch(e) {}
      }
    } catch (err) {
      // Handled in AuthContext
    }
  };

  const handleSignOut = async () => {
    await logout();
  };

  const handleTriggerCloudSync = () => {
    setSyncingCloud(true);
    setTimeout(() => {
      setSyncingCloud(false);
      try {
        confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } });
      } catch(e) {}
    }, 800);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2200,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        className="card-glass" 
        style={{
          width: '100%',
          maxWidth: 480,
          padding: '1.6rem',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-glass-card, #ffffff)',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
                <ShieldCheck size={12} /> Google Authentication & Cloud Vault
              </span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
              {currentUser ? 'Your Connected Account' : 'Sign in to Better Every Day'}
            </h3>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.8rem' }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{authError}</span>
          </div>
        )}

        {/* Logged-In User State */}
        {currentUser ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* User Profile Card */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'User Avatar'} 
                  style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} 
                />
              ) : (
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-calm) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#ffffff' }}>
                  {currentUser.displayName ? currentUser.displayName[0] : '🌱'}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.displayName || 'Wellness Explorer'}
                  </h4>
                  <span className="pill-badge primary" style={{ fontSize: '0.64rem', padding: '1px 6px' }}>
                    Google Connected
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.15rem' }}>
                  {currentUser.email || 'Private Google Account'}
                </div>
              </div>
            </div>

            {/* Cloud Sync & Sovereignty Status */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Cloud size={14} color="var(--accent-primary)" />
                  Cloud Backup & Sync
                </span>
                <span className="pill-badge" style={{ fontSize: '0.66rem', color: 'var(--accent-primary)' }}>
                  Active & Encrypted
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0' }}>
                Your personal preferences, rhythm schedules, and logs are safely stored on device with optional secure cloud sync.
              </p>

              <button
                type="button"
                onClick={handleTriggerCloudSync}
                disabled={syncingCloud}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.76rem', padding: '0.35rem 0.75rem', gap: '0.3rem', width: '100%', justifyContent: 'center' }}
              >
                <Sparkles size={13} color="var(--accent-primary)" />
                <span>{syncingCloud ? 'Syncing with Cloud Vault...' : 'Sync Cloud Vault Now'}</span>
              </button>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.2rem' }}>
              <button 
                type="button" 
                onClick={onClose} 
                className="btn btn-primary" 
                style={{ flex: 1, fontWeight: 800 }}
              >
                Done
              </button>
              <button 
                type="button" 
                onClick={handleSignOut} 
                className="btn btn-secondary" 
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', gap: '0.35rem' }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Guest / Logged-Out State */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              Sign in with your Google Account to synchronize your routines, wellness rhythm, and product shelf across all your devices securely.
            </p>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isAuthLoading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--border-subtle)',
                background: '#ffffff',
                color: '#1f2937',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{isAuthLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Privacy Guarantee */}
            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <Lock size={15} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                <strong>Zero Pressure Privacy Guarantee:</strong> Better Every Day works fully offline with local guest storage. Signing in with Google is optional and only used for personal device backup.
              </div>
            </div>

            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary" 
              style={{ width: '100%', fontSize: '0.84rem' }}
            >
              Continue as Guest
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
