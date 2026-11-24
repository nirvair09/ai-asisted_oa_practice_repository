# Exercise 1 – LRU Cache

`src/lruCache.js` is an in-memory cache used by a product-catalog service.

## Tasks
1. **Bug:** Recently *read* entries are still being evicted. Fix eviction order.
2. **Validation:** The constructor must throw a `RangeError` if capacity is not a positive integer.
3. **Feature:** Support an optional TTL: `set(key, value, ttlMs)`. Expired entries must behave as
   missing for `get`/`has`, and must not count toward `size`. Use the injected `now()` clock.
4. Keep `get`/`set` O(1).

Run: `npm run test:1` from the repo root.
