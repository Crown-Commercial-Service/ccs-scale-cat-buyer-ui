import { expect } from 'chai'
import { StringBuffer } from '@utils/StringBuffer'

describe('String buffer', () => {
  describe('.isBlank', () => {
    it('returns true if the string is undefined', () => {
      expect(StringBuffer.isBlank(undefined)).to.eq(true)
    })

    it('returns true if the string is empty', () => {
      expect(StringBuffer.isBlank('')).to.eq(true)
    })

    it('returns false if the string is blank', () => {
      expect(StringBuffer.isBlank('     ')).to.eq(false)
    })

    it('returns false when there is a string', () => {
      expect(StringBuffer.isBlank('  My String   ')).to.eq(false)
    })
  })

  describe('.trimToUndefined', () => {
    it('returns undefined if the string is undefined', () => {
      expect(StringBuffer.trimToUndefined(undefined)).to.eq(undefined)
    })

    it('returns undefined if the string is empty', () => {
      expect(StringBuffer.trimToUndefined('')).to.eq(undefined)
    })

    it('returns undefined if the string is blank', () => {
      expect(StringBuffer.trimToUndefined('     ')).to.eq(undefined)
    })

    it('returns the string without any leading or trailing spaces', () => {
      expect(StringBuffer.trimToUndefined('  My String   ')).to.eq('My String')
    })
  })
})
