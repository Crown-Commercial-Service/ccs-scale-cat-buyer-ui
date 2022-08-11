import * as express from 'express'
import * as localContent from '../../../resources/content/g-cloud/gCloudSearchHome.json'
import { LoggTracer } from '../../../common/logtracer/tracer'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder'
import { GCloud_SearchAPI_Instance } from '../util/fetch/gCloudInstance'
import { GCloud_API_END_POINTS, TokenValue } from '../model/gCloudConstants'
import { Search_Highlight, ServiceModel } from '../model/searchModel'
import { gCloudHelper } from '../helpers/gCloudCommonHelper'


export const GET_SEARCH_HOME_GCLOUD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { lotId, agreementLotName } = req.session;

  const agreementId_session = req.session.agreement_id;
  var searchResult_DataList = [] as Search_Highlight[];
  // let appendData: any =  {  SESSION_ID };
  let tokenValue1 = 'BearerToken';
  try {

    // req.session.types = types;
    req.session.agreementLotName = agreementLotName;
    const agreementName = req.session.agreementName;
    const project_name = req.session.project_name;
    const releatedContent = req.session.releatedContent;
    res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid: lotId };

    //GET SERVICES LIST AND CATAGORIES OF G-CLOUDS
    let filterNameList =await gCloudHelper.getFiltersData(["cloud-support"]);
    var serviceData = await (await GCloud_SearchAPI_Instance.Instance(tokenValue1).get(GCloud_API_END_POINTS.G_CLOUD_SEARCH_API))?.data;
    let serviceCategory = [];
    for (let i = 0; i < serviceData.documents.length; i++) {
      let search_HighlightObj = {} as Search_Highlight;
      search_HighlightObj.id = serviceData.documents[i].id;
      search_HighlightObj.frameworkName = serviceData.documents[i].frameworkName;
      search_HighlightObj.lot = serviceData.documents[i].lot;
      search_HighlightObj.lotName = serviceData.documents[i].lotName;
      search_HighlightObj.serviceBenefits = serviceData.documents[i].serviceBenefits;
      search_HighlightObj.serviceCategories = serviceData.documents[i].serviceCategories;
      search_HighlightObj.serviceDescription = serviceData.documents[i].serviceDescription;
      search_HighlightObj.serviceFeatures = serviceData.documents[i].serviceFeatures;
      search_HighlightObj.serviceName = serviceData.documents[i].serviceName;
      search_HighlightObj.supplierName = serviceData.documents[i].supplierName;
      searchResult_DataList.push(search_HighlightObj)
      var exists = serviceCategory.filter(x => x == serviceData.documents[i].lotName);
      if (exists == undefined || exists) {
        serviceCategory.push(serviceData.documents[i].lotName);
      }
    }
    //REMVING UPLICATE DATA FROM LIST
    serviceCategory = serviceCategory.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
    // GET FILTERS LIST BASED ON LOT SELECTION "cloud-hosting", "cloud-software",
   
    let appendData = { filterNameList, ...localContent, agreementName, ...releatedContent, serviceCategory, searchResult_DataList };
    //let dataObject = { ...localContent };
    res.render("searchHome", appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'G-Cloud service issue',
      true,
    );
  }
  //
}

export const GET_SERVICE_RESULT_GCLOUD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { lotId, agreementLotName } = req.session;
  const { id } = req.query;

  const agreementId_session = req.session.agreement_id;
  //let tokenValue = 'BearerToken';
  var searchResult_DataList = [] as Search_Highlight[];
  var serviceModelDataObj = {} as ServiceModel;
  // let appendData: any =  {  SESSION_ID };
  try {

    // req.session.types = types;
    req.session.agreementLotName = agreementLotName;
    const agreementName = req.session.agreementName;
    const project_name = req.session.project_name;
    const releatedContent = req.session.releatedContent;
    res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid: lotId };

    //GET SERVICES LIST AND CATAGORIES OF G-CLOUDS
    var serviceData = await (await GCloud_SearchAPI_Instance.Instance(TokenValue.G_CLOUD_TOKEN).get(GCloud_API_END_POINTS.G_CLOUD_SEARCH_API_WITH_SERVICE_ID + id))?.data;
    if (serviceData != null) {
      serviceModelDataObj.dmagg_lot = serviceData._source.dmagg_lot;
      serviceModelDataObj.dmagg_serviceCategories = serviceData.services._source.dmagg_serviceCategories;
      serviceModelDataObj.dmfilter_educationPricing = serviceData.services._source.dmfilter_educationPricing;
      serviceModelDataObj.dmfilter_emailOrTicketingSupport = serviceData.services._source.dmfilter_emailOrTicketingSupport;
      serviceModelDataObj.dmfilter_governmentSecurityClearances = serviceData.services._source.dmfilter_governmentSecurityClearances;
      serviceModelDataObj.dmfilter_lot = serviceData.services._source.dmfilter_lot;
      serviceModelDataObj.dmfilter_phoneSupport = serviceData.services._source.dmfilter_phoneSupport;
      serviceModelDataObj.dmfilter_resellingType = serviceData.services._source.dmfilter_resellingType;
      serviceModelDataObj.dmfilter_serviceCategories = serviceData.services._source.dmfilter_serviceCategories;
      serviceModelDataObj.dmfilter_staffSecurityClearanceChecks = serviceData.services._source.dmfilter_staffSecurityClearanceChecks;
      serviceModelDataObj.dmfilter_webChatSupport = serviceData.services._source.dmfilter_webChatSupport;
      serviceModelDataObj.dmtext_frameworkName = serviceData.services._source.dmtext_frameworkName;
      serviceModelDataObj.dmtext_id = serviceData.services._source.dmtext_id;
      serviceModelDataObj.dmtext_lot = serviceData.services._source.dmtext_lot;
      serviceModelDataObj.dmtext_lotName = serviceData.services._source.dmtext_lotName;
      serviceModelDataObj.dmtext_serviceBenefits = serviceData.services._source.dmtext_serviceBenefits;
      serviceModelDataObj.dmtext_serviceCategories = serviceData.services._source.dmtext_serviceCategories;
      serviceModelDataObj.dmtext_serviceDescription = serviceData.services._source.dmtext_serviceDescription;
      serviceModelDataObj.dmtext_serviceFeatures = serviceData.services._source.dmtext_serviceFeatures;
      serviceModelDataObj.dmtext_serviceName = serviceData.services._source.dmtext_serviceName;
      serviceModelDataObj.dmtext_supplierName = serviceData.services._source.dmtext_supplierName;
      serviceModelDataObj.sortonly_serviceIdHash = serviceData.services._source.sortonly_serviceIdHash;
    }
    let appendData = { serviceModelDataObj, ...localContent, agreementName, ...releatedContent, searchResult_DataList };
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

