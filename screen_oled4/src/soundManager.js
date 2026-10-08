const AC = window.AudioContext || window.webkitAudioContext;
const ctx = new AC();

class Cue {
  constructor(name, { src, loop = false, channel = 'center', volume = 1 }, appId) {
    this.name = name;
    this.src = src;
    this.appId = appId;
    this.audio = new Audio(src);
    this.audio.loop = loop;
    this.audio.preload = 'auto';
    this.loop = loop;
    this.channel = channel;
    this.baseVol = volume;
    this.playing = false;
    this._wired = false;
  }

  _wire() {
    if (this._wired) return;
    const src = ctx.createMediaElementSource(this.audio);
    this.gain = ctx.createGain();
    this.gain.gain.value = this.baseVol;
    const pan = ctx.createStereoPanner();
    pan.pan.value = { left: -1, right: 1, center: 0 }[this.channel] ?? 0;
    src.connect(pan).connect(this.gain).connect(ctx.destination);
    this._wired = true;
  }

  play() {
    // A play during a fade-out cancels it; otherwise the fade's end would silence this play.
    if (this.fadeTimer) this._cancelFade();
    if (this.playing && this.loop) return;
    this._wire();
    this.audio.currentTime = 0;
    const p = this.audio.play();
    if (p && p.catch) {
      p.catch((err) => {
        console.error(`[${this.appId}] play failed for ${this.name} (${this.src}): ${err?.name ?? 'Error'}: ${err?.message ?? String(err)}`);
      });
    }
    this.playing = true;
    if (!this.loop) this.audio.onended = () => { this.playing = false; };
  }

  stop({ fadeMs = 0 } = {}) {
    if (!this.playing) return;
    const finish = () => {
      this.audio.pause();
      this.audio.currentTime = 0;
      if (this.gain) this.gain.gain.value = this.baseVol;
      this.playing = false;
    };
    if (fadeMs > 0 && this.gain) {
      const now = ctx.currentTime;
      this.gain.gain.cancelScheduledValues(now);
      this.gain.gain.setValueAtTime(this.gain.gain.value, now);
      this.gain.gain.linearRampToValueAtTime(0, now + fadeMs / 1000);
      clearTimeout(this.fadeTimer);
      this.fadeTimer = setTimeout(() => { this.fadeTimer = null; finish(); }, fadeMs);
    } else {
      finish();
    }
  }

  _cancelFade() {
    clearTimeout(this.fadeTimer);
    this.fadeTimer = null;
    const now = ctx.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(this.baseVol, now);
  }

  setVolume(v) {
    this.baseVol = v;
    if (this.gain && !this.fadeTimer) this.gain.gain.value = v;
  }
}

export function createSoundManager(cueDefs, appId) {
  const cues = Object.fromEntries(
    Object.entries(cueDefs).map(([n, d]) => [n, new Cue(n, d, appId)])
  );
  const unlock = () => {
    if (ctx.state !== 'suspended') return false;
    const p = ctx.resume();
    if (p && p.catch) {
      p.catch((err) => {
        console.error(`[${appId}] AudioContext.resume failed: ${err?.name ?? 'Error'}: ${err?.message ?? String(err)}`);
      });
    }
    return p;
  };
  return {
    play:    (n)    => cues[n]?.play(),
    stop:    (n, o) => cues[n]?.stop(o),
    stopAll: (o)    => Object.values(cues).forEach(c => c.stop(o)),
    volume:  (n, v) => cues[n]?.setVolume(v),
    unlock,
  };
}
