import { expect } from 'chai';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';
import { createDummyAuthJwt, createDummyJwt } from 'spec/support/auth';

describe('TokenDecoder', () => {
  const jwt = createDummyAuthJwt('user@email.com', 'I AM THE UID', ['buyer', 'supplier']);

  describe('getJwt', () => {
    it('returns the Jwt', () => {
      const decodedJwt = TokenDecoder.getJwt(jwt);

      expect(decodedJwt.header).to.eql({
        alg: 'HS256',
        typ: 'JWT'
      });
      expect(Object.keys(decodedJwt.payload)).to.eql([
        'sub',
        'uid',
        'roles',
        'iat',
        'exp'
      ]);
      expect(decodedJwt.signature).to.be.a('string');

    });
  });

  describe('getJwtPayload', () => {
    it('returns the Jwt payload', () => {
      const decodedJwtPayload = TokenDecoder.getJwtPayload(jwt);

      expect(decodedJwtPayload.sub).to.eq('user@email.com');
      expect(decodedJwtPayload.uid).to.eq('I AM THE UID');
      expect(decodedJwtPayload.roles).to.eql(['buyer', 'supplier']);
      expect(decodedJwtPayload.iat).to.be.a('number');
      expect(decodedJwtPayload.exp).to.be.a('number');
    });
  });

  describe('decoder', () => {
    it('returns the uid', () => {
      const uid = TokenDecoder.decoder(jwt);

      expect(uid).to.eq('I AM THE UID');
    });

    it('returns undefined when there is no uid', () => {
      const uid = TokenDecoder.decoder(createDummyJwt('RANDOM STRING'));

      expect(uid).to.be.a('undefined');
    });
  });
});
