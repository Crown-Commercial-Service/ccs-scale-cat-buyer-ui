import { COOKIES_CONTROLLER } from './controller/index';
import { COOKIES_PATHS } from './model/cookies';
import { Application } from 'express';
import { ContentFetchMiddleware } from '../../common/middlewares/menu-contentservice/contentservice';

export default function (app: Application): void {
   // agreement page
   app.get(COOKIES_PATHS.COOKIES_SETTINGS,
      [ContentFetchMiddleware.FetchContents],
      COOKIES_CONTROLLER.COOKIES_SETTING_PAGE);
}
