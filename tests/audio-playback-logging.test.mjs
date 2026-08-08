import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apps = ['screen_oled2', 'screen_oled4', 'screen_6'];
let importNumber = 0;

class FakeAudio {
  static playResult = () => Promise.resolve();

  constructor(src) {
    this.src = src;
    this.paused = true;
    this.loop = false;
    this.preload = '';
    this.currentTime = 0;
  }

  play() {
    this.paused = false;
    return FakeAudio.playResult();
  }

  pause() {
    this.paused = true;
  }
}

class FakeAudioContext {
  static state = 'running';
  static resumeResult = () => Promise.resolve();

  constructor() {
    this.state = FakeAudioContext.state;
    this.currentTime = 0;
    this.destination = {};
  }

  createMediaElementSource() {
    return { connect: () => ({ connect: () => ({ connect: () => ({}) }) }) };
  }

  createGain() {
    return {
      gain: {
        value: 1,
        cancelScheduledValues() {},
        setValueAtTime() {},
        linearRampToValueAtTime() {},
      },
      connect: () => ({}),
    };
  }

  createStereoPanner() {
    return { pan: { value: 0 }, connect: () => ({}) };
  }

  resume() {
    return FakeAudioContext.resumeResult();
  }
}

async function importSoundManager(app) {
  globalThis.window = { AudioContext: FakeAudioContext };
  globalThis.Audio = FakeAudio;
  const file = path.join(repository, app, 'src', 'soundManager.js');
  return import(`${pathToFileURL(file).href}?test=${importNumber++}`);
}

async function assertNoUnhandledRejection(action) {
  let rejection;
  const listener = (reason) => { rejection = reason; };
  process.once('unhandledRejection', listener);
  await action();
  await new Promise((resolve) => setImmediate(resolve));
  process.removeListener('unhandledRejection', listener);
  assert.equal(rejection, undefined);
}

for (const app of apps) {
  test(`${app} logs rejected cue playback without an unhandled rejection`, async () => {
    const originalAudio = globalThis.Audio;
    const originalWindow = globalThis.window;
    const originalError = console.error;
    const errors = [];
    const failure = Object.assign(new Error('autoplay blocked'), { name: 'NotAllowedError' });
    FakeAudio.playResult = () => Promise.reject(failure);
    FakeAudioContext.state = 'running';
    console.error = (...args) => errors.push(args.join(' '));

    try {
      const { createSoundManager } = await importSoundManager(app);
      const sound = createSoundManager({ AUDIO_TEST: { src: '/a/AUDIO_TEST.mp3' } }, app);
      await assertNoUnhandledRejection(async () => {
        sound.play('AUDIO_TEST');
      });
      assert.deepEqual(errors.filter((entry) => entry.startsWith('[')), [
        `[${app}] play failed for AUDIO_TEST (/a/AUDIO_TEST.mp3): NotAllowedError: autoplay blocked`,
      ]);
    } finally {
      globalThis.Audio = originalAudio;
      globalThis.window = originalWindow;
      console.error = originalError;
    }
  });

  test(`${app} logs rejected AudioContext.resume without an unhandled rejection`, async () => {
    const originalAudio = globalThis.Audio;
    const originalWindow = globalThis.window;
    const originalError = console.error;
    const errors = [];
    const failure = Object.assign(new Error('unlock blocked'), { name: 'InvalidStateError' });
    FakeAudio.playResult = () => Promise.resolve();
    FakeAudioContext.state = 'suspended';
    FakeAudioContext.resumeResult = () => Promise.reject(failure);
    console.error = (...args) => errors.push(args.join(' '));

    try {
      const { createSoundManager } = await importSoundManager(app);
      const sound = createSoundManager({}, app);
      await assertNoUnhandledRejection(async () => {
        sound.unlock();
      });
      assert.deepEqual(errors, [
        `[${app}] AudioContext.resume failed: InvalidStateError: unlock blocked`,
      ]);
    } finally {
      globalThis.Audio = originalAudio;
      globalThis.window = originalWindow;
      console.error = originalError;
    }
  });

  test(`${app} keeps successful cue playback and context unlock silent`, async () => {
    const originalAudio = globalThis.Audio;
    const originalWindow = globalThis.window;
    const originalError = console.error;
    const errors = [];
    FakeAudio.playResult = () => Promise.resolve();
    FakeAudioContext.state = 'suspended';
    FakeAudioContext.resumeResult = () => Promise.resolve();
    console.error = (...args) => errors.push(args.join(' '));

    try {
      const { createSoundManager } = await importSoundManager(app);
      const sound = createSoundManager({ AUDIO_TEST: { src: '/a/AUDIO_TEST.mp3' } }, app);
      sound.play('AUDIO_TEST');
      sound.unlock();
      await new Promise((resolve) => setImmediate(resolve));
      assert.deepEqual(errors, []);
    } finally {
      globalThis.Audio = originalAudio;
      globalThis.window = originalWindow;
      console.error = originalError;
    }
  });
}
