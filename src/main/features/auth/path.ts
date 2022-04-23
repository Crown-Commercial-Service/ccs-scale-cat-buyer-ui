import { CREDENTAILS_FETCH_RECEIVER } from '../../common/middlewares/oauthservice/receiver';
import { Application } from 'express';
import {OAUTH_PATHS} from '../auth/model/oauthConstants'
import {OAUTH_CONTROLLER} from './controller/index'

export default function(app: Application): void {
  //@ GetRoutes


  


  //@GET 'oauth/login'
 app.get(OAUTH_PATHS.OAUTH_LOGIN,   OAUTH_CONTROLLER.OAUTH_LOGIN);  

   //@GET 'oauth/logout'
   app.get(OAUTH_PATHS.OAUTH_LOGOUT,   OAUTH_CONTROLLER.OAUTH_LOGOUT);  

   app.get(OAUTH_PATHS.LOGOUT,   OAUTH_CONTROLLER.LOGOUT);  


 // This is the reciever callback after getting the token
 app.get(OAUTH_PATHS.OAUTH_RECEIVER_CALLBACK,CREDENTAILS_FETCH_RECEIVER,  OAUTH_CONTROLLER.Receiver)


}
