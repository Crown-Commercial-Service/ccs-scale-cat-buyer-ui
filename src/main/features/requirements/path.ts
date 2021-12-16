import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { REQUIREMENT_CONTROLLER } from './controller/index';
import { REQUIREMENT_PATHS } from './model/requirementConstants';
import { Application } from 'express';
import { ContentFetchMiddleware } from '../../common/middlewares/menu-contentservice/contentservice';

export default function (app: Application): void {
  // This is the reciever callback after getting the token
  app.get(REQUIREMENT_PATHS.CHOOSE_ROUTE, [
    ContentFetchMiddleware.FetchContents, AUTH], REQUIREMENT_CONTROLLER.REQUIREMENT_CHOOSE_ROUTE);

  app.get(REQUIREMENT_PATHS.RFP_TYPE, [
    ContentFetchMiddleware.FetchContents, AUTH], REQUIREMENT_CONTROLLER.REQUIREMENT_RFP_TYPE);

  app.get(REQUIREMENT_PATHS.REQUIREMENT_RFP_TASK_LIST, [
    ContentFetchMiddleware.FetchContents, AUTH], REQUIREMENT_CONTROLLER.REQUIREMENT_RFP_TASK_LIST);

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
}