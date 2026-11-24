const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const s = require('../src/secure');

const root = path.resolve('/srv/files');

test('safeJoin allows normal and nested paths', () => {
  assert.equal(s.safeJoin(root, 'a/b.txt'), path.join(root, 'a', 'b.txt'));
  assert.equal(s.safeJoin(root, './a/../b.txt'), path.join(root, 'b.txt'));
});
test('safeJoin blocks traversal and absolute paths', () => {
  assert.throws(() => s.safeJoin(root, '../etc/passwd'));
  assert.throws(() => s.safeJoin(root, 'a/../../x'));
  assert.throws(() => s.safeJoin(root, path.resolve('/etc/passwd')));
});
test('safeJoin blocks sibling-prefix escape (/srv/files-evil)', () => {
  assert.throws(() => s.safeJoin(root, '../files-evil/x'));
});
test('safeJoin rejects null bytes', () => {
  assert.throws(() => s.safeJoin(root, 'a\0b'));
});

test('escapeHtml escapes all five chars, no double-escaping', () => {
  assert.equal(s.escapeHtml(`<a href="x" t='y'>&</a>`),
    '&lt;a href=&quot;x&quot; t=&#39;y&#39;&gt;&amp;&lt;/a&gt;');
  assert.equal(s.escapeHtml('a & b'), 'a &amp; b');
  assert.equal(s.escapeHtml(5), '5');
});

test('deepMerge merges nested objects', () => {
  assert.deepEqual(s.deepMerge({ a: { x: 1 }, b: 1 }, { a: { y: 2 }, c: 3 }), { a: { x: 1, y: 2 }, b: 1, c: 3 });
});
test('deepMerge is immune to prototype pollution', () => {
  s.deepMerge({}, JSON.parse('{"__proto__":{"polluted":true}}'));
  s.deepMerge({}, JSON.parse('{"constructor":{"prototype":{"polluted2":true}}}'));
  assert.equal({}.polluted, undefined);
  assert.equal({}.polluted2, undefined);
});
test('deepMerge does not share references with src', () => {
  const src = { a: { n: 1 } };
  const out = s.deepMerge({}, src);
  out.a.n = 2;
  assert.equal(src.a.n, 1);
});

test('buildSelect uses placeholders (no injection)', () => {
  const q = s.buildSelect('users', { name: "x' OR '1'='1", age: 5 }, ['name', 'age']);
  assert.equal(q.text, 'SELECT * FROM users WHERE name = $1 AND age = $2');
  assert.deepEqual(q.values, ["x' OR '1'='1", 5]);
});
test('buildSelect rejects non-whitelisted columns', () => {
  assert.throws(() => s.buildSelect('users', { 'name; DROP TABLE users--': 1 }, ['name']));
});
test('buildSelect with no filters', () => {
  assert.deepEqual(s.buildSelect('users', {}, ['name']), { text: 'SELECT * FROM users', values: [] });
});

test('verifyToken works and never throws on length mismatch', () => {
  assert.equal(s.verifyToken('abc123', 'abc123'), true);
  assert.equal(s.verifyToken('abc123', 'abc124'), false);
  assert.equal(s.verifyToken('short', 'muchlongertoken'), false);
  assert.equal(s.verifyToken(undefined, 'x'), false);
});
test('verifyToken uses crypto.timingSafeEqual', (t) => {
  const m = t.mock.method(require('crypto'), 'timingSafeEqual');
  s.verifyToken('abc', 'abc');
  assert.ok(m.mock.callCount() >= 1);
});
