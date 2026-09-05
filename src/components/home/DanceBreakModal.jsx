import React, { useState, useEffect, useRef } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { danceMusic } from '../../engine/danceMusicEngine';
import { getCustomMediaById } from '../../engine/mediaStorage';
import PipDancingAvatar from '../mascot/PipDancingAvatar';
import confetti from 'canvas-confetti';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle,
  Clock
} from 'lucide-react';

const DANCE_PROMPTS = [
  'Shake it out! 💃',
  'Feel the groove! ✨',
  'Bounce, spin, or tap! 🕺',
  'Any movement counts! 🌟',
  'Move because it feels good! 💖',
  'Tiny dance, huge mood boost! 🌱',
  'Zero rules — just pure joy! 🎉'
];

const COMPLETION_MESSAGES = [
  '🎉 You did it!',
  '💃 That counts.',
  '✨ Better Every Day.',
  '🕺 Tiny dance. Big energy.',
  '🌟 You moved. That’s all that matters.'
];

export default function DanceBreakModal({ isOpen, onClose }) {
  const { logDanceParty, howIThrive = {} } = useWellness();

  // Settings from How I Thrive -> Sensory & Mascot
  const dancePrefs = howIThrive.danceBreakPreferences || {
    durationSec: 10,
    isCustom: false,
    customDuration: 22,
    soundType: 'builtin', // 'builtin' | 'custom'
    selectedMediaId: null,
    startOffsetSec: 0
  };

  const configuredDuration = dancePrefs.isCustom
    ? (Number(dancePrefs.customDuration) || 15)
    : (Number(dancePrefs.durationSec) || 10);

  const [isDancing, setIsDancing] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(configuredDuration);
  const [promptIdx, setPromptIdx] = useState(0);
  const [completionQuote, setCompletionQuote] = useState(COMPLETION_MESSAGES[0]);
  const [activeMediaDetails, setActiveMediaDetails] = useState(null);

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const promptIntervalRef = useRef(null);

  // Initialize playback immediately when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsCompleted(false);
      setIsTransitioning(false);
      setIsPaused(false);
      setIsDancing(true);
      setTimeLeft(configuredDuration);
      setPromptIdx(Math.floor(Math.random() * DANCE_PROMPTS.length));

      // Load custom media if selected
      if (dancePrefs.soundType === 'custom' && dancePrefs.selectedMediaId) {
        getCustomMediaById(dancePrefs.selectedMediaId).then(details => {
          setActiveMediaDetails(details);
          startPlayback(configuredDuration, 'custom', details);
        }).catch(() => {
          startPlayback(configuredDuration, 'builtin');
        });
      } else {
        startPlayback(configuredDuration, 'builtin');
      }
    } else {
      cleanupPlayback();
    }

    return () => cleanupPlayback();
  }, [isOpen]);

  const startPlayback = (duration, type, mediaDetails = null) => {
    cleanupPlayback();

    // 1. Audio Playback
    if (type === 'builtin' || !mediaDetails) {
      danceMusic.start(duration, () => {
        handleDanceFinish(duration);
      });
    } else if (mediaDetails?.blobUrl) {
      const isVideo = mediaDetails.type?.startsWith('video');
      const player = isVideo ? videoRef.current : audioRef.current;
      if (player) {
        player.currentTime = dancePrefs.startOffsetSec || 0;
        player.play().catch(() => {});
      }
    }

    // 2. Encouragement Prompt Rotation
    promptIntervalRef.current = setInterval(() => {
      setPromptIdx(prev => (prev + 1) % DANCE_PROMPTS.length);
    }, 2800);

    // 3. Countdown Timer
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleDanceFinish(duration);
          return 0;
        }

        // Loop custom media if shorter
        if (type === 'custom' && mediaDetails) {
          const isVideo = mediaDetails.type?.startsWith('video');
          const player = isVideo ? videoRef.current : audioRef.current;
          if (player && player.ended) {
            player.currentTime = dancePrefs.startOffsetSec || 0;
            player.play().catch(() => {});
          }
        }

        return prev - 1;
      });
    }, 1000);
  };

  const cleanupPlayback = () => {
    danceMusic.stop();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (promptIntervalRef.current) {
      clearInterval(promptIntervalRef.current);
      promptIntervalRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleDanceFinish = (duration) => {
    cleanupPlayback();
    setIsTransitioning(true);

    const quote = COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)];
    setCompletionQuote(quote);

    const soundLabel = dancePrefs.soundType === 'builtin' ? 'Better Every Day' : (activeMediaDetails?.name || 'Custom Sound');
    if (logDanceParty) {
      logDanceParty(duration, soundLabel, activeMediaDetails?.name);
    }

    // Gentle 320ms transition before revealing completion state
    setTimeout(() => {
      setIsDancing(false);
      setIsCompleted(true);
      setIsTransitioning(false);

      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
    }, 320);
  };

  const handlePauseResume = () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      if (dancePrefs.soundType === 'builtin') {
        danceMusic.start(timeLeft, () => handleDanceFinish(configuredDuration));
      } else {
        const isVideo = activeMediaDetails?.type?.startsWith('video');
        const player = isVideo ? videoRef.current : audioRef.current;
        if (player) player.play().catch(() => {});
      }

      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            handleDanceFinish(configuredDuration);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Pause
      setIsPaused(true);
      danceMusic.stop();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      const isVideo = activeMediaDetails?.type?.startsWith('video');
      const player = isVideo ? videoRef.current : audioRef.current;
      if (player) player.pause();
    }
  };

  const handleReplay = () => {
    setIsCompleted(false);
    setIsDancing(true);
    setIsPaused(false);
    setTimeLeft(configuredDuration);
    startPlayback(configuredDuration, dancePrefs.soundType, activeMediaDetails);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => { cleanupPlayback(); onClose(); }}>
      <div
        className="modal-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 480,
          background: 'var(--bg-glass-card)',
          backdropFilter: 'blur(24px)',
          border: '2px solid var(--accent-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.6rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}
      >
        {/* Hidden Audio/Video Elements */}
        {activeMediaDetails?.blobUrl && (
          activeMediaDetails.type?.startsWith('video') ? (
            <video
              ref={videoRef}
              src={activeMediaDetails.blobUrl}
              playsInline
              style={{ display: 'none' }}
            />
          ) : (
            <audio ref={audioRef} src={activeMediaDetails.blobUrl} />
          )
        )}

        {/* Top Close Button */}
        <button
          onClick={() => { cleanupPlayback(); onClose(); }}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--bg-tertiary)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            zIndex: 10
          }}
          title="Close"
        >
          <X size={18} />
        </button>

        {/* DANCE IN PROGRESS VIEW */}
        {!isCompleted ? (
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '1rem', 
              opacity: isTransitioning ? 0.4 : 1,
              transform: isTransitioning ? 'scale(0.97)' : 'scale(1)',
              transition: 'opacity 0.32s ease, transform 0.32s ease'
            }}
          >
            
            {/* Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="pill-badge primary" style={{ fontSize: '0.74rem', padding: '2px 10px', fontWeight: 800 }}>
                🎉 Dance Break • {configuredDuration}s
              </span>
            </div>

            {/* Joyful Animated Dancing Pip */}
            <div style={{ margin: '0.5rem 0' }}>
              <PipDancingAvatar size={135} isPlaying={!isPaused && !isTransitioning} />
            </div>

            {/* Rotating Dance Encouragement Prompt */}
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                minHeight: '2.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '-0.01em',
                transition: 'all 0.25s ease'
              }}
            >
              {DANCE_PROMPTS[promptIdx]}
            </div>

            {/* Countdown Ring */}
            <div
              style={{
                position: 'relative',
                width: 110,
                height: 110,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="55"
                  cy="55"
                  r="46"
                  stroke="var(--bg-tertiary)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="55"
                  cy="55"
                  r="46"
                  stroke="var(--accent-primary)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 46}
                  strokeDashoffset={2 * Math.PI * 46 * (1 - timeLeft / configuredDuration)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>

              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {timeLeft}
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  SEC
                </span>
              </div>
            </div>

            {/* Controls Bar: Pause & Finish Early */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={handlePauseResume}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.82rem', gap: '0.35rem', padding: '0.45rem 0.95rem' }}
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDanceFinish(configuredDuration - timeLeft || configuredDuration)}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.82rem', gap: '0.35rem', padding: '0.45rem 1rem' }}
              >
                <CheckCircle size={14} />
                <span>Done Early 🎉</span>
              </button>
            </div>

            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              🎵 {dancePrefs.soundType === 'custom' ? (activeMediaDetails?.name || 'Custom Audio') : 'Better Every Day Default Tune'}
            </p>
          </div>
        ) : (
          /* COMPLETION CELEBRATION VIEW */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.1rem', padding: '1rem 0', animation: 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                boxShadow: '0 8px 24px rgba(46, 125, 90, 0.35)',
                animation: 'scaleUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              🎉
            </div>

            <div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.3rem 0' }}>
                {completionQuote}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                You completed a joyful {configuredDuration}s dance break! ✨
              </p>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', width: '100%', maxWidth: 320 }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mindful Movement Logged</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.15rem' }}>
                +{configuredDuration}s of Joyful Movement 🌱
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: 320, marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={handleReplay}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.7rem', fontSize: '0.85rem', gap: '0.35rem' }}
              >
                <RotateCcw size={15} /> Dance Again
              </button>

              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.7rem', fontSize: '0.85rem' }}
              >
                Done ✨
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
