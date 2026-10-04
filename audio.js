import { state, DOM } from './state.js';

let audioCtx = null;
let micAnalyser = null;
let micFilterNode = null;
let micAnimFrame = null;

export function getAudioContext() {
  if (!audioCtx) {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioClass();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

export function playSound(type) {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "match") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now); osc.stop(now + 0.35);
    } else if (type === "message") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now); osc.stop(now + 0.15);
    } else if (type === "leave") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now); osc.stop(now + 0.25);
    }
  } catch (e) {
    console.warn("Audio exception:", e);
  }
}

export function setupMicVisualizer(stream) {
  try {
    const ctx = getAudioContext();
    const source = ctx.createMediaStreamSource(stream);
    micAnalyser = ctx.createAnalyser();
    micAnalyser.fftSize = 64;

    micFilterNode = ctx.createBiquadFilter();
    applyVoiceFilter(DOM.voiceFxSelect ? DOM.voiceFxSelect.value : "normal");

    source.connect(micFilterNode);
    micFilterNode.connect(micAnalyser);

    const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);

    function checkLevel() {
      if (!state.localStream || state.micMuted) {
        DOM.localPipCard.classList.remove("speaking");
        micAnimFrame = requestAnimationFrame(checkLevel);
        return;
      }
      micAnalyser.getByteFrequencyData(dataArray);
      let sum = dataArray.reduce((acc, v) => acc + v, 0);
      let avg = sum / dataArray.length;

      if (avg > 25) DOM.localPipCard.classList.add("speaking");
      else DOM.localPipCard.classList.remove("speaking");

      micAnimFrame = requestAnimationFrame(checkLevel);
    }
    if (micAnimFrame) cancelAnimationFrame(micAnimFrame);
    checkLevel();
  } catch (e) {
    console.warn("Mic visualizer skipped:", e);
  }
}

export function applyVoiceFilter(mode) {
  if (!micFilterNode) return;
  const ctx = getAudioContext();
  if (mode === "deep") {
    micFilterNode.type = "lowpass";
    micFilterNode.frequency.setValueAtTime(380, ctx.currentTime);
  } else if (mode === "telephone") {
    micFilterNode.type = "bandpass";
    micFilterNode.frequency.setValueAtTime(1400, ctx.currentTime);
  } else {
    micFilterNode.type = "allpass";
  }
}
