'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  OSU_LOCATION,
  fetchForecastPeriods,
  summarizeDays,
  getOsuWeather,
} = require('../weather');
const { handler, parseDays } = require('../lambda');

// Minimal fake NWS responses used to drive the code without network access.
const POINTS_RESPONSE = {
  properties: { forecast: 'https://api.weather.gov/gridpoints/ILN/82,96/forecast' },
};

const FORECAST_RESPONSE = {
  properties: {
    periods: [
      { number: 1, name: 'Today', startTime: '2026-11-19T06:00:00-05:00', endTime: '2026-11-19T18:00:00-05:00', isDaytime: true, temperature: 52, temperatureUnit: 'F', windSpeed: '10 mph', windDirection: 'SW', shortForecast: 'Sunny', detailedForecast: 'Sunny, with a high near 52.' },
      { number: 2, name: 'Tonight', isDaytime: false, temperature: 38, temperatureUnit: 'F', windSpeed: '5 mph', windDirection: 'S', shortForecast: 'Clear', detailedForecast: 'Clear, low around 38.' },
      { number: 3, name: 'Thursday', isDaytime: true, temperature: 55, temperatureUnit: 'F', windSpeed: '8 mph', windDirection: 'W', shortForecast: 'Partly Cloudy', detailedForecast: 'Partly cloudy, high near 55.' },
      { number: 4, name: 'Thursday Night', isDaytime: false, temperature: 40, temperatureUnit: 'F', windSpeed: '6 mph', windDirection: 'NW', shortForecast: 'Cloudy', detailedForecast: 'Cloudy, low around 40.' },
      { number: 5, name: 'Friday', isDaytime: true, temperature: 50, temperatureUnit: 'F', windSpeed: '12 mph', windDirection: 'N', shortForecast: 'Rain', detailedForecast: 'Rain likely, high near 50.' },
      { number: 6, name: 'Friday Night', isDaytime: false, temperature: 35, temperatureUnit: 'F', windSpeed: '9 mph', windDirection: 'N', shortForecast: 'Showers', detailedForecast: 'Showers, low around 35.' },
    ],
  },
};

function makeFakeFetch() {
  return async (url) => {
    if (url.includes('/points/')) return POINTS_RESPONSE;
    if (url.includes('/forecast')) return FORECAST_RESPONSE;
    throw new Error(`Unexpected URL: ${url}`);
  };
}

test('OSU_LOCATION points at The Ohio State University', () => {
  assert.equal(OSU_LOCATION.name, 'The Ohio State University');
  assert.equal(OSU_LOCATION.state, 'OH');
  assert.ok(Math.abs(OSU_LOCATION.latitude - 40.0) < 1);
  assert.ok(Math.abs(OSU_LOCATION.longitude + 83.0) < 1);
});

test('fetchForecastPeriods follows the two-step NWS flow', async () => {
  const periods = await fetchForecastPeriods(OSU_LOCATION, {
    fetchImpl: makeFakeFetch(),
  });
  assert.equal(periods.length, 6);
});

test('summarizeDays returns only daytime periods, 3 by default', () => {
  const days = summarizeDays(FORECAST_RESPONSE.properties.periods);
  assert.equal(days.length, 3);
  assert.deepEqual(
    days.map((d) => d.name),
    ['Today', 'Thursday', 'Friday'],
  );
  assert.ok(days.every((d) => d.isDaytime === true));
});

test('getOsuWeather returns location and a 3-day forecast', async () => {
  const result = await getOsuWeather({ fetchImpl: makeFakeFetch() });
  assert.equal(result.location.name, 'The Ohio State University');
  assert.equal(result.forecast.length, 3);
  assert.ok(result.source.includes('National Weather Service'));
  assert.ok(result.generatedAt);
});

test('parseDays clamps to a safe range and defaults to 3', () => {
  assert.equal(parseDays({}), 3);
  assert.equal(parseDays({ queryStringParameters: { days: '2' } }), 2);
  assert.equal(parseDays({ queryStringParameters: { days: '99' } }), 3);
  assert.equal(parseDays({ queryStringParameters: { days: 'abc' } }), 3);
});

test('handler returns a 200 proxy response with forecast JSON', async (t) => {
  // Stub the global fetch so the handler runs without network access.
  const original = global.fetch;
  global.fetch = async (url) => ({
    ok: true,
    status: 200,
    json: async () => makeFakeFetch()(url),
  });
  t.after(() => {
    global.fetch = original;
  });

  const res = await handler({});
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['Content-Type'], 'application/json');
  const body = JSON.parse(res.body);
  assert.equal(body.location.name, 'The Ohio State University');
  assert.equal(body.forecast.length, 3);
});

test('handler returns a 502 when the upstream API fails', async (t) => {
  const original = global.fetch;
  global.fetch = async () => ({ ok: false, status: 500, json: async () => ({}) });
  t.after(() => {
    global.fetch = original;
  });

  const res = await handler({});
  assert.equal(res.statusCode, 502);
  const body = JSON.parse(res.body);
  assert.equal(body.error, 'Failed to retrieve OSU weather forecast');
});
