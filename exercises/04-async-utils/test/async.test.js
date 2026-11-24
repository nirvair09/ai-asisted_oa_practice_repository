const test = require('node:test');
const assert = require('node:assert/strict');
const { retry, withTimeout, mapLimit, sleep } = require('../src/async');

test('retry: succeeds first time', async () => {
  assert.equal(await retry(async () => 'ok'), 'ok');
});

test('retry: async rejection is retried and eventually succeeds', async () => {
  let n = 0;
  const r = await retry(async () => { if (++n < 3) throw new Error('x'); return n; }, { retries: 3 });
  assert.equal(r, 3);
});

test('retry: retries=2 means 3 total attempts', async () => {
  let n = 0;
  await assert.rejects(retry(async () => { n++; throw new Error('boom'); }, { retries: 2 }), /boom/);
  assert.equal(n, 3);
});

test('retry: retries=0 means exactly one attempt', async () => {
  let n = 0;
  await assert.rejects(retry(async () => { n++; throw new Error('boom'); }, { retries: 0 }));
  assert.equal(n, 1);
});

test('retry: does not sleep after the final failed attempt', async () => {
  const t = Date.now();
  await assert.rejects(retry(async () => { throw new Error('x'); }, { retries: 1, delayMs: 200 }));
  assert.ok(Date.now() - t < 350, 'only one delay expected');
});

test('withTimeout: resolves with value', async () => {
  assert.equal(await withTimeout(sleep(5).then(() => 'v'), 200), 'v');
});

test('withTimeout: rejects on timeout', async () => {
  await assert.rejects(withTimeout(sleep(100), 10), /timeout/i);
});

test('withTimeout: propagates inner rejection', async () => {
  await assert.rejects(withTimeout(Promise.reject(new Error('inner')), 100), /inner/);
});

test('withTimeout: clears its timer when promise settles', async () => {
  const made = new Set(); const cleared = new Set();
  const st = global.setTimeout, ct = global.clearTimeout;
  global.setTimeout = (...a) => { const h = st(...a); made.add(h); return h; };
  global.clearTimeout = (h) => { cleared.add(h); return ct(h); };
  try {
    await withTimeout(Promise.resolve(1), 5000);
  } finally { global.setTimeout = st; global.clearTimeout = ct; }
  for (const h of made) assert.ok(cleared.has(h), 'timer leaked');
  assert.ok(made.size > 0);
});

test('mapLimit: preserves order', async () => {
  const r = await mapLimit([30, 5, 15], 2, async (ms, i) => { await sleep(ms); return i; });
  assert.deepEqual(r, [0, 1, 2]);
});

test('mapLimit: respects concurrency limit', async () => {
  let cur = 0, max = 0;
  await mapLimit([1, 2, 3, 4, 5, 6], 2, async () => { max = Math.max(max, ++cur); await sleep(10); cur--; });
  assert.equal(max, 2);
});

test('mapLimit: rejects if any task fails; empty input ok', async () => {
  await assert.rejects(mapLimit([1, 2, 3], 2, async (x) => { if (x === 2) throw new Error('bad'); return x; }), /bad/);
  assert.deepEqual(await mapLimit([], 3, async (x) => x), []);
});
