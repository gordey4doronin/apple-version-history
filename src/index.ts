import { listVersions, listVersionNumbers, listVersionBuilds, flatlistVersionNumbers, flatlistVersionBuilds, listBuilds, flatlistBuilds } from './core';
export { listVersions, listVersionNumbers, listVersionBuilds, flatlistVersionNumbers, flatlistVersionBuilds, listBuilds, flatlistBuilds };

// json data
export { default as iosVersionHistory } from './ios-version-history';
export { default as macosVersionHistory } from './macos-version-history';
export { default as tvosVersionHistory } from './tvos-version-history';
export { default as watchosVersionHistory } from './watchos-version-history';
export { default as visionosVersionHistory } from './visionos-version-history';

// listVersions
export function listIosVersions(): string[] { return listVersions('ios'); }
export function listMacosVersions(): string[] { return listVersions('macos'); }
export function listTvosVersions(): string[] { return listVersions('tvos'); }
export function listWatchosVersions(): string[] { return listVersions('watchos'); }
export function listVisionosVersions(): string[] { return listVersions('visionos'); }
export function flatlistIosVersions(): string[] { return listVersions('ios'); }
export function flatlistMacosVersions(): string[] { return listVersions('macos'); }
export function flatlistTvosVersions(): string[] { return listVersions('tvos'); }
export function flatlistWatchosVersions(): string[] { return listVersions('watchos'); }
export function flatlistVisionosVersions(): string[] { return listVersions('visionos'); }

// listVersionNumbers
export function listIosVersionsNumbers(): string[][] { return listVersionNumbers('ios'); }
export function listMacosVersionsNumbers(): string[][] { return listVersionNumbers('macos'); }
export function listTvosVersionsNumbers(): string[][] { return listVersionNumbers('tvos'); }
export function listWatchosVersionsNumbers(): string[][] { return listVersionNumbers('watchos'); }
export function listVisionosVersionsNumbers(): string[][] { return listVersionNumbers('visionos'); }

// flatlistVersionNumbers
export function flatlistIosVersionsNumbers(): string[] { return flatlistVersionNumbers('ios'); }
export function flatlistMacosVersionsNumbers(): string[] { return flatlistVersionNumbers('macos'); }
export function flatlistTvosVersionsNumbers(): string[] { return flatlistVersionNumbers('tvos'); }
export function flatlistWatchosVersionsNumbers(): string[] { return flatlistVersionNumbers('watchos'); }
export function flatlistVisionosVersionsNumbers(): string[] { return flatlistVersionNumbers('visionos'); }

// listVersionBuilds
export function listIosVersionsBuilds(): string[][] { return listVersionBuilds('ios'); }
export function listMacosVersionsBuilds(): string[][] { return listVersionBuilds('macos'); }
export function listTvosVersionsBuilds(): string[][] { return listVersionBuilds('tvos'); }
export function listWatchosVersionsBuilds(): string[][] { return listVersionBuilds('watchos'); }
export function listVisionosVersionsBuilds(): string[][] { return listVersionBuilds('visionos'); }

// flatlistVersionBuilds
export function flatlistIosVersionsBuilds(): string[] { return flatlistVersionBuilds('ios'); }
export function flatlistMacosVersionsBuilds(): string[] { return flatlistVersionBuilds('macos'); }
export function flatlistTvosVersionsBuilds(): string[] { return flatlistVersionBuilds('tvos'); }
export function flatlistWatchosVersionsBuilds(): string[] { return flatlistVersionBuilds('watchos'); }
export function flatlistVisionosVersionsBuilds(): string[] { return flatlistVersionBuilds('visionos'); }

// listBuilds
export function listIosBuilds(): string[][] { return listBuilds('ios'); }
export function listMacosBuilds(): string[][] { return listBuilds('macos'); }
export function listTvosBuilds(): string[][] { return listBuilds('tvos'); }
export function listWatchosBuilds(): string[][] { return listBuilds('watchos'); }
export function listVisionosBuilds(): string[][] { return listBuilds('visionos'); }

// flatlistBuilds
export function flatlistIosBuilds(): string[] { return flatlistBuilds('ios'); }
export function flatlistMacosBuilds(): string[] { return flatlistBuilds('macos'); }
export function flatlistTvosBuilds(): string[] { return flatlistBuilds('tvos'); }
export function flatlistWatchosBuilds(): string[] { return flatlistBuilds('watchos'); }
export function flatlistVisionosBuilds(): string[] { return flatlistBuilds('visionos'); }
