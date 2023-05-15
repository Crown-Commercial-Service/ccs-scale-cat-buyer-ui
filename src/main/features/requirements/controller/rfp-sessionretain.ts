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
    const Oauth_check_endpoint: string = config.get('authenticationService.token-endpoint');
    //@ Create the authentication credetial to to allow the re-direct
    let auth_credentails: any = {
      refresh_token: req.session.refresh_token,
      client_id: process.env.AUTH_SERVER_CLIENT_ID,
      client_secret: process.env.AUTH_SERVER_CLIENT_SECRET,
      grant_type: config.get('authenticationService.refresh_token'),
    };
    auth_credentails = qs.stringify(auth_credentails);
    //@ Grant Authorization with the token to re-direct to the callback page

   
      const PostAuthCrendetails = await Oauth_Instance.Instance.post(Oauth_check_endpoint, auth_credentails);
      const data = PostAuthCrendetails?.data;
      const containedData = data;
      const { access_token, refresh_token } = containedData;
      req.session['access_token'] = access_token;
      req.session['refresh_token'] = refresh_token;
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

export const RFP_GET_CHECK_SESSION = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; 
  let expiryStatus = false;
   try {
   
    if (SESSION_ID !== undefined){
     const decoded: any = jwt.decode(req.session['access_token'], { complete: true });
     const expiryTimestamp = decoded?.payload?.exp;
     const today = new Date();
     const endDate = new Date(expiryTimestamp * 1000);
     const minutes = parseInt((Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60)) % 60);
     if(minutes == 0){
      expiryStatus =true;
     }
    	}
    res.json({ status: expiryStatus});
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
