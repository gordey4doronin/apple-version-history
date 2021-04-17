import fs = require('fs')
import { assert } from 'chai'
import nock = require('nock')
import { getRssItems, getTitles, getFilteredTitles, parseTitles, applyRssChanges, writeRssChanges } from '../src/pull-rss'
import util = require('../src/util')
import { osType, versionNames } from '../src/types'

nock.disableNetConnect()

describe('pull-rss', () => {
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
    const expected = JSON.parse(fs.readFileSync('./test/fixtures/apple-rss-items.json', 'utf8'))

    // act
    const actual = await getRssItems()

    // assert
    assert.deepStrictEqual(actual, expected)
  })

  it('#getTitles', async () => {
    // act
    const actual = await getTitles()

    // assert
    assert.deepStrictEqual(actual, [
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
    const actual = await getFilteredTitles()

    // assert
    assert.deepStrictEqual(actual, [
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
    const actual = await parseTitles()

    // arrange
    assert.deepStrictEqual(actual, [
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

  context('mutating OS objects/fixtures', () => {
    const iosBefore = fs.readFileSync('./test/fixtures/ios-before.json', 'utf8');
    const ios = JSON.parse(iosBefore);
    const iosAfter = fs.readFileSync('./test/fixtures/ios-after.json', 'utf8');

    const macosBefore = fs.readFileSync('./test/fixtures/macos-before.json', 'utf8');
    const macos = JSON.parse(macosBefore)
    const macosAfter = fs.readFileSync('./test/fixtures/macos-after.json', 'utf8');

    const tvosBefore = fs.readFileSync('./test/fixtures/tvos-before.json', 'utf8');
    const tvos = JSON.parse(tvosBefore)
    const tvosAfter = fs.readFileSync('./test/fixtures/tvos-after.json', 'utf8');

    const watchosBefore = {};
    const watchos = {};
    const watchosAfter = fs.readFileSync('./test/fixtures/watchos-after.json', 'utf8');

    const pickJson = util.pickJson
    const pickJsonFixture = (os: osType): versionNames => {
      switch (os) {
        case 'ios':
        case 'ipados':
          return ios;

        case 'macos':
          return macos;

        case 'tvos':
          return tvos;

        case 'watchos' as any:
          // TODO Support watchOS
          console.warn('TODO Support watchOS');
          return watchos;

        default:
          throw `Unexpected os value: ${os}`;
      }
    }

    before(() => {
      util.pickJson = pickJsonFixture
    })

    after(() => {
      util.pickJson = pickJson
    })

    it('#applyRssChanges()', async () => {
      // act
      await applyRssChanges()

      // assert
      assert.deepStrictEqual(ios, JSON.parse(iosAfter))
      assert.deepStrictEqual(macos, JSON.parse(macosAfter))
      assert.deepStrictEqual(tvos, JSON.parse(tvosAfter))
      assert.deepStrictEqual(watchos, JSON.parse(watchosAfter))
    })

    xit('#writeRssChanges()', async () => {
      // act
      await writeRssChanges()

      // assert
      assert.strictEqual(iosBefore, iosAfter)
      assert.strictEqual(macosBefore, macosAfter)
      assert.strictEqual(tvosBefore, tvosAfter)
      assert.strictEqual(watchosBefore, watchosAfter)
    })
  })
})