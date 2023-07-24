import { objectSet } from '@utils/objectSet';
import { expect } from 'chai';

describe('objectSet', () => {
  const objA = {
    id: 1,
    data: {
      hello: 'there'
    }
  };
  const objB = {
    id: 2,
    data: {
      general: 'Kenobi'
    }
  };

  it('returns all the objects when all the objects are different', () => {
    const objC = {
      id: 3,
      data: {
        these: 'are not the droids you are looking for'
      }
    };

    const result = objectSet([objA, objB, objC], 'id');

    expect(result).to.eql([objA, objB, objC]);
  });

  it('returns two objects when there are two that are the same', () => {
    const objC = {
      id: 1,
      data: {
        hello: 'there'
      }
    };

    const result = objectSet([objA, objB, objC], 'id');

    expect(result).to.eql([objA, objB]);
  });

  it('returns with the second version of an object when they share the same identifyer', () => {
    const objC = {
      id: 1,
      data: {
        these: 'are not the droids you are looking for'
      }
    };

    const result = objectSet([objA, objB, objC], 'id');

    expect(result).to.eql([objC, objB]);
  });
});
