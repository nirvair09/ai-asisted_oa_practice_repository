# Exercise 4 – Async utilities

`src/async.js`

## Tasks
1. **Bug:** `retry` never catches async rejections, and attempt counting is off
   (`retries: 2` = 1 initial + 2 retries). Also no delay after the last failure.
2. **Bug:** `withTimeout` never rejects, and leaks its timer.
3. **Feature:** implement `mapLimit` (ordered results, max `limit` in flight, reject on first error).

Run: `npm run test:4`
