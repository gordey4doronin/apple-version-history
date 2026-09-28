# mocha-style reporter for node:test

A [custom reporter](https://nodejs.org/api/test.html#custom-reporters) for the Node.js built-in test runner that prints results like mocha's default `spec` reporter.
It has no dependencies.

## Why

I replaced mocha with `node:test` to have fewer dependencies to keep updating.
The built-in `spec` reporter of `node:test` works, but it's noisy:
every line has a timing, suites are marked with `▶`, and each suite is repeated after its tests.
I found mocha's output much easier to read, so this reporter brings it back.

If I ever don't want to maintain it, switching back to `--test-reporter=spec` is a one-word change.

## Usage

Pass the reporter to `node --test`:

```sh
node --test --test-reporter=./test/reporter/index.mjs
```

Requires Node.js 22 or later.

## Output

This is the output for three of the test fixtures, `failing.mjs`, `pending.mjs` and `slow.mjs`:

```

  suite
    ✔ passes
    1) fails
    2) fails with a multiline message

  suite
    - is skipped
    - is todo
    - skips itself
    ✔ passes

  suite
    ✔ takes a while (102ms)


  3 passing (144ms)
  3 pending
  2 failing

  1) suite
       fails:
     Error: boom
      at failing.mjs:5:3

  2) suite
       fails with a multiline message:
     Error: first line
     second line
      at failing.mjs:8:3

```

What it supports, the same way mocha does:

- **Failures** are numbered in the tree, and listed after the summary with their suite path, error and location.
- **Skipped and todo tests** (`it.skip`, `it.todo`, `t.skip()`) are shown as `- name` and counted as pending.
- **Failed hooks** are reported with their own error, e.g. `"before all" hook` or `"before each" hook for "test name"`.
  Tests cancelled because of a failed `before` hook aren't listed separately.
- **Test files that crash** while loading are listed as a failure, e.g. `test file exited with code 1, see its output above`.
  The crash itself is in the file's output, printed before the results.
- **Slow tests** show their duration: yellow above 37ms, red above 75ms, as with mocha's default `slow: 75`.
- **Colors** are used when the output is a terminal.
  `FORCE_COLOR=1` and `NO_COLOR=1` work as usual.

## Differences from mocha

- **Console output** of a test file is printed before that file's results, not next to the test that logged it.
  Node runs each test file in a separate process and reports its output first, so there's no way around it.
- **Locations** point to where the failed test is declared, not to the line that threw.
  The location is relative to the working directory when the file is inside it, and absolute otherwise.
- **Thresholds** for slow tests are fixed at mocha's defaults, there's no `--slow` option.

## How it works

`node:test` emits [events](https://nodejs.org/api/test.html#event-testpass) like `test:start`, `test:pass` and `test:fail`, and the reporter turns them into lines of output.
The only non-obvious part is suite headers:
`test:start` doesn't tell suites from tests, so a suite's name is printed right before the first result inside it.

## Tests

The tests run each file in `fixtures/` under `node --test` with the reporter, and compare the whole output.
They cover passing and failing tests, pending tests, failed hooks, crashing test files, console output, slow tests, locations, colors and exit codes.
Test durations are removed before comparing, so a slow machine doesn't make the tests fail.

```sh
node --test --test-reporter=./index.mjs '**/*.test.mjs'
```

Run it from this folder.
The fixtures aren't picked up, since they don't end with `.test.mjs`.

## Credits

Only the output format follows [mocha](https://mochajs.org/) (MIT licensed), none of its code is used.
