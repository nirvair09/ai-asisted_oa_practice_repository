const test = require('node:test');
const assert = require('node:assert/strict');
const { Emitter } = require('../src/emitter');

test('on/emit passes args, emit returns boolean', () => {
  const e = new Emitter(); const got = [];
  e.on('a', (x, y) => got.push([x, y]));
  assert.equal(e.emit('a', 1, 2), true);
  assert.equal(e.emit('none'), false);
  assert.deepEqual(got, [[1, 2]]);
});

test('once fires only once', () => {
  const e = new Emitter(); let n = 0;
  e.once('a', () => n++);
  e.emit('a'); e.emit('a');
  assert.equal(n, 1);
  assert.equal(e.listenerCount('a'), 0);
});

test('once listener can be removed with off(original fn)', () => {
  const e = new Emitter(); let n = 0; const fn = () => n++;
  e.once('a', fn); e.off('a', fn); e.emit('a');
  assert.equal(n, 0);
});

test('off during emit does not skip other listeners', () => {
  const e = new Emitter(); const calls = [];
  const a = () => { calls.push('a'); e.off('x', a); };
  const b = () => calls.push('b');
  e.on('x', a); e.on('x', b);
  e.emit('x');
  assert.deepEqual(calls, ['a', 'b']);
});

test('off removes only one registration of a duplicated listener', () => {
  const e = new Emitter(); let n = 0; const f = () => n++;
  e.on('a', f); e.on('a', f); e.off('a', f); e.emit('a');
  assert.equal(n, 1);
});

test('off cleans up empty event arrays (no leak)', () => {
  const e = new Emitter(); const f = () => {};
  e.on('a', f); e.off('a', f);
  assert.equal(Object.keys(e.listeners).length, 0);
});

test('error event with no listener throws', () => {
  const e = new Emitter();
  assert.throws(() => e.emit('error', new Error('kaput')), /kaput/);
  e.on('error', () => {});
  assert.doesNotThrow(() => e.emit('error', new Error('x')));
});

test('a throwing listener propagates out of emit', () => {
  const e = new Emitter();
  e.on('a', () => { throw new Error('listener failed'); });
  assert.throws(() => e.emit('a'), /listener failed/);
});

test('listenerCount + prependListener', () => {
  const e = new Emitter(); const order = [];
  e.on('a', () => order.push(1));
  e.prependListener('a', () => order.push(0));
  assert.equal(e.listenerCount('a'), 2);
  e.emit('a');
  assert.deepEqual(order, [0, 1]);
});
