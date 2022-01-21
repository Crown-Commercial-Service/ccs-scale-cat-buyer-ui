import { Application } from 'express';
import {NO_AUTH} from '../common/middlewares/oauthservice/openroutecheck'
import {ContentFetchMiddleware} from '../common/middlewares/menu-contentservice/contentservice'
import express from 'express'

import * as data from '../resources/content/home/home.json';

export default function(app: Application): void {
  
  app.get('/', [ContentFetchMiddleware.FetchContents,NO_AUTH],  (req : express.Request, res: express.Response)=> {
    const { isAuthenticated } = req.session;
    let appendData = data 
    if (isAuthenticated) {
      appendData = Object.assign({}, { ...appendData, isAuth: true })
    }
    res.render('home', appendData)
  });
}
