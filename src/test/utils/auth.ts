import { sign } from 'jsonwebtoken'

export function createDummyJwt (email: string, roles: string[]): string {
    return sign({sub: email, roles}, '12345', { expiresIn: '1800s' });
}