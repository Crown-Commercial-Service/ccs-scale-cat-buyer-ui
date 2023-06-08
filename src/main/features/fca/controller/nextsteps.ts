import * as express from 'express';
import * as cmsData from '../../../resources/content/MCF3/nextsteps.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
// import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
// import * as journyData from '../../procurement/model/tasklist.json';

//@GET /fca/event-sent
export const FCA_GET_NEXTSTEPS = async (req: express.Request, res: express.Response) => {
  //cmsData.breadCrumbs[1].href=cmsData.breadCrumbs[1].href+req.session.eventId;
  const { agreementLotName, agreementName, agreement_id, releatedContent, project_name, projectId } = req.session;
  const { isEmptyNextstepError } = req.session;
  req.session['isEmptyNextstepError'] = false;
  const lotid = req.session?.lotId;
  const agreementId_session = agreement_id;
  const appendData = {
    data: cmsData,
    projPersistID: req.session['project_name'],
    eventId: req.session.eventId,
    releatedContent,
    error: isEmptyNextstepError,
    agreementId_session,
  };
  const { SESSION_ID } = req.cookies; //jwt
  res.locals.agreement_header = {
    agreementName,
    projectName:project_name,
    projectId,
    agreementIdSession:agreementId_session,
    agreementLotName,
    lotid,
    error: isEmptyNextstepError,
  };
  try {
    // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/1`, 'Completed');
    res.render('fca-nextSteps.njk', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'FCA - Journey service - update the status failed - Publish Page',
      true
    );
  }
};

export const FCA_POST_NEXTSTEPS = async (req: express.Request, res: express.Response) => {
  const input = req.body;
  const { SESSION_ID } = req.cookies;
  const { eventId, projectId, procurements } = req.session;
  // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/1`, 'Completed');
  try {
    if (input.fca_next_steps == undefined) {
      req.session['isEmptyNextstepError'] = true;
      res.redirect('/fca/next-step');
    } else if (input.fca_next_steps == 'goto_next') {
      //FCA to TBD event update -- Force (Start)
      // const eventTypeURL = `tenders/projects/${projectId}/events`;
      // const eventType = 'RFI';
      // const _body = {
      //   eventType: eventType,
      // };
      // const { data } = await TenderApi.Instance(SESSION_ID).post(eventTypeURL, _body);
      // req.session.currentEvent = data;
      const currentProcNum = procurements.findIndex(
        (proc: any) => proc.eventId === eventId && proc.procurementID === projectId
      );
      // req.session.procurements[currentProcNum].eventId = data.id;
      req.session.procurements[currentProcNum].started = false;
      // req.session.eventId = data.id;

      //Journey
      // try {
      //   const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`/journeys/${data.id}/steps`);
      //   req.session['journey_status'] = JourneyStatus?.data;
      // } catch (journeyError) {
      //   const _body = {
      //     'journey-id': data.id,
      //     states: journyData.states,
      //   };
      //   if (journeyError.response.status == 404) {
      //     await TenderApi.Instance(SESSION_ID).post(`journeys`, _body);
      //     const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`journeys/${data.id}/steps`);
      //     req.session['journey_status'] = JourneyStatus?.data;
      //   }
      // }

      // req.session.isPACompleted = true;
      //FCA to TBD event update -- Force (End)

      //Journet Update
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/80`, 'Completed');
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/1`, 'Completed');
      res.redirect('/projects/create-or-choose');
    } else {
      res.redirect('/dashboard');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'FCA Next Step - Tenders Service Api cannot be connected',
      true
    );
  }
};
