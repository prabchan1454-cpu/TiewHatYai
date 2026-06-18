// Synthesised sound effects — no audio assets needed.
// All sounds are generated via Web Audio API at call time.
// Haptic uses navigator.vibrate (Android PWA only; silent on iOS/desktop).

let _ctx = null;
function ctx() {
  if (!_ctx) {
    try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
  }
  // Resume if suspended (browser autoplay policy)
  if (_ctx.state === "suspended") _ctx.resume().catch(() => {});
  return _ctx;
}

function tone(freq, dur = 0.12, type = "sine", vol = 0.22, startAt = 0) {
  const c = ctx();
  if (!c) return;
  try {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    osc.frequency.value = freq;
    const t0 = c.currentTime + startAt;
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.start(t0);
    osc.stop(t0 + dur + 0.01);
  } catch { /* ignore */ }
}

// Short, satisfying "tap" (button presses)
export function sfxTap() {
  navigator.vibrate?.(8);
  tone(480, 0.07, "sine", 0.12);
}

// ★ Stamp collected — rising two-note chime
export function sfxStamp() {
  navigator.vibrate?.([20, 15, 50]);
  tone(880, 0.1,  "sine", 0.22, 0);
  tone(1320, 0.18, "sine", 0.2,  0.09);
}

// ✅ Quest complete — triumphant 4-note arpeggio
export function sfxQuestComplete() {
  navigator.vibrate?.([40, 25, 70, 25, 140]);
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => tone(f, 0.22, "sine", 0.24, i * 0.09));
}

// 👑 Level up — ascending 5-note fanfare
export function sfxLevelUp() {
  navigator.vibrate?.([30, 15, 30, 15, 30, 15, 180]);
  const notes = [523, 659, 784, 1047, 1319];
  notes.forEach((f, i) => tone(f, 0.28, "sine", 0.28, i * 0.1));
}

// ❌ Error / wrong answer
export function sfxError() {
  navigator.vibrate?.([80, 40, 80]);
  tone(220, 0.18, "sawtooth", 0.14);
}

// 🔓 Unlock (legend / reward)
export function sfxUnlock() {
  navigator.vibrate?.([20, 10, 20, 10, 60]);
  tone(660, 0.1,  "sine", 0.2,  0);
  tone(990, 0.12, "sine", 0.18, 0.1);
  tone(1320, 0.2, "sine", 0.16, 0.22);
}
