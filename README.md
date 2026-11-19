# sample

A small collection of no-dependency Node.js CLI tools:

- `jokes` — prints 3 jokes when run.
- `weather` — looks up and prints the current weather for a location.

## Jokes

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
Here are 3 jokes for you:

1. Why do programmers prefer dark mode? Because light attracts bugs.
2. I told my computer I needed a break, and now it won't stop sending me KitKat ads.
3. Why did the developer go broke? Because he used up all his cache.
```

## Weather

Looks up the current weather for a location using the free
[Open-Meteo API](https://open-meteo.com/), which requires **no API key** and no
sign-up. Needs network access and Node.js 18+ (uses the built-in `fetch`).

Pass a place name as an argument (defaults to London if omitted):

```bash
node weather.js "New York"
node weather.js Paris
node weather.js            # defaults to London
```

Or use the `weather` script / command:

```bash
npm run weather -- "New York"

# after installing globally (npm install -g .)
weather "New York"
```

Example output:

```
Current weather in New York, United States:

  Conditions:  Clear sky
  Temperature: 16.3°C (feels like 12.9°C)
  Humidity:    30%
  Wind:        7.2 km/h

  As of 2026-11-19T16:00
```
