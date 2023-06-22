import { activeEventsMiddleware } from '@common/middlewares/eventManagement/activeEvents';
import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { dashboardController } from './controller/index';
import { DashboardPaths } from './model/dashboardConstants';
import { Application } from 'express';

export default function (app: Application): void {
  // This is the reciever callback after getting the token
  app.get(DashboardPaths.DASHBOARD, [AUTH, activeEventsMiddleware.getEvents], dashboardController.renderDashboard);
  app.post(DashboardPaths.POST_DASHBOARD, [AUTH, activeEventsMiddleware.searchEvents], dashboardController.renderDashboard);
}
