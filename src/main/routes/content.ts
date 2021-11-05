import { Application } from 'express';
import {NO_AUTH} from '../common/middlewares/oauthservice/openroutecheck'
//import {ContentFetchMiddleware} from '../common/middlewares/contentservice/contentservice'
import * as express from 'express'
import {PrimaryItems, SiteMap, SecondaryItems, QuickLinks, AboutContant} from '../resources/content/menu-content/menu'

export default function(app: Application): void {
  
    //primary menu
  app.get('/wp-json/wp-api-menus/v2/menus/21', [NO_AUTH],  (req: express.Request, res: express.Response)=> {
    res.json(PrimaryItems)
  });

  //secondary menu
  app.get('/wp-json/wp-api-menus/v2/menus/22', [NO_AUTH],  (req: express.Request, res: express.Response)=> {
    res.json(SecondaryItems)
  });

    //sitemap menu
    app.get('/wp-json/wp-api-menus/v2/menus/23', [NO_AUTH],  (req: express.Request, res: express.Response)=> {
        res.json(SiteMap)
      });


     //quicklinks
  app.get('/wp-json/wp-api-menus/v2/menus/24', [NO_AUTH],  (req: express.Request, res: express.Response)=> {
    res.json(QuickLinks)
  });   

    //about & contact
    app.get('/wp-json/wp-api-menus/v2/menus/25', [NO_AUTH],  (req: express.Request, res: express.Response)=> {
        res.json(AboutContant)
    });



}