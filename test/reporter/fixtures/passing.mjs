import { describe, it } from 'node:test'

describe('suite', () => {
  describe('nested', () => {
    it('passes', () => {})
  })

  it('passes too', () => {})
})

it('passes at top level', () => {})
