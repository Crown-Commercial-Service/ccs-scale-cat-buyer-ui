//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/eoiTaskList.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/eoi/eoiTaskList.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
import { logConstant } from '../../../common/logtracer/logConstant';

// eoi TaskList
/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const GET_TASKLIST = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { lotId, agreementLotName, eventId, projectId, agreement_id } = req.session;
  let forceChangeDataJson;
  const agreementId_session = req.session.agreement_id;
  if (agreementId_session == 'RM6187') {
    //MCF3
    forceChangeDataJson = Mcf3cmsData;
  } else {
    forceChangeDataJson = cmsData;
  }

  const releatedContent = req.session.releatedContent;
  const windowAppendData = { data: forceChangeDataJson, lotId, agreementLotName, releatedContent, agreementId_session };

  try {
    const flag = await ShouldEventStatusBeUpdated(eventId, 16, req);
    if (flag) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/16`, 'Not started');
    }

    const { data: journeyStepsNameJourney } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);

    const nameJourneysts = journeyStepsNameJourney.filter((el: any) => {
      if (el.step == 16 && el.state == 'Completed') return true;
      return false;
    });

    const timelineStatus = journeyStepsNameJourney.filter((el: any) => {
      if (el.step == 23 && el.state == 'Completed') return true;
      return false;
    });

    if (req.session?.endDate == undefined || req.session?.endDate == null) {
      if (timelineStatus[0]?.state == 'Completed') {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/23`, 'Not started');
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/24`, 'Cannot start yet');
      }
    }

    if (nameJourneysts.length > 0) {
      const addcontsts = journeyStepsNameJourney.filter((el: any) => {
        if (el.step == 19) return true;
        return false;
      });

      if (addcontsts[0].state == 'Cannot start yet') {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/19`, 'Not started');
      }
    } else {
      const flagaddCont = await ShouldEventStatusBeUpdated(eventId, 19, req);
      if (flagaddCont) await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/19`, 'Cannot start yet');
    }

    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    if (agreementId_session == 'RM6187') {
      statusStepsDataFilter(Mcf3cmsData, journeySteps, 'eoi', agreement_id, projectId, eventId);
    } else {
      statusStepsDataFilter(cmsData, journeySteps, 'eoi', agreement_id, projectId, eventId);
    }

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.eoiTaskListPageLog, req);

    res.render('TasklistEoi', windowAppendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Put failed - EOI task list page',
      true
    );
  }
};
