#!/usr/bin/env node
'use strict';

// A tiny CLI that prints a collection of jokes when run.
const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "I told my computer I needed a break, and now it won't stop sending me KitKat ads.",
  "Why did the developer go broke? Because he used up all his cache.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "There are only 10 types of people in the world: those who understand binary and those who don't.",
  "Why did the programmer quit his job? Because he didn't get arrays.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "Why was the function sad after a successful first date? It didn't get a callback.",
  "I would tell you a UDP joke, but you might not get it.",
  "Why do programmers hate nature? It has too many bugs.",
  "What's a programmer's favorite hangout place? The Foo Bar.",
  "Why did the private classes break up? Because they had no connection.",
  "To understand what recursion is, you must first understand recursion.",
  "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
  "What do you call a programmer from Finland? Nerdic.",
  "Why did the programmer always carry a pencil and paper? To draw their own conclusions.",
  "Debugging: being the detective in a crime movie where you are also the murderer.",
  "Why do Python developers wear glasses? Because they can't C.",
  "An optimist says the glass is half full. A pessimist says it's half empty. A programmer says the glass is twice as large as it needs to be.",
];

function main() {
  console.log(`Here are ${jokes.length} jokes for you:\n`);
  jokes.forEach((joke, index) => {
    console.log(`${index + 1}. ${joke}`);
  });
}

main();
