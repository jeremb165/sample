#!/usr/bin/env node
'use strict';

// A tiny CLI that looks up the current weather for a location and prints it.
//
// Uses the free Open-Meteo API (https://open-meteo.com/), which requires no
// API key or sign-up:
//   - Geocoding: resolves a place name to latitude/longitude.
//   - Forecast:  returns the current weather for those coordinates.
//
// Usage:
//   node weather.js                 # defaults to London
//   node weather.js "New York"
//   node weather.js Paris

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// WMO weather interpretation codes -> human-readable descriptions.
// See https://open-meteo.com/en/docs (WMO Weather interpretation codes).
const WEATHER_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

function describeWeatherCode(code) {
  return WEATHER_CODES[code] || `Unknown (code ${code})`;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function geocode(place) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(place)}&count=1&language=en&format=json`;
  const data = await fetchJson(url);
  if (!data.results || data.results.length === 0) {
    throw new Error(`Could not find a location named "${place}".`);
  }
  const { latitude, longitude, name, country } = data.results[0];
  return { latitude, longitude, name, country };
}

async function getCurrentWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    timezone: 'auto',
  });
  const data = await fetchJson(`${FORECAST_URL}?${params.toString()}`);
  if (!data.current) {
    throw new Error('Weather data was not available for this location.');
  }
  return { current: data.current, units: data.current_units || {} };
}

async function main() {
  const place = process.argv.slice(2).join(' ').trim() || 'London';

  try {
    const location = await geocode(place);
    const { current, units } = await getCurrentWeather(
      location.latitude,
      location.longitude
    );

    const locationLabel = [location.name, location.country]
      .filter(Boolean)
      .join(', ');

    console.log(`Current weather in ${locationLabel}:\n`);
    console.log(`  Conditions:  ${describeWeatherCode(current.weather_code)}`);
    console.log(
      `  Temperature: ${current.temperature_2m}${units.temperature_2m || '°C'} ` +
        `(feels like ${current.apparent_temperature}${units.apparent_temperature || '°C'})`
    );
    console.log(
      `  Humidity:    ${current.relative_humidity_2m}${units.relative_humidity_2m || '%'}`
    );
    console.log(
      `  Wind:        ${current.wind_speed_10m} ${units.wind_speed_10m || 'km/h'}`
    );
    if (current.time) {
      console.log(`\n  As of ${current.time}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
