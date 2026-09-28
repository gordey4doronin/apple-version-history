import assert = require('assert/strict')
import iosVersionHistory from '../src/ios-version-history'
import macosVersionHistory from '../src/macos-version-history'
import tvosVersionHistory from '../src/tvos-version-history'
import watchosVersionHistory from '../src/watchos-version-history'
import visionosVersionHistory from '../src/visionos-version-history'
import { pickJson, versionNameWithoutSuffix, hasPatch, versionNumberWithoutPatch, addMinorZero } from '../src/util'

describe('utils', () => {
    describe('#pickJson()', () => {
        it('returns ios version history', () => {
            assert.equal(pickJson('ios'), iosVersionHistory)
        })

        it('returns macos version history', () => {
            assert.equal(pickJson('macos'), macosVersionHistory)
        })

        it('returns tvos version history', () => {
            assert.equal(pickJson('tvos'), tvosVersionHistory)
        })

        it('returns watchos version history', () => {
            assert.equal(pickJson('watchos'), watchosVersionHistory)
        })

        it('returns visionos version history', () => {
            assert.equal(pickJson('visionos'), visionosVersionHistory)
        })
    })

    describe('#versionNameWithoutSuffix()', () => {
        it('parses ios version names', () => {
            assert.equal(versionNameWithoutSuffix('iPhone OS 1.0.x'), 'iPhone OS')
            assert.equal(versionNameWithoutSuffix('iOS 8.1.x'), 'iOS')
        })

        it('parses macos version names', () => {
            assert.equal(versionNameWithoutSuffix('Mac OS X 10.0.x'), 'Mac OS X')
            assert.equal(versionNameWithoutSuffix('OS X 10.9.x'), 'OS X')
            assert.equal(versionNameWithoutSuffix('macOS 10.12.x'), 'macOS')
        })

        it('parses tvos version names', () => {
            assert.equal(versionNameWithoutSuffix('tvOS 9.x'), 'tvOS')
        })
    })

    describe('#versionNumberWithoutPatch()', () => {
        it('returns version number without patch part', () => {
            assert.equal(versionNumberWithoutPatch('1.0.2'), '1.0')
            assert.equal(versionNumberWithoutPatch('100.000.200'), '100.000')
        })

        it('returns the same version number if there is patch part', () => {
            assert.equal(versionNumberWithoutPatch('1.0'), '1.0')
            assert.equal(versionNumberWithoutPatch('100.000'), '100.000')
        })
    })

    describe('#addMinorZero()', () => {
        it('returns version with minor zero part', () => {
            assert.equal(addMinorZero('1'), '1.0')
            assert.equal(addMinorZero('100'), '100.0')
        })

        it('returns the same version if there is minor part', () => {
            assert.equal(addMinorZero('1.0'), '1.0')
            assert.equal(addMinorZero('100.000'), '100.000')
        })

        it('returns the same version if there is patch part', () => {
            assert.equal(addMinorZero('1.0.2'), '1.0.2')
            assert.equal(addMinorZero('100.000.200'), '100.000.200')
        })
    })

    describe('#hasPatch()', () => {
        it('returns false when no patch part', () => {
            assert.equal(hasPatch('10.0'), false)
        })

        it('returns true when there is patch part', () => {
            assert.equal(hasPatch('10.0.1'), true)
        })
    })
})
