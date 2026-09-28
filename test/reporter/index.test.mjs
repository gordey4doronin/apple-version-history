import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'

const reporter = join(import.meta.dirname, 'index.mjs')
const fixtures = join(import.meta.dirname, 'fixtures')

/**
 * Runs a fixture under `node --test` with the reporter,
 * and returns the exit code, the raw output,
 * and the output with the total time masked and test durations removed,
 * so exact comparisons don't depend on how fast the machine is.
 */
function run(fixture, { cwd = fixtures, env = {} } = {}) {
  // NODE_TEST_CONTEXT would make the inner run report to this one instead of printing.
  // Colors are dropped, so the output doesn't depend on where the tests run.
  const { NODE_TEST_CONTEXT, FORCE_COLOR, NO_COLOR, ...inherited } = process.env
  const args = ['--test', `--test-reporter=${reporter}`, fixture]

  return new Promise(resolve => {
    execFile(process.execPath, args, { cwd, env: { ...inherited, ...env } }, (error, stdout) => {
      const output = stdout.replace(/passing \(\d+ms\)/, 'passing (Nms)').replace(/ \(\d+ms\)$/gm, '')
      resolve({ code: error?.code ?? 0, raw: stdout, output })
    })
  })
}

describe('reporter', () => {
  it('prints suites and tests like mocha', async () => {
    const { code, output } = await run('passing.mjs')

    assert.equal(code, 0)
    assert.equal(output, `
  suite
    nested
      ✔ passes
    ✔ passes too

  ✔ passes at top level

  3 passing (Nms)

`)
  })

  it('numbers failures and lists them with errors and locations', async () => {
    const { code, output } = await run('failing.mjs')

    assert.equal(code, 1)
    assert.equal(output, `
  suite
    ✔ passes
    1) fails
    2) fails with a multiline message


  1 passing (Nms)
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

`)
  })

  it('shows skipped and todo tests as pending', async () => {
    const { code, output } = await run('pending.mjs')

    assert.equal(code, 0)
    assert.equal(output, `
  suite
    - is skipped
    - is todo
    - skips itself
    ✔ passes


  1 passing (Nms)
  3 pending

`)
  })

  it('reports failed hooks with their errors', async () => {
    const { code, output } = await run('hooks.mjs')

    assert.equal(code, 1)
    assert.equal(output, `
  before
    1) "before all" hook

  after
    ✔ passes
    2) "after all" hook

  beforeEach
    3) "before each" hook for "never runs"

  afterEach
    4) "after each" hook for "runs"


  1 passing (Nms)
  4 failing

  1) before
       "before all" hook:
     Error: before broke
      at hooks.mjs:3:1

  2) after
       "after all" hook:
     Error: after broke
      at hooks.mjs:8:1

  3) beforeEach
       "before each" hook for "never runs":
     Error: beforeEach broke
      at hooks.mjs:15:3

  4) afterEach
       "after each" hook for "runs":
     Error: afterEach broke
      at hooks.mjs:20:3

`)
  })

  it('prints console output of tests', async () => {
    const { code, output } = await run('logs.mjs')

    assert.equal(code, 0)
    assert.equal(output, `to stdout
to stderr

  suite
    ✔ logs


  1 passing (Nms)

`)
  })

  it('shows the duration of slow tests', async () => {
    const { raw } = await run('slow.mjs')

    assert.match(raw, /✔ takes a while \(\d+ms\)\n/)
  })

  it('compares output regardless of how fast the machine is', async () => {
    // Stands in for a trivial test that is slowed down by a busy machine.
    const { output } = await run('medium.mjs')

    assert.equal(output, `
  suite
    ✔ takes a moment


  1 passing (Nms)

`)
  })

  it('reports test files that fail to load', async () => {
    const { code, output } = await run('broken.mjs')

    assert.equal(code, 1)
    assert.ok(output.includes('Error: file broke\n'), 'shows the crash output of the file')
    assert.ok(output.includes('\n  1) broken.mjs\n'), 'numbers the file as a failure')
    assert.ok(output.includes('\n  1) broken.mjs:\n     test file exited with code 1, see its output above\n'), 'explains the failure')
  })

  it('shows locations relative to the working directory', async () => {
    const { output } = await run('fixtures/failing.mjs', { cwd: import.meta.dirname })

    assert.match(output, / at fixtures\/failing\.mjs:5:3\n/)
  })

  it('shows absolute locations outside the working directory', async () => {
    const file = join(fixtures, 'failing.mjs')
    const { output } = await run(file, { cwd: tmpdir() })

    assert.ok(output.includes(` at ${file}:5:3\n`))
  })

  it('prints colors when they are forced', async () => {
    const { output } = await run('passing.mjs', { env: { FORCE_COLOR: '1' } })

    assert.ok(output.includes('\x1b[32m✔\x1b[39m \x1b[90mpasses\x1b[39m'))
  })
})
