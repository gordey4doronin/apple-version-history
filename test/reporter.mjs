import { relative } from 'node:path'
import { styleText } from 'node:util'

/**
 * Prints test results in the style of mocha's default reporter,
 * because the built-in `spec` reporter of `node:test` is too noisy.
 * To stop maintaining this file, switch back to `--test-reporter=spec`.
 */
export default async function* reporter(source) {
  const names = []
  let printed = 0
  const failures = []

  for await (const { type, data } of source) {
    if (type === 'test:start') {
      names[data.nesting] = data.name
      printed = Math.min(printed, data.nesting)
    }

    if ((type === 'test:pass' || type === 'test:fail') && data.details.type !== 'suite') {
      // `test:start` doesn't tell suites from tests,
      // so suite headers wait for the first test result inside them.
      for (; printed < data.nesting; printed++) {
        yield `${printed === 0 ? '\n' : ''}${'  '.repeat(printed + 1)}${names[printed]}\n`
      }

      const indent = '  '.repeat(data.nesting + 1)

      if (type === 'test:pass') {
        yield `${indent}${styleText('green', '✔')} ${styleText('gray', data.name)}\n`
      } else {
        failures.push({ ...data, suites: names.slice(0, data.nesting) })
        yield `${indent}${styleText('red', `${failures.length}) ${data.name}`)}\n`
      }
    }

    if (type === 'test:summary' && data.file === undefined) {
      yield `\n\n  ${styleText('green', `${data.counts.passed} passing`)} ${styleText('gray', `(${Math.round(data.duration_ms)}ms)`)}\n`

      if (failures.length) {
        yield `  ${styleText('red', `${failures.length} failing`)}\n`
      }

      for (const [i, { name, suites, file, line, column, details }] of failures.entries()) {
        const title = [...suites, `${name}:`].join('\n     ')
        const location = `${relative(process.cwd(), file)}:${line}:${column}`
        const error = String(details.error.cause ?? details.error).replace(/\n(?=.)/g, '\n     ')

        yield `\n  ${i + 1}) ${title}\n     ${styleText('gray', `at ${location}`)}\n\n     ${styleText('red', error)}\n`
      }
    }
  }
}
