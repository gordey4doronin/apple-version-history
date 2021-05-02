import iosVersionHistory from './ios-version-history';
import macosVersionHistory from './macos-version-history';
import tvosVersionHistory from './tvos-version-history';
import watchosVersionHistory from './watchos-version-history';
import { osType, versionNames } from './types';

export function pickJson(os: osType): versionNames {
    switch (os) {
        case 'ios':
        case 'ipados':
            return iosVersionHistory;

        case 'macos':
            return macosVersionHistory;

        case 'tvos':
            return tvosVersionHistory;

        case 'watchos' as any:
            return watchosVersionHistory;

        default:
            throw `Unexpected os value: ${os}`;
    }
}

/**
 * Removes "1.0.x" part from "iPhone OS 1.0.x".
 */
export function versionNameWithoutSuffix(versionName: string): string {
    const split = versionName.split(' ');
    return split.slice(0, split.length - 1).join(' ');
}

/**
 * Removes ".2" part from "1.0.2".
 */
export function versionNumberWithoutPatch(versionNumber: string): string {
    return versionNumber.split('.').slice(0, 2).join('.')
}

/**
 * Checks whether the version-number has patch part or not.
 * e.g. `10.0.1` has patch, and `10.0` has not.
 */
export function hasPatch(versionNumber: string): boolean {
    return /^\d+\.\d+\.\d+$/.test(versionNumber)
}
