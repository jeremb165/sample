'use strict';

/**
 * Core weather helpers for the OSU weather Lambda.
 *
 * "OSU" is interpreted as The Ohio State University (Columbus, OH, USA).
 * Weather data comes from the US National Weather Service (NWS) API
 * (https://api.weather.gov), which is free and requires no API key.
 */

/** Static location record for The Ohio State University main campus. */
const OSU_LOCATION = Object.freeze({
  name: 'The Ohio State University',
  campus: 'Columbus (main campus)',
  city: 'Columbus',
  state: 'OH',
  country: 'USA',
  latitude: 40.0067,
  longitude: -83.0305,
});

// NWS requests a descriptive User-Agent so they can contact API consumers.
const USER_AGENT =
  'sample-osu-weather-lambda (https://github.com/jeremb165/sample)';

/**
 * Fetch JSON from a URL, throwing a descriptive error on a non-2xx response.
 * Uses the global `fetch` available in Node.js 18+.
 */
async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/geo+json',
    },
  });
  if (!res.ok) {
    throw new Error(`Request to ${url} failed with status ${res.status}`);
  }
  return res.json();
}

/**
 * Resolve the NWS forecast periods for a location.
 *
 * NWS requires two calls: first `/points/{lat},{lon}` to discover the
 * forecast endpoint for that grid cell, then the forecast endpoint itself.
 */
async function fetchForecastPeriods(location, { fetchImpl = fetchJson } = {}) {
  const pointsUrl = `https://api.weather.gov/points/${location.latitude},${location.longitude}`;
  const points = await fetchImpl(pointsUrl);
  const forecastUrl = points && points.properties && points.properties.forecast;
  if (!forecastUrl) {
    throw new Error('Could not resolve forecast URL from NWS points response');
  }

  const forecast = await fetchImpl(forecastUrl);
  const periods =
    forecast && forecast.properties && forecast.properties.periods;
  if (!Array.isArray(periods)) {
    throw new Error('NWS forecast response did not contain any periods');
  }
  return periods;
}

/**
 * Reduce raw NWS periods down to a clean, daytime-oriented summary for the
 * requested number of days (today + the following days).
 */
function summarizeDays(periods, days = 3) {
  const daytime = periods.filter((p) => p.isDaytime);
  // Prefer daytime periods; fall back to raw periods if none are flagged.
  const source = daytime.length > 0 ? daytime : periods;
  return source.slice(0, days).map((p) => ({
    name: p.name,
    startTime: p.startTime,
    endTime: p.endTime,
    isDaytime: p.isDaytime,
    temperature: p.temperature,
    temperatureUnit: p.temperatureUnit,
    windSpeed: p.windSpeed,
    windDirection: p.windDirection,
    shortForecast: p.shortForecast,
    detailedForecast: p.detailedForecast,
  }));
}

/**
 * Build the full response payload: the OSU location plus its forecast for
 * today and the next 2 days (3 daytime periods total).
 */
async function getOsuWeather({ days = 3, fetchImpl } = {}) {
  const periods = await fetchForecastPeriods(OSU_LOCATION, { fetchImpl });
  return {
    location: OSU_LOCATION,
    source: 'US National Weather Service (api.weather.gov)',
    generatedAt: new Date().toISOString(),
    forecast: summarizeDays(periods, days),
  };
}

module.exports = {
  OSU_LOCATION,
  fetchJson,
  fetchForecastPeriods,
  summarizeDays,
  getOsuWeather,
};
