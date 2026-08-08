import { useState, useEffect, useRef, useCallback } from 'react';
import { T, FUEL_LABELS } from './Texts';
import { createSoundManager } from './soundManager';

const WS_URL = import.meta.env.VITE_EXHIBIT_RELAY_WS_URL || 'ws://localhost:8765';
const STEPS_TO_SWITCH = 18;
const FUEL_SELECTION_MIN_DELTA_DEGREES = 0.1;

const sendExhibitControl = (socket, target, action, value) => {
  if (socket?.readyState !== WebSocket.OPEN) {
    console.error(`[screen_oled2] EXHIBIT_CONTROL not sent: relay unavailable (${target}/${action})`);
    return null;
  }
  const requestId = crypto.randomUUID();
  const request = {
    type: 'request',
    name: 'EXHIBIT_CONTROL',
    request_id: requestId,
    sender: 'screen_oled2',
    target,
    action,
    value,
  };
  socket.send(JSON.stringify(request));
  console.info(`[screen_oled2] EXHIBIT_CONTROL request ${requestId}`, { target, action, value });
  return requestId;
};

const sm = createSoundManager({
  AUDIO_1: { src: '/a/AUDIO_1.mp3', loop: true,  channel: 'left',  volume: 0.3 },
  AUDIO_2: { src: '/a/AUDIO_2.mp3', loop: false, channel: 'left',  volume: 0.8 },
  AUDIO_3: { src: '/a/AUDIO_3.mp3', loop: false, channel: 'right', volume: 0.8 },
}, 'screen_oled2');
const FLAME_VOL = { 3: 0.3, 4: 0.3, 5: 0.6, 6: 0.6, 7: 1.0, 8: 1.0 };

const FUELS = ['coal', 'gas', 'biomass'];
const FUEL_IMAGES = ['/g/uhlí.png', '/g/plyn.png', '/g/biomasa.png'];
const FUEL_VIDEO_LETTERS = ['A', 'B', 'C'];
const FUEL_VIDEO_SUBDIRS = ['Uhlí', 'Plyn', 'Biomasa'];

const DEG_PER_PT = {
  coal:    [12, 12, 12],
  gas:     [20, 15, 15],
  biomass: [ 6, 10, 10],
};

const LANGUAGE_LAMP_TARGETS = {
  cz: 'language_cz_button_lamp',
  en: 'language_en_button_lamp',
  de: 'language_de_button_lamp',
};

const setLanguageLamps = (socket, selected) => {
  Object.entries(LANGUAGE_LAMP_TARGETS).forEach(([language, target]) => {
    sendExhibitControl(socket, target, 'set_state', language === selected);
  });
};

function videoPath(fuelIdx, state) {
  const dir = FUEL_VIDEO_SUBDIRS[fuelIdx];
  const letter = FUEL_VIDEO_LETTERS[fuelIdx];
  const space = fuelIdx === 1 ? ' ' : '';
  return `/v/${dir}/OLED2_${state}_${space}${letter}.mp4`;
}

function getZone(v) {
  if (v <= 60) return 'blue';
  if (v <= 120) return 'green';
  return 'red';
}

function angleDelta(prev, curr) {
  if (prev === null) return 0;
  let d = curr - prev;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

function getVideoState(gauges) {
  const [fuel, air, exhaust] = gauges;
  const avg = (fuel + air) / 2;
  const flameBase = avg <= 60 ? 3 : avg <= 120 ? 5 : 7;
  return exhaust <= 60 ? flameBase + 1 : flameBase;
}

export default function App() {
  const [screen, setScreen] = useState('sleep');
  const [language, setLanguage] = useState('cz');
  const [fuelIdx, setFuelIdx] = useState(0);
  const [gauges, setGauges] = useState([0, 0, 0]);
  const [showIntro, setShowIntro] = useState(true);
  const [warnActive, setWarnActive] = useState([false, false, false]);
  const [overloadActive, setOverloadActive] = useState(false);
  const [stoppedMsg, setStoppedMsg] = useState(false);
  const ws = useRef(null);
  const wsTimer = useRef(null);
  const prevAngles = useRef([null, null, null]);
  const dangerStart = useRef([null, null, null]);
  const overloadStart = useRef(null);
  const greenStart = useRef(null);
  const lastActivity = useRef(Date.now());
  const decayTimer = useRef(null);
  const screenRef = useRef(screen);
  const languageRef = useRef(language);
  const fuelIdxRef = useRef(fuelIdx);
  const gaugesRef = useRef(gauges);
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const activeSlot = useRef('A');
  const videoCache = useRef({});
  const currentVideoState = useRef(null);
  const videoSwitchTimer = useRef(null);
  const simAngles = useRef([180, 180, 180]);
  const sleepImgRef = useRef(null);
  const fuelSteps = useRef(0);
  const anyWheelTouched = useRef(false);

  useEffect(() => { screenRef.current = screen; }, [screen]);
  useEffect(() => { languageRef.current = language; }, [language]);
  useEffect(() => { fuelIdxRef.current = fuelIdx; }, [fuelIdx]);
  useEffect(() => { gaugesRef.current = gauges; }, [gauges]);

  // ── AUDIO ──
  const prevOverload = useRef(false);
  const prevScreen = useRef(screen);
  useEffect(() => {
    if (screen === 'game' || screen === 'success') {
      sm.unlock();
      sm.play('AUDIO_1');
      if (screen === 'success') sm.volume('AUDIO_1', 0.6);
      if (screen === 'success' && prevScreen.current !== 'success') sm.play('AUDIO_3');
    } else {
      sm.stopAll({ fadeMs: 200 });
    }
    prevScreen.current = screen;
  }, [screen]);

  useEffect(() => {
    if (overloadActive && !prevOverload.current) sm.play('AUDIO_2');
    prevOverload.current = overloadActive;
  }, [overloadActive]);

  // ── SCREENSAVER BOUNCE (direct DOM, no React re-renders) ──
  useEffect(() => {
    if (screen !== 'sleep') return;
    let vx = (Math.random() > 0.5 ? 1 : -1) * 2.5;
    let vy = (Math.random() > 0.5 ? 1 : -1) * 1.5;
    let x = 0, y = 0, rafId;

    const tick = () => {
      const img = sleepImgRef.current;
      if (!img) return;
      x += vx; y += vy;
      const mX = window.innerWidth - img.offsetWidth;
      const mY = window.innerHeight - img.offsetHeight;
      if (x <= 0)  { x = 0;  vx =  Math.abs(vx); }
      if (x >= mX) { x = mX; vx = -Math.abs(vx); }
      if (y <= 0)  { y = 0;  vy =  Math.abs(vy); }
      if (y >= mY) { y = mY; vy = -Math.abs(vy); }
      img.style.transform = `translate(${x}px, ${y}px)`;
      rafId = requestAnimationFrame(tick);
    };

    const t = setTimeout(() => {
      const img = sleepImgRef.current;
      if (!img) return;
      x = Math.random() * (window.innerWidth - img.offsetWidth);
      y = Math.random() * (window.innerHeight - img.offsetHeight);
      rafId = requestAnimationFrame(tick);
    }, 50);

    return () => { clearTimeout(t); cancelAnimationFrame(rafId); };
  }, [screen]);

  // ── DECAY ──
  const stopDecay = useCallback(() => clearInterval(decayTimer.current), []);

  const startDecay = useCallback(() => {
    stopDecay();
    decayTimer.current = setInterval(() => {
      setGauges(prev => prev.map(v => Math.max(0, v - 12)));
    }, 2000);
  }, [stopDecay]);

  const goHome = useCallback(() => {
    stopDecay();
    sendExhibitControl(ws.current, 'tepelni_lighting', 'activate_scene', 'phase1_ready');
    sendExhibitControl(ws.current, 'start_button_lamp', 'set_state', true);
    setScreen('home');
    setGauges([0, 0, 0]);
    setWarnActive([false, false, false]);
    setOverloadActive(false);
    setStoppedMsg(false);
    greenStart.current = null;
    overloadStart.current = null;
    dangerStart.current = [null, null, null];
    prevAngles.current = [null, null, null];
    fuelSteps.current = 0;
    anyWheelTouched.current = false;
  }, [stopDecay]);

  // ── ZONE TIMING (warnings + win) ──
  useEffect(() => {
    if (screen !== 'game') return;
    const id = setInterval(() => {
      const now = Date.now();
      const g = gaugesRef.current;
      const zones = g.map(getZone);
      const allGreen = zones.every(z => z === 'green');

      if (allGreen) {
        if (!greenStart.current) greenStart.current = now;
        else if (now - greenStart.current >= 5000) {
          stopDecay();
          const fuel = FUELS[fuelIdxRef.current];
          sendExhibitControl(
            ws.current,
            'tepelni_lighting',
            'activate_scene',
            `combustion_complete_${fuel}`,
          );
          setLanguageLamps(ws.current, null);
          setScreen('success');
          ws.current?.send(JSON.stringify({
            type: 'trigger', name: 'GAME_STATE', id: 1,
            data: { state: 'COMBUSTION_COMPLETE', fuel },
          }));
          return;
        }
      } else {
        greenStart.current = null;
      }

      if (!anyWheelTouched.current) {
        setWarnActive([false, false, false]);
        dangerStart.current = [null, null, null];
      } else {
        setWarnActive(zones.map((zone, i) => {
          if (zone !== 'green') {
            if (!dangerStart.current[i]) dangerStart.current[i] = now;
            return (now - dangerStart.current[i]) >= 3000;
          }
          dangerStart.current[i] = null;
          return false;
        }));
      }

      const anyRed = zones.some(z => z === 'red');
      if (anyRed) {
        if (!overloadStart.current) overloadStart.current = now;
        const elapsed = now - overloadStart.current;
        if (elapsed >= 10000) {
          stopDecay();
          setStoppedMsg(true);
          setGauges([0, 0, 0]);
          setTimeout(() => goHome(), 3000);
        } else if (elapsed >= 5000) {
          setOverloadActive(true);
        }
      } else {
        overloadStart.current = null;
        setOverloadActive(false);
      }
    }, 500);
    return () => clearInterval(id);
  }, [screen, stopDecay, goHome]);

  // ── INACTIVITY TIMEOUT (30s) ──
  useEffect(() => {
    if (screen !== 'game') return;
    const id = setInterval(() => {
      if (Date.now() - lastActivity.current > 30000) goHome();
    }, 5000);
    return () => clearInterval(id);
  }, [screen, goHome]);

  // ── VIDEO MANAGEMENT (streamed URLs + dual-video swap) ──
  // Keep direct same-origin URLs so Chromium can range-stream the active videos
  // without buffering all six large files into renderer-owned Blobs.
  useEffect(() => {
    if (screen !== 'game' && screen !== 'success') {
      videoCache.current = {};
      currentVideoState.current = null;
      activeSlot.current = 'A';
      [videoARef, videoBRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.removeAttribute('src');
          ref.current.load();
        }
      });
      return;
    }
    if (screen !== 'game') return;

    const fuel = fuelIdxRef.current;
    videoCache.current = Object.fromEntries(
      [3, 4, 5, 6, 7, 8].map(state => [state, videoPath(fuel, state)]),
    );
    const initState = getVideoState(gaugesRef.current);
    currentVideoState.current = initState;
    const el = videoARef.current;
    if (el && videoCache.current[initState]) {
      el.src = videoCache.current[initState];
      el.style.zIndex = '2';
      el.play().catch(() => {});
    }
    if (videoBRef.current) videoBRef.current.style.zIndex = '1';

    return () => {
      clearTimeout(videoSwitchTimer.current);
    };
  }, [screen]);

  // Debounced dual-video swap — old video stays visible until new one is decoded
  useEffect(() => {
    if (screen !== 'game') return;

    clearTimeout(videoSwitchTimer.current);
    videoSwitchTimer.current = setTimeout(() => {
      const newState = getVideoState(gauges);

      if (newState === currentVideoState.current) return;
      if (!videoCache.current[newState]) return;

      currentVideoState.current = newState;
      if (screen === 'game' && FLAME_VOL[newState] != null) sm.volume('AUDIO_1', FLAME_VOL[newState]);
      const isA = activeSlot.current === 'A';
      const next = isA ? videoBRef.current : videoARef.current;
      const curr = isA ? videoARef.current : videoBRef.current;
      if (!next || !curr) return;

      next.src = videoCache.current[newState];
      next.oncanplay = () => {
        next.oncanplay = null;
        next.play().catch(() => {});
        next.style.zIndex = '2';
        curr.style.zIndex = '1';
        curr.pause();
        activeSlot.current = isA ? 'B' : 'A';
      };
      next.load();
    }, 300);

    return () => clearTimeout(videoSwitchTimer.current);
  }, [gauges, screen]);

  // ── MESSAGE HANDLER ──
  const handleMessage = useCallback((msg) => {
    if (msg.type === 'result' && msg.name === 'EXHIBIT_CONTROL') {
      if (msg.recipient === 'screen_oled2') {
        const method = msg.status === 'rejected' || msg.status === 'failed' ? 'error' : 'info';
        console[method](`[screen_oled2] EXHIBIT_CONTROL result ${msg.request_id}`, msg);
      }
      return;
    }

    if (msg.type !== 'trigger') return;

    // Reset all screens to initial state
    if (msg.name === 'GAME_STATE' && msg.data?.state === 'RESET') {
      stopDecay();
      sendExhibitControl(ws.current, 'start_button_lamp', 'set_state', false);
      setLanguageLamps(ws.current, languageRef.current);
      setScreen('sleep');
      fuelIdxRef.current = 0;
      setFuelIdx(0);
      setGauges([0, 0, 0]);
      setShowIntro(true);
      setWarnActive([false, false, false]);
      setOverloadActive(false);
      setStoppedMsg(false);
      greenStart.current = null;
      overloadStart.current = null;
      dangerStart.current = [null, null, null];
      prevAngles.current = [null, null, null];
      fuelSteps.current = 0;
      anyWheelTouched.current = false;
      return;
    }

    if (msg.name === 'BUTTON' && msg.data?.pressed) {
      const selectedLanguage = {
        LANG_CZ: 'cz',
        LANG_EN: 'en',
        LANG_DE: 'de',
      }[msg.id];
      if (selectedLanguage) {
        languageRef.current = selectedLanguage;
        setLanguage(selectedLanguage);
        if (screenRef.current === 'sleep' || screenRef.current === 'home') {
          setLanguageLamps(ws.current, selectedLanguage);
        }
      }
      if (msg.id === 1 && screenRef.current === 'home') {
        const fuel = FUELS[fuelIdxRef.current];
        sendExhibitControl(
          ws.current,
          'tepelni_lighting',
          'activate_scene',
          `combustion_${fuel}`,
        );
        sendExhibitControl(ws.current, 'start_button_lamp', 'set_state', false);
        setScreen('game');
        setShowIntro(true);
        setGauges([0, 0, 0]);
        prevAngles.current = [null, null, null];
        dangerStart.current = [null, null, null];
        greenStart.current = null;
        overloadStart.current = null;
        lastActivity.current = Date.now();
        anyWheelTouched.current = false;
        startDecay();
      }
    }

    if (msg.name === 'WHEEL') {
      const angle = msg.data?.angle ?? 0;
      const idx = msg.id - 1;
      if (idx < 0 || idx > 2) return;

      if (screenRef.current === 'sleep') {
        prevAngles.current[idx] = angle;
        sendExhibitControl(ws.current, 'tepelni_lighting', 'activate_scene', 'phase1_ready');
        sendExhibitControl(ws.current, 'start_button_lamp', 'set_state', true);
        setScreen('home');
        return;
      }

      if (screenRef.current === 'home' && idx === 0) {
        const step = msg.data?.step;
        if (step !== undefined) {
          fuelSteps.current += step > 0 ? 1 : -1;
        } else {
          const delta = angleDelta(prevAngles.current[0], angle);
          prevAngles.current[0] = angle;
          if (Math.abs(delta) < FUEL_SELECTION_MIN_DELTA_DEGREES) return;
          fuelSteps.current += delta > 0 ? 1 : -1;
        }
        if (fuelSteps.current >= STEPS_TO_SWITCH) {
          fuelSteps.current = 0;
          setFuelIdx(prev => {
            const next = (prev + 1) % 3;
            fuelIdxRef.current = next;
            return next;
          });
        } else if (fuelSteps.current <= -STEPS_TO_SWITCH) {
          fuelSteps.current = 0;
          setFuelIdx(prev => {
            const next = (prev + 2) % 3;
            fuelIdxRef.current = next;
            return next;
          });
        }
        return;
      }

      if (screenRef.current === 'game') {
        lastActivity.current = Date.now();
        setShowIntro(false);
        anyWheelTouched.current = true;
        const delta = angleDelta(prevAngles.current[idx], angle);
        prevAngles.current[idx] = angle;
        const ptDelta = delta / DEG_PER_PT[FUELS[fuelIdxRef.current]][idx];
        setGauges(prev => {
          const next = [...prev];
          next[idx] = idx === 0
            ? Math.min(180, Math.max(0, next[0] + Math.max(0, ptDelta)))
            : Math.min(180, Math.max(0, next[idx] + ptDelta));
          return next;
        });
      }
    }
  }, [startDecay, stopDecay]);

  // ── WEBSOCKET ──
  useEffect(() => {
    let disposed = false;
    let socket = null;
    const connect = () => {
      socket = new WebSocket(WS_URL);
      socket.onopen = () => console.log('WS connected');
      socket.onmessage = (e) => { try { handleMessage(JSON.parse(e.data)); } catch {} };
      socket.onclose = () => {
        if (disposed) return;
        clearTimeout(wsTimer.current);
        wsTimer.current = setTimeout(connect, 2000);
      };
      ws.current = socket;
    };
    connect();
    return () => {
      disposed = true;
      socket?.close();
      clearTimeout(wsTimer.current);
      stopDecay();
    };
  }, [handleMessage, stopDecay]);

  // ── KEYBOARD SIMULATOR ──
  useEffect(() => {
    const STEP = 20;
    const send = (msg) => ws.current?.send(JSON.stringify(msg));
    const wheel = (id, idx) => {
      simAngles.current[idx] = (simAngles.current[idx] + STEP + 360) % 360;
      send({ type: 'trigger', name: 'WHEEL', id, data: { angle: simAngles.current[idx], step: 1 } });
    };
    const wheelBack = (id, idx) => {
      simAngles.current[idx] = (simAngles.current[idx] - STEP + 360) % 360;
      send({ type: 'trigger', name: 'WHEEL', id, data: { angle: simAngles.current[idx], step: -1 } });
    };
    const onKey = (e) => {
      sm.unlock();
      switch (e.key) {
        case 'ArrowLeft':  case 'a': case 'A': wheelBack(1, 0); break;
        case 'ArrowRight': case 'd': case 'D': wheel(1, 0);     break;
        case 'w': case 'W':                    wheel(2, 1);     break;
        case 's': case 'S':                    wheelBack(2, 1); break;
        case 'ArrowUp':                        wheel(3, 2);     break;
        case 'ArrowDown':                      wheelBack(3, 2); break;
        case ' ': case 'Enter':
          e.preventDefault();
          send({ type: 'trigger', name: 'BUTTON', id: 1, data: { pressed: true } });
          break;
        case '1': send({ type: 'trigger', name: 'BUTTON', id: 'LANG_CZ', data: { pressed: true } }); break;
        case '2': send({ type: 'trigger', name: 'BUTTON', id: 'LANG_EN', data: { pressed: true } }); break;
        case '3': send({ type: 'trigger', name: 'BUTTON', id: 'LANG_DE', data: { pressed: true } }); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const lang = T[language];

  // ── SLEEP ──
  if (screen === 'sleep') {
    return (
      <div className="screen sleep">
        <img ref={sleepImgRef} className="sleep-logo" src="/g/TE_S1.png" alt="" />
      </div>
    );
  }

  // ── HOME ──
  if (screen === 'home') {
    return (
      <div className="screen home">
        <div className="home-inner">
          <h1 className="select-title">{lang.selectFuel}</h1>
          <div className="fuel-columns">
            {FUELS.map((f, i) => (
              <div key={f} className="fuel-column">
                <div className={`fuel-card ${i === fuelIdx ? 'selected' : ''}`}>
                  <img src={FUEL_IMAGES[i]} alt={FUEL_LABELS[language][i]} className="fuel-img" />
                </div>
                <span className="fuel-name">{FUEL_LABELS[language][i]}</span>
                <div className="wheel-icon">
                  <img
                    className={i === 0 ? 'wheel-active' : 'wheel-inactive'}
                    src={i === 0 ? '/g/TE_kola se šipkami.png' : '/g/navrh_obrazovky_tepelna_elektrarna-10.png'}
                    alt=""
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="start-area">
            <p className="start-title">{lang.startBtn}</p>
            <p className="start-sub">{lang.startSub}</p>
          </div>
        </div>
        <div className="side-arrow">
          <img src="/g/TE_OLED 2_šipka.png" alt="" />
        </div>
      </div>
    );
  }

  // ── GAME + SUCCESS ──
  const zones = gauges.map(getZone);

  return (
    <div className="screen game">
      <video ref={videoARef} className="game-video" preload="auto" loop muted playsInline />
      <video ref={videoBRef} className="game-video" preload="auto" loop muted playsInline />

      <div className="game-overlay">
        {stoppedMsg && (
          <div className="stopped-overlay">
            <p>{lang.stopped}</p>
          </div>
        )}

        <div className="wheel-row-game">
          {screen === 'success' && (
            <p className="success-title">{lang.success}</p>
          )}
          {screen !== 'success' && showIntro && (
            <>
              <p className="intro-title">{lang.gameIntro}</p>
              <div className="wheels-imgs">
                <img src="/g/TE_kola se šipkami.png" alt="" className="wheels-img" />
                <img src="/g/TE_kola se šipkami.png" alt="" className="wheels-img" />
                <img src="/g/TE_kola se šipkami.png" alt="" className="wheels-img" />
              </div>
            </>
          )}
        </div>

        {!stoppedMsg && (
          <div className="warn-area">
            {overloadActive && (
              <div className="warn-msg overload">{lang.overload}</div>
            )}
            {!overloadActive && warnActive.map((active, i) => active && (
              <div key={i} className="warn-msg">
                {zones[i] === 'blue' ? lang.warnBlue[i] : lang.warnRed[i]}
              </div>
            ))}
          </div>
        )}

        <div className="gauges-row">
          {gauges.map((val, i) => (
            <div key={i} className="gauge-col">
              <div className="gauge-bar">
                <div
                  className="gauge-marker"
                  style={{ bottom: `${(val / 180) * 100}%` }}
                />
                {zones[i] === 'green' && (
                  <div className="gauge-check">✓</div>
                )}
              </div>
              <div className="gauge-label">{lang.params[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
