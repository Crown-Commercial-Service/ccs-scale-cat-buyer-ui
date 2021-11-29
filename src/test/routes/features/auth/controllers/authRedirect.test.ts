import { AuthorizationRedirect } from "main/features/auth/controller/authRedirect";
import { expect } from 'chai';

describe('Auth redirect', () => {
    const authRedirect = new AuthorizationRedirect();
    context('on REDIRECT', () => {
        it('should check some properties of redirect', () => {
            expect(authRedirect).to.be.instanceOf(AuthorizationRedirect);
            expect(authRedirect).to.have.property('Auth_var');
            expect(authRedirect.Redirect_Oauth_URL).to.be.a('function');
            expect(authRedirect.Auth_var).to.have.property('AuthBaseURL').to.be.a('string');
            expect(authRedirect.Auth_var).to.have.property('ClientID').to.be.a('string');
            expect(authRedirect.Auth_var).to.have.property('CallBackURL').to.be.a('string');
        })
    })
})