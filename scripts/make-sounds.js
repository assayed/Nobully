// Generates the game's small sound effects as WAV files (no external assets needed).
// Run: node scripts/make-sounds.js
const fs = require('fs');
const path = require('path');
const RATE = 22050;
const out = path.join(__dirname, '..', 'assets', 'sounds');

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.max(-1, Math.min(1, s)) * 32767 * 0.6, i * 2));
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24); h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}
// notes: [freqHz, durationSec, wave]
function tune(notes, { decay = 6 } = {}) {
  const s = [];
  for (const [f, d, w = 'sine'] of notes) {
    const n = Math.floor(d * RATE);
    for (let i = 0; i < n; i++) {
      const t = i / RATE;
      const env = Math.min(1, i / 200) * Math.exp(-decay * t);
      let v = Math.sin(2 * Math.PI * f * t);
      if (w === 'square') v = Math.sign(v) * 0.5;
      if (w === 'tri') v = (2 / Math.PI) * Math.asin(v);
      s.push(v * env);
    }
  }
  return s;
}
// Soft, cheerful 8-second loop (pentatonic melody over a gentle bass) for the background bed.
function music() {
  const bpm = 120, beat = 60 / bpm, total = 16 * beat;
  const n = Math.floor(total * RATE);
  const s = new Float32Array(n);
  const mel = [523, 659, 784, 659, 880, 784, 659, 587, 523, 587, 659, 784, 659, 587, 523, 392];
  const bass = [131, 131, 175, 175, 196, 196, 131, 131];
  const add = (f, start, dur, amp, shape) => {
    const a = Math.floor(start * RATE), len = Math.floor(dur * RATE);
    for (let i = 0; i < len && a + i < n; i++) {
      const t = i / RATE;
      const env = Math.min(1, i / 110) * Math.min(1, (len - i) / 110) * Math.exp(-2.5 * t);
      let v = Math.sin(2 * Math.PI * f * t);
      if (shape === 'tri') v = (2 / Math.PI) * Math.asin(v);
      s[a + i] += v * env * amp;
    }
  };
  mel.forEach((f, i) => add(f, i * beat, beat * 0.95, 0.28, 'tri'));
  bass.forEach((f, i) => add(f, i * beat * 2, beat * 1.9, 0.22, 'sine'));
  return Array.from(s);
}

const files = {
  'coin.wav': tune([[988, 0.07], [1319, 0.25]], { decay: 9 }),
  'good.wav': tune([[523, 0.1, 'tri'], [659, 0.1, 'tri'], [784, 0.1, 'tri'], [1047, 0.35, 'tri']], { decay: 4 }),
  'wrong.wav': tune([[311, 0.18, 'square'], [233, 0.4, 'square']], { decay: 5 }),
  'tap.wav': tune([[880, 0.06]], { decay: 30 }),
  'music.wav': music(),
  'win.wav': tune([[523, 0.12, 'tri'], [523, 0.12, 'tri'], [784, 0.12, 'tri'], [1047, 0.12, 'tri'], [880, 0.12, 'tri'], [1047, 0.5, 'tri']], { decay: 3 }),
};
for (const [name, s] of Object.entries(files)) fs.writeFileSync(path.join(out, name), wav(s));
console.log('sounds written to', out);
