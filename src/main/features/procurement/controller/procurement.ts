//@ts-nocheck
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { AgreementAPI } from './../../../common/util/fetch/agreementservice/agreementsApiInstance';
import * as express from 'express';
import * as dataDSP from '../../../resources/content/procurement/ccs-procurement.json';
import * as dataMCF3 from '../../../resources/content/procurement/mcf3_procurement.json';
import * as dataGCloud from '../../../resources/content/procurement/gcloud-procurement.json';
import * as dataGCloudLot4 from '../../../resources/content/procurement/gcloud-lot4-procurement.json';
import * as dataDOS from '../../../resources/content/procurement/mcf3Dos_procurement.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { Procurement } from '../model/project';
import { ccsStatusOverride } from '../../../utils/ccsStatusOverride';
import { logConstant } from '../../../common/logtracer/logConstant';

import * as journyData from '../model/tasklist.json';
import { Logger } from '@hmcts/nodejs-logging';
const logger = Logger.getLogger('procurement');

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
const journeyOverwrite = async (SESSION_ID, eventId) => {
  try {
    const output = await TenderApi.Instance(SESSION_ID)
      .get(`/journeys/${eventId}/steps`)
      .then((JourneyStatus) => {
        return JourneyStatus?.data;
      });
    return output;
  } catch (err) {
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Procurement - Tenders Service Api cannot be connected',
      true
    );
  }
};
export const PROCUREMENT = async (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, agreementName, stepstocontinueDAA, showPreMarket, showWritePublish } = req.session;
  const { SESSION_ID } = req.cookies;
  const agreementId_session = req.session.agreement_id;

  const lotsURL = '/tenders/projects/agreements';
  const eventTypesURL = `/agreements/${agreementId_session}/lots/${lotId}/event-types`;
  let forceChangeDataJson;
  if (agreementId_session == 'RM6187') {
    //MCF3
    forceChangeDataJson = dataMCF3;
  } else if (agreementId_session == 'RM6263') {
    //DSP
    forceChangeDataJson = dataDSP;
  } else if (agreementId_session == 'RM1043.8') {
    //DOS
    forceChangeDataJson = dataDOS;
  } else if (agreementId_session == 'RM1557.13') {
    //G-cloud 13
    if (lotId == 'All') {
      forceChangeDataJson = dataGCloud;
    } else {
      forceChangeDataJson = dataGCloudLot4;
    }
  } else {
    //DSP
    forceChangeDataJson = dataDSP;
  }
  const data = forceChangeDataJson;
  let appendData: any = { ...data, SESSION_ID };
  try {
    let types;
    if (agreementId_session == 'RM1557.13' && lotId == 'All') {
      types = '';
    } else {
      const typesRaw = await AgreementAPI.Instance(null).get(eventTypesURL);

      //CAS-INFO-LOG
      LoggTracer.infoLogger(typesRaw, logConstant.evenTypeFromAggrementLot, req);
      const typeRawData = typesRaw.data;
      types = typeRawData.map((typeRaw: any) => typeRaw.type);
    }
    appendData = { types, lotId, ...appendData };
    const elementCached = req.session.procurements.find((proc: any) => proc.defaultName.components.lotId === lotId);

    let procurement: Procurement;
    if (!elementCached) {
      const _body = {
        agreementId: agreementId_session,
        lotId: agreementId_session == 'RM1557.13' && lotId == 'All' ? 'All' : lotId,
      };
      const procurementRaw = await TenderApi.Instance(SESSION_ID).post(lotsURL, _body);
      //CAS-INFO-LOG
      LoggTracer.infoLogger(procurementRaw, logConstant.procurementCreated, req);

      procurement = procurementRaw.data;
      req.session.procurements.push(procurement);
      req.session.project_name = procurement['defaultName']['name'];
    } else {
      procurement = elementCached;
    }

    logger.info('procurement.created', procurement);
    req.session.lotId = procurement['defaultName']['components']['lotId'];
    req.session.projectId = procurement['procurementID'];
    req.session.eventId = procurement['eventId'];
    req.session.types = types;
    req.session.agreementLotName = agreementLotName;
    const agreementName = req.session.agreementName;
    if (req.session['isRFIComplete'] || req.session.fromStepsToContinue != null) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${req.session.eventId}/steps/2`, 'Optional');
      await TenderApi.Instance(SESSION_ID).put(`journeys/${req.session.eventId}/steps/3`, 'Not started');
    }
    try {
      const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`/journeys/${req.session.eventId}/steps`);
      req.session['journey_status'] = JourneyStatus?.data;
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
    if (agreementId_session == 'RM1557.13' && lotId == 'All') {
      //G-cloud 13
      await ccsStatusOverride(appendData, SESSION_ID, agreementId_session, req.session.eventId);
    } else {
      const { data: getEventsData } = await TenderApi.Instance(SESSION_ID).get(
        `tenders/projects/${req.session.projectId}/events`
      );
      data.events.forEach(async (event) => {
        if (event.eventno == 1) {
          const lot = lotId.length > 2 ? lotId.split(' ')[1] : 1;
          event.href =
            'https://www.crowncommercial.gov.uk/agreements/' + agreementId_session + ':' + lot + '/lot-suppliers';
        }
        const step = req.session['journey_status']
          ? req.session['journey_status'].find((item) => item.step === event.eventno)
          : journyData.states.find((item) => item.step === event.eventno);
        if (step) {
          if (step.state === 'Not started') {
            event.status = 'TO DO';
          } else if (step.state === 'Completed') {
            event.status = 'DONE';
          } else {
            event.status = step.state;
          }
        }

        if (step.step == 2) {
          if (agreementId_session == 'RM1043.8') {
            //DOS
            event.status = '';
          }

          if (
            req.session['journey_status'][2].state == 'In progress' ||
            req.session['journey_status'][1].state == 'Completed'
          ) {
            event.buttonDisable = true;
          } else if (req.session.selectedRoute == 'PA' && req.session['journey_status'][0].state != 'Completed') {
            event.buttonDisable = true;
          } else {
            event.buttonDisable = false;
          }
        }

        if (step.step == 3) {
          if (req.session['journey_status'][1].state == 'In progress') {
            event.buttonDisable = true;
          } else if (req.session.selectedRoute == 'PA' && req.session['journey_status'][0].state != 'Completed') {
            event.buttonDisable = true;
          } else {
            event.buttonDisable = false;
          }
        }
      });

      //24-08-2022
      if (agreementId_session == 'RM6187') {
        //MCF3
        const objIndexEventOne = appendData.events.findIndex((obj) => obj.eventno === 1);
        const overWritePaJoury = getEventsData.find(
          (item) => item.eventType == 'PA' && (item.dashboardStatus == 'CLOSED' || item.dashboardStatus == 'COMPLETE')
        );
        if (overWritePaJoury) {
          const journeyOverwriteFetch = await journeyOverwrite(SESSION_ID, overWritePaJoury.id);
          if (journeyOverwriteFetch) {
            const step_1 = journeyOverwriteFetch.find((el) => el.step == 1);
            if (step_1) {
              let OverWriteStep1;
              if (step_1.state === 'Not started') {
                OverWriteStep1 = 'TO DO';
              } else if (step_1.state === 'Completed') {
                OverWriteStep1 = 'DONE';
              } else {
                OverWriteStep1 = step_1.state;
              }
              appendData.events[objIndexEventOne].status = OverWriteStep1;
            }
          }
        }
      }

      if (agreementId_session == 'RM1043.8' || (agreementId_session == 'RM1557.13' && lotId == '4')) {
        req.session.caSelectedRoute = 'FC';
        req.session.selectedRoute = 'FC';
      }
      //BALWINDER 17-06-2022
      const objIndex = appendData.events.findIndex((obj) => obj.eventno === 3);
      if (
        (req.session.selectedRoute !== undefined && req.session.selectedRoute !== null) ||
        (req.session.choosenViewPath !== undefined && req.session.choosenViewPath !== null)
      ) {
        let path;
        if (req.session.selectedRoute === 'FCA') {
          path = 'ca';
        } else if (req.session.selectedRoute === 'DAA') {
          path = 'da';
        }
        //const objIndex = appendData.events.findIndex(obj => obj.eventno === 3);
        //ADDED CONDATION FOR  choosenViewPath ===NULL
        if (path == undefined || req.session.choosenViewPath === null) {
          if (agreementId_session == 'RM1043.8' || (agreementId_session == 'RM1557.13' && lotId == '4')) {
            appendData.events[objIndex].href = '/rfp/task-list';
          } else {
            appendData.events[objIndex].href = '/requirements/choose-route';
          }
        } else {
          appendData.events[objIndex].href = `/${path}/task-list?path=${req.session.choosenViewPath}`;
        }
      } else if (appendData.events[objIndex].href !== '/requirements/choose-route') {
        //BALWINDER IF CONDATION IS NOT TRUE THEN WE SET HREF VALUE REPLACE TO AS A CHOOSE-ROUTE
        appendData.events[objIndex].href = '/requirements/choose-route';
      } else if (
        agreementId_session == 'RM1043.8' ||
        (agreementId_session == 'RM1557.13' && lotId == '4' && appendData.events[objIndex].href !== '/rfp/task-list')
      ) {
        //BALWINDER IF CONDATION IS NOT TRUE THEN WE SET HREF VALUE REPLACE TO AS A CHOOSE-ROUTE
        appendData.events[objIndex].href = '/requirements/choose-route';
      }
    }

    const lotid = req.session?.lotId;
    const project_name = req.session.project_name;
    const projectId = req.session.projectId;
    const releatedContent = req.session.releatedContent;

    res.locals.agreement_header = {
      agreementName,
      project_name,
      projectId,
      agreementId_session,
      agreementLotName,
      lotid,
    };
    let ScrollTo = '';
    if (showPreMarket == true) {
      ScrollTo = 'Premarket';
    }
    if (showWritePublish == true) {
      ScrollTo = 'WritePublish';
    }

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.procurementPage, req);

    appendData = {
      ...appendData,
      agreementName,
      releatedContent,
      agreementId_session,
      lotid,
      stepstocontinueDAA,
      ScrollTo,
    };
    if (agreementId_session == 'RM1557.13' && lotId == '4') {
      res.render('gcloud_lot4-procurement', appendData);
    } else {
      res.render('procurement', appendData);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Procurement - Tender agreement failed to be added',
      true
    );
  }
};
