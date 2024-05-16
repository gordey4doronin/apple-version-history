import { listVersions, listVersionNumbers, listVersionBuilds, flatlistVersionNumbers, flatlistVersionBuilds, listBuilds, flatlistBuilds } from './core';
export { listVersions, listVersionNumbers, listVersionBuilds, flatlistVersionNumbers, flatlistVersionBuilds, listBuilds, flatlistBuilds };

// json data
// TODO
// export { default as iosVersionHistory } from './ios-version-history';
// export { default as macosVersionHistory } from './macos-version-history';
// export { default as tvosVersionHistory } from './tvos-version-history';

// listVersions
/** * @returns {string[]} */
export function listIosVersions() { return listVersions('ios'); }
/** * @returns {string[]} */
export function listMacosVersions() { return listVersions('macos'); }
/** * @returns {string[]} */
export function listTvosVersions() { return listVersions('tvos'); }
/** * @returns {string[]} */
export function flatlistIosVersions() { return listVersions('ios'); }
/** * @returns {string[]} */
export function flatlistMacosVersions() { return listVersions('macos'); }
/** * @returns {string[]} */
export function flatlistTvosVersions() { return listVersions('tvos'); }

// listVersionNumbers
/** * @returns {string[][]} */
export function listIosVersionsNumbers() { return listVersionNumbers('ios'); }
/** * @returns {string[][]} */
export function listMacosVersionsNumbers() { return listVersionNumbers('macos'); }
/** * @returns {string[][]} */
export function listTvosVersionsNumbers() { return listVersionNumbers('tvos'); }

// flatlistVersionNumbers
/** * @returns {string[]} */
export function flatlistIosVersionsNumbers() { return flatlistVersionNumbers('ios'); }
/** * @returns {string[]} */
export function flatlistMacosVersionsNumbers() { return flatlistVersionNumbers('macos'); }
/** * @returns {string[]} */
export function flatlistTvosVersionsNumbers() { return flatlistVersionNumbers('tvos'); }

// listVersionBuilds
/** * @returns {string[][]} */
export function listIosVersionsBuilds() { return listVersionBuilds('ios'); }
/** * @returns {string[][]} */
export function listMacosVersionsBuilds() { return listVersionBuilds('macos'); }
/** * @returns {string[][]} */
export function listTvosVersionsBuilds() { return listVersionBuilds('tvos'); }

// flatlistVersionBuilds
/** * @returns {string[]} */
export function flatlistIosVersionsBuilds() { return flatlistVersionBuilds('ios'); }
/** * @returns {string[]} */
export function flatlistMacosVersionsBuilds() { return flatlistVersionBuilds('macos'); }
/** * @returns {string[]} */
export function flatlistTvosVersionsBuilds() { return flatlistVersionBuilds('tvos'); }

// listBuilds
/** * @returns {string[][]} */
export function listIosBuilds() { return listBuilds('ios'); }
/** * @returns {string[][]} */
export function listMacosBuilds() { return listBuilds('macos'); }
/** * @returns {string[][]} */
export function listTvosBuilds() { return listBuilds('tvos'); }

// flatlistBuilds
/** * @returns {string[]} */
export function flatlistIosBuilds() { return flatlistBuilds('ios'); }
/** * @returns {string[]} */
export function flatlistMacosBuilds() { return flatlistBuilds('macos'); }
/** * @returns {string[]} */
export function flatlistTvosBuilds() { return flatlistBuilds('tvos'); }
