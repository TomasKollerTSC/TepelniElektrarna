import { useState, useEffect, useRef, useCallback } from 'react';
import { T } from './Texts';

const WS_URL = 'ws://localhost:8765';
const MAX_STEPS = 15;
const INACTIVITY_MS = 20000;

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

  const ws = useRef(null);
  const wsTimer = useRef(null);
  const prevAngle = useRef(null);
  const lastActivity = useRef(Date.now());
  const screenRef = useRef(screen);
  const stepRef = useRef(step);

  useEffect(() => { screenRef.current = screen; }, [screen]);
  useEffect(() => { stepRef.current = step; }, [step]);

  // Inactivity → sleep (20s) + reset all screens (disabled when game complete)
  useEffect(() => {
    if (screen !== 'active' || step >= MAX_STEPS) return;
    const id = setInterval(() => {
      if (Date.now() - lastActivity.current > INACTIVITY_MS) {
        setScreen('sleep');
        setStep(0);
        setShowTurbineMsg(false);
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
    if (msg.type !== 'trigger') return;

    if (msg.name === 'BUTTON' && msg.data?.pressed) {
      if (msg.id === 'LANG_CZ') setLanguage('cz');
      if (msg.id === 'LANG_EN') setLanguage('en');
      if (msg.id === 'LANG_DE') setLanguage('de');
    }

    // Wake when OLED2 combustion game completes
    if (msg.name === 'GAME_STATE' && msg.data?.state === 'COMBUSTION_COMPLETE') {
      setScreen('active');
      setStep(0);
      setShowTurbineMsg(false);
      prevAngle.current = null;
      lastActivity.current = Date.now();
    }

    // Reset all screens to initial state
    if (msg.name === 'GAME_STATE' && msg.data?.state === 'RESET') {
      setScreen('sleep');
      setStep(0);
      setShowTurbineMsg(false);
      prevAngle.current = null;
    }

    // Wheel 4 — open valve
    if (msg.name === 'WHEEL' && msg.id === 4) {
      lastActivity.current = Date.now();
      if (screenRef.current !== 'active') return;
      const angle = msg.data?.angle ?? 0;
      const delta = angleDelta(prevAngle.current, angle);
      prevAngle.current = angle;
      if (delta > 5) {
        setStep(prev => {
          const next = Math.min(MAX_STEPS, prev + 1);
          if (next === MAX_STEPS && prev < MAX_STEPS) {
            setTimeout(() => setShowTurbineMsg(true), 3000);
          }
          return next;
        });
      }
    }
  }, []);

  const connect = useCallback(() => {
    const socket = new WebSocket(WS_URL);
    socket.onopen = () => console.log('WS connected');
    socket.onmessage = (e) => { try { handleMessage(JSON.parse(e.data)); } catch {} };
    socket.onclose = () => {
      clearTimeout(wsTimer.current);
      wsTimer.current = setTimeout(connect, 2000);
    };
    ws.current = socket;
  }, [handleMessage]);

  useEffect(() => {
    connect();
    return () => { ws.current?.close(); clearTimeout(wsTimer.current); };
  }, [connect]);

  // ── KEYBOARD SIMULATOR (all input goes through WS) ──
  useEffect(() => {
    const simAngle = { v: 0 };
    const send = (msg) => ws.current?.send(JSON.stringify(msg));
    const onKey = (e) => {
      switch (e.key) {
        case 'ArrowRight': case 'd': case 'D':
          simAngle.v = (simAngle.v + 20) % 360;
          send({ type: 'trigger', name: 'WHEEL', id: 4, data: { angle: simAngle.v } });
          break;
        case ' ': case 'Enter':
          e.preventDefault();
          send({ type: 'trigger', name: 'GAME_STATE', id: 1, data: { state: 'COMBUSTION_COMPLETE' } });
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

  // ── SLEEP: blank black screen ──
  if (screen === 'sleep') {
    return <div className="screen sleep" />;
  }

  // ── ACTIVE ──
  return (
    <div className="screen active">
      <div className="content-area">
        <div className="content-text">
          {!showTurbineMsg && (
            <>
              <h1 className="main-title">{lang.homeTitle}</h1>
              <p className="main-body">{lang.homeBody}</p>
            </>
          )}
          {showTurbineMsg && (
            <>
              <p className="turbine-msg">{lang.turbineMsg}</p>
              <p className='turbine-sub-msg'>{lang.turbineSubMsg}</p>
            </>
          )}
        </div>

        {!showTurbineMsg && (
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
        <span className="lock-icon">🔒</span>
        <div className="scale-bar">
          <div className="scale-marker" style={{ left: `${pct}%` }} />
        </div>
        <span className="lock-icon open">🔓</span>
      </div>
    </div>
  );
}
