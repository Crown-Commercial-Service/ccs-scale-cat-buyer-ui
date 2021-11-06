
import { ERROR_CONTROLLER } from './controller/index'
import { ROUTECONST } from './model/routeconstants'
import { Application } from 'express';
import { NO_AUTH } from '../common/middlewares/oauthservice/openroutecheck'

export default function (app: Application): void {
  //@ GetRoutes


  //@GET '/404'
  app.get(ROUTECONST.Route_404, NO_AUTH, ERROR_CONTROLLER.Error_404)

  //@GET '/401'
  app.get(ROUTECONST.Route_401, NO_AUTH, ERROR_CONTROLLER.Error_401)

}
