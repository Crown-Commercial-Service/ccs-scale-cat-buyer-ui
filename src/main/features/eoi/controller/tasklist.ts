//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/eoiTaskList.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';

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
  try {
    const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
    statusStepsDataFilter(cmsData, journeySteps, 'eoi', agreement_id, projectId, eventId);
    const releatedContent = req.session.releatedContent;
    const windowAppendData = { data: cmsData, lotId, agreementLotName, releatedContent };
    res.render('TasklistEoi', windowAppendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Put failed - EOI task list page',
      true,
    );
  }
};
