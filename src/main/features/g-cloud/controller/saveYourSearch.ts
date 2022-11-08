import * as express from 'express';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { gCloudApi } from '../util/fetch/apiInstance';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import * as saveYourSearchData from '../../../resources/content/gcloud/saveYourSearch.json';
import { gCloudServiceQueryReplace } from '../util/filter/serviceQueryReplace';
import moment from 'moment-business-days';



async function getSearchResults(url: string,hostURL:any,result: any = []){
  const GCLOUD_SEARCH_API_TOKEN = process.env.GCLOUD_SEARCH_API_TOKEN;
  let hosts= hostURL;
  let JointURL: string = `g-cloud-13/services/search?${url}`; 
   var {data: services} = await gCloudApi.searchInstance(GCLOUD_SEARCH_API_TOKEN).get(JointURL);
  var NextPageUrl = '';
  if(services.links.next !== undefined){
     NextPageUrl = services?.links?.next.substring(services?.links?.next.indexOf('?') + 1);
  }
        const servicesList=services.documents;
        const TAStorage = [];
        for (let item = 0; item < servicesList.length; item++) {
          const resultObject = {
            "serviceName": servicesList[item].serviceName,
            "supplier": {
              "name": servicesList[item].supplierName
            },
            "serviceDescription": servicesList[item].serviceDescription,
            "serviceLink": `${hosts}/g-cloud/services?id=${servicesList[item].id}`
          };
          TAStorage.push(resultObject);
        }
      if (!result) {
          result = TAStorage;
      } else {
          result.push(TAStorage);
      }
      if (NextPageUrl) {
          result = await getSearchResults(NextPageUrl,hosts,result);
      }
      return result;
}

export const POST_SAVE_YOUR_SEARCH_RESULTS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  try {
          const { criteria,searchQuery } = req.body;
          req.session['searchQuery'] = '';
          req.session['searchQuery'] = searchQuery == undefined ?'':searchQuery;
                if(criteria !== undefined){
                  req.session.criteriaData=criteria;
                }else{
                  req.session.criteriaData='';
                }
              res.redirect('/g-cloud/save-your-search');
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

export const GET_SAVE_YOUR_SEARCH = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies;
    
    try {
       
      const releatedContent = req.session.releatedContent;
      const { isJaggaerError, isJaggaerErrorsearchname,criteriaData} = req.session;
      req.session['isJaggaerError'] = false;
      req.session['isJaggaerErrorsearchname'] = false;
      const baseURL=`/assessments`;
      let {data: assessments} = await TenderApi.Instance(SESSION_ID).get(baseURL);
      assessments = assessments.sort((a:any, b:any) => (a['assessment-id'] < b['assessment-id'] ? -1 : 1));
      const savedDetails = assessments?.filter((item:any) => item.assessmentName !== undefined && item.status === "active" && item['external-tool-id'] === '14');
       
              
      const appendData = {
        data: saveYourSearchData,
        searchResults:criteriaData,
        savedDetails:savedDetails,
        releatedContent: releatedContent,
        lotId:req.session.lotId,
        agreementLotName:req.session.agreementLotName,
        error:isJaggaerError,
        errorName:isJaggaerErrorsearchname,
        searchKeywords:req.session.searchKeywords,
        returnto: `/g-cloud/search${req.session.searchResultsUrl == undefined ?'':'?'+ req.session.searchResultsUrl}`
      };


      res.render('saveYourSearch', appendData);
        
    } catch (error) {
      
        LoggTracer.errorLogger( res, error, `${req.headers.host}${req.originalUrl}`, null,
          TokenDecoder.decoder(SESSION_ID), 'G-Cloud 13 throws error - Tenders Api is causing problem', true,
        );
    }
};

export const POST_SAVE_YOUR_SEARCH = async (req: express.Request, res: express.Response) => {
   const { SESSION_ID } = req.cookies;
  
   try {

      let {searchUrl,criteriaData}=req.session;
      const {search_name,savesearch,saveandcontinue,saveforlater}=req.body;
      let hostURL=`${req.protocol}://${req.headers.host}`;
      var lastUpdate =moment(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }),'DD/MM/YYYY hh:mm:ss',).format('YYYY-MM-DDTHH:mm:ss')+'Z';
      if(savesearch !== undefined){
        let sessionsearchUrl= searchUrl;
         searchUrl=await gCloudServiceQueryReplace(searchUrl, "filter_");
        if(savesearch=='new' && search_name !== ''){
          if(search_name.length <= 250){
          const assessmentsBaseURL=`/assessments`;
          let {data: assessments} = await TenderApi.Instance(SESSION_ID).get(assessmentsBaseURL);
          assessments = assessments.sort((a:any, b:any) => (a['assessment-id'] < b['assessment-id'] ? -1 : 1));
          
          const savedDetails = await assessments?.filter((item:any) => item.assessmentName !== undefined && item['external-tool-id'] === '14' && item.assessmentName.toLowerCase() == search_name.toLowerCase());
          // unique search name
          if(savedDetails.length===0){
            const results=await getSearchResults(sessionsearchUrl,hostURL);
            const allServicesList = Array.prototype.concat(...results);
            const _requestBody = {
              "assessmentName": search_name,
              "external-tool-id": "14",
              "status": "active",
              "dimensionRequirements": searchUrl,
              "resultsSummary":criteriaData,
              "lastUpdate":lastUpdate,
              "results": allServicesList
            };
            const baseURL='/assessments/gcloud';
            let response = await TenderApi.Instance(SESSION_ID).post(baseURL, _requestBody);
            if (response.status == 200) {
              req.session.savedassessmentID=response.data;
              req.session.searchUrl=false;
              if(saveandcontinue !==undefined){
                res.redirect('/g-cloud/export-results');
              }
              if(saveforlater !==undefined){
                res.redirect('/g-cloud/saved-searches');
              }
              
             } else {
                res.redirect('/g-cloud/save-your-search');
             }
          }else{
            req.session['isJaggaerErrorsearchname'] = 'This is an existing search name. Please enter a unique search name.';
            res.redirect('/g-cloud/save-your-search');
          }
        
        }else{
          req.session['isJaggaerErrorsearchname'] = 'You must be 250 characters or fewer';
          res.redirect('/g-cloud/save-your-search');
        }
          
        }else if(savesearch!=='new'){

          const baseURL=`/assessments/${savesearch}/gcloud`;
          let {data:assessment} = await TenderApi.Instance(SESSION_ID).get(baseURL);
          const results=await getSearchResults(sessionsearchUrl,hostURL);
          const allServicesList = Array.prototype.concat(...results);
          const _requestBody = {
            "assessmentName": assessment.assessmentName,
            "external-tool-id": "14",
            "status": "active",
            "dimensionRequirements": searchUrl,
            "resultsSummary":criteriaData,
            "lastUpdate":lastUpdate,
            "results": allServicesList
          };
          
          let response = await TenderApi.Instance(SESSION_ID).put(baseURL, _requestBody);
          if (response.status == 200) {
            req.session.savedassessmentID=savesearch;
           req.session.searchUrl=false;
           req.session.criteriaData=false;
            if(saveandcontinue !==undefined){
              res.redirect('/g-cloud/export-results');
            }
            if(saveforlater !==undefined){
              res.redirect('/g-cloud/saved-searches');
            }
           } else {
              res.redirect('/g-cloud/save-your-search');
           }
          
        }else{
          req.session['isJaggaerErrorsearchname'] = 'Please enter a search name';
          res.redirect('/g-cloud/save-your-search');
        }
  
      }else{
        req.session['isJaggaerError'] = true;
        res.redirect('/g-cloud/save-your-search');
      }

                 
  } catch (error) {
    
      LoggTracer.errorLogger( res, error, `${req.headers.host}${req.originalUrl}`, null,
        TokenDecoder.decoder(SESSION_ID), 'G-Cloud 13 throws error - Tenders Api is causing problem', true,
      );
  }
};