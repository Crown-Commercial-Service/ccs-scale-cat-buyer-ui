import {decode} from 'jsonwebtoken'

/**
 * JWT token extractor
 * @jwtdecorder
 */
export class TokenDecoder {

    static decoder = (access_token: string) => {
        let information_decoded = decode(access_token, {complete: true});
        let user_email = information_decoded?.payload?.sub;
        return user_email;
    }
}