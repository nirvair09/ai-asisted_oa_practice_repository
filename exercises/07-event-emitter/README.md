# Exercise 7 – Event emitter

`src/emitter.js`

## Tasks
1. **Bug:** `once` fires every time. It must also be removable via `off(event, originalFn)`.
2. **Bug:** removing a listener while emitting skips others.
3. **Bug:** `emit` return value, `'error'` semantics, `off` removes only one duplicate and
   leaves no empty arrays behind.
4. **Feature:** `listenerCount`, `prependListener`.

Run: `npm run test:7`
