const fetch = require('node-fetch')
const xml2js = require('xml2js')

// import iosVersionHistory from '../ios-version-history.json'
// import macosVersionHistory from '../macos-version-history.json'
// import tvosVersionHistory from '../tvos-version-history.json'

import { pickJson, versionNumberWithoutPatch } from './util'
import { listVersions } from './core'

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

const filterRegex = /iOS|iPadOS|tvOS|macOS|watchOS/
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

export async function modify() {
  const titles = await parseTitles()
  titles.forEach(({ os, version, build }) => {
    if (os === 'iOS') {
      const json = pickJson(os.toLowerCase())
      const versions = listVersions(os.toLowerCase())
      const versionWithX = versionNumberWithoutPatch(version) + '.x'
      const versionName = `${os} ${versionWithX}`
      const versionNameExists = !!json[versionName]
      console.log(`versionNameExists=${versionNameExists} ${versionWithX} /// ${os} ${version} ${build}`)

      if (versionNameExists) {
        const versionNumberExists = !!json[versionName][version]
        console.log(`versionNumberExists=${versionNumberExists} ${version} /// ${os} ${version} ${build}`)

        if (versionNumberExists) {
          console.log('Do nothing')
          // return
        } else {
          console.log('Add version number')
          json[versionName][version] = [ build ]
        }
      } else {
        console.log('Add version name')
        json[versionName] = {}
        json[versionName][version] = [ build ]
      }

      console.log('Versions')
      console.log(versions)
    }
  })
}