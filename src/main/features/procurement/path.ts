import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import {PROCUREMENT_CONTROLLER} from './controller/index';
import {PROCUREMENT_PATHS} from './model/procurement';
import { Application } from 'express';
import {ContentFetchMiddleware} from '../../common/middlewares/menu-contentservice/contentservice'


export default function(app: Application): void {
 // This is the reciever callback after getting the token
 app.get(PROCUREMENT_PATHS.PROCUREMENT, [
    ContentFetchMiddleware.FetchContents, 
    AUTH], PROCUREMENT_CONTROLLER.PROCUREMENT);

}