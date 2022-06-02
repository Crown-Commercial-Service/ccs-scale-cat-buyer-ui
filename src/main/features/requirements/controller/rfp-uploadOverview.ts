//@ts-nocheck
import * as express from 'express';
import * as uploadData from '../../../resources/content/requirements/rfpUploadOverview.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';

/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const RFP_UPLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  const releatedContent = req.session.releatedContent;
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const { isJaggaerError } = req.session;
  let { selectedRoute } = req.session;//BALWINDER
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
  const appendData = { data: uploadData, releatedContent, error: isJaggaerError };
  try {
    let flag=await ShouldEventStatusBeUpdated(projectId,30,req);
    if(flag)
    {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/30`, 'In progress');
    }
    //37 changes to 30 BALWINDER 
    res.render('rfp-uploadOverview', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - RFP upload overview Page',
      true,
    );
  }
};
