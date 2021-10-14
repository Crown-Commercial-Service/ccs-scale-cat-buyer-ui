import { TOKEN_CREDENTAILS_CHECK } from '../../../main/common/middlewares/oauthfetch/authstatecheck';
import { Application } from 'express';
import {OAUTH_PATHS} from '../auth/model/oauthConstants'
import {OAUTH_CONTROLLER} from './controller/index'

export default function(app: Application): void {
  //@ GetRoutes


  


  //@GET 'oauth/login'
 app.get(OAUTH_PATHS.OAUTH_LOGIN,   OAUTH_CONTROLLER.OAUTH_LOGIN);  


 // This is the reciever callback after getting the token
 app.get(OAUTH_PATHS.OAUTH_RECEIVER_CALLBACK, OAUTH_CONTROLLER.CREDENTAILS_FETCH_RECEIVER)


 
 // This is the reciever callback after getting the token
 app.get(OAUTH_PATHS.DASHBOARD, TOKEN_CREDENTAILS_CHECK, OAUTH_CONTROLLER.DASHBOARD)


}
