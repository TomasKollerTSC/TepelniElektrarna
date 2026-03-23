import { useState, useEffect, useRef } from 'react';

const WS_URL = 'ws://localhost:8765';

export default function App() {
  const [phase, setPhase] = useState(0); // 0=idle, 1=oled2, 2=oled4, 3=phase3
  const [energyReady, setEnergyReady] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socket.onopen = () => console.log('WS connected');
    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      console.log('WS message:', msg);
    };
    socket.onclose = () => {
      console.log('WS disconnected, reconnecting...');
      setTimeout(() => { ws.current = new WebSocket(WS_URL); }, 2000);
    };
    ws.current = socket;
    return () => socket.close();
  }, []);

  return (
    <div className="screen screen9">
      <h1>Section 9 - Progress Panel</h1>
      <p>Phase: {phase}</p>
      <p>Energy ready: {energyReady ? 'YES' : 'NO'}</p>
    </div>
  );
}
