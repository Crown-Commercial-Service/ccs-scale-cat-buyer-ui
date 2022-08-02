import * as express from 'express'
import * as dashboarData from '../../../resources/content/dashboard/ccs-dashboard.json'
import config from 'config'

export const DASHBOARD = (req: express.Request, res: express.Response) => {
  req.session.unpublishedeventmanagement="false";
  res.locals.myaccounturl=config.get('MyAccountURL')
  // Active and Historical events is getting feached from API via 'src/main/common/middlewares/event-management/activeevents.ts'
  const appendData = { data: dashboarData, events: req.session.openProjectActiveEvents, historicalEvents: req.session.historicalEvents }
  res.render('dashboard', appendData);
}
