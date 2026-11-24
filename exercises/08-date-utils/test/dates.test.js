const test = require('node:test');
const assert = require('node:assert/strict');
const d = require('../src/dates');
const U = (s) => new Date(s + 'T00:00:00Z');
const iso = (x) => x.toISOString().slice(0, 10);

test('isLeapYear', () => {
  assert.equal(d.isLeapYear(2024), true);
  assert.equal(d.isLeapYear(1900), false);
  assert.equal(d.isLeapYear(2000), true);
  assert.equal(d.isLeapYear(2023), false);
});

test('addMonths clamps to end of month', () => {
  assert.equal(iso(d.addMonths(U('2023-01-31'), 1)), '2023-02-28');
  assert.equal(iso(d.addMonths(U('2024-01-31'), 1)), '2024-02-29');
  assert.equal(iso(d.addMonths(U('2023-03-31'), -1)), '2023-02-28');
});

test('addMonths crosses years and keeps normal days', () => {
  assert.equal(iso(d.addMonths(U('2023-11-15'), 3)), '2024-02-15');
  assert.equal(iso(d.addMonths(U('2023-01-15'), -2)), '2022-11-15');
  assert.equal(iso(d.addMonths(U('2023-01-31'), 12)), '2024-01-31');
});

test('addMonths does not mutate input', () => {
  const x = U('2023-01-31'); d.addMonths(x, 1);
  assert.equal(iso(x), '2023-01-31');
});

test('daysBetween ignores time of day and handles negatives', () => {
  assert.equal(d.daysBetween(new Date('2023-03-01T23:00:00Z'), new Date('2023-03-02T01:00:00Z')), 1);
  assert.equal(d.daysBetween(U('2023-03-05'), U('2023-03-01')), -4);
  assert.equal(d.daysBetween(U('2023-03-01'), new Date('2023-03-01T23:59:59Z')), 0);
});

test('startOfWeek is Monday', () => {
  assert.equal(iso(d.startOfWeek(U('2024-05-15'))), '2024-05-13'); // Wed
  assert.equal(iso(d.startOfWeek(U('2024-05-13'))), '2024-05-13'); // Mon
  assert.equal(iso(d.startOfWeek(U('2024-05-19'))), '2024-05-13'); // Sun
});

test('formatDate zero-pads', () => {
  assert.equal(d.formatDate(U('2024-03-07')), '2024-03-07');
  assert.equal(d.formatDate(U('2024-12-25')), '2024-12-25');
});

test('businessDaysBetween', () => {
  assert.equal(d.businessDaysBetween(U('2024-05-13'), U('2024-05-20')), 5); // Mon -> next Mon
  assert.equal(d.businessDaysBetween(U('2024-05-17'), U('2024-05-20')), 1); // Fri -> Mon
  assert.equal(d.businessDaysBetween(U('2024-05-18'), U('2024-05-19')), 0); // Sat
  assert.equal(d.businessDaysBetween(U('2024-05-13'), U('2024-05-13')), 0);
  assert.equal(d.businessDaysBetween(U('2024-01-01'), U('2024-03-01')), 43);
});
