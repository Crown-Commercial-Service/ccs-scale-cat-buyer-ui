
import {ERROR_CONTROLLER } from './controller/index'
import {ROUTECONST} from './model/routeconstants'
import { Application } from 'express';

export default function(app: Application): void {
  //@ GetRoutes

 
 //@GET '/404'
 app.get(ROUTECONST.Route_404, ERROR_CONTROLLER.Error_404)


}
