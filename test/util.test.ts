import { assert } from 'chai'
import { pickJson, versionNameWithoutSuffix, hasPatch, versionNumberWithoutPatch, addMinorZero } from '../src/util'

describe('utils', () => {
    describe('#pickJson()', () => {
        it('returns ios object containing some keys', () => {
            assert.containsAllKeys(pickJson('ios'), ['iPhone OS 1.0.x', 'iOS 8.1.x'])
        })

        it('returns macos object containing some keys', () => {
            assert.containsAllKeys(pickJson('macos'), ['Mac OS X 10.0.x', 'OS X 10.9.x', 'macOS 10.12.x'])
        })

        it('returns tvos object containing some keys', () => {
            assert.containsAllKeys(pickJson('tvos'), ['tvOS 9.x'])
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
            assert.isFalse(hasPatch('10.0'))
        })

        it('returns true when there is patch part', () => {
            assert.isTrue(hasPatch('10.0.1'))
        })
    })
})
