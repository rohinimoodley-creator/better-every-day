/**
 * Better Every Day — Built-in Dance Party Music Engine
 * Zero-dependency Web Audio API synthesizer that generates an upbeat, joyful,
 * catchy dance groove tailored dynamically to any duration (5s, 10s, 15s, 30s, or custom).
 */

class DanceMusicEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.activeNodes = [];
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Starts synthesizing the upbeat Dance Party track.
   * @param {number} durationSec - Total dance duration in seconds (e.g. 5, 10, 15, 22, 30)
   * @param {function} onEnded - Callback when the music finishes naturally
   */
  start(durationSec = 15, onEnded = null) {
    this.stop();
    this.init();

    if (!this.audioCtx) {
      if (onEnded) setTimeout(onEnded, durationSec * 1000);
      return;
    }

    this.isPlaying = true;
    const ctx = this.audioCtx;
    const startTime = ctx.currentTime + 0.05;
    const tempo = 128; // BPM
    const beatDuration = 60 / tempo; // ~0.46875s per beat
    const sixteenth = beatDuration / 4;
    const totalBeats = Math.floor(durationSec / beatDuration);

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, startTime);
    // Smooth fade out at the very end
    masterGain.gain.setValueAtTime(0.7, startTime + Math.max(0, durationSec - 0.5));
    masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + durationSec);
    masterGain.connect(ctx.destination);
    this.activeNodes.push(masterGain);

    // Chords progression: C maj -> G maj -> A min -> F maj
    const chordFrequencies = [
      [261.63, 329.63, 392.00], // C4, E4, G4
      [196.00, 246.94, 293.66], // G3, B3, D4
      [220.00, 261.63, 329.63], // A3, C4, E4
      [174.61, 220.00, 261.63]  // F3, A3, C4
    ];

    // Bass notes corresponding to chords
    const bassFrequencies = [65.41, 49.00, 55.00, 43.65]; // C2, G1, A1, F1

    // Lead Melody notes (Pentatonic joy)
    const melodyNotes = [
      523.25, 587.33, 659.25, 783.99, 880.00, 1046.50
    ];

    // Schedule all beats
    for (let beat = 0; beat < totalBeats; beat++) {
      const beatTime = startTime + beat * beatDuration;
      const bar = Math.floor(beat / 4);
      const chordIdx = bar % 4;

      // 1. Kick Drum (on every beat 1, 2, 3, 4)
      this.playKick(ctx, masterGain, beatTime);

      // 2. Snare / Clap (on beats 2 and 4)
      if (beat % 2 === 1) {
        this.playSnare(ctx, masterGain, beatTime);
      }

      // 3. Hi-Hats (16th notes with groove)
      for (let s = 0; s < 4; s++) {
        const hatTime = beatTime + s * sixteenth;
        const isAccent = (s === 2); // Off-beat open/accent hat
        this.playHiHat(ctx, masterGain, hatTime, isAccent);
      }

      // 4. Bassline (Syncopated upbeat funk)
      const bassFreq = bassFrequencies[chordIdx];
      this.playBass(ctx, masterGain, beatTime, bassFreq, 0.2);
      this.playBass(ctx, masterGain, beatTime + beatDuration * 0.5, bassFreq * 1.5, 0.15);

      // 5. Synth Chord Stabs (on off-beats 2 & 4)
      if (beat % 2 === 1) {
        const chord = chordFrequencies[chordIdx];
        this.playChord(ctx, masterGain, beatTime + sixteenth * 2, chord, 0.18);
      }

      // 6. Arpeggiated Melody
      const melodyFreq = melodyNotes[(beat * 3 + (bar % 2)) % melodyNotes.length];
      this.playMelody(ctx, masterGain, beatTime + sixteenth, melodyFreq, 0.15);
    }

    // Outro crescendo chime at final second
    const outroTime = startTime + Math.max(0, durationSec - 1.2);
    this.playOutroChime(ctx, masterGain, outroTime);

    // Timeout to trigger onEnded callback
    this.timerId = setTimeout(() => {
      this.stop();
      if (onEnded) onEnded();
    }, durationSec * 1000);
  }

  playKick(ctx, dest, time) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.2);
    this.activeNodes.push(osc, gain);
  }

  playSnare(ctx, dest, time) {
    // Noise buffer for snare snap
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(time);
    noise.stop(time + 0.16);
    this.activeNodes.push(noise, filter, gain);
  }

  playHiHat(ctx, dest, time, isAccent = false) {
    const bufferSize = ctx.sampleRate * (isAccent ? 0.08 : 0.04);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 8500;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(isAccent ? 0.3 : 0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (isAccent ? 0.07 : 0.035));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(time);
    noise.stop(time + 0.09);
    this.activeNodes.push(noise, filter, gain);
  }

  playBass(ctx, dest, time, freq, duration) {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);
    filter.frequency.exponentialRampToValueAtTime(120, time + duration);

    gain.gain.setValueAtTime(0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + duration);
    this.activeNodes.push(osc, filter, gain);
  }

  playChord(ctx, dest, time, chordFreqs, duration) {
    chordFreqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(time);
      osc.stop(time + duration);
      this.activeNodes.push(osc, gain);
    });
  }

  playMelody(ctx, dest, time, freq, duration) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + duration);
    this.activeNodes.push(osc, gain);
  }

  playOutroChime(ctx, dest, time) {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const noteTime = time + idx * 0.15;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.28, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(noteTime);
      osc.stop(noteTime + 0.65);
      this.activeNodes.push(osc, gain);
    });
  }

  /**
   * Previews a quick 2-second snippet of the dance beat.
   */
  preview() {
    this.start(2.5);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    try {
      this.activeNodes.forEach(node => {
        if (node.stop) {
          try { node.stop(); } catch {}
        }
        if (node.disconnect) {
          try { node.disconnect(); } catch {}
        }
      });
    } catch {}
    this.activeNodes = [];
  }
}

export const danceMusic = new DanceMusicEngine();
