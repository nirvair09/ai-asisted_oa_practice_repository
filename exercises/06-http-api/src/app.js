const { resolve } = require('dns');
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

      req.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          resolve(undefined);
        }
      });
    });

  }

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean);

    if (parts[0] === 'items' && parts.length === 1) {
      if (req.method === 'GET') {
        const limit = parseInt(url.searchParams.get('limit') ?? '10');
        const offset = parseInt(url.searchParams.get('offset') ?? '0');
        if(!Number.isInteger(limi)||limit<1||!Number.isInteger(offset)||offset<0){
          return send(res,400,{error:"wrong offset or limit values"})
        }



        const list = [...items.values()].slice(offset, limit+offset);
        return send(res, 200, list);
      }
      if (req.method === 'POST') {
        const body = await readBody(req);

        if (body === undefined || body === null || typeof body !== 'object') {
          return send(res, 400, { error: 'invalid JSON body' });
        }
        const item = { id: nextId++, name: body.name, price: body.price };
        if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0) {
          return send(res, 400, { error: 'wrong price parameter' })
        }

        items.set(item.id, item);

        let data = '';

        req.on('data', (c) => (data += c));

        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            resolve(undefined);
          }
        });
      }
    }

    if (parts[0] === 'items' && parts.length === 2) {
        const id = Number(parts[1]);

      if (req.method === 'GET') {
        const item = items.get(id);
        if (!item) return send(res, 404, { error: 'item not found' });
        return send(res, 200, item);
      }

      if (req.method === 'DELETE') {
        if (!items.delete(id)) return send(res, 404, { error: 'item not found' });
        res.writeHead(204);
        return res.end();
      }

      return send(res, 405, { error: 'method not allowed' });
    }

    send(res, 404, { error: 'not found' });
  });

  return server;
}

module.exports = { createApp };
