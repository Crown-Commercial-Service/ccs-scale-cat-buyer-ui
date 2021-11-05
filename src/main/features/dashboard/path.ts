import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import {DASHBOARD_CONTROLLER} from './controller/index';
import {DASHBOARD_PATHS} from './model/dashboardConstants';
import { Application } from 'express';
import {ContentFetchMiddleware} from '../../common/middlewares/menu-contentservice/contentservice'

export default function(app: Application): void {
 // This is the reciever callback after getting the token
 app.get(DASHBOARD_PATHS.DASHBOARD, [
    ContentFetchMiddleware.FetchContents, 
    AUTH], DASHBOARD_CONTROLLER.DASHBOARD);

}