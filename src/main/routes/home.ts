import { Application } from 'express';
import {NO_AUTH} from '../common/middlewares/oauthservice/openroutecheck'

export default function(app: Application): void {
  
  app.get('/', NO_AUTH,  (req, res)=> res.render('home'));
}
