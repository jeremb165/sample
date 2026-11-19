'use strict';

/**
 * AWS Lambda handler that responds with the OSU location and its weather
 * forecast for today and the next 2 days.
 *
 * Works both as a classic Lambda (direct invocation) and behind an
 * API Gateway / Lambda Function URL (returns an HTTP proxy response).
 */

const { getOsuWeather } = require('./weather');

/**
 * Lambda entry point.
 *
 * @param {object} [event] - Lambda event. An optional `days` query-string
 *   parameter (API Gateway) controls how many days are returned (default 3).
 * @returns {Promise<{statusCode:number, headers:object, body:string}>}
 */
async function handler(event = {}) {
  try {
    const requestedDays = parseDays(event);
    const payload = await getOsuWeather({ days: requestedDays });

    return respond(200, payload);
  } catch (err) {
    return respond(502, {
      error: 'Failed to retrieve OSU weather forecast',
      message: err && err.message ? err.message : String(err),
    });
  }
}

/** Read an optional `days` value from an API Gateway-style event. */
function parseDays(event) {
  const raw =
    event &&
    event.queryStringParameters &&
    event.queryStringParameters.days;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 7) {
    return parsed;
  }
  return 3;
}

/** Build an API Gateway proxy-style JSON response. */
function respond(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

module.exports = { handler, parseDays };

// Allow running locally: `node lambda.js`
if (require.main === module) {
  handler()
    .then((res) => {
      console.log(JSON.stringify(JSON.parse(res.body), null, 2));
      process.exit(res.statusCode === 200 ? 0 : 1);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
