const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

async function withServer(fn) {
  const server = createApp();
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, path, body, raw) => {
    const res = await fetch(base + path, {
      method, headers: { 'Content-Type': 'application/json' },
      body: raw ?? (body === undefined ? undefined : JSON.stringify(body)),
    });
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
  };
  try { await fn(call); } finally { server.closeAllConnections?.(); await new Promise((r) => server.close(r)); }
}
const add = (call, name, price) => call('POST', '/items', { name, price });

test('POST creates item with 201', () => withServer(async (call) => {
  const r = await add(call, 'pen', 2.5);
  assert.equal(r.status, 201);
  assert.deepEqual(r.body, { id: 1, name: 'pen', price: 2.5 });
}));

test('POST validates name and price -> 400', () => withServer(async (call) => {
  assert.equal((await add(call, '', 1)).status, 400);
  assert.equal((await add(call, 'x', -1)).status, 400);
  assert.equal((await add(call, 'x', 'free')).status, 400);
  assert.equal((await call('POST', '/items', {})).status, 400);
}));

test('POST malformed JSON -> 400 (server must not crash)', () => withServer(async (call) => {
  const r = await call('POST', '/items', undefined, '{bad json');
  assert.equal(r.status, 400);
  assert.equal((await add(call, 'ok', 1)).status, 201);
}));

test('GET /items pagination: limit is a page size, offset is a start', () => withServer(async (call) => {
  for (let i = 0; i < 5; i++) await add(call, 'n' + i, i);
  const r = await call('GET', '/items?limit=2&offset=2');
  assert.deepEqual(r.body.map((i) => i.name), ['n2', 'n3']);
}));

test('GET /items rejects bad limit/offset', () => withServer(async (call) => {
  assert.equal((await call('GET', '/items?limit=abc')).status, 400);
  assert.equal((await call('GET', '/items?limit=-1')).status, 400);
  assert.equal((await call('GET', '/items?offset=-5')).status, 400);
}));

test('GET /items/:id found / missing -> 404', () => withServer(async (call) => {
  await add(call, 'pen', 1);
  assert.equal((await call('GET', '/items/1')).body.name, 'pen');
  assert.equal((await call('GET', '/items/99')).status, 404);
  assert.equal((await call('GET', '/items/abc')).status, 404);
}));

test('known path wrong method -> 405', () => withServer(async (call) => {
  assert.equal((await call('PUT', '/items')).status, 405);
  assert.equal((await call('PATCH', '/items/1')).status, 405);
  assert.equal((await call('GET', '/nope')).status, 404);
}));

test('DELETE /items/:id -> 204 then 404', () => withServer(async (call) => {
  await add(call, 'pen', 1);
  assert.equal((await call('DELETE', '/items/1')).status, 204);
  assert.equal((await call('DELETE', '/items/1')).status, 404);
  assert.equal((await call('GET', '/items/1')).status, 404);
}));
