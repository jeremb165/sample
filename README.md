# sample

A small Node.js CLI tool that prints 3 jokes when run.

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
Here are 3 jokes for you:

1. Why do programmers prefer dark mode? Because light attracts bugs.
2. I told my computer I needed a break, and now it won't stop sending me KitKat ads.
3. Why did the developer go broke? Because he used up all his cache.
```

## OSU weather Lambda

`lambda.js` is an AWS Lambda handler that responds with the OSU location and
its weather forecast for **today and the next 2 days**.

- **"OSU"** is interpreted as **The Ohio State University** (Columbus, OH, USA).
- Weather data comes from the US National Weather Service API
  (`https://api.weather.gov`), which is free and requires **no API key**.
- No third-party dependencies — it uses the global `fetch` built into
  Node.js 18+.

### Run it locally

```bash
npm run weather
# or
node lambda.js
```

This prints a JSON payload containing the location and the 3-day forecast.

### Deploy as an AWS Lambda

Zip the repository and upload it (or use your IaC tool of choice) with:

- **Runtime:** Node.js 18.x or newer
- **Handler:** `lambda.handler`

The handler works for direct invocations and behind API Gateway / a Lambda
Function URL (it returns an HTTP proxy response with `statusCode`, `headers`,
and a JSON `body`). Behind API Gateway you can pass an optional `days`
query-string parameter (1–7, default 3).

### Response shape

```json
{
  "location": {
    "name": "The Ohio State University",
    "city": "Columbus",
    "state": "OH",
    "country": "USA",
    "latitude": 40.0067,
    "longitude": -83.0305
  },
  "source": "US National Weather Service (api.weather.gov)",
  "generatedAt": "2026-11-19T22:18:30.166Z",
  "forecast": [
    { "name": "Today", "temperature": 62, "temperatureUnit": "F", "shortForecast": "Mostly Sunny", "...": "..." }
  ]
}
```

### Tests

```bash
npm test
```

Tests use Node's built-in test runner and stub the network layer, so they run
without internet access.
