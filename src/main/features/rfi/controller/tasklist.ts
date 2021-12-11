//@ts-nocheck
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/rfiTaskList.json';
import { statusStepsDataFilter } from '../../../utils/statusStepsDataFilter';
// RFI TaskList
/**
 *
 * @param req
 * @param res
 * @GETController
 */

export const GET_TASKLIST = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { lotId, agreementLotName, eventId } = req.session;
  const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
  statusStepsDataFilter(cmsData, journeySteps, 'rfi');
  const windowAppendData = { data: cmsData, lotId, agreementLotName };
  res.render('Tasklist', windowAppendData);
};
