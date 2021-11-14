import fetch = require('node-fetch')
import xml2js = require('xml2js')
import { promisify } from 'util'
import fs = require('fs')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

import { versionNumberWithoutPatch, addMinorZero } from './util'

const appleRssUrl = 'https://developer.apple.com/news/releases/rss/releases.rss'
const debug = require.main === module

const colors = {
  black: (string) => `\x1b[30m${string}\x1b[39m`,
  red: (string) => `\x1b[31m${string}\x1b[39m`,
  green: (string) => `\x1b[32m${string}\x1b[39m`,
  yellow: (string) => `\x1b[33m${string}\x1b[39m`,
  blue: (string) => `\x1b[34m${string}\x1b[39m`,
  magenta: (string) => `\x1b[35m${string}\x1b[39m`,
  cyan: (string) => `\x1b[36m${string}\x1b[39m`,
  white: (string) => `\x1b[37m${string}\x1b[39m`
}

// Run script only when run directly from command line
if (require.main === module) {
  const start = Date.now()
  console.log('Pulling from RSS')

  getRssItems()
    .then(rssItems => getRssTitles(rssItems))
    .then(rssTitles => writeRssChanges(rssTitles))
    .then(() => console.log(`Finished after ${(Date.now() - start) / 1000} seconds`))
    .catch(error => {
      // Sets the action status to failed.
      process.exitCode = 1
      console.error(error)
    })
}

/**
 * Gets items from Apple RSS feed.
 */
export async function getRssItems() {
  const response = await fetch(appleRssUrl)
  const xmlText = await response.text()
  const xmlParsed = await xml2js.parseStringPromise(xmlText)
  const items = xmlParsed.rss.channel[0].item
  return items
}

/**
 * Sorts RSS feed items by publishing date.
 */
export const sortRssItems = (rssItems) => rssItems.sort((a, b) => {
  const pubDateA = Date.parse(a.pubDate[0])
  const pubDateB = Date.parse(b.pubDate[0])

  if (pubDateA < pubDateB) {
    return -1
  } else if (pubDateA > pubDateB) {
    return 1
  } else {
    // In case dates are equal - compare titles.
    // This is only required for sort results back-compatibility with Node 8 and Node 10.
    // See details here https://github.com/nodejs/node/issues/24294.
    // TODO: If switching to Node 12 and above - it's possible to only compare dates.
    // E.g. rssItems.sort((a, b) => Date.parse(a.pubDate[0]) - Date.parse(b.pubDate[0]))

    const titleA = a.title[0].toUpperCase() // ignore upper and lowercase
    const titleB = b.title[0].toUpperCase() // ignore upper and lowercase

    if (titleA < titleB) {
      return 1
    } else if (titleA > titleB) {
      return -1
    } else {
      // titles must be equal
      return 0;
    }
  }
})

/**
 * Gets filtered and parsed titles from Apple RSS feed items.
 */
export const getRssTitles = (rssItems) => parseTitles(filterTitles(getTitles(sortRssItems(rssItems))))

/**
 * Regex for filterting OS related titles.
 */
const filterRegex = /iOS|iPadOS|tvOS|macOS|watchOS/

/**
 * Regex for parsing OS related titles into os+version+cycle+build.
 *
 * RC obviously stands for Release Candidate.
 * FCS not that obviously seems to mean Final Candidate Software.
 */
const parseRegex = /(?<os>iOS|iPadOS|tvOS|macOS|watchOS)\s?(?<codename>Sierra|High Sierra|Mojave|Catalina|Big Sur|Monterey)?\s(?<version>\d+(?:\.\d+)*)?\s?(?<cycle>(?:beta|RC|FCS)(\s\d+)*)?\s?\((?<build>\w*(\/| \| )?\w*)\)/

/**
 * Gets titles from Apple RSS feed items.
 */
export const getTitles = (rssItems) => rssItems.map(x => x.title[0])

/**
 * Filters titles from Apple RSS feed items.
 */
export function filterTitles (titles) {
  debug && console.log('')

  return titles.filter(title => {
    const match = title.match(filterRegex)

    if (match) {
      debug && console.log(colors.green(`+ Keep title="${title}" with match="${match}"`))
    } else {
      debug && console.log(colors.red(`- Ignore title="${title}" with match="${match}"`))
    }

    return match
  })
}

/**
 * Parses titles from Apple RSS feed items.
 */
export function parseTitles (titles) {
  debug && console.log('')

  return titles.map(title => {
    const match = title.match(parseRegex)

    if (!match) {
      throw new Error(`Could not parse title "${title}`)
    }
    debug && console.log(`Parsed title="${colors.yellow(title)}" with match="${match}"`)

    return match
  })
  .map(match => match.groups)
  .map(({ os, codename, version, cycle, build }) => ({
    os,
    version: version || null,
    codename: codename || null,
    cycle: cycle || null,
    build
  }))
}

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

  debug && console.log('')

  rssTitles.forEach(({ os, version, build, codename }) => {
    debug && console.log(`Processing ${colors.blue(os)} ${colors.magenta(version)} ${colors.cyan(build)}`)

    // Assume that iOS and iPadOS are the same for now.
    // TODO: Figure out later.
    if (os === 'iPadOS') {
      os = 'iOS'
    }

    // If there is no version, and it's Monterey beta
    // Then is should have version 12.0
    if (!version && codename === 'Monterey') {
      version = '12.0'
    }

    // Add minor zero part if it's missing
    version = addMinorZero(version)

    const json = jsons[os.toLowerCase()]
    const versionName = `${os} ${versionNumberWithoutPatch(version)}.x`

    // versionName doesn't exist => init new object
    if (!json[versionName]) {
      json[versionName] = {}
      debug && console.log(`${colors.blue(os)} versionName ${colors.magenta(versionName)} doesn't exit => init new object`)
    }

    // version doesn't exist => add version + build
    if (!json[versionName][version]) {
      if (isDualBuild(build)) {
        const [build1, build2] = splitDualBuild(build)
        json[versionName][version] = [ build1, build2 ]
        debug && console.log(`${colors.blue(os)} version ${colors.magenta(version)} doesn't exist => add version + build ${colors.magenta(version)} [ ${colors.cyan(build1)} ]`)
        debug && console.log(`${colors.blue(os)} version ${colors.magenta(version)} doesn't exist => add version + build ${colors.magenta(version)} [ ${colors.cyan(build2)} ]`)
      } else {
        json[versionName][version] = [ build ]
        debug && console.log(`${colors.blue(os)} version ${colors.magenta(version)} doesn't exist => add version + build ${colors.magenta(version)} [ ${colors.cyan(build)} ]`)
      }
    }

    if (!isDualBuild(build)) {
      // build doesn't exist => add build
      if (!json[versionName][version].includes(build)) {
        json[versionName][version].push(build)
        debug && console.log(`${colors.blue(os)} ${colors.magenta(version)} build ${colors.cyan(build)} doesn't exist => add build ${colors.cyan(build)}`)
      }
    } else if (isDualBuild(build)) {
      const [build1, build2] = splitDualBuild(build)

      // build doesn't exist => add build
      if (!json[versionName][version].includes(build1)) {
        json[versionName][version].push(build1)
        debug && console.log(`${colors.blue(os)} ${colors.magenta(version)} build ${colors.cyan(build1)} doesn't exist => add build ${colors.cyan(build1)}`)
      }

      // build doesn't exist => add build
      if (!json[versionName][version].includes(build2)) {
        json[versionName][version].push(build2)
        debug && console.log(`${colors.blue(os)} ${colors.magenta(version)} build ${colors.cyan(build2)} doesn't exist => add build ${colors.cyan(build2)}`)
      }
    }

    debug && console.log('')
  })

  return jsons
}

// Hack for iPadOS 14.7 (18G69/18G70) or iPadOS 15.1 (19B74 | 19B75) or similar dual builds
function isDualBuild(build) {
  return build.includes('/') || build.includes('|')
}

// Hack for iPadOS 14.7 (18G69/18G70) or iPadOS 15.1 (19B74 | 19B75) or similar dual builds
function splitDualBuild(build) {
 return build.split(/\/|\|/).map(x => x.trim())
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

/**
 * Custom replacer function for JSON.stringify to preserve hand-written formatting for OS JSON files.
 */
function replacer(_, value) {
  if (Array.isArray(value)) {
      return `[ ${value.map((x) => `"${x}"`).join(', ')} ]`;
  } else {
      return value;
  }
}
