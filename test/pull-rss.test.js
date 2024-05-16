// import * as fs from 'fs'
// import { assert } from 'chai'
// import * as nock from 'nock'
const fs = require('fs')
const assert = require('chai').assert
const nock = require('nock')
// import {
//   getRssItems, getRssTitles,
//   getTitles, filterTitles, parseTitles, sortRssItems,
//   applyRssChanges, writeRssChanges
// } from '../src/pull-rss.js'
const getRssItems = require('../src/pull-rss.js').getRssItems
const getRssTitles = require('../src/pull-rss.js').getRssTitles
const getTitles = require('../src/pull-rss.js').getTitles
const filterTitles = require('../src/pull-rss.js').filterTitles
const parseTitles = require('../src/pull-rss.js').parseTitles
const sortRssItems = require('../src/pull-rss.js').sortRssItems
const applyRssChanges = require('../src/pull-rss.js').applyRssChanges
const writeRssChanges = require('../src/pull-rss.js').writeRssChanges

nock.disableNetConnect()

describe('pull-rss', () => {
  const rss = fs.readFileSync('./test/fixtures/apple.rss', 'utf8')
  const rssItemsSorted = JSON.parse(fs.readFileSync('./test/fixtures/apple-rss-items-sorted.json', 'utf8'))
  const rssTitles = JSON.parse(fs.readFileSync('./test/fixtures/apple-rss-titles.json', 'utf8'))
  const titles = JSON.parse(fs.readFileSync('./test/fixtures/titles.json', 'utf8'))
  const filteredTitles = JSON.parse(fs.readFileSync('./test/fixtures/filtered-titles.json', 'utf8'))

  describe('#sortRssItems()', () => {
    // Don't mutate top level object, rather read anew
    const rssItems = JSON.parse(fs.readFileSync('./test/fixtures/apple-rss-items.json', 'utf8'))

    it('sorts RSS items', () => {
      // act
      const actual = sortRssItems(rssItems)

      // assert
      assert.deepStrictEqual(actual, rssItemsSorted)
    })
  })

  describe('#getTitles()', () => {
    it('gets titles from RSS items', () => {
      // act
      const actual = getTitles(rssItemsSorted)

      // assert
      assert.deepStrictEqual(actual, titles)
    })
  })

  describe('#filterTitles()', () => {
    it('filters titles', () => {
      // act
      const actual = filterTitles(titles)

      // assert
      assert.deepStrictEqual(actual, filteredTitles)
    })
  })

  describe('#parseTitles()', () => {
    it('parses titles', () => {
      // act
      const actual = parseTitles(filteredTitles)

      // assert
      assert.deepStrictEqual(actual, rssTitles)
    })
  })

  describe('#getRssTitles()', () => {
    it('gets RSS titles', () => {
      // act
      const actual = getRssTitles(rssItemsSorted)

      // assert
      assert.deepStrictEqual(actual, rssTitles)
    })
  })

  describe('#getRssItems()', () => {
    beforeEach(() => {
      nock('https://developer.apple.com:443')
        .get('/news/releases/rss/releases.rss')
        .reply(200, rss)
    })

    afterEach(() => {
      assert.deepStrictEqual(nock.activeMocks(), [])
      nock.cleanAll()
    })

    it('returns RSS items', async () => {
      // arrange
      const expected = JSON.parse(fs.readFileSync('./test/fixtures/apple-rss-items.json', 'utf8'))

      // act
      const actual = await getRssItems()

      // assert
      assert.deepStrictEqual(actual, expected)
    })
  })

  describe('#applyRssChanges()', () => {
    it('applies RSS changes and returns mutated objects', async () => {
      // arrange
      const iosAfter = fs.readFileSync('./test/fixtures/ios-after.json', 'utf8')
      const macosAfter = fs.readFileSync('./test/fixtures/macos-after.json', 'utf8')
      const tvosAfter = fs.readFileSync('./test/fixtures/tvos-after.json', 'utf8')
      const watchosAfter = fs.readFileSync('./test/fixtures/watchos-after.json', 'utf8')
      const visionosAfter = fs.readFileSync('./test/fixtures/visionos-after.json', 'utf8')

      // act
      const actual = await applyRssChanges(rssTitles, {
        ios: './test/fixtures/ios-before.json',
        macos: './test/fixtures/macos-before.json',
        tvos: './test/fixtures/tvos-before.json',
        watchos: './test/fixtures/watchos-before.json',
        visionos: './test/fixtures/visionos-before.json'
      })

      // assert
      assert.deepStrictEqual(actual.ios, JSON.parse(iosAfter))
      assert.deepStrictEqual(actual.macos, JSON.parse(macosAfter))
      assert.deepStrictEqual(actual.tvos, JSON.parse(tvosAfter))
      assert.deepStrictEqual(actual.watchos, JSON.parse(watchosAfter))
      assert.deepStrictEqual(actual.visionos, JSON.parse(visionosAfter))
    })
  })

  describe('#writeRssChanges()', () => {
    const iosBefore = fs.readFileSync('./test/fixtures/ios-before.json', 'utf8');
    const macosBefore = fs.readFileSync('./test/fixtures/macos-before.json', 'utf8');
    const tvosBefore = fs.readFileSync('./test/fixtures/tvos-before.json', 'utf8');
    const watchosBefore = fs.readFileSync('./test/fixtures/watchos-before.json', 'utf8');
    const visionosBefore = fs.readFileSync('./test/fixtures/visionos-before.json', 'utf8');

    after(() => {
      // Revert files after write run
      fs.writeFileSync('./test/fixtures/ios-before.json', iosBefore, 'utf8')
      fs.writeFileSync('./test/fixtures/macos-before.json', macosBefore, 'utf8')
      fs.writeFileSync('./test/fixtures/tvos-before.json', tvosBefore, 'utf8')
      fs.writeFileSync('./test/fixtures/watchos-before.json', watchosBefore, 'utf8')
      fs.writeFileSync('./test/fixtures/visionos-before.json', visionosBefore, 'utf8')
    })

    it('writes RSS changes to files', async () => {
      // arrange
      const iosAfter = fs.readFileSync('./test/fixtures/ios-after.json', 'utf8');
      const macosAfter = fs.readFileSync('./test/fixtures/macos-after.json', 'utf8');
      const tvosAfter = fs.readFileSync('./test/fixtures/tvos-after.json', 'utf8');
      const watchosAfter = fs.readFileSync('./test/fixtures/watchos-after.json', 'utf8');
      const visionosAfter = fs.readFileSync('./test/fixtures/visionos-after.json', 'utf8');

      // act
      await writeRssChanges(rssTitles, {
        ios: './test/fixtures/ios-before.json',
        macos: './test/fixtures/macos-before.json',
        tvos: './test/fixtures/tvos-before.json',
        watchos: './test/fixtures/watchos-before.json',
        visionos: './test/fixtures/visionos-before.json'
      })

      // assert
      const iosOverridden = fs.readFileSync('./test/fixtures/ios-before.json', 'utf8');
      const macosOverridden = fs.readFileSync('./test/fixtures/macos-before.json', 'utf8');
      const tvosOverridden = fs.readFileSync('./test/fixtures/tvos-before.json', 'utf8');
      const watchosOverridden = fs.readFileSync('./test/fixtures/watchos-before.json', 'utf8');
      const visionosOverridden = fs.readFileSync('./test/fixtures/visionos-before.json', 'utf8');
  
      assert.strictEqual(iosOverridden, iosAfter)
      assert.strictEqual(macosOverridden, macosAfter)
      assert.strictEqual(tvosOverridden, tvosAfter)
      assert.strictEqual(watchosOverridden, watchosAfter)
      assert.strictEqual(visionosOverridden, visionosAfter)
    })
  })
})