import { decode } from 'jsonwebtoken'

/**
 * JWT token extractor
 * @jwtdecorder
 */
export class TokenDecoder {

    static decoder = (access_token: string) => {
        const information_decoded = decode(access_token, { complete: true });
        const uid = information_decoded?.payload?.uid;
        return uid;
    }
}