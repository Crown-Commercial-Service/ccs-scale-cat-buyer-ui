import { Application } from 'express';
import * as Path from '../global/Path'
import * as CONTROLLER   from '../controllers/homeController'

export default function(app: Application): void {
  
  app.get(Path.LandingPath.LANDING , CONTROLLER.LandingHandler);
}
