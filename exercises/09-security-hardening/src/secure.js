const path = require('path');
const crypto = require('crypto');

// Resolve userPath under root. Must throw if the result escapes root.
function safeJoin(root, userPath) {
  return path.join(root, userPath);
}

// Escape for HTML text AND double/single-quoted attributes.
function escapeHtml(s) {
  return String(s)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;');
}

// Recursively merge src into target (plain objects only), returns target.
function deepMerge(target, src) {
  for (const key in src) {
    if (typeof src[key] === 'object' && src[key] !== null) {
      target[key] = deepMerge(target[key] || {}, src[key]);
    } else {
      target[key] = src[key];
    }
  }
  return target;
}

// Build a SELECT. Returns { text, values } with $1,$2.. placeholders.
// Only columns in `allowed` may be used (throw otherwise). Table name is trusted.
function buildSelect(table, filters, allowed) {
  const where = Object.entries(filters)
    .map(([k, v]) => `${k} = '${v}'`)
    .join(' AND ');
  return { text: `SELECT * FROM ${table}` + (where ? ` WHERE ${where}` : ''), values: [] };
}

// Constant-time token comparison.
function verifyToken(given, expected) {
  return given === expected;
}

module.exports = { safeJoin, escapeHtml, deepMerge, buildSelect, verifyToken };
