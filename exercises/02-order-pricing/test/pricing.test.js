const test = require('node:test');
const assert = require('node:assert');
const { orderTotal, priceOrder } = require('../src/pricing');

const items = [{ priceCents: 999, qty: 3 }]; // subtotal 2997

test('orderTotal without code', () => {
  // tax = round(2997 * .08) = 240
  assert.strictEqual(orderTotal(items), 3237);
});

test('orderTotal with SAVE10 rounds to whole cents', () => {
  // discount round(299.7)=300 -> 2697, tax round(215.76)=216
  assert.strictEqual(orderTotal(items, 'SAVE10'), 2913);
});

test('unknown code ignored', () => {
  assert.strictEqual(orderTotal(items, 'NOPE'), 3237);
  assert.strictEqual(orderTotal(items, 'constructor'), 3237);
  assert.strictEqual(orderTotal(items, undefined), 3237);
});

test('validation', () => {
  assert.throws(() => orderTotal([]), TypeError);
  assert.throws(() => orderTotal('x'), TypeError);
  assert.throws(() => orderTotal([{ priceCents: 100, qty: 0 }]), TypeError);
  assert.throws(() => orderTotal([{ priceCents: 100, qty: 1.5 }]), TypeError);
  assert.throws(() => orderTotal([{ priceCents: -1, qty: 1 }]), TypeError);
});

test('priceOrder breakdown with shipping', () => {
  assert.deepStrictEqual(priceOrder(items), {
    subtotal: 2997,
    discount: 0,
    tax: 240,
    shipping: 499,
    total: 3736,
  });
});

test('priceOrder free shipping at threshold', () => {
  assert.deepStrictEqual(priceOrder([{ priceCents: 6000, qty: 1 }]), {
    subtotal: 6000,
    discount: 0,
    tax: 480,
    shipping: 0,
    total: 6480,
  });
});

test('priceOrder with discount dropping below free-shipping threshold', () => {
  // subtotal 5000, SAVE25 -> discount 1250, discounted 3750, tax 300, shipping 499
  assert.deepStrictEqual(priceOrder([{ priceCents: 2500, qty: 2 }], 'SAVE25'), {
    subtotal: 5000,
    discount: 1250,
    tax: 300,
    shipping: 499,
    total: 3750 + 300 + 499,
  });
});
