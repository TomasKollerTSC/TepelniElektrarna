# TepelniElektrarna Front Game Contract Map

This document is the source-backed behavior and contract record for Version 8 Task 1. It covers the current TepelniElektrarna Display Apps, Exhibit Relay, OLED 2 relay/serial process, embedded keyboard emulators, supplier documents, and the Control App integration boundary. It records current behavior separately from product decisions so implementation does not silently choose between source and supplier intent.

The approved event and control matrices below remain the implementation contract; completion notes identify which increments now exist in source.

Version 8 Tasks 2–7 are complete. The typed adapter implements the approved input/control mappings, all approved OLED 2, OLED 4, and Screen 6 request transitions exist at their source guards, and the complete shared-relay Chromium matrix is green. All three production front Display Apps read the same build-time `VITE_EXHIBIT_RELAY_WS_URL`; `ws://localhost:8765` remains only the development default.

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
| `screen_oled2/src/App.jsx` | Phase 1 combustion Display App | Connects to `VITE_EXHIBIT_RELAY_WS_URL` (development default `ws://localhost:8765`); consumes relay events, emits fuel-qualified `COMBUSTION_COMPLETE`, and sends its allowlisted scene/backlight requests. | Its working start id is numeric `1`; wheel ids are numeric `1..3`. |
| `screen_oled2/bridge.js` | OLED 2 local WebSocket/serial process | Opens a local WebSocket server on `8765`, connects to `MASTER_WS_URL`, forwards all master messages to local React clients, forwards only React-origin `trigger:GAME_STATE` upstream, and forwards serial input only to local React clients. | It is not a transparent relay. Physical OLED 2 inputs do not reach the master Exhibit Relay. It also directly owns RS-485 hardware, conflicting with the approved Control App-exclusive hardware boundary. |
| `screen_oled4/src/App.jsx` | Phase 2 valve Display App | Connects to the same configured relay URL; consumes fuel-qualified `COMBUSTION_COMPLETE` and wheel `4`; emits `VALVE_COMPLETE` or inactivity `RESET` alongside its owned requests. | It never defaults missing fuel or infers a scene below the Display App boundary. |
| `screen_6/src/App.jsx` | Phase 3 cooling Display App | Connects to the same configured relay URL; wakes and lights its button on `VALVE_COMPLETE`; consumes `ENERGY_SEND` for audio and explicit lamp/axis/scene requests. | Source still has no Phase 3 ready state, completion transition, inactivity timer, or automatic reset. |
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
| Energy send press | `{ "type":"trigger", "name":"BUTTON", "id":"ENERGY_SEND", "data":{"pressed":true} }` | Screen 6 keyboard emulator | Screen 6 in every state: preserve audio and independently request lamp off, axis `stop`, and scene `sleep` | Source-authoritative id and shape. Version 8 adds no readiness guard, state transition, or inferred adapter command. |
| Combustion wheels | `{ "type":"trigger", "name":"WHEEL", "id":1..3, "data":{"angle":0..359} }` | OLED 2 keyboard emulator and supplier serial source; keyboard also adds optional `step:-1|1` | OLED 2: any combustion wheel wakes `sleep -> home`; wheel `1` selects fuel in `home`; all three adjust gauges in `game` | Source-authoritative numeric ids and absolute angle. Production translation does not require `step`; source derives direction from `angle` when it is absent. |
| Valve wheel | `{ "type":"trigger", "name":"WHEEL", "id":4, "data":{"angle":0..359} }` | OLED 4 keyboard emulator | OLED 4 only advances while `active`; strict numeric id; only clockwise delta greater than 5 degrees counts | Source-authoritative numeric id and absolute angle. |
| Phase 1 complete | `{ "type":"trigger", "name":"GAME_STATE", "id":1, "data":{"state":"COMBUSTION_COMPLETE","fuel":"coal|gas|biomass"} }` | OLED 2 after all gauges remain green for five seconds; development shortcut in OLED 4 | OLED 4 resets, stores only canonical fuel context, and enters `active` | Existing progression event with Display App-owned fuel context; diagnostic only to the adapter. |
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
| Initial `sleep` | Any valid wheel id `1..3` | Stores that wheel's current angle and enters `home` | `phase1_ready` and `start_button_lamp=true` requests |
| `home` | Wheel `1` movement | Changes fuel after 18 accepted directional samples; wheels `2` and `3` do not select fuel | None |
| `home` | Numeric `BUTTON id:1`, `pressed:true` | Resets gauges/timers and enters `game`; starts 12-point decay every two seconds | Selected-fuel `combustion_*` and `start_button_lamp=false` requests |
| Any state | `BUTTON LANG_*`, `pressed:true` | Updates local language; before START, updates the three independent language lamps | Three `set_state` requests only in `sleep|home` |
| `game` | Wheel `1..3` | Updates activity, hides intro, and adjusts one gauge. Fuel never decreases; air and exhaust may move both ways. | None |
| `game` | All three gauges remain in green `61..120` for five seconds | Stops decay and enters `success` | Matching `combustion_complete_*`, three language-lamp-off requests, and fuel-qualified `COMBUSTION_COMPLETE` |
| `game` | Any gauge remains red above `120` | At five seconds shows overload; at ten seconds stops, clears all gauges, and schedules `home` after three seconds | On the scheduled local `home`, `phase1_ready` and `start_button_lamp=true`; no global reset |
| `game` | No wheel activity for more than 30 seconds; checked every five seconds | Returns locally to `home` | `phase1_ready` and `start_button_lamp=true` requests; no global reset |
| Any state | `GAME_STATE RESET` | Stops decay, restores Czech-default game values except current language, and enters `sleep` | Start lamp off and exactly the current language lamp restored |

OLED 2 has no home/success-to-sleep timer and no global reset on local inactivity or overload failure. Its source decay is fixed at 12 points every two seconds, unlike the supplier text's fuel-dependent `X` description. The source returns from overload to `home` after three seconds, while the supplier document describes a longer warning/failure/animation sequence.

### OLED 4: valve/turbine prompt

| Current state/condition | Accepted event or timer | Resulting state/effect | Emitted event |
| --- | --- | --- | --- |
| Initial `sleep` or any state | `COMBUSTION_COMPLETE` | Enters `active`, resets step to `0`, starts audio/video, and resets wheel baseline | None |
| `active`, step `<15` | Numeric wheel `4` clockwise delta `>5` | Increments one step, capped at 15 | None |
| Step first reaches `15` | Immediate effects plus two separate three-second timers | Switches video/audio; after three seconds shows turbine message | After three seconds, axis `start`, matching `generation_active_*` when canonical fuel exists, and `VALVE_COMPLETE` |
| `active`, step `<15` | No accepted wheel progress for more than 20 seconds; checked every three seconds | Returns to `sleep`, resets local state | Axis `stop`, scene `sleep`, and `RESET` |
| Step `15` complete | Inactivity | Inactivity reset is disabled | None |
| Any state | `GAME_STATE RESET` | Returns to `sleep` and resets local state | None |

There is no supplier-described three-second gate before the first valve movement. Counter-clockwise movement never reduces the step. Phase 2 control requests remain independent of each other and of `VALVE_COMPLETE`.

### Screen 6: cooling/energy audio

| Current state/condition | Accepted event | Resulting state/effect | Emitted event |
| --- | --- | --- | --- |
| Initial `sleep` or any state | `VALVE_COMPLETE` | Enters `active`; plays Phase 3 audio | `energy_send_button_lamp=true` |
| Any state | `BUTTON ENERGY_SEND`, `pressed:true` | Plays `AUDIO_7`; preserves current screen state | Energy lamp off, axis `stop`, and scene `sleep` |
| Any state | `GAME_STATE RESET` | Enters `sleep` and stops audio | `energy_send_button_lamp=false` only |

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
- At Task 1 inspection time OLED 4 and Screen 6 also hard-coded localhost but had no equivalent supplied local relay proxy, so source alone did not establish deployment topology; Task 7 implements the approved shared configurable URL;
- no message replay or current-state synchronization occurs after any connection is re-established.

### Approved production topology

One shared Exhibit Relay is the bidirectional WebSocket hub for OLED 2, OLED 4, Screen 6, and the Integration Adapter. Every client uses one configurable relay WebSocket URL; `ws://localhost:8765` is only the local-development default. There are no per-display relay proxies.

Closure decision, 2026-07-27: implement this already-approved topology in all three front Display Apps. The configuration change must preserve their current event names, payloads, guards, state machines, request ownership, and reconnect behavior. The current hard-coded URLs in the actor inventory above remain source evidence until that implementation is complete.

The adapter consumes Control App hardware state through `/ws/state`, publishes translated inputs through the relay WebSocket, receives explicit Display App control requests through that relay, calls only the public Control App HTTP command API, and publishes correlated results back through the relay WebSocket. Display Apps do not connect directly to Control App, and Control App does not consume the exhibit game protocol.

The existing OLED 2 Node process is excluded from production deployment. Its RS-485/serial ownership and asymmetric local/master forwarding are retired rather than made authoritative. This connection-only change must not alter Display App event names, payloads, guards, ordering, collaboration, or state machines.

### Approved reconnect behavior

Display Apps preserve local state and reconnect to the shared relay; the adapter independently reconnects to the relay and Control App `/ws/state`. No integration component replays or synthesizes visitor presses, control requests, `GAME_STATE`, scenes, motor commands, resets, or phase transitions.

The adapter may drain its existing bounded correlated-result outbox after relay recovery; request-id deduplication prevents repeated hardware execution. On Control App state recovery, transient inputs are suppressed until release and a new press, while each absolute encoder publishes its current stable angle once. Any game resynchronization required because a Display App missed a relay event belongs to the Display Apps programmer.

### Approved unavailable-target and partial-failure behavior

Each control request has one independent correlated result; simultaneous motor and lighting requests are not transactional. Unavailable, rejected, failed, and unknown outcomes use the established stable result contract and structured request context.

The adapter and Control App never retry, compensate, roll back another successful command, emit `RESET`, choose a replacement scene, or alter Display App progression. Display Apps continue their existing non-blocking transitions and log/observe the result; any later visitor-facing recovery belongs to their programmer.

If the turbine-generator starts but `generation_active_*` fails, explicit stop paths and the independent motor Safety Rule remain authoritative. If lighting starts but the motor fails, lighting remains at its requested complete scene until another explicit scene request or its own Safety Rule changes it. No integration layer derives one hardware command from the other command's outcome.

### Continuous-motor startup and reconnect ownership

Commissioning confirms that continued turbine/generator rotation adds no physical harm compared with a stopped error state. Version 8 therefore defines no maximum-runtime configuration, timer, expiry fault, or duration-derived readiness restriction.

On Control App startup and every motor-bus reconnect, Control App treats rotation as physically unknown, quick-stops and verifies the axis before reporting it ready, and never resumes last-known rotation. Failed verification leaves start unavailable until later recovery succeeds. These actions emit no relay event/result without an originating request, lighting command, `GAME_STATE`, or Display App transition. Established explicit per-motor stop and bus emergency-stop behavior remains available in degraded states.

### Externally orchestrated scene initialization and recovery contract

A separate Exhibit Lifecycle Orchestrator owns dependency-ordered startup and shutdown. After it independently ensures the lighting controller and Control App are running, it explicitly dispatches `sleep` through the public Control App API; during controlled shutdown it requests `sleep` before stopping them. Control App process lifecycle never implicitly sends a scene.

Initial sender setup or an unknown local dispatch outcome produces `scene_status: unknown`, `commanded_scene: null`, unavailable ordinary scene control, and diagnosable error context. `sleep` is the sole public-API command permitted from unknown state. Sender recovery never resumes the last command and remains unavailable until the orchestrator explicitly dispatches `sleep` again. Relay or adapter disconnection alone sends no lighting command.

The orchestrator initializes each Display App's game state separately through the External Exhibit App boundary. Control App never receives, owns, translates, or emits that game-state initialization. The orchestration scripts and Raspberry Pi supervision remain deployment work outside Task 3.

### Per-source and per-target runtime availability

Static profile/API/schema incompatibility still prevents adapter readiness. Once the snapshot shape is valid, each input source and control target has independent online/stale availability. An offline or stale Device Instance degrades diagnostics but does not silence unrelated healthy sources or targets.

Startup validation is mapping-scoped rather than an inventory policy. It requires and validates the approved Tepelni mappings used by this contract, including compatible type/role, I/O Point or scene, state paths, and sender/action/value permissions. It does not reject unrelated additional logical targets, count compatible Device Instances, or require that only one Device Instance of a given type exists; the deployment's Device Instance inventory is already configuration-owned.

The adapter suppresses only the unavailable input's events and emits no release, zero, substitute, reset, or phase. On recovery, only that source rebaselines: buttons wait for release/new press and an absolute encoder emits its stable angle once. An unavailable motor/lighting target never blocks input translation, and an unavailable input never blocks a request to a different ready target. The specifically requested unavailable target is rejected with `target_unavailable`.

### Final local/global reset matrix

| Existing Display App owner and path | Existing game behavior preserved | Explicit Version 8 hardware request(s) |
| --- | --- | --- |
| OLED 2 overload or inactivity returns to `home` | Only OLED 2 returns to fuel selection; no global `RESET` | OLED 2 requests `tepelni_lighting activate_scene phase1_ready` and `start_button_lamp=true` independently. |
| OLED 4 pre-completion inactivity | OLED 4 emits its existing global `GAME_STATE RESET`; all receivers perform their current local reset | The reset originator requests `turbine_generator_axis stop` and `tepelni_lighting activate_scene sleep` before/alongside `RESET`. |
| Screen 6 handles pressed `ENERGY_SEND` | Preserve current audio and state behavior; emit no new `GAME_STATE`, success, readiness, or reset | Screen 6 independently requests its lamp off, axis `stop`, and scene `sleep`. |
| Any Display App receives `GAME_STATE RESET` | Perform only its existing local reset behavior | No duplicate motor/scene request. OLED 2 restores owned backlights; Screen 6 turns its owned lamp off. |

Screen 6 gains no timeout. Neither the adapter nor Control App derives a game reset/transition from a timer, command result, connection state, or observed event.

## 5. Supplier-Only Physical Behavior Inventory

The supplier behavior PDF described these effects even though the originally supplied source had no guarded runtime request for them. Tasks 4–5 now implement the approved requests. Version 8 adopts the physical outcomes, not the stale generic `trigger:LED` or `trigger:MOTOR` wire messages.

| Supplier transition | Supplier physical effect | Current source owner/evidence | Existing Control App compatibility |
| --- | --- | --- | --- |
| Exhibit power-on/sleep | Outline lights on; chamber 2/4/7/8 low illumination | No source message | Part of the high-level lighting-scene contract; no independent binary output is allowed. |
| First accepted movement of any combustion wheel wakes OLED 2 | Chamber 2 brighter/white | OLED 2 has exact `sleep -> home` transition | Chamber lighting belongs to `phase1_ready`; the same Display App transition independently turns the confirmed start-button backlight on. |
| Fuel chosen/game begins | Chamber 2 fuel-colored split strip | OLED 2 owns fuel selection and exact `home -> game` transition | Requires an explicit scene/value contract and a lighting Driver/runtime/API; current API v1 has no such capability. |
| Phase 1 complete | Chamber 4 white; lower progress region solid yellow | OLED 2 owns exact success transition | Entire outcome belongs to the high-level lighting-scene contract; do not split simple portions into Quido targets. |
| Phase 2 complete | Start the mechanically coupled turbine-generator axis; chamber 7/8 strips on; red/blue pulsing flow strips; rear 6R mirror; begin the physical Phase 3 progress sequence | OLED 4 owns the exact three-second completion callback and sends one explicit start request alongside `VALVE_COMPLETE` | One continuous-rotation target, `turbine_generator_axis`, fits current API v1. The adapter forwards the explicit request and never infers it from `VALVE_COMPLETE`. Complex lighting/progress needs a new Control App-owned capability. |
| Phase 3 physical progress finishes after an unspecified `x` seconds | Finish green progress column; send-energy-button backlight is controlled separately from Screen 6 game logic | No current Display App readiness state; Screen 9 is excluded | The high-level scene owns progress only. The confirmed Quido backlight is never part of a scene; Version 8 adds no Display App readiness state or wait. |
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
| `sleep` | Outline lights on; chambers 2, 4, 7, and 8 at low baseline illumination; fuel, flow, progress, and completion effects off; no Quido button backlight changes | Screen 6 alongside pressed `ENERGY_SEND`; OLED 4 alongside its existing production inactivity `RESET`; Exhibit Lifecycle Orchestrator during explicit initialization/recovery/shutdown. |
| `phase1_ready` | Chamber 2 bright white for fuel selection; every other region at the `sleep` baseline | OLED 2 on the first accepted movement of any combustion wheel that performs `sleep -> home` and when existing overload/inactivity recovery returns locally to `home`. |
| `combustion_coal` | Complete Phase 1 active outcome with coal's commissioned orange/red split fuel strip and in-progress lighting | OLED 2 on accepted `home -> game` with coal selected. |
| `combustion_gas` | Complete Phase 1 active outcome with gas's commissioned blue/orange split fuel strip and in-progress lighting | OLED 2 on accepted `home -> game` with gas selected. |
| `combustion_biomass` | Complete Phase 1 active outcome with biomass's commissioned yellow/orange split fuel strip and in-progress lighting | OLED 2 on accepted `home -> game` with biomass selected. |
| `combustion_complete_coal`, `combustion_complete_gas`, `combustion_complete_biomass` | Matching fuel effect retained; chamber 4 bright white; Phase 1 progress region solid yellow; remaining regions at baseline | OLED 2 at its existing five-second all-green success transition. |
| `generation_active_coal`, `generation_active_gas`, `generation_active_biomass` | Matching fuel effect retained; Phase 1/2 completion lighting; chambers 7/8 lit; red and blue pulsing front flow with rear 6R mirror; autonomous Phase 3 round/green progress; no button-backlight effect | OLED 4 in its existing three-second Phase 2 completion callback after Display App fuel propagation, alongside motor start and `VALVE_COMPLETE`. |

This table is exhaustive. There is no separate `shutdown`, `reset`, `energy_sent`, generic phase, zone, overlay, or delta scene. Screen 6 and OLED 4 have the exact `sleep` permissions above; a future reset originator requires a contract change. The adapter never translates `ENERGY_SEND` or `GAME_STATE RESET` into lighting control.

### Lighting commissioning boundary

The lighting programmer owns colors, brightness, pulse rates, pattern details, physical zone/address mapping, and Phase 3 progress duration inside the commissioned lighting-controller programs. These values never appear in Display App requests, adapter profiles, or the public command payload.

Task 3's busless, transport-neutral scene-controller configuration contains only `type: scene_controller`, an explicit strict mapping from each of the 11 symbolic scene ids to one opaque non-empty fake program reference, a positive command timeout, and `sleep` as the configured initialization scene. It contains no Device Bus, endpoint, transport kind, Driver/fake selector, health-poll interval, or production protocol setting. The injected factory receives this config; its Driver exposes only local `send(program_reference)` and `close` operations. A later concrete Driver owns its strictly typed commissioned connection/protocol configuration and does not hard-code artistic values or exhibit progression.

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
| Confirmed button backlight | Existing `EXHIBIT_CONTROL set_state` path | Immediate result only | Five allowed Quido targets: start, Czech, English, German, and send-energy. They are independent of every scene; no other binary target may be invented. |
| Positioned motion | `set_position`/service `home` -> API v1 lift endpoints | Immediate plus terminal result | No Tepelni positioned motion is source- or supplier-confirmed. Do not inherit Jaderna rod targets. |
| Complete colored/dimmed/patterned lighting scene | One new logical target, `tepelni_lighting`, with action `activate_scene` and an allowlisted complete symbolic scene id | Immediate result when Control App successfully performs local dispatch; no terminal completion result | Control App owns a reusable game-stateless scene-controller capability; its Driver maps the requested complete scene to commissioned S-Play/DMX behavior. No lower layer composes cues or recovers fuel/phase from history. Device State records the last commanded scene, never confirmed remote state. |

The reusable request/result envelope, stable codes, process-local idempotency, relay result outbox, command outcome policy, and diagnostics are reused. The exact lighting specialization follows; Task 3 may not invent a different action, value type, endpoint, result code, or Device State.

### Exact scene-controller public API specialization

| Contract element | Approved Version 8 shape |
| --- | --- |
| Control App Device Type | `scene_controller` (backward-compatible API Contract Version 1 addition) |
| Public command | `POST /api/scene-controllers/{device_id}/scenes/activate` |
| Strict HTTP body | `{ "scene": "<symbolic_scene_id>" }` |
| Success | `{ "ok":true, "outcome":"sent", "state":<SceneControllerDeviceState> }` |
| Device State | Standard identity/connection/stale/error fields plus `scene_status: unknown|sending|commanded|error` and nullable `commanded_scene`; included in device APIs and `/ws/state`. Readiness is derived from locally online + non-stale + commanded, not duplicated. |
| Exhibit Control action/value | `action:"activate_scene"` with required strict, non-empty string `value`; no other action accepts a string |
| Accepted result | Immediate-only `status:"accepted"`, `code:"scene_command_sent"`, echoing the exact string value |
| Unusable target | `rejected/target_unavailable`; no Control App command attempted |
| Mapping | One logical target -> one `scene_controller` Device Instance -> one public API command; no fan-out or composition |

Scene ids use exact case-sensitive matching with no trimming, aliasing, defaulting, or normalization. Missing, wrong-type, empty, whitespace/case-mismatched, or unknown values are `invalid_request`; a known scene requested by a sender without permission is `action_not_allowed`. These mistakes are fixed in the responsible Display App rather than repaired below it. Same-`request_id` retries return the stored result without execution; a new request id invokes the Driver even when that complete scene is already commanded.

Expected S-Play communication is one-way UDP or OSC. `unknown` means no last successfully dispatched complete scene can be asserted and `commanded_scene` is null; `error` means a local sender fault blocks dispatch. Exactly one `sending` operation may be in flight and concurrent requests receive HTTP 409. The Driver distinguishes a definite no-send rejection with a reusable sender, a sender fault, and an ambiguous dispatch. Definite no-send returns HTTP 409 and preserves the prior commanded scene; sender fault returns HTTP 503, clears the scene, and reconstructs the sender; ambiguity returns HTTP 504, clears the scene, and also reconstructs the sender. Unexpected Driver exceptions are sender faults. Successful factory construction sets locally `online`/non-stale state even before scene initialization; no elapsed-time rule makes a commanded scene stale, and `last_seen` remains null because no remote controller is observed. There is no periodic local health probe. `connection` and `stale` report only local sender availability, never remote S-Play power, reachability, receipt, execution, or completion. The adapter maps 409/503 to `rejected/control_app_rejected`, maps 504 or HTTP/network uncertainty to `failed/command_outcome_unknown`, and never performs initialization/recovery; only direct orchestrator `sleep` may establish commanded readiness.

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

The existing strict envelope, canonical request fingerprint, 4,096-record/10-minute process-local deduplication, result outbox, and stable rejection/failure codes remain unchanged. The value/result union expands only to include strict strings for `activate_scene` and the result code set expands only with `scene_command_sent`.

### Complete control sender/transition matrix

| Existing owner and source guard | Explicit independent request(s) | Immediate result |
| --- | --- | --- |
| First accepted movement of any OLED 2 combustion wheel `1..3` causes `sleep -> home` | `tepelni_lighting activate_scene phase1_ready` and `start_button_lamp set_state true`, each with its own UUID | Independent `accepted/scene_command_sent` and `accepted/state_set`, or established rejection/failure |
| OLED 2 overload/inactivity returns locally to `home` | `tepelni_lighting activate_scene phase1_ready` and `start_button_lamp set_state true`, each with its own UUID | Same; no global reset |
| OLED 2 accepts `home -> game` | One fuel-matching `combustion_*` scene and `start_button_lamp set_state false`, each with its own UUID | Independent immediate results |
| OLED 2 completes five seconds all-green | One fuel-matching `combustion_complete_*` scene alongside existing success/`COMBUSTION_COMPLETE` | Same; game event is not a command |
| OLED 4 existing three-second Phase 2 completion callback | `turbine_generator_axis start` and one fuel-matching `generation_active_*`, each with its own UUID, alongside `VALVE_COMPLETE` | `accepted/started` and `accepted/scene_command_sent` independently |
| OLED 4 existing pre-completion inactivity reset origin | `turbine_generator_axis stop` and `tepelni_lighting activate_scene sleep`, each with its own UUID, before/alongside `RESET` | `accepted/stopped` and `accepted/scene_command_sent` independently |
| Screen 6 handles pressed `ENERGY_SEND` | `turbine_generator_axis stop` and `tepelni_lighting activate_scene sleep`, each with its own UUID | Same; no Screen 6 state/reset change |
| Any Display App merely receives `RESET` | No request | Receivers perform only existing local game reset |
| Page load, socket/process reconnect, observed `GAME_STATE`, result, or elapsed time | No request | No replay/inference; hardware Safety Rules are separate |

Exact profile permissions: OLED 2 may activate `phase1_ready`, the three `combustion_*`, and the three `combustion_complete_*` scenes. OLED 4 may `start|stop` the axis and activate the three `generation_active_*` scenes plus `sleep`. Screen 6 may only `stop` the axis and activate `sleep`. No other sender/target/action/value combination is permitted.

The complete button-backlight matrix is separate from scenes. The Exhibit Lifecycle Orchestrator does not initialize the start lamp. OLED 2 alone may `set_state` on the start and three language targets: entering the fuel-selection state (`home`) turns the start lamp on; accepted START turns it off; global reset returns OLED 2 to `sleep` and also requests it off. A pre-start language selection turns the selected language on and the other two off; Phase 1 success turns all language lamps off; reset restores the selected language. Screen 6 alone may `set_state` on `energy_send_button_lamp`: entering active from `VALVE_COMPLETE` turns it on and `ENERGY_SEND` or reset turns it off. Page load/reconnect emits nothing. Each request is independently identified and correlated; sibling motor/scene/backlight failures never roll back one another.

## 8. Resolved Product Decisions

- The complete supplier-prescribed turbine/generator and chamber/flow/progress lighting choreography is current Version 8 product intent.
- Version 8 adopts those physical outcomes through explicit, guarded Exhibit Control Requests. It does not revive or depend on the undocumented generic `trigger:LED` and `trigger:MOTOR` messages.
- `screen_9` is not a real product Display App. Version 8 skips it entirely: no deployment, event translation, state-machine completion, acceptance browser, or control ownership.
- Skipping Screen 9 does not remove the supplier-required physical progress column; OLED 4's approved `generation_active_*` request owns that autonomous scene outcome without adding software readiness. The confirmed send-energy-button Quido backlight is controlled independently by Screen 6 game logic.
- Version 8 does not add `progressing` or `energy_ready` Display App states, does not make Screen 6 wait for physical completion, and does not add the supplier's 30-second no-send timeout.
- The physical Phase 3 scene starts from an existing approved transition and runs its progress autonomously. It never includes a button backlight. Any visitor-input readiness guard, backlight transition, or timeout remains the responsible Display App programmer's explicit logic.
- The turbine and generator are mechanically coupled on one axis. Version 8 exposes exactly one continuous-rotation logical target, `turbine_generator_axis`; this hardware mapping does not alter Display App collaboration.
- OLED 4 sends exactly one explicit `turbine_generator_axis` `start` request in its existing three-second Phase 2 completion callback, alongside `VALVE_COMPLETE`. It neither delays nor waits for the result, and the adapter never infers this request from the game-state event.
- Screen 6 sends exactly one explicit `turbine_generator_axis` `stop` request alongside its existing pressed-`ENERGY_SEND` audio handling, with no new readiness guard or state transition.
- Every production `RESET` originator sends an explicit axis `stop` alongside the reset. The adapter never derives a command from either `ENERGY_SEND` or `GAME_STATE`; it forwards only explicit requests.
- Version 8 has exactly five independent Quido button-backlight targets using `set_state`; no button backlight belongs to a scene. All complex outline, chamber, flow, mirrored, and progress lighting is controlled only through the high-level scene capability, and no other binary output target is authorized.
- Tepelni's start push-button is backlit only while OLED 2 is in its fuel-selection state (`home`): wheel movement wakes the current `sleep` state, entering fuel selection turns the lamp on, and accepted START turns it off as the game begins. Global reset returns to `sleep` with the lamp off. Jaderna's commissioned start control is an unlit lever. The remaining language/send-energy backlight behavior follows the established independently guarded Quido pattern with Tepelni's own source transitions.
- That capability exposes exactly one logical target, `tepelni_lighting`, and one normal action, `activate_scene`, with an allowlisted symbolic scene id. Control App owns scene Commands/State/Safety; the Driver owns commissioned controller/protocol translation; Display Apps and adapter know no zones or physical parameters.
- An accepted `activate_scene` result means Control App successfully dispatched the configured reference through its local sender. Device State records the last commanded symbolic scene, but Control App does not claim remote receipt, start, execution, or completion; there is no later result, game event, or Display App completion wait.
- Every requested scene is a complete declarative lighting outcome. Cumulative cues, overlays, prior-scene-dependent composition, and lower-layer fuel/phase memory are prohibited in the adapter, Control App, and Driver.
- A later Display App that must preserve fuel-specific lighting must be changed by its programmer to know the selected fuel and explicitly request the matching complete scene. How that game context is propagated belongs to the Display Apps; the integration layers neither decide nor repair it.
- The approved fuel-qualified families are `combustion_coal|gas|biomass`, `combustion_complete_coal|gas|biomass`, and `generation_active_coal|gas|biomass`. OLED 2 owns the first two families at its existing start and success transitions; OLED 4 owns the third at its existing Phase 2 completion callback after the Display Apps programmer propagates fuel to it. Generic unqualified variants are rejected.
- The allowlist is exactly those nine variants plus `sleep` and `phase1_ready`. `sleep` is the sole standby/reset/shutdown outcome; `phase1_ready` is chamber 2 bright white with all other lighting at baseline. Screen 6 requests `sleep` on `ENERGY_SEND`, OLED 4 requests it at its existing reset origin, and OLED 2 requests `phase1_ready` when wheel movement wakes `sleep` into fuel selection and on local returns to that state.
- Artistic and timing parameters live only in commissioned controller programs. Task 3's busless simulation configuration stores the symbolic-scene-to-program mapping, command timeout, and initialization scene `sleep`; requests contain no colors, brightness, patterns, zones, or durations. Concrete connection/transport configuration remains a later commissioned Driver concern.
- The underlying scene-controller Device Type, API, runtime, fake, Driver interface, state/error model, and command semantics are shared with JadernaElektrarna. Each exhibit keeps a separate logical target, Integration Profile, sender permissions, and scene allowlist; Tepelni scene ids and guards are not inherited by Jaderna merely because the exhibits are physically similar.
- Jaderna's four commissioned Quido button-lamp targets—Czech, English, German, and send-energy—remain separate and are not part of `jaderna_lighting`. Shared lighting logic refers to the complex chamber/flow/progress scene capability, not migration of settled independently guarded boolean outputs.
- Commissioning proved Jaderna's former `start_button_lamp` was a simulation-only legacy assumption because the physical start control is an unlit lever. Version 8 Task 7 removed that request, target, fake output, and its profile/test/Chromium expectations in one coordinated change. It must not reappear in production. No Jaderna scene mapping or scene ids were invented by Task 3.
- Production uses one shared Exhibit Relay WebSocket for all three front Display Apps and the adapter. The adapter separately consumes Control App `/ws/state` and uses the public HTTP API for commands. OLED 2's serial/asymmetric local bridge and all per-screen proxies are excluded; localhost remains a development default only.
- Reconnect is transport recovery only. Display Apps preserve local state; no input edge, control request, `GAME_STATE`, command, reset, or phase is replayed or synthesized. The existing result outbox and absolute-input rebaseline remain; missed game-event resynchronization belongs to the Display Apps programmer.
- Motor and lighting requests are independent and non-transactional. Each receives its own stable result; unavailable/partial failure causes no adapter retry, rollback, compensation, inferred command, `RESET`, or progression change. Visitor-facing recovery belongs to the Display Apps programmer; Control App Safety Rules independently bound hardware.
- Continued turbine/generator rotation is commissioned as non-harmful, so no maximum-runtime field or expiry behavior exists. Startup/reconnect quick-stop and verification, explicit stop, emergency stop, and no auto-resume remain mandatory and never emit/reset/change lighting or Display App game state.
- `tepelni_lighting` begins unknown and permits only explicit public-API `sleep` until initialized. The external Exhibit Lifecycle Orchestrator dispatches `sleep` after ordered startup, after unknown local-sender recovery, and before controlled shutdown. Control App lifecycle and relay/adapter disconnect never send a scene or change Display App game state.
- Runtime availability is per source and per target after strict static profile validation. Only an unavailable source is suppressed/rebaselined; healthy inputs continue, unrelated ready commands remain allowed, and the specifically unavailable command target returns `target_unavailable`.
- Existing local/global reset ownership is preserved exactly: OLED 2 local recovery requests `phase1_ready` and its independently owned start lamp on; OLED 4's existing reset origin requests axis `stop` plus `sleep`; receiving global reset makes OLED 2 request its start lamp off and restore its selected language lamp, while Screen 6 requests its energy-send lamp off. Reset receivers do not duplicate motor or scene requests; no new timer or integration-owned reset exists.

## 9. Task 1 Closure

### Task 3 implementation boundary

Status: Tasks 3–6 and Task 7's Tepelni product changes are complete on 2026-07-27. A later parent-repository closure audit reopened Task 7; both shared launcher defects are now corrected and regression-covered. Only the final unmodified closure rerun and result record remain. No Tepelni game-contract decision or product transition is open.

The approved scene contract requires Task 3 to implement the complete reusable fake-backed `scene_controller` capability and its validated adapter mapping: Control App configuration and Device Type, Device State, runtime, public API v1 Command, injectable Driver seam, reusable fake Driver, strict request/result specialization, target validation, resolver, and simulation-only Tepelni mappings. Task 3 also implements continuous-motor startup/reconnect quick-stop verification without a duration limit. It does not add Display App request emission and does not choose or implement controller transport, program ids, artistic parameters, production scene-controller configuration, or hardware protocol behavior. Tasks 4–5 consume these foundations at the approved guarded Display App transitions.

The reusable fake is deterministic injected test/simulation support rather than a production transport. It records ordered send attempts and program references and supports local dispatch success, definite no-send rejection, ambiguous local timeout, sender fault/recovery, and blocked concurrency. It never simulates remote acknowledgment, pixels, colors, brightness, animation, scene completion, S-Play, DMX, or artistic fidelity. Task 3 runs the full Control App and Integration Adapter suites with focused coverage of every state, mapping, permission, availability, idempotency/outbox, startup-stop, and independent-failure branch; Display App/Chromium and hardware/protocol checks remain later gates.

Task 3 now provides that contract through the busless fake-backed Control App capability, exact 11-scene Tepelni mapping, five independent simulated Quido backlights, one continuous-axis target, and startup/reconnect quick-stop verification. Initial and reconstructed lighting state remains unknown until a direct public-API `sleep`. No Display App source, production configuration, controller transport, protocol, or Task 4 transition was added.

Task 1 is complete. The source/event matrix, exact control transitions, sender/value permissions, API specialization, topology, reconnect, reset, partial-failure, availability, and safety boundaries are approved. No product decision remains for Task 2 implementation.

Task 4's approved tracer is the existing first combustion-wheel movement that changes OLED 2 from `sleep` to fuel selection (`home`). At that one unchanged guard OLED 2 adds two independent requests with distinct UUIDs: `tepelni_lighting activate_scene phase1_ready` and `start_button_lamp set_state true`. Acceptance proves both public API paths, fake effects, correlated results, per-target partial failure, rendered fuel-selection UI, and no page-load/reconnect replay; neither request waits for, retries, rolls back, or compensates the other.

Task 4 now implements that exact tracer without changing the state machine. Its focused Chromium slice proves explicit orchestrator-style `sleep` initialization, two unique request ids and correlated immediate results, fake scene and Quido effects, duplicate result reuse without execution, definite rejection and ambiguous failure with independent lamp success, subsequent lighting-target unavailability, rendered `home` UI, and no page-load/reconnect replay. No remaining Task 5 transition was added.

Task 5 now implements every remaining approved Display App transition. OLED 2 owns the selected-fuel Phase 1 scenes and its four backlights; its fuel-qualified existing completion event gives OLED 4 source-owned context without lower-layer memory. OLED 4 owns the coupled-axis and generation-scene completion pair plus the only production motor/scene reset pair. Screen 6 owns the energy-send lamp and its existing unguarded energy-send stop/sleep pair. Each request has its own UUID/result and logs independently. Focused Chromium coverage proves normal progression, exact lamp outcomes, local/global reset ownership, rejected-scene partial failure without compensation or progression blocking, and absence of a generation-scene request when canonical fuel context is missing.

Task 6 now runs OLED 2, OLED 4, and Screen 6 concurrently through the shared Exhibit Relay at their kiosk viewports. Its coal/gas/biomass matrix proves complete rendered progression, exact ordered requests/events and fake effects, correlated results, stored-result deduplication without re-execution, local/global reset, and reconnect without replay. It also enforces one live relay socket per Display App and adapter-only relay connectivity after browser teardown. The three front apps now prevent a disposed React connection effect from scheduling a replacement socket; no game logic, request guard, retry, state, or timer changed. Screen 9 and the OLED 2 serial bridge remain excluded.

The tested physical Control App baseline is recorded in `ControlApp/config/tepelni-elektrarna.yaml` and `docs/tepelni-elektrarna-commissioning.md`: the Quido and its I/O shape, shared encoder bus and addresses, separate turbine-motor bus, Device Instance ids, motor address, direction, speed range/default, and JOG ramp are known; no maximum continuous runtime is required. The remaining unknowns are commissioning facts rather than product decisions: encoder direction/zero; actual UDP-versus-OSC variant, destination, and message schema; production scene-controller Device Instance and strictly typed Driver connection settings; real program references; visual tuning and Phase 3 duration; lifecycle scripts/service names; and exact External Exhibit App initialization messages. Simulation mappings must not overwrite or masquerade as that production baseline.

### Acceptance scenarios derived from this contract

- Typed input tests cover exact ids/types, all four absolute encoders, rising-edge suppression, independent recovery baselines, per-source degradation, malformed-state suppression, and reconnect without replay.
- Profile/control tests cover the exact sender/target/action/scene matrix, strict string values only for `activate_scene`, `scene_command_sent`, target availability, one request/one command, deduplication, result outbox, and independent partial failure.
- Fake scene-controller tests cover API/state shape, unknown initial state, explicit `sleep` initialization, commanded-scene recording, unknown-state recovery requiring another explicit `sleep`, timeout/error state, and absence of implicit lifecycle scenes, terminal scene results, or exhibit game events.
- Fake motor tests cover the one coupled target, existing Phase 2 start guard, Screen 6/reset-origin stop guards, startup/reconnect quick-stop verification, failed-verification unavailability, and no auto-resume.
- Chromium acceptance runs OLED 2, OLED 4, and Screen 6 together through the shared relay, proves the complete source progression/reset paths and exact requests, and excludes Screen 9 and the OLED 2 serial bridge.
