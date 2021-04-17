import fetch = require('node-fetch')
import xml2js = require('xml2js')
import { promisify } from 'util'
import fs = require('fs')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

import { pickJson, versionNumberWithoutPatch } from './util'
import { osType } from './types'

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
 * Gets items from Apple RSS feed, then gets titles from them.
 */
export async function getTitles() {
  const items = await getRssItems()
  const titles = items.map(x => x.title[0])
  return titles
}

/**
 * Regex for filterting OS related titles.
 */
const filterRegex = /iOS|iPadOS|tvOS|macOS|watchOS/

/**
 * Regex for parsing OS related titles into os+version+beta+build.
 */
const parseRegex = /(iOS|iPadOS|tvOS|macOS|watchOS)\s\D*(\d+(?:\.\d+)*)( beta \d)?\s\((\w*)\)/

/**
 * Gets items from Apple RSS feed, then gets titles from them, then filters them.
 */
export async function getFilteredTitles() {
  const titles = await getTitles()
  const filtered = titles.filter(x => x.match(filterRegex))
  return filtered
}

/**
 * Gets filtered titles from Apple RSS feed, then parses them.
 */
export async function parseTitles() {
  const titles = await getFilteredTitles()
  const regexs = titles.map(x => x.match(parseRegex))
  const parsed = regexs.map(([_, os, version, _beta, build]) => ({ os, version, build }))
  return parsed
}

/**
 * Gets items from Apple RSS feed and applies them to existing OS objects.
 */
export async function applyRssChanges() {
  const titles = await parseTitles()
  titles.forEach(({ os, version, build }) => {
    // Assume that iOS and iPadOS are the same for now.
    // TODO: Figure out later.
    if (os === 'iPadOS') {
      os = 'iOS'
    }

    const json = pickJson(os.toLowerCase())
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
}

export async function generateNewJsons(paths = {
  'ios': 'ios-version-history.json',
  'macos': 'macos-version-history.json',
  'tvos': 'tvos-version-history.json',
  'watchos': 'watchos-version-history.json'
}) {
  const jsons = {
    'ios': fs.readFileSync('ios-version-history.json', 'utf8'),
    'macos': fs.readFileSync('macos-version-history.json', 'utf8'),
    'tvos': fs.readFileSync('tvos-version-history.json', 'utf8'),
    'watchos': fs.readFileSync('watchos-version-history.json', 'utf8')
  }

  const titles = await parseTitles()
}

/**
 * Gets items from Apple RSS feed, applies them to existing OS objects, and writes them to JSON files.
 */
export async function writeRssChanges() {
  await applyRssChanges();
  const operatingSystems: osType[] = ['ios', 'macos', 'tvos', 'watchos'];

  operatingSystems.forEach(os => {
    const json = pickJson(os)
    const stringified = JSON.stringify(json, replacer, 4)
      .replace(/\"\[/g, '[')
      .replace(/\]\"/g, ']')
      .replace(/\\"/g, '"')
      .replace(/\\"/g, '"') + '\n';

    fs.writeFileSync(`${os}-version-history.json`, stringified, 'utf8')
  });

}

function replacer(_, value) {
  if (Array.isArray(value)) {
      return `[ ${value.map((x) => `"${x}"`).join(', ')} ]`;
  } else {
      return value;
  }
}
