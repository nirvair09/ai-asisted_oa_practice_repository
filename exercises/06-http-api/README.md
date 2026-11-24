# Exercise 6 – Tiny HTTP API (core `http`, no framework)

`src/app.js`

## Tasks
1. **Bug:** malformed JSON body crashes the request.
2. **Bug:** POST returns 200 and accepts any payload — should be 201 + validation (400).
3. **Bug:** pagination uses `slice(offset, limit)`; invalid `limit`/`offset` should be 400.
4. **Bug:** missing item returns 200 `null` — should be 404. Wrong method on a known path → 405.
5. **Feature:** `DELETE /items/:id` → 204 / 404.

Run: `npm run test:6` (Node 18+ for global `fetch`)
