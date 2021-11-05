import { Application } from 'express';
import {RFI_PATHS} from './model/rficonstant'
import {associatedViews} from './controller/index'
import * as apisource from '../../resources/content/RFI/template.json'
import {AgreementDetailsFetchMiddleware} from '../../common/middlewares/agreementservice/agreementdetailsfetch'
import { array } from './controller/questions';
import {AUTH} from '../../common/middlewares/oauthservice/authstatecheck'
import {ContentFetchMiddleware} from '../../common/middlewares/menu-contentservice/contentservice'



export default function(app: Application): void {
/**
 * 
 * @GET : Get Routes of RFI
 * @summary: provide all the respective associated view to the certain routes
 */
// @GET '/rfi/rfi-task-list'
  app.get(RFI_PATHS.GET_TASKLIST, [ContentFetchMiddleware.FetchContents,AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],  associatedViews.GET_TASKLIST);  

//  @GET '/rfi/type'
  app.get(RFI_PATHS.GET_TYPE, [ContentFetchMiddleware.FetchContents,AUTH ,AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_TYPE);     
  
  //  @GET '/rfi/online-task-list'
  app.get(RFI_PATHS.GET_ONLINE_TASKLIST, [ContentFetchMiddleware.FetchContents,AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_ONLINE_TASKLIST );      

  //  @GET '/rfi/questions'
  app.get(RFI_PATHS.GET_QUESTIONS, [ContentFetchMiddleware.FetchContents,AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_QUESTIONS);    

  //  @GET '/rfi/upload-doc'
  app.get(RFI_PATHS.GET_UPLOAD_DOC, [ContentFetchMiddleware.FetchContents ,AUTH] ,associatedViews.GET_UPLOAD_DOC);    
  
  app.get(RFI_PATHS.GET_NAME_YOUR_PROJECT, AUTH, associatedViews.GET_NAME_PROJECT)

  app.get('/api/answers', AUTH,  (req, res)=> {res.json(array)})

/**
 * 
 * @POST : POST Routes of RFI
 * @summary: provide all the respective associated view to the certain routes
 */


// api 
app.get('/api/template', (req, res)=> res.json(apisource))

  //@POST '/rfi/type
  app.post(RFI_PATHS.POST_TYPE_TYPE,   associatedViews.POST_TYPE);

  //@POST '/rfi/questionnaire'
  app.post(RFI_PATHS.POST_QUESTIONS_QUESTIONNAIRE,   associatedViews.POST_QUESTION)

  //@POST '/rfi/name'
  app.post(RFI_PATHS.POST_PROJECT_NAME, associatedViews.POST_NAME_PROJECT);


  //@postRoutes
  app.post('/test', (req, res) => {
    res.redirect('/questions')
  })
}
