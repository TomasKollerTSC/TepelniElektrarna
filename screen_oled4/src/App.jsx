import { useState, useEffect, useRef, useCallback } from 'react';
import { createLightingSequence } from '../../shared/lightingSequence';
import { startValve, completeValve } from '../../shared/gameLighting';
import { T } from './Texts';
import { createSoundManager } from './soundManager';

const WS_URL = import.meta.env.VITE_EXHIBIT_RELAY_WS_URL || 'ws://localhost:8765';
const MAX_STEPS = 15;
const INACTIVITY_MS = 20000;
const FUELS = new Set(['coal', 'gas', 'biomass']);

const sendExhibitControl = (socket, target, action, value) => {
  if (socket?.readyState !== WebSocket.OPEN) {
    console.error(`[screen_oled4] EXHIBIT_CONTROL not sent: relay unavailable (${target}/${action})`);
    return null;
  }
  const requestId = crypto.randomUUID();
  const request = {
    type: 'request',
    name: 'EXHIBIT_CONTROL',
    request_id: requestId,
    sender: 'screen_oled4',
    target,
    action,
    ...(value === undefined ? {} : { value }),
  };
  socket.send(JSON.stringify(request));
  console.info(`[screen_oled4] EXHIBIT_CONTROL request ${requestId}`, { target, action, value });
  return requestId;
};

const sm = createSoundManager({
  AUDIO_3: { src: '/a/AUDIO_3.mp3', loop: false, channel: 'right', volume: 0.8 },
  AUDIO_4: { src: '/a/AUDIO_4.mp3', loop: true,  channel: 'right', volume: 1.0 },
  AUDIO_5: { src: '/a/AUDIO_5.mp3', loop: true,  channel: 'right', volume: 1.0 },
  AUDIO_6: { src: '/a/AUDIO_6.mp3', loop: true,  channel: 'right', volume: 0.5 },
}, 'screen_oled4');

function angleDelta(prev, curr) {
  if (prev === null) return 0;
  let d = curr - prev;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

export default function App() {
  const [screen, setScreen] = useState('sleep'); // sleep | active
  const [language, setLanguage] = useState('cz');
  const [step, setStep] = useState(0);
  const [showTurbineMsg, setShowTurbineMsg] = useState(false);
  const [videoPhase, setVideoPhase] = useState('intro'); // intro | idle | open

  const ws = useRef(null);
  const wsTimer = useRef(null);
  const lighting = useRef(null);
  if (!lighting.current) lighting.current = createLightingSequence((target, action, value) => sendExhibitControl(ws.current, target, action, value));
  const valveReady = useRef(false);
  const prevAngle = useRef(null);
  const lastActivity = useRef(Date.now());
  const screenRef = useRef(screen);
  const stepRef = useRef(step);
  const fuelRef = useRef(null);
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const activeSlot = useRef('A');

  useEffect(() => { screenRef.current = screen; }, [screen]);
  useEffect(() => { stepRef.current = step; }, [step]);

  // ── AUDIO ──
  const prevStep = useRef(0);
  const audioStartedRef = useRef(false);
  useEffect(() => {
    if (screen === 'sleep') {
      sm.stopAll({ fadeMs: 200 });
      prevStep.current = 0;
      audioStartedRef.current = false;
      return;
    }
    if (!audioStartedRef.current) {
      sm.unlock();
      sm.play('AUDIO_4');
      audioStartedRef.current = true;
    }
    if (step >= MAX_STEPS && prevStep.current < MAX_STEPS) {
      sm.stop('AUDIO_4');
      sm.play('AUDIO_5');
      sm.play('AUDIO_3');
      const t6 = setTimeout(() => sm.play('AUDIO_6'), 1000);
      prevStep.current = step;
      return () => { clearTimeout(t6); };
    }
    prevStep.current = step;
  }, [step, screen]);

  // Inactivity → sleep (20s) + reset all screens (disabled when game complete)
  useEffect(() => {
    if (screen !== 'active' || step >= MAX_STEPS) return;
    const id = setInterval(() => {
      if (Date.now() - lastActivity.current > INACTIVITY_MS) {
        lighting.current.cancel();
        valveReady.current = false;
        screenRef.current = 'sleep';
        setScreen('sleep');
        setStep(0);
        setShowTurbineMsg(false);
        setVideoPhase('intro');
        prevAngle.current = null;
        ws.current?.send(JSON.stringify({
          type: 'trigger', name: 'GAME_STATE', id: 1,
          data: { state: 'RESET' },
        }));
      }
    }, 3000);
    return () => clearInterval(id);
  }, [screen, step]);

  const handleMessage = useCallback((msg) => {
    lighting.current.result(msg);
    if (msg.type === 'result' && msg.name === 'EXHIBIT_CONTROL') {
      if (msg.recipient === 'screen_oled4') {
        const method = msg.status === 'rejected' || msg.status === 'failed' ? 'error' : 'info';
        console[method](`[screen_oled4] EXHIBIT_CONTROL result ${msg.request_id}`, msg);
      }
      return;
    }

    if (msg.type !== 'trigger') return;

    if (msg.name === 'BUTTON' && msg.data?.pressed) {
      if (msg.id === 'LANG_CZ') setLanguage('cz');
      if (msg.id === 'LANG_EN') setLanguage('en');
      if (msg.id === 'LANG_DE') setLanguage('de');
    }

    // Wake when OLED2 combustion game completes
    if (msg.name === 'GAME_STATE' && msg.data?.state === 'COMBUSTION_COMPLETE' && screenRef.current === 'sleep') {
      screenRef.current = 'active';
      stepRef.current = 0;
      valveReady.current = false;
      lighting.current.run(startValve).then(ok => { valveReady.current = ok; });
      fuelRef.current = FUELS.has(msg.data?.fuel) ? msg.data.fuel : null;
      setScreen('active');
      setStep(0);
      setShowTurbineMsg(false);
      setVideoPhase('intro');
      prevAngle.current = null;
      lastActivity.current = Date.now();
    }

    // Reset all screens to initial state
    if (msg.name === 'GAME_STATE' && msg.data?.state === 'RESET') {
      lighting.current.cancel();
      valveReady.current = false;
      screenRef.current = 'sleep';
      stepRef.current = 0;
      sendExhibitControl(ws.current, 'turbine_generator_axis', 'stop');
      fuelRef.current = null;
      setScreen('sleep');
      setStep(0);
      setShowTurbineMsg(false);
      setVideoPhase('intro');
      prevAngle.current = null;
    }

    // Wheel 4 — open valve
    if (msg.name === 'WHEEL' && msg.id === 4) {
      lastActivity.current = Date.now();
      if (screenRef.current !== 'active' || !valveReady.current || stepRef.current >= MAX_STEPS) return;
      const angle = msg.data?.angle ?? 0;
      const delta = angleDelta(prevAngle.current, angle);
      prevAngle.current = angle;
      if (delta > 5) {
        const next = Math.min(MAX_STEPS, stepRef.current + 1);
        stepRef.current = next;
        setStep(next);
        if (next === MAX_STEPS) {
          valveReady.current = false;
          setVideoPhase('open');
          lighting.current.run(sequence => completeValve(sequence, () => {
            setShowTurbineMsg(true);
            ws.current?.send(JSON.stringify({ type: 'trigger', name: 'GAME_STATE', id: 1,
              data: { state: 'VALVE_COMPLETE' } }));
          }));
        }
      }
    }
  }, []);

  useEffect(() => {
    let disposed = false;
    let socket = null;
    const connect = () => {
      socket = new WebSocket(WS_URL);
      socket.onopen = () => console.log('WS connected');
      socket.onmessage = (e) => { try { handleMessage(JSON.parse(e.data)); } catch {} };
      socket.onclose = () => {
        lighting.current.cancel();
        valveReady.current = false;
        if (disposed) return;
        clearTimeout(wsTimer.current);
        wsTimer.current = setTimeout(connect, 2000);
      };
      ws.current = socket;
    };
    connect();
    return () => {
      disposed = true;
      lighting.current.cancel();
      socket?.close();
      clearTimeout(wsTimer.current);
    };
  }, [handleMessage]);

  // ── KEYBOARD SIMULATOR (all input goes through WS) ──
  useEffect(() => {
    const simAngle = { v: 0 };
    const send = (msg) => ws.current?.send(JSON.stringify(msg));
    const onKey = (e) => {
      sm.unlock();
      switch (e.key) {
        case 'ArrowRight': case 'd': case 'D':
          simAngle.v = (simAngle.v + 20) % 360;
          send({ type: 'trigger', name: 'WHEEL', id: 4, data: { angle: simAngle.v } });
          break;
        case ' ': case 'Enter':
          e.preventDefault();
          send({ type: 'trigger', name: 'GAME_STATE', id: 1, data: { state: 'COMBUSTION_COMPLETE', fuel: 'coal' } });
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
  const pct = (step / MAX_STEPS) * 100;
  const done = step >= MAX_STEPS;

  const VIDEO_SRC = {
    intro:   '/animace/OLED4_2.mp4',
    idle:    '/animace/OLED4_3.mp4',
    open:    '/animace/OLED4_4.mp4',
    flowing: '/animace/OLED4_5.mp4',
  };

  // Dual-video swap: load next phase on the inactive slot, switch z-index on canplay
  useEffect(() => {
    if (screen !== 'active') {
      [videoARef, videoBRef].forEach(r => {
        if (r.current) {
          r.current.pause();
          r.current.removeAttribute('src');
          r.current.load();
          r.current.style.zIndex = '0';
        }
      });
      activeSlot.current = 'A';
      return;
    }

    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    const isFirstLoad = !a.src && !b.src;
    const isA = activeSlot.current === 'A';
    const next = isFirstLoad ? a : (isA ? b : a);
    const curr = isFirstLoad ? null : (isA ? a : b);

    next.loop = videoPhase === 'idle' || videoPhase === 'flowing';
    next.onended =
      videoPhase === 'intro' ? () => setVideoPhase('idle') :
      videoPhase === 'open'  ? () => setVideoPhase('flowing') :
      null;
    next.oncanplay = () => {
      next.oncanplay = null;
      next.play().catch(() => {});
      next.style.zIndex = '1';
      if (curr) {
        // Hold old frame until next has rendered, then drop it
        requestAnimationFrame(() => {
          curr.style.zIndex = '0';
          curr.pause();
        });
      }
      activeSlot.current = isFirstLoad ? 'A' : (isA ? 'B' : 'A');
    };
    next.src = VIDEO_SRC[videoPhase];
    next.load();
  }, [videoPhase, screen]);

  // ── SLEEP: blank black screen ──
  if (screen === 'sleep') {
    return <div className="screen sleep" />;
  }

  // ── ACTIVE ──
  return (
    <div className="screen active">
      <video ref={videoARef} className="bg-video" preload="auto" muted playsInline />
      <video ref={videoBRef} className="bg-video" preload="auto" muted playsInline />
      <div className="content-area">
        <div className="content-text">
          {step === 0 && !showTurbineMsg && (
            <>
              <h1 className="main-title">{lang.homeTitle}</h1>
              <p className="main-body">{lang.homeBody}</p>
            </>
          )}
          {showTurbineMsg && (
            <>
              <p className="turbine-msg">{lang.turbineMsg}</p>
              <p className='turbine-sub-msg'>
                {lang.turbineSubMsg.split('{BLESK}').flatMap((part, i, arr) =>
                  i < arr.length - 1
                    ? [part, <img key={i} src="/g/blesk.png" className="inline-icon" alt="" />]
                    : [part]
                )}
              </p>
            </>
          )}
        </div>

        {step === 0 && !showTurbineMsg && (
          <div className="wheel-center">
            <img src="/g/kolo se šipkami.png" alt="" className="wheel-img" />
          </div>
        )}
      </div>

      {/* Warning / done message */}
      <div className="msg-area">
        {!done && <div className="warn-msg">{lang.stepMsg}</div>}
        {done && <div className="done-msg">{lang.doneMsg}</div>}
      </div>

      {/* Scale bar at very bottom */}
      <div className="scale-area">
        <span className="lock-icon" role="img" aria-label="zamceno">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 1.5A5.5 5.5 0 0 0 6.5 7v2.5H6A2.5 2.5 0 0 0 3.5 12v8A2.5 2.5 0 0 0 6 22.5h12a2.5 2.5 0 0 0 2.5-2.5v-8A2.5 2.5 0 0 0 18 9.5h-.5V7A5.5 5.5 0 0 0 12 1.5Zm0 2A3.5 3.5 0 0 1 15.5 7v2.5h-7V7A3.5 3.5 0 0 1 12 3.5Z"/>
          </svg>
        </span>
        <div className="scale-bar">
          <div className="scale-marker" style={{ left: `${pct}%` }} />
        </div>
        <span className="lock-icon open" role="img" aria-label="odemceno">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 1.5A5.5 5.5 0 0 0 6.5 7v2.5H6A2.5 2.5 0 0 0 3.5 12v8A2.5 2.5 0 0 0 6 22.5h12a2.5 2.5 0 0 0 2.5-2.5v-8A2.5 2.5 0 0 0 18 9.5H8.5V7a3.5 3.5 0 0 1 6.86-1l1.94-.52A5.5 5.5 0 0 0 12 1.5Z"/>
          </svg>
        </span>
      </div>
    </div>
  );
}
