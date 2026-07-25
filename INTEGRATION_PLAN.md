# TepelniElektrarna Integration Plan

This plan defines the immediate path for understanding, running, and later integrating the TepelniElektrarna External Exhibit Apps.

Installation and display discovery are complete enough for Version 8 work. The source-backed event, topology, state, timer, supplier-mismatch, input-profile, exact control-transition, and API-specialization matrices live in `FRONT_GAME_BEHAVIOR_MAP.md`. Version 8 Tasks 1–2 are complete; Task 3 validated control mappings are ready.

## Terms

- **External Exhibit Apps**: the supplied exhibit-specific application suite under `external_apps/TepelniElektrarna/`.
- **Display App**: a user-facing app for one physical display, such as `screen_oled2`, `screen_6`, or `screen_10`.
- **Exhibit Relay**: the exhibit-specific coordination process in `server/`.
- **Control App Integration Adapter**: a later translation component that maps Control App state/commands to the event contract expected by these apps.

## Constraints

- Do not change supplied Display App or Exhibit Relay source for the first installation pass unless a tiny local-run fix is unavoidable.
- Prefer dev-server validation on Raspberry Pis first, because the immediate goal is display, touch, asset, browser, and WebSocket behavior.
- Defer static build decisions until the apps have been seen on the actual screens.
- Keep hardware protocol details outside the Control App.

## Milestones

### 1. Local Discovery and Runbook

Run TepelniElektrarna locally without Control App.

Deliverables:

- app inventory: relay, front Display Apps, back kiosk Display Apps, assets, docs
- commands for installing dependencies and running apps one by one
- useful local full-stack command set
- local ports, URLs, and expected screens
- known dependency/setup issues
- Raspberry Pi preparation notes: app-to-Pi assignment, Chromium kiosk URLs, startup needs, and open verification items

Expected document:

- `external_apps/TepelniElektrarna/RUNBOOK.md`

Status: prepared.

### 2. Raspberry Pi Display Validation

Run the apps on target Raspberry Pis and attached displays.

Deliverables:

- each app loads in Chromium kiosk mode
- resolution/orientation/touch behavior notes
- audio/video asset behavior notes
- WebSocket relay connectivity notes
- list of display-specific or Pi-specific issues

### 3. Front Game Behavior Map

Understand the front interactive game at a functional level.

Deliverables:

- physical input list: buttons, wheels, and any outputs implied by the app
- Exhibit Relay message catalog used by the front Display Apps
- game-state flow between Display Apps
- questions that require real hardware or supplier clarification

Status: source baseline and Version 8 Task 1 control contract complete; Task 2 typed input translation is implemented and verified.

### 4. Control App Compatibility Assessment

Compare source-confirmed behavior with current Control App capabilities.

Deliverables:

- supported needs already covered by Control App Device Types, Device State, and Commands
- missing event translation
- missing hardware behavior
- required Device Instance naming and Deployment Configuration shape
- fake/mock testability notes

### 5. Adapter Plan

Use the existing separately supervised reusable Control App Integration Adapter.

Approved boundary:

- one shared Exhibit Relay WebSocket for Display Apps and adapter;
- Control App `/ws/state` for hardware snapshots;
- public Control App HTTP API for hardware commands;
- typed Tepelni input translation and profile-owned target mappings;
- no hardware protocol, scene composition, game-state inference, or relay modification in the adapter.

Status: architecture approved; Task 2 typed input translation is complete and Task 3 is ready.

### Version 8 Task 2 implementation record

- Added a separate typed `tepelni_elektrarna` adapter module and simulation-only input profile; no production Device Instance or wiring decision was added.
- Implemented exact numeric start id `1`, string language/energy ids, strict debounced rising-edge presses, and four independent numeric wheels with absolute integer angles and no `step` field.
- Runtime availability is independent per input source and control target after global schema validation. Recovery rebaselines only the affected source; no release, zero, reset, substitute event, or control request is synthesized.
- The profile contains no motor, lighting, scene, Display App, Screen 9, OLED 2 bridge, or production control mapping. Those exclusions remain authoritative.
- Verified 44 Integration Adapter tests and 108 Control App tests on 2026-07-25; the simulation deployment also loads through the real Control App configuration parser.

## Known Risks

- The relay broadcasts parsed JSON to all clients and does not enforce documented message semantics.
- `screen_oled2` source uses numeric button id `1` for start, while docs describe `START`.
- `screen_6` uses `ENERGY_SEND`, which is not fully aligned with the Tepelni API section.
- Documented LED/MOTOR messages are not implemented in inspected source.
- `screen_oled2/bridge.js` forwards serial input only locally and is therefore excluded from production; replacing hard-coded relay URLs remains later implementation work under the approved shared-relay topology.
- Existing `node_modules` can be stale or missing platform optional packages; run `npm install` in each app folder on the target machine.
- Some Vite shims may need executable permission restored after copy/install.

## Version 8 Task 1 Approved Decisions

- Numeric start id `1`, string `ENERGY_SEND`, and numeric wheel ids `1..4` are resolved source facts. Version 8 preserves them because the current Display Apps use strict comparisons.
- `ENERGY_SEND` is part of the source-confirmed event contract. Screen 6 preserves its current unguarded audio/state behavior and adds only explicit motor `stop` plus lighting `sleep`; any future readiness, completion, reset, or timeout game logic belongs to the Display Apps programmer.
- Generic documented `LED` and `MOTOR` messages remain unimplemented and are not adopted. Approved physical choreography uses only the explicit guarded Exhibit Control Requests documented below.
- The complete supplier-prescribed turbine/generator and chamber/flow/progress lighting choreography is approved Version 8 product intent. The implementation contract will express these physical outcomes through explicit guarded requests and Control App-owned capabilities, not the generic documented messages.
- `screen_9` is excluded as a nonexistent product app. It will not be deployed or completed; OLED 4's approved `generation_active_*` request starts the physical progress/final energy-button scene without adding a software readiness state.
- Version 8 will not add a Screen 6 readiness state, physical-completion wait, or 30-second no-send timeout. Any future readiness/timeout game logic belongs to the Display Apps programmer; Control App and the adapter will not infer it.
- The turbine and generator are mechanically coupled on one axis. Version 8 uses one continuous-rotation logical target, `turbine_generator_axis`, and must not create separate turbine and generator motor targets. This mapping does not change Display App game states or events.
- OLED 4 owns the normal-play motor start. Its existing three-second Phase 2 completion callback sends exactly one explicit `turbine_generator_axis` `start` request alongside `VALVE_COMPLETE`; it does not delay or wait for the result. The adapter must not infer motor control from `VALVE_COMPLETE`.
- Screen 6 sends one explicit axis `stop` alongside pressed `ENERGY_SEND`. OLED 4, the only current production runtime `RESET` originator, sends explicit axis `stop` plus scene `sleep` alongside its existing inactivity reset. A future reset originator requires an explicit contract addition; the adapter never infers authority from the event.
- Version 8 defines no independent relay-style/Quido output target for any Tepelni light. Outline, chamber, flow, mirrored, progress-column, and energy-button lighting all belong to the high-level lighting-scene contract, including effects that could appear to be simple on/off outputs.
- The lighting contract has exactly one logical target, `tepelni_lighting`, and one normal Display App action, `activate_scene`, carrying an allowlisted symbolic scene id. Control App owns the scene-controller Device Type, Commands, State, Safety Rules, and runtime; the Driver owns zone mapping and S-Play/DMX translation. Display Apps and adapter must not expose physical zones, addresses, colors, brightness, pattern timing, or protocol payloads.
- Each symbolic scene is a complete declarative outcome, never a cumulative cue or overlay. The adapter, Control App, and Driver do not remember selected fuel or game phase, compose layers, or choose a scene from history.
- Any later Display App that needs to preserve fuel-specific lighting must be changed by the Display Apps programmer to receive/retain that fuel context and explicitly request the correct complete scene. The integration stack must fail validation rather than infer or repair missing game context.
- The strict fuel-qualified families are `combustion_coal|gas|biomass`, `combustion_complete_coal|gas|biomass`, and `generation_active_coal|gas|biomass`. OLED 2 may request the first two families at its existing game-start and success transitions. OLED 4 may request the generation family in its existing three-second completion callback only after Display App code propagates the selected fuel to it. Generic unqualified variants and default-fuel substitution are prohibited.
- The Tepelni scene allowlist is exactly 11 ids: `sleep`, `phase1_ready`, and the nine fuel-qualified ids above. `sleep` is the sole complete standby/reset/shutdown outcome; `phase1_ready` is chamber 2 bright white with every other region at baseline. Screen 6 requests `sleep` on `ENERGY_SEND`, OLED 4 requests it at its reset origin, and OLED 2 requests `phase1_ready` on transitions into `home`. There are no other scene kinds.
- Colors, brightness, pulse rates, patterns, zone/address mapping, and progress duration are commissioned inside controller programs by the lighting programmer. Control App configuration contains only connection/transport settings, symbolic-scene-to-program mappings, command timeout, and safe fallback scene `sleep`. No artistic/timing parameter appears in Display App requests or adapter profiles.
- `activate_scene` has immediate command semantics: success means Control App accepted and started the scene. Device State records the active symbolic scene, but there is no later scene-completed result or `GAME_STATE`, and Display Apps do not wait for physical completion.
- The scene-controller capability and semantics are reusable for JadernaElektrarna. The exhibits use separate logical targets (`tepelni_lighting` and `jaderna_lighting`), Integration Profiles, sender permissions, and scene allowlists even where their physical choreography is similar.
- Jaderna's five existing independently guarded Quido button-lamp targets stay on their Version 7 `set_state` mappings and are excluded from `jaderna_lighting`. The shared capability applies to complex chamber, flow, progress, color, brightness, and pattern scenes.
- Production retains WebSocket communication through one shared Exhibit Relay. OLED 2, OLED 4, Screen 6, and the adapter all use one configurable relay URL; localhost is a development default only. The adapter consumes Control App `/ws/state`, calls the public Control App HTTP API for commands, and returns results through the relay. Display Apps never connect directly to Control App.
- Do not deploy OLED 2's current RS-485/serial and asymmetric local/master bridge, and do not add per-display proxies. Retiring that connection layer must not change game messages, guards, ordering, collaboration, or state machines.
- WebSocket reconnect is transport recovery only: Display Apps retain local state; the adapter reconnects to relay and Control App state; no visitor press, request, `GAME_STATE`, motor/scene command, reset, or phase transition is replayed or synthesized. The existing bounded result outbox may deliver prior correlated results, and absolute inputs rebaseline under the established policy. Missed game-event synchronization belongs to the Display Apps programmer.
- Motor and lighting requests are independent, non-transactional commands with separate correlated results. An unavailable or failed target causes no integration-layer retry, rollback, compensation, inferred command, reset, or progression change. Display Apps keep their existing non-blocking flow; visitor-facing recovery belongs to their programmer, while Control App Safety Rules remain independently authoritative.
- `turbine_generator_axis` requires a positive hardware-commissioned `maximum_continuous_runtime_seconds`; Version 8 provides no default and does not reuse the excluded 30-second game timeout. Expiry and Control App startup/restart stop and verify the motor, update Device State/logs, never auto-resume, and never emit a relay/game/lighting transition.
- At Control App startup and after recovery from unknown controller state, `tepelni_lighting` activates and verifies `sleep` before ready. Controller loss/unknown outcome marks it unavailable; relay or adapter disconnect alone does not trigger fallback. This hardware Safety Rule never emits `GAME_STATE` or changes Display App state.
- After strict static profile validation, runtime availability is per input source and control target. Only an unavailable source is suppressed and individually rebaselined; healthy inputs continue. Unavailable output targets do not block inputs or other targets, and the requested unavailable target receives `target_unavailable`. No substitute input, release, reset, or phase is synthesized.
- Preserve existing reset scope exactly. OLED 2 overload/inactivity returns only itself to `home` and requests `phase1_ready`. OLED 4's existing pre-completion global-reset origin also requests motor `stop` and lighting `sleep`. Screen 6 `ENERGY_SEND` adds those two hardware requests without changing its current state or emitting reset. Reset receivers do not duplicate hardware requests, and no new Screen 6/integration timeout exists.
- Raspberry Pi hosting and kiosk process supervision remain commissioning/deployment work outside Version 8 Task 1.
