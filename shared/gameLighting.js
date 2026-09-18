// Presentation sequences shared by the three front displays. Each await is a
// correlated local-dispatch result; S-Play does not report physical playback.
export const fuelPrograms = { coal: 'fuel_coal', gas: 'fuel_gas', biomass: 'fuel_biomass' };
export async function startCombustion(sequence, fuel) {
  const program = fuelPrograms[fuel];
  if (!program) throw new Error(`Unknown fuel: ${fuel}`);
  await sequence.play(program);
  await sequence.play('game_1_animation');
}
export async function startValve({ request, play }) {
  await request('lightbox_2', 'set_intensity', { intensity: 100 });
  await play('game_2_animation');
}
export async function completeValve({ play, request, delay, check }, publishComplete) {
  await play('game_2_final');
  await delay(3000);
  await request('turbine_generator_axis', 'start', { direction: 'ccw', rpm: 60 });
  check();
  publishComplete();
  await play('steam_red');
  await delay(2000);
  await play('steam_strip');
}
export async function chargeEnergy({ request, play, delay, check }, ready) {
  await request('energy_send_button_lamp', 'set_state', false);
  await request('lightbox_3', 'set_intensity', { intensity: 100 });
  await request('lightbox_4', 'set_intensity', { intensity: 100 });
  await play('game_3_animation');
  await delay(3000);
  await play('game_3_final');
  await delay(1000);
  await play('energy_progress');
  await delay(2000);
  await request('energy_send_button_lamp', 'set_state', true);
  check();
  ready();
}
export async function sendEnergy({ request, delay, check }, reset, resetDelayMs = 6000) {
  await request('energy_send_button_lamp', 'set_state', false);
  await request('energy_progress', 'trigger', 'send');
  await delay(resetDelayMs);
  check();
  reset();
}
