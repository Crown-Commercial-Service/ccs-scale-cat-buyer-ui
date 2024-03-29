//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as CMSData from '../../../resources/content/requirements/caSuppliersToForward.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { GetLotSuppliers } from '../../shared/supplierService';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';

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
    choosenViewPath: choosenViewPath,
  };
  try {
    let supplierList = [];

    //GET TOTAL SUPPLIERS LIST
    supplierList = await GetLotSuppliers(req);
    req.session.totalsuppliers = supplierList.length;
    const eventResponse = await TenderApi.Instance(SESSION_ID).get(`/tenders/projects/${projectId}/events/${eventId}`);
    const windowAppendData = {
      data: CMSData,
      eventSupplierCount: eventResponse?.data.nonOCDS.assessmentSupplierTarget ?? 0,
      SuppliersMax: supplierList.length - 1,
      choosenViewPath,
      releatedContent,
    };
    const flag = await ShouldEventStatusBeUpdated(eventId, 53, req);
    if (flag) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/53`, 'In progress');
    }
    res.render('ca-suppliersToForward', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Get failed - CA Suppleirs to forward page',
      true
    );
  }
};

export const CA_POST_SUPPLIERS_FORWARD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId, currentEvent } = req.session;
  const { ca_supplier_count } = req.body;
  const { assessmentId } = currentEvent;
  if (ca_supplier_count < 3 || ca_supplier_count > req.session.totalsuppliers - 1) {
    res.redirect(REQUIREMENT_PATHS.CA_GET_SUPPLIERS_FORWARD);
    return;
  }

  try {
    const body = {
      assessmentSupplierTarget: ca_supplier_count,
      assessmentId: assessmentId,
    };
    const response = await TenderApi.Instance(SESSION_ID).put(`tenders/projects/${projectId}/events/${eventId}`, body);
    if (response.status == 200) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/53`, 'Completed');
      const flag = await ShouldEventStatusBeUpdated(eventId, 54, req);
      if (flag) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/54`, 'Not started');
      }
      if (req.session['CA_nextsteps_edit']) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/54`, 'Not started');
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/55`, 'Cannot start yet');
      }
      res.redirect(REQUIREMENT_PATHS.CA_GET_REVIEW_RANKED_SUPPLIERS);
    } else {
      res.redirect('/404/');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Post failed - CA suppliers to forward  page',
      true
    );
  }
};
