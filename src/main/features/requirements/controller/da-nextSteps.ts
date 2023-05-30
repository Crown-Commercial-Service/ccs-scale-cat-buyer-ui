//@ts-nocheck
import * as express from 'express';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';
import * as daNextData from '../../../resources/content/requirements/daNextSteps.json';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import * as journyData from '../../procurement/model/tasklist.json';
import { GetLotSuppliers } from '../../shared/supplierService';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const DA_GET_NEXTSTEPS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { choosenViewPath } = req.session;
  const { lotId, agreementLotName, agreementName, eventId, projectId, agreement_id, releatedContent, project_name } =
    req.session;
  const lotid = req.session?.lotId;
  const agreementId_session = agreement_id;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotid,
    error: isJaggaerError,
  };
  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/58`, 'Not started');
    const windowAppendData = {
      data: daNextData,
      projectLongName: project_name,
      lotId,
      agreementLotName,
      releatedContent: releatedContent,
      error: isJaggaerError,
      choosenViewPath: choosenViewPath,
    };
    res.render('da-nextSteps', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Get failed - DA next steps page',
      true
    );
  }
};

export const DA_POST_NEXTSTEPS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eventId, projectId } = req.session;
  const { choosenViewPath } = req.session;

  try {
    const filtered_body_content_removed_fc_key = ObjectModifiers._deleteKeyofEntryinObject(
      req.body,
      'choose_fc_da_next_steps'
    );
    const { da_next_steps } = filtered_body_content_removed_fc_key;

    if (da_next_steps) {
      switch (da_next_steps) {
      case 'yes': {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/58`, 'Completed');
        const publishUrl = `/tenders/projects/${req.session.projectId}/events/${eventId}/publish`;
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 1);
        const _bodyData = {
          endDate: endDate,
        };
        await TenderApi.Instance(SESSION_ID).put(publishUrl, _bodyData);

        const baseUrl = `/tenders/projects/${req.session.projectId}/events`;
        const body = {
          name: 'Procurement Assessment',
          eventType: 'PA',
        };
        const { data } = await TenderApi.Instance(SESSION_ID).post(baseUrl, body);
        if (data != null && data != undefined) {
          req.session['eventId'] = data.id;
          const { procurements } = req.session;
          //req.session.procurements.push({'eventId':data.id,'eventType':data.eventType});
          // req.session.procurements[0]['eventType'] = data.eventType;
          //req.session.procurements[0]['started'] = false;
          const currentProcNumber = procurements.findIndex(
            (proc: any) => proc.eventId === eventId && proc.procurementID === projectId
          );
          const proc: Procurement = {
            procurementID: projectId,
            eventId: data.id,
            defaultName: {
              name: procurements[currentProcNumber].defaultName.name,
              components: {
                agreementId: procurements[currentProcNumber].defaultName.components.agreementId,
                lotId: procurements[currentProcNumber].defaultName.components.lotId,
                org: 'COGNIZANT BUSINESS SERVICES UK LIMITED',
              },
            },
            started: true,
          };
          procurements.push(proc);
          req.session.procurements = procurements;

          try {
            const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`/journeys/${req.session.eventId}/steps`);
            req.session['journey_status'] = JourneyStatus?.data;
          } catch (journeyError) {
            const _body = {
              'journey-id': data.id,
              states: journyData.states,
            };
            if (journeyError.response.status == 404) {
              await TenderApi.Instance(SESSION_ID).post('journeys', _body);
              const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`journeys/${data.id}/steps`);
              req.session['journey_status'] = JourneyStatus?.data;
            }
          }

          const eventTypeURL = `tenders/projects/${projectId}/events`;
          const eventTypesURL = `tenders/projects/${projectId}/event-types`;
          const baseURL = `tenders/projects/${projectId}/events/${data.id}`;
          req.session.selectedRoute = 'FC';
          const eventType = req.session.selectedRoute;
          const _body = {
            eventType: 'DA',
          };

          let getEventType = await TenderApi.Instance(SESSION_ID).get(eventTypeURL);
          const { data: eventTypes } = await TenderApi.Instance(SESSION_ID).get(eventTypesURL);
          req.session.havePA = eventTypes.some((event) => event.type === 'PA');
          // getEventType = getEventType.data[0].eventType;
          getEventType = getEventType.data.filter((d) => d.id == data.id)[0].eventType;
          if (getEventType === 'TBD') {
            const { data } = await TenderApi.Instance(SESSION_ID).put(baseURL, _body);
            req.session.currentEvent = data;
            const currentProcNum = procurements.findIndex(
              (proc: any) => proc.eventId === data.id && proc.procurementID === projectId
            );
            req.session.procurements[currentProcNum].started = true;
          }
          //uncomment to save supplier
          const supplierBaseURL: any = `/tenders/projects/${projectId}/events/${eventId}/suppliers`;
          const SUPPLIERS = await DynamicFrameworkInstance.Instance(SESSION_ID).get(supplierBaseURL);
          const SUPPLIER_DATA = SUPPLIERS?.data; //saved suppliers

          let supplierList = [];
          supplierList = await GetLotSuppliers(req);

          const supplierDataToSave = [];
          for (let i = 0; i < SUPPLIER_DATA.suppliers.length; i++) {
            const supplierInfo = supplierList.filter((s) => s.organization.id == SUPPLIER_DATA.suppliers[i].id)?.[0];
            if (supplierInfo != undefined) {
              supplierDataToSave.push({ name: supplierInfo.organization.name, id: SUPPLIER_DATA.suppliers[i].id });
            }
          }
          const supplierBody = {
            suppliers: supplierDataToSave,
            justification: SUPPLIER_DATA.justification,
            overwriteSuppliers: true,
          };
          const Supplier_BASEURL = `/tenders/projects/${projectId}/events/${data.id}/suppliers`;

          const response = await TenderApi.Instance(SESSION_ID).post(Supplier_BASEURL, supplierBody);
          req.session.selectedeventtype = 'DA';
          res.redirect('/rfp/task-list');
        } else {
          res.redirect('/404');
        }
        break;
      }
      case 'edit':
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/58`, 'Not started');
        req.session['DA_nextsteps_edit'] = true;
        res.redirect(REQUIREMENT_PATHS.DA_REQUIREMENT_TASK_LIST + '?path=' + choosenViewPath);
        break;

      case 'no': {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/72`, 'Completed');
        const baseURL = `tenders/projects/${projectId}/events/${eventId}/termination`;
        const _body = {
          terminationType: 'cancelled',
        };
        const response = await TenderApi.Instance(SESSION_ID).put(baseURL, _body);
        if (response.status == 200) {
          const { procurements } = req.session;
          if (procurements.length == 1) {
            const baseUrl = `/tenders/projects/${req.session.projectId}/events`;
            const body = {
              eventType: 'TBD',
            };
            const { data } = await TenderApi.Instance(SESSION_ID).post(baseUrl, body);
          }
          res.redirect(REQUIREMENT_PATHS.DA_GET_CANCEL);
        } else {
          res.redirect('/404');
        }

        break;
      }
      default:
        res.redirect('/404');
      }
    } else {
      req.session['isJaggaerError'] = true;
      res.redirect(REQUIREMENT_PATHS.DA_GET_NEXTSTEPS);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Post failed - DA next steps page',
      true
    );
  }
};
