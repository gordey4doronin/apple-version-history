import fetch = require('node-fetch')
import xml2js = require('xml2js')
import { promisify } from 'util'
import fs = require('fs')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

import { versionNumberWithoutPatch } from './util'

/**
 * Gets items from Apple RSS feed.
 */
export async function getRssItems() {
  const response = await fetch('https://developer.apple.com/news/releases/rss/releases.rss')
  const xmlText = await response.text()
  const xmlParsed = await xml2js.parseStringPromise(xmlText)
  const items = xmlParsed.rss.channel[0].item
  return items
}

/**
 * Gets filtered and parsed titles from Apple RSS feed items.
 */
export const getRssTitles = (rssItems) => parseTitles(filterTitles(getTitles(rssItems)))

/**
 * Regex for filterting OS related titles.
 */
const filterRegex = /iOS|iPadOS|tvOS|macOS|watchOS/

/**
 * Regex for parsing OS related titles into os+version+beta+build.
 */
const parseRegex = /(iOS|iPadOS|tvOS|macOS|watchOS)\s\D*(\d+(?:\.\d+)*)( beta \d)?\s\((\w*)\)/

/**
 * Gets titles from Apple RSS feed items.
 */
export const getTitles = (rssItems) => rssItems.map(x => x.title[0])

/**
 * Filters titles from Apple RSS feed items.
 */
export const filterTitles = (titles) => titles.filter(x => x.match(filterRegex))

/**
 * Parses titles from Apple RSS feed items.
 */
export const parseTitles = (titles) => titles.map(x => x.match(parseRegex))
  .map(([_, os, version, _beta, build]) => ({ os, version, build }))

/**
 * Applies RSS changes to existing OS objects.
 */
export async function applyRssChanges(rssTitles, paths = {
  'ios': 'ios-version-history.json',
  'macos': 'macos-version-history.json',
  'tvos': 'tvos-version-history.json',
  'watchos': 'watchos-version-history.json'
}) {
  const files = await Promise.all([
    readFile(paths['ios'], 'utf8'),
    readFile(paths['macos'], 'utf8'),
    readFile(paths['tvos'], 'utf8'),
    readFile(paths['watchos'], 'utf8')
  ])

  const jsons = {
    'ios': JSON.parse(files[0]),
    'macos': JSON.parse(files[1]),
    'tvos': JSON.parse(files[2]),
    'watchos': JSON.parse(files[3])
  }

  rssTitles.forEach(({ os, version, build }) => {
    // Assume that iOS and iPadOS are the same for now.
    // TODO: Figure out later.
    if (os === 'iPadOS') {
      os = 'iOS'
    }

    const json = jsons[os.toLowerCase()]
    const versionName = `${os} ${versionNumberWithoutPatch(version)}.x`

    // versionName doesn't exist => init new object
    if (!json[versionName]) {
      json[versionName] = {}
    }

    // version itself doesn't exist => add version + build
    if (!json[versionName[version]]) {
      json[versionName][version] = [ build ]
    }
  })

  return jsons
}

/**
 * Applies RSS changes to existing OS objects, and writes them to JSON files.
 */
export async function writeRssChanges(rssTitles, paths = {
  'ios': 'ios-version-history.json',
  'macos': 'macos-version-history.json',
  'tvos': 'tvos-version-history.json',
  'watchos': 'watchos-version-history.json'
}) {
  const changes = await applyRssChanges(rssTitles, paths)

  for (const os of Object.keys(changes)) {
    const stringified = JSON.stringify(changes[os], replacer, 4)
      .replace(/\"\[/g, '[')
      .replace(/\]\"/g, ']')
      .replace(/\\"/g, '"')
      .replace(/\\"/g, '"') + '\n';

    await writeFile(paths[os], stringified, 'utf8')
  }
}

function replacer(_, value) {
  if (Array.isArray(value)) {
      return `[ ${value.map((x) => `"${x}"`).join(', ')} ]`;
  } else {
      return value;
  }
}