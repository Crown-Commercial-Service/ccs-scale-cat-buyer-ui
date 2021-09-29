import { Application } from 'express';
import {RFI_PATHS} from './model/rfiConstants'
import {RFI_TASKLIST} from './controller/rfiTaskList'
import {RFI_TYPE} from './controller/rifType'

export default function(app: Application): void {

  //@ GetRoutes   
  app.get(RFI_PATHS.RFI_TASKLIST, RFI_TASKLIST);          // @GET '/rfi/rfi-task-list'
  app.get(RFI_PATHS.RFI_TYPE, RFI_TYPE );                //  @GET '/rfi/type'


  //@ postRoutes
  app.post('/add', (req, res) =>  console.log(req.body))
}
