// import { osType } from './types';
// import { pickJson, versionNameWithoutSuffix } from './util.js';
const pickJson = require('./util').pickJson
const versionNameWithoutSuffix = require('./util').versionNameWithoutSuffix

/**
 * @typedef {import('./types').osType} osType
 */

const defaultSeparator = ' ';

/**
 * @param {osType} os
 * @returns {string[]}
 */
function listVersions(os) {
  const json = pickJson(os);
  return Object.keys(json);
}

/**
 * @param {osType} os
 * @param {string} separator
 * @returns {string[]}
 */
function flatlistVersionNumbers(os, separator = defaultSeparator) {
  return listVersionNumbers(os, separator).flat();
}

/**
 *
 * @param {osType} os
 * @param {string} separator
 * @returns {string[][]}
 */
function listVersionNumbers(os, separator = defaultSeparator) {
  const json = pickJson(os);

  const numbersByVersionName = Object.keys(json).map(versionNameKey => {
    const versionName = versionNameWithoutSuffix(versionNameKey);

    return Object.keys(json[versionNameKey])
      .map(versionNumberKey => [versionName, versionNumberKey].join(separator));
  });

  return numbersByVersionName;
}

/**
 *
 * @param {osType} os
 * @param {string} separator
 * @returns {string[]}
 */
function flatlistVersionBuilds(os, separator = defaultSeparator) {
  return listVersionBuilds(os, separator).flat();
}

/**
 *
 * @param {osType} os
 * @param {string} separator
 * @returns {string[][]}
 */
function listVersionBuilds(os, separator = defaultSeparator) {
  const json = pickJson(os);

  const buildsByVersionName = Object.keys(json).map(versionNameKey => {
    const versionName = versionNameWithoutSuffix(versionNameKey);

    const buildsByVersionNumber = Object.keys(json[versionNameKey])
      .map(versionNumberKey => {
        return json[versionNameKey][versionNumberKey]
          .map(versionBuild => [versionName, versionNumberKey, `(${versionBuild})`].join(separator));
      });

    return buildsByVersionNumber.flat();
  });

  return buildsByVersionName;
}

/**
 *
 * @param {osType} os
 * @returns {string[][]}
 */
function listBuilds(os) {
  const json = pickJson(os);

  return Object.keys(json)
    .map(versionName => Object.keys(json[versionName])
      .flatMap(versionNumber => json[versionName][versionNumber])
    );
}

/**
 *
 * @param {osType} os
 * @returns {string[]}
 */
function flatlistBuilds(os) {
  return listBuilds(os).flat();
}

module.exports = {
  listVersions,
  flatlistVersionNumbers,
  listVersionNumbers,
  flatlistVersionBuilds,
  listVersionBuilds,
  listBuilds,
  flatlistBuilds
}
