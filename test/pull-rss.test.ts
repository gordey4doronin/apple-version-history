import fs = require('fs')
import { assert } from 'chai'
import nock = require('nock')
import { getRssItems, getTitles, getFilteredTitles, parseTitles, modify } from '../src/pull-rss'

nock.disableNetConnect()

describe('temp', () => {
  const rss = fs.readFileSync('./test/fixtures/apple.rss', 'utf8')

  beforeEach(() => {
    nock('https://developer.apple.com:443')
      .get('/news/releases/rss/releases.rss')
      .reply(200, rss)
  })

  afterEach(() => {
    assert.deepStrictEqual(nock.activeMocks(), [])
    nock.cleanAll()
  })

  it('#getRssItems()', async () => {
    // arrange
    const osItem = {
      title: ['tvOS 14.4 (18K802)'],
      link: ['https://developer.apple.com/news/releases/?id=01262021a'],
      guid: ['https://developer.apple.com/news/releases/?id=01262021a'],
      description: ['tvOS 14.4 (18K802)'],
      pubDate: ['Tue, 26 Jan 2021 09:00:00 PST'],
      'content:encoded': ['tvOS 14.4 (18K802)']
    }

    const otherItem = {
      title: ['Apple Configurator 2.14 beta (6A9)'],
      link: ['https://developer.apple.com/news/releases/?id=02162021a'],
      guid: ['https://developer.apple.com/news/releases/?id=02162021a'],
      description: ['Apple Configurator 2.14 beta (6A9)'],
      pubDate: ['Wed, 17 Feb 2021 10:00:00 PST'],
      'content:encoded': ['Apple Configurator 2.14 beta (6A9)']
    }

    // act
    const result = await getRssItems()

    // assert
    assert.isArray(result)
    assert.deepInclude(result, osItem, 'Should include at least one OS item')
    assert.deepInclude(result, otherItem, 'Should include at least one other item')
  })

  it('#getTitles', async () => {
    // act
    const result = await getTitles()

    // assert
    assert.deepStrictEqual(result, [
      'Transporter 1.2.1',
      'macOS Big Sur 11.3 beta 8 (20E5231a)',
      'iOS 14.5 beta 8 (18E5199a)',
      'iPadOS 14.5 beta 8 (18E5199a)',
      'watchOS 7.4 beta 7 (18T5194a)',
      'tvOS 14.5 beta 7 (18L5203a)',
      'iOS 14.4.2 (18D70)',
      'iPadOS 14.4.2 (18D70)',
      'iOS 12.5.2 (16H30)',
      'watchOS 7.3.3 (18S830)',
      'App Store Connect Update',
      'macOS Big Sur 11.2.3 (20D91)',
      'TestFlight Update',
      'Xcode 12.5 beta 3 (12E5244e)',
      'Apple Configurator 2.14 beta (6A9)',
      'TestFlight Update',
      'App Store Connect 1.5.1',
      'Xcode 12.4 (12D4e)',
      'tvOS 14.4 (18K802)'
    ])
  })

  it('#getFilteredTitles', async () => {
    // act
    const result = await getFilteredTitles()

    // assert
    assert.deepStrictEqual(result, [
      'macOS Big Sur 11.3 beta 8 (20E5231a)',
      'iOS 14.5 beta 8 (18E5199a)',
      'iPadOS 14.5 beta 8 (18E5199a)',
      'watchOS 7.4 beta 7 (18T5194a)',
      'tvOS 14.5 beta 7 (18L5203a)',
      'iOS 14.4.2 (18D70)',
      'iPadOS 14.4.2 (18D70)',
      'iOS 12.5.2 (16H30)',
      'watchOS 7.3.3 (18S830)',
      'macOS Big Sur 11.2.3 (20D91)',
      'tvOS 14.4 (18K802)'
    ])
  })

  it('#parseTitles()', async () => {
    // act
    const result = await parseTitles()

    // arrange
    assert.deepStrictEqual(result, [
      { os: 'macOS', version: '11.3', build: '20E5231a' },
      { os: 'iOS', version: '14.5', build: '18E5199a' },
      { os: 'iPadOS', version: '14.5', build: '18E5199a' },
      { os: 'watchOS', version: '7.4', build: '18T5194a' },
      { os: 'tvOS', version: '14.5', build: '18L5203a' },
      { os: 'iOS', version: '14.4.2', build: '18D70' },
      { os: 'iPadOS', version: '14.4.2', build: '18D70' },
      { os: 'iOS', version: '12.5.2', build: '16H30' },
      { os: 'watchOS', version: '7.3.3', build: '18S830' },
      { os: 'macOS', version: '11.2.3', build: '20D91' },
      { os: 'tvOS', version: '14.4', build: '18K802' }
    ])
  })

  it('#modify()', async () => {
    // act
    const result = await modify()
  })
})