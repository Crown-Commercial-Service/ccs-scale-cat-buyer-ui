import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import {associatedViews_GCloud} from './controller/index';
import {GCloud_PATHS} from './model/gCloudConstants';
import { Application } from 'express';
//import {EventEngagementMiddleware} from '../../common/middlewares/event-management/activeevents'
//import { NO_AUTH } from '@common/middlewares/oauthservice/openroutecheck';

export default function(app: Application): void {
 // This is the reciever callback after getting the token
 app.get(GCloud_PATHS.GET_HOME_GCloud, [AUTH], associatedViews_GCloud.GET_SEARCH_HOME_GCLOUD)
 app.get(GCloud_PATHS.GET_SERVICEES_RESULT_GCLOUD, [AUTH], associatedViews_GCloud.GET_SERVICE_RESULT_GCLOUD)
}
