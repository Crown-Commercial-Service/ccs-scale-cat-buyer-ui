import { Application } from 'express';
import {OAUTH_PATHS} from '../OAUTH/model/oauthConstants'
import {OAUTH_LOGIN} from './controller/oauthLogin'
import {AuthorizationMiddleware} from '../../common/middlewares/oauthlogin/AuthorizationMiddleware'

export default function(app: Application): void {
  //@ GetRoutes

  //@GET '/login'

 app.get(OAUTH_PATHS.OAUTH_LOGIN, AuthorizationMiddleware.FetchOauth,  OAUTH_LOGIN);  

}
