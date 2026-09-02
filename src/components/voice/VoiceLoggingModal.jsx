import React, { useState, useEffect, useRef } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAudio } from '../../context/AudioContext';
import { parseNaturalVoiceInput } from '../../engine/voiceParser';
import VoiceConfirmationModal from './VoiceConfirmationModal';
import { Mic, MicOff, Sparkles, X, Volume2, Play, Square, Check, RefreshCw, Radio } from 'lucide-react';
import confetti from 'canvas-confetti';

const VOICE_PRESETS = [
  {
    title: 'Full Day Story',
    quote: "I walked for 15 minutes, drank five cups of water, ate an apple and Devante hugged me. I was really happy.",
    icon: '🌟'
  },
  {
    title: 'Quick Hydration',
    quote: "I only drank three glasses of water today.",
    icon: '💧'
  },
  {
    title: 'Workout & Coffee Blessing',
    quote: "I went for a 20-minute run in the sunshine and had a warm coffee with Lucas.",
    icon: '🏃'
  }
];

export default function VoiceLoggingModal({ isOpen, onClose }) {
  const { 
    voiceSettings, 
    applyParsedVoiceUpdates, 
    activeWorkoutMinutes, 
    completedWorkouts, 
    hydrationMl 
  } = useWellness();
  const { playChime } = useAudio();

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize SpeechRecognition if available in browser
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition notice:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setAudioSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setAudioSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  if (!isOpen) return null;

  const toggleRecording = () => {
    if (!isRecording) {
      setTranscript('');
      setIsRecording(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch(e) {}
      }
    } else {
      setIsRecording(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch(e) {}
      }
    }
  };

  const handleProcessVoice = (textToProcess = transcript) => {
    if (!textToProcess.trim()) return;

    const existingData = {
      activeWorkoutMinutes,
      completedWorkouts,
      hydrationMl
    };

    const parsed = parseNaturalVoiceInput(textToProcess, existingData);
    setParsedResult(parsed);

    const updateMode = voiceSettings?.updateMode || 'ask_each_time';

    if (updateMode === 'always_update') {
      // Auto apply valid selected items directly
      applyParsedVoiceUpdates(parsed.items.filter(it => it.selected));
      playChime(660);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch(e) {}
      onClose();
    } else {
      // Show confirmation review screen
      setIsConfirmationOpen(true);
    }
  };

  const handleApplyPreset = (presetText) => {
    setTranscript(presetText);
    handleProcessVoice(presetText);
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 580, textAlign: 'center' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span className="pill-badge primary">
              <Mic size={12} /> Natural Voice Assistant
            </span>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>

          <h3 style={{ fontSize: '1.45rem', marginBottom: '0.35rem' }}>
            Tell Better Every Day about your day 🎙️
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: 440, margin: '0 auto 1.5rem' }}>
            Speak naturally about what you did, drank, ate, or felt. The app will update only relevant sections automatically.
          </p>

          {/* Central Pulsing Mic Recording Button */}
          <div style={{ margin: '1.5rem auto' }}>
            <button
              onClick={toggleRecording}
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: isRecording ? 'var(--accent-rose)' : 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-calm) 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: isRecording ? '0 0 25px rgba(214, 64, 98, 0.6)' : '0 8px 24px rgba(45, 106, 79, 0.3)',
                transition: 'all var(--transition-normal)'
              }}
              title={isRecording ? 'Click to stop recording' : 'Click to start speaking'}
            >
              {isRecording ? <Square size={32} /> : <Mic size={36} />}
            </button>

            <div style={{ marginTop: '0.85rem', fontSize: '0.85rem', fontWeight: 700, color: isRecording ? 'var(--accent-rose)' : 'var(--text-secondary)' }}>
              {isRecording ? `🔴 Listening... (${audioSeconds}s)` : 'Tap to start speaking'}
            </div>
          </div>

          {/* Transcript Box */}
          <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Spoken Transcript:
            </label>
            <textarea
              rows={3}
              placeholder="Or type/paste your thoughts here..."
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              className="input-field"
              style={{ width: '100%', fontSize: '0.92rem', lineHeight: 1.45 }}
            />
          </div>

          {/* Quick Speech Inspiration Presets */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
              💡 Or test with a sample voice story:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {VOICE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(preset.quote)}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleProcessVoice(transcript)}
              disabled={!transcript.trim()}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.85rem' }}
            >
              <Sparkles size={16} /> Process Voice Note & Extract
            </button>
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Review Modal */}
      {isConfirmationOpen && (
        <VoiceConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={() => {
            setIsConfirmationOpen(false);
            onClose();
          }}
          parsedResult={parsedResult}
        />
      )}
    </>
  );
}
