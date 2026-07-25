# TepelniElektrarna Front Game Contract Map

This document is the source-backed behavior and contract record for Version 8 Task 1. It covers the current TepelniElektrarna Display Apps, Exhibit Relay, OLED 2 relay/serial process, embedded keyboard emulators, supplier documents, and the Control App integration boundary. It records current behavior separately from product decisions so implementation does not silently choose between source and supplier intent.

Production code is outside this task. The approved event and control matrices will be completed here and in `../../docs/control-app-plan-version-8.md` as the decision interview proceeds.

Version 8 Task 2 was completed on 2026-07-25. The typed adapter now implements only the approved input matrix: five buttons, four independent absolute wheels, and per-source runtime recovery. Control mappings and Display App changes remain later tasks.

## Evidence And Authority

Evidence inspected on 2026-07-24:

- current runtime source in `server/`, `screen_oled2/`, `screen_oled4/`, `screen_6/`, `screen_9/`, and the five rear Display Apps;
- the embedded keyboard simulators in the three front gameplay Display Apps;
- `ApiDoc.pdf`, `TepelnaElektrarna.pdf`, and `zvuky.pdf`, visually checked as the primary supplier documents;
- `../EN_API_DOKUMENTACE.md`, `../API_IMPLEMENTATION_AUDIT.md`, and `../API_CALL_BRIEF.md`;
- Control App API Contract Version 1 and the reusable top-level `IntegrationAdapter/` implementation and tests.

The current External Exhibit Apps source remains authoritative when it conflicts with supplier documentation. Supplier-only behavior is a candidate product requirement, not an existing event. A missing required physical action must be added later as a strictly guarded Exhibit Control Request owned by the responsible Display App; `GAME_STATE` remains diagnostic and never implicitly commands hardware.

## 1. Actor And Topology Inventory

| Actor | Current role | Actual network behavior | Contract consequence |
| --- | --- | --- | --- |
| `server/` | Exhibit Relay and `/status` endpoint | Parses arbitrary JSON and broadcasts it to every connected client, including the sender. It does not route or validate by `type:name`. Client ids come from `x-client-id` only when a caller supplies that header. | The Integration Adapter must validate messages and mappings itself. |
| `screen_oled2/src/App.jsx` | Phase 1 combustion Display App | Connects only to `ws://localhost:8765`; consumes local/upstream events and emits `COMBUSTION_COMPLETE`. | Its working start id is numeric `1`; wheel ids are numeric `1..3`. |
| `screen_oled2/bridge.js` | OLED 2 local WebSocket/serial process | Opens a local WebSocket server on `8765`, connects to `MASTER_WS_URL`, forwards all master messages to local React clients, forwards only React-origin `trigger:GAME_STATE` upstream, and forwards serial input only to local React clients. | It is not a transparent relay. Physical OLED 2 inputs do not reach the master Exhibit Relay. It also directly owns RS-485 hardware, conflicting with the approved Control App-exclusive hardware boundary. |
| `screen_oled4/src/App.jsx` | Phase 2 valve Display App | Connects only to `ws://localhost:8765`; consumes `COMBUSTION_COMPLETE` and wheel `4`; emits `VALVE_COMPLETE` or inactivity `RESET`. | Deployment must provide a relay/proxy at localhost or co-locate this app with the master relay. No such proxy is supplied here. |
| `screen_6/src/App.jsx` | Phase 3 cooling Display App | Connects only to `ws://localhost:8765`; wakes on `VALVE_COMPLETE`; consumes `ENERGY_SEND` only to play audio. | Current source has no Phase 3 ready state, completion transition, inactivity timer, or automatic reset. |
| `screen_9/src/App.jsx` | Non-product stub; excluded from Version 8 | Opens one WebSocket and logs messages. Its `phase` and `energyReady` state never change. Its reconnect creates a socket without restoring handlers. | Do not deploy, complete, integrate, or assign contract ownership to Screen 9. The supplier-required physical progress behavior must be owned elsewhere. |
| `screen_2R`, `4R`, `7R`, `8R`, `10` | Independent rear information Display Apps | No WebSocket connection. Language is local UI state. Each returns to sleep after 120 seconds. | They are outside the front Exhibit Event Contract unless product scope explicitly changes. |

There is no separate Tepelni hardware emulator application. OLED 2, OLED 4, and Screen 6 contain development keyboard handlers that emit the same JSON messages through their current WebSocket; these are test shortcuts, not physical production senders.

## 2. Exact Current Exhibit Event Matrix

All current gameplay messages use `type: "trigger"`. The Exhibit Relay accepts other JSON, but no current Display App gives it semantics.

| Event | Exact current shape | Source sender | Runtime consumer and guard | Contract status |
| --- | --- | --- | --- | --- |
| Start press | `{ "type":"trigger", "name":"BUTTON", "id":1, "data":{"pressed":true} }` | OLED 2 keyboard emulator; supplier serial example | OLED 2 only when `screen === "home"` | Source-authoritative input. Numeric `1` must be preserved; string `"START"` fails the strict source check. |
| Czech language | `BUTTON`, id `"LANG_CZ"`, `pressed:true` | OLED 2 and OLED 4 keyboard emulators | OLED 2, OLED 4, Screen 6 in every state | Source-authoritative input. |
| English language | `BUTTON`, id `"LANG_EN"`, `pressed:true` | OLED 2 and OLED 4 keyboard emulators | OLED 2, OLED 4, Screen 6 in every state | Source-authoritative input. |
| German language | `BUTTON`, id `"LANG_DE"`, `pressed:true` | OLED 2 and OLED 4 keyboard emulators | OLED 2, OLED 4, Screen 6 in every state | Source-authoritative input. |
| Energy send press | `{ "type":"trigger", "name":"BUTTON", "id":"ENERGY_SEND", "data":{"pressed":true} }` | Screen 6 keyboard emulator | Screen 6 in every state: preserve audio and send one explicit `turbine_generator_axis` `stop` request | Source-authoritative id and shape. Version 8 adds no readiness guard, state transition, or inferred adapter command. |
| Combustion wheels | `{ "type":"trigger", "name":"WHEEL", "id":1..3, "data":{"angle":0..359} }` | OLED 2 keyboard emulator and supplier serial source; keyboard also adds optional `step:-1|1` | OLED 2: any wheel wakes `sleep -> home`; wheel `1` selects fuel in `home`; all three adjust gauges in `game` | Source-authoritative numeric ids and absolute angle. Production translation does not require `step`; source derives direction from `angle` when it is absent. |
| Valve wheel | `{ "type":"trigger", "name":"WHEEL", "id":4, "data":{"angle":0..359} }` | OLED 4 keyboard emulator | OLED 4 only advances while `active`; strict numeric id; only clockwise delta greater than 5 degrees counts | Source-authoritative numeric id and absolute angle. |
| Phase 1 complete | `{ "type":"trigger", "name":"GAME_STATE", "id":1, "data":{"state":"COMBUSTION_COMPLETE"} }` | OLED 2 after all gauges remain green for five seconds; development shortcut in OLED 4 | OLED 4 resets and enters `active` | Existing progression event; diagnostic only to the adapter. |
| Phase 2 complete | `{ "type":"trigger", "name":"GAME_STATE", "id":1, "data":{"state":"VALVE_COMPLETE"} }` | OLED 4 three seconds after reaching step 15; Screen 6 development shortcut | Screen 6 enters `active` | Existing progression event; diagnostic only to the adapter. |
| Global reset | `{ "type":"trigger", "name":"GAME_STATE", "id":1, "data":{"state":"RESET"} }` | OLED 4 after active pre-completion inactivity; Screen 6 development shortcut | OLED 2 -> `sleep`; OLED 4 -> `sleep`; Screen 6 -> `sleep` | OLED 4's production origin also sends explicit axis `stop` and scene `sleep`; the reset event remains diagnostic only to the adapter. The Screen 6 shortcut is not production authority. |

The supplier API's generic `trigger:LED` and `trigger:MOTOR` messages have no sender or consumer in current Tepelni runtime source. They are not part of the current Exhibit Event Contract. The source-only `ENERGY_SEND` id is part of the current contract despite its omission from the Tepelni API section.

### Sender/consumer matrix

| Message | Relay interprets | OLED 2 consumes | OLED 2 emits | OLED 4 consumes | OLED 4 emits | Screen 6 consumes | Screen 6 emits | Screen 9 semantics |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `BUTTON 1` | No | `home` only | Keyboard only | No | No | No | No | Log only |
| `BUTTON LANG_*` | No | All states | Keyboard only | All states | Keyboard only | All states | No | Log only |
| `BUTTON ENERGY_SEND` | No | No | No | No | No | Audio in any state | Keyboard only | Log only |
| `WHEEL 1..3` | No | State-specific | Keyboard only | No | No | No | No | Log only |
| `WHEEL 4` | No | Rejected by id range | No | `active` progression | Keyboard only | No | No | Log only |
| `GAME_STATE COMBUSTION_COMPLETE` | No | No | Success | Activates/reset progress | Shortcut only | No | No | Log only |
| `GAME_STATE VALVE_COMPLETE` | No | No | No | No | Completion timer | Activates | Shortcut only | Log only |
| `GAME_STATE RESET` | No | Resets to sleep | No | Resets to sleep | Inactivity | Resets to sleep | Shortcut only | Log only |

## 3. Current Front State And Timer Matrix

### OLED 2: combustion

| Current state/condition | Accepted event or timer | Resulting state/effect | Emitted event |
| --- | --- | --- | --- |
| Initial `sleep` | Any valid wheel id `1..3` | Stores that wheel's current angle and enters `home` | None |
| `home` | Wheel `1` movement | Changes fuel after 18 accepted directional samples; wheels `2` and `3` do not select fuel | None |
| `home` | Numeric `BUTTON id:1`, `pressed:true` | Resets gauges/timers and enters `game`; starts 12-point decay every two seconds | None |
| Any state | `BUTTON LANG_*`, `pressed:true` | Updates local language | None |
| `game` | Wheel `1..3` | Updates activity, hides intro, and adjusts one gauge. Fuel never decreases; air and exhaust may move both ways. | None |
| `game` | All three gauges remain in green `61..120` for five seconds | Stops decay and enters `success` | `COMBUSTION_COMPLETE` |
| `game` | Any gauge remains red above `120` | At five seconds shows overload; at ten seconds stops, clears all gauges, and schedules `home` after three seconds | None |
| `game` | No wheel activity for more than 30 seconds; checked every five seconds | Returns locally to `home` | None |
| Any state | `GAME_STATE RESET` | Stops decay, restores Czech-default game values except current language, and enters `sleep` | None |

OLED 2 has no home/success-to-sleep timer and no global reset on local inactivity or overload failure. Its source decay is fixed at 12 points every two seconds, unlike the supplier text's fuel-dependent `X` description. The source returns from overload to `home` after three seconds, while the supplier document describes a longer warning/failure/animation sequence.

### OLED 4: valve/turbine prompt

| Current state/condition | Accepted event or timer | Resulting state/effect | Emitted event |
| --- | --- | --- | --- |
| Initial `sleep` or any state | `COMBUSTION_COMPLETE` | Enters `active`, resets step to `0`, starts audio/video, and resets wheel baseline | None |
| `active`, step `<15` | Numeric wheel `4` clockwise delta `>5` | Increments one step, capped at 15 | None |
| Step first reaches `15` | Immediate effects plus two separate three-second timers | Switches video/audio; after three seconds shows turbine message | After three seconds, one explicit `turbine_generator_axis` `start` request alongside `VALVE_COMPLETE` |
| `active`, step `<15` | No accepted wheel progress for more than 20 seconds; checked every three seconds | Returns to `sleep`, resets local state | `RESET` |
| Step `15` complete | Inactivity | Inactivity reset is disabled | None |
| Any state | `GAME_STATE RESET` | Returns to `sleep` and resets local state | None |

There is no supplier-described three-second gate before the first valve movement. Counter-clockwise movement never reduces the step. The source does not emit motor or lighting requests when Phase 2 completes.

### Screen 6: cooling/energy audio

| Current state/condition | Accepted event | Resulting state/effect | Emitted event |
| --- | --- | --- | --- |
| Initial `sleep` or any state | `VALVE_COMPLETE` | Enters `active`; plays Phase 3 audio | None |
| Any state | `BUTTON ENERGY_SEND`, `pressed:true` | Plays `AUDIO_7` only | None |
| Any state | `GAME_STATE RESET` | Enters `sleep` and stops audio | None |

There is no readiness guard, third-phase progress, 30-second energy-send timeout, success state, or runtime-emitted reset.

### Screen 9 and rear Display Apps

- Screen 9 has no implemented state transitions despite local `phase` and `energyReady` variables. Product direction confirms that this app is effectively nonexistent and must be skipped in Version 8.
- Each rear Display App is independent and uses local touch/keyboard language selection.
- Rear inactivity is 120 seconds in source, not the supplier's 180 seconds. No rear app consumes `BUTTON LANG_*` despite the API document claiming synchronization.

## 4. OLED 2 Relay/Serial Topology

The current `bridge.js` data paths are asymmetric:

| Origin | Destination | Forwarded messages |
| --- | --- | --- |
| OLED 2 React client | Master Exhibit Relay | Only `type:trigger`, `name:GAME_STATE` |
| Master Exhibit Relay | OLED 2 React client | Every valid JSON message |
| Serial RS-485 | OLED 2 React client | Every parsed object with truthy `type` and `name` |
| Serial RS-485 | Master Exhibit Relay | None |

Consequences:

- a Control App Integration Adapter attached to the master relay can send inputs to OLED 2 through the local process;
- serial wheel/button events cannot be observed by other master clients or the adapter;
- keeping the serial reader as production hardware owner would violate the Control App-exclusive hardware decision;
- OLED 4 and Screen 6 also hard-code localhost but have no equivalent supplied local relay proxy, so source alone did not establish deployment topology; the approved topology below resolves it;
- no message replay or current-state synchronization occurs after any connection is re-established.

### Approved production topology

One shared Exhibit Relay is the bidirectional WebSocket hub for OLED 2, OLED 4, Screen 6, and the Integration Adapter. Every client uses one configurable relay WebSocket URL; `ws://localhost:8765` is only the local-development default. There are no per-display relay proxies.

The adapter consumes Control App hardware state through `/ws/state`, publishes translated inputs through the relay WebSocket, receives explicit Display App control requests through that relay, calls only the public Control App HTTP command API, and publishes correlated results back through the relay WebSocket. Display Apps do not connect directly to Control App, and Control App does not consume the exhibit game protocol.

The existing OLED 2 Node process is excluded from production deployment. Its RS-485/serial ownership and asymmetric local/master forwarding are retired rather than made authoritative. This connection-only change must not alter Display App event names, payloads, guards, ordering, collaboration, or state machines.

### Approved reconnect behavior

Display Apps preserve local state and reconnect to the shared relay; the adapter independently reconnects to the relay and Control App `/ws/state`. No integration component replays or synthesizes visitor presses, control requests, `GAME_STATE`, scenes, motor commands, resets, or phase transitions.

The adapter may drain its existing bounded correlated-result outbox after relay recovery; request-id deduplication prevents repeated hardware execution. On Control App state recovery, transient inputs are suppressed until release and a new press, while each absolute encoder publishes its current stable angle once. Any game resynchronization required because a Display App missed a relay event belongs to the Display Apps programmer.

### Approved unavailable-target and partial-failure behavior

Each control request has one independent correlated result; simultaneous motor and lighting requests are not transactional. Unavailable, rejected, failed, and unknown outcomes use the established stable result contract and structured request context.

The adapter and Control App never retry, compensate, roll back another successful command, emit `RESET`, choose a replacement scene, or alter Display App progression. Display Apps continue their existing non-blocking transitions and log/observe the result; any later visitor-facing recovery belongs to their programmer.

If the turbine-generator starts but `generation_active_*` fails, explicit stop paths and the independent motor Safety Rule remain authoritative. If lighting starts but the motor fails, lighting remains at its requested complete scene until another explicit scene request or its own Safety Rule changes it. No integration layer derives one hardware command from the other command's outcome.

### Continuous-motor safety contract

`turbine_generator_axis` requires a positive commissioned `maximum_continuous_runtime_seconds`; production readiness and motor start are refused if it is missing or invalid. Version 8 supplies no default because this is a hardware commissioning limit, not the excluded 30-second Display App game timeout.

On expiry, Control App stops the motor, records a safety fault in Device State, and logs the target, elapsed runtime, configured limit, and stop outcome. On Control App startup/restart it stops and verifies the axis before reporting it ready and never resumes last-known rotation. These safety actions emit no relay event/result without an originating request, lighting command, `GAME_STATE`, or Display App transition. Established per-motor stop and bus emergency-stop behavior remains available in degraded states.

### Scene-controller startup and fallback safety contract

At Control App startup, `tepelni_lighting` activates and verifies `sleep` before reporting ready. Communication loss or an unknown physical command outcome marks the scene state unknown/unavailable with error context. After controller recovery from unknown state, Control App again activates and verifies `sleep` before ready; it never resumes the last requested scene.

Relay or adapter disconnection alone does not invoke fallback because controller state remains known. Fallback is hardware-local: it emits no relay result without an originating request, `GAME_STATE RESET`, or Display App transition.

### Per-source and per-target runtime availability

Static profile/API/schema incompatibility still prevents adapter readiness. Once the snapshot shape is valid, each input source and control target has independent online/stale availability. An offline or stale Device Instance degrades diagnostics but does not silence unrelated healthy sources or targets.

The adapter suppresses only the unavailable input's events and emits no release, zero, substitute, reset, or phase. On recovery, only that source rebaselines: buttons wait for release/new press and an absolute encoder emits its stable angle once. An unavailable motor/lighting target never blocks input translation, and an unavailable input never blocks a request to a different ready target. The specifically requested unavailable target is rejected with `target_unavailable`.

### Final local/global reset matrix

| Existing Display App owner and path | Existing game behavior preserved | Explicit Version 8 hardware request(s) |
| --- | --- | --- |
| OLED 2 overload or inactivity returns to `home` | Only OLED 2 returns to fuel selection; no global `RESET` | OLED 2 requests `tepelni_lighting activate_scene phase1_ready` only. |
| OLED 4 pre-completion inactivity | OLED 4 emits its existing global `GAME_STATE RESET`; all receivers perform their current local reset | The reset originator requests `turbine_generator_axis stop` and `tepelni_lighting activate_scene sleep` before/alongside `RESET`. |
| Screen 6 handles pressed `ENERGY_SEND` | Preserve current audio and state behavior; emit no new `GAME_STATE`, success, readiness, or reset | Screen 6 requests `turbine_generator_axis stop` and `tepelni_lighting activate_scene sleep`. |
| Any Display App receives `GAME_STATE RESET` | Perform only its existing local reset behavior | No duplicate hardware request from a receiver. |

Screen 6 gains no timeout. Neither the adapter nor Control App derives a game reset/transition from a timer, command result, connection state, or observed event.

## 5. Supplier-Only Physical Behavior Inventory

The supplier behavior PDF describes these effects, none of which currently has a guarded runtime request. Product direction confirms that the complete supplier-prescribed physical choreography is current Version 8 intent, including the turbine/generator and chamber/flow/progress lighting. This adopts the physical outcomes, not the stale generic `trigger:LED` or `trigger:MOTOR` wire messages.

| Supplier transition | Supplier physical effect | Current source owner/evidence | Existing Control App compatibility |
| --- | --- | --- | --- |
| Exhibit power-on/sleep | Outline lights on; chamber 2/4/7/8 low illumination | No source message | Part of the high-level lighting-scene contract; no independent binary output is allowed. |
| First wheel wakes OLED 2 | Chamber 2 brighter/white | OLED 2 has exact `sleep -> home` transition | Part of the high-level lighting-scene contract; no independent binary output is allowed. |
| Fuel chosen/game begins | Chamber 2 fuel-colored split strip | OLED 2 owns fuel selection and exact `home -> game` transition | Requires an explicit scene/value contract and a lighting Driver/runtime/API; current API v1 has no such capability. |
| Phase 1 complete | Chamber 4 white; lower progress region solid yellow | OLED 2 owns exact success transition | Entire outcome belongs to the high-level lighting-scene contract; do not split simple portions into Quido targets. |
| Phase 2 complete | Start the mechanically coupled turbine-generator axis; chamber 7/8 strips on; red/blue pulsing flow strips; rear 6R mirror; begin the physical Phase 3 progress sequence | OLED 4 owns the exact three-second completion callback and sends one explicit start request alongside `VALVE_COMPLETE` | One continuous-rotation target, `turbine_generator_axis`, fits current API v1. The adapter forwards the explicit request and never infers it from `VALVE_COMPLETE`. Complex lighting/progress needs a new Control App-owned capability. |
| Phase 3 physical progress finishes after an unspecified `x` seconds | Finish green progress column; illuminate the energy-send button | No current Display App readiness state; Screen 9 is excluded | The high-level physical scene may include the final lamp effect and run autonomously. Version 8 does not add a Display App readiness state or wait. Scene timing is a commissioned Control App/Driver parameter. |
| Energy sent | Play local audio; stop ambient/turbine audio; turn off/reset physical effects; front returns to sleep/initial states | Screen 6 preserves its current unguarded audio handling and explicitly requests axis `stop` plus scene `sleep` | Both requests have immediate independent results. Version 8 adds no readiness, state, or reset guard. |
| No energy send within 30 seconds after ready | Clear lights; OLED 2 returns to `home`; other front apps sleep | No source timer or ready state | Explicitly excluded from Version 8 Control App work. Any future readiness/timeout game behavior belongs to the Display Apps programmer; adapter and Control App never infer it. |
| Front inactivity/failure/reset | Stop continuous hardware and restore safe/baseline lighting | Only OLED 4 pre-completion inactivity emits runtime global `RESET`; it explicitly requests axis stop and scene sleep | The adapter never infers hardware from `RESET`. A future production reset originator requires a contract change. A commissioned Control App Safety Rule independently bounds motion. |

### Fuel-qualified complete scene requests

The supplier requires the selected fuel-colored strip to remain present through later phases. Complete scenes therefore carry the fuel explicitly; lower layers never reconstruct it from history.

| Existing owner and transition | Allowed complete scene id | Required context behavior |
| --- | --- | --- |
| OLED 2 accepts `home -> game` | `combustion_coal`, `combustion_gas`, or `combustion_biomass` | OLED 2 uses its current selected fuel and emits one matching request. |
| OLED 2 completes five seconds with all gauges green | `combustion_complete_coal`, `combustion_complete_gas`, or `combustion_complete_biomass` | OLED 2 uses the same selected fuel and emits one matching request alongside its existing success behavior. |
| OLED 4's existing three-second Phase 2 completion callback | `generation_active_coal`, `generation_active_gas`, or `generation_active_biomass` | The Display Apps programmer must first propagate selected fuel to OLED 4. OLED 4 then emits the matching request alongside motor start and `VALVE_COMPLETE`. |

Generic `combustion`, `combustion_complete`, and `generation_active` scene ids are invalid. OLED 2 is allowlisted only for the Phase 1 variants and OLED 4 only for the generation variants. The adapter rejects missing, unknown, sender-disallowed, or unqualified scene ids and never chooses a default fuel.

### Complete 11-scene allowlist

| Scene id(s) | Complete commissioned outcome | Explicit request owner and existing guard |
| --- | --- | --- |
| `sleep` | Outline lights on; chambers 2, 4, 7, and 8 at low baseline illumination; fuel, flow, progress, completion, and energy-button effects off | Screen 6 alongside pressed `ENERGY_SEND`; OLED 4 alongside its existing production inactivity `RESET`; Control App startup/fallback Safety Rule. |
| `phase1_ready` | Chamber 2 bright white for fuel selection; every other region at the `sleep` baseline | OLED 2 on first-wheel `sleep -> home` and when existing overload/inactivity recovery returns locally to `home`. |
| `combustion_coal` | Complete Phase 1 active outcome with coal's commissioned orange/red split fuel strip and in-progress lighting | OLED 2 on accepted `home -> game` with coal selected. |
| `combustion_gas` | Complete Phase 1 active outcome with gas's commissioned blue/orange split fuel strip and in-progress lighting | OLED 2 on accepted `home -> game` with gas selected. |
| `combustion_biomass` | Complete Phase 1 active outcome with biomass's commissioned yellow/orange split fuel strip and in-progress lighting | OLED 2 on accepted `home -> game` with biomass selected. |
| `combustion_complete_coal`, `combustion_complete_gas`, `combustion_complete_biomass` | Matching fuel effect retained; chamber 4 bright white; Phase 1 progress region solid yellow; remaining regions at baseline | OLED 2 at its existing five-second all-green success transition. |
| `generation_active_coal`, `generation_active_gas`, `generation_active_biomass` | Matching fuel effect retained; Phase 1/2 completion lighting; chambers 7/8 lit; red and blue pulsing front flow with rear 6R mirror; autonomous Phase 3 round/green progress ending with energy-button illumination | OLED 4 in its existing three-second Phase 2 completion callback after Display App fuel propagation, alongside motor start and `VALVE_COMPLETE`. |

This table is exhaustive. There is no separate `shutdown`, `reset`, `energy_sent`, generic phase, zone, overlay, or delta scene. Screen 6 and OLED 4 have the exact `sleep` permissions above; a future reset originator requires a contract change. The adapter never translates `ENERGY_SEND` or `GAME_STATE RESET` into lighting control.

### Lighting commissioning boundary

The lighting programmer owns colors, brightness, pulse rates, pattern details, physical zone/address mapping, and Phase 3 progress duration inside the commissioned lighting-controller programs. These values never appear in Display App requests, adapter profiles, or the public command payload.

Control App Deployment Configuration contains only controller connection/transport settings, an explicit mapping from each of the 11 symbolic scene ids to one commissioned controller program id, a command timeout, and `sleep` as the safe fallback scene. The Driver implements the controller protocol and invokes the configured program; it does not hard-code artistic values or exhibit progression. The reusable fake validates command, state, timeout, and failure behavior without attempting visual fidelity.

The generic supplier `LED` schema is also incomplete for these physical effects: target wiring, scene ownership, exact colors, pattern timing, brightness, physical progress duration, and safe reset scene are not commissioned facts. The adapter must not speak S-Play/DMX or implement those protocols. Each approved symbolic scene must describe a complete physical outcome, not a cumulative cue. The adapter, Control App, and Driver may not reconstruct fuel or phase from previously requested scenes; missing later fuel context must be fixed by the Display Apps programmer.

## 6. Source-Confirmed Input Profile Inventory

These mappings are implementation-ready facts for Task 2 once Task 1 closes:

| Logical input | Source Device Type | Relay event | Value policy | Baseline/reconnect policy |
| --- | --- | --- | --- | --- |
| Start button | Quido input | `BUTTON`, numeric id `1`, `pressed:true` | Debounced rising edge | Active initial baseline is suppressed until release and a new press. Never replay. |
| Language buttons | Three Quido inputs | `BUTTON LANG_CZ|LANG_EN|LANG_DE` | Independent debounced rising edges | Same transient policy. |
| Energy-send button | Quido input | `BUTTON ENERGY_SEND` | Debounced rising edge; Display App owns its phase/readiness guard | Same transient policy. |
| Combustion wheels | Three encoder Device Instances | Numeric `WHEEL` ids `1`, `2`, `3`, integer `angle` in `0..359` | Absolute angle; preserve wraparound; omit emulator-only `step` | Re-establish baseline and emit current stable absolute angle once after usable recovery. |
| Valve wheel | One encoder Device Instance | Numeric `WHEEL` id `4`, integer `angle` in `0..359` | Absolute angle; source requires clockwise delta `>5` to progress | Same absolute-control policy. |

The current reusable adapter supports all transient button behavior but only one configured wheel and hard-codes Jaderna's ids and target set. Task 2 needs a typed `tepelni_elektrarna` module and four-wheel profile shape; it does not need a new Control App Device Type or API version.

## 7. Current Control Capability Boundary

| Candidate target kind | Existing reusable path | Result lifecycle | Task 1 implication |
| --- | --- | --- | --- |
| One mechanically coupled turbine-generator axis | `EXHIBIT_CONTROL start|stop` -> API v1 motor rotation endpoint | Immediate result only | Reusable as the single target `turbine_generator_axis`; OLED 4 explicitly starts at Phase 2 completion and stops at its reset origin, while Screen 6 explicitly stops on `ENERGY_SEND`. No observed event grants permission. |
| Independent boolean lamp/output | Existing `EXHIBIT_CONTROL set_state` path exists generally | Immediate result only | Explicitly excluded for Tepelni Version 8. All documented lighting, including the energy-button lamp, belongs to the scene capability; no Quido target may be invented. |
| Positioned motion | `set_position`/service `home` -> API v1 lift endpoints | Immediate plus terminal result | No Tepelni positioned motion is source- or supplier-confirmed. Do not inherit Jaderna rod targets. |
| Complete colored/dimmed/patterned lighting scene | One new logical target, `tepelni_lighting`, with action `activate_scene` and an allowlisted complete symbolic scene id | Immediate result when Control App accepts and starts the scene; no terminal completion result | Control App owns a reusable game-stateless scene-controller capability; its Driver maps the requested complete scene to commissioned S-Play/DMX behavior. No lower layer composes cues or recovers fuel/phase from history. Device State records the active scene. |

The reusable request/result envelope, stable codes, process-local idempotency, relay result outbox, command outcome policy, and diagnostics are reused. The exact lighting specialization follows; Task 3 may not invent a different action, value type, endpoint, result code, or Device State.

### Exact scene-controller public API specialization

| Contract element | Approved Version 8 shape |
| --- | --- |
| Control App Device Type | `scene_controller` (backward-compatible API Contract Version 1 addition) |
| Public command | `POST /api/scene-controllers/{device_id}/scenes/activate` |
| Strict HTTP body | `{ "scene": "<symbolic_scene_id>" }` |
| Success | `{ "ok":true, "outcome":"activated", "state":<SceneControllerDeviceState> }` |
| Device State | Standard identity/connection/stale/error fields plus `scene_status: unknown|activating|active|error` and nullable `active_scene`; included in device APIs and `/ws/state` |
| Exhibit Control action/value | `action:"activate_scene"` with required strict, non-empty string `value`; no other action accepts a string |
| Accepted result | Immediate-only `status:"accepted"`, `code:"scene_activated"`, echoing the exact string value |
| Unusable target | `rejected/target_unavailable`; no Control App command attempted |
| Mapping | One logical target -> one `scene_controller` Device Instance -> one public API command; no fan-out or composition |

Example Display App request:

```json
{
  "type": "request",
  "name": "EXHIBIT_CONTROL",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "sender": "screen_oled2",
  "target": "tepelni_lighting",
  "action": "activate_scene",
  "value": "combustion_coal"
}
```

The existing strict envelope, canonical request fingerprint, 4,096-record/10-minute process-local deduplication, result outbox, and stable rejection/failure codes remain unchanged. The value/result union expands only to include strict strings for `activate_scene` and the result code set expands only with `scene_activated`.

### Complete control sender/transition matrix

| Existing owner and source guard | Explicit independent request(s) | Immediate result |
| --- | --- | --- |
| OLED 2 first wheel causes `sleep -> home` | `tepelni_lighting activate_scene phase1_ready` | `accepted/scene_activated` or established rejection/failure |
| OLED 2 overload/inactivity returns locally to `home` | `tepelni_lighting activate_scene phase1_ready` | Same; no global reset |
| OLED 2 accepts `home -> game` | One fuel-matching `combustion_*` scene | Same |
| OLED 2 completes five seconds all-green | One fuel-matching `combustion_complete_*` scene alongside existing success/`COMBUSTION_COMPLETE` | Same; game event is not a command |
| OLED 4 existing three-second Phase 2 completion callback | `turbine_generator_axis start` and one fuel-matching `generation_active_*`, each with its own UUID, alongside `VALVE_COMPLETE` | `accepted/started` and `accepted/scene_activated` independently |
| OLED 4 existing pre-completion inactivity reset origin | `turbine_generator_axis stop` and `tepelni_lighting activate_scene sleep`, each with its own UUID, before/alongside `RESET` | `accepted/stopped` and `accepted/scene_activated` independently |
| Screen 6 handles pressed `ENERGY_SEND` | `turbine_generator_axis stop` and `tepelni_lighting activate_scene sleep`, each with its own UUID | Same; no Screen 6 state/reset change |
| Any Display App merely receives `RESET` | No request | Receivers perform only existing local game reset |
| Page load, socket/process reconnect, observed `GAME_STATE`, result, or elapsed time | No request | No replay/inference; hardware Safety Rules are separate |

Exact profile permissions: OLED 2 may activate `phase1_ready`, the three `combustion_*`, and the three `combustion_complete_*` scenes. OLED 4 may `start|stop` the axis and activate the three `generation_active_*` scenes plus `sleep`. Screen 6 may only `stop` the axis and activate `sleep`. No other sender/target/action/value combination is permitted.

## 8. Resolved Product Decisions

- The complete supplier-prescribed turbine/generator and chamber/flow/progress lighting choreography is current Version 8 product intent.
- Version 8 adopts those physical outcomes through explicit, guarded Exhibit Control Requests. It does not revive or depend on the undocumented generic `trigger:LED` and `trigger:MOTOR` messages.
- `screen_9` is not a real product Display App. Version 8 skips it entirely: no deployment, event translation, state-machine completion, acceptance browser, or control ownership.
- Skipping Screen 9 does not remove the supplier-required physical progress column or final energy-button illumination; OLED 4's approved `generation_active_*` request owns those autonomous physical outcomes without adding software readiness.
- Version 8 does not add `progressing` or `energy_ready` Display App states, does not make Screen 6 wait for physical completion, and does not add the supplier's 30-second no-send timeout.
- The physical Phase 3 scene starts from an existing approved transition and may include its final progress and energy-button lamp effects autonomously. Any future visitor-input readiness guard or timeout remains the Display Apps programmer's responsibility.
- The turbine and generator are mechanically coupled on one axis. Version 8 exposes exactly one continuous-rotation logical target, `turbine_generator_axis`; this hardware mapping does not alter Display App collaboration.
- OLED 4 sends exactly one explicit `turbine_generator_axis` `start` request in its existing three-second Phase 2 completion callback, alongside `VALVE_COMPLETE`. It neither delays nor waits for the result, and the adapter never infers this request from the game-state event.
- Screen 6 sends exactly one explicit `turbine_generator_axis` `stop` request alongside its existing pressed-`ENERGY_SEND` audio handling, with no new readiness guard or state transition.
- Every production `RESET` originator sends an explicit axis `stop` alongside the reset. The adapter never derives a command from either `ENERGY_SEND` or `GAME_STATE`; it forwards only explicit requests.
- Version 8 has no independent binary-output targets. All outline, chamber, flow, mirrored, progress, and energy-button lighting is controlled only through the approved high-level scene capability.
- That capability exposes exactly one logical target, `tepelni_lighting`, and one normal action, `activate_scene`, with an allowlisted symbolic scene id. Control App owns scene Commands/State/Safety; the Driver owns commissioned controller/protocol translation; Display Apps and adapter know no zones or physical parameters.
- An accepted `activate_scene` result means Control App accepted and started the scene. It is immediate only: Device State records the active symbolic scene, but there is no later scene-completed result or game event and no Display App completion wait.
- Every requested scene is a complete declarative lighting outcome. Cumulative cues, overlays, prior-scene-dependent composition, and lower-layer fuel/phase memory are prohibited in the adapter, Control App, and Driver.
- A later Display App that must preserve fuel-specific lighting must be changed by its programmer to know the selected fuel and explicitly request the matching complete scene. How that game context is propagated belongs to the Display Apps; the integration layers neither decide nor repair it.
- The approved fuel-qualified families are `combustion_coal|gas|biomass`, `combustion_complete_coal|gas|biomass`, and `generation_active_coal|gas|biomass`. OLED 2 owns the first two families at its existing start and success transitions; OLED 4 owns the third at its existing Phase 2 completion callback after the Display Apps programmer propagates fuel to it. Generic unqualified variants are rejected.
- The allowlist is exactly those nine variants plus `sleep` and `phase1_ready`. `sleep` is the sole standby/reset/shutdown outcome; `phase1_ready` is chamber 2 bright white with all other lighting at baseline. Screen 6 requests `sleep` on `ENERGY_SEND`, OLED 4 requests it at its existing reset origin, and OLED 2 requests `phase1_ready` on its existing transitions into `home`.
- Artistic and timing parameters live only in commissioned controller programs. Control App configuration stores connection/transport settings, symbolic-scene-to-program mappings, command timeout, and safe fallback `sleep`; requests contain no colors, brightness, patterns, zones, or durations.
- The underlying scene-controller Device Type, API, runtime, fake, Driver interface, state/error model, and command semantics are shared with JadernaElektrarna. Each exhibit keeps a separate logical target, Integration Profile, sender permissions, and scene allowlist; Tepelni scene ids and guards are not inherited by Jaderna merely because the exhibits are physically similar.
- Jaderna's five existing Version 7 Quido button-lamp targets remain separate and are not part of `jaderna_lighting`. Shared lighting logic refers to the complex chamber/flow/progress scene capability, not migration of settled independently guarded boolean outputs.
- Production uses one shared Exhibit Relay WebSocket for all three front Display Apps and the adapter. The adapter separately consumes Control App `/ws/state` and uses the public HTTP API for commands. OLED 2's serial/asymmetric local bridge and all per-screen proxies are excluded; localhost remains a development default only.
- Reconnect is transport recovery only. Display Apps preserve local state; no input edge, control request, `GAME_STATE`, command, reset, or phase is replayed or synthesized. The existing result outbox and absolute-input rebaseline remain; missed game-event resynchronization belongs to the Display Apps programmer.
- Motor and lighting requests are independent and non-transactional. Each receives its own stable result; unavailable/partial failure causes no adapter retry, rollback, compensation, inferred command, `RESET`, or progression change. Visitor-facing recovery belongs to the Display Apps programmer; Control App Safety Rules independently bound hardware.
- `turbine_generator_axis` requires a commissioned positive `maximum_continuous_runtime_seconds` with no Version 8 default. Expiry and Control App startup/restart stop/verify the motor and report hardware state/fault only; they never resume motion or emit/reset/change lighting or Display App game state.
- `tepelni_lighting` activates/verifies `sleep` before ready at Control App startup and after recovery from unknown controller state. Relay/adapter disconnect alone does not trigger fallback; fallback never emits or changes Display App game state.
- Runtime availability is per source and per target after strict static profile validation. Only an unavailable source is suppressed/rebaselined; healthy inputs continue, unrelated ready commands remain allowed, and the specifically unavailable command target returns `target_unavailable`.
- Existing local/global reset ownership is preserved exactly: OLED 2 local recovery requests only `phase1_ready`; OLED 4's existing reset origin requests axis `stop` plus `sleep`; Screen 6 `ENERGY_SEND` requests the same hardware shutdown without changing its state; reset receivers do not duplicate requests; no new timer or integration-owned reset exists.

## 9. Task 1 Closure

Task 1 is complete. The source/event matrix, exact control transitions, sender/value permissions, API specialization, topology, reconnect, reset, partial-failure, availability, and safety boundaries are approved. No product decision remains for Task 2 implementation.

The remaining unknowns are commissioning facts rather than product decisions: production Device Instance ids and physical wiring, controller endpoint/transport/program ids, visual tuning and Phase 3 program duration, motor tuning, and the positive commissioned `maximum_continuous_runtime_seconds`. Task 2 must use simulation mappings and must not invent production values.

### Acceptance scenarios derived from this contract

- Typed input tests cover exact ids/types, all four absolute encoders, rising-edge suppression, independent recovery baselines, per-source degradation, malformed-state suppression, and reconnect without replay.
- Profile/control tests cover the exact sender/target/action/scene matrix, strict string values only for `activate_scene`, `scene_activated`, target availability, one request/one command, deduplication, result outbox, and independent partial failure.
- Fake scene-controller tests cover API/state shape, startup `sleep`, active-scene recording, unknown-state recovery through `sleep`, timeout/error state, and absence of terminal scene results or exhibit game events.
- Fake motor tests cover the one coupled target, existing Phase 2 start guard, Screen 6/reset-origin stop guards, commissioned maximum-runtime expiry, startup stop/verification, and no auto-resume.
- Chromium acceptance runs OLED 2, OLED 4, and Screen 6 together through the shared relay, proves the complete source progression/reset paths and exact requests, and excludes Screen 9 and the OLED 2 serial bridge.
