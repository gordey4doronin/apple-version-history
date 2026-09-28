import { describe, it } from 'node:test'

describe('suite', () => {
  it('passes', () => {})
  it('fails', () => {
    throw new Error('boom')
  })
  it('fails with a multiline message', () => {
    throw new Error('first line\nsecond line')
  })
})
