import * as express from 'express'
import * as localContent from '../../../resources/content/g-cloud/gCloudSearchHome.json'
import { LoggTracer } from '../../../common/logtracer/tracer'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder'
import { GCloudInstanceInstance } from '../util/fetch/gCloudInstance'


export const GET_SEARCH_HOME_GCLOUD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { lotId, agreementLotName } = req.session;

  const agreementId_session = req.session.agreement_id;
  let tokenValue = 'BearerToken';
  // let appendData: any =  {  SESSION_ID };
  try {

    // req.session.types = types;
    req.session.agreementLotName = agreementLotName;
    const agreementName = req.session.agreementName;
    const project_name = req.session.project_name;
    const releatedContent = req.session.releatedContent;
    res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid: lotId };

    //GET SERVICES LIST AND CATAGORIES OF G-CLOUDS
    let apiEndPoint = '/g-cloud-12/services/search';
    var serviceData = await (await GCloudInstanceInstance.Instance(tokenValue).get(apiEndPoint))?.data;
    let serviceCategory = [];
    for (let i = 0; i < serviceData.documents.length; i++) {
      var exists = serviceCategory.filter(x => x == serviceData.documents[i].lotName);
      if (exists == undefined || exists) {
        serviceCategory.push(serviceData.documents[i].lotName);
      }
    }
    serviceCategory = serviceCategory.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
    //serviceCategory=serviceCategory.filter(x=>)
    let appendData = { ...localContent, agreementName, ...releatedContent, serviceData, serviceCategory };
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


