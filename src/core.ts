import { osType } from './types';
import { pickJson, versionNameWithoutSuffix } from './util';

const defaultSeparator = ' ';

export function listVersions(os: osType): string[] {
    const json = pickJson(os);
    return Object.keys(json);
}

export function flatlistVersionNumbers(os: osType, separator: string = defaultSeparator): string[] {
    return ([] as string[]).concat(...listVersionNumbers(os, separator));
}

export function listVersionNumbers(os: osType, separator: string = defaultSeparator): string[][] {
    const json = pickJson(os);

    const numbersByVersionName = Object.keys(json).map(versionNameKey => {
        const versionName = versionNameWithoutSuffix(versionNameKey);

        return Object.keys(json[versionNameKey])
            .map(versionNumberKey => [versionName, versionNumberKey].join(separator));
    });

    return numbersByVersionName;
}

export function flatlistVersionBuilds(os: osType, separator: string = defaultSeparator): string[] {
    return ([] as string[]).concat(...listVersionBuilds(os, separator));
}

export function listVersionBuilds(os: osType, separator: string = defaultSeparator): string[][] {
    const json = pickJson(os);

    const buildsByVersionName = Object.keys(json).map(versionNameKey => {
        const versionName = versionNameWithoutSuffix(versionNameKey);

        const buildsByVersionNumber = Object.keys(json[versionNameKey])
            .map(versionNumberKey => {
                return json[versionNameKey][versionNumberKey]
                    .map(versionBuild => [versionName, versionNumberKey, `(${versionBuild})`].join(separator));
            });

        return ([] as string[]).concat(...buildsByVersionNumber);
    });

    return buildsByVersionName;
}

export function listBuilds(os: osType): string[][] {
    const json = pickJson(os);

    return Object.keys(json)
        .map(versionName => Object.keys(json[versionName])
            .flatMap(versionNumber => json[versionName][versionNumber])
        );
}

export function flatlistBuilds(os: osType): string[] {
    return ([] as string[]).concat(...listBuilds(os));
}
