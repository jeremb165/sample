'use strict';

const assert = require('node:assert');
const { reverse } = require('../reverse.js');

let passed = 0;
function check(name, actual, expected) {
  assert.strictEqual(actual, expected, `${name}: expected "${expected}", got "${actual}"`);
  passed += 1;
}

check('simple word', reverse('hello'), 'olleh');
check('sentence', reverse('hello world'), 'dlrow olleh');
check('empty string', reverse(''), '');
check('single char', reverse('a'), 'a');
check('palindrome', reverse('racecar'), 'racecar');
check('numbers', reverse('12345'), '54321');
// Unicode code-point awareness: astral characters are not split.
check('emoji preserved', reverse('a👍b'), 'b👍a');

console.log(`All ${passed} tests passed.`);
