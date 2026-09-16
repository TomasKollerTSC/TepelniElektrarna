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

Status: Version 8 Tasks 2–7 are complete. A 2026-07-27 parent-repository audit reopened Version 8; both the browser-install defect and Task 4 adapter-startup readiness race were corrected and regression-covered. The unmodified parent closure command then passed on its first run after both corrections, including all six front-app builds, the three configured Tepelni relay-bundle checks, Task 4 (`1 passed`), Task 5 (`4 passed`), complete Tepelni Chromium (`2 passed`), and complete Jaderna Chromium (`1 passed`).

### Version 8 Task 3 implementation boundary

- Task 3 implements the complete reusable fake-backed `scene_controller` foundation needed to make validated mappings executable: Control App configuration and Device Type, Device State, runtime, public API v1 `activate_scene` Command, injectable Driver protocol/factory seam, reusable in-memory fake Driver, strict adapter request/result specialization, target model, startup validation, resolver, and simulation-only Tepelni mappings.
- Task 3 ends with one logical request resolving to one real Control App public API call and a fake scene-controller effect/result, without requiring a Display App to emit that request.
- Tasks 4–5 add the approved requests only at their existing guarded Display App transitions and prove them through vertical slices; they reuse the Task 3 capability and do not introduce controller or protocol behavior.
- A concrete S-Play/DMX or other controller Driver, scene-controller transport/endpoint selection, program ids, artistic parameters, production scene-controller configuration/wiring, and Raspberry Pi scene-controller deployment remain commissioning work and are not prerequisites for Task 3.
- Task 3 implements continuous-motor startup/reconnect quick-stop and verification. It adds no maximum-runtime configuration, timer, expiry fault, or duration-derived readiness behavior.
- Task 3 implements explicit scene initialization rather than Control App lifecycle fallback: initial/recovered scene state is unknown, only a direct public-API `sleep` establishes readiness, and fake tests issue that call. The separate Exhibit Lifecycle Orchestrator and its Raspberry Pi scripts remain deferred deployment work.
- Scene readiness is derived from locally online, non-stale, commanded state; there is no duplicate ready field. Unknown state has no asserted commanded scene, error means a local sender fault, and sending permits no concurrent queue/replacement. A definite no-send rejection preserves the prior commanded scene, while any ambiguous local outcome clears it and requires another orchestrator-issued `sleep`. None of these states claims remote S-Play liveness or execution.
- The existing physical Control App baseline is not hypothetical: `ControlApp/config/tepelni-elektrarna.yaml` and `docs/tepelni-elektrarna-commissioning.md` authoritatively record the tested Quido, shared four-encoder bus, separate turbine-motor bus, Device Instance ids, motor address, direction, speed, and ramp. Task 3 preserves that baseline without adding a maximum-runtime field. The entire scene-controller connection/program configuration remains open.
- Task 4 uses the existing first combustion-wheel `sleep -> home` guard as a complete two-request tracer: independent `phase1_ready` scene dispatch and `start_button_lamp=true`, each with its own UUID/result, fake effect, partial-failure coverage, and no replay. Task 5 adds every remaining approved motor, scene, and backlight request plus the Display App-owned fuel-context propagation; Task 2's input translation is already complete.
- Scene ids are strict exact case-sensitive strings. Missing, wrong-type, empty, whitespace/case-mismatched, or unknown values are invalid; known scenes requested by an unauthorized sender are forbidden. The adapter performs no correction or normalization. Tasks 4–5 fix any obvious Display App request mistake at its source and add a regression test.
- Expected S-Play communication is one-way UDP or OSC. Accepted activation is immediate `scene_command_sent`: it means local dispatch succeeded, not that S-Play received, started, or completed the scene. Same-id retries are deduplicated without another Driver call; a new request id deliberately sends again even when it matches the last commanded scene.
- Task 3's busless `SceneControllerDeviceConfig` contains only `type`, strict symbolic-scene-to-opaque-program-reference mappings, a positive command timeout, and initialization scene `sleep`. It has no bus, endpoint, transport kind, Driver/fake selector, or health-poll interval. The fake is injected through a factory that receives the config; its Driver exposes local `send(program_reference)` and `close` operations.
- Scene `connection` and `stale` report local sender availability only. Successful factory creation is locally online/non-stale even before initialization; `last_seen` remains null, a commanded scene never becomes stale merely with age, and no periodic health probe is performed. A local sender fault triggers close/reconstruction; reconstruction does not restore the commanded scene. Remote S-Play power, reachability, receipt, execution, and completion are never represented.
- Scene Driver outcomes are explicit: definite no-send with a reusable sender returns HTTP 409 and preserves prior commanded state; sender fault returns HTTP 503, clears state, and reconstructs the sender; ambiguous dispatch returns HTTP 504, clears state, and also reconstructs the sender. Unexpected exceptions are sender faults. The adapter maps 409/503 to `rejected/control_app_rejected` and 504 or HTTP/network uncertainty to `failed/command_outcome_unknown`.
- One deterministic injectable in-memory scene fake is shared by Control App tests and later local launchers but is never production-configurable. It records ordered sends and can model local success, definite no-send rejection, ambiguous local timeout, sender fault/recovery, and an in-flight block; it models no remote acknowledgment, visual, timing, S-Play, or DMX fidelity.
- Task 3 requires complete Control App and Integration Adapter suites plus focused API/state/lifecycle, startup-stop, all seven required Tepelni mappings, five-output, permission, mapping-scoped validation that allows unrelated additional targets/devices, deduplication/outbox, availability, partial-failure, and Jaderna/Tepelni regression coverage. It does not count compatible Device Instances or require one instance per Device Type. Display App/Chromium, real hardware, protocol, and artistic checks begin only in later tasks or commissioning.
- Open commissioning facts do not block Task 3: actual UDP-versus-OSC variant, destination/message schema, production Device Instance and Driver connection settings, real program references, visual tuning/progress duration, encoder direction/zero, lifecycle scripts/service names, and exact External Exhibit App initialization messages.

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
- `screen_oled2/bridge.js` forwards serial input only locally and is therefore excluded from production. OLED 2, OLED 4, and Screen 6 now use one `VITE_EXHIBIT_RELAY_WS_URL`, retaining localhost only as the development default.
- Existing `node_modules` trees are not release artifacts. Run locked `npm ci` and the production builds on the development machine; never copy desktop dependencies or install Vite as the normal display-Pi runtime.

Production adapter enablement requires a new validated Tepelni production Integration Profile, but that profile is a separate later commissioning package and does not block Version 8 closure. Its Control App and relay URLs, service layout, final production mappings, and commissioned scene-controller transport/program references must be supplied rather than copied from simulation or represented by placeholders.

## Version 9 Task 2 display release record

The eight included Vite Display Apps passed locked installation, production build, static-bundle browser, assigned-viewport, complete front simulation/integration, and full rear-kiosk interaction/media/language/inactivity acceptance on 2026-07-27. The release audit fixed empty 2R/4R initial media frames and missing favicon requests without replacing accepted supplier artwork. `screen_9` remains excluded. See `DISPLAY_APP_RELEASE_AUDIT.md` and `RUNBOOK.md`; adapter, calibration, deployment, and later Version 9 work remain separate.

The implemented Tepelni closure change replaces the hard-coded relay URL in OLED 2, OLED 4, and Screen 6 with one shared build-time `VITE_EXHIBIT_RELAY_WS_URL` whose development default remains `ws://localhost:8765`. It changes no state, guard, event, request, retry, or reconnect behavior. The parent repository's Version 8 launcher builds all three production front apps with a non-local URL and reruns the focused and complete Tepelni Chromium suites. Its unmodified first run after the two audit corrections passed end to end without a manual bypass or suite rerun, closing Version 8.

## Version 8 Task 1 Approved Decisions

- Numeric start id `1`, string `ENERGY_SEND`, and numeric wheel ids `1..4` are resolved source facts. Version 8 preserves them because the current Display Apps use strict comparisons.
- `ENERGY_SEND` is part of the source-confirmed event contract. Screen 6 preserves its current unguarded audio/state behavior and adds only explicit motor `stop` plus lighting `sleep`; any future readiness, completion, reset, or timeout game logic belongs to the Display Apps programmer.
- Generic documented `LED` and `MOTOR` messages remain unimplemented and are not adopted. Approved physical choreography uses only the explicit guarded Exhibit Control Requests documented below.
- The complete supplier-prescribed turbine/generator and chamber/flow/progress lighting choreography is approved Version 8 product intent. The implementation contract will express these physical outcomes through explicit guarded requests and Control App-owned capabilities, not the generic documented messages.
- `screen_9` is excluded as a nonexistent product app. It will not be deployed or completed; OLED 4's approved `generation_active_*` request starts the physical progress scene without adding a software readiness state. The separately wired send-energy-button backlight is owned by Screen 6 game logic through Quido.
- Version 8 will not add a Screen 6 readiness state, physical-completion wait, or 30-second no-send timeout. Any future readiness/timeout game logic belongs to the Display Apps programmer; Control App and the adapter will not infer it.
- The turbine and generator are mechanically coupled on one axis. Version 8 uses one continuous-rotation logical target, `turbine_generator_axis`, and must not create separate turbine and generator motor targets. This mapping does not change Display App game states or events.
- OLED 4 owns the normal-play motor start. Its existing three-second Phase 2 completion callback sends exactly one explicit `turbine_generator_axis` `start` request alongside `VALVE_COMPLETE`; it does not delay or wait for the result. The adapter must not infer motor control from `VALVE_COMPLETE`.
- Screen 6 sends one explicit axis `stop` alongside pressed `ENERGY_SEND`. OLED 4, the only current production runtime `RESET` originator, sends explicit axis `stop` plus scene `sleep` alongside its existing inactivity reset. A future reset originator requires an explicit contract addition; the adapter never infers authority from the event.
- Commissioning confirms five independent Quido button-backlight targets—start, three languages, and send-energy—using the existing `set_state` contract. No button backlight belongs to a scene. Complex outline, chamber, flow, mirrored, and progress-column lighting remains exclusively scene-controlled, and no other binary target is authorized.
- Tepelni's backlit start push-button deliberately differs from Jaderna's unlit start lever. Preserve the current OLED 2 game flow: movement of any combustion wheel `1..3` wakes `sleep` into the fuel-selection state (internally `home`), where START is accepted. OLED 2 turns the start lamp on whenever it enters fuel selection, off on accepted START, and off when global reset returns it to `sleep`; the orchestrator does not initialize that lamp. OLED 2 controls language backlights only before accepted start, turns all three off at Phase 1 success, and restores the selected language on reset. Screen 6 turns the send-energy lamp on when it enters active from `VALVE_COMPLETE` and off on `ENERGY_SEND` or reset.
- OLED 2 alone has adapter permissions for start/language backlights; Screen 6 alone for send-energy. Page load/reconnect emits no backlight request, and every output request has its own UUID/result and remains independent from sibling motor/scene requests.
- The lighting contract has exactly one logical target, `tepelni_lighting`, and one normal Display App action, `activate_scene`, carrying an allowlisted symbolic scene id. Control App owns the scene-controller Device Type, Commands, State, Safety Rules, and runtime; the Driver owns zone mapping and S-Play/DMX translation. Display Apps and adapter must not expose physical zones, addresses, colors, brightness, pattern timing, or protocol payloads.
- Each symbolic scene is a complete declarative outcome, never a cumulative cue or overlay. The adapter, Control App, and Driver do not remember selected fuel or game phase, compose layers, or choose a scene from history.
- Any later Display App that needs to preserve fuel-specific lighting must be changed by the Display Apps programmer to receive/retain that fuel context and explicitly request the correct complete scene. The integration stack must fail validation rather than infer or repair missing game context.
- The strict fuel-qualified families are `combustion_coal|gas|biomass`, `combustion_complete_coal|gas|biomass`, and `generation_active_coal|gas|biomass`. OLED 2 may request the first two families at its existing game-start and success transitions. OLED 4 may request the generation family in its existing three-second completion callback only after Display App code propagates the selected fuel to it. Generic unqualified variants and default-fuel substitution are prohibited.
- The Tepelni scene allowlist is exactly 11 ids: `sleep`, `phase1_ready`, and the nine fuel-qualified ids above. `sleep` is the sole complete standby/reset/shutdown outcome; `phase1_ready` is chamber 2 bright white with every other region at baseline. Screen 6 requests `sleep` on `ENERGY_SEND`, OLED 4 requests it at its reset origin, and OLED 2 requests `phase1_ready` when wheel movement wakes `sleep` into fuel selection and on later local returns to that state. There are no other scene kinds.
- Colors, brightness, pulse rates, patterns, zone/address mapping, and progress duration are commissioned inside controller programs by the lighting programmer. Task 3's busless simulation configuration contains only symbolic-scene-to-program mappings, command timeout, and initialization scene `sleep`; concrete connection/transport settings remain later commissioned Driver configuration. No artistic/timing parameter appears in Display App requests or adapter profiles.
- `activate_scene` has immediate local-dispatch semantics: success means Control App's local sender successfully dispatched the configured program reference. Device State records the last commanded symbolic scene, never confirmed remote state; there is no later scene-completed result or `GAME_STATE`, and Display Apps do not wait for physical completion.
- The scene-controller capability and semantics are reusable for JadernaElektrarna. The exhibits use separate logical targets (`tepelni_lighting` and `jaderna_lighting`), Integration Profiles, sender permissions, and scene allowlists even where their physical choreography is similar.
- Commissioned Jaderna has four physical Quido button backlights—three language and send-energy—plus an unlit start lever. Its Version 7 simulation-only `start_button_lamp` reflects an earlier assumption and is not a production hardware fact. All physical button backlights remain excluded from `jaderna_lighting`.
- Task 3 preserves that legacy Jaderna fake solely for regression compatibility and adds no `jaderna_lighting` mapping or scene ids. Removal is a mandatory coordinated Jaderna Display App/profile/adapter-test/Chromium follow-up before production adapter enablement; the fake target must never be copied into production.
- Tepelni uses five stable logical button-lamp target names and the same Quido capability, adding its real backlit start button. Its sender/transition permissions remain source-owned by the Tepelni Display Apps rather than inferred merely from Jaderna similarity.
- Production retains WebSocket communication through one shared Exhibit Relay. OLED 2, OLED 4, Screen 6, and the adapter all use one configurable relay URL; localhost is a development default only. The adapter consumes Control App `/ws/state`, calls the public Control App HTTP API for commands, and returns results through the relay. Display Apps never connect directly to Control App.
- Do not deploy OLED 2's current RS-485/serial and asymmetric local/master bridge, and do not add per-display proxies. Retiring that connection layer must not change game messages, guards, ordering, collaboration, or state machines.
- WebSocket reconnect is transport recovery only: Display Apps retain local state; the adapter reconnects to relay and Control App state; no visitor press, request, `GAME_STATE`, motor/scene command, reset, or phase transition is replayed or synthesized. The existing bounded result outbox may deliver prior correlated results, and absolute inputs rebaseline under the established policy. Missed game-event synchronization belongs to the Display Apps programmer.
- Motor and lighting requests are independent, non-transactional commands with separate correlated results. An unavailable or failed target causes no integration-layer retry, rollback, compensation, inferred command, reset, or progression change. Display Apps keep their existing non-blocking flow; visitor-facing recovery belongs to their programmer, while Control App Safety Rules remain independently authoritative.
- Continued turbine/generator rotation is commissioned as non-harmful, so Version 8 adds no maximum-runtime rule. Control App startup and every motor-bus reconnect quick-stop and verify the motor before start readiness, never auto-resume, and never emit a relay/game/lighting transition. Explicit stop and emergency stop remain available.
- A separate Exhibit Lifecycle Orchestrator starts and stops components in dependency order. After it has independently ensured the controller and Control App are running, it explicitly dispatches `sleep` through the public Control App API; on controlled shutdown it does so before stopping them. Initial or recovered unknown local-sender state permits only explicit `sleep`, never restores the prior command, and remains unavailable if orchestration fails. The orchestrator initializes Display App game state separately; Control App never owns or changes it. Relay/adapter disconnect alone does not send lighting commands.
- After strict static profile validation, runtime availability is per input source and control target. Only an unavailable source is suppressed and individually rebaselined; healthy inputs continue. Unavailable output targets do not block inputs or other targets, and the requested unavailable target receives `target_unavailable`. No substitute input, release, reset, or phase is synthesized.
- Preserve existing reset scope exactly. OLED 2 overload/inactivity returns only itself to fuel selection and independently requests `phase1_ready` plus its start lamp on. OLED 4's existing pre-completion global-reset origin also requests motor `stop` and lighting `sleep`; receiving that reset makes OLED 2 request its start lamp off and restore its selected language lamp, while Screen 6 requests its energy-send lamp off. Reset receivers do not duplicate motor or scene requests. Screen 6 `ENERGY_SEND` adds motor stop, lighting sleep, and its lamp-off request without changing its current state or emitting reset; no new Screen 6/integration timeout exists.
- Raspberry Pi hosting and kiosk process supervision remain commissioning/deployment work outside Version 8 Task 1.

## Dynamic-lighting replacement

The coordinated Tepelni release removes `activate_scene` and the `tepelni_lighting` Adapter target. Adapter targets map typed lightbox values and configured programs to `tepelni_lighting`; validation is structural and never artistic or sender-authorizing. Mixed legacy/new releases are unsupported and rollback requires the matching Control App, Adapter, and all three Display Apps.
