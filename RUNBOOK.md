# TepelniElektrarna Display App Runbook

This runbook covers local installation, development, production builds, static-bundle checks, and browser verification for the eight included Tepelni Display Apps. It does not define Raspberry Pi deployment, kiosk services, touch calibration, or production Integration Adapter configuration.

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

Confirm that the configured URL is present in each built asset tree. The immutable release/build and Raspberry Pi serving procedure belongs to Version 9 Task 7; do not use a Vite development server as the production kiosk baseline.

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
