//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/requirements/nameYourProject.json';
import procurementDetail from '../model/procurementDetail';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { HttpStatusCode } from '../../../errors/httpStatusCodes';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const DA_GET_NAME_PROJECT = async (req: express.Request, res: express.Response) => {
  const { isEmptyProjectError } = req.session;
  const { choosenViewPath } = req.session;
  req.session['isEmptyProjectError'] = false;
  const procurements = req.session.procurements;
  const lotId = req.session.lotId;
  const procurement: procurementDetail = procurements.find((proc: any) => proc.defaultName.components.lotId === lotId);
  const project_name = req.session.project_name;
  const agreementLotName = req.session.agreementLotName;
  const releatedContent = req.session.releatedContent;
  const viewData: any = {
    data: cmsData,
    procId: procurement.procurementID,
    projectLongName: project_name,
    lotId,
    agreementLotName,
    error: isEmptyProjectError,
    releatedContent: releatedContent,
    choosenViewPath: choosenViewPath,
  };
  res.render('da-nameAProject', viewData);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const DA_POST_NAME_PROJECT = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { procid } = req.query;
  const { projectId,eventId } = req.session;
  const name = req.body['rfi_projLongName'];
  const nameUpdateUrl = `tenders/projects/${procid}/name`;
  try {
    if (name) {
      const _body = {
        name: name,
      };
      const response = await TenderApi.Instance(SESSION_ID).put(nameUpdateUrl, _body);
      if (response.status == HttpStatusCode.OK) req.session.project_name = name;
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/60`, 'Completed');
      res.redirect('/da/procurement-lead');
    } else {
      req.session['isEmptyProjectError'] = true;
      res.redirect('/da/name-your-project');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tender Api - getting users from organization or from tenders failed',
      true,
    );
  }
};
