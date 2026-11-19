#!/usr/bin/env node
'use strict';

/**
 * reverse.js — read text input and output it reversed.
 *
 * Input sources (in priority order):
 *   1. Command-line arguments: `node reverse.js hello world`
 *   2. Standard input (when no arguments are given): `echo hello | node reverse.js`
 *
 * The reversal is Unicode-aware: it operates on code points (via the string
 * iterator) rather than UTF-16 code units, so characters outside the Basic
 * Multilingual Plane (e.g. many emoji) are not split apart.
 */

/**
 * Reverse a string by Unicode code points.
 * @param {string} text
 * @returns {string}
 */
function reverse(text) {
  return Array.from(text).reverse().join('');
}

/**
 * Read all of standard input as a string.
 * @returns {Promise<string>}
 */
function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

async function main() {
  const args = process.argv.slice(2);

  let input;
  if (args.length > 0) {
    input = args.join(' ');
  } else {
    input = await readStdin();
  }

  // Preserve the input's trailing newline (if any) so piped output stays tidy,
  // while reversing the actual text content.
  const hasTrailingNewline = input.endsWith('\n');
  const text = hasTrailingNewline ? input.slice(0, -1) : input;

  process.stdout.write(reverse(text));
  if (hasTrailingNewline || args.length > 0) {
    process.stdout.write('\n');
  }
}

if (require.main === module) {
  main().catch((err) => {
    process.stderr.write(`reverse: ${err.message}\n`);
    process.exit(1);
  });
}

module.exports = { reverse };
