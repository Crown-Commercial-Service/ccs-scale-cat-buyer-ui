import { Jwt, JwtPayload, decode } from 'jsonwebtoken';

/**
 * JWT token extractor
 * @jwtdecorder
 */
export class TokenDecoder {
  static getJwt = (access_token: string): Jwt => {
    return decode(access_token, { complete: true });
  };
  
  static getJwtPayload = (access_token: string): JwtPayload => {
    return this.getJwt(access_token)?.payload as JwtPayload ?? {};
  };

  static decoder = (access_token: string) => {
    return this.getJwtPayload(access_token).uid;
  };
}
