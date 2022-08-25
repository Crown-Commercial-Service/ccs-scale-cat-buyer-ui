//@ts-nocheck
import * as express from 'express';
import * as chooseRouteData from '../../../resources/content/requirements/chooseRoute.json';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('FC / CA CHOOSE ROUTE');

/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const REQUIREMENT_CHOOSE_ROUTE = async (req: express.Request, res: express.Response) => {
  const releatedContent = req.session.releatedContent;
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  const updatedOptions = await updateRadioButtonOptions(
    chooseRouteData,
    agreementId_session,
    lotid,
    req.session?.types,
  );
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
  const appendData = { data: updatedOptions, releatedContent, error: isJaggaerError };
  res.render('choose-route', appendData);
};

function updateRadioButtonOptions(
  chooseRouteOptions: any,
  agreementId: string,
  lotId: string,
  types: string[],
): object {
  let updatedOptions = chooseRouteOptions;
  const updateLotId = lotId.length > 1 ? lotId :  lotId;
  switch (agreementId) {
    case 'RM6263':
      if (updateLotId == 'Lot 1') {
        for (let i = 0; i < chooseRouteData.form.radioOptions.items.length; i++) {
          if (types.find(element => element == 'FC')) {
            if (updatedOptions.form.radioOptions.items[i].value === '2-stage') {
              // updatedOptions.form.radioOptions.items[i].disabled = "true"
            } else if (updatedOptions.form.radioOptions.items[i].value === 'award') {
              updatedOptions.form.radioOptions.items[i].remove = 'true';
            }
          }
        }
      } else {
        for (let i = 0; i < chooseRouteData.form.radioOptions.items.length; i++) {
          if (types.find(element => element == 'FC')) {
            updatedOptions.form.radioOptions.items[i].remove = 'false';
          }
          if (types.find(element => element == 'DAA')) {
            if (
              updatedOptions.form.radioOptions.items[i].value === '2-stage' ||
              updatedOptions.form.radioOptions.items[i].value === 'award'
            ) {
              // updatedOptions.form.radioOptions.items[i].disabled = "true"
            }
          }
        }
      }
      break;

    case 'RM6187':
      break;

    default:
      updatedOptions = chooseRouteOptions;
  }
  return updatedOptions;
}

/**
 * @POSTController
 * @description
 *
 */
//POST 'eoi/type'
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const POST_REQUIREMENT_CHOOSE_ROUTE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const {eventId} = req.session;
  try {
    const filtered_body_content_removed_fc_key = ObjectModifiers._deleteKeyofEntryinObject(
      req.body,
      'choose_fc_route_to_market',
    );
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/3`, 'In progress');
    const { fc_route_to_market } = filtered_body_content_removed_fc_key;

    if (fc_route_to_market) {
      
      switch (fc_route_to_market) {
        case '1-stage':
          // eslint-disable-next-line no-case-declarations
          const redirect_address = REQUIREMENT_PATHS.RFP_TYPE;
          req.session.caSelectedRoute = fc_route_to_market;
          logger.info('One stage further competition selected');
          req.session.selectedRoute = 'FC';//await createNewEvent(req,res)
          res.redirect(redirect_address);
          break;

        case '2-stage':
          // eslint-disable-next-line no-case-declarations
          const newAddress = REQUIREMENT_PATHS.GET_LEARN;
          req.session.caSelectedRoute = fc_route_to_market;
          logger.info('two stage further competition selected');
          req.session.selectedRoute = 'FCA';//await createNewEvent(req,res)
          res.redirect(newAddress);
          break;

        case 'award':
          // eslint-disable-next-line no-case-declarations
          const nextAddress = REQUIREMENT_PATHS.DA_GET_LEARN_START;
          req.session.caSelectedRoute = fc_route_to_market;
          logger.info('DA selected');
          req.session.selectedRoute = 'DAA';//await createNewEvent(req,res)
          res.redirect(nextAddress);
          break;

        default:
          res.redirect('/404');
      }
    } else {
      req.session['isJaggaerError'] = true;
      res.redirect(REQUIREMENT_PATHS.CHOOSE_ROUTE);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Requirement Choose route page',
      true,
    );
  }
};

async function createNewEvent(req: express.Request, res: express.Response){
  try{
  const { eventId, projectId, procurements } = req.session;
    const { SESSION_ID } = req.cookies;
  if(req.session.fromStepsToContinue!=null){
    if(req.session.eventManagement_eventType=='FC' || req.session.eventManagement_eventType=='DA')
  { 
    const eventTypeURL = `tenders/projects/${projectId}/events`;
    let getEventType = await TenderApi.Instance(SESSION_ID).get(eventTypeURL);
    let FCAEvents, DAAEvents;
    if(req.session.eventManagement_eventType == 'FC'){
      FCAEvents = getEventType.data.filter(x => x.eventType == 'FCA')
      if(FCAEvents.length > 0)
      { 
      for(let i=0;i<FCAEvents.length;i++){
       try {
        const baseURL = `tenders/projects/${projectId}/events/${FCAEvents[i].id}/termination`;
        const body = {
                "terminationType": "cancelled"       
          };
          await TenderApi.Instance(SESSION_ID).put(baseURL, body);
       } catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'FCA event failed to closed',
          true,
        );
       } 
      }
    }
  }
    else{
      DAAEvents=getEventType.data.filter(x => x.eventType =='DAA')
      if(DAAEvents.length>0)
      for(let i=0;i<DAAEvents.length;i++){
        try {
        const baseURL = `tenders/projects/${projectId}/events/${DAAEvents[i].id}/termination`;
        const body = {
                "terminationType": "cancelled"       
          };
          const response = await TenderApi.Instance(SESSION_ID).put(baseURL, body);
       } catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'DAA event failed to close',
          true,
        );
       } 
      }
    }
  }
    
    const termbaseURL = `tenders/projects/${projectId}/events/${eventId}/termination`;
          const _termbody = {
                  "terminationType": "cancelled"       
            };
            const termresponse = await TenderApi.Instance(req.cookies.SESSION_ID).put(termbaseURL, _termbody);
               
    let newEventbaseUrl = `/tenders/projects/${projectId}/events`;
  let newEventBody = {
    "nonOCDS": {
      "eventType": req.session.selectedRoute
    }  
  } 
  
  const  newEventSavedata  = await TenderApi.Instance(req.cookies.SESSION_ID).post(newEventbaseUrl, newEventBody);
  
  if(newEventSavedata != null && newEventSavedata !=undefined)
  {
    req.session['eventId'] = newEventSavedata.data.id;
    req.session.procurements[0]['eventId'] = newEventSavedata.data.id;
    req.session.procurements[0]['eventType'] = newEventSavedata.data.eventType;
    req.session.procurements[0]['started'] = true;
    req.session.currentEvent = newEventSavedata.data;
    
  const currentProcNumber = procurements.findIndex(
    (proc: any) => proc.eventId === newEventSavedata.data.id && proc.procurementID === projectId,
  );
  const proc: Procurement = {
    procurementID: projectId,
    eventId: newEventSavedata.data.id,
    defaultName: {
      name: procurements[currentProcNumber].defaultName.name,
      components: {
        agreementId: procurements[currentProcNumber].defaultName.components.agreementId,
        lotId: procurements[currentProcNumber].defaultName.components.lotId,
        org: "COGNIZANT BUSINESS SERVICES UK LIMITED",
      }
    },
    started: true
  }
  procurements.push(proc)
  req.session.procurements=procurements
  // req.session.procurements[currentProcNum].started = true;

  try {
    const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`/journeys/${req.session.eventId}/steps`);
    req.session['journey_status'] = JourneyStatus?.data;
  } catch (journeyError) {
    const _journeybody = {
      'journey-id': req.session.eventId,
      states: journyData.states,
    };
    if (journeyError.response.status == 404) {
      await TenderApi.Instance(SESSION_ID).post(`journeys`, _journeybody);
      const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`journeys/${req.session.eventId}/steps`);
      req.session['journey_status'] = JourneyStatus?.data;
    }
  }
  }
  
  // const neweventTypeURL = `tenders/projects/${projectId}/events`;
  // req.session.currentEvent = data;
  // const { newdata } = await TenderApi.Instance(req.cookies.SESSION_ID).post(neweventTypeURL, _body);
  req.session.fromStepsToContinue=null
  

  
  }
}catch(error){}
}
