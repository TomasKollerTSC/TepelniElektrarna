# TepelniElektrarna Integration Plan

This plan defines the immediate path for understanding, running, and later integrating the TepelniElektrarna External Exhibit Apps.

The current priority is installation and display discovery. Control App integration is intentionally deferred until the client confirms the API-vs-source mismatches documented in `../API_IMPLEMENTATION_AUDIT.md` and summarized in `../API_CALL_BRIEF.md`.

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

### 4. Control App Compatibility Assessment

Compare source-confirmed behavior with current Control App capabilities.

Deliverables:

- supported needs already covered by Control App Device Types, Device State, and Commands
- missing event translation
- missing hardware behavior
- required Device Instance naming and Deployment Configuration shape
- fake/mock testability notes

### 5. Adapter Plan

Plan a Control App Integration Adapter only after the source contract is confirmed.

Decision options to compare:

- separate adapter beside Control App
- adapter module inside Control App
- relay changes only if unavoidable

Deferred until after client clarification.

## Known Risks

- The relay broadcasts parsed JSON to all clients and does not enforce documented message semantics.
- `screen_oled2` source uses numeric button id `1` for start, while docs describe `START`.
- `screen_6` uses `ENERGY_SEND`, which is not fully aligned with the Tepelni API section.
- Documented LED/MOTOR messages are not implemented in inspected source.
- `screen_oled2/bridge.js` may forward serial input only to the local React app, not the master relay.
- Existing `node_modules` can be stale or missing platform optional packages; run `npm install` in each app folder on the target machine.
- Some Vite shims may need executable permission restored after copy/install.

## Deferred Decisions

- Whether `START` should be numeric `1` or string `START`.
- Whether `ENERGY_SEND` is part of the official Tepelni contract.
- Whether LED/MOTOR integration belongs to External Exhibit Apps, Control App, or future supplier code.
- Whether Raspberry Pis should ultimately use Vite dev servers, Vite preview/static builds, or another local server.
