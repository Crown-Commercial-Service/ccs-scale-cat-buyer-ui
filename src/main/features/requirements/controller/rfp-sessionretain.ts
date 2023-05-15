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
import * as jwt from 'jsonwebtoken';
import config from 'config';
import qs from 'qs';
import { Oauth_Instance } from '../../../common/util/fetch/OauthService/OauthInstance';



/**
 *
 * @param req
 * @param res
 * @POSTController
 */

export const RFP_POST_RETAIN_SESSION = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; 

   try {
    res.json({ status: true});
    } catch (error) {
     LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      'Conclave refresh token flow error',
      true,
    );
  }  

};
