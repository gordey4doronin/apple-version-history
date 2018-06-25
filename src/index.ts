import { listVersions, listVersionNumbers, listVersionBuilds } from './core';
export { listVersions, listVersionNumbers, listVersionBuilds };

// json data
export { default as iosVersionHistory } from './ios-version-history';
export { default as macosVersionHistory } from './macos-version-history';
export { default as tvosVersionHistory } from './tvos-version-history';

// listVersions
export function flatlistIosVersions(): string[] { return listVersions('ios'); }
export function flatlistMacosVersions(): string[] { return listVersions('macos'); }
export function flatlistTvosVersions(): string[] { return listVersions('tvos'); }

// listVersionNumbers
export function listIosVersionsNumbers(): string[][] { return listVersionNumbers('ios'); }
export function listMacosVersionsNumbers(): string[][] { return listVersionNumbers('macos'); }
export function listTvosVersionsNumbers(): string[][] { return listVersionNumbers('tvos'); }
export function flatlistIosVersionsNumbers(): string[] { return ([] as string[]).concat(...listVersionNumbers('ios')); }
export function flatlistMacosVersionsNumbers(): string[] { return ([] as string[]).concat(...listVersionNumbers('macos')); }
export function flatlistTvosVersionsNumbers(): string[] { return ([] as string[]).concat(...listVersionNumbers('tvos')); }

// listVersionBuilds
export function listIosVersionsBuilds(): string[][] { return listVersionBuilds('ios'); }
export function listMacosVersionsBuilds(): string[][] { return listVersionBuilds('macos'); }
export function listTvosVersionsBuilds(): string[][] { return listVersionBuilds('tvos'); }
export function flatlistIosVersionsBuilds(): string[] { return ([] as string[]).concat(...listVersionBuilds('ios')); }
export function flatlistMacosVersionsBuilds(): string[] { return ([] as string[]).concat(...listVersionBuilds('macos')); }
export function flatlistTvosVersionsBuilds(): string[] { return ([] as string[]).concat(...listVersionBuilds('tvos')); }
