import { Application } from 'express';
import {RFI_PATHS} from './model/rfiConstants'
import {RFI_TASKLIST} from './controller/rfiTaskList'
import {RFI_TYPE} from './controller/rifType'
import {AgreementDetailsFetchMiddleware} from '../../common/middlewares/agreementservice/agreementDetailFetch'

export default function(app: Application): void {

  //@ GetRoutes
  
  // @GET '/rfi/rfi-task-list'

  app.get(RFI_PATHS.RFI_TASKLIST, AgreementDetailsFetchMiddleware.FetchAgreements,  RFI_TASKLIST);  


  app.get(RFI_PATHS.RFI_TYPE, RFI_TYPE );                //  @GET '/rfi/type'

  //@ postRoutes
  app.post('/add', (req, res) =>  console.log(req.body))
}
