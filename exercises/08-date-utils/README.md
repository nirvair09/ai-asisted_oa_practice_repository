# Exercise 8 – Date utilities

`src/dates.js`

## Tasks
1. **Bug:** `isLeapYear` ignores century rules.
2. **Bug:** `addMonths` overflows (Jan 31 + 1 month → March).
3. **Bug:** `daysBetween` should ignore time-of-day.
4. **Bug:** `startOfWeek` returns Sunday / is wrong for Sundays.
5. **Bug:** `formatDate` isn't zero-padded.
6. **Feature:** `businessDaysBetween` (O(1) or O(n), your call — explain trade-off).

Run: `npm run test:8`
