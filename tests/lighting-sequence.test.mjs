import test from 'node:test';
import assert from 'node:assert/strict';
import { createLightingSequence } from '../shared/lightingSequence.js';

function harness() {
  let now = 0, next = 0;
  const timers = new Map(), sent = [];
  const clock = { setTimeout(fn, ms) { const id = ++next; timers.set(id, { fn, at: now + ms }); return id; }, clearTimeout(id) { timers.delete(id); } };
  const sequence = createLightingSequence((target, action, value) => { const id = String(++next); sent.push({ id, target, action, value, at: now }); return id; }, { clock });
  const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
  return { sent, sequence, async ack() { sequence.result({ type: 'result', name: 'EXHIBIT_CONTROL', request_id: sent.at(-1).id, status: 'accepted' }); await flush(); }, async advance(ms) { now += ms; for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.fn(); } await flush(); } };
}

test('phase 3 is acknowledged animation +3s final +1s energy +2s button', async () => {
  const h = harness();
  const run = h.sequence.run(async ({ play, delay, request }) => {
    await play('game_3_animation'); await delay(3000);
    await play('game_3_final'); await delay(1000);
    await play('energy_progress'); await delay(2000);
    await request('energy_send_button_lamp', 'set_state', true);
  });
  await h.advance(4000); // no result: no later command, even after nominal timer
  assert.equal(h.sent.length, 1);
  await h.ack(); await h.advance(2999); assert.equal(h.sent.length, 1);
  await h.advance(1); await h.ack(); await h.advance(1000); await h.ack(); await h.advance(2000); await h.ack();
  assert.equal(await run, true);
  assert.deepEqual(h.sent.map(x => [x.target, x.at]), [['game_3_animation', 0], ['game_3_final', 7000], ['energy_progress', 8000], ['energy_send_button_lamp', 10000]]);
});

test('reset cancellation suppresses pending timers and late acknowledgements', async () => {
  const h = harness();
  const run = h.sequence.run(async ({ play, delay }) => { await play('steam_red'); await delay(2000); await play('steam_strip'); });
  await h.ack(); h.sequence.cancel(); await h.advance(10000);
  assert.equal(await run, false); assert.equal(h.sent.length, 1);
  const second = h.sequence.run(async ({ play }) => { await play('game_3_animation'); await play('game_3_final'); });
  h.sequence.cancel(); await h.ack();
  assert.equal(await second, false); assert.equal(h.sent.length, 2);
});

// Exercise the actual functions imported by the displays.
import { startCombustion, completeValve, chargeEnergy, sendEnergy } from '../shared/gameLighting.js';
for (const [fuel, target] of [['coal', 'fuel_coal'], ['gas', 'fuel_gas'], ['biomass', 'fuel_biomass']]) {
  test(`${fuel} starts one fuel and phase 1, without writing RGB bottom`, async () => {
    const h = harness();
    const run = h.sequence.run(sequence => startCombustion(sequence, fuel));
    assert.equal(h.sent[0].target, target);
    await h.ack(); await h.ack();
    assert.equal(await run, true);
    assert.deepEqual(h.sent.map(x => x.target), [target, 'game_1_animation']);
  });
}
test('valve waits for motor acceptance before publishing completion and steam', async () => {
  const h = harness(); let complete = false;
  const run = h.sequence.run(sequence => completeValve(sequence, () => { complete = true; }));
  await h.ack(); await h.advance(2999); assert.equal(h.sent.length, 1);
  await h.advance(1); assert.equal(h.sent.at(-1).target, 'turbine_generator_axis');
  await h.advance(5000); assert.equal(complete, false);
  await h.ack(); assert.equal(complete, true); assert.equal(h.sent.at(-1).target, 'steam_red');
  await h.ack(); await h.advance(1999); assert.equal(h.sent.at(-1).target, 'steam_red');
  await h.advance(1); assert.equal(h.sent.at(-1).target, 'steam_strip'); await h.ack();
  assert.equal(await run, true);
});
test('real charging sequence enables button only after 3+1+2 seconds and acknowledgement', async () => {
  const h = harness(); let ready = false;
  const run = h.sequence.run(sequence => chargeEnergy(sequence, () => { ready = true; }));
  for (let i = 0; i < 4; i++) await h.ack();
  await h.advance(3000); await h.ack(); await h.advance(1000); await h.ack();
  await h.advance(1999); assert.equal(ready, false);
  await h.advance(1); assert.equal(ready, false); await h.ack();
  assert.equal(await run, true); assert.equal(ready, true);
  assert.deepEqual(h.sent.filter(x => x.action === 'trigger').map(x => [x.target, x.at]),
    [['game_3_animation', 0], ['game_3_final', 3000], ['energy_progress', 4000]]);
});
test('energy send retains lights and motor until reset six seconds after dispatch', async () => {
  const h = harness(); let reset = false;
  const run = h.sequence.run(sequence => sendEnergy(sequence, () => { reset = true; }));
  await h.ack(); await h.ack(); await h.advance(5999); assert.equal(reset, false);
  await h.advance(1); assert.equal(await run, true); assert.equal(reset, true);
  assert.deepEqual(h.sent.map(x => [x.target, x.action, x.value]),
    [['energy_send_button_lamp', 'set_state', false], ['energy_progress', 'trigger', 'send']]);
});
test('motor rejection prevents both steam and next phase', async () => {
  const h = harness(); let complete = false;
  const run = h.sequence.run(sequence => completeValve(sequence, () => { complete = true; }));
  await h.ack(); await h.advance(3000);
  h.sequence.result({ type: 'result', name: 'EXHIBIT_CONTROL', request_id: h.sent.at(-1).id, status: 'rejected', code: 'target_unavailable' });
  assert.equal(await run, false); assert.equal(complete, false); assert.equal(h.sent.length, 2);
});
