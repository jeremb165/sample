'use strict';

const { jokes, formatJokes, main } = require('./jokes');

describe('jokes', () => {
  test('exports exactly 3 jokes', () => {
    expect(Array.isArray(jokes)).toBe(true);
    expect(jokes).toHaveLength(3);
  });

  test('every joke is a non-empty string', () => {
    jokes.forEach((joke) => {
      expect(typeof joke).toBe('string');
      expect(joke.trim().length).toBeGreaterThan(0);
    });
  });
});

describe('formatJokes', () => {
  test('includes the header and numbers each joke', () => {
    const output = formatJokes(jokes);
    expect(output).toContain('Here are 3 jokes for you:');
    jokes.forEach((joke, index) => {
      expect(output).toContain(`${index + 1}. ${joke}`);
    });
  });

  test('handles an empty list by returning only the header', () => {
    expect(formatJokes([])).toBe('Here are 3 jokes for you:\n');
  });
});

describe('main', () => {
  test('prints the formatted jokes to the console', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    try {
      main();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(formatJokes(jokes));
    } finally {
      spy.mockRestore();
    }
  });
});
