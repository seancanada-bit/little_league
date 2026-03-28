let audioCtx = null

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

function playTone(frequency, duration, type = 'sine', volume = 0.3) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.value = frequency
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch (e) {
    // Audio not available
  }
}

export const sounds = {
  correct: () => {
    playTone(523, 0.1)
    setTimeout(() => playTone(659, 0.1), 100)
    setTimeout(() => playTone(784, 0.2), 200)
  },
  wrong: () => {
    playTone(300, 0.1, 'sawtooth', 0.2)
    setTimeout(() => playTone(250, 0.2, 'sawtooth', 0.2), 120)
  },
  tap: () => playTone(440, 0.05, 'sine', 0.1),
  swoosh: () => {
    try {
      const ctx = getCtx()
      const bufSize = ctx.sampleRate * 0.15
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize)
      const src = ctx.createBufferSource()
      const gain = ctx.createGain()
      src.buffer = buf
      src.connect(gain)
      gain.connect(ctx.destination)
      gain.gain.value = 0.15
      src.start()
    } catch (e) {
      // Audio not available
    }
  },
  fanfare: () => {
    const notes = [523, 659, 784, 1047]
    notes.forEach((n, i) => setTimeout(() => playTone(n, 0.15, 'square', 0.2), i * 100))
  }
}

// Sound toggle stored in localStorage
export function isSoundOn() {
  return localStorage.getItem('baseball_sound') !== 'off'
}

export function toggleSound() {
  const next = isSoundOn() ? 'off' : 'on'
  localStorage.setItem('baseball_sound', next)
  return next === 'on'
}

export function playSound(name) {
  if (isSoundOn() && sounds[name]) sounds[name]()
}
