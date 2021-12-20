import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { REQUIREMENT_CONTROLLER } from './controller/index';
import { REQUIREMENT_PATHS } from './model/requirementConstants';
import { Application } from 'express';
import { ContentFetchMiddleware } from '../../common/middlewares/menu-contentservice/contentservice';
import { PreMarketEngagementMiddleware } from '../../common/middlewares/premarketservice/premarketengagement';
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementdetailsfetch'

export default function (app: Application): void {
  // This is the reciever callback after getting the token
  app.get(REQUIREMENT_PATHS.CHOOSE_ROUTE, [
    ContentFetchMiddleware.FetchContents, AUTH], REQUIREMENT_CONTROLLER.REQUIREMENT_CHOOSE_ROUTE);

  app.get(REQUIREMENT_PATHS.RFP_TYPE, [
    ContentFetchMiddleware.FetchContents, AUTH], REQUIREMENT_CONTROLLER.REQUIREMENT_RFP_TYPE);

  app.get(REQUIREMENT_PATHS.REQUIREMENT_RFP_TASK_LIST, [
    ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements, PreMarketEngagementMiddleware.PutPremarket], REQUIREMENT_CONTROLLER.REQUIREMENT_RFP_TASK_LIST);

  app.get(
    REQUIREMENT_PATHS.GET_NAME_PROJECT,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.GET_NAME_PROJECT,
  );

  //@GET '/rfp/add-collaborators'
  app.get(
    REQUIREMENT_PATHS.GET_ADD_COLLABORATOR,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.GET_ADD_COLLABORATOR,
  );

  //@GET '/rfp/procurement-lead'
  app.get(
    REQUIREMENT_PATHS.GET_LEAD_PROCUREMENT,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.GET_LEAD_PROCUREMENT,
  );

  app.get(REQUIREMENT_PATHS.GET_USER_PROCUREMENT, [AUTH], REQUIREMENT_CONTROLLER.GET_USER_PROCUREMENT);

  app.get(REQUIREMENT_PATHS.OFFLINE_JOURNEY_PAGE, [AUTH], REQUIREMENT_CONTROLLER.OFFLINE_JOURNEY_PAGE);


  app.post(
    REQUIREMENT_PATHS.POST_ROUTE,
    [ContentFetchMiddleware.FetchContents, AUTH],
    REQUIREMENT_CONTROLLER.POST_REQUIREMENT_CHOOSE_ROUTE,
  );

  app.post(
    REQUIREMENT_PATHS.POST_RFP_TYPE,
    [ContentFetchMiddleware.FetchContents, AUTH],
    REQUIREMENT_CONTROLLER.POST_RFP_TYPE,
  );

  //@POST '/rfp/name'
  app.post(REQUIREMENT_PATHS.POST_PROJECT_NAME, AUTH , REQUIREMENT_CONTROLLER.POST_NAME_PROJECT);


  //@POST '/rfp/get-collaborator-detail'
  app.post(REQUIREMENT_PATHS.POST_ADD_COLLABORATOR, AUTH, REQUIREMENT_CONTROLLER.POST_ADD_COLLABORATOR)


  app.post(REQUIREMENT_PATHS.PUT_LEAD_PROCUREMENT, AUTH, REQUIREMENT_CONTROLLER.PUT_LEAD_PROCUREMENT)
   

  //@POST '/rfp/proceed-collaborators'
  app.post(REQUIREMENT_PATHS.POST_PROCEED_COLLABORATORS, AUTH, REQUIREMENT_CONTROLLER.POST_PROCEED_COLLABORATORS)
  
  
  //@POST '/rfp/get-collaborator-detail/js-enabled'
  app.post(REQUIREMENT_PATHS.POST_ADD_COLLABORATOR_JSENABLED, AUTH, REQUIREMENT_CONTROLLER.POST_ADD_COLLABORATOR_JSENABLED)



  //@POST '/rfp/add-collaborator-detail'
  app.post(REQUIREMENT_PATHS.POST_ADD_COLLABORATOR_TO_JAGGER, AUTH, REQUIREMENT_CONTROLLER.POST_ADD_COLLABORATOR_TO_JAGGER)

}