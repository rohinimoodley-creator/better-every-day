import React, { useState, useEffect, useRef } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { danceMusic } from '../../engine/danceMusicEngine';
import {
  saveCustomMedia,
  getAllCustomMedia,
  getCustomMediaById,
  deleteCustomMedia
} from '../../engine/mediaStorage';
import PipSproutAvatar from '../mascot/PipSproutAvatar';
import confetti from 'canvas-confetti';
import {
  X,
  Play,
  Pause,
  Upload,
  Trash2,
  Sparkles,
  Music,
  Video,
  Clock,
  RotateCcw,
  CheckCircle,
  Volume2,
  Sliders,
  Repeat
} from 'lucide-react';

const PRESET_DURATIONS = [
  { value: 5, label: '5 sec', icon: '⚡' },
  { value: 10, label: '10 sec', icon: '✨' },
  { value: 15, label: '15 sec', icon: '🎵' },
  { value: 30, label: '30 sec', icon: '💃' }
];

const DANCE_PROMPTS = [
  'Shake it out! 💃',
  'Feel the groove! ✨',
  'Bounce, spin, or tap! 🕺',
  'Any movement counts! 🌟',
  'Move because it feels good! 💖',
  'Tiny dance, huge mood boost! 🌱',
  'Zero rules — just joy! 🎉'
];

const COMPLETION_MESSAGES = [
  '🎉 You did it!',
  '💃 That counts.',
  '✨ Better Every Day.',
  '🕺 Tiny dance. Big energy.',
  '🌟 You moved. That’s all that matters.'
];

export default function DancePartyModal({ isOpen, onClose, initialDuration = 15 }) {
  const { logDanceParty, dancePartySettings, updateDancePartySettings } = useWellness();

  // Modal Stage: 'setup' | 'dancing' | 'completed'
  const [stage, setStage] = useState('setup');

  // Duration State
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [durationSec, setDurationSec] = useState(initialDuration || 15);
  const [customInputValue, setCustomInputValue] = useState(
    initialDuration && ![5, 10, 15, 30].includes(initialDuration) ? String(initialDuration) : '22'
  );

  // Sound Type: 'builtin' | 'custom'
  const [soundType, setSoundType] = useState('builtin');
  const [customMediaList, setCustomMediaList] = useState([]);
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [activeMediaDetails, setActiveMediaDetails] = useState(null);
  const [startOffsetSec, setStartOffsetSec] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Live Dance State
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [promptIdx, setPromptIdx] = useState(0);
  const [completionQuote, setCompletionQuote] = useState(COMPLETION_MESSAGES[0]);

  // Audio/Video refs
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const promptIntervalRef = useRef(null);

  // Load custom media list on open
  useEffect(() => {
    if (isOpen) {
      loadMediaLibrary();
      setStage('setup');
      setIsPaused(false);
      setIsTransitioning(false);
      setUploadError('');
    } else {
      cleanupPlayback();
    }
  }, [isOpen]);

  const loadMediaLibrary = async () => {
    try {
      const items = await getAllCustomMedia();
      setCustomMediaList(items);
      if (items.length > 0 && !selectedMediaId) {
        setSelectedMediaId(items[0].id);
        const details = await getCustomMediaById(items[0].id);
        setActiveMediaDetails(details);
      }
    } catch {
      // Ignored
    }
  };

  const handleSelectMedia = async (mediaId) => {
    setSelectedMediaId(mediaId);
    try {
      const details = await getCustomMediaById(mediaId);
      setActiveMediaDetails(details);
    } catch {}
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const savedItem = await saveCustomMedia(file, file.name.replace(/\.[^/.]+$/, ''));
      await loadMediaLibrary();
      setSelectedMediaId(savedItem.id);
      setActiveMediaDetails(savedItem);
      setSoundType('custom');
    } catch (err) {
      setUploadError(err.message || 'Failed to process media file. Please choose an audio or MP4 file under 50MB.');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteMedia = async (mediaId, e) => {
    e.stopPropagation();
    try {
      await deleteCustomMedia(mediaId);
      const remaining = customMediaList.filter(m => m.id !== mediaId);
      setCustomMediaList(remaining);
      if (selectedMediaId === mediaId) {
        if (remaining.length > 0) {
          handleSelectMedia(remaining[0].id);
        } else {
          setSelectedMediaId(null);
          setActiveMediaDetails(null);
          setSoundType('builtin');
        }
      }
    } catch {}
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

  // Start Dancing Flow
  const handleStartDance = () => {
    let finalDuration = durationSec;
    if (isCustomDuration) {
      const parsed = parseInt(customInputValue, 10);
      finalDuration = isNaN(parsed) || parsed <= 0 ? 15 : Math.min(300, parsed);
      setDurationSec(finalDuration);
    }

    setTimeLeft(finalDuration);
    setStage('dancing');
    setIsPaused(false);
    setIsTransitioning(false);
    setPromptIdx(Math.floor(Math.random() * DANCE_PROMPTS.length));

    // Rotating encouragement prompts
    promptIntervalRef.current = setInterval(() => {
      setPromptIdx(prev => (prev + 1) % DANCE_PROMPTS.length);
    }, 3000);

    // Audio / Video playback
    if (soundType === 'builtin') {
      danceMusic.start(finalDuration, () => {
        handleDanceFinish(finalDuration);
      });
    } else if (activeMediaDetails?.blobUrl) {
      const isVideo = activeMediaDetails.type?.startsWith('video');
      const player = isVideo ? videoRef.current : audioRef.current;
      if (player) {
        player.currentTime = startOffsetSec || 0;
        player.play().catch(() => {});
      }
    }

    // Countdown Timer Interval
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleDanceFinish(finalDuration);
          return 0;
        }

        // Auto loop custom media if it reaches end before dance party finishes
        if (soundType === 'custom' && activeMediaDetails) {
          const isVideo = activeMediaDetails.type?.startsWith('video');
          const player = isVideo ? videoRef.current : audioRef.current;
          if (player && player.ended) {
            player.currentTime = startOffsetSec || 0;
            player.play().catch(() => {});
          }
        }

        return prev - 1;
      });
    }, 1000);
  };

  const handleDanceFinish = (completedDuration) => {
    cleanupPlayback();
    setIsTransitioning(true);

    const quote = COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)];
    setCompletionQuote(quote);

    const soundLabel = soundType === 'builtin' ? 'Better Every Day' : (activeMediaDetails?.name || 'My Sound');
    logDanceParty(completedDuration, soundLabel, activeMediaDetails?.name);

    setTimeout(() => {
      setStage('completed');
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
      if (soundType === 'builtin') {
        danceMusic.start(timeLeft, () => handleDanceFinish(durationSec));
      } else {
        const isVideo = activeMediaDetails?.type?.startsWith('video');
        const player = isVideo ? videoRef.current : audioRef.current;
        if (player) player.play().catch(() => {});
      }

      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            handleDanceFinish(durationSec);
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

  const handleStopEarly = () => {
    const elapsed = Math.max(3, durationSec - timeLeft);
    handleDanceFinish(elapsed);
  };

  if (!isOpen) return null;

  const currentDuration = isCustomDuration ? (parseInt(customInputValue, 10) || 15) : durationSec;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 580,
          background: 'var(--bg-glass-card)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid var(--accent-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Hidden Audio/Video Elements for Custom Media */}
        {activeMediaDetails?.blobUrl && (
          activeMediaDetails.type?.startsWith('video') ? (
            <video
              ref={videoRef}
              src={activeMediaDetails.blobUrl}
              playsInline
              style={stage === 'dancing' ? {
                width: '100%',
                maxHeight: 220,
                borderRadius: 'var(--radius-lg)',
                objectFit: 'cover',
                marginBottom: '1rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              } : { display: 'none' }}
            />
          ) : (
            <audio ref={audioRef} src={activeMediaDetails.blobUrl} />
          )
        )}

        {/* Modal Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                boxShadow: '0 4px 12px rgba(46, 125, 90, 0.25)'
              }}
            >
              🎉
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Dance Party
                </h3>
                <span className="pill-badge primary" style={{ fontSize: '0.66rem', padding: '1px 6px' }}>
                  No Rules • Move for Joy
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.1rem 0 0 0' }}>
                Move because it feels good. There is no minimum required.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              cleanupPlayback();
              onClose();
            }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 1: SETUP SCREEN                                                     */}
        {/* ========================================================================= */}
        {stage === 'setup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* 1. Duration Picker */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={15} color="var(--accent-primary)" /> How long are we dancing? 💃
                </strong>
                <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  {currentDuration} seconds
                </span>
              </div>

              {/* Preset Chips + Custom Toggle */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                {PRESET_DURATIONS.map(p => {
                  const isSelected = !isCustomDuration && durationSec === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => {
                        setIsCustomDuration(false);
                        setDurationSec(p.value);
                      }}
                      style={{
                        padding: '0.55rem 0.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>{p.icon}</div>
                      <div style={{ marginTop: '0.15rem' }}>{p.label}</div>
                    </button>
                  );
                })}

                {/* Custom Option */}
                <button
                  type="button"
                  onClick={() => setIsCustomDuration(true)}
                  style={{
                    padding: '0.55rem 0.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: isCustomDuration ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: isCustomDuration ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: isCustomDuration ? '#ffffff' : 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>⏱️</div>
                  <div style={{ marginTop: '0.15rem' }}>Custom</div>
                </button>
              </div>

              {/* Custom Input Field */}
              {isCustomDuration && (
                <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'var(--bg-tertiary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Enter any duration:
                  </span>
                  <input
                    type="number"
                    min="3"
                    max="300"
                    value={customInputValue}
                    onChange={e => setCustomInputValue(e.target.value)}
                    placeholder="e.g. 22"
                    style={{
                      width: 75,
                      padding: '0.35rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--accent-primary)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    seconds (e.g. 7s, 22s, 45s)
                  </span>
                </div>
              )}
            </div>

            {/* 2. Choose Your Sound */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Music size={15} color="var(--accent-primary)" /> Choose your sound 🎵
                </strong>
              </div>

              {/* Sound Option Toggle Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <button
                  type="button"
                  onClick={() => setSoundType('builtin')}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: soundType === 'builtin' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: soundType === 'builtin' ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    color: soundType === 'builtin' ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>🎵</span> Better Every Day
                </button>

                <button
                  type="button"
                  onClick={() => setSoundType('custom')}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: soundType === 'custom' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: soundType === 'custom' ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    color: soundType === 'custom' ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>📁</span> Use My Own Sound
                </button>
              </div>

              {/* Sound Option A: Built-in Better Every Day Sound */}
              {soundType === 'builtin' && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      🎵 Upbeat Dance Groove
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      Synthesized energetic rhythm that adapts naturally to {currentDuration}s.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => danceMusic.preview()}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem', gap: '0.3rem', whiteSpace: 'nowrap' }}
                  >
                    <Volume2 size={13} /> Preview (2s)
                  </button>
                </div>
              )}

              {/* Sound Option B: Custom MP4 / Audio Upload */}
              {soundType === 'custom' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  
                  {/* Upload Dropzone */}
                  <label
                    style={{
                      border: '1.5px dashed var(--accent-primary)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      cursor: isUploading ? 'wait' : 'pointer',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--accent-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    <Upload size={16} />
                    <span>{isUploading ? 'Processing media...' : 'Upload MP4 or Audio Clip'}</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,audio/mp3,audio/mpeg,audio/wav,audio/m4a,audio/webm"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>

                  {uploadError && (
                    <div style={{ color: 'var(--accent-rose)', fontSize: '0.75rem', fontWeight: 600 }}>
                      ⚠️ {uploadError}
                    </div>
                  )}

                  {/* Saved User Media Clips */}
                  {customMediaList.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 150, overflowY: 'auto' }}>
                      {customMediaList.map(item => {
                        const isSelected = selectedMediaId === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectMedia(item.id)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                              background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflow: 'hidden' }}>
                              {item.type?.startsWith('video') ? <Video size={14} color="var(--accent-primary)" /> : <Music size={14} color="var(--accent-primary)" />}
                              <span style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 220 }}>
                                {item.name}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                ({item.duration}s)
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              {isSelected && <span className="pill-badge primary" style={{ fontSize: '0.62rem' }}>Selected</span>}
                              <button
                                type="button"
                                onClick={(e) => handleDeleteMedia(item.id, e)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}
                                title="Delete media"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>
                      No uploaded media yet. Upload your favourite dance song, motivating clip, or funny MP4 video!
                    </div>
                  )}

                  {/* Trimmer & Looping info for selected media */}
                  {activeMediaDetails && (
                    <div style={{ background: 'var(--bg-tertiary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.76rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {activeMediaDetails.duration > currentDuration ? (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Sliders size={12} /> Section Trimmer:
                            </span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                              Start from {startOffsetSec}s ({startOffsetSec}s – {Math.min(activeMediaDetails.duration, startOffsetSec + currentDuration)}s)
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={Math.max(0, activeMediaDetails.duration - currentDuration)}
                            value={startOffsetSec}
                            onChange={e => setStartOffsetSec(Number(e.target.value))}
                            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                          />
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                          <Repeat size={13} />
                          <span>Clip ({activeMediaDetails.duration}s) will loop automatically for your {currentDuration}s dance.</span>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* 3. The Big CTA: LET'S DANCE! */}
            <button
              type="button"
              onClick={handleStartDance}
              className="btn btn-primary"
              style={{
                padding: '0.9rem 1.5rem',
                fontSize: '1.05rem',
                fontWeight: 900,
                letterSpacing: '0.02em',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                boxShadow: '0 6px 20px rgba(46, 125, 90, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.55rem'
              }}
            >
              <Play size={18} fill="#ffffff" />
              <span>LET'S DANCE! ({currentDuration}s)</span>
            </button>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: LIVE DANCE EXPERIENCE                                            */}
        {/* ========================================================================= */}
        {stage === 'dancing' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem 0.5rem',
              textAlign: 'center',
              opacity: isTransitioning ? 0.4 : 1,
              transform: isTransitioning ? 'scale(0.97)' : 'scale(1)',
              transition: 'opacity 0.32s ease, transform 0.32s ease'
            }}
          >
            {/* Dancing Mascot Pip Sprout */}
            <div
              style={{
                marginBottom: '1rem',
                animation: isPaused || isTransitioning ? 'none' : 'bounce 0.8s infinite alternate ease-in-out'
              }}
            >
              <PipSproutAvatar size={90} mood="celebrate" />
            </div>

            {/* Rotating Dance Encouragement Prompt */}
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
                minHeight: '2rem',
                transition: 'all 0.3s ease'
              }}
            >
              {DANCE_PROMPTS[promptIdx]}
            </div>

            {/* Big Countdown Timer Circle */}
            <div
              style={{
                position: 'relative',
                width: 140,
                height: 140,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}
            >
              <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="var(--bg-tertiary)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="var(--accent-primary)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - timeLeft / durationSec)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>

              <div
                style={{
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {timeLeft}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: 2 }}>
                  SECONDS
                </span>
              </div>
            </div>

            {/* Pulsing Equalizer Bars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: 28, marginBottom: '1.5rem' }}>
              {[18, 28, 14, 24, 12, 26, 16, 22, 10, 25].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: isPaused ? 6 : h,
                    borderRadius: 2,
                    background: 'var(--accent-primary)',
                    animation: isPaused ? 'none' : `pulse ${(i % 3) * 0.2 + 0.3}s infinite alternate ease-in-out`
                  }}
                />
              ))}
            </div>

            {/* Playback Controls */}
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: 320 }}>
              <button
                type="button"
                onClick={handlePauseResume}
                className="btn btn-secondary"
                style={{ flex: 1, gap: '0.4rem', fontSize: '0.84rem' }}
              >
                {isPaused ? <Play size={15} /> : <Pause size={15} />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                type="button"
                onClick={handleStopEarly}
                className="btn btn-secondary"
                style={{ flex: 1, gap: '0.4rem', fontSize: '0.84rem' }}
              >
                <CheckCircle size={15} color="var(--accent-primary)" />
                <span>Finish Now</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: LIGHTWEIGHT CELEBRATION                                          */}
        {/* ========================================================================= */}
        {stage === 'completed' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem',
              textAlign: 'center',
              animation: 'fadeIn 0.25s ease-out'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.65rem' }}>
              ✨
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.4rem 0' }}>
              {completionQuote}
            </h3>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0', maxWidth: 360 }}>
              You chose to move, reset your energy, and take a joyful moment for yourself.
            </p>

            <div
              style={{
                background: 'var(--accent-primary-light)',
                border: '1px solid var(--accent-primary)',
                padding: '0.55rem 1.2rem',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--accent-primary)',
                fontWeight: 800,
                fontSize: '0.85rem',
                marginBottom: '1.75rem'
              }}
            >
              🎉 Dance Party — {durationSec} sec logged
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: 340 }}>
              <button
                type="button"
                onClick={() => setStage('setup')}
                className="btn btn-secondary"
                style={{ flex: 1, gap: '0.4rem', fontSize: '0.85rem' }}
              >
                <RotateCcw size={14} /> Dance Again
              </button>

              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary"
                style={{ flex: 1, gap: '0.4rem', fontSize: '0.85rem', fontWeight: 800 }}
              >
                <span>Done ✨</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
