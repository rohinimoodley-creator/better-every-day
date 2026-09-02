import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTracks, setActiveTracks] = useState({
    rain: false,
    ocean: false,
    brownNoise: false,
    forest: false,
    sleepDrone: false
  });
  const [volumes, setVolumes] = useState({
    rain: 0.5,
    ocean: 0.5,
    brownNoise: 0.5,
    forest: 0.4,
    sleepDrone: 0.3
  });
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(null);
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
      } else {
        data[i] = white * 0.2;
      }
    }
    return buffer;
  };

  // Start a synthesized sound track
  const startTrack = (trackId) => {
    const ctx = getAudioContext();
    if (trackNodesRef.current[trackId]) return; // already playing

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volumes[trackId] || 0.5, ctx.currentTime);

    if (trackId === 'brownNoise') {
      const buffer = createNoiseBuffer(ctx, 'brown');
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

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
      filter.Q.value = 1.0;

      source.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);
      source.start();

      trackNodesRef.current[trackId] = { source, gainNode: masterGain };

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
      lfo.frequency.value = 0.12; // 1 wave every 8 seconds
      lfoGain.gain.value = 250;

      lfo.connect(filter.frequency);
      lfo.start();

      source.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);
      source.start();

      trackNodesRef.current[trackId] = { source, lfo, gainNode: masterGain };

    } else if (trackId === 'forest') {
      // Harmonic gentle sine texture
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.value = 528; // Solfeggio frequency for transformation & peace
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

    } else if (trackId === 'sleepDrone') {
      // 432 Hz Theta Binaural Drone
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const merger = ctx.createChannelMerger(2);

      oscL.type = 'sine';
      oscR.type = 'sine';
      oscL.frequency.value = 216; // 432 / 2
      oscR.frequency.value = 220; // 4Hz theta wave beat

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
      if (nodes.oscL) { try { nodes.oscL.stop(); } catch(e) {} }
      if (nodes.oscR) { try { nodes.oscR.stop(); } catch(e) {} }
      delete trackNodesRef.current[trackId];
    }, 100);
  };

  // Toggle Track on/off
  const toggleTrack = (trackId) => {
    setActiveTracks(prev => {
      const nextState = !prev[trackId];
      if (nextState) {
        startTrack(trackId);
        setIsPlaying(true);
      } else {
        stopTrack(trackId);
        // Check if any other track is still active
        const anyActive = Object.entries(prev).some(([k, v]) => k !== trackId && v);
        if (!anyActive) setIsPlaying(false);
      }
      return { ...prev, [trackId]: nextState };
    });
  };

  // Change Volume of Track
  const setTrackVolume = (trackId, volumeVal) => {
    setVolumes(prev => ({ ...prev, [trackId]: volumeVal }));
    const node = trackNodesRef.current[trackId];
    if (node && node.gainNode && audioCtxRef.current) {
      node.gainNode.gain.setValueAtTime(volumeVal, audioCtxRef.current.currentTime);
    }
  };

  // Play a soft bell chime for breathing / milestone
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

  // Master Stop
  const stopAll = () => {
    Object.keys(activeTracks).forEach(trackId => {
      stopTrack(trackId);
    });
    setActiveTracks({
      rain: false,
      ocean: false,
      brownNoise: false,
      forest: false,
      sleepDrone: false
    });
    setIsPlaying(false);
    setSleepTimerMinutes(null);
    setTimerSecondsRemaining(null);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  // Sleep Timer Countdown
  const startSleepTimer = (minutes) => {
    setSleepTimerMinutes(minutes);
    setTimerSecondsRemaining(minutes * 60);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

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
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <AudioContext.Provider value={{
      isPlaying,
      activeTracks,
      volumes,
      toggleTrack,
      setTrackVolume,
      stopAll,
      playChime,
      sleepTimerMinutes,
      timerSecondsRemaining,
      startSleepTimer
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
