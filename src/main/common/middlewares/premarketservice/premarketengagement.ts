//@ts-nocheck
import { TokenDecoder } from './../../tokendecoder/tokendecoder';
import * as express from 'express';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../logtracer/tracer';
import { Logger } from '@hmcts/nodejs-logging';
const logger = Logger.getLogger('PreMarketEngagementMiddleware');
import * as journyData from './../../../features/procurement/model/tasklist.json';
import { logConstant } from '../../../common/logtracer/logConstant';

/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */
export class PreMarketEngagementMiddleware {
  static PutPremarket = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { eventId, projectId, procurements, agreement_id } = req.session;
    const { SESSION_ID } = req.cookies;
    const stage2BaseUrl = `/tenders/projects/${projectId}/events`;
    const stage2_dynamic_api = await TenderApi.Instance(SESSION_ID).get(stage2BaseUrl);
    const stage2_dynamic_api_data = stage2_dynamic_api.data;
    const stage2_data = stage2_dynamic_api_data?.filter(
      (anItem: any) => anItem.id == eventId && (anItem.templateGroupId == '13' || anItem.templateGroupId == '14')
    );
    let stage2_value = 'Stage 1';
    if (stage2_data.length > 0) {
      stage2_value = 'Stage 2';
    }
    req.session.stage2_value = stage2_value;
    if (agreement_id == 'RM1043.8') {
      const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
      const nameJourneytempstatus = journeySteps.filter((el: any) => {
        if (el.step == 86) return true;
        return false;
      });
      try {
        if (nameJourneytempstatus.length == 0) {
          journeySteps.push({ step: 86, state: 'Not started' });
          const JourneyVal = journeySteps;
          const _body = {
            'journey-id': eventId,
            states: JourneyVal,
          };
          const result = await TenderApi.Instance(SESSION_ID).put('journeys', _body);
        }
      } catch (err) {
        console.log('Error in 86 journey', err);
      }
    }

    if (req.session['isRFIComplete']) {
      const { SESSION_ID, state } = req.cookies;
      const BaseURL = `/tenders/projects/${req.session.projectId}/events`;
      const body_ = {
        nonOCDS: {
          eventType: req.session.selectedRoute,
        },
      };
      let newEvent = false;
      let newEventId = false;
      try {
        const newEventRaw = await TenderApi.Instance(SESSION_ID).post(BaseURL, body_);
        const newEventData = newEventRaw.data;

        //CAS-INFO-LOG
        LoggTracer.infoLogger(newEventRaw, logConstant.postSaveEventsToProject, req);

        if (newEventData != null && newEventData != undefined) {
          newEvent = true;
          newEventId = newEventData.id;
          req.session.eventId = newEventData.id;
          req.session['eventId'] = newEventData.id;
          req.session.procurements[0]['eventId'] = newEventData.id;
          req.session.procurements[0]['eventType'] = newEventData.eventType;
          req.session.procurements[0]['started'] = true;
          req.session.currentEvent = newEventData;
          req.session.selectedeventtype = newEventData.eventType;

          const currentProcNum = procurements.findIndex(
            (proc: any) => proc.eventId === newEventData.id && proc.procurementID === projectId
          );
          req.session.procurements[currentProcNum].started = true;
        }
      } catch (error) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          state,
          TokenDecoder.decoder(SESSION_ID),
          'Pre market engagement Service Api cannot be connected',
          true
        );
      }

      try {
        if (newEvent && newEventId) {
          const _body = {
            'journey-id': newEventId,
            states: journyData.states,
          };
          await TenderApi.Instance(SESSION_ID).post('journeys', _body);
          const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`journeys/${req.session.eventId}/steps`);
          req.session['journey_status'] = JourneyStatus?.data;
        } else {
          const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`/journeys/${req.session.eventId}/steps`);
          req.session['journey_status'] = JourneyStatus?.data;
        }
      } catch (journeyError) {
        const _body = {
          'journey-id': req.session.eventId,
          states: journyData.states,
        };
        if (journeyError.response.status == 404) {
          await TenderApi.Instance(SESSION_ID).post('journeys', _body);
          const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`journeys/${req.session.eventId}/steps`);
          req.session['journey_status'] = JourneyStatus?.data;
        }
      }
      req.session['isRFIComplete'] = false;
      if (req.session.showPreMarket || req.session.showWritePublish || req.session.fromStepsToContinue) {
        req.session.showPreMarket = null;
        req.session.showWritePublish = null;
        req.session.fromStepsToContinue = null;
      }
      next();
    } else {
      if (agreement_id == 'RM6187') {
        //MCF3
        const { data: getEventsData } = await TenderApi.Instance(req.cookies.SESSION_ID).get(
          `tenders/projects/${projectId}/events`
        );
        const { data: journeySteps } = await TenderApi.Instance(req.cookies.SESSION_ID).get(
          `journeys/${eventId}/steps`
        );
        const overWritePaJoury = getEventsData.find(
          (item) => item.eventType == 'PA' && item.dashboardStatus == 'ASSESSMENT'
        );
        if (overWritePaJoury) {
          const bottomLinkChange = journeySteps.filter((el: any) => {
            if (el.step == 1 || el.step == 80) {
              if (el.state == 'Completed') {
                return true;
              }
            }
            return false;
          });
          if (bottomLinkChange.length > 0) {
            if (req.session.selectedRoute != 'PA') {
              const currentProcIndex = req.session.procurements.findIndex(
                (proc: any) => proc.eventId === eventId && proc.procurementID === projectId
              );
              req.session.procurements[currentProcIndex].started = false;
            }
          }
        }
      }

      let isAlreadyStarted;
      if (agreement_id == 'RM1043.8' && req.session.dosStage == 'Stage 2') {
        //DOS
        isAlreadyStarted = procurements.some(
          (proc: any) => proc.eventId[0] === eventId && proc.procurementID[0] === projectId && proc.started[0]
        );
      } else {
        isAlreadyStarted = procurements.some(
          (proc: any) => proc.eventId === eventId && proc.procurementID === projectId && proc.started
        );
      }

      const currentEventForNextUse =
        req.session.selectedRoute === 'RFI' ? undefined : req.session.currentEventForNextUse;

      if (
        projectId &&
        eventId &&
        !isAlreadyStarted &&
        (currentEventForNextUse == undefined || currentEventForNextUse == null)
      ) {
        const { SESSION_ID, state } = req.cookies;
        const baseURL = `tenders/projects/${projectId}/events/${eventId}`;
        const eventTypeURL = `tenders/projects/${projectId}/events`;
        const eventTypesURL = `tenders/projects/${projectId}/event-types`;
        const eventType = req.session.selectedRoute;
        const _body = {
          eventType: eventType,
        };

        const nonOCDS_body = {
          nonOCDS: {
            eventType: eventType,
          },
        };

        try {
          let getEventType = await TenderApi.Instance(SESSION_ID).get(eventTypeURL);
          const { data: eventTypes } = await TenderApi.Instance(SESSION_ID).get(eventTypesURL);
          req.session.havePA = eventTypes.some((event) => event.type === 'PA');
          getEventType = getEventType.data.filter((x) => x.id == eventId)[0]?.eventType;
          if (getEventType === 'TBD') {
            //For DOS6 Stage - 1
            if (agreement_id == 'RM1043.8') {
              const { data: getEventsData } = await TenderApi.Instance(req.cookies.SESSION_ID).get(
                `tenders/projects/${projectId}/events`
              );
              const isStage_1 = getEventsData.some(
                (item) => item.eventType == 'FC' && item.dashboardStatus == 'EVALUATED'
              );
              if (isStage_1) {
                // Stage-2
                if (eventType === 'FC') {
                  const DOS6_FC = eventTypes.find((ev) => ev.type === 'FC');
                  const inner = DOS6_FC.templateGroups;
                  const outResult = inner.find((el) => el.inheritsFrom);
                  const templeateID = outResult.templateGroupId;
                  nonOCDS_body.nonOCDS.templateGroupId = templeateID;
                }
              } else {
                // Stage-1
                if (eventType === 'FC') {
                  const DOS6_FC = eventTypes.find((ev) => ev.type === 'FC');
                  const inner = DOS6_FC.templateGroups;
                  const outResult = inner.find((el) => !el.inheritsFrom);
                  const templeateID = outResult.templateGroupId;
                  _body.templateGroupId = templeateID;
                }
              }
            }

            const dataRaw = await TenderApi.Instance(SESSION_ID).put(baseURL, _body);
            const data = dataRaw.data;

            //CAS-INFO-LOG
            LoggTracer.infoLogger(dataRaw, logConstant.procurementCreated, req);

            req.session.currentEvent = data;

            if (eventType === 'FC') {
              req.session.currentEventForNextUse = null; //data;
            }
            const currentProcNum = procurements.findIndex(
              (proc: any) => proc.eventId === eventId && proc.procurementID === projectId
            );
            req.session.procurements[currentProcNum].started = true;
            next();
          } else if (
            getEventType === 'FCA' ||
            getEventType === 'PA' ||
            getEventType === 'DAA' ||
            getEventType === 'FC' ||
            getEventType === 'DA'
          ) {
            //For DOS6 Stage - 2
            if (agreement_id == 'RM1043.8') {
              const { data: getEventsData } = await TenderApi.Instance(req.cookies.SESSION_ID).get(
                `tenders/projects/${projectId}/events`
              );
              const isStage_1 = getEventsData.some(
                (item) => item.eventType == 'FC' && item.dashboardStatus == 'EVALUATED'
              );
              if (isStage_1) {
                // Stage-2
                if (eventType === 'FC') {
                  const DOS6_FC = eventTypes.find((ev) => ev.type === 'FC');
                  const inner = DOS6_FC.templateGroups;
                  const outResult = inner.find((el) => el.inheritsFrom);
                  const templeateID = outResult.templateGroupId;
                  nonOCDS_body.nonOCDS.templateGroupId = templeateID;
                }
              } else {
                // Stage-1
                if (eventType === 'FC') {
                  const DOS6_FC = eventTypes.find((ev) => ev.type === 'FC');
                  const inner = DOS6_FC.templateGroups;
                  const outResult = inner.find((el) => !el.inheritsFrom);
                  const templeateID = outResult.templateGroupId;
                  _body.templateGroupId = templeateID;
                }
              }
            }

            const dataRaw = await TenderApi.Instance(SESSION_ID).post(eventTypeURL, nonOCDS_body);
            const data = dataRaw.data;

            //CAS-INFO-LOG
            LoggTracer.infoLogger(dataRaw, logConstant.procurementCreated, req);

            req.session.currentEvent = data;
            const currentProcNum = procurements.findIndex(
              (proc: any) => proc.eventId === eventId && proc.procurementID === projectId
            );
            req.session.procurements[currentProcNum].started = true;

            if (agreement_id == 'RM6187') {
              //MCF3
              if (getEventType === 'PA') {
                req.session.procurements[currentProcNum].eventId = data.id;
                req.session.eventId = data.id;
                const PushAssessmentID = data.assessmentId;
                //Old & new joureny logic
                const { data: currentEventTrack } = await TenderApi.Instance(SESSION_ID).get(eventTypeURL);
                const overWritePaJoury = currentEventTrack.find(
                  (item) =>
                    item.eventType == 'PA' && (item.dashboardStatus == 'CLOSED' || item.dashboardStatus == 'COMPLETE')
                );
                let journyDataStates;
                if (overWritePaJoury) {
                  const PAEventId = overWritePaJoury.id;
                  const { data: journeyPlugFromPA } = await TenderApi.Instance(SESSION_ID).get(
                    `journeys/${PAEventId}/steps`
                  );
                  journyDataStates = journeyPlugFromPA;
                } else {
                  journyDataStates = journyData.states;
                }
                try {
                  const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`/journeys/${data.id}/steps`);
                  req.session['journey_status'] = JourneyStatus?.data;
                } catch (journeyError) {
                  const _body = {
                    'journey-id': data.id,
                    states: journyDataStates,
                  };
                  if (journeyError.response.status == 404) {
                    await TenderApi.Instance(SESSION_ID).post('journeys', _body);
                    const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`journeys/${data.id}/steps`);
                    req.session['journey_status'] = JourneyStatus?.data;
                  }
                }

                // if(eventType == 'FC' || eventType == 'DA') {
                //   if(overWritePaJoury)  {
                //     let PAAssessmentId = overWritePaJoury.assessmentId;
                //     if(PAAssessmentId != undefined) {
                //       const assessmentData = await TenderApi.Instance(SESSION_ID).get(`assessments/${PAAssessmentId}`);
                //       const PAAssessmentEToolId = assessmentData.data['external-tool-id'];
                //       const { data: AssessmentRequirementOld } = await TenderApi.Instance(SESSION_ID).get(`/assessments/${PAAssessmentId}?scores=true`);
                //       let assessmentDirectPush = AssessmentRequirementOld.dimensionRequirements;
                //       try {
                //         const dimension = await GET_DIMENSIONS_BY_ID(SESSION_ID, PAAssessmentEToolId);
                //         const scalabilityData = dimension.filter(data => data.name === 'Service Capability')[0];
                //         await TenderApi.Instance(SESSION_ID).put(
                //           `/assessments/${PushAssessmentID}/dimensions/${scalabilityData['dimension-id']}`,
                //           assessmentDirectPush[0],
                //         );
                //       } catch(err) {
                //       }
                //     }
                //   }
                // }

                //   req.session.isPACompleted = '';
              }
            }

            if (agreement_id == 'RM1043.8') {
              //DOS
              if (getEventType === 'FC') {
                req.session.procurements[currentProcNum].eventId = data.id;
                req.session.eventId = data.id;
                const PushAssessmentID = data.assessmentId;
                //Old & new joureny logic
                const { data: currentEventTrack } = await TenderApi.Instance(SESSION_ID).get(eventTypeURL);
                const overWriteFcJoury = currentEventTrack.find(
                  (item) =>
                    item.eventType == 'FC' && (item.dashboardStatus == 'CLOSED' || item.dashboardStatus == 'COMPLETE')
                );
                let journyDataStates;
                if (overWriteFcJoury) {
                  const FCEventId = overWriteFcJoury.id;
                  const { data: journeyPlugFromFC } = await TenderApi.Instance(SESSION_ID).get(
                    `journeys/${FCEventId}/steps`
                  );
                  journyDataStates = journeyPlugFromFC;
                } else {
                  journyDataStates = journyData.states;
                }
                try {
                  const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`/journeys/${data.id}/steps`);
                  req.session['journey_status'] = JourneyStatus?.data;
                } catch (journeyError) {
                  if (req.session.dosStage !== undefined) {
                    journyDataStates = await journeyOverwrite(journyDataStates);
                  }
                  const _body = {
                    'journey-id': data.id,
                    states: journyDataStates,
                  };
                  if (journeyError.response.status == 404) {
                    await TenderApi.Instance(SESSION_ID).post('journeys', _body);
                    const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`journeys/${data.id}/steps`);
                    req.session['journey_status'] = JourneyStatus?.data;
                    req.session.dosStage = '';
                  }
                }
              }
            }

            next();
          }
        } catch (err) {
          LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            state,
            TokenDecoder.decoder(SESSION_ID),
            'Pre market engagement Service Api cannot be connected',
            true
          );
        }
      } else {
        if (currentEventForNextUse != undefined) {
          req.session.currentEvent = req.session.currentEventForNextUse;
        }
        next();
      }
    }
  };
}

const GET_DIMENSIONS_BY_ID = async (sessionId: any, toolId: any) => {
  const baseUrl = `assessments/tools/${toolId}/dimensions`;
  const dimensionsApi = await TenderApi.Instance(sessionId).get(baseUrl);
  return dimensionsApi.data;
};

const journeyOverwrite = async (journyDataStates: any) => {
  for (let i = 0; i < journyDataStates.length; i++) {
    if (journyDataStates[i].step == 30) {
      journyDataStates[i].state = 'Not started';
    }
    if (journyDataStates[i].step > 30 && journyDataStates[i].step <= 41) {
      journyDataStates[i].state = 'Cannot start yet';
    }
  }
  return journyDataStates;
};
