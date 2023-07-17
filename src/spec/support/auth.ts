import { sign } from 'jsonwebtoken';

const createDummyAuthJwt = (email: string, uid: string, roles: string[]): string => {
  return sign({ sub: email, uid, roles }, '12345', { expiresIn: '1800s' });
};

const createDummyJwt = (sub: string): string => {
  return sign({ sub }, '12345', { expiresIn: '1800s' });
};

export { createDummyAuthJwt, createDummyJwt };
