const test = require('node:test');
const assert = require('node:assert');
const { LRUCache } = require('../src/lruCache');

test('stores and retrieves values', () => {
  const c = new LRUCache(2);
  c.set('a', 1);
  assert.strictEqual(c.get('a'), 1);
  assert.strictEqual(c.get('missing'), undefined);
});

test('evicts least recently set when over capacity', () => {
  const c = new LRUCache(2);
  c.set('a', 1);
  c.set('b', 2);
  c.set('c', 3);
  assert.strictEqual(c.has('a'), false);
  assert.strictEqual(c.size, 2);
});

test('get refreshes recency', () => {
  const c = new LRUCache(2);
  c.set('a', 1);
  c.set('b', 2);
  c.get('a');
  c.set('c', 3);
  assert.strictEqual(c.has('a'), true);
  assert.strictEqual(c.has('b'), false);
});

test('overwriting a key refreshes recency and does not grow size', () => {
  const c = new LRUCache(2);
  c.set('a', 1);
  c.set('b', 2);
  c.set('a', 10);
  c.set('c', 3);
  assert.strictEqual(c.get('a'), 10);
  assert.strictEqual(c.has('b'), false);
  assert.strictEqual(c.size, 2);
});

test('rejects invalid capacity', () => {
  for (const bad of [0, -1, 1.5, NaN, '3', undefined]) {
    assert.throws(() => new LRUCache(bad), RangeError, `capacity ${String(bad)}`);
  }
});

test('ttl: entry expires', () => {
  let t = 1000;
  const c = new LRUCache(2, () => t);
  c.set('a', 1, 500);
  assert.strictEqual(c.get('a'), 1);
  t = 1499;
  assert.strictEqual(c.get('a'), 1);
  t = 1500;
  assert.strictEqual(c.get('a'), undefined);
  assert.strictEqual(c.has('a'), false);
});

test('ttl: expired entries do not count toward size', () => {
  let t = 0;
  const c = new LRUCache(3, () => t);
  c.set('a', 1, 10);
  c.set('b', 2);
  t = 10;
  assert.strictEqual(c.size, 1);
});

test('ttl: re-setting without ttl clears the old expiry', () => {
  let t = 0;
  const c = new LRUCache(2, () => t);
  c.set('a', 1, 10);
  c.set('a', 2);
  t = 100;
  assert.strictEqual(c.get('a'), 2);
});

test('ttl: expired entries are not kept in place of live ones', () => {
  let t = 0;
  const c = new LRUCache(2, () => t);
  c.set('a', 1, 10);
  c.set('b', 2);
  t = 50;
  c.set('c', 3);
  assert.strictEqual(c.get('b'), 2);
  assert.strictEqual(c.get('c'), 3);
});
