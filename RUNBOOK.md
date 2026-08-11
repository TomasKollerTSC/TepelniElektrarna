# TepelniElektrarna Display App Runbook

This runbook covers local installation, development, production builds, static-bundle checks, and browser verification for the eight included Tepelni Display Apps. The parent repository now owns Raspberry Pi packaging and services in `docs/display-app-deployment.md`; touch calibration and production Integration Adapter configuration remain separate contracts.

## Inventory and development ports

| Folder | Purpose | Development URL | Relay |
| --- | --- | --- | --- |
| `screen_oled2/` | Front combustion and fuel-selection game | `http://localhost:3002/` | `ws://localhost:8765` by default |
| `screen_oled4/` | Front valve and turbine game | `http://localhost:3004/` | `ws://localhost:8765` by default |
| `screen_6/` | Front cooling and energy-send screen | `http://localhost:3006/` | `ws://localhost:8765` by default |
| `screen_2R/` | Boiler kiosk | `http://localhost:3021/` | none |
| `screen_4R/` | Heat-exchanger kiosk | `http://localhost:3041/` | none |
| `screen_7R/` | Turbine kiosk | `http://localhost:3071/` | none |
| `screen_8R/` | Energy-industry kiosk | `http://localhost:3081/` | none |
| `screen_10/` | Generator kiosk | `http://localhost:3100/` | none |

`server/` is the Exhibit Relay and listens on port `8765`. `screen_9/` is not a product Display App and is excluded from installation, builds, testing, and deployment.

## Locked installation and production build

Run from this repository root:

```bash
for app in screen_oled2 screen_oled4 screen_6 screen_2R screen_4R screen_7R screen_8R screen_10
do
  npm ci --no-audit --no-fund --prefix "$app"
  npm run build --prefix "$app"
done
```

Every app produces its own ignored `dist/` directory. The three front bundles read one build-time relay endpoint:

```bash
for app in screen_oled2 screen_oled4 screen_6
do
  VITE_EXHIBIT_RELAY_WS_URL=ws://192.168.55.20:8765 npm run build --prefix "$app"
done
```

Confirm that the configured URL is present in each built asset tree. For role metadata, source maps, immutable releases, and Raspberry Pi deployment, run the parent repository command, for example:

```bash
deploy/display/manage_display.sh build --role tepelni-screen_6 --release-id <release-id>
deploy/display/manage_display.sh deploy --role tepelni-screen_6 --host <display-pi> --release-dir output/display-releases/<release-id>
```

The parent tool bakes `ws://192.168.55.20:8765` into front roles and records this repository's exact commit. Do not use a Vite development server as the production kiosk baseline or copy this repository's `node_modules` to a Pi.

## Local development

Start the relay for front-app work:

```bash
npm ci --prefix server
npm start --prefix server
```

Start one app in another terminal, for example:

```bash
npm run dev --prefix screen_oled2
```

The relay exposes `GET /status` on port `8765`. Front apps use `VITE_EXHIBIT_RELAY_WS_URL=ws://localhost:8765` by default.

`screen_oled2/bridge.js` is legacy hardware-specific material and is not part of the included Display App runtime or the production integration boundary.

## Playback diagnostics

The three front apps report rejected audio playback and `AudioContext.resume` unlocks in the browser console as errors prefixed with the stable display id (`[screen_oled2]`, `[screen_oled4]`, or `[screen_6]`). Playback errors identify the `play` operation, cue id, source path, and rejection name/message; unlock errors identify `AudioContext.resume` and the rejection name/message. Successful playback and unlocks are not logged at error level.

## Rear-kiosk behavior contract

All five rear kiosks must:

- start on the touch-hint sleep screen;
- wake on touch/click, Space, or Enter;
- show complete initial content and imagery after wake;
- expose all four configured content cards and open them on touch/click;
- render Czech, English, and German content and images without failed requests;
- return from a content tab with the home control;
- return to sleep on Escape and after 120 seconds without activity;
- remain within the assigned viewport without document overflow.

Keyboard shortcuts are a development fallback: number keys open tabs and `L` cycles `cz -> en -> de -> cz`.

## Assigned browser viewports

| App | Effective viewport |
| --- | --- |
| `screen_oled2` | 1080×1920 |
| `screen_oled4` | 768×1366 |
| `screen_6` | 1920×1080 |
| `screen_2R` | 1080×1920 |
| `screen_4R` | 768×1366 |
| `screen_7R` | 2160×3840 |
| `screen_8R` | 1920×1080 |
| `screen_10` | 1920×1080 |

Portrait compositor direction (`90` or `270`) and physical touch calibration are field choices outside Task 2.

The deployed kiosk validates and applies only the saved four-field `techmania.display-profile.v1` before Chromium starts. It never reuses a calibration record or matrix from another panel. See the parent `docs/touch-calibration.md` and `docs/display-app-deployment.md` before installing a touch role.

## Browser acceptance

Serve generated `dist/` folders from ordinary static HTTP servers, not `file://` URLs. Reject uncaught errors, unexpected console errors, failed required requests, broken interaction or media, empty content, document overflow, or viewport mismatch.

The complete front simulation contract is run from the parent `techmania-control` checkout:

```bash
npm --prefix browser_acceptance run version-8-task-4
npm --prefix browser_acceptance run version-8-task-5
npm --prefix browser_acceptance run version-8
```

These tests start fake Control App hardware, the Integration Adapter, Exhibit Relay, and all three front apps. They prove game, request/result, reset, reconnect, and failure behavior but do not claim real-hardware or deployment acceptance.

See [DISPLAY_APP_RELEASE_AUDIT.md](DISPLAY_APP_RELEASE_AUDIT.md) for the latest recorded result.

## Version 9 Task 8 deployed rehearsal

On 2026-07-28 all eight included roles passed sequential immutable-release rehearsal on `en-display-rehearsal` against the simulation backend at `192.168.1.114`. The three front roles passed the coal/gas-qualified phase flows, exact scenes/motor/backlights, request/result correlation, reconnect/no-replay, reset ownership, duplicate suppression, and deliberate rejection. All five rear roles passed every card in Czech/English/German, image decoding, click and keyboard navigation, Escape, home, exact 120-second inactivity, and assigned-viewport overflow checks. Parent evidence is `output/task8-rehearsal/tepelni-*.json`.

Task 8 found that OLED 2's six parallel fetch-to-Blob video loads could fail on the Pi. Commit `0bd01ab5438eb465cbe9d954419aab6fe1273a99` streams direct same-origin video URLs so Chromium can use HTTP ranges. Generated `node_modules` trees are also intentionally untracked and guarded by a repository-hygiene test.

This does not accept real production relay reachability, motors/Quidos/lighting, audio hardware, portrait direction, 1366×768/4K output, or another panel's touch calibration; those remain field checks.

## Version 9 Task 9 field-release freeze

The field release is built only by the parent repository's `deploy/display/build_release.py`; do not rebuild an app directly during field deployment. The authoritative source commit, eight immutable release ids, manifest SHA-256 values, and per-file checksums are frozen in the parent `docs/version-9-field-release.json`. Verify that this repository is at that exact commit and clean before using the retained `output/display-releases/` directories.

Task 9's final gate found and fixed an Exhibit Relay reconnect collision: connections are now tracked by socket identity, so concurrent sockets with the same client label cannot overwrite or delete one another. The focused network regression and the original three-display reconnect/no-replay browser scenario are release gates.

Tomorrow's installation order, DHCP reservations, per-role host/profile/calibration procedure, health checks, diagnostics, and rollback commands are in the parent `docs/version-9-field-runbook.md`. Task 9 performs no Pi deployment or physical-hardware action.

Dynamic lighting has no reconnect restoration or retry. A reload or missed Relay event may leave the last physical command active; the responsible Display App programmer must issue a later explicit request or operator must run Exhibit Startup.
