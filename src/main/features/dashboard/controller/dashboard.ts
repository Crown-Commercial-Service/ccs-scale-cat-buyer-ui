import * as express from 'express'
import * as dashboarData from '../../../resources/content/dashboard/ccs-dashboard.json'

export const DASHBOARD = (req: express.Request, res: express.Response) => {
  req.session.unpublishedeventmanagement="false";
  var today = new Date();
  var ClosedDate = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
  // Active and Historical events is getting feached from API via 'src/main/common/middlewares/event-management/activeevents.ts'
  const appendData = { data: dashboarData,ClosedDate, events: req.session.openProjectActiveEvents, historicalEvents: req.session.historicalEvents }
  res.render('dashboard', appendData);
}