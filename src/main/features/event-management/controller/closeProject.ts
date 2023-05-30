//@ts-nocheck
import * as express from 'express';
import { LoggTracer } from '@common/logtracer/tracer';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';
import * as dataDsp from '../../../resources/content/event-management/steps-to-continue.json';
import * as dataMcf3 from '../../../resources/content/event-management/steps-to-continue-mcf3.json';
import * as dataDos6 from '../../../resources/content/event-management/steps-to-continue-dos6.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';

/**
 *
 * @Rediect
 * @param req
 * @param res
 */
export const CLOSE_PROJECT = async (req: express.Request, res: express.Response) => {
  const { agreementLotName, agreementName, agreement_id, releatedContent, project_name, projectId } = req.session;
  const { SESSION_ID, state } = req.cookies;
  const { procid, eventId } = req.query;
  req.session.closeProject = false;
  try {
    const baseURL = `tenders/projects/${procid}/close`;
    const body = {
      terminationType: 'cancelled',
    };
    const response = await TenderApi.Instance(SESSION_ID).put(baseURL, body);
    if (response.data == 'OK') {
      req.session.closeProject = true;
      res.json({ closeStatus: true });
    } else {
      res.json({ closeStatus: false });
    }
  } catch (err) {
    console.log('error in close project', err);
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management page',
      true
    );
  }
};

export async function terminateEventClose(req: express.Request, res: express.Response) {
  try {
    const { SESSION_ID } = req.cookies;
    const { eventId, projectId, procurements } = req.session;
    const baseURL = `tenders/projects/${projectId}/events/${eventId}/termination`;
    const body = {
      terminationType: 'cancelled',
    };
    await TenderApi.Instance(SESSION_ID).put(baseURL, body);
  } catch (error) {}
}
