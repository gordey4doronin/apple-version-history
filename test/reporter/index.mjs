import { relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { styleText } from 'node:util'

/**
 * Prints test results like mocha's default `spec` reporter,
 * because the built-in `spec` reporter of `node:test` is too noisy.
 * To stop maintaining this file, switch back to `--test-reporter=spec`.
 *
 * Only the output format follows mocha (MIT licensed),
 * none of its code is used.
 */
export default async function* reporter(source) {
  const names = []
  let printed = 0
  let passing = 0
  let pending = 0
  let started = false
  const failures = []

  // `test:start` doesn't tell suites from tests,
  // so suite headers wait for the first result inside them.
  function* headers(nesting) {
    for (; printed < nesting; printed++) {
      yield `${indent(printed)}${names[printed]}\n`
    }
  }

  for await (const { type, data } of source) {
    // Node reports a file's output before its results,
    // so logs can't be printed next to the test that wrote them.
    if (type === 'test:stdout' || type === 'test:stderr') {
      yield data.message
    }

    if (type === 'test:start') {
      names[data.nesting] = data.name
      printed = Math.min(printed, data.nesting)

      if (!started) {
        started = true
        yield '\n'
      }
    }

    if (type === 'test:pass' && data.details.type !== 'suite') {
      yield* headers(data.nesting)

      if (data.skip || data.todo) {
        pending++
        yield `${indent(data.nesting)}${styleText('cyan', `- ${data.name}`)}\n`
      } else {
        passing++
        yield `${indent(data.nesting)}${styleText('green', '✔')} ${styleText('gray', data.name)}${speed(data.details.duration_ms)}\n`
      }
    }

    if (type === 'test:fail') {
      const { error } = data.details
      const isSuite = data.details.type === 'suite'

      // Both are side effects of another failure,
      // which is reported on its own.
      const reported = error.failureType === 'cancelledByParent' || error.failureType === 'subtestsFailed'

      if (!reported) {
        const hook = error.failureType === 'hookFailed' ? hookTitle(error) : undefined
        const title = hook && !isSuite ? `${hook} for "${data.name}"` : hook ?? data.name

        // A failed `before` or `after` hook is listed inside its suite, like a test.
        const nesting = hook && isSuite ? data.nesting + 1 : data.nesting

        yield* headers(nesting)

        failures.push({ ...data, title, suites: names.slice(0, nesting) })
        yield `${indent(nesting)}${styleText('red', `${failures.length}) ${title}`)}\n`
      }
    }

    // Like mocha, a blank line follows each printed top-level suite.
    if ((type === 'test:pass' || type === 'test:fail') && data.details.type === 'suite' && data.nesting === 0 && printed > 0) {
      printed = 0
      yield '\n'
    }

    if (type === 'test:summary' && data.file === undefined) {
      yield `\n  ${styleText('green', `${passing} passing`)} ${styleText('gray', `(${duration(data.duration_ms)})`)}\n`

      if (pending) {
        yield `  ${styleText('cyan', `${pending} pending`)}\n`
      }

      if (failures.length) {
        yield `  ${styleText('red', `${failures.length} failing`)}\n`
      }

      for (const [i, failure] of failures.entries()) {
        const title = [...failure.suites, failure.title].map((x, level) => '  '.repeat(level) + x).join('\n     ')
        const error = message(failure.details.error).replace(/\n(?=.)/g, '\n     ')

        yield `\n  ${i + 1}) ${title}:\n     ${styleText('red', error)}\n${styleText('gray', `      at ${location(failure)}`)}\n`
      }

      yield '\n'
    }
  }
}

function indent(nesting) {
  return '  '.repeat(nesting + 1)
}

/**
 * Shows the duration of slow tests, with mocha's default threshold of 75ms:
 * yellow above half of it, and red above all of it.
 */
function speed(ms) {
  if (ms > 75) {
    return styleText('red', ` (${Math.round(ms)}ms)`)
  }

  if (ms > 75 / 2) {
    return styleText('yellow', ` (${Math.round(ms)}ms)`)
  }

  return ''
}

function duration(ms) {
  return ms < 1000 ? `${Math.round(ms)}ms` : `${Math.round(ms / 1000)}s`
}

/**
 * Describes why a test failed.
 * A test file that exits before reporting its tests has no error of its own,
 * but its output, printed above, shows what went wrong.
 */
function message(error) {
  if (error.signal) {
    return `test file was killed with ${error.signal}, see its output above`
  }

  if (error.exitCode !== undefined) {
    return `test file exited with code ${error.exitCode}, see its output above`
  }

  return String(error.cause ?? error)
}

/**
 * Names a failed hook the way mocha does, e.g. `"before each" hook`.
 * Node only mentions the hook in the error message, e.g. "failed running beforeEach hook".
 */
function hookTitle(error) {
  const hook = error.message.match(/running (\w+) hook/)?.[1]

  const titles = {
    before: '"before all" hook',
    after: '"after all" hook',
    beforeEach: '"before each" hook',
    afterEach: '"after each" hook'
  }

  return titles[hook] ?? 'hook'
}

/**
 * Formats where the failure happened,
 * relative to the working directory when it is inside it.
 */
function location({ file, line, column }) {
  const path = file.startsWith('file:') ? fileURLToPath(file) : file
  const inside = relative(process.cwd(), path)
  return `${inside.startsWith('..') ? path : inside}:${line}:${column}`
}
