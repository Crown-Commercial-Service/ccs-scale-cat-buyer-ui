import * as express from 'express';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import * as savedSearchsjson from '../../../resources/content/gcloud/savedSearchs.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import moment from 'moment-business-days';

export const GET_SAVED_SEARCHES = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  try {
    const releatedContent = req.session.releatedContent;
    const { isJaggaerError } = req.session;
   
    
    req.session['isJaggaerError'] = false;

       const baseURL=`/assessments`;
      let {data: assessments} = await TenderApi.Instance(SESSION_ID).get(baseURL);
      assessments = assessments.sort((a:any, b:any) => (a['assessment-id'] < b['assessment-id'] ? -1 : 1));
      const savedDetails = assessments?.filter((item:any) => item.assessmentName !== undefined && item['external-tool-id'] === '14' && item.status === "active");
      const exportedDetails = assessments?.filter((item:any) => item.assessmentName !== undefined && item['external-tool-id'] === '14' && item.status === "complete");


      
    const savedData = [];
    const exportedData:any = [];
   
    for (let item of savedDetails) {
        const baseURL=`/assessments/${item['assessment-id']}/gcloud`;
         let {data:assessmentDetails} = await TenderApi.Instance(SESSION_ID).get(baseURL);
         savedData.push({
          ass_id:item['assessment-id'], 
          name: item['assessmentName'],
          criteria: assessmentDetails.resultsSummary!=undefined?assessmentDetails.resultsSummary:'', 
          saved_date:assessmentDetails.lastUpdate!=undefined?`${moment(assessmentDetails.lastUpdate).format('dddd DD MMMM YYYY')} at ${new Date(assessmentDetails.lastUpdate).toLocaleTimeString('en-GB',
          { timeStyle: 'short', hour12: true, timeZone: 'Europe/London' })} BST`:'', 
          search_status:'statuss',
          searchKeys:assessmentDetails.dimensionRequirements
        });
    }


    for (let item of exportedDetails) {
        const baseURL=`/assessments/${item['assessment-id']}/gcloud`;
        let {data:assessmentDetails} = await TenderApi.Instance(SESSION_ID).get(baseURL);
        exportedData.push({
         ass_id:item['assessment-id'], 
         name: item['assessmentName'],
         criteria: assessmentDetails.resultsSummary!=undefined?assessmentDetails.resultsSummary:'', 
         exported_date:assessmentDetails.lastUpdate!=undefined?`${moment(assessmentDetails.lastUpdate).format('dddd DD MMMM YYYY')} at ${new Date(assessmentDetails.lastUpdate).toLocaleTimeString('en-GB',
         { timeStyle: 'short', hour12: true, timeZone: 'Europe/London' })} BST`:'', 
         search_status:'statuss',
         searchKeys:assessmentDetails.dimensionRequirements
       });
    }
    
    const appendData = {
      releatedContent: releatedContent,
      lotId: req.session.lotId,
      agreementLotName: req.session.agreementLotName,
      searchKeywords: req.session.searchKeywords,
      error: isJaggaerError,
      data: savedSearchsjson,
      savedData,
      exportedData
    };

    res.render('savedSearches', appendData);
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

export const DELETE_SAVED_SEARCHES = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  
  try {
    if(req.query.ass_id !==undefined){
     const baseURL=`/assessments/${req.query.ass_id}`;
     
      await TenderApi.Instance(SESSION_ID).delete(baseURL);
     
      res.redirect('/g-cloud/saved-searches');
    }else{
      req.session['isJaggaerError'] = true;
      res.redirect('/g-cloud/saved-searches');
    }
      
  } catch (error) {
   
    res.redirect('/g-cloud/saved-searches');
      LoggTracer.errorLogger( res, error, `${req.headers.host}${req.originalUrl}`, null,
        TokenDecoder.decoder(SESSION_ID), 'G-Cloud 13 throws error - Tenders Api is causing problem', true,
      );
  }
};
