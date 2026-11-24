# Exercise 3 – Task Scheduler

`src/scheduler.js` orders build tasks given dependencies: `{ id, deps: [ids] }`.

## Tasks
1. **Bug:** `resolveOrder` returns duplicates when tasks share dependencies.
2. **Bug:** Circular dependencies crash with a stack overflow. Throw
   `Error` whose message matches `/cycle/i`.
3. **Bug:** A dependency on a task that doesn't exist crashes with a `TypeError`. Throw
   `Error` matching `/unknown/i` instead.
4. **Feature:** Implement `parallelBatches(tasks)`: returns arrays of ids, where each batch
   contains tasks whose deps are all in earlier batches. Within a batch, keep input order.
5. Aim for O(V + E). Avoid recursion depth problems for long chains if you can (bonus).

Run: `npm run test:3` from the repo root.
