import { Application } from 'express';
import * as Path from '../global/Path'
import * as CONTROLLER   from '../controllers/HomeController'

export default function(app: Application): void {
  
  app.get(Path.LandingPath.LANDING , CONTROLLER.LandingHandler);
}
