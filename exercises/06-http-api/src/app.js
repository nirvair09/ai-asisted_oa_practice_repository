const http = require('http');

function createApp() {
  const items = new Map();
  let nextId = 1;

  function send(res, status, body) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  }

  function readBody(req) {
    return new Promise((resolve) => {
      let data = '';
      req.on('data', (c) => (data += c));
      req.on('end', () => resolve(JSON.parse(data)));
    });
  }

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean);

    if (parts[0] === 'items' && parts.length === 1) {
      if (req.method === 'GET') {
        const limit = parseInt(url.searchParams.get('limit') ?? '10');
        const offset = parseInt(url.searchParams.get('offset') ?? '0');
        const list = [...items.values()].slice(offset, limit);
        return send(res, 200, list);
      }
      if (req.method === 'POST') {
        const body = await readBody(req);
        const item = { id: nextId++, name: body.name, price: body.price };
        items.set(item.id, item);
        return send(res, 200, item);
      }
    }

    if (parts[0] === 'items' && parts.length === 2) {
      const id = Number(parts[1]);
      if (req.method === 'GET') return send(res, 200, items.get(id) ?? null);
      // TODO: DELETE
    }

    send(res, 404, { error: 'not found' });
  });

  return server;
}

module.exports = { createApp };
