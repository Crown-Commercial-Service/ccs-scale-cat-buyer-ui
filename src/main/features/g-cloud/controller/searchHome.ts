import * as express from 'express'
import * as localContent from '../../../resources/content/g-cloud/gCloudSearchHome.json'
import { LoggTracer } from '../../../common/logtracer/tracer'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder'


export const GET_SEARCH_HOME_GCLOUD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const {lotId, agreementLotName} = req.session;

  const agreementId_session = req.session.agreement_id;
  
  //let appendData: any =  {  SESSION_ID };
  try {
    
   // req.session.types = types;
    req.session.agreementLotName = agreementLotName;
    const agreementName = req.session.agreementName;
    const project_name = req.session.project_name;
    const releatedContent = req.session.releatedContent;
    res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid:lotId };

    let appendData = { ...localContent, agreementName,...releatedContent };
    //let dataObject = { ...localContent };
    res.render("searchHome", appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DOS6',
      true,
    );
  }
  //
}


