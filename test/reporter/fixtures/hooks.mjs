import { describe, it, before, after, beforeEach, afterEach } from 'node:test'

describe('before', () => {
  before(() => { throw new Error('before broke') })
  it('never runs', () => {})
})

describe('after', () => {
  after(() => { throw new Error('after broke') })
  it('passes', () => {})
})

describe('beforeEach', () => {
  beforeEach(() => { throw new Error('beforeEach broke') })
  it('never runs', () => {})
})

describe('afterEach', () => {
  afterEach(() => { throw new Error('afterEach broke') })
  it('runs', () => {})
})
