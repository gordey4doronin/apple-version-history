[![Node CI CD](https://github.com/gordey4doronin/apple-version-history/actions/workflows/node-ci-cd.yml/badge.svg)](https://github.com/gordey4doronin/apple-version-history/actions/workflows/node-ci-cd.yml)
[![Pull RSS on schedule](https://github.com/gordey4doronin/apple-version-history/actions/workflows/schedule-pull-rss.yml/badge.svg)](https://github.com/gordey4doronin/apple-version-history/actions/workflows/schedule-pull-rss.yml)
[![npm](https://img.shields.io/npm/v/apple-version-history)](https://www.npmjs.com/package/apple-version-history)

# apple-version-history

An automatically maintained list of Apple OS releases and their build numbers, running since 2018.

Covers iOS (back to iPhone OS 1.0), macOS (back to Mac OS X 10.0), tvOS, watchOS and visionOS.
**JSON first:** the data is plain JSON, so services in any language can use it directly.
It's also published as a dependency-free npm package for JS/TS.

## Why

### Origin: crash symbolication at App Center

I started this in 2018, while working on [Visual Studio App Center](https://appcenter.ms/), Microsoft's service for building, testing and monitoring mobile apps.
To [symbolicate](https://developer.apple.com/documentation/xcode/adding-identifiable-symbol-names-to-a-crash-report) an iOS crash log, you need the system symbols for the exact OS build the device was running.
So we had to know every build Apple shipped, and notice new ones quickly.

Apple doesn't publish this data in a machine-readable form.
Keeping the list up to date by hand was tedious, so I built something that maintains it automatically.

### Today: kept running for fun, and as a testbed

App Center has since been [retired by Microsoft](https://learn.microsoft.com/en-us/appcenter/retirement), and I've moved on, but the project keeps running.
Partly because it's fun.
Mostly because it's a small, real, always-on workload, which makes it a handy way to try new technologies and dogfood the products I work on:

- **npm.** While I was at npm, I used it to dogfood npm features, since the package is published there.
- **GitHub.** While I was at GitHub, it dogfooded GitHub features. The repo, CI and the scheduled updater all run on GitHub Actions.
- **Codesphere.** Nowadays I also use it privately on [Codesphere](https://codesphere.com),
  to test features such as the [Cloud IDE](https://docs.codesphere.com/workspace-toolkit/development/cloud-ide) and [running Landscapes](https://docs.codesphere.com/workspace-toolkit/deployment/landscape-lifecycle).

The data is accurate and updated daily, so it's still useful if you need Apple OS builds.

## Data

The `*-version-history.json` files in the repo root are the source of truth.
You can use them directly from any language, without the npm package.

| File                           | Starts at         |
| ------------------------------ | ----------------- |
| `ios-version-history.json`      | iPhone OS 1.0     |
| `macos-version-history.json`    | Mac OS X 10.0     |
| `tvos-version-history.json`     | tvOS 9.0          |
| `watchos-version-history.json`  | watchOS 7.0       |
| `visionos-version-history.json` | visionOS 1.0      |

There is also `audioos-version-history.json`, an early draft for HomePod.
I never ended up needing audioOS, so it's unmaintained and stops at audioOS 14.3.

Each file groups versions by minor line, then maps each version to its build numbers:

```json
{
    "iOS 26.6.x": {
        "26.6": [ "23G71" ],
        "26.6.1": [ "23G82", "23G83" ],
        "26.6.2": [ "23G90" ]
    }
}
```

Some details:

- A version can have several builds, for example one per device family.
- An empty array means the version is known, but its build number isn't recorded.
- Entries are in the order they were added, not sorted by version.
  When Apple ships an update to an older line after a new major release, it appears after the new major.
- Betas are skipped.
  Release candidates are kept, because the RC build is often the one that ships.
- iPadOS releases are merged into iOS.
  Apple ships them separately, but they share version numbers and almost always build numbers.

## Using the npm package

```bash
npm install apple-version-history
```

```js
const avh = require('apple-version-history');

avh.flatlistIosVersionsBuilds();
// [ 'iPhone OS 1.0.1 (1C25)', 'iPhone OS 1.0.2 (1C28)', ..., 'iOS 26.7 (23H24)' ]

avh.listMacosVersions();
// [ 'Mac OS X 10.0.x', ..., 'macOS 27.0.x' ]

avh.iosVersionHistory; // the raw JSON object
```

Every helper exists for `Ios`, `Macos`, `Tvos`, `Watchos` and `Visionos`:

| Function               | Returns                                          |
| ---------------------- | ------------------------------------------------ |
| `list*Versions`        | Minor lines: `iOS 26.6.x`                        |
| `list*VersionsNumbers` | Versions, grouped by minor line: `iOS 26.6.1`    |
| `list*VersionsBuilds`  | Versions with builds, grouped: `iOS 26.6.1 (23G82)` |
| `list*Builds`          | Build numbers only, grouped: `23G82`             |
| `flatlist*…`           | The same lists, flattened into one array         |

## How it works

```
Apple Developer releases RSS
   │  pulled at 18:00 and 21:00 UTC
   ▼
pull-rss.ts
   │  keeps OS releases, skips betas, merges new builds
   ▼
*-version-history.json
   │  if changed: npm version patch, commit, push
   ▼
CI workflow
   │  sees the version bump
   ▼
npm + GitHub Packages
```

The schedule lives in [`schedule-pull-rss.yml`](.github/workflows/schedule-pull-rss.yml),
and publishing in [`node-ci-cd.yml`](.github/workflows/node-ci-cd.yml).
The source is the [Apple Developer releases feed](https://developer.apple.com/news/releases/).

## Development

```bash
npm ci
npm run build               # generates TS modules from the JSON, compiles to dist/
npm test
node dist/src/pull-rss.js   # pulls the feed and updates the JSON files, with verbose logging
```

Running `npm publish` from the repo root is blocked on purpose.
CI publishes the package from `dist/src`.
