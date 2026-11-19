# sample

A small Node.js CLI tool that prints 20 jokes when run.

## Usage

Requires [Node.js](https://nodejs.org/) (no dependencies to install).

Run it directly with Node:

```bash
node jokes.js
```

Or use the `start` script:

```bash
npm start
```

### Install as a command

Install the package globally (or link it during development) to use the `jokes` command, which is wired up via the `bin` entry in `package.json`:

```bash
npm install -g .
# then run:
jokes
```

Example output:

```
Here are 20 jokes for you:

1. Why do programmers prefer dark mode? Because light attracts bugs.
2. I told my computer I needed a break, and now it won't stop sending me KitKat ads.
3. Why did the developer go broke? Because he used up all his cache.
...
20. An optimist says the glass is half full. A pessimist says it's half empty. A programmer says the glass is twice as large as it needs to be.
```
