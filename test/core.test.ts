import { assert } from 'chai'
import { listVersions, flatlistVersionNumbers, flatlistVersionBuilds } from '../src/core'

describe('core', () => {
    describe('#listVersions()', () => {
        it('returns ios versions array', () => {
            assert.includeMembers(listVersions('ios'), ['iPhone OS 1.0.x', 'iOS 8.1.x'])
        })

        it('returns macos versions array', () => {
            assert.includeMembers(listVersions('macos'), ['Mac OS X 10.0.x', 'OS X 10.9.x', 'macOS 10.12.x'])
        })

        it('returns tvos versions array', () => {
            assert.includeMembers(listVersions('tvos'), ['tvOS 9.x'])
        })
    })

    describe('#flatlistVersionNumbers()', () => {
        it('returns ios version numbers flattened array', () => {
            assert.includeMembers(flatlistVersionNumbers('ios'), ['iPhone OS 1.0', 'iPhone OS 1.0.1', 'iOS 8.1', 'iOS 8.1.1'])
        })

        it('returns macos version numbers flattened array', () => {
            assert.includeMembers(flatlistVersionNumbers('macos'), [
                'Mac OS X 10.0', 'Mac OS X 10.0.1',
                'OS X 10.9', 'OS X 10.9.1',
                'macOS 10.12', 'macOS 10.12.1'
            ])
        })

        it('returns tvos version numbers flattened array', () => {
            assert.includeMembers(flatlistVersionNumbers('tvos'), ['tvOS 9.0', 'tvOS 9.0.1'])
        })
    })

    describe('#flatlistVersionBuilds()', () => {
        it('returns ios version builds flattened array', () => {
            assert.includeMembers(flatlistVersionBuilds('ios'), [
                'iPhone OS 1.0 (1A543a)', 'iPhone OS 1.0.1 (1C25)',
                'iOS 8.1 (12B410)', 'iOS 8.1 (12B411)', 'iOS 8.1.1 (12B435)', 'iOS 8.1.1 (12B436)'
            ])
        })

        it('returns macos version builds flattened array', () => {
            assert.includeMembers(flatlistVersionBuilds('macos'), [
                'Mac OS X 10.0 (4K78)', 'Mac OS X 10.0.1 (4L13)',
                'OS X 10.9 (13A603)', 'OS X 10.9.1 (13B42)', 'OS X 10.9.2 (13C64)', 'OS X 10.9.2 (13C1021)',
                'macOS 10.12 (16A323)', 'macOS 10.12.1 (16B2555)', 'macOS 10.12.1 (16B2657)'
            ])
        })

        it('returns tvos version builds flattened array', () => {
            assert.includeMembers(flatlistVersionBuilds('tvos'), ['tvOS 9.0 (13T396)', 'tvOS 9.0.1 (13T402)'])
        })
    })
})
