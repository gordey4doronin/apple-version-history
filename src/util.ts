import iosVersionHistory from './ios-version-history';
import macosVersionHistory from './macos-version-history';
import tvosVersionHistory from './tvos-version-history';
import { osType, versionNames } from './types';

export function pickJson(os: osType): versionNames {
    switch (os) {
        case 'ios':
            return iosVersionHistory;

        case 'macos':
            return macosVersionHistory;

        case 'tvos':
            return tvosVersionHistory;

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
