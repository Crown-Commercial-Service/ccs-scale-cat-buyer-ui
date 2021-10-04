import { Application } from 'express';
import {RFI_PATHS} from './model/rficonstant'
import {associatedViews} from './controller/index'
import {AgreementDetailsFetchMiddleware} from '../../common/middlewares/agreementservice/agreementdetailsfetch'
export default function(app: Application): void {
/**
 * 
 * @GET : Get Routes of RFI
 * @summary: provide all the respective associated view to the certain routes
 */
// @GET '/rfi/rfi-task-list'
  app.get(RFI_PATHS.GET_TASKLIST, AgreementDetailsFetchMiddleware.FetchAgreements,  associatedViews.GET_TASKLIST);  

//  @GET '/rfi/type'
  app.get(RFI_PATHS.GET_TYPE, AgreementDetailsFetchMiddleware.FetchAgreements, associatedViews.GET_TYPE);     
  
  //  @GET '/rfi/online-task-list'
  app.get(RFI_PATHS.GET_ONLINE_TASKLIST, AgreementDetailsFetchMiddleware.FetchAgreements, associatedViews.GET_ONLINE_TASKLIST );      

  //  @GET '/rfi/questions'
  app.get(RFI_PATHS.GET_QUESTIONS, AgreementDetailsFetchMiddleware.FetchAgreements, associatedViews.GET_QUESTIONS);      

/**
 * 
 * @POST : POST Routes of RFI
 * @summary: provide all the respective associated view to the certain routes
 */

  //@POST '/rfi/questions/question
  app.post(RFI_PATHS.POST_QUESTIONS_QUESTION,   associatedViews.POST_QUESTION)

  //@postRoutes
  app.post('/test', (req, res) => {
    res.redirect('/questions')
  })
}
