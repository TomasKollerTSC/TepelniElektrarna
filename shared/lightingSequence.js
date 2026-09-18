// Display-owned presentation timing. Results confirm local dispatch, not physical playback.
export function createLightingSequence(send, { timeoutMs = 35000, clock = globalThis } = {}) {
  let generation = 0;
  const pending = new Map();
  const waits = new Map();
  const abort = () => new Error('lighting sequence cancelled');
  const cancel = () => {
    generation += 1;
    for (const { reject, timer } of pending.values()) { clock.clearTimeout(timer); reject(abort()); }
    pending.clear();
    for (const [timer, reject] of waits) { clock.clearTimeout(timer); reject(abort()); }
    waits.clear();
  };
  const result = (message) => {
    const entry = pending.get(message.request_id);
    if (!entry || message.name !== 'EXHIBIT_CONTROL' || message.type !== 'result') return;
    clock.clearTimeout(entry.timer);
    pending.delete(message.request_id);
    if (message.status === 'accepted' || message.status === 'completed') entry.resolve(message);
    else entry.reject(new Error(`Lighting request ${message.status}: ${message.code}`));
  };
  const run = async (work) => {
    cancel();
    const ownGeneration = generation;
    const check = () => { if (ownGeneration !== generation) throw abort(); };
    const request = (target, action, value) => {
      check();
      return new Promise((resolve, reject) => {
        const id = send(target, action, value);
        if (!id) { reject(new Error('relay unavailable')); return; }
        const timer = clock.setTimeout(() => { pending.delete(id); reject(new Error('lighting result timeout')); }, timeoutMs);
        pending.set(id, { resolve, reject, timer });
      });
    };
    const delay = (ms) => {
      check();
      return new Promise((resolve, reject) => {
        const timer = clock.setTimeout(() => { waits.delete(timer); resolve(); }, ms);
        waits.set(timer, reject);
      });
    };
    try {
      await work({ request, play: (target) => request(target, 'trigger', 'play'), delay, check });
      check();
      return true;
    } catch (error) {
      if (ownGeneration === generation) console.error('[lighting] sequence failed', error);
      return false;
    }
  };
  return { run, result, cancel };
}
