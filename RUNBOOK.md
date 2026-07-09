# TepelniElektrarna Runbook

This runbook documents how to run the TepelniElektrarna External Exhibit Apps locally without the Control App.

Immediate scope: installability, display validation, local ports, and known setup issues. Control App integration is out of scope.

## Current App Inventory

### Exhibit Relay

| Folder | Purpose | Local port | Notes |
| --- | --- | ---: | --- |
| `server/` | Node.js WebSocket relay plus HTTP `/status` endpoint | `8765` | Parses incoming JSON and broadcasts it to all connected clients. |

### Front Display Apps

| Folder | Purpose | Local URL | WebSocket |
| --- | --- | --- | --- |
| `screen_oled2/` | Phase 1 combustion/fuel game | `http://localhost:3002/` | Connects to `ws://localhost:8765`. |
| `screen_oled4/` | Phase 2 valve/wheel game | `http://localhost:3004/` | Connects to `ws://localhost:8765`. |
| `screen_6/` | Phase 3 cooling/energy-send screen | `http://localhost:3006/` | Connects to `ws://localhost:8765`. |
| `screen_9/` | Front LED/progress style panel | `http://localhost:3009/` | Opens WebSocket and logs messages; source semantics are minimal. |

### Back Kiosk Display Apps

| Folder | Local URL | Notes |
| --- | --- | --- |
| `screen_2R/` | `http://localhost:3021/` | Standalone information kiosk. |
| `screen_4R/` | `http://localhost:3041/` | Standalone information kiosk. |
| `screen_7R/` | `http://localhost:3071/` | Standalone information kiosk. |
| `screen_8R/` | `http://localhost:3081/` | Standalone information kiosk. |
| `screen_10/` | `http://localhost:3100/` | Standalone information kiosk. |

## Local Prerequisites

Verified locally on 2026-07-09 with:

- Node.js `v26.4.0`
- npm `11.17.0`

For Raspberry Pi, use Node.js LTS rather than relying on the local desktop version.

## Install Dependencies

Run `npm install` in every app folder on the target machine:

```bash
cd external_apps/TepelniElektrarna/server
npm install

cd ../screen_oled2
npm install

cd ../screen_oled4
npm install

cd ../screen_6
npm install

cd ../screen_9
npm install

cd ../screen_2R
npm install

cd ../screen_4R
npm install

cd ../screen_7R
npm install

cd ../screen_8R
npm install

cd ../screen_10
npm install
```

Known install notes:

- Existing copied `node_modules` may be stale. Re-run `npm install` on the target machine to restore platform-specific optional packages such as Rollup native packages.
- If `npm run dev` fails with `Permission denied` for `node_modules/.bin/vite`, restore execute permission:

```bash
find external_apps/TepelniElektrarna -path '*/node_modules/.bin/vite' -exec chmod +x {} +
```

- npm reported vulnerabilities during local install. Do not run `npm audit fix` before the client call; that could change dependency versions and introduce unrelated risk.

## Run Apps One By One

Open a separate terminal per app.

### Exhibit Relay

```bash
cd external_apps/TepelniElektrarna/server
npm run dev
```

Expected check:

```bash
curl -s http://127.0.0.1:8765/status
```

Expected shape:

```json
{"connected":0,"clients":[]}
```

### Front Apps

```bash
cd external_apps/TepelniElektrarna/screen_oled2
npm run dev
# http://localhost:3002/
```

```bash
cd external_apps/TepelniElektrarna/screen_oled4
npm run dev
# http://localhost:3004/
```

```bash
cd external_apps/TepelniElektrarna/screen_6
npm run dev
# http://localhost:3006/
```

```bash
cd external_apps/TepelniElektrarna/screen_9
npm run dev
# http://localhost:3009/
```

### Back Kiosk Apps

```bash
cd external_apps/TepelniElektrarna/screen_2R
npm run dev
# http://localhost:3021/
```

```bash
cd external_apps/TepelniElektrarna/screen_4R
npm run dev
# http://localhost:3041/
```

```bash
cd external_apps/TepelniElektrarna/screen_7R
npm run dev
# http://localhost:3071/
```

```bash
cd external_apps/TepelniElektrarna/screen_8R
npm run dev
# http://localhost:3081/
```

```bash
cd external_apps/TepelniElektrarna/screen_10
npm run dev
# http://localhost:3100/
```

## Useful Local Full Setup

For display validation, run:

- relay: `server` on `8765`
- front apps: `3002`, `3004`, `3006`, `3009`
- back kiosks: `3021`, `3041`, `3071`, `3081`, `3100`

Local smoke check performed on 2026-07-09:

| URL | Result |
| --- | --- |
| `http://127.0.0.1:8765/status` | `200` with relay JSON using `GET` |
| `http://127.0.0.1:3002` | `200 OK` |
| `http://127.0.0.1:3004` | `200 OK` |
| `http://127.0.0.1:3006` | `200 OK` |
| `http://127.0.0.1:3009` | `200 OK` |
| `http://127.0.0.1:3021` | `200 OK` |
| `http://127.0.0.1:3041` | `200 OK` |
| `http://127.0.0.1:3071` | `200 OK` |
| `http://127.0.0.1:3081` | `200 OK` |
| `http://127.0.0.1:3100` | `200 OK` |

## Raspberry Pi Validation Notes

Recommended first-pass deployment:

- Run one app per Pi/display where practical.
- Use `npm run dev` first for validation.
- Open Chromium in kiosk mode to the local app URL.
- Keep the relay reachable at `ws://<relay-pi-ip>:8765`.

Important: the source uses `ws://localhost:8765` in front apps. If the relay is on a different Pi, the WebSocket URL must be adjusted or the app must be served on the same Pi as the relay/bridge that exposes `localhost:8765`.

Validate on each display:

- correct resolution and orientation
- touch input maps to the visible screen
- videos/images/fonts load
- audio can autoplay where needed
- browser does not show permission or crash restore prompts
- relay `/status` shows connected clients after pages open

## Open Questions For Client/Supplier

- Is the exhibit folder name `TepelniElektrarna` the canonical technical name even though some docs/files use `TepelnaElektrarna`?
- Should start be sent as numeric id `1` or string id `START`?
- Is `ENERGY_SEND` part of the official message contract?
- Should `screen_oled2/bridge.js` forward hardware-origin events to the master relay?
- Are documented LED/MOTOR messages future requirements or stale documentation?
