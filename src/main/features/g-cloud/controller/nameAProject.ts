//@ts-nocheck
import * as express from 'express';
import procurementDetail from '../model/procurementDetail';
import * as cmsData from '../../../resources/content/gcloud/nameYourProject.json';
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
export const GET_NAME_PROJECT = async (req: express.Request, res: express.Response) => {  
  const { SESSION_ID } = req.cookies;
  try {
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
        const lotid =lotId;
        const agreementName = req.session.agreementName;
        const projectId = req.session.projectId;

        res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
      
        const viewData: any = {
          data: cmsData,
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
        res.render('nameAProjectGCloud',viewData);
      } catch (error) {
      
        LoggTracer.errorLogger( res, error, `${req.headers.host}${req.originalUrl}`, null,
          TokenDecoder.decoder(SESSION_ID), 'G-Cloud 13 throws error - Tenders Api is causing problem', true,
        );
    }    
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
  const name = req.body['gcloud_projLongName'];
  const { eventId } = req.session;
  const nameUpdateUrl = `tenders/projects/${procid}/name`;
  const agreementLotName = req.session.agreementLotName;
  const lotId = req.session.lotId;
  try {
    if (name) {
      if(name.length <= 250){
        const _body = {
          name: name,
        };
        const response = await TenderApi.Instance(SESSION_ID).put(nameUpdateUrl, _body);
         //CAS-INFO-LOG
         LoggTracer.infoLogger(response, logConstant.NameAProjectUpdated, req);
        if (response.status == HttpStatusCode.OK) 
        req.session.project_name = name;
        const returnUrl = `/projects/create-or-choose?lotId=${lotId}&agreementLotName=${agreementLotName}`;
        res.redirect(returnUrl);

      }else{
        req.session['isEmptyProjectError'] = true;
        req.session['isErrorText'] = 'You must be 250 characters or fewer';
        res.redirect('/g-cloud/project-name');
      }
      
    } else {
      req.session['isEmptyProjectError'] = true;
      req.session['isErrorText'] = 'You must complete your project name';
      res.redirect('/g-cloud/project-name');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'G-Cloud 13 throws error - Tenders Api is causing problem',
      true,
    );
  }
};

 