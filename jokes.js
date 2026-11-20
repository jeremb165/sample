#!/usr/bin/env node
'use strict';

// A tiny CLI that prints 3 jokes when run.
const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "I told my computer I needed a break, and now it won't stop sending me KitKat ads.",
  "Why did the developer go broke? Because he used up all his cache.",
];

function formatJokes(list) {
  const lines = ["Here are 3 jokes for you:\n"];
  list.forEach((joke, index) => {
    lines.push(`${index + 1}. ${joke}`);
  });
  return lines.join("\n");
}

function main() {
  console.log(formatJokes(jokes));
}

// Only run when executed directly as a CLI, so the module can be imported in tests.
if (require.main === module) {
  main();
}

module.exports = { jokes, formatJokes, main };
