//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/requirements/nameYourProject.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/requirements/nameYourProject.json';
import procurementDetail from '../model/procurementDetail';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { HttpStatusCode } from '../../../errors/httpStatusCodes';
import { logConstant } from '../../../common/logtracer/logConstant';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const RFP_GET_NAME_PROJECT = async (req: express.Request, res: express.Response) => {
  const { isEmptyProjectError } = req.session;
  const { notValid } = req.session;
  const { notValidText } = req.session;
  req.session['isEmptyProjectError'] = false;
  req.session['notValid'] = false;
  req.session['notValidText'] = '';
  const procurements = req.session.procurements;
  const lotId = req.session.lotId;
  const procurement: procurementDetail = procurements.find((proc: any) => proc.defaultName.components.lotId === lotId);
  const project_name = req.session.project_name;
  const projectId = req.session.projectId;
  const agreementLotName = req.session.agreementLotName;
  const releatedContent = req.session.releatedContent;
  const agreementId_session = req.session.agreement_id;
    let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    } else { 
      forceChangeDataJson = cmsData;
    }
  const viewData: any = {
    agreementId_session,
    data: forceChangeDataJson,
    procId: procurement.procurementID,
    projectLongName: project_name,
    projectId,
    lotId,
    agreementLotName,
    error: isEmptyProjectError,
    notValid: notValid,
    notValidText: notValidText,
    releatedContent: releatedContent,
  };
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.rfiNameAProjectLog, req);
    res.render('nameAProject-rfp', viewData);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const RFP_POST_NAME_PROJECT = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { procid } = req.query;
  const { projectId ,eventId} = req.session;
  const name = req.body['rfi_projLongName'];
  const nameUpdateUrl = `tenders/projects/${procid}/name`;
  const eventUpdateUrl = `/tenders/projects/${procid}/events/${eventId}`;
  const agreementId_session = req.session.agreement_id;
  try {
    if (name) {
      var str = new String(req.body['rfi_projLongName']);
      if(str.length>250){
        req.session['notValid'] = true;
        req.session['notValidText'] = 'Project length should be below 190 characters.';
        res.redirect('/rfp/name-your-project');
      }else{
      const _body = {
        name: name,
      };
      const response = await TenderApi.Instance(SESSION_ID).put(nameUpdateUrl, _body);
      //CAS-INFO-LOG
      console.log("********** Before post name")
      LoggTracer.infoLogger(response, logConstant.rfiNameAProjectUpdated, req);

    //  const response2 = await TenderApi.Instance(SESSION_ID).put(eventUpdateUrl, _body);
      if (response.status == HttpStatusCode.OK) req.session.project_name = name;
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/27`, 'Completed');
      res.redirect('/rfp/procurement-lead');
      }
    } else {
      req.session['isEmptyProjectError'] = true;
      res.redirect('/rfp/name-your-project');
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
