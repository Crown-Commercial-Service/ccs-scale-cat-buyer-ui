//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/nameYourProject.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/eoi/nameYourProject.json';
import procurementDetail from '../model/procurementDetail';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
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
export const GET_NAME_PROJECT = async (req: express.Request, res: express.Response) => {
  const { isEmptyProjectError,isErrorText } = req.session;
  req.session['isEmptyProjectError'] = false;
  req.session['isErrorText'] = false;
  const procurements = req.session.procurements;
  const lotId = req.session.lotId;
  const procurement: procurementDetail = procurements.find((proc: any) => proc.defaultName.components.lotId === lotId);
  const project_name = req.session.project_name;
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
    data: forceChangeDataJson,
    procId: procurement.procurementID,
    projectLongName: project_name,
    lotId,
    agreementLotName,
    error: isEmptyProjectError,
    errorText:isErrorText,
    releatedContent: releatedContent,
    agreementId_session: agreementId_session,
  };

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.NameAProjectLog, req);

  res.render('nameAProjectEoi', viewData);
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const POST_NAME_PROJECT = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { procid } = req.query;
  const name = req.body['eoi_projLongName'];
  const { eventId } = req.session;
  const nameUpdateUrl = `tenders/projects/${procid}/name`;
  const eventUpdateUrl = `/tenders/projects/${procid}/events/${eventId}`;
  try {
    if (name) {
      if(name.length <= 250){
        const _body = {
          name: name,
        };
        const response = await TenderApi.Instance(SESSION_ID).put(nameUpdateUrl, _body);

        //CAS-INFO-LOG
        LoggTracer.infoLogger(response, logConstant.NameAProjectUpdated, req);
        
        const response2 = await TenderApi.Instance(SESSION_ID).put(eventUpdateUrl, _body);
        if (response.status == HttpStatusCode.OK) req.session.project_name = name;
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/16`, 'Completed');
        res.redirect('/eoi/procurement-lead');

      }else{
        req.session['isEmptyProjectError'] = true;
        req.session['isErrorText'] = 'You must be 250 characters or fewer';
        res.redirect('/eoi/name-your-project');
      }
      
    } else {
      req.session['isEmptyProjectError'] = true;
      req.session['isErrorText'] = 'Your project must have a name.';
      res.redirect('/eoi/name-your-project');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'EOI - Tender Api - getting users from organization or from tenders failed',
      true,
    );
  }
};
