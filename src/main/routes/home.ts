import { Application } from 'express';
import {NO_AUTH} from '../common/middlewares/oauthservice/openroutecheck'
import {ContentFetchMiddleware} from '../common/middlewares/menu-contentservice/contentservice'
import express from 'express'

export default function(app: Application): void {
  
  app.get('/', [ContentFetchMiddleware.FetchContents,NO_AUTH],  (req : express.Request, res: express.Response)=> {
    res.render('home')
  });
}
