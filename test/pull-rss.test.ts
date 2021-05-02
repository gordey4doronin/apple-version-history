import fs = require('fs')
import { assert } from 'chai'
import nock = require('nock')
import {
  getRssItems, getRssTitles,
  getTitles, filterTitles, parseTitles,
  applyRssChanges, writeRssChanges
} from '../src/pull-rss'

nock.disableNetConnect()

describe('pull-rss', () => {
  const rss = fs.readFileSync('./test/fixtures/apple.rss', 'utf8')
  const rssItems = JSON.parse(fs.readFileSync('./test/fixtures/apple-rss-items.json', 'utf8'))
  const rssTitles = JSON.parse(fs.readFileSync('./test/fixtures/apple-rss-titles.json', 'utf8'))
  const titles = JSON.parse(fs.readFileSync('./test/fixtures/titles.json', 'utf8'))
  const filteredTitles = JSON.parse(fs.readFileSync('./test/fixtures/filtered-titles.json', 'utf8'))

  describe('#getTitles()', () => {
    it('gets titles from RSS items', () => {
      // act
      const actual = getTitles(rssItems)

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
      const actual = getRssTitles(rssItems)

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

      // act
      const actual = await applyRssChanges(rssTitles, {
        ios: './test/fixtures/ios-before.json',
        macos: './test/fixtures/macos-before.json',
        tvos: './test/fixtures/tvos-before.json',
        watchos: './test/fixtures/watchos-before.json'
      })

      // assert
      assert.deepStrictEqual(actual.ios, JSON.parse(iosAfter))
      assert.deepStrictEqual(actual.macos, JSON.parse(macosAfter))
      assert.deepStrictEqual(actual.tvos, JSON.parse(tvosAfter))
      assert.deepStrictEqual(actual.watchos, JSON.parse(watchosAfter))
    })
  })

  describe('#writeRssChanges()', () => {
    xit('writes RSS changes to files', async () => {
      // arrange
      // const iosBefore = fs.readFileSync('./test/fixtures/ios-before.json', 'utf8');
      // const iosAfter = fs.readFileSync('./test/fixtures/ios-after.json', 'utf8');
      // const macosBefore = fs.readFileSync('./test/fixtures/macos-before.json', 'utf8');
      // const macosAfter = fs.readFileSync('./test/fixtures/macos-after.json', 'utf8');
      // const tvosBefore = fs.readFileSync('./test/fixtures/tvos-before.json', 'utf8');
      // const tvosAfter = fs.readFileSync('./test/fixtures/tvos-after.json', 'utf8');
      // const watchosBefore = fs.readFileSync('./test/fixtures/watchos-before.json', 'utf8');
      // const watchosAfter = fs.readFileSync('./test/fixtures/watchos-after.json', 'utf8');

      // act
      await writeRssChanges(rssTitles)

      // assert
      // assert.strictEqual(iosBefore, iosAfter)
      // assert.strictEqual(macosBefore, macosAfter)
      // assert.strictEqual(tvosBefore, tvosAfter)
      // assert.strictEqual(watchosBefore, watchosAfter)
    })
  })
})