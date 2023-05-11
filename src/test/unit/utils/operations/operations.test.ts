import { expect } from 'chai'
import { operations } from '@utils/operations/operations'

describe('operations', () => {
  describe('.equals', () => {
    describe('when both arguments are strings', () => {
      it('returns true when both are empty', () => {
        expect(operations.equals('', '')).to.eq(true)
      })

      it('returns true when both are MyString', () => {
        expect(operations.equals('MyString', 'MyString')).to.eq(true)
      })

      it('returns false when one is MyString and the other is my_string', () => {
        expect(operations.equals('MyString', 'my_string')).to.eq(false)
      })
    })

    describe('when both arguments are numbers', () => {
      it('returns true when both are 123', () => {
        expect(operations.equals(123, 123)).to.eq(true)
      })

      it('returns false when one is 123 and the other is 321', () => {
        expect(operations.equals(123, 321)).to.eq(false)
      })
    })

    describe('when both arguments are boolean', () => {
      it('returns true when both are true', () => {
        expect(operations.equals(true, true)).to.eq(true)
      })

      it('returns true when both are false', () => {
        expect(operations.equals(false, false)).to.eq(true)
      })

      it('returns false when one is true and the other is false', () => {
        expect(operations.equals(true, false)).to.eq(false)
      })
    })

    describe('when one argument is a string and the other a number', () => {
      it('returns false even if they are the same value when cast', () => {
        expect(operations.equals('123', 123)).to.eq(false)
      })
    })

    describe('when one argument is a string and the other a boolean', () => {
      it('returns false even if they are the same value when cast', () => {
        expect(operations.equals('', false)).to.eq(false)
      }) 
    })

    describe('when one argument is a number and the other a boolean', () => {
      it('returns false even if they are the same value when cast', () => {
        expect(operations.equals(0, false)).to.eq(false)
      }) 
    })
  })

  describe('.notEquals', () => {
    describe('when both arguments are strings', () => {
      it('returns false when both are empty', () => {
        expect(operations.notEquals('', '')).to.eq(false)
      })

      it('returns false when both are MyString', () => {
        expect(operations.notEquals('MyString', 'MyString')).to.eq(false)
      })

      it('returns true when one is MyString and the other is my_string', () => {
        expect(operations.notEquals('MyString', 'my_string')).to.eq(true)
      })
    })

    describe('when both arguments are numbers', () => {
      it('returns false when both are 123', () => {
        expect(operations.notEquals(123, 123)).to.eq(false)
      })

      it('returns true when one is 123 and the other is 321', () => {
        expect(operations.notEquals(123, 321)).to.eq(true)
      })
    })

    describe('when both arguments are boolean', () => {
      it('returns false when both are true', () => {
        expect(operations.notEquals(true, true)).to.eq(false)
      })

      it('returns false when both are false', () => {
        expect(operations.notEquals(false, false)).to.eq(false)
      })

      it('returns true when one is true and the other is false', () => {
        expect(operations.notEquals(true, false)).to.eq(true)
      })
    })

    describe('when one argument is a string and the other a number', () => {
      it('returns true even if they are the same value when cast', () => {
        expect(operations.notEquals('123', 123)).to.eq(true)
      })

      it('returns true even if they are a different value when cast', () => {
        expect(operations.notEquals('256', 183)).to.eq(true)
      })
    })

    describe('when one argument is a string and the other a boolean', () => {
      it('returns true even if they are the same value when cast', () => {
        expect(operations.notEquals('', false)).to.eq(true)
      })

      it('returns true even if they are a different value when cast', () => {
        expect(operations.notEquals('Hello there', false)).to.eq(true)
      })
    })

    describe('when one argument is a number and the other a boolean', () => {
      it('returns true even if they are the same value when cast', () => {
        expect(operations.notEquals(0, false)).to.eq(true)
      })

      it('returns true even if they are a different value when cast', () => {
        expect(operations.notEquals(99, false)).to.eq(true)
      })
    })
  })

  describe('.isUndefined', () => {
    const myObject: {
      rex: undefined,
      shulk: string
    } = {
      rex: undefined,
      shulk: 'hello'
    }

    it('returns true when the key is not in the object', () => {
      expect(operations.isUndefined(myObject, 'matthew')).to.eq(true)
    })

    it('returns true when the key is on the object and the value is undefined', () => {
      expect(operations.isUndefined(myObject, 'rex')).to.eq(true)
    })

    it('returns false when the key is on the object and the value is not undefined', () => {
      expect(operations.isUndefined(myObject, 'shulk')).to.eq(false)
    })
  })
})
