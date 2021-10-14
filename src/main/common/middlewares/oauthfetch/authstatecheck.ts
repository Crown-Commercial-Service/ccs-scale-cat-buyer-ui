import * as express from 'express'
import {Oauth_Instance} from '../../util/fetch/OauthService/OauthInstance'



export const TOKEN_CREDENTAILS_CHECK =  (req : express.Request, res : express.Response, next: express.NextFunction)=> {
    
    var {SESSION_ID } = req.cookies;

    if(SESSION_ID === undefined){
        res.redirect('/oauth/login');
    }else{

        let access_token = SESSION_ID;
        let AuthCheck_Instance = Oauth_Instance.TokenCheckInstance(access_token);

        let check_token_validation  = AuthCheck_Instance.post('');

        check_token_validation.then( (data): any => {
            
           let auth_status_check = data?.data;

           if(auth_status_check){
                next();

           }
           else{
               res.redirect('/oauth/login');
           }
        }).catch( err => res.redirect('/oauth/login'))

    }

  


}