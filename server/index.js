const { WebSocketServer } = require('ws');
const http = require('http');
const config = require('./config');

const clients = new Map();

// HTTP server handles both WS upgrades and status requests on the same port
const httpServer = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ connected: clients.size, clients: [...clients.keys()] }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const wss = new WebSocketServer({ server: httpServer });
httpServer.listen(config.PORT, () =>
  console.log(`Server running on port ${config.PORT} (WS + HTTP status)`)
);

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

    // Relay to all clients (including sender)
    for (const [, client] of clients) {
      if (client.readyState === 1) {
        client.send(JSON.stringify(msg));
      }
    }
  });

  ws.on('close', () => {
    clients.delete(id);
    console.log(`[-] ${id} disconnected (${clients.size} total)`);
  });
});

