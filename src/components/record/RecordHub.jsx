import React, { useState, useEffect, useRef } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAudio } from '../../context/AudioContext';
import { parseNaturalVoiceInput } from '../../engine/voiceParser';
import {
  Mic,
  MicOff,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  X,
  Edit2,
  AlertCircle,
  HelpCircle,
  Shield,
  Sliders,
  Play,
  Square,
  RefreshCw,
  Heart,
  Droplet,
  Footprints,
  Utensils,
  Moon,
  Calendar,
  Clock,
  ArrowRight,
  Info,
  Check,
  Radio,
  Volume2,
  FileText,
  Mail,
  Download,
  Trash2,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

const VOICE_PRESETS = [
  {
    title: 'Full Day Reflection',
    quote: "I slept about six hours, had eggs for breakfast, drank three glasses of water and went for a 20-minute walk after work. Devante gave me a hug and it made me really happy.",
    icon: '🌟'
  },
  {
    title: 'Movement & Body Signals',
    quote: "I went for a 15-minute walk during lunch, but had a slight headache and lower back stiffness around 3pm.",
    icon: '🏃'
  },
  {
    title: 'Hydration & Calm Gratitude',
    quote: "Drank four cups of water today. My friend called me this afternoon and honestly it made my whole day.",
    icon: '💛'
  },
  {
    title: 'Tough Day / Low Energy',
    quote: "I barely slept last night and felt exhausted all morning. Had a bowl of soup for lunch and took things very gently.",
    icon: '🌙'
  }
];

const RECORD_QA_LIST = [
  {
    q: 'What is Record & Write?',
    a: 'Record lets you tell Better Every Day about your day naturally by speaking or writing. You don\'t need to remember what to log. If you mention something you\'d like tracked, Better Every Day helps extract it for your review.'
  },
  {
    q: 'How does Better Every Day know what to track?',
    a: 'Our on-device language engine identifies explicit mentions of water, meals, walking, sleep, and physical signals without inferring unsupported medical conditions.'
  },
  {
    q: 'Can I control what gets added?',
    a: 'Yes, always. You can review, edit, or reject any detected item before adding it to your trackers.'
  },
  {
    q: 'What is Write to Future Me?',
    a: 'You can write a private letter to your future self and pick a delivery date. When that date arrives, Better Every Day gently delivers your note.'
  }
];

export default function RecordHub({ onNavigateTab }) {
  const {
    userProfile,
    setUserProfile,
    applyParsedVoiceUpdates,
    activeWorkoutMinutes,
    completedWorkouts,
    hydrationMl,
    voiceRecordings,
    addVoiceRecording,
    deleteVoiceRecording,
    journalEntries,
    addJournalEntry,
    deleteJournalEntry,
    discoveredGratitude
  } = useWellness();

  const { playChime } = useAudio();

  // Primary Tab: 'record' (Voice) | 'write' (Journal)
  const [activeMainTab, setActiveMainTab] = useState('record');

  // Recording State: 'ready' | 'recording' | 'processing' | 'review' | 'saved' | 'error'
  const [recordingState, setRecordingState] = useState('ready');
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [extractedItems, setExtractedItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isQaOpen, setIsQaOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Write Tab State
  const [writtenText, setWrittenText] = useState('');
  const [writeTitle, setWriteTitle] = useState('');
  const [isFutureMe, setIsFutureMe] = useState(false);
  const [futureDeliveryDate, setFutureDeliveryDate] = useState(() => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split('T')[0];
  });
  const [writeExtractedItems, setWriteExtractedItems] = useState([]);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [writeSuccessMessage, setWriteSuccessMessage] = useState('');
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false); // Collapsed by default

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const updateMode = userProfile.voiceSettings?.updateMode || 'ask_each_time';

  // Initialize Speech Recognition if supported
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
        if (event.error !== 'no-speech') {
          setErrorMessage('Microphone access was interrupted. You can try speaking again or use one of the presets.');
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (recordingState === 'recording') {
      timerRef.current = setInterval(() => {
        setAudioSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recordingState]);

  const startRecording = () => {
    setTranscript('');
    setErrorMessage('');
    setAudioSeconds(0);
    setRecordingState('recording');
    try { playChime(520); } catch(e) {}

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
  };

  const stopRecording = (textOverride = null) => {
    setRecordingState('processing');
    try { playChime(440); } catch(e) {}

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const textToProcess = (typeof textOverride === 'string' ? textOverride : transcript).trim();

    setTimeout(() => {
      if (!textToProcess) {
        setRecordingState('error');
        setErrorMessage("We didn't catch any audio. Please tap record and speak naturally, or try a preset below.");
        return;
      }

      const parsed = parseNaturalVoiceInput(textToProcess, {
        activeWorkoutMinutes,
        completedWorkouts,
        hydrationMl
      });

      setParsedResult(parsed);
      setExtractedItems(parsed.items || []);
      setTranscript(textToProcess);

      const newRecording = {
        id: 'rec_' + Date.now(),
        timestamp: new Date().toISOString(),
        date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        durationSec: audioSeconds || 12,
        transcript: textToProcess,
        status: updateMode === 'never_update' ? 'archived_only' : 'reviewed',
        itemsExtracted: parsed.items?.length || 0
      };
      if (addVoiceRecording) addVoiceRecording(newRecording);

      if (updateMode === 'always_update' || updateMode === 'automatically_update') {
        const selected = parsed.items.filter(it => it.selected);
        if (selected.length > 0) {
          applyParsedVoiceUpdates(selected);
        }
        setRecordingState('saved');
        try { playChime(660); } catch(e) {}
        try { confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } }); } catch (e) {}
      } else if (updateMode === 'never_update') {
        setRecordingState('saved');
      } else {
        setRecordingState('review');
      }
    }, 800);
  };

  const handleSimulatePreset = (presetQuote) => {
    setTranscript(presetQuote);
    setAudioSeconds(14);
    stopRecording(presetQuote);
  };

  const toggleItemSelection = (id) => {
    setExtractedItems(prev => prev.map(it => it.id === id ? { ...it, selected: !it.selected } : it));
  };

  const removeItem = (id) => {
    setExtractedItems(prev => prev.filter(it => it.id !== id));
  };

  const startEditing = (item) => {
    setEditingItemId(item.id);
    setEditText(item.label);
  };

  const saveEdit = (id) => {
    setExtractedItems(prev => prev.map(it => it.id === id ? { ...it, label: editText } : it));
    setEditingItemId(null);
  };

  const handleApproveAll = () => {
    const selected = extractedItems.filter(it => it.selected);
    if (selected.length > 0) {
      applyParsedVoiceUpdates(selected);
    }
    setRecordingState('saved');
    try { playChime(660); } catch(e) {}
    try { confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
  };

  const handleCancelAndKeepVoiceOnly = () => {
    setRecordingState('saved');
  };

  // --- WRITE / JOURNAL LOGIC ---
  const handleSaveWriteEntry = (e) => {
    e.preventDefault();
    if (!writtenText.trim()) return;

    // Parse explicit mentions
    const parsed = parseNaturalVoiceInput(writtenText, {
      activeWorkoutMinutes,
      completedWorkouts,
      hydrationMl
    });

    const newEntry = {
      id: 'journal_' + Date.now(),
      title: writeTitle.trim() || (isFutureMe ? '💌 Letter to Future Me' : 'Daily Reflection'),
      content: writtenText.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFutureMe,
      futureDeliveryDate: isFutureMe ? futureDeliveryDate : null,
      extractedItems: parsed.items || []
    };

    if (addJournalEntry) addJournalEntry(newEntry);

    if (parsed.items && parsed.items.length > 0) {
      setWriteExtractedItems(parsed.items);
      setIsWriteReviewOpen(true);
    } else {
      setWriteSuccessMessage(isFutureMe ? '💌 Letter to Future Me sealed & scheduled!' : '✓ Reflection saved privately.');
      setTimeout(() => setWriteSuccessMessage(''), 3000);
      setWrittenText('');
      setWriteTitle('');
      setIsFutureMe(false);
      try { confetti({ particleCount: 25, spread: 45, origin: { y: 0.6 } }); } catch (e) {}
    }
  };

  const handleApproveWriteExtraction = () => {
    const selected = writeExtractedItems.filter(it => it.selected !== false);
    if (selected.length > 0) {
      applyParsedVoiceUpdates(selected);
    }
    setIsWriteReviewOpen(false);
    setWriteExtractedItems([]);
    setWriteSuccessMessage('✓ Reflection saved & tracking updated!');
    setTimeout(() => setWriteSuccessMessage(''), 3000);
    setWrittenText('');
    setWriteTitle('');
    setIsFutureMe(false);
    try { confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } }); } catch(e) {}
  };

  const handleExportData = () => {
    const exportBundle = {
      app: 'Better Every Day',
      exportDate: new Date().toISOString(),
      journalEntries: journalEntries || [],
      voiceRecordings: voiceRecordings || [],
      gratitudeNotes: discoveredGratitude || []
    };
    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BetterEveryDay_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      
      {/* 1. HEADER & MAIN MODE SWITCHER */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
              <Sparkles size={12} /> Natural Reflection & Journal
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Tell Me About Your Day 🎙️✍️
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Speak freely or write your thoughts. Better Every Day organizes your wellness moments with care.
          </p>
        </div>

        {/* Primary Toggle: Record (Voice) vs Write (Journal) */}
        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-pill)' }}>
          <button
            onClick={() => setActiveMainTab('record')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.95rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeMainTab === 'record' ? 'var(--bg-secondary)' : 'transparent',
              color: activeMainTab === 'record' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeMainTab === 'record' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Mic size={14} />
            <span>🎙️ Record Voice</span>
          </button>

          <button
            onClick={() => setActiveMainTab('write')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.95rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeMainTab === 'write' ? 'var(--bg-secondary)' : 'transparent',
              color: activeMainTab === 'write' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeMainTab === 'write' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <FileText size={14} />
            <span>✍️ Write Reflection</span>
          </button>
        </div>
      </div>

      {/* 2. MODE A: VOICE RECORDING INTERFACE */}
      {activeMainTab === 'record' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div 
            className="card-glass"
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              background: recordingState === 'recording'
                ? 'radial-gradient(circle, var(--accent-primary-light) 0%, var(--bg-glass-card) 85%)'
                : 'var(--bg-glass-card)',
              border: recordingState === 'recording' ? '2px solid var(--accent-primary)' : '1px solid var(--border-glass)',
              transition: 'all 0.3s ease'
            }}
          >
            {/* STATE 1: READY */}
            {recordingState === 'ready' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <div 
                  onClick={startRecording}
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-calm) 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(45, 106, 79, 0.35)',
                    transition: 'transform 0.2s ease'
                  }}
                  title="Click to begin speaking"
                >
                  <Mic size={40} />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.3rem 0', color: 'var(--text-primary)' }}>
                    Tap to Talk About Your Day
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Speak at your own pace about your morning, meals, steps, energy, or small wins.
                  </p>
                </div>
              </div>
            )}

            {/* STATE 2: RECORDING */}
            {recordingState === 'recording' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <div 
                  onClick={() => stopRecording()}
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    background: 'var(--accent-rose)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 30px rgba(224, 86, 96, 0.45)',
                    animation: 'pulse 1.5s infinite'
                  }}
                  title="Click to finish speaking"
                >
                  <Square size={32} />
                </div>

                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-rose)', fontVariantNumeric: 'tabular-nums' }}>
                    {formatTimer(audioSeconds)}
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Listening... Tap red square when finished.
                  </span>
                </div>

                {transcript && (
                  <div style={{ maxWidth: 540, background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>
                    "{transcript}"
                  </div>
                )}
              </div>
            )}

            {/* STATE 3: PROCESSING */}
            {recordingState === 'processing' && (
              <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Sparkles size={38} color="var(--accent-primary)" style={{ animation: 'spin 2s linear infinite' }} />
                <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Organizing your reflection...</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Extracting explicit wellness mentions privately on-device</p>
              </div>
            )}

            {/* STATE 4: REVIEW EXTRACTED ITEMS */}
            {recordingState === 'review' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <span className="pill-badge primary" style={{ fontSize: '0.7rem' }}>
                    ✨ Extracted for Review
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0.25rem 0 0 0' }}>
                    I found a few things to add to your day:
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {extractedItems.map(item => (
                    <div 
                      key={item.id}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <input
                          type="checkbox"
                          checked={item.selected !== false}
                          onChange={() => toggleItemSelection(item.id)}
                          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                        />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                          {item.label}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        title="Remove item"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button onClick={handleCancelAndKeepVoiceOnly} className="btn btn-secondary">
                    Save Note Only
                  </button>
                  <button onClick={handleApproveAll} className="btn btn-primary" style={{ gap: '0.35rem' }}>
                    <Check size={16} /> Add to My Tracking
                  </button>
                </div>
              </div>
            )}

            {/* STATE 5: SAVED */}
            {recordingState === 'saved' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
                <CheckCircle size={44} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Reflection Saved!</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Your voice note and tracking have been updated privately.
                </p>

                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                  <button onClick={() => setRecordingState('ready')} className="btn btn-primary btn-sm">
                    Record Another
                  </button>
                  <button onClick={() => onNavigateTab && onNavigateTab('HOME')} className="btn btn-secondary btn-sm">
                    View Home
                  </button>
                </div>
              </div>
            )}

            {/* STATE 6: ERROR */}
            {recordingState === 'error' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
                <AlertCircle size={38} color="var(--accent-rose)" />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {errorMessage}
                </p>
                <button onClick={() => setRecordingState('ready')} className="btn btn-primary btn-sm">
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Preset Demonstrations */}
          {recordingState === 'ready' && (
            <div className="card-glass" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Or Try a Natural Voice Simulation
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {VOICE_PRESETS.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSimulatePreset(p.quote)}
                    className="card-interactive"
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {p.icon} {p.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.4 }}>
                      "{p.quote.substring(0, 70)}..."
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 3. MODE B: WRITE / FREE JOURNAL INTERFACE */}
      {activeMainTab === 'write' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <form onSubmit={handleSaveWriteEntry} className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {isFutureMe ? '💌 Letter to Future Me' : 'Daily Free Reflection ✍️'}
              </h3>

              {/* Future Me Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isFutureMe}
                  onChange={e => setIsFutureMe(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', width: 16, height: 16 }}
                />
                <span>Write to Future Me</span>
              </label>
            </div>

            {isFutureMe && (
              <div style={{ background: 'var(--accent-primary-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  <Mail size={16} />
                  <span>Deliver this message on:</span>
                </div>

                <input
                  type="date"
                  value={futureDeliveryDate}
                  onChange={e => setFutureDeliveryDate(e.target.value)}
                  className="input-field"
                  style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                />
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder={isFutureMe ? "Title: A message to my future self..." : "Title: Today's thoughts, venting, goals, or small wins (optional)..."}
                value={writeTitle}
                onChange={e => setWriteTitle(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.9rem', marginBottom: '0.65rem' }}
              />

              <textarea
                rows={6}
                placeholder="Write freely about your day, what happened, how you felt, what you ate, how much water you drank, or your future aspirations..."
                value={writtenText}
                onChange={e => setWrittenText(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.88rem', lineHeight: 1.55 }}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                🔒 Reflections remain private on your device.
              </span>

              <button type="submit" className="btn btn-primary" style={{ gap: '0.35rem', padding: '0.6rem 1.4rem' }}>
                <Send size={15} /> Save & Check Tracking
              </button>
            </div>

            {writeSuccessMessage && (
              <div style={{ background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.84rem' }}>
                {writeSuccessMessage}
              </div>
            )}
          </form>

          {/* Review Box for Write Tab Natural-Language Extraction */}
          {isWriteReviewOpen && writeExtractedItems.length > 0 && (
            <div className="card-glass" style={{ padding: '1.25rem', border: '1.5px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Sparkles size={16} color="var(--accent-primary)" />
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  ✨ I found a few things to add to your day:
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '0.75rem 0' }}>
                {writeExtractedItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    <input
                      type="checkbox"
                      checked={item.selected !== false}
                      onChange={() => setWriteExtractedItems(prev => prev.map(i => i.id === item.id ? { ...i, selected: !i.selected } : i))}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setIsWriteReviewOpen(false)} className="btn btn-secondary btn-sm">
                  Keep Note Only
                </button>
                <button onClick={handleApproveWriteExtraction} className="btn btn-primary btn-sm">
                  <Check size={14} /> Add to My Tracking
                </button>
              </div>
            </div>
          )}

          {/* Collapsible History: Review Previous Entries */}
          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <div
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} color="var(--accent-primary)" />
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Review Previous Entries ({journalEntries?.length || 0})
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                {isHistoryExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {isHistoryExpanded && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {journalEntries && journalEntries.length > 0 ? (
                  journalEntries.map(entry => (
                    <div
                      key={entry.id}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.85rem 1.1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {entry.title || 'Reflection'}
                        </strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {entry.date} {entry.time}
                          </span>
                          <button
                            onClick={() => deleteJournalEntry && deleteJournalEntry(entry.id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                            title="Delete entry"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {entry.content}
                      </p>

                      {entry.futureDeliveryDate && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                          💌 Scheduled delivery: {entry.futureDeliveryDate}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                    No written entries yet. Use the box above to write your first reflection!
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4. FOOTER: EXPORT & FAQ CONTROLS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
        <button
          onClick={handleExportData}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.35rem', fontSize: '0.78rem' }}
        >
          <Download size={13} /> Export Entries & Voice Data
        </button>

        <button
          onClick={() => setIsQaOpen(!isQaOpen)}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.35rem', fontSize: '0.78rem' }}
        >
          <Info size={13} /> {isQaOpen ? 'Hide FAQ' : 'Record & Write FAQ'}
        </button>
      </div>

      {isQaOpen && (
        <div className="card-glass" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {RECORD_QA_LIST.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  {item.q}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
