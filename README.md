# sample

A small Node.js CLI tool that prints 3 Ohio State jokes when run.

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
Here are 3 Ohio State jokes for you:

1. Why did the Ohio State fan bring a ladder to the game? Because they heard the Buckeyes were going all the way to the top.
2. How many Michigan fans does it take to change a lightbulb? None — they just sit in the dark and talk about how great it was in 1997.
3. Why is it so windy in Ohio Stadium? Because 100,000 Buckeye fans are all screaming 'O-H-I-O' at once.
```
