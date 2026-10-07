#!/usr/bin/env python3
"""Initialize lighting 120 s and 300 s after the S-Play (re)appears; companion to boot_lighting.py.

A ping only proves the S-Play PC's network is up, not its player, so one early initialize can be lost."""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import subprocess
import time
from urllib.request import Request, urlopen

TARGETS = {
    "gravitacni": ("10.42.134.12", "gravity_battery_lighting"),
    "jaderna": ("10.42.131.12", "lighting"),
    "jaderna-fuze": ("10.42.132.12", "tokamak_lighting"),
    "tepelni": ("10.42.133.12", "tepelni_lighting"),
}
INIT_AFTER_S = (120, 300)
POLL_S = 5
DOWN_AFTER_MISSES = 3  # ~15 s of silence counts as the S-Play going away
STATE_FILE = Path("/var/lib/techmania/lighting-watch/latest.json")


def log(event: str, **context: object) -> None:
    print(json.dumps({"event": event, **context}), flush=True)


def ping_host(host: str) -> bool:
    try:
        return subprocess.run(["/bin/ping", "-n", "-c", "1", "-W", "1", host],
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=5).returncode == 0
    except subprocess.TimeoutExpired:
        return False


def post_initialization(url: str) -> dict:
    request = Request(url, data=b"{}", headers={"Content-Type": "application/json"}, method="POST")
    with urlopen(request, timeout=60) as response:
        return json.load(response)


def record(state_file: Path, **state: object) -> None:
    state["recorded_at"] = datetime.now(timezone.utc).isoformat()
    try:
        state_file.parent.mkdir(parents=True, exist_ok=True)
        tmp = state_file.with_name(f".{state_file.name}.{os.getpid()}.tmp")
        tmp.write_text(json.dumps(state, indent=2) + "\n")
        os.replace(tmp, state_file)
    except OSError as exc:
        log("state_write_failed", error=str(exc))


def watch(exhibit: str, *, ping=ping_host, post=post_initialization, clock=time.monotonic,
          sleep=time.sleep, state_file: Path = STATE_FILE, max_loops: int | None = None) -> None:
    host, target = TARGETS[exhibit]
    url = f"http://127.0.0.1:8000/api/scene-controllers/{target}/controls/initialize"
    # Already up at start (install, or the master rebooted alone): its player is running and the
    # boot service covers a master boot, so only a later reappearance triggers initializes.
    up, misses, appeared_at, pending = ping(host), 0, None, []
    log("watching", host=host, splay_up=up)
    loops = 0
    while max_loops is None or loops < max_loops:
        loops += 1
        if ping(host):
            misses = 0
            if not up:
                up, appeared_at, pending = True, clock(), list(INIT_AFTER_S)
                log("splay_appeared", host=host)
        else:
            misses += 1
            if up and misses >= DOWN_AFTER_MISSES:
                up, pending = False, []
                log("splay_gone", host=host)
        if up and pending and clock() - appeared_at >= pending[0]:
            after = pending.pop(0)
            try:
                response = post(url)
                ok = isinstance(response, dict) and response.get("ok") is True and response.get("outcome") == "sent"
            except Exception as exc:  # the next appearance or pass retries
                ok, response = False, str(exc)
            log("initialized" if ok else "initialize_failed", after_s=after, target=target)
            record(state_file, exhibit=exhibit, splay_host=host, device_id=target, after_s=after,
                   result="dispatched" if ok else "failed", detail=None if ok else str(response)[:200])
        sleep(POLL_S)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--exhibit", choices=tuple(TARGETS), required=True)
    watch(parser.parse_args().exhibit)
