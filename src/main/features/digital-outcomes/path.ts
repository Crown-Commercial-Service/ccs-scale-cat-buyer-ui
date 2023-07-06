import { DIGITALOUTCOMES_CONTROLLER } from './controller/index';
import { DIGITALOUTCOMES_PATHS } from './model/digitalOutcomesConstants';
import { Application } from 'express';
//import {EventEngagementMiddleware} from '../../common/middlewares/event-management/activeevents'
//import { NO_AUTH } from '@common/middlewares/oauthservice/openroutecheck';

export default function (app: Application): void {
  // This is the reciever callback after getting the token

  //GET
  app.get(DIGITALOUTCOMES_PATHS.GET_OPPORTUNITIES, DIGITALOUTCOMES_CONTROLLER.GET_OPPORTUNITIES);
  app.get(DIGITALOUTCOMES_PATHS.GET_OPPORTUNITIES_DETAILS, DIGITALOUTCOMES_CONTROLLER.GET_OPPORTUNITIES_DETAILS);
  app.get(DIGITALOUTCOMES_PATHS.GET_OPPORTUNITIES_API, DIGITALOUTCOMES_CONTROLLER.GET_OPPORTUNITIES_API);
  app.get(
    DIGITALOUTCOMES_PATHS.GET_OPPORTUNITIES_DETAILS_REVIE_RECOMMENDATION,
    DIGITALOUTCOMES_CONTROLLER.GET_OPPORTUNITIES_DETAILS_REVIE_RECOMMENDATION
  );
  app.get(DIGITALOUTCOMES_PATHS.GET_OPPORTUNITIES_QA, DIGITALOUTCOMES_CONTROLLER.GET_OPPORTUNITIES_QA);
}
