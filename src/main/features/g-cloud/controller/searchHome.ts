import * as express from 'express'
import * as localContent from '../../../resources/content/g-cloud/gCloudSearchHome.json'
import { LoggTracer } from '../../../common/logtracer/tracer'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder'
import { GCloud_SearchAPI_Instance } from '../util/fetch/gCloudInstance'
import { GCloud_API_END_POINTS } from '../model/gCloudConstants'
import { Search_Highlight } from '../model/searchModel'


export const GET_SEARCH_HOME_GCLOUD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { lotId, agreementLotName } = req.session;

  const agreementId_session = req.session.agreement_id;
  let tokenValue = 'BearerToken';
  var searchResult_DataList = [] as Search_Highlight[];
  // let appendData: any =  {  SESSION_ID };
  try {

    // req.session.types = types;
    req.session.agreementLotName = agreementLotName;
    const agreementName = req.session.agreementName;
    const project_name = req.session.project_name;
    const releatedContent = req.session.releatedContent;
    res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid: lotId };

    //GET SERVICES LIST AND CATAGORIES OF G-CLOUDS
    var serviceData = await (await GCloud_SearchAPI_Instance.Instance(tokenValue).get(GCloud_API_END_POINTS.G_CLOUD_SEARCH_API))?.data;
    let serviceCategory = [];
    for (let i = 0; i < serviceData.documents.length; i++) {
      let search_HighlightObj = {} as Search_Highlight;
      search_HighlightObj.id=serviceData.documents[i].id;
      search_HighlightObj.frameworkName=serviceData.documents[i].frameworkName;
      search_HighlightObj.lot=serviceData.documents[i].lot;
      search_HighlightObj.lotName=serviceData.documents[i].lotName;
      search_HighlightObj.serviceBenefits=serviceData.documents[i].serviceBenefits;
      search_HighlightObj.serviceCategories=serviceData.documents[i].serviceCategories;
      search_HighlightObj.serviceDescription=serviceData.documents[i].serviceDescription;
      search_HighlightObj.serviceFeatures=serviceData.documents[i].serviceFeatures;
      search_HighlightObj.serviceName=serviceData.documents[i].serviceName;
      search_HighlightObj.supplierName=serviceData.documents[i].supplierName;
      searchResult_DataList.push(search_HighlightObj)
      var exists = serviceCategory.filter(x => x == serviceData.documents[i].lotName);
      if (exists == undefined || exists) {
        serviceCategory.push(serviceData.documents[i].lotName);
      }
    }
    
    serviceCategory = serviceCategory.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
    //serviceCategory=serviceCategory.filter(x=>)
    let appendData = { ...localContent, agreementName, ...releatedContent, serviceData, serviceCategory,searchResult_DataList };
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

export const GET_SERVICE_RESULT_GCLOUD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { lotId, agreementLotName } = req.session;
  //const { id,servicelot } = req.query;

  const agreementId_session = req.session.agreement_id;
  //let tokenValue = 'BearerToken';
  var searchResult_DataList = [] as Search_Highlight[];
  // let appendData: any =  {  SESSION_ID };
  try {

    // req.session.types = types;
    req.session.agreementLotName = agreementLotName;
    const agreementName = req.session.agreementName;
    const project_name = req.session.project_name;
    const releatedContent = req.session.releatedContent;
    res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid: lotId };

    //GET SERVICES LIST AND CATAGORIES OF G-CLOUDS
    //var serviceData = await (await GCloud_SearchAPI_Instance.Instance(tokenValue).get(GCloud_API_END_POINTS.G_CLOUD_SEARCH_API))?.data;
    
    let appendData = { ...localContent, agreementName, ...releatedContent,searchResult_DataList };
    //let dataObject = { ...localContent };
    res.render("searchResult", appendData);
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

