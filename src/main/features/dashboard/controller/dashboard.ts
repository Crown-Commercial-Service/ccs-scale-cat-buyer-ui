import * as express from 'express';
// import moment from 'moment';
import * as dashboarData from '../../../resources/content/dashboard/ccs-dashboard.json';
//import moment from 'moment';
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import { ActiveEvents } from '@common/middlewares/models/active-events';
import { eventStatus } from '@common/util/eventStatus';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { logConstant } from '../../../common/logtracer/logConstant';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
export const DASHBOARD = (req: express.Request, res: express.Response) => {
  //CAS-INFO-LOG
  LoggTracer.infoLogger(null, logConstant.dashLandLog, req);
  
  req.session.unpublishedeventmanagement = 'false';
  const searchText = req.session.searchText;
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
  
  let withOutPaEventsData = req.session.historicalEvents?.filter((agroupitem: any) => {
    return agroupitem?.activeEvent?.eventType != "PA";
  });
  /** CAS-87 */
  let activeListDash = req.session.openProjectActiveEvents;
  let pastListDash = req.session.historicalEvents;

  activeListDash.sort(function(a: any, b: any){
    return +new Date(b.activeEvent.lastUpdated) - +new Date(a.activeEvent.lastUpdated);
  });

  pastListDash.sort(function(a: any, b: any){
    return +new Date(b.activeEvent.lastUpdated) - +new Date(a.activeEvent.lastUpdated);
  });

  const appendData = {
    data: dashboarData,
    searchText,
    events: activeListDash,
    historicalEvents: pastListDash,
    withOutPaEventsData:withOutPaEventsData
  };
  /** CAS-87 */
  res.render('dashboard', appendData);
};

export const POST_DASHBOARD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  try {
    const { search } = req.body;
    const access_token = req.session['access_token'];
    req.session.searchText = search;
    const activeEvents: ActiveEvents[] = [];
    const historicalEvents: ActiveEvents[] = [];
    let draftActiveEvent: ActiveEvents = {
      projectId: 0,
      projectName: '',
      agreementId: '',
      agreementName: '',
      lotId: '',
      lotName: '',
      activeEvent: undefined,
    };
    var searchNew = '' + search;
    
    if (searchNew.trim() != '') {
      
      const NameURL = `/tenders/projects?search-type=projectName&search-term=*${searchNew.trim()}*&page=0&page-size=20`;
      const eventURL = `/tenders/projects?search-type=eventId&search-term=*${searchNew.trim()}*&page=0&page-size=20`;
      const suppourtURL = `/tenders/projects?search-type=eventSupportId&search-term=*${searchNew.trim()}*&page=0&page-size=20`;
      
      req.session.openProjectActiveEvents = [];
      req.session.historicalEvents = [];
      let nameretrieveProjetActiveEventsPromise,eventretrieveProjetActiveEventsPromise,supportretrieveProjetActiveEventsPromise;
      if(searchNew.trim().includes('£') || searchNew.trim().includes('#')){
         nameretrieveProjetActiveEventsPromise = TenderApi.Instance(access_token).get(encodeURI(NameURL));
         eventretrieveProjetActiveEventsPromise = TenderApi.Instance(access_token).get(encodeURI(eventURL));
         supportretrieveProjetActiveEventsPromise = TenderApi.Instance(access_token).get(encodeURI(suppourtURL));
      }else{
         nameretrieveProjetActiveEventsPromise = TenderApi.Instance(access_token).get(NameURL);
         eventretrieveProjetActiveEventsPromise = TenderApi.Instance(access_token).get(eventURL);

         supportretrieveProjetActiveEventsPromise = TenderApi.Instance(access_token).get(suppourtURL);
      }
      
      await nameretrieveProjetActiveEventsPromise.then(async data => {  
        const events: ActiveEvents[] = data.data; 
        // const events: ActiveEvents[] = data.data.sort((a: { projectId: number }, b: { projectId: number }) =>
        //   a.projectId < b.projectId ? 1 : -1,
        // );        
        for (let i = 0; i < events.length; i++) {
          const eventsURL = `tenders/projects/${events[i].projectId}/events`;

          let getEvents = await TenderApi.Instance(SESSION_ID).get(eventsURL);
          let getEventsData = getEvents.data;

          for (let j = 0; j < getEventsData.length; j++) {
            let singleEvent: ActiveEvents = {
              projectId: events[i].projectId,
              projectName: events[i].projectName,
              agreementId: events[i].agreementId,
              agreementName: events[i].agreementName,
              lotId: events[i].lotId,
              lotName: events[i].lotName,
              activeEvent: getEventsData[j],
            };
            if (
              singleEvent.activeEvent != undefined &&
              singleEvent.activeEvent?.status != undefined &&
              (singleEvent.activeEvent.eventType == 'RFI' || singleEvent.activeEvent.eventType == 'EOI')
            ) {
              if (
                singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' ||
                singleEvent.activeEvent?.dashboardStatus == 'CLOSED' ||
                (singleEvent.activeEvent?.dashboardStatus == 'UNKNOWN' &&
                  singleEvent.activeEvent?.status == 'withdrawn')
              ) {
                historicalEvents.push(singleEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'IN-PROGRESS') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'In-Progress';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PUBLISHED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Published';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'TO-BE-EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'To Be Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATING') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluating';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Pre-award';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Awarded';
                activeEvents.push(draftActiveEvent);
              } else {
                activeEvents.push(singleEvent);
              }
            } else if (singleEvent.activeEvent?.eventType == 'TBD') {
              if (
                singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' ||
                singleEvent.activeEvent?.dashboardStatus == 'CLOSED'
              ) {
                historicalEvents.push(singleEvent);
              } else {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'In-Progress';
                activeEvents.push(draftActiveEvent);
              }
            }
            // eventType = FCA && PA & DAA (Active and historic events)
            else if (
              singleEvent.activeEvent?.status != undefined &&
              (singleEvent.activeEvent?.eventType == 'PA' ||
                singleEvent.activeEvent?.eventType == 'FCA' ||
                singleEvent.activeEvent?.eventType == 'DAA')
            ) {
              if (
                singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' ||
                singleEvent.activeEvent?.dashboardStatus == 'CLOSED'
              ) {
                // Historical Events
                historicalEvents.push(singleEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'ASSESSMENT') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Assessment';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Pre-award';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Awarded';
                activeEvents.push(draftActiveEvent);
              } else {
                activeEvents.push(singleEvent);
              }
            }
            // eventType = FC & DA (Active and historic events)
            else if (
              singleEvent.activeEvent?.status != undefined &&
              (singleEvent.activeEvent?.eventType == 'FC' || singleEvent.activeEvent?.eventType == 'DA')
            ) {
              if (
                singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' ||
                singleEvent.activeEvent?.dashboardStatus == 'CLOSED' ||
                (singleEvent.activeEvent?.dashboardStatus == 'UNKNOWN' &&
                  singleEvent.activeEvent?.status == 'withdrawn')
              ) {
                // Historical Events
                historicalEvents.push(singleEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'IN-PROGRESS') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'In-Progress';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PUBLISHED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Published';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'TO-BE-EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'To Be Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATING') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluating';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Awarded';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Pre-award';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == eventStatus.Awarded) {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = eventStatus.Awarded;
                activeEvents.push(draftActiveEvent);
              } else {
                activeEvents.push(singleEvent);
              }
            }
          }
        }
        // res.redirect('/viewdashboard');
      });
      await eventretrieveProjetActiveEventsPromise.then(async data => {
        const eventsId: ActiveEvents[] = data.data.sort((a: { projectId: number }, b: { projectId: number }) =>
          a.projectId < b.projectId ? 1 : -1,
        );
        for (let i = 0; i < eventsId.length; i++) {
          // eventType = RFI & EOI (Active and historic events)
          const eventsURL = `tenders/projects/${eventsId[i].projectId}/events`;

          let getEvents = await TenderApi.Instance(SESSION_ID).get(eventsURL);
          let getEventsData = getEvents.data;

          for (let j = 0; j < getEventsData.length; j++) {
            //let singleEvent=undefined;

            //*NOTE THIS CONDATION ADDED FOR G-CLOUD EVENT NOT TO DISPLAY

            let singleEvent: ActiveEvents = {
              projectId: eventsId[i].projectId,
              projectName: eventsId[i].projectName,
              agreementId: eventsId[i].agreementId,
              agreementName: eventsId[i].agreementName,
              lotId: eventsId[i].lotId,
              lotName: eventsId[i].lotName,
              activeEvent: getEventsData[j],
            };
            //singleEvent=events[i];
            //singleEvent.activeEvent=getEventsData[j];
            if (
              singleEvent.activeEvent != undefined &&
              singleEvent.activeEvent?.status != undefined &&
              (singleEvent.activeEvent.eventType == 'RFI' || singleEvent.activeEvent.eventType == 'EOI')
            ) {
              if (
                singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' ||
                singleEvent.activeEvent?.dashboardStatus == 'CLOSED' ||
                (singleEvent.activeEvent?.dashboardStatus == 'UNKNOWN' &&
                  singleEvent.activeEvent?.status == 'withdrawn')
              ) {
                // Historical Events
                historicalEvents.push(singleEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'IN-PROGRESS') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'In-Progress';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PUBLISHED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Published';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'TO-BE-EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'To Be Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATING') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluating';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Pre-award';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Awarded';
                activeEvents.push(draftActiveEvent);
              } else {
                activeEvents.push(singleEvent);
              }
            } else if (singleEvent.activeEvent?.eventType == 'TBD') {
              if (
                singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' ||
                singleEvent.activeEvent?.dashboardStatus == 'CLOSED'
              ) {
                historicalEvents.push(singleEvent);
              } else {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'In-Progress';
                activeEvents.push(draftActiveEvent);
              }
            }
            // eventType = FCA && PA & DAA (Active and historic events)
            else if (
              singleEvent.activeEvent?.status != undefined &&
              (singleEvent.activeEvent?.eventType == 'PA' ||
                singleEvent.activeEvent?.eventType == 'FCA' ||
                singleEvent.activeEvent?.eventType == 'DAA')
            ) {
              if (
                singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' ||
                singleEvent.activeEvent?.dashboardStatus == 'CLOSED'
              ) {
                // Historical Events
                historicalEvents.push(singleEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'ASSESSMENT') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Assessment';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Pre-award';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Awarded';
                activeEvents.push(draftActiveEvent);
              } else {
                activeEvents.push(singleEvent);
              }
            }
            // eventType = FC & DA (Active and historic events)
            else if (
              singleEvent.activeEvent?.status != undefined &&
              (singleEvent.activeEvent?.eventType == 'FC' || singleEvent.activeEvent?.eventType == 'DA')
            ) {
              if (
                singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' ||
                singleEvent.activeEvent?.dashboardStatus == 'CLOSED' ||
                (singleEvent.activeEvent?.dashboardStatus == 'UNKNOWN' &&
                  singleEvent.activeEvent?.status == 'withdrawn')
              ) {
                // Historical Events
                historicalEvents.push(singleEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'IN-PROGRESS') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'In-Progress';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PUBLISHED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Published';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'TO-BE-EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'To Be Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATING') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluating';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Awarded';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Pre-award';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == eventStatus.Awarded) {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = eventStatus.Awarded;
                activeEvents.push(draftActiveEvent);
              } else {
                activeEvents.push(singleEvent);
              }
            }
          }
        }
        // res.redirect('/viewdashboard');
      });
      await supportretrieveProjetActiveEventsPromise.then(async data => {
        const supportevents: ActiveEvents[] = data.data.sort((a: { projectId: number }, b: { projectId: number }) =>
          a.projectId < b.projectId ? 1 : -1,
        );
        for (let i = 0; i < supportevents.length; i++) {
          // eventType = RFI & EOI (Active and historic events)
          const eventsURL = `tenders/projects/${supportevents[i].projectId}/events`;

          let getEvents = await TenderApi.Instance(SESSION_ID).get(eventsURL);
          let getEventsData = getEvents.data;

          for (let j = 0; j < getEventsData.length; j++) {
            //let singleEvent=undefined;

            //*NOTE THIS CONDATION ADDED FOR G-CLOUD EVENT NOT TO DISPLAY

            let singleEvent: ActiveEvents = {
              projectId: supportevents[i].projectId,
              projectName: supportevents[i].projectName,
              agreementId: supportevents[i].agreementId,
              agreementName: supportevents[i].agreementName,
              lotId: supportevents[i].lotId,
              lotName: supportevents[i].lotName,
              activeEvent: getEventsData[j],
            };
            //singleEvent=events[i];
            //singleEvent.activeEvent=getEventsData[j];
            if (
              singleEvent.activeEvent != undefined &&
              singleEvent.activeEvent?.status != undefined &&
              (singleEvent.activeEvent.eventType == 'RFI' || singleEvent.activeEvent.eventType == 'EOI')
            ) {
              if (
                singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' ||
                singleEvent.activeEvent?.dashboardStatus == 'CLOSED' ||
                (singleEvent.activeEvent?.dashboardStatus == 'UNKNOWN' &&
                  singleEvent.activeEvent?.status == 'withdrawn')
              ) {
                // Historical Events
                historicalEvents.push(singleEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'IN-PROGRESS') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'In-Progress';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PUBLISHED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Published';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'TO-BE-EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'To Be Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATING') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluating';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Pre-award';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Awarded';
                activeEvents.push(draftActiveEvent);
              } else {
                activeEvents.push(singleEvent);
              }
            } else if (singleEvent.activeEvent?.eventType == 'TBD') {
              if (
                singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' ||
                singleEvent.activeEvent?.dashboardStatus == 'CLOSED'
              ) {
                historicalEvents.push(singleEvent);
              } else {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'In-Progress';
                activeEvents.push(draftActiveEvent);
              }
            }
            // eventType = FCA && PA & DAA (Active and historic events)
            else if (
              singleEvent.activeEvent?.status != undefined &&
              (singleEvent.activeEvent?.eventType == 'PA' ||
                singleEvent.activeEvent?.eventType == 'FCA' ||
                singleEvent.activeEvent?.eventType == 'DAA')
            ) {
              if (
                singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' ||
                singleEvent.activeEvent?.dashboardStatus == 'CLOSED'
              ) {
                // Historical Events
                historicalEvents.push(singleEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'ASSESSMENT') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Assessment';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Pre-award';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Awarded';
                activeEvents.push(draftActiveEvent);
              } else {
                activeEvents.push(singleEvent);
              }
            }
            // eventType = FC & DA (Active and historic events)
            else if (
              singleEvent.activeEvent?.status != undefined &&
              (singleEvent.activeEvent?.eventType == 'FC' || singleEvent.activeEvent?.eventType == 'DA')
            ) {
              if (
                singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' ||
                singleEvent.activeEvent?.dashboardStatus == 'CLOSED' ||
                (singleEvent.activeEvent?.dashboardStatus == 'UNKNOWN' &&
                  singleEvent.activeEvent?.status == 'withdrawn')
              ) {
                // Historical Events
                historicalEvents.push(singleEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'IN-PROGRESS') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'In-Progress';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PUBLISHED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Published';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'TO-BE-EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'To Be Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATING') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluating';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Evaluated';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Awarded';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = 'Pre-award';
                activeEvents.push(draftActiveEvent);
              } else if (singleEvent.activeEvent?.dashboardStatus == eventStatus.Awarded) {
                draftActiveEvent = singleEvent;
                draftActiveEvent.activeEvent.status = eventStatus.Awarded;
                activeEvents.push(draftActiveEvent);
              } else {
                activeEvents.push(singleEvent);
              }
            }
          }
        }
      });

      var filteredactive = [...new Set(activeEvents.map(({projectId}) => projectId))].map(e => activeEvents.find(({projectId}) => projectId == e));	
      var filteredhistorical = [...new Set(historicalEvents.map(({projectId}) => projectId))].map(e => historicalEvents.find(({projectId}) => projectId == e));	

      req.session.openProjectActiveEvents = filteredactive;
      req.session.historicalEvents = filteredhistorical;
      res.redirect('/viewdashboard');
    } else {
      req.session.openProjectActiveEvents = [];
      req.session.historicalEvents = [];
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.log("errerrerr",err);
    
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tenders API for getting the list of Active Events',
      false,
    );
  }
};

export const VIEW_DASHBOARD = (req: express.Request, res: express.Response) => {
  req.session.unpublishedeventmanagement = 'false';
  const searchText = req.session.searchText;
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
  let withOutPaEventsData = req.session.historicalEvents?.filter((agroupitem: any) => {
    return agroupitem?.activeEvent?.eventType != "PA";
  });

  /** CAS-87 */
  let activeListDash = req.session.openProjectActiveEvents;
  let pastListDash = req.session.historicalEvents;

  activeListDash.sort(function(a: any, b: any){
    return +new Date(b.activeEvent.lastUpdated) - +new Date(a.activeEvent.lastUpdated);
  });

  pastListDash.sort(function(a: any, b: any){
    return +new Date(b.activeEvent.lastUpdated) - +new Date(a.activeEvent.lastUpdated);
  });

  const appendData = {
    data: dashboarData,
    searchText,
    events: activeListDash,
    historicalEvents: pastListDash,
    withOutPaEventsData:withOutPaEventsData
  };
  /** CAS-87 */
  res.render('dashboard', appendData);
};
