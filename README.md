# Amazon OA – AI-assisted repo practice (Node.js)

Each exercise is a tiny repo: read the code, run the tests, fix bugs, add the feature.
Run with `npm run test:1` … `test:9` (Node 18+, no dependencies).

| # | Exercise | Skills |
|---|----------|--------|
| 1 | LRU cache | bug fix, TTL feature, input validation |
| 2 | Order pricing | money/rounding bugs, new function |
| 3 | Task scheduler | graph/DFS, cycle detection, batching |
| 4 | Async utils | missing await, off-by-one retries, timeouts/timer leaks, concurrency limiter |
| 5 | CSV parser | parsing state machine, edge cases (quotes, CRLF, trailing newline) |
| 6 | HTTP API (core http) | status codes, validation, malformed JSON, pagination, new endpoint |
| 7 | Event emitter | once/off semantics, mutation-during-iteration, error event, leaks |
| 8 | Date utils | leap years, month overflow, time-of-day, padding, business days |
| 9 | Security hardening | path traversal, XSS escaping, prototype pollution, SQL injection, timing attacks |

## How to practice (mimic the real thing)
1. Set a 30–35 min timer per exercise (real round: 100 min for 2 problems).
2. Read the code and tests FIRST. Form your own diagnosis before prompting any AI.
3. Give the AI assistant precise, small tasks with context. Don't paste "fix everything".
4. Review every change it makes: does it break other tests? Edge cases?
5. Run the tests yourself; don't trust claims.
6. Don't edit the tests to make them pass.

Each exercise's own README lists the task. Don't read the solutions hints until after.
