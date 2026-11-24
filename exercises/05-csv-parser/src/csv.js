// Parses CSV text into an array of rows (arrays of strings).
function parseCSV(text) {
  return text.split('\n').map((line) => line.split(','));
}

// First row is the header; returns array of objects.
// Numeric-looking cells stay strings. Missing cells become ''. Skips blank rows.
function parseCSVToObjects(text) {
  throw new Error('not implemented');
}

module.exports = { parseCSV, parseCSVToObjects };
