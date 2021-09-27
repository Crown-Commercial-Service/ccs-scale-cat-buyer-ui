import { Application } from 'express';
import {RFI_PATHS} from '../path/rfiPath'
import {RFI_TASKLIST} from '../controller/rfiTaskList'

export default function(app: Application): void {

  //@ GetRoutes   
  app.get(RFI_PATHS.RFI_TASKLIST, RFI_TASKLIST);

}
