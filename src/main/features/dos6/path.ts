import { Application } from 'express';
import { DOS6_PATHS } from './model/dos6Constant';
import { associatedViews } from './controller/index';
import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
// import { PreMarketEngagementMiddleware } from '../../common/middlewares/premarketservice/premarketengagement';

export default function (app: Application): void {
  /**
   *
   * @GET : Get Routes of RFI
   * @summary: provide all the respective associated view to the certain routes
   */
  // @GET '/dos6/dos6-home'
  app.get(
    DOS6_PATHS.GET_HOME,
    [
      AUTH
    ],
    associatedViews.DOS6_GET_HOME,
  );

  //  @GET '/rfi/type'
  
  //@POST /rfi/upload-doc/procceed
  // app.post(RFI_PATHS.POST_UPLOAD_PROCEED, AUTH, associatedViews.POST_UPLOAD_PROCEED);
}
