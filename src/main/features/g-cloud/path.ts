import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { gcloudController } from './controller/index';
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementDetailsFetch';
import { GCloud_PATHS } from './model/gCloudConstants';
import { Application } from 'express';
//import {EventEngagementMiddleware} from '../../common/middlewares/event-management/activeevents'
//import { NO_AUTH } from '@common/middlewares/oauthservice/openroutecheck';

export default function (app: Application): void {
  // This is the reciever callback after getting the token

  //GET
  app.get(
    GCloud_PATHS.GET_CHOOSE_A_CATEGORY,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.GET_CHOOSE_A_CATEGORY
  );

  app.get(
    GCloud_PATHS.GET_SAVE_YOUR_SEARCH,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.GET_SAVE_YOUR_SEARCH
  );

  app.get(
    GCloud_PATHS.GET_NEW_SEARCH,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.GET_NEW_SEARCH
  );
  app.get(
    GCloud_PATHS.GET_EXPORT_RESULTS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.GET_EXPORT_RESULTS
  );
  app.get(
    GCloud_PATHS.GET_DOWNLOAD_YOUR_SEARCH,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.GET_DOWNLOAD_YOUR_SEARCH
  );
  app.get(
    GCloud_PATHS.GET_SEARCH,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.GET_SEARCH
  );
  app.get(
    GCloud_PATHS.GET_SAVED_SEARCHES,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.GET_SAVED_SEARCHES
  );
  app.get(
    GCloud_PATHS.DELETE_SAVED_SEARCHES,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.DELETE_SAVED_SEARCHES
  );
  app.get(
    GCloud_PATHS.GET_SEARCH_API,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.GET_SEARCH_API
  );
  app.get(
    GCloud_PATHS.GET_ADD_PROJECT_NAME,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.GET_NAME_PROJECT
  );

  app.get(
    GCloud_PATHS.GET_SERVICES,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.GET_SERVICES
  );

  app.post(
    GCloud_PATHS.POST_ADD_PROJECT_NAME,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.POST_NAME_PROJECT
  );

  //POST
  app.post(
    GCloud_PATHS.POST_CHOOSE_A_CATEGORY,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.POST_CHOOSE_A_CATEGORY
  );
  app.post(
    GCloud_PATHS.POST_SAVE_YOUR_SEARCH,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.POST_SAVE_YOUR_SEARCH
  );
  app.post(
    GCloud_PATHS.POST_NEW_SEARCH,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.POST_NEW_SEARCH
  );
  app.post(
    GCloud_PATHS.POST_EXPORT_RESULTS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.POST_EXPORT_RESULTS
  );

  app.post(
    GCloud_PATHS.POST_SAVE_YOUR_SEARCH_RESULTS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.POST_SAVE_YOUR_SEARCH_RESULTS
  );

  //@GET '/g-cloud/add-collaborators'
  app.get(
    GCloud_PATHS.GET_ADD_COLLABORATOR,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    gcloudController.GET_ADD_COLLABORATOR
  );
  //@POST '/g-cloud/get-collaborator-detail'
  app.post(GCloud_PATHS.POST_ADD_COLLABORATOR, AUTH, gcloudController.POST_ADD_COLLABORATOR);
  //@POST '/g-cloud/proceed-collaborators'
  app.post(GCloud_PATHS.POST_PROCEED_COLLABORTORS, AUTH, gcloudController.POST_PROCEED_COLLABORATORS);
  //@POST '/g-cloud/get-collaborator-detail/js-enabled'
  app.post(GCloud_PATHS.POST_ADD_COLLABORATOR_JSENABLED, AUTH, gcloudController.POST_ADD_COLLABORATOR_JSENABLED);

  //@POST '/g-cloud/add-collaborator-detail'
  app.post(GCloud_PATHS.POST_ADD_COLLABORATOR_TO_JAGGER, AUTH, gcloudController.POST_ADD_COLLABORATOR_TO_JAGGER);

  app.get(GCloud_PATHS.POST_DELETE_COLLABORATOR_TO_JAGGER, AUTH, gcloudController.POST_DELETE_COLLABORATOR_TO_JAGGER);
}
