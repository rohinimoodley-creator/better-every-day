import React, { useState, useEffect, useRef } from 'react';
import {
  getAllCustomMedia,
  getCustomMediaById,
  deleteCustomMedia,
  saveCustomMedia
} from '../../engine/mediaStorage';
import {
  X,
  Music,
  Video,
  Play,
  Pause,
  Trash2,
  Upload,
  Check,
  Sliders,
  Repeat
} from 'lucide-react';

export default function SavedAudioModal({
  isOpen,
  onClose,
  selectedMediaId,
  onSelectMedia,
  startOffsetSec = 0,
  onChangeOffset,
  durationSec = 10
}) {
  const [mediaList, setMediaList] = useState([]);
  const [previewMediaId, setPreviewMediaId] = useState(null);
  const [activeDetails, setActiveDetails] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const audioRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    } else {
      stopPreview();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    try {
      const items = await getAllCustomMedia();
      setMediaList(items);
      if (selectedMediaId) {
        const details = await getCustomMediaById(selectedMediaId);
        setActiveDetails(details);
      }
    } catch {}
  };

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingPreview(false);
    setPreviewMediaId(null);
  };

  const handlePlayPreview = async (item) => {
    if (previewMediaId === item.id && isPlayingPreview) {
      stopPreview();
      return;
    }

    try {
      const details = await getCustomMediaById(item.id);
      if (details?.blobUrl && audioRef.current) {
        audioRef.current.src = details.blobUrl;
        audioRef.current.currentTime = (selectedMediaId === item.id ? startOffsetSec : 0);
        audioRef.current.play().then(() => {
          setIsPlayingPreview(true);
          setPreviewMediaId(item.id);
        }).catch(() => {});
      }
    } catch {}
  };

  const handleSelect = async (mediaId) => {
    onSelectMedia(mediaId);
    const details = await getCustomMediaById(mediaId);
    setActiveDetails(details);
  };

  const handleDelete = async (mediaId, e) => {
    e.stopPropagation();
    try {
      await deleteCustomMedia(mediaId);
      const remaining = mediaList.filter(m => m.id !== mediaId);
      setMediaList(remaining);
      if (previewMediaId === mediaId) stopPreview();
      if (selectedMediaId === mediaId) {
        if (remaining.length > 0) {
          handleSelect(remaining[0].id);
        } else {
          onSelectMedia(null);
          setActiveDetails(null);
        }
      }
    } catch {}
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      setUploadError('File exceeds 100MB limit. Please choose a smaller audio/video file.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const saved = await saveCustomMedia(file, file.name.replace(/\.[^/.]+$/, ''));
      await loadMedia();
      await handleSelect(saved.id);
    } catch (err) {
      setUploadError('Could not process this file. Please try an MP3, M4A, or MP4 file.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => { stopPreview(); onClose(); }}>
      <div
        className="modal-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 520,
          background: 'var(--bg-glass-card)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid var(--accent-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.4rem'
        }}
      >
        <audio ref={audioRef} onEnded={() => setIsPlayingPreview(false)} />

        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🎵</span>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Saved Dance Audio Clips
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.1rem 0 0 0' }}>
                Select, preview, or remove your uploaded media.
              </p>
            </div>
          </div>

          <button
            onClick={() => { stopPreview(); onClose(); }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Upload Button */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{
              border: '1.5px dashed var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: isUploading ? 'wait' : 'pointer',
              background: 'var(--bg-tertiary)',
              color: 'var(--accent-primary)',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            <Upload size={15} />
            <span>{isUploading ? 'Uploading & Processing...' : 'Upload New Audio / Video Clip'}</span>
            <input
              type="file"
              accept="video/mp4,video/webm,audio/mp3,audio/mpeg,audio/wav,audio/m4a,audio/webm"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>

          {uploadError && (
            <div style={{ color: 'var(--accent-rose)', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.4rem' }}>
              ⚠️ {uploadError}
            </div>
          )}
        </div>

        {/* Media List */}
        {mediaList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 240, overflowY: 'auto', marginBottom: '1rem' }}>
            {mediaList.map(item => {
              const isSelected = selectedMediaId === item.id;
              const isItemPlaying = previewMediaId === item.id && isPlayingPreview;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handlePlayPreview(item); }}
                      style={{
                        background: 'var(--accent-primary)',
                        border: 'none',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                      title={isItemPlaying ? 'Pause preview' : 'Play preview'}
                    >
                      {isItemPlaying ? <Pause size={13} fill="#ffffff" /> : <Play size={13} fill="#ffffff" />}
                    </button>

                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 220 }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {item.type?.startsWith('video') ? 'Video clip' : 'Audio track'} • {item.duration}s
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    {isSelected && (
                      <span className="pill-badge primary" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                        Selected ✓
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-rose)',
                        cursor: 'pointer',
                        padding: 4
                      }}
                      title="Remove audio"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            No saved audio clips yet. Upload your favorite energetic music, uplifting beat, or dance song above!
          </div>
        )}

        {/* Trimmer for Selected Media */}
        {activeDetails && activeDetails.duration > durationSec && (
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                <Sliders size={12} /> Section Trimmer:
              </span>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                Starts at {startOffsetSec}s ({startOffsetSec}s – {Math.min(activeDetails.duration, startOffsetSec + durationSec)}s)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(0, activeDetails.duration - durationSec)}
              value={startOffsetSec}
              onChange={e => onChangeOffset && onChangeOffset(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => { stopPreview(); onClose(); }}
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem' }}
        >
          Done ✨
        </button>
      </div>
    </div>
  );
}
