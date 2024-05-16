// import iosVersionHistory from './ios-version-history.js';
// import macosVersionHistory from './macos-version-history.js';
// import tvosVersionHistory from './tvos-version-history.js';
// import watchosVersionHistory from './watchos-version-history.js';
const iosVersionHistory = require('./ios-version-history.js');
const macosVersionHistory = require('./macos-version-history.js');
const tvosVersionHistory = require('./tvos-version-history.js');
const watchosVersionHistory = require('./watchos-version-history.js');
// import { osType, versionNames } from './types';

/**
 * @typedef {import('./types').osType} osType
 * @typedef {import('./types').versionNames} versionNames
 */

/**
 * @param {osType} os
 TODO returns {versionNames}
 */
function pickJson(os) {
  switch (os) {
    case 'ios':
      return iosVersionHistory;

    case 'macos':
      return macosVersionHistory;

    case 'tvos':
      return tvosVersionHistory;

    case 'watchos':
      return watchosVersionHistory;

    default:
      throw `Unexpected os value: ${os}`;
  }
}

/**
 * Removes "1.0.x" part from "iPhone OS 1.0.x".
 *
 * @param {string} versionName
 * @returns {string}
 */
function versionNameWithoutSuffix(versionName) {
  const split = versionName.split(' ');
  return split.slice(0, split.length - 1).join(' ');
}

/**
 * Removes ".2" part from "1.0.2".
 *
 * @param {string} versionNumber
 * @returns {string}
 */
function versionNumberWithoutPatch(versionNumber) {
  return versionNumber.split('.').slice(0, 2).join('.')
}

/**
 * Adds minor ".0" part if it's missing.
 * e.g. `15` becomes `15.0`.
 *
 * @param {string} version
 * @returns {string}
 */
function addMinorZero(version) {
  return version.includes('.') ? version : `${version}.0`
}

/**
 * Checks whether the version-number has patch part or not.
 * e.g. `10.0.1` has patch, and `10.0` has not.
 *
 * @param {string} versionNumber
 * @returns {boolean}
 */
function hasPatch(versionNumber) {
  return /^\d+\.\d+\.\d+$/.test(versionNumber)
}

module.exports = {
  pickJson,
  versionNameWithoutSuffix,
  versionNumberWithoutPatch,
  addMinorZero,
  hasPatch
}