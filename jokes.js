#!/usr/bin/env node
'use strict';

// A tiny CLI that prints 3 Ohio State jokes when run.
const jokes = [
  "Why did the Ohio State fan bring a ladder to the game? Because they heard the Buckeyes were going all the way to the top.",
  "How many Michigan fans does it take to change a lightbulb? None — they just sit in the dark and talk about how great it was in 1997.",
  "Why is it so windy in Ohio Stadium? Because 100,000 Buckeye fans are all screaming 'O-H-I-O' at once.",
];

function main() {
  console.log("Here are 3 Ohio State jokes for you:\n");
  jokes.forEach((joke, index) => {
    console.log(`${index + 1}. ${joke}`);
  });
}

main();
