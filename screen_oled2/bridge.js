/**
 * OLED2 Bridge — runs on the OLED2 Raspberry Pi
 *
 * - Reads newline-delimited JSON from RS-485 via USB serial
 * - Serves a local WebSocket server on :8765 for the React app
 * - Connects outward to the master WS server
 * - On GAME_STATE / COMBUSTION_COMPLETE from React → sends OLED4_ACTIVATE to master
 * - Language / global messages from master → forwarded to React app
 *
 * Protocol: hardware sends one JSON object per line, matching the API spec:
 *   {"type":"trigger","name":"WHEEL","id":1,"data":{"angle":333}}
 *   {"type":"trigger","name":"BUTTON","id":1,"data":{"pressed":true}}
 *
 * Usage:  node bridge.js
 * Deps:   npm install ws serialport
 */

const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// ── CONFIG ────────────────────────────────────────────────
const SERIAL_PATH   = process.env.SERIAL_PATH   || '/dev/ttyUSB0';
const BAUD_RATE     = parseInt(process.env.BAUD_RATE || '9600');
const LOCAL_WS_PORT = 8765;
const MASTER_WS_URL = process.env.MASTER_WS_URL || 'ws://master.local:8765';
// ─────────────────────────────────────────────────────────

// ── LOCAL WS SERVER (React app connects here) ─────────────
const wss = new WebSocket.Server({ port: LOCAL_WS_PORT });
const reactClients = new Set();

wss.on('connection', (ws) => {
  reactClients.add(ws);
  console.log('React app connected');

  ws.on('close', () => reactClients.delete(ws));

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'trigger' && msg.name === 'GAME_STATE' && msg.data?.state === 'COMBUSTION_COMPLETE') {
        console.log('Combustion complete — notifying master');
        sendToMaster({ type: 'trigger', name: 'GAME_STATE', id: 1, data: { state: 'COMBUSTION_COMPLETE' } });
      }
    } catch {}
  });
});

function broadcastToReact(msg) {
  const data = JSON.stringify(msg);
  for (const client of reactClients) {
    if (client.readyState === WebSocket.OPEN) client.send(data);
  }
}

// ── MASTER WS CLIENT ──────────────────────────────────────
let masterWs = null;

function connectMaster() {
  masterWs = new WebSocket(MASTER_WS_URL);
  masterWs.on('open',  () => console.log('Connected to master:', MASTER_WS_URL));
  masterWs.on('close', () => { console.log('Master disconnected, retrying...'); setTimeout(connectMaster, 2000); });
  masterWs.on('error', () => {});

  masterWs.on('message', (data) => {
    // Forward master → React (language switches, sleep/reset commands, etc.)
    try { broadcastToReact(JSON.parse(data)); } catch {}
  });
}

function sendToMaster(msg) {
  if (masterWs?.readyState === WebSocket.OPEN) {
    masterWs.send(JSON.stringify(msg));
  }
}

connectMaster();

// ── SERIAL / RS-485 ───────────────────────────────────────
const serial = new SerialPort({ path: SERIAL_PATH, baudRate: BAUD_RATE });
const parser = serial.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (line) => {
  try {
    const msg = JSON.parse(line.trim());
    if (msg.type && msg.name) {
      broadcastToReact(msg);
    }
  } catch {
    console.warn('Invalid serial data:', line);
  }
});

serial.on('error', (err) => console.error('Serial error:', err.message));

console.log(`Bridge running — local WS :${LOCAL_WS_PORT}, serial ${SERIAL_PATH}@${BAUD_RATE}, master ${MASTER_WS_URL}`);
