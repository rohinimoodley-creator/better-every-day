import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext(null);

export const SOUNDSCAPES_LIBRARY = [
  { id: 'rain', name: 'Gentle Rain', icon: '🌧️', desc: 'Soft drops falling on green leaves', color: '#3a86c8' },
  { id: 'ocean', name: 'Ocean Swell', icon: '🌊', desc: 'Slow rhythmic tidal breathing', color: '#2a9d8f' },
  { id: 'forest', name: 'Forest Peace (528Hz)', icon: '🌲', desc: 'Harmonic frequency for calm & clarity', color: '#40916c' },
  { id: 'wind', name: 'Mountain Breeze', icon: '🍃', desc: 'Gentle rustling wind through pine trees', color: '#52b788' },
  { id: 'brownNoise', name: 'Deep Brown Noise', icon: '📻', desc: 'Heavy soothing low-pass focus blanket', color: '#d97736' },
  { id: 'whiteNoise', name: 'Soft White Noise', icon: '💨', desc: 'Even, crisp ambient static for masking distraction', color: '#8d99ae' },
  { id: 'fireplace', name: 'Cozy Fireplace', icon: '🪵', desc: 'Warm gentle crackle and soft flame warmth', color: '#e76f51' },
  { id: 'gentleAmbience', name: 'Warm Sunset Drone', icon: '✨', desc: 'Subtle ambient pads for writing & reflection', color: '#8b5cf6' },
  { id: 'sleepDrone', name: 'Theta Sleep Wave (432Hz)', icon: '🌙', desc: 'Binaural delta/theta state relaxation', color: '#7b61ff' }
];

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSoundId, setActiveSoundId] = useState(null);
  const [activeTracks, setActiveTracks] = useState({});
  const [volumes, setVolumes] = useState({
    rain: 0.5,
    ocean: 0.5,
    forest: 0.45,
    wind: 0.45,
    brownNoise: 0.5,
    whiteNoise: 0.35,
    fireplace: 0.5,
    gentleAmbience: 0.45,
    sleepDrone: 0.4
  });
  const [selectedTimerMinutes, setSelectedTimerMinutes] = useState(null); // null = endless
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState(null);

  const audioCtxRef = useRef(null);
  const trackNodesRef = useRef({});
  const timerIntervalRef = useRef(null);

  // Initialize Web Audio Context on user gesture
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Generate White / Pink / Brown Noise Buffer
  const createNoiseBuffer = (ctx, type = 'brown') => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'brown') {
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain compensation
      } else if (type === 'pink') {
        data[i] = (lastOut + (0.05 * white)) / 1.05;
        lastOut = data[i];
        data[i] *= 2.5;
      } else if (type === 'fireplace') {
        // Crackle impulse
        const isCrackle = Math.random() < 0.003;
        data[i] = isCrackle ? (Math.random() * 2 - 1) * 2.8 : (lastOut + (0.02 * white)) / 1.04 * 0.4;
        lastOut = data[i];
      } else {
        data[i] = white * 0.25;
      }
    }
    return buffer;
  };

  // Start a synthesized sound track
  const startTrack = (trackId) => {
    const ctx = getAudioContext();
    if (trackNodesRef.current[trackId]) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volumes[trackId] || 0.5, ctx.currentTime);

    if (trackId === 'brownNoise') {
      const buffer = createNoiseBuffer(ctx, 'brown');
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 380;

      source.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);
      source.start();

      trackNodesRef.current[trackId] = { source, gainNode: masterGain };

    } else if (trackId === 'whiteNoise') {
      const buffer = createNoiseBuffer(ctx, 'white');
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 4000;

      source.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);
      source.start();

      trackNodesRef.current[trackId] = { source, gainNode: masterGain };

    } else if (trackId === 'fireplace') {
      const buffer = createNoiseBuffer(ctx, 'fireplace');
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      source.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);
      source.start();

      trackNodesRef.current[trackId] = { source, gainNode: masterGain };

    } else if (trackId === 'rain') {
      const buffer = createNoiseBuffer(ctx, 'pink');
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 0.9;

      source.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);
      source.start();

      trackNodesRef.current[trackId] = { source, gainNode: masterGain };

    } else if (trackId === 'wind') {
      const buffer = createNoiseBuffer(ctx, 'pink');
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 450;
      filter.Q.value = 2.0;

      // Gentle LFO for wind gusting
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.15;
      lfoGain.gain.value = 200;

      lfo.connect(filter.frequency);
      lfo.start();

      source.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);
      source.start();

      trackNodesRef.current[trackId] = { source, lfo, gainNode: masterGain };

    } else if (trackId === 'ocean') {
      const buffer = createNoiseBuffer(ctx, 'pink');
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;

      // LFO for wave swelling
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.12; // 1 wave every ~8s
      lfoGain.gain.value = 250;

      lfo.connect(filter.frequency);
      lfo.start();

      source.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);
      source.start();

      trackNodesRef.current[trackId] = { source, lfo, gainNode: masterGain };

    } else if (trackId === 'forest') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.value = 528; // Solfeggio frequency
      osc2.frequency.value = 264;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      trackNodesRef.current[trackId] = { osc1, osc2, gainNode: masterGain };

    } else if (trackId === 'gentleAmbience') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc3.type = 'triangle';
      osc1.frequency.value = 196; // G3
      osc2.frequency.value = 293.66; // D4
      osc3.frequency.value = 392; // G4

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 480;

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc3.start();

      trackNodesRef.current[trackId] = { osc1, osc2, osc3, gainNode: masterGain };

    } else if (trackId === 'sleepDrone') {
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const merger = ctx.createChannelMerger(2);

      oscL.type = 'sine';
      oscR.type = 'sine';
      oscL.frequency.value = 216; // 432 / 2
      oscR.frequency.value = 220; // 4Hz binaural beat

      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);
      merger.connect(masterGain);
      masterGain.connect(ctx.destination);

      oscL.start();
      oscR.start();

      trackNodesRef.current[trackId] = { oscL, oscR, gainNode: masterGain };
    }
  };

  // Stop a synthesized sound track
  const stopTrack = (trackId) => {
    const nodes = trackNodesRef.current[trackId];
    if (!nodes) return;

    if (nodes.gainNode && audioCtxRef.current) {
      nodes.gainNode.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.05);
    }

    setTimeout(() => {
      if (nodes.source) { try { nodes.source.stop(); } catch(e) {} }
      if (nodes.lfo) { try { nodes.lfo.stop(); } catch(e) {} }
      if (nodes.osc1) { try { nodes.osc1.stop(); } catch(e) {} }
      if (nodes.osc2) { try { nodes.osc2.stop(); } catch(e) {} }
      if (nodes.osc3) { try { nodes.osc3.stop(); } catch(e) {} }
      if (nodes.oscL) { try { nodes.oscL.stop(); } catch(e) {} }
      if (nodes.oscR) { try { nodes.oscR.stop(); } catch(e) {} }
      delete trackNodesRef.current[trackId];
    }, 100);
  };

  // ONE SOUND AT A TIME: Play a single sound with optional timer
  const playSingleSound = (soundId, durationMinutes = null) => {
    // 1. Stop any currently playing sound
    Object.keys(trackNodesRef.current).forEach(id => {
      stopTrack(id);
    });
    setActiveTracks({});

    // 2. Start the new sound
    startTrack(soundId);
    setActiveSoundId(soundId);
    setActiveTracks({ [soundId]: true });
    setIsPlaying(true);

    // 3. Setup Timer
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    if (durationMinutes && durationMinutes > 0) {
      setSelectedTimerMinutes(durationMinutes);
      setTimerSecondsRemaining(durationMinutes * 60);

      timerIntervalRef.current = setInterval(() => {
        setTimerSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            stopAll();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Play endlessly
      setSelectedTimerMinutes(null);
      setTimerSecondsRemaining(null);
    }
  };

  // Stop everything
  const stopAll = () => {
    Object.keys(trackNodesRef.current).forEach(id => {
      stopTrack(id);
    });
    setActiveTracks({});
    setActiveSoundId(null);
    setIsPlaying(false);
    setSelectedTimerMinutes(null);
    setTimerSecondsRemaining(null);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  // Toggle single sound on/off
  const toggleSingleSound = (soundId, timerMinutes = null) => {
    if (activeSoundId === soundId && isPlaying) {
      stopAll();
    } else {
      playSingleSound(soundId, timerMinutes !== undefined ? timerMinutes : selectedTimerMinutes);
    }
  };

  // Set Volume
  const setTrackVolume = (trackId, volumeVal) => {
    setVolumes(prev => ({ ...prev, [trackId]: volumeVal }));
    const node = trackNodesRef.current[trackId];
    if (node && node.gainNode && audioCtxRef.current) {
      node.gainNode.gain.setValueAtTime(volumeVal, audioCtxRef.current.currentTime);
    }
  };

  // Soft bell chime for milestones
  const playChime = (freq = 528) => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch(e) {}
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const activeSoundObj = SOUNDSCAPES_LIBRARY.find(s => s.id === activeSoundId) || null;

  return (
    <AudioContext.Provider value={{
      isPlaying,
      activeSoundId,
      activeSoundObj,
      activeTracks,
      volumes,
      soundLibrary: SOUNDSCAPES_LIBRARY,
      playSingleSound,
      toggleSingleSound,
      stopAll,
      setTrackVolume,
      playChime,
      selectedTimerMinutes,
      setSelectedTimerMinutes,
      timerSecondsRemaining
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}

