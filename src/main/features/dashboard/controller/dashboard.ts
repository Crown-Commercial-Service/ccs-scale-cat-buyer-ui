import * as express from 'express'
// import moment from 'moment';
import * as dashboarData from '../../../resources/content/dashboard/ccs-dashboard.json'
//import moment from 'moment';

export const DASHBOARD = (req: express.Request, res: express.Response) => {
  req.session.unpublishedeventmanagement="false";
  // Active and Historical events is getting feached from API via 'src/main/common/middlewares/event-management/activeevents.ts'
  // const activeEvent = req.session.openProjectActiveEvents;
  // for (const tmp of activeEvent){
  //   if(tmp.activeEvent.tenderPeriod.endDate){
  //     let utcCutoff = moment(tmp.activeEvent.tenderPeriod.endDate).utc().format('YYYY-MM-DD HH:mm');
  //     // let localCutoff = moment.utc(cutoffString).local().format('DD MMMM YYYY');
  //     tmp.activeEvent.tenderPeriod.endDate = utcCutoff;
  //   }
  // }
  // const activeEvent = req.session.openProjectActiveEvents;
  // for (const tmp of activeEvent){
  //   if(tmp.activeEvent.tenderPeriod.endDate){
  //     let utcCutoff = moment(tmp.activeEvent.tenderPeriod.endDate).utc().format('HH:mm / DD/MM/YYYY');
  //     // let localCutoff = moment.utc(cutoffString).local().format('DD MMMM YYYY');
  //     tmp.activeEvent.tenderPeriod.endDate = utcCutoff;
  //   }
  // }
  const appendData = { data: dashboarData, events: req.session.openProjectActiveEvents, historicalEvents: req.session.historicalEvents }
  res.render('dashboard', appendData);
}
