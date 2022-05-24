//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as CMSData from '../../../resources/content/requirements/caSuppliersToForward.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const CA_GET_SUPPLIERS_FORWARD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const {
    lotId,
    agreementLotName,
    agreementName,
    choosenViewPath,
    eventId,
    projectId,
    agreement_id,
    releatedContent,
    project_name,
  } = req.session;
  const agreementId_session = agreement_id;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotId,
    error: isJaggaerError,
    choosenViewPath: req.session['choosenViewPath']
  };
  try {
    const eventResponse = await TenderApi.Instance(SESSION_ID).get(`/tenders/projects/${projectId}/events/${eventId}`);
    const windowAppendData = {
      data: CMSData,
      eventSupplierCount: eventResponse?.data.nonOCDS.assessmentSupplierTarget ?? 0,
      choosenViewPath,
      releatedContent,
    };
    res.render(`ca-suppliersToForward`, windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Get failed - CA Suppleirs to forward page',
      true,
    );
  }
};

export const CA_POST_SUPPLIERS_FORWARD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId, currentEvent } = req.session;
  const { ca_supplier_count } = req.body;
  if (ca_supplier_count < 0) {
    res.redirect(REQUIREMENT_PATHS.CA_GET_SUPPLIERS_FORWARD);
    return;
  }
  await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/53`, 'Completed');
  await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Not started');
  try {
    const body = {
      assessmentSupplierTarget: ca_supplier_count,
      assessmentId: currentEvent.assessmentId,
    };
    await TenderApi.Instance(SESSION_ID).put(`tenders/projects/${projectId}/events/${eventId}`, body);
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/49`, 'Not started'); // status Id not yet defined
    res.redirect('/ca/review-ranked-suppliers');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Post failed - CA suppliers to forward  page',
      true,
    );
  }
};
