# Exercise 5 – CSV parser

`src/csv.js`

## Tasks
1. **Bug:** `parseCSV` is a naive split. Support quoted fields, `""` escapes, embedded
   newlines/commas, CRLF, no phantom trailing row. (Write a small state machine.)
2. **Feature:** implement `parseCSVToObjects`.

Run: `npm run test:5`
