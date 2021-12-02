import { Application } from 'express';
import { EOI_PATHS } from './model/rficonstant'
import { associatedViews } from './controller/index'
import * as apisource from '../../resources/content/eoi/template.json'
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementdetailsfetch'
import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck'
import { ContentFetchMiddleware } from '../../common/middlewares/menu-contentservice/contentservice'
import { PreMarketEngagementMiddleware } from '../../common/middlewares/premarketservice/premarketengagement';



export default function (app: Application): void {
  /**
   * 
   * @GET : Get Routes of EOI
   * @summary: provide all the respective associated view to the certain routes
   */
  // @GET '/rfi/rfi-task-list'
  app.get(EOI_PATHS.GET_TASKLIST,
    [ContentFetchMiddleware.FetchContents,
      AUTH,
    AgreementDetailsFetchMiddleware.FetchAgreements,
    PreMarketEngagementMiddleware.PutPremarket,
    ],
    associatedViews.GET_TASKLIST);

  //  @GET '/rfi/type'
  app.get(EOI_PATHS.GET_TYPE, [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_TYPE);

  //  @GET '/rfi/online-task-list'
  app.get(EOI_PATHS.GET_ONLINE_TASKLIST, [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_ONLINE_TASKLIST);

  //  @GET '/rfi/questions'
  app.get(EOI_PATHS.GET_QUESTIONS, [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_QUESTIONS);

  //  @GET '/rfi/upload-doc'
  app.get(EOI_PATHS.GET_UPLOAD_DOC, [ContentFetchMiddleware.FetchContents,  AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_UPLOAD_DOC);


  //@GET name your projects

  app.get(EOI_PATHS.GET_NAME_YOUR_PROJECT, [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_NAME_PROJECT)

  //@GET '/rfi/add-collaborators'
  app.get(EOI_PATHS.GET_ADD_COLLABORATOR, [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_ADD_COLLABORATOR);


  //@GET '/rfi/procurement-lead'
  app.get(EOI_PATHS.GET_LEAD_PROCUEMENT, [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_LEAD_PROCUREMENT)

  app.get(EOI_PATHS.GET_USER_PROCUREMENT,[AUTH], associatedViews.GET_USER_PROCUREMENT)

    //@GET "/rfi/upload-doc/remove"
    app.get(EOI_PATHS.GET_REMOVE_FILE, AUTH, associatedViews.GET_REMOVE_FILES )

    





  /**
   * 
   * @POST : POST Routes of EOI
   * @summary: provide all the respective associated view to the certain routes
   */


  // api 
  app.get('/api/template', (req, res) => res.json(apisource))

  //@POST '/rfi/type
  app.post(EOI_PATHS.POST_TYPE_TYPE, AUTH, associatedViews.POST_TYPE);

  //@POST '/rfi/questionnaire'
  app.post(EOI_PATHS.POST_QUESTIONS_QUESTIONNAIRE, AUTH , associatedViews.POST_QUESTION)

  //@POST '/rfi/name'
  app.post(EOI_PATHS.POST_PROJECT_NAME, AUTH , associatedViews.POST_NAME_PROJECT);



  //@POST '/rfi/get-collaborator-detail'
  app.post(EOI_PATHS.POST_ADD_COLLABORATOR, AUTH, associatedViews.POST_ADD_COLLABORATOR)


  app.post(EOI_PATHS.PUT_LEAD_PROCUREMENT, AUTH, associatedViews.PUT_LEAD_PROCUREMENT)
   

  //@POST '/rfi/proceed-collaborators'
  app.post(EOI_PATHS.POST_PROCEED_COLLABORTORS, AUTH, associatedViews.POST_PROCEED_COLLABORATORS)
  
  
  //@POST '/rfi/get-collaborator-detail/js-enabled'
  app.post(EOI_PATHS.POST_ADD_COLLABORATOR_JSENABLED, AUTH, associatedViews.POST_ADD_COLLABORATOR_JSENABLED)



  //@POST '/rfi/add-collaborator-detail'
  app.post(EOI_PATHS.POST_ADD_COLLABORATOR_TO_JAGGER, AUTH, associatedViews.POST_ADD_COLLABORATOR_TO_JAGGER)

  //@POST "rfi/upload-doc"
  app.post(EOI_PATHS.POST_UPLOAD_DOC, AUTH, associatedViews.POST_UPLOAD_DOC )




}
