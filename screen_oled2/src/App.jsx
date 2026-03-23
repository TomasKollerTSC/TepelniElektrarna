import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://localhost:8765';

const DEG_PER_PT = {
  coal:    [12, 12, 12],
  gas:     [20, 15, 15],
  biomass: [ 6, 10, 10],
};

const FUELS = ['coal', 'gas', 'biomass'];
const FUEL_LABELS = {
  cz: ['uhlí', 'zemní plyn', 'biomasa'],
  en: ['coal', 'natural gas', 'biomass'],
  de: ['Kohle', 'Erdgas', 'Biomasse'],
};
const FUEL_IMAGES = ['/g/uhlí.png', '/g/plyn.png', '/g/biomasa.png'];
const FUEL_VIDEO_LETTERS = ['A', 'B', 'C'];
const FUEL_VIDEO_SUBDIRS = ['Uhlí', 'Plyn', 'Biomasa'];
// Plyn subfolder has space: "OLED2_3_ B.mp4"
function videoPath(fuelIdx, state) {
  const dir = FUEL_VIDEO_SUBDIRS[fuelIdx];
  const letter = FUEL_VIDEO_LETTERS[fuelIdx];
  const space = fuelIdx === 1 ? ' ' : ''; // gas has space before letter
  return `/v/${dir}/OLED2_${state}_${space}${letter}.mp4`;
}

const T = {
  cz: {
    selectFuel: 'Zvolte druh PALIVA.',
    startBtn: 'Zmáčkni tlačítko START.',
    startSub: 'Na boku exponátu.',
    gameIntro: 'Ve spalovací komoře kotle dochází k vytváření tepla. Tvým úkolem je dosáhnout optimální teploty a následně ji udržet.',
    params: ['Přívod paliva', 'Přívod vzduchu', 'Odvod spalin'],
    warnBlue: ['Zvyš přívod paliva!', 'Zvyš přívod vzduchu!', 'Zvyš odvod spalin!'],
    warnRed:  ['Sniž přívod paliva!', 'Sniž přívod vzduchu!', 'Sniž odvod spalin!'],
    overload: 'POZOR! HROZÍ PŘETÍŽENÍ!',
    stopped:  'Reakce zastavena z důvodu rizika selhání!',
    success:  'Dosaženo optimálních podmínek pro spalování.\nPřesuň se k další obrazovce.',
  },
  en: {
    selectFuel: 'Select the type of fuel.',
    startBtn: 'Press the START button.',
    startSub: 'On the side of the exhibit.',
    gameIntro: 'Heat is generated in the boiler combustion chamber. Your aim is to reach the optimum temperature and then maintain it.',
    params: ['Fuel supply', 'Air supply', 'Flue gas exhaust'],
    warnBlue: ['Increase the fuel supply!', 'Increase the air supply!', 'Increase the flue gas exhaust!'],
    warnRed:  ['Reduce the fuel supply!', 'Reduce the air supply!', 'Reduce the flue gas exhaust!'],
    overload: 'CAUTION! RISK OF OVERLOADING!',
    stopped:  'Reaction stopped due to risk of failure!',
    success:  'Optimum combustion conditions achieved.\nGo to the next screen.',
  },
  de: {
    selectFuel: 'Wählen Sie die Art des Kraftstoffs.',
    startBtn: 'Drücke die START-Taste.',
    startSub: 'An der Seite des Exponats.',
    gameIntro: 'In der Brennkammer des Kessels wird Wärme erzeugt. Deine Aufgabe ist es, die optimale Temperatur zu erreichen und anschließend stabil zu halten.',
    params: ['Zufuhr Brennstoff', 'Zufuhr Luft', 'Abführung Abgase'],
    warnBlue: ['Erhöhe die Brennstoffzufuhr!', 'Erhöhe die Luftzufuhr!', 'Erhöhe die Abgasabfuhr!'],
    warnRed:  ['Verringere die Brennstoffzufuhr!', 'Verringere die Luftzufuhr!', 'Verringere die Abgasabfuhr!'],
    overload: 'ACHTUNG! ÜBERLASTUNG DROHT!',
    stopped:  'Der Prozess wurde wegen Störungsrisiko gestoppt.',
    success:  'Optimale Verbrennungsbedingungen erreicht.\nWechsle zur nächsten Anzeige.',
  },
};

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

// Video state: flame size from fuel+air average, smoke from exhaust level
function getVideoState(gauges) {
  const [fuel, air, exhaust] = gauges;
  const avg = (fuel + air) / 2;
  const flameBase = avg <= 60 ? 3 : avg <= 120 ? 5 : 7;
  const smoky = exhaust <= 60;
  return smoky ? flameBase + 1 : flameBase;
}

export default function App() {
  const [screen, setScreen] = useState('sleep');
  const [language, setLanguage] = useState('cz');
  const [fuelIdx, setFuelIdx] = useState(0);
  const [gauges, setGauges] = useState([0, 90, 90]);
  const [showIntro, setShowIntro] = useState(true);
  const [warnActive, setWarnActive] = useState([false, false, false]);
  const [overloadActive, setOverloadActive] = useState(false);
  const [stoppedMsg, setStoppedMsg] = useState(false);
  // Screensaver bounce position
  const [bouncePos, setBouncePos] = useState({ x: 40, y: 40 });

  const ws = useRef(null);
  const wsTimer = useRef(null);
  const prevAngles = useRef([null, null, null]);
  const dangerStart = useRef([null, null, null]);
  const overloadStart = useRef(null);
  const greenStart = useRef(null);
  const lastActivity = useRef(Date.now());
  const decayTimer = useRef(null);
  const screenRef = useRef(screen);
  const fuelIdxRef = useRef(fuelIdx);
  const gaugesRef = useRef(gauges);
  const videoRef = useRef(null);

  useEffect(() => { screenRef.current = screen; }, [screen]);
  useEffect(() => { fuelIdxRef.current = fuelIdx; }, [fuelIdx]);
  useEffect(() => { gaugesRef.current = gauges; }, [gauges]);

  // Screensaver bounce animation
  useEffect(() => {
    if (screen !== 'sleep') return;
    let vx = (Math.random() > 0.5 ? 1 : -1) * 0.3;
    let vy = (Math.random() > 0.5 ? 1 : -1) * 0.2;
    let x = 40, y = 40;
    const id = setInterval(() => {
      x += vx; y += vy;
      if (x <= 0 || x >= 85) vx = -vx;
      if (y <= 0 || y >= 85) vy = -vy;
      setBouncePos({ x: Math.max(0, Math.min(85, x)), y: Math.max(0, Math.min(85, y)) });
    }, 50);
    return () => clearInterval(id);
  }, [screen]);

  const stopDecay = useCallback(() => clearInterval(decayTimer.current), []);

  const startDecay = useCallback(() => {
    stopDecay();
    decayTimer.current = setInterval(() => {
      setGauges(prev => prev.map(v => Math.max(0, v - 12)));
    }, 2000);
  }, [stopDecay]);

  const goHome = useCallback(() => {
    stopDecay();
    setScreen('home');
    setGauges([0, 90, 90]);
    setWarnActive([false, false, false]);
    setOverloadActive(false);
    setStoppedMsg(false);
    greenStart.current = null;
    overloadStart.current = null;
    dangerStart.current = [null, null, null];
    prevAngles.current = [null, null, null];
  }, [stopDecay]);

  // Zone timing — warnings and win
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
          setScreen('success');
          return;
        }
      } else {
        greenStart.current = null;
      }

      const newWarn = zones.map((zone, i) => {
        if (zone !== 'green') {
          if (!dangerStart.current[i]) dangerStart.current[i] = now;
          return (now - dangerStart.current[i]) >= 3000;
        }
        dangerStart.current[i] = null;
        return false;
      });
      setWarnActive(newWarn);

      const anyRed = zones.some(z => z === 'red');
      if (anyRed) {
        if (!overloadStart.current) overloadStart.current = now;
        const t = now - overloadStart.current;
        if (t >= 10000) {
          stopDecay();
          setStoppedMsg(true);
          setGauges([0, 0, 0]);
          setTimeout(() => goHome(), 3000);
        } else if (t >= 5000) {
          setOverloadActive(true);
        }
      } else {
        overloadStart.current = null;
        setOverloadActive(false);
      }
    }, 500);
    return () => clearInterval(id);
  }, [screen, stopDecay, goHome]);

  // Inactivity timeout (30s in game)
  useEffect(() => {
    if (screen !== 'game') return;
    const id = setInterval(() => {
      if (Date.now() - lastActivity.current > 30000) goHome();
    }, 5000);
    return () => clearInterval(id);
  }, [screen, goHome]);

  // Update video src when gauges change
  useEffect(() => {
    if (screen !== 'game' || !videoRef.current) return;
    const state = getVideoState(gauges);
    const src = videoPath(fuelIdxRef.current, state);
    if (videoRef.current.dataset.src !== src) {
      videoRef.current.dataset.src = src;
      videoRef.current.src = src;
      videoRef.current.play().catch(() => {});
    }
  }, [gauges, screen]);

  const handleMessage = useCallback((msg) => {
    if (msg.type !== 'trigger') return;

    if (msg.device === 'BUTTON' && msg.value?.pressed) {
      if (msg.id === 'LANG_CZ') setLanguage('cz');
      if (msg.id === 'LANG_EN') setLanguage('en');
      if (msg.id === 'LANG_DE') setLanguage('de');
      if (msg.id === 'START' && screenRef.current === 'home') {
        setScreen('game');
        setShowIntro(true);
        setGauges([0, 90, 90]);
        prevAngles.current = [null, null, null];
        dangerStart.current = [null, null, null];
        greenStart.current = null;
        overloadStart.current = null;
        lastActivity.current = Date.now();
        startDecay();
        setTimeout(() => setShowIntro(false), 8000);
      }
      if ((msg.id === 'WAKE' || msg.id === 'START') && screenRef.current === 'sleep') {
        setScreen('home');
      }
    }

    if (msg.device === 'WHEEL') {
      const angle = msg.value?.angle ?? 0;
      const wheelMap = { W1: 0, W2: 1, W3: 2 };
      const idx = wheelMap[msg.id];
      if (idx === undefined) return;

      if (screenRef.current === 'home' && idx === 0) {
        const delta = angleDelta(prevAngles.current[0], angle);
        prevAngles.current[0] = angle;
        if (Math.abs(delta) > 8) {
          setFuelIdx(prev => ((prev + (delta > 0 ? 1 : -1)) % 3 + 3) % 3);
        }
        return;
      }

      if (screenRef.current === 'game') {
        lastActivity.current = Date.now();
        const delta = angleDelta(prevAngles.current[idx], angle);
        prevAngles.current[idx] = angle;
        const fKey = FUELS[fuelIdxRef.current];
        const ptDelta = delta / DEG_PER_PT[fKey][idx];
        setGauges(prev => {
          const next = [...prev];
          if (idx === 0) {
            next[0] = Math.min(180, Math.max(0, next[0] + Math.max(0, ptDelta)));
          } else {
            next[idx] = Math.min(180, Math.max(0, next[idx] + ptDelta));
          }
          return next;
        });
      }
    }
  }, [startDecay]);

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
    return () => { ws.current?.close(); clearTimeout(wsTimer.current); stopDecay(); };
  }, [connect, stopDecay]);

  const lang = T[language];
  const zones = gauges.map(getZone);

  // ── SLEEP ──────────────────────────────────────────────
  if (screen === 'sleep') {
    return (
      <div className="screen sleep" onClick={() => setScreen('home')}>
        <img
          className="sleep-logo"
          src="/g/TE_S1.png"
          alt=""
          style={{ left: `${bouncePos.x}%`, top: `${bouncePos.y}%` }}
        />
      </div>
    );
  }

  // ── HOME ───────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <div className="screen home">
        <div className="home-inner">
          <h1 className="select-title">{lang.selectFuel}</h1>

          <div className="fuel-options">
            {FUELS.map((f, i) => (
              <div
                key={f}
                className={`fuel-card ${i === fuelIdx ? 'selected' : ''}`}
                onClick={() => setFuelIdx(i)}
              >
                <img src={FUEL_IMAGES[i]} alt={lang.selectFuel} className="fuel-img" />
                <span className="fuel-name">{FUEL_LABELS[language][i]}</span>
              </div>
            ))}
          </div>

          <div className="wheel-row">
            {FUELS.map((_, i) => (
              <div key={i} className={`wheel-icon ${i === fuelIdx ? 'active' : ''}`}>
                <img src="/g/kolo se šipkami.png" alt="" />
              </div>
            ))}
          </div>

          <div className="start-area">
            <p className="start-title">{lang.startBtn}</p>
            <p className="start-sub">{lang.startSub}</p>
          </div>
          <div className="bottom-dash" />
        </div>
        <div className="side-arrow">
          <img src="/g/TE_OLED 2_šipka.png" alt="" />
        </div>
      </div>
    );
  }

  // ── SUCCESS ────────────────────────────────────────────
  if (screen === 'success') {
    return (
      <div className="screen success">
        <p className="success-msg">{lang.success}</p>
      </div>
    );
  }

  // ── GAME ───────────────────────────────────────────────
  const videoState = getVideoState(gauges);
  const initialVideoSrc = videoPath(fuelIdx, videoState);

  return (
    <div className="screen game">
      {/* Background video */}
      <video
        ref={videoRef}
        className="game-video"
        src={initialVideoSrc}
        autoPlay
        loop
        muted
        playsInline
        data-src={initialVideoSrc}
      />

      <div className="game-overlay">
        {/* Intro text */}
        {showIntro && (
          <div className="intro-text">
            <p className="intro-body">{lang.gameIntro}</p>
          </div>
        )}

        {/* Shutdown overlay */}
        {stoppedMsg && (
          <div className="stopped-overlay">
            <p>{lang.stopped}</p>
          </div>
        )}

        {/* 3 Wheel icons */}
        <div className="wheel-row-game">
          <img src="/g/TE_kola se šipkami.png" alt="" className="wheels-img" />
        </div>

        {/* Warning messages */}
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

        {/* 3 Vertical gauges */}
        <div className="gauges-row">
          {gauges.map((val, i) => (
            <div key={i} className="gauge-col">
              <div className="gauge-bar">
                {/* Marker: position from top = (1 - val/180) * 100% */}
                <div
                  className="gauge-marker"
                  style={{ top: `${(1 - val / 180) * 100}%` }}
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
