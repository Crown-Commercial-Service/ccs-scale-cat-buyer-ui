import { Application } from 'express';
import { RFI_PATHS } from './model/rficonstant'
import { associatedViews } from './controller/index'
import * as apisource from '../../resources/content/RFI/template.json'
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementdetailsfetch'
import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck'
import { ContentFetchMiddleware } from '../../common/middlewares/menu-contentservice/contentservice'
import { PreMarketEngagementMiddleware } from '../../common/middlewares/premarketservice/premarketengagement';



export default function (app: Application): void {
  /**
   * 
   * @GET : Get Routes of RFI
   * @summary: provide all the respective associated view to the certain routes
   */
  // @GET '/rfi/rfi-task-list'
  app.get(RFI_PATHS.GET_TASKLIST,
    [ContentFetchMiddleware.FetchContents,
      AUTH,
    AgreementDetailsFetchMiddleware.FetchAgreements,
    PreMarketEngagementMiddleware.PutPremarket,
    ],
    associatedViews.GET_TASKLIST);

  //  @GET '/rfi/type'
  app.get(RFI_PATHS.GET_TYPE, [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_TYPE);

  //  @GET '/rfi/online-task-list'
  app.get(RFI_PATHS.GET_ONLINE_TASKLIST, [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_ONLINE_TASKLIST);

  //  @GET '/rfi/questions'
  app.get(RFI_PATHS.GET_QUESTIONS, [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_QUESTIONS);

  //  @GET '/rfi/upload-doc'
  app.get(RFI_PATHS.GET_UPLOAD_DOC, [ContentFetchMiddleware.FetchContents, AUTH], associatedViews.GET_UPLOAD_DOC);


  //@GET name your projects

  app.get(RFI_PATHS.GET_NAME_YOUR_PROJECT, [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_NAME_PROJECT)

  //@GET '/rfi/add-collaborators'
  app.get(RFI_PATHS.GET_ADD_COLLABORATOR, [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_ADD_COLLABORATOR);


  //@GET '/rfi/procurement-lead'
  app.get(RFI_PATHS.GET_LEAD_PROCUEMENT, [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_LEAD_PROCUREMENT)

  app.get(RFI_PATHS.GET_USER_PROCUREMENT, associatedViews.GET_USER_PROCUREMENT)


  /**
   * 
   * @POST : POST Routes of RFI
   * @summary: provide all the respective associated view to the certain routes
   */


  // api 
  app.get('/api/template', (req, res) => res.json(apisource))

  //@POST '/rfi/type
  app.post(RFI_PATHS.POST_TYPE_TYPE, AUTH, associatedViews.POST_TYPE);

  //@POST '/rfi/questionnaire'
  app.post(RFI_PATHS.POST_QUESTIONS_QUESTIONNAIRE, AUTH , associatedViews.POST_QUESTION)

  //@POST '/rfi/name'
  app.post(RFI_PATHS.POST_PROJECT_NAME, AUTH , associatedViews.POST_NAME_PROJECT);



  //@POST '/rfi/get-collaborator-detail'
  app.post(RFI_PATHS.POST_ADD_COLLABORATOR, AUTH, associatedViews.POST_ADD_COLLABORATOR)


  app.post(RFI_PATHS.PUT_LEAD_PROCUREMENT, AUTH, associatedViews.PUT_LEAD_PROCUREMENT)
   

  //@POST '/rfi/proceed-collaborators'
  app.post(RFI_PATHS.POST_PROCEED_COLLABORTORS, AUTH, associatedViews.POST_PROCEED_COLLABORATORS)  

  //@POST '/rfi/add-collaborator-detail'
  app.post(RFI_PATHS.POST_ADD_COLLABORATOR_TO_JAGGER, AUTH, associatedViews.POST_ADD_COLLABORATOR_TO_JAGGER)


}
