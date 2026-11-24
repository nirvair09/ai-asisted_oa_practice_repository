# Exercise 9 – Security hardening

`src/secure.js`

## Tasks
1. **Bug:** `safeJoin` allows path traversal (also watch the `/srv/files-evil` prefix trick and null bytes).
2. **Bug:** `escapeHtml` order double-escapes and misses quotes.
3. **Bug:** `deepMerge` is vulnerable to prototype pollution and shares references.
4. **Bug:** `buildSelect` is SQL-injectable → parameterize + column whitelist.
5. **Bug:** `verifyToken` isn't constant-time (`crypto.timingSafeEqual`, mind length mismatch).

Run: `npm run test:9`
