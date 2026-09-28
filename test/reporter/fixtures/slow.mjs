import { describe, it } from 'node:test'

describe('suite', () => {
  it('takes a while', async () => {
    await new Promise(resolve => setTimeout(resolve, 100))
  })
})
