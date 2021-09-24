import { Application } from 'express';
import * as Path from '../global/Path'
import * as CONTROLLER   from '../controllers/Home'

export default function(app: Application): void {
  
  app.get(Path.LandingPath.LANDING , CONTROLLER.LandingHandler);
}
