#!/usr/bin/env node
'use strict';

// A tiny CLI that prints 3 jokes when run.
const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "I told my computer I needed a break, and now it won't stop sending me KitKat ads.",
  "Why did the developer go broke? Because he used up all his cache.",
];

function main() {
  console.log("Here are 3 jokes for you:\n");
  jokes.forEach((joke, index) => {
    console.log(`${index + 1}. ${joke}`);
  });
}

main();
