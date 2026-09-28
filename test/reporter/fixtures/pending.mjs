import { describe, it } from 'node:test'

describe('suite', () => {
  it.skip('is skipped', () => {})
  it.todo('is todo')
  it('skips itself', (t) => t.skip())
  it('passes', () => {})
})
