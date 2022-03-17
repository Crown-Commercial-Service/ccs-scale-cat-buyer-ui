import { decode } from 'jsonwebtoken'

/**
 * JWT token extractor
 * @jwtdecorder
 */
export class TokenDecoder {

    static decoder = (access_token: string) => {
        const information_decoded = decode(access_token, { json: true });
        const uid = information_decoded?.uid;
        return uid;
    }
}