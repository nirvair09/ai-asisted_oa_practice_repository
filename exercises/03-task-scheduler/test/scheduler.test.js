const test = require('node:test');
const assert = require('node:assert');
const { resolveOrder, parallelBatches } = require('../src/scheduler');

const diamond = [
  { id: 'd', deps: ['b', 'c'] },
  { id: 'b', deps: ['a'] },
  { id: 'c', deps: ['a'] },
  { id: 'a', deps: [] },
];

function assertValidOrder(tasks, order) {
  assert.strictEqual(order.length, tasks.length);
  assert.strictEqual(new Set(order).size, tasks.length, 'no duplicates');
  const pos = new Map(order.map((id, i) => [id, i]));
  for (const t of tasks) for (const d of t.deps) assert.ok(pos.get(d) < pos.get(t.id), `${d} before ${t.id}`);
}

test('orders dependencies before dependents, no duplicates', () => {
  assertValidOrder(diamond, resolveOrder(diamond));
});

test('empty input', () => {
  assert.deepStrictEqual(resolveOrder([]), []);
});

test('detects cycles', () => {
  const cyc = [
    { id: 'a', deps: ['b'] },
    { id: 'b', deps: ['a'] },
  ];
  assert.throws(() => resolveOrder(cyc), /cycle/i);
  assert.throws(() => resolveOrder([{ id: 'x', deps: ['x'] }]), /cycle/i);
});

test('unknown dependency', () => {
  assert.throws(() => resolveOrder([{ id: 'a', deps: ['ghost'] }]), /unknown/i);
});

test('parallelBatches on diamond', () => {
  assert.deepStrictEqual(parallelBatches(diamond), [['a'], ['b', 'c'], ['d']]);
});

test('parallelBatches independent tasks form one batch, input order kept', () => {
  const t = [
    { id: 'z', deps: [] },
    { id: 'y', deps: [] },
  ];
  assert.deepStrictEqual(parallelBatches(t), [['z', 'y']]);
});

test('parallelBatches propagates errors', () => {
  assert.throws(() => parallelBatches([{ id: 'a', deps: ['b'] }, { id: 'b', deps: ['a'] }]), /cycle/i);
  assert.throws(() => parallelBatches([{ id: 'a', deps: ['q'] }]), /unknown/i);
});

test('long chain does not overflow the stack (bonus)', () => {
  const n = 50000;
  const chain = [];
  for (let i = 0; i < n; i++) chain.push({ id: `t${i}`, deps: i ? [`t${i - 1}`] : [] });
  assert.strictEqual(resolveOrder(chain).length, n);
});
