# sample

A small Node.js script that takes text input and outputs it backwards.

## Requirements

- [Node.js](https://nodejs.org/) (no external dependencies)

## Usage

Pass the text as command-line arguments:

```bash
node reverse.js hello world
# dlrow olleh
```

Or pipe text in via standard input:

```bash
echo "hello" | node reverse.js
# olleh
```

The reversal is Unicode-aware — it reverses by code point, so characters
outside the Basic Multilingual Plane (e.g. many emoji) are kept intact:

```bash
node reverse.js "a👍b"
# b👍a
```

## Testing

```bash
npm test
# or
node test/reverse.test.js
```
