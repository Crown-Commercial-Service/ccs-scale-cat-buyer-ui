//@ts-nocheck
import * as express from 'express'
import config from 'config'
/**
 * @Controller
 * @Path AuthVariable
 * @description created Auth Paramaters
 */
class Auth_Variable {

    // using local environement variables
    AuthBaseURL: string = process.env.AUTH_SERVER_BASE_URL;
    ClientID: string = process.env.AUTH_SERVER_CLIENT_ID;
    CallBackURL: string = process.env.CAT_URL + '/receiver';
}

/**
 * @Controller
 * @Path Authorization Redirect
 * @description Authorization redirecting and constucting the baseURL to conclave
 */
export class AuthorizationRedirect {

    const Auth_var = new Auth_Variable;

    Redirect_Oauth_URL = (req: express.Request) => {
        const  supplier_qa_url  =req !=undefined && req?.session !=undefined && req?.session != undefined ? req.session.supplier_qa_url : undefined;
        const redirectral_url = `${this.Auth_var.AuthBaseURL}/security/authorize?response_type=code&scope=openid%20profile%20FirstName%20LastName%20%20email%20%20offline_access&client_id=${this.Auth_var.ClientID}&redirect_uri=${this.Auth_var.CallBackURL}`;
        return supplier_qa_url == undefined ? redirectral_url : redirectral_url + '&' + supplier_qa_url?.split('?')?.[1].split('&')?.[0]?.replace("projectId=", "projectId_") + supplier_qa_url?.split('?')?.[1].split('&')?.[1].replace("eventId=", "_eid_")

        //NOTE UNCOMMENT ABOVE LINE AND CONNENT BELOW LINE
        //return redirectral_url + '?projectId_122222_eId_333333';
    }
};