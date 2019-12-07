import { assert } from 'chai'
import { pickJson, versionNameWithoutSuffix } from '../src/util'

describe('utils', () => {
    describe('#pickJson()', () => {
        it('returns ios object containing some keys', () => {
            assert.containsAllKeys(pickJson('ios'), ['iPhone OS 1.0.x', 'iOS 8.1.x'])
        })

        it('returns ios object containing some keys', () => {
            assert.containsAllKeys(pickJson('macos'), ['Mac OS X 10.0.x', 'OS X 10.9.x', 'macOS 10.12.x'])
        })

        it('returns ios object containing some keys', () => {
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
})
