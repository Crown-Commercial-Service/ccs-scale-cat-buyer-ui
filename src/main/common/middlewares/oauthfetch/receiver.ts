import { Oauth_Instance } from '../../util/fetch/OauthService/OauthInstance';
import * as express from 'express'
import qs from 'qs';
import Cookies from 'cookies';
import * as dotenv from 'dotenv'
import { Query } from '../../util/operators/query';
const result = dotenv.config();
if (result.error) throw result.error;
const { parsed: envs } = result;

var keys = ['keyboard cat']

//@ OAUTH reciever callback
export const CREDENTAILS_FETCH_RECEIVER =  (req : express.Request, res : express.Response)=> {

  
    let {code, state} = req.query;

    if(Query.isUndefined(code) || Query.isEmpty(state)){
            res.redirect('/404')
    }
    else{
        let Oauth_check_endpoint : string = envs.TOKEN_ENDPOINT;
        //@ Create the authentication credetial to to allow the re-direct
        var auth_credentails : any =  {
            "code" : code,
            "client_id": envs.CLIENT_ID,
            "client_secret": envs.CLIENT_SECRET,
            "grant_type": envs.ACCESS_GRANTTYPE,
            "redirect_uri": envs.CALLBACK_URL,
        }
        
        auth_credentails = qs.stringify(auth_credentails)
        //@ Grant Authorization with the token to re-direct to the callback page
        let PostAuthCrendetails =   Oauth_Instance.Instance.post(Oauth_check_endpoint, auth_credentails);
    
        //@ set the cookies for SESSION_ID and state with an expiration time
        PostAuthCrendetails.then( (data)=> {


            let containedData = data?.data;
            let {access_token, expires_in} = containedData;
             let AuthCheck_Instance = Oauth_Instance.TokenCheckInstance(access_token);

             let check_token_validation = AuthCheck_Instance.post('');
             check_token_validation.then( data => {
                 
                let auth_status_check = data?.data;

                if(auth_status_check){
                    var cookies = new Cookies(req, res, { keys: keys })
    
                    // Set the cookie to a value
                    cookies.set('state', state.toString(), { maxAge: parseInt(expires_in), httpOnly: true });
                    cookies.set('SESSION_ID', access_token, { maxAge: parseInt(expires_in), httpOnly: true });
                    res.redirect('/dashboard')


                }
                else{
                    console.log('Authentication unsuccessfull');
                }
             }
             
             
             
             
             ).catch( err=> res.redirect('/404'));
            

    
        }).catch(err => res.redirect('/404') )          
    }

    

}
