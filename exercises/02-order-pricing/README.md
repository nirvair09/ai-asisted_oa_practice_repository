# Exercise 2 – Order Pricing

`src/pricing.js` computes checkout totals. All money is **integer cents**.

## Tasks
1. **Bug:** Totals come out as fractional cents (e.g. `2913.0000000000005`). Round correctly.
   Discount and tax must each be rounded to whole cents (`Math.round`); tax applies to the
   *discounted* amount at 8%.
2. **Bug:** Unknown/expired discount codes should be ignored (no discount, no crash, and
   inherited property names like `"constructor"` must not count as codes).
3. **Validation:** `items` must be a non-empty array; each `qty` a positive integer and
   `priceCents` a non-negative integer, otherwise throw `TypeError`.
4. **Feature:** Implement `priceOrder(items, code)` returning
   `{ subtotal, discount, tax, shipping, total }`. Shipping is 499 cents unless the discounted
   amount is >= 5000, in which case it is free.

Run: `npm run test:2` from the repo root.
