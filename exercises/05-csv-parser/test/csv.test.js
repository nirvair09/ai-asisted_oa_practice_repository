const test = require('node:test');
const assert = require('node:assert/strict');
const { parseCSV, parseCSVToObjects } = require('../src/csv');

test('simple rows', () => {
  assert.deepEqual(parseCSV('a,b\n1,2'), [['a', 'b'], ['1', '2']]);
});
test('CRLF line endings', () => {
  assert.deepEqual(parseCSV('a,b\r\n1,2\r\n'), [['a', 'b'], ['1', '2']]);
});
test('trailing newline does not add an empty row', () => {
  assert.deepEqual(parseCSV('a\n1\n'), [['a'], ['1']]);
});
test('quoted field containing comma', () => {
  assert.deepEqual(parseCSV('"Smith, J",42'), [['Smith, J', '42']]);
});
test('escaped quotes inside quoted field', () => {
  assert.deepEqual(parseCSV('"say ""hi""",x'), [['say "hi"', 'x']]);
});
test('quoted field containing newline', () => {
  assert.deepEqual(parseCSV('"a\nb",c\nd,e'), [['a\nb', 'c'], ['d', 'e']]);
});
test('empty fields preserved', () => {
  assert.deepEqual(parseCSV('a,,c\n,,'), [['a', '', 'c'], ['', '', '']]);
});
test('empty input -> []', () => {
  assert.deepEqual(parseCSV(''), []);
});
test('toObjects maps header to values', () => {
  assert.deepEqual(parseCSVToObjects('name,age\nAnn,30\nBob,25\n'), [
    { name: 'Ann', age: '30' }, { name: 'Bob', age: '25' },
  ]);
});
test('toObjects: short rows padded, blank rows skipped', () => {
  assert.deepEqual(parseCSVToObjects('a,b\n1\n\n2,3'), [{ a: '1', b: '' }, { a: '2', b: '3' }]);
});
