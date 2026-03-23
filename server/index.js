const { WebSocketServer } = require('ws');
const config = require('./config');

const wss = new WebSocketServer({ port: config.PORT });

const clients = new Map();

wss.on('connection', (ws, req) => {
  const id = req.headers['x-client-id'] || `client-${Date.now()}`;
  clients.set(id, ws);
  console.log(`[+] ${id} connected (${clients.size} total)`);

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      console.error('Invalid JSON:', raw.toString());
      return;
    }

    console.log(`[${id}]`, JSON.stringify(msg));

    // Relay to all other clients
    for (const [cid, client] of clients) {
      if (cid !== id && client.readyState === 1) {
        client.send(JSON.stringify(msg));
      }
    }
  });

  ws.on('close', () => {
    clients.delete(id);
    console.log(`[-] ${id} disconnected (${clients.size} total)`);
  });
});

console.log(`WebSocket server running on ws://0.0.0.0:${config.PORT}`);
