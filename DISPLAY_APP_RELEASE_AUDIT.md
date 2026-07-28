# Version 9 Task 2 — Tepelni Display App Release Audit

Audit date: 2026-07-27

Scope: only `screen_oled2`, `screen_oled4`, `screen_6`, `screen_2R`, `screen_4R`, `screen_7R`, `screen_8R`, and `screen_10`. `screen_9`, adapter work, calibration, deployment tooling, and later Version 9 tasks were excluded. Existing functional artwork was accepted unless broken or missing.

## Repository-resolvable blockers fixed

- Added bundled initial imagery and credits to the previously empty 2R and 4R wake-content media frames.
- Added explicit empty data favicons to all eight included apps, eliminating unnecessary `/favicon.ico` failures from static production serving.

No supplied functional artwork was replaced or redesigned.

## Acceptance result

The complete Task 2 software gate passed on 2026-07-27:

| Gate | Result |
| --- | --- |
| `npm ci` from each app's committed lockfile | passed for all 8 |
| `npm run build` production bundle | passed for all 8 |
| Configured relay URL embedded in each front bundle | passed for all 3 |
| Static HTTP production-bundle startup | passed for all 8 |
| Uncaught error and console-error monitoring | passed for all 8 |
| Required asset, media, and font request monitoring | passed for all 8 |
| Exact assigned viewport and document-overflow checks | passed for all 8 |
| Front production-bundle relay and initial runtime | passed for all 3 |
| Focused Tepelni front integration contracts | passed, `1 + 4 tests` |
| Complete Tepelni fuel/reset/reconnect browser matrix | passed, `2 tests` |
| Rear touch/click wake and all four content tabs | passed for all 5 |
| Rear Czech/English/German language switching | passed for all 5 |
| Rear home, Escape, keyboard wake/tab fallbacks | passed for all 5 |
| Rear 120-second inactivity return | passed for all 5 |
| Rear initial/tab image decoding and nonempty content | passed for all 5 |

The front integration gate covered coal, gas, and biomass progression; exact scene, motor, and five lamp requests; correlated results; fake effects; duplicate suppression; local and global reset; reconnect without replay; unavailable/rejected command behavior; and rendered phase transitions across all three front apps.

The recorded results are development-machine evidence and do not claim Raspberry Pi deployment or physical-panel acceptance. Transient screenshots and runner output are not release artifacts.

No content or supplier blocker remains for the eight included Tepelni Display Apps.

## Scope boundary

This audit did not add or alter adapter profiles, hardware mappings, calibration, Raspberry Pi services, build/deployment tooling, production network configuration, or `screen_9`.

## Task 8 deployed follow-up

All eight included apps subsequently passed the 2026-07-28 Raspberry Pi immutable-production-bundle rehearsal recorded by the parent repository. Task 8 fixed OLED 2's renderer-heavy six-video Blob preload: direct same-origin media URLs now use the production server's byte-range responses and completed the full coal path without console, request, or media failures. The fix is regression-covered at source commit `0bd01ab5438eb465cbe9d954419aab6fe1273a99`.

The deployed follow-up also proved manifests/checksums/source maps, loaded-entry freshness, front request/result and reset ownership, rear multilingual interaction, per-role restart, and no unexpected browser failures. Transient viewport/endpoint mapping makes this software rehearsal evidence, not physical acceptance for non-native panels, audio, production networking, or exhibit hardware. `screen_9` remained excluded.
