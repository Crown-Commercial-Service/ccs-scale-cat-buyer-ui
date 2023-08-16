import { ERROR_CONTROLLER } from './controller/index';
import { ERROR_PATHS } from './model/errorConstants';
import { Application } from 'express';
import { NO_AUTH } from '../common/middlewares/oauthservice/openroutecheck';

export default function (app: Application): void {
  //@ GetRoutes

  //@GET '/404'
  app.get(ERROR_PATHS.ROUTE_404, ERROR_CONTROLLER.Error_404);

  //@GET '/401'
  app.get(ERROR_PATHS.ROUTE_401, NO_AUTH, ERROR_CONTROLLER.Error_401);

  //@GET '/500'
  app.get(ERROR_PATHS.ROUTE_500, NO_AUTH, ERROR_CONTROLLER.Error_500);

  //@GET '/500 Opportunity'
  app.get(ERROR_PATHS.ROUTE_OPPORTUNITY_404, NO_AUTH, ERROR_CONTROLLER.Error_Opportunity_404);
}
