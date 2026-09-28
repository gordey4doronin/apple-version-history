import { describe, it } from 'node:test'

describe('suite', () => {
  it('logs', () => {
    console.log('to stdout')
    console.error('to stderr')
  })
})
