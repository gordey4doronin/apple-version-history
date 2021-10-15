import { listVersions, listVersionNumbers, listVersionBuilds, flatlistVersionNumbers, flatlistVersionBuilds, listBuilds, flatlistBuilds } from './core';
export { listVersions, listVersionNumbers, listVersionBuilds, flatlistVersionNumbers, flatlistVersionBuilds, listBuilds, flatlistBuilds };

// json data
export { default as iosVersionHistory } from './ios-version-history';
export { default as macosVersionHistory } from './macos-version-history';
export { default as tvosVersionHistory } from './tvos-version-history';

// listVersions
export function listIosVersions(): string[] { return listVersions('ios'); }
export function listMacosVersions(): string[] { return listVersions('macos'); }
export function listTvosVersions(): string[] { return listVersions('tvos'); }
export function flatlistIosVersions(): string[] { return listVersions('ios'); }
export function flatlistMacosVersions(): string[] { return listVersions('macos'); }
export function flatlistTvosVersions(): string[] { return listVersions('tvos'); }

// listVersionNumbers
export function listIosVersionsNumbers(): string[][] { return listVersionNumbers('ios'); }
export function listMacosVersionsNumbers(): string[][] { return listVersionNumbers('macos'); }
export function listTvosVersionsNumbers(): string[][] { return listVersionNumbers('tvos'); }

// flatlistVersionNumbers
export function flatlistIosVersionsNumbers(): string[] { return flatlistVersionNumbers('ios'); }
export function flatlistMacosVersionsNumbers(): string[] { return flatlistVersionNumbers('macos'); }
export function flatlistTvosVersionsNumbers(): string[] { return flatlistVersionNumbers('tvos'); }

// listVersionBuilds
export function listIosVersionsBuilds(): string[][] { return listVersionBuilds('ios'); }
export function listMacosVersionsBuilds(): string[][] { return listVersionBuilds('macos'); }
export function listTvosVersionsBuilds(): string[][] { return listVersionBuilds('tvos'); }

// flatlistVersionBuilds
export function flatlistIosVersionsBuilds(): string[] { return flatlistVersionBuilds('ios'); }
export function flatlistMacosVersionsBuilds(): string[] { return flatlistVersionBuilds('macos'); }
export function flatlistTvosVersionsBuilds(): string[] { return flatlistVersionBuilds('tvos'); }

// listBuilds
export function listIosBuilds(): string[][] { return listBuilds('ios'); }
export function listMacosBuilds(): string[][] { return listBuilds('macos'); }
export function listTvosBuilds(): string[][] { return listBuilds('tvos'); }

// flatlistBuilds
export function flatlistIosBuilds(): string[] { return flatlistBuilds('ios'); }
export function flatlistMacosBuilds(): string[] { return flatlistBuilds('macos'); }
export function flatlistTvosBuilds(): string[] { return flatlistBuilds('tvos'); }
