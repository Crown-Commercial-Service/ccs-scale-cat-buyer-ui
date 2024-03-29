import { COOKIES_CONTROLLER } from './controller/index';
import { COOKIES_PATHS } from './model/cookies';
import { Application } from 'express';
import { ContentFetchMiddleware } from '../../common/middlewares/menu-contentservice/contentservice';

export default function (app: Application): void {
  // Cookie setting page
  app.get(
    COOKIES_PATHS.COOKIES_SETTINGS,
    [ContentFetchMiddleware.FetchContents],
    COOKIES_CONTROLLER.COOKIES_SETTING_PAGE
  );

  // Cookies details page
  app.get(
    COOKIES_PATHS.COOKIES_DETAILS,
    [ContentFetchMiddleware.FetchContents],
    COOKIES_CONTROLLER.COOKIES_DETAILS_PAGE
  );

  // ACCESSIBILITY STATEMENT page
  app.get(
    COOKIES_PATHS.ACCESSIBILITY_STATEMENT,
    [ContentFetchMiddleware.FetchContents],
    COOKIES_CONTROLLER.ACCESSIBILITY_STATEMENT_PAGE
  );
}
