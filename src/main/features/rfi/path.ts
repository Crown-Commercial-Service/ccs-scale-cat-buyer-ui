import { Application } from 'express';
import {RFI_PATHS} from './model/rfiConstants'
import {associatedViews} from './controller/index'
import {AgreementDetailsFetchMiddleware} from '../../common/middlewares/agreementservice/agreementDetailFetch'



export default function(app: Application): void {

/**
 * 
 * @GET : Get Routes of RFI
 * @summary: provide all the respective associated view to the certain routes
 */
// @GET '/rfi/rfi-task-list'
  app.get(RFI_PATHS.RFI_TASKLIST, AgreementDetailsFetchMiddleware.FetchAgreements,  associatedViews.RFI_TASKLIST);  

//  @GET '/rfi/type'
  app.get(RFI_PATHS.RFI_TYPE, associatedViews.RFI_TYPE);     
  
  //  @GET '/rfi/online-task-list'
  app.get(RFI_PATHS.RFI_ONLINE_TASKLIST, AgreementDetailsFetchMiddleware.FetchAgreements, associatedViews.RFI_ONLINE_TASKLIST );      

  //  @GET '/rfi/who'
  app.get(RFI_PATHS.RFI_WHO,  associatedViews.RFI_WHO);      


  /**
 * 
 * @RPOST : POST Routes of RFI
 * @summary: provide all the respective associated view to the certain routes
 */
  //@ postRoutes
  app.post('/add', (req, res) =>  console.log(req.body))
}
