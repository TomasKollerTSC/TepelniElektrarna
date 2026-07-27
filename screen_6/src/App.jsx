import { useState, useEffect, useRef, useCallback } from 'react';
import { createSoundManager } from './soundManager';

const WS_URL = import.meta.env.VITE_EXHIBIT_RELAY_WS_URL || 'ws://localhost:8765';

const sendExhibitControl = (socket, target, action, value) => {
  if (socket?.readyState !== WebSocket.OPEN) {
    console.error(`[screen_6] EXHIBIT_CONTROL not sent: relay unavailable (${target}/${action})`);
    return null;
  }
  const requestId = crypto.randomUUID();
  const request = {
    type: 'request',
    name: 'EXHIBIT_CONTROL',
    request_id: requestId,
    sender: 'screen_6',
    target,
    action,
    ...(value === undefined ? {} : { value }),
  };
  socket.send(JSON.stringify(request));
  console.info(`[screen_6] EXHIBIT_CONTROL request ${requestId}`, { target, action, value });
  return requestId;
};

const sm = createSoundManager({
  AUDIO_3: { src: '/a/AUDIO_3.mp3', loop: false, channel: 'right', volume: 0.8 },
  AUDIO_7: { src: '/a/AUDIO_7.mp3', loop: false, channel: 'right', volume: 1.0 },
});

const T = {
  cz: {
    body: 'Pára, která prošla parní turbínou je ochlazena v kondenzátoru na kapalnou vodu. Chladící okruh doplňuje chladící věž. Voda z okruhu je v kotli opět ohřátá a přeměněná na páru.',
  },
  en: {
    body: 'The steam that has passed through the steam turbine is cooled into liquid water in a condenser. A cooling tower completes the cooling circuit. The water from the circuit is reheated and converted to steam in the boiler.',
  },
  de: {
    body: 'Der Dampf, der die Turbine durchströmt hat, wird im Kondensator wieder zu Wasser abgekühlt. Der Kühlkreislauf wird durch den Kühlturm unterstützt. Das Wasser wird im Kessel erneut erhitzt und wieder in Dampf umgewandelt.',
  },
};

export default function App() {
  const [screen, setScreen] = useState('sleep'); // sleep | active
  const [language, setLanguage] = useState('cz');
  const ws = useRef(null);
  const wsTimer = useRef(null);

  const handleMessage = useCallback((msg) => {
    if (msg.type === 'result' && msg.name === 'EXHIBIT_CONTROL') {
      if (msg.recipient === 'screen_6') {
        const method = msg.status === 'rejected' || msg.status === 'failed' ? 'error' : 'info';
        console[method](`[screen_6] EXHIBIT_CONTROL result ${msg.request_id}`, msg);
      }
      return;
    }

    if (msg.type !== 'trigger') return;

    // Language buttons
    if (msg.name === 'BUTTON' && msg.data?.pressed) {
      if (msg.id === 'LANG_CZ') setLanguage('cz');
      if (msg.id === 'LANG_EN') setLanguage('en');
      if (msg.id === 'LANG_DE') setLanguage('de');
      if (msg.id === 'ENERGY_SEND') {
        sendExhibitControl(ws.current, 'energy_send_button_lamp', 'set_state', false);
        sendExhibitControl(ws.current, 'turbine_generator_axis', 'stop');
        sendExhibitControl(ws.current, 'tepelni_lighting', 'activate_scene', 'sleep');
        sm.unlock();
        sm.play('AUDIO_7');
      }
    }

    // Wake when OLED4 valve game completes
    if (msg.name === 'GAME_STATE' && msg.data?.state === 'VALVE_COMPLETE') {
      sendExhibitControl(ws.current, 'energy_send_button_lamp', 'set_state', true);
      setScreen('active');
    }

    // Reset to sleep
    if (msg.name === 'GAME_STATE' && msg.data?.state === 'RESET') {
      sendExhibitControl(ws.current, 'energy_send_button_lamp', 'set_state', false);
      setScreen('sleep');
    }
  }, []);

  // ── AUDIO ──
  const prevScreen = useRef(screen);
  useEffect(() => {
    if (screen === 'active' && prevScreen.current !== 'active') {
      sm.unlock();
      sm.play('AUDIO_3');
    }
    if (screen === 'sleep') sm.stopAll({ fadeMs: 200 });
    prevScreen.current = screen;
  }, [screen]);

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
    };
  }, [handleMessage]);

  // ── KEYBOARD SIMULATOR ────────────────────────────────
  useEffect(() => {
    const send = (msg) => ws.current?.send(JSON.stringify(msg));
    const onKey = (e) => {
      sm.unlock();
      switch (e.key) {
        case ' ': case 'Enter': case 'p': case 'P':
          e.preventDefault();
          send({ type: 'trigger', name: 'GAME_STATE', id: 1, data: { state: 'VALVE_COMPLETE' } });
          break;
        case 'e': case 'E':
          send({ type: 'trigger', name: 'BUTTON', id: 'ENERGY_SEND', data: { pressed: true } });
          break;
        case 'r': case 'R': case 'Escape':
          send({ type: 'trigger', name: 'GAME_STATE', id: 1, data: { state: 'RESET' } });
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleMessage]);

  const lang = T[language];

  if (screen === 'sleep') {
    return (
      <div className="screen sleep">
        <img src="/g/chladici_vez_sporic-02.png" alt="" className="sleep-img" />
      </div>
    );
  }

  return (
    <div className="screen active">
      <div className="diagram-area">
        <video
          className="diagram-video"
          src="/v/chladici_vez.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <p className="diagram-text">{lang.body}</p>
      </div>
    </div>
  );
}
