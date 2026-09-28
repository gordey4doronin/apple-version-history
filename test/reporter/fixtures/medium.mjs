import { describe, it } from 'node:test'

describe('suite', () => {
  it('takes a moment', async () => {
    await new Promise(resolve => setTimeout(resolve, 50))
  })
})
