import { Application } from 'express';
import * as Path from '../global/Path'
import * as CONTROLLER   from '../controllers/RFIController'

export default function(app: Application): void {

    
  // Request for information PathList
  app.get(Path.RFI_PATH.RFI_TASKLIST , CONTROLLER.RFI_TASK_LIST);
}
